import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { supabase } from '@/lib/supabase';

export async function POST(): Promise<Response> {
  const documentPath = process.env.DOCUMENT_PATH || '/Users/minhpham/personal/document';
  const scriptPath = path.join(documentPath, 'area/knowledge/stock/tool/sync_data_incremental_2026.py');
  const workingDir = path.join(documentPath, 'area/knowledge/stock/tool');
  const csvPath = path.join(documentPath, 'area/knowledge/stock/data/price-2026.csv');

  if (!fs.existsSync(scriptPath)) {
    return NextResponse.json({ error: `Sync script not found at ${scriptPath}` }, { status: 404 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
  }

  // 1. Query the database to find the last date we have recorded
  let cutoffDate = '2026-01-01';
  try {
    const { data: maxDateData, error: maxDateError } = await supabase
      .from('stock')
      .select('date')
      .order('date', { ascending: false })
      .limit(1);

    if (!maxDateError && maxDateData && maxDateData.length > 0) {
      cutoffDate = maxDateData[0].date.split('T')[0];
    }
  } catch (err) {
    console.error('Error fetching max date from database:', err);
  }

  const startTime = Date.now();
  const saveLog = async (status: string, recordsSynced: number, errorMessage: string | null = null) => {
    const duration = Date.now() - startTime;
    try {
      await supabase!
        .from('stock_sync_logs')
        .insert({
          status,
          records_synced: recordsSynced,
          error_message: errorMessage,
          run_duration_ms: duration,
          sync_date: new Date().toISOString().split('T')[0]
        });
    } catch (err) {
      console.error('Failed to save sync log:', err);
    }
  };

  console.log(`Syncing data: Last recorded date in DB is ${cutoffDate}`);

  // 2. Run the python script to fetch new records into the CSV file
  return new Promise<Response>((resolve) => {
    exec('python3 sync_data_incremental_2026.py', { cwd: workingDir }, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing sync script: ${error}`);
        await saveLog('failed', 0, error.message);
        return resolve(NextResponse.json({ 
          success: false, 
          error: error.message,
          stderr 
        }, { status: 500 }));
      }

      // 3. Read the CSV file and parse new rows >= cutoffDate
      try {
        if (!fs.existsSync(csvPath)) {
          await saveLog('success', 0, 'Python sync finished, but CSV file was not found.');
          return resolve(NextResponse.json({ 
            success: true,
            stdout,
            message: 'Python sync finished, but CSV file was not found.'
          }));
        }

        const csvContent = await fs.promises.readFile(csvPath, 'utf-8');
        const lines = csvContent.split('\n');
        const headers = lines[0].trim().split(',');
        const records: Record<string, string | number>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          const row: Record<string, string> = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx];
          });

          const dateOnly = row.date.split('T')[0];
          // We only want data strictly after or equal to the cutoffDate
          if (dateOnly >= cutoffDate) {
            records.push({
              date: row.date.includes('T') ? `${row.date}+00:00` : `${row.date}T00:00:00+00:00`,
              symbol: row.symbol,
              priceOpen: Number(row.priceOpen || 0),
              priceHigh: Number(row.priceHigh || 0),
              priceLow: Number(row.priceLow || 0),
              priceClose: Number(row.priceClose || 0),
              priceBasic: Number(row.priceBasic || 0),
              totalVolume: Number(row.totalVolume || 0),
              dealVolume: Number(row.dealVolume || 0),
              putthroughVolume: Number(row.putthroughVolume || 0),
              totalValue: Number(row.totalValue || 0),
              buyForeignQuantity: Number(row.buyForeignQuantity || 0),
              sellForeignQuantity: Number(row.sellForeignQuantity || 0),
              adjRatio: Number(row.adjRatio || 1),
              unit: Number(row.unit || 1000)
            });
          }
        }

        console.log(`Found ${records.length} records in CSV to sync to database.`);

        // 4. Upsert records to Supabase in chunks
        const chunkSize = 200;
        let syncedCount = 0;
        for (let i = 0; i < records.length; i += chunkSize) {
          const chunk = records.slice(i, i + chunkSize);
          const { error: upsertError } = await supabase!
            .from('stock')
            .upsert(chunk, { onConflict: 'symbol,date' });

          if (upsertError) {
            throw new Error(`Database upsert failed: ${upsertError.message}`);
          }
          syncedCount += chunk.length;
        }

        await saveLog('success', syncedCount);

        resolve(NextResponse.json({ 
          success: true, 
          stdout, 
          stderr,
          message: `Sync completed successfully. Synced ${syncedCount} new records to database.` 
        }));

      } catch (syncErr: unknown) {
        console.error('Error uploading CSV to Supabase:', syncErr);
        const errMsg = syncErr instanceof Error ? syncErr.message : String(syncErr);
        await saveLog('failed', 0, errMsg);
        resolve(NextResponse.json({ 
          success: false, 
          error: `Python sync succeeded, but database upload failed: ${errMsg}`,
          stdout,
          stderr
        }, { status: 500 }));
      }
    });
  });
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Watchlist symbols to sync
const SYMBOLS = ['HDG', 'TCH', 'MBS', 'SHS', 'HPG'];

export async function POST(): Promise<Response> {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
  }

  const startTime = Date.now();
  const token = process.env.FIREANT_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoyMDcyNDYzNjQ1LCJuYmYiOjE3NzI0NjM2NDUsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiI5OTJjNzhiNC1iM2VmLTQ1Y2EtYjQ1Ny1iYjBkZjliNTY3MzQiLCJhdXRoX3RpbWUiOjE3NzI0NjM2NDUsImlkcCI6Ikdvb2dsZSIsIm5hbWUiOiJtaW5ocGhhbTA1MjlAZ21haWwuY29tIiwic2VjdXJpdHlfc3RhbXAiOiIwMzY2MmFmYi1hMTg2LTQ5MDgtYWQ2YS0wZTI3OGJiZmQwZTYiLCJqdGkiOiIzN2EwNzM4ZWYxYzM4Y2VjZGM5N2JiMzIwMzcxZjJhOCIsImFtciI6WyJleHRlcm5hbCJdfQ.mtA4JxAqO-SCvw0KJ8Z8-9LkN2-eCdZKmZXjluAHTUs_B2_jEc2uVQPstmua81p3-KOQGG7nF_BOvgDaLmXkg4m42elE6h32Eljl7avHI8gCEw7j-UE5ME1-oPJNoDj2blGy9m-luAxf4nKbMUeD8uzZxcxU2rNyJN2TUvOA-yljqmlUHpP-cB_BRbSDfuAHhmqsVhn9kxY6dV9vnRjH24eJa8wy6kO0bSm2YXcudSsDG05drFlrAK7jpfuIVmquNe6NX6PiMuknIyokVB13qlInNWaPE2OuoGuchz0Y93oRrDva7qcPawjn7IsDEVJPA314o8pj-Bwsw8uvuEWF5g';

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

  const logs: string[] = [];
  logs.push(`Starting TypeScript stock data sync at ${new Date().toISOString()}`);

  try {
    const allRecords: Record<string, string | number>[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    for (const symbol of SYMBOLS) {
      logs.push(`Processing symbol: ${symbol}`);
      
      // Get the last date for this symbol in database
      let lastDateStr = '2026-01-01';
      const { data: maxDateData, error: maxDateError } = await supabase
        .from('stock')
        .select('date')
        .eq('symbol', symbol)
        .order('date', { ascending: false })
        .limit(1);

      if (!maxDateError && maxDateData && maxDateData.length > 0) {
        lastDateStr = maxDateData[0].date.split('T')[0];
      }

      // Start date is the day after the last date
      const lastDate = new Date(lastDateStr);
      const startDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
      const startDateStr = startDate.toISOString().split('T')[0];

      if (startDateStr > todayStr) {
        logs.push(`  ${symbol} is already up to date (last date: ${lastDateStr})`);
        continue;
      }

      logs.push(`  Fetching ${symbol} from ${startDateStr} to ${todayStr}...`);

      const url = `https://restv2.fireant.vn/symbols/${symbol}/historical-quotes?startDate=${startDateStr}&endDate=${todayStr}&offset=0&limit=10000`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch FireAnt quotes for ${symbol}: Status ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        logs.push(`  Fetched ${data.length} new records for ${symbol}`);
        
        for (const row of data) {
          allRecords.push({
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
      } else {
        logs.push(`  No new data returned for ${symbol}`);
      }
    }

    if (allRecords.length > 0) {
      logs.push(`Upserting ${allRecords.length} records to Supabase...`);
      const chunkSize = 200;
      let syncedCount = 0;
      for (let i = 0; i < allRecords.length; i += chunkSize) {
        const chunk = allRecords.slice(i, i + chunkSize);
        const { error: upsertError } = await supabase
          .from('stock')
          .upsert(chunk, { onConflict: 'symbol,date' });

        if (upsertError) {
          throw new Error(`Database upsert failed: ${upsertError.message}`);
        }
        syncedCount += chunk.length;
      }
      
      await saveLog('success', syncedCount);
      logs.push(`✅ Sync completed successfully. Synced ${syncedCount} records.`);
      
      return NextResponse.json({
        success: true,
        message: `Sync completed successfully. Synced ${syncedCount} records.`,
        stdout: logs.join('\n')
      });
    } else {
      await saveLog('success', 0);
      logs.push('✅ No new records to sync.');
      return NextResponse.json({
        success: true,
        message: 'No new records to sync.',
        stdout: logs.join('\n')
      });
    }

  } catch (error: unknown) {
    console.error('Error during stock sync:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    await saveLog('failed', 0, errMsg);
    logs.push(`❌ Sync failed: ${errMsg}`);
    
    return NextResponse.json({
      success: false,
      error: errMsg,
      stdout: logs.join('\n')
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.json();
  const { 
    rsi_entry = 40, 
    rsi_exit = 60, 
    stop_loss = 0.05,
    initial_capital = 500000000,
    start_date = '2021-03-01'
  } = body;

  // Create a hash of the parameters for caching
  const hash = crypto.createHash('md5').update(JSON.stringify(body)).digest('hex');
  const cacheDir = path.join(process.cwd(), '.cache', 'backtest');
  const cachePath = path.join(cacheDir, `${hash}.json`);

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // Check cache
  if (fs.existsSync(cachePath)) {
    console.log(`Serving cached backtest: ${hash}`);
    const cachedData = fs.readFileSync(cachePath, 'utf8');
    return NextResponse.json(JSON.parse(cachedData));
  }

  const documentPath = process.env.DOCUMENT_PATH || '/Users/aminhp93/personal/githubcoffee/document';
  const scriptPath = path.join(documentPath, 'area/knowledge/stock/tool/backtest_3_strategies_v2.py');
  const workingDir = path.join(documentPath, 'area/knowledge/stock/tool');
  const outDir = path.join(documentPath, 'workspace/tasks/[2026-04-18] backtest chien luoc');

  if (!fs.existsSync(scriptPath)) {
    return NextResponse.json({ error: 'Backtest script not found' }, { status: 404 });
  }

  // Set environment variables for the child process
  const env = {
    ...process.env,
    BOLLINGER_RSI_ENTRY: rsi_entry.toString(),
    BOLLINGER_RSI_EXIT: rsi_exit.toString(),
    BOLLINGER_STOP_LOSS: stop_loss.toString(),
    INITIAL_CAPITAL: initial_capital.toString(),
    START_DATE: start_date
  };

  return new Promise<Response>((resolve) => {
    exec('python3 backtest_3_strategies_v2.py', { cwd: workingDir, env }, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing backtest script: ${error}`);
        return resolve(NextResponse.json({ 
          success: false, 
          error: error.message,
          stderr 
        }, { status: 500 }));
      }

      // Read the results from the output directory
      const comparisonPath = path.join(outDir, 'strategy-comparison-v2.csv');
      let comparisonData = '';
      if (fs.existsSync(comparisonPath)) {
        comparisonData = fs.readFileSync(comparisonPath, 'utf8');
      }
      
      const result = { 
        success: true, 
        stdout, 
        stderr,
        comparison: comparisonData,
        message: 'Backtest completed successfully',
        cached: false
      };

      // Save to cache
      fs.writeFileSync(cachePath, JSON.stringify(result));
      
      resolve(NextResponse.json(result));
    });
  });
}

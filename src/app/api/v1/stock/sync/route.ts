import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request): Promise<Response> {
  const documentPath = process.env.DOCUMENT_PATH || '/Users/aminhp93/personal/githubcoffee/document';
  const scriptPath = path.join(documentPath, 'area/knowledge/stock/tool/weekend_sync.py');
  const workingDir = path.join(documentPath, 'area/knowledge/stock/tool');

  if (!fs.existsSync(scriptPath)) {
    return NextResponse.json({ error: 'Sync script not found' }, { status: 404 });
  }

  return new Promise((resolve) => {
    // We use python3 explicitly
    exec('python3 weekend_sync.py', { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing sync script: ${error}`);
        return resolve(NextResponse.json({ 
          success: false, 
          error: error.message,
          stderr 
        }, { status: 500 }));
      }
      
      resolve(NextResponse.json({ 
        success: true, 
        stdout, 
        stderr,
        message: 'Sync completed successfully' 
      }));
    });
  });
}

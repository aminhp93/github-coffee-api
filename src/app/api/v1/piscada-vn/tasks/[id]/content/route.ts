import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { fileName, content } = await request.json();
    const folderPath = path.join(PISCADA_TASKS_PATH, id);
    
    // fileName can now be "definition/task.md"
    const filePath = path.join(folderPath, fileName);

    if (!(await fs.pathExists(folderPath))) {
      return NextResponse.json({ error: 'Task folder not found' }, { status: 404 });
    }

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving task content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const folderPath = path.join(PISCADA_TASKS_PATH, id);

    if (!(await fs.pathExists(folderPath))) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files: any[] = [];
    const subfolders = ['definition', 'explore', 'execute', 'review'];

    // Scan subfolders
    for (const sub of subfolders) {
      const subPath = path.join(folderPath, sub);
      if (await fs.pathExists(subPath)) {
        const items = await fs.readdir(subPath);
        for (const item of items) {
          if (item.endsWith('.md')) {
            const content = await fs.readFile(path.join(subPath, item), 'utf-8');
            files.push({
              name: item,
              path: `${sub}/${item}`,
              folder: sub,
              content: content,
            });
          }
        }
      }
    }

    // Fallback for root files (migration period)
    const rootItems = await fs.readdir(folderPath);
    for (const item of rootItems) {
      if (item.endsWith('.md')) {
        const content = await fs.readFile(path.join(folderPath, item), 'utf-8');
        files.push({
          name: item,
          path: item,
          folder: 'root',
          content: content,
        });
      }
    }

    return NextResponse.json({ id, files });
  } catch (error: unknown) {
    console.error('Error fetching task detail:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

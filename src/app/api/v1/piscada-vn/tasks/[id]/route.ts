import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

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

    const rawTaskPath = path.join(folderPath, 'raw-task.md');
    const notePath = path.join(folderPath, 'note.md');

    let rawTask = null;
    let note = null;

    if (await fs.pathExists(rawTaskPath)) {
      const content = await fs.readFile(rawTaskPath, 'utf-8');
      const { data, content: body } = matter(content);
      rawTask = { metadata: data, content: body };
    }

    if (await fs.pathExists(notePath)) {
      const content = await fs.readFile(notePath, 'utf-8');
      note = { content };
    } else {
        // Try other common note names
        const files = await fs.readdir(folderPath);
        const noteFile = files.find(f => f.toLowerCase().includes('note') || f.toLowerCase().includes('explore'));
        if (noteFile) {
            const content = await fs.readFile(path.join(folderPath, noteFile), 'utf-8');
            note = { content, fileName: noteFile };
        }
    }

    return NextResponse.json({
      id,
      rawTask,
      note,
    });
  } catch (error: any) {
    console.error('Error fetching task detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, urgency, category, importance } = await request.json();
    const folderPath = path.join(PISCADA_TASKS_PATH, id);
    const rawTaskPath = path.join(folderPath, 'raw-task.md');

    if (!(await fs.pathExists(rawTaskPath))) {
      return NextResponse.json({ error: 'Task file not found' }, { status: 404 });
    }

    const content = await fs.readFile(rawTaskPath, 'utf-8');
    const { data, content: body } = matter(content);

    const updatedData = {
      ...data,
      ...(status && { status }),
      ...(urgency && { urgency }),
      ...(category && { category }),
      ...(importance && { importance }),
    };

    const newContent = matter.stringify(body, updatedData);
    await fs.writeFile(rawTaskPath, newContent);

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

export async function GET() {
  try {
    if (!PISCADA_TASKS_PATH || !(await fs.pathExists(PISCADA_TASKS_PATH))) {
      return NextResponse.json({ error: 'Piscada tasks path not found' }, { status: 404 });
    }

    const folders = await fs.readdir(PISCADA_TASKS_PATH);
    const tasks = [];

    for (const folder of folders) {
      if (folder.startsWith('.')) continue;

      const folderPath = path.join(PISCADA_TASKS_PATH, folder);
      const stats = await fs.stat(folderPath);
      if (!stats.isDirectory()) continue;

      // New structure check: definition/task.md or definition/.metadata.json
      const taskPath = path.join(folderPath, 'definition', 'task.md');
      const metadataPath = path.join(folderPath, 'definition', '.metadata.json');
      const oldRawPath = path.join(folderPath, 'raw-task.md'); // Backward compatibility
      
      let taskData: Record<string, any> = { title: folder, date: '' };
      let bodySnippet = '';

      if (await fs.pathExists(taskPath)) {
        const content = await fs.readFile(taskPath, 'utf-8');
        const { data, content: body } = matter(content);
        taskData = { ...taskData, ...data };
        bodySnippet = body.substring(0, 200);
      } else if (await fs.pathExists(metadataPath)) {
        const data = await fs.readJson(metadataPath);
        taskData = { ...taskData, ...data };
      } else if (await fs.pathExists(oldRawPath)) {
        const content = await fs.readFile(oldRawPath, 'utf-8');
        const { data, content: body } = matter(content);
        taskData = { ...taskData, ...data };
        bodySnippet = body.substring(0, 200);
      }

      tasks.push({
        id: folder,
        path: folder,
        ...taskData,
        bodySnippet: bodySnippet + (bodySnippet.length >= 200 ? '...' : ''),
      });
    }

    tasks.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Error fetching piscada tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, category, urgency, importance } = await request.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const sanitizedTitle = title.replace(/[\/\\]/g, '-').replace(/\.\./g, '');
    const date = new Date().toISOString().split('T')[0];
    const folderName = `[${date}] ${sanitizedTitle}`;
    const folderPath = path.resolve(PISCADA_TASKS_PATH, folderName);

    // Prevent Path Traversal
    if (!folderPath.startsWith(path.resolve(PISCADA_TASKS_PATH))) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    if (await fs.pathExists(folderPath)) {
      return NextResponse.json({ error: 'Task already exists' }, { status: 409 });
    }

    // Create 4 subfolders
    const subfolders = ['definition', 'explore', 'execute', 'review'];
    for (const sub of subfolders) {
      await fs.ensureDir(path.join(folderPath, sub));
    }

    const metadata = {
      title,
      date,
      status: "todo",
      urgency: urgency || 'non-urgent',
      importance: importance || 'non-important',
      category: category || 'general',
    };

    await fs.writeJson(path.join(folderPath, 'definition', '.metadata.json'), metadata, { spaces: 2 });
    await fs.writeFile(path.join(folderPath, 'definition', 'raw-task.md'), `# Draft Idea: ${title}\n\n`);

    return NextResponse.json({ success: true, path: folderName });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

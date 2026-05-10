import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

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

      const rawTaskPath = path.join(folderPath, 'raw-task.md');
      if (await fs.pathExists(rawTaskPath)) {
        const content = await fs.readFile(rawTaskPath, 'utf-8');
        const { data, content: body } = matter(content);
        
        tasks.push({
          id: folder,
          path: folder,
          ...data,
          bodySnippet: body.substring(0, 200) + (body.length > 200 ? '...' : ''),
        });
      }
    }

    // Sort by date descending
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

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const date = new Date().toISOString().split('T')[0];
    // Sanitize title for folder name
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    const folderName = `[${date}] ${title}`; // Keep original title in folder name but maybe sanitize?
    // Actually, user's folders have spaces. Let's keep spaces.
    
    const folderPath = path.join(PISCADA_TASKS_PATH, folderName);

    if (await fs.pathExists(folderPath)) {
      return NextResponse.json({ error: 'Task already exists' }, { status: 409 });
    }

    await fs.ensureDir(folderPath);

    const frontmatter = `---
title: "${title}"
date: "${date}"
status: "todo"
urgency: "${urgency || 'non-urgent'}"
importance: "${importance || 'non-important'}"
category: "${category || 'general'}"
---

`;

    const rawTaskPath = path.join(folderPath, 'raw-task.md');
    await fs.writeFile(rawTaskPath, frontmatter);

    return NextResponse.json({ success: true, path: folderName });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

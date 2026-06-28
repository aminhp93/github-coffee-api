import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();
    const folderPath = path.join(PISCADA_TASKS_PATH, id);

    const metadataPath = path.join(folderPath, 'definition', '.metadata.json');
    const rawPath = path.join(folderPath, 'definition', 'raw-task.md');
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let metadata: any = {};
    if (await fs.pathExists(metadataPath)) {
      metadata = await fs.readJson(metadataPath);
    }

    let targetFile = '';
    let content = '';

    switch (action) {
      case 'polish':
        targetFile = 'definition/task.md';
        const rawContent = await fs.readFile(rawPath, 'utf-8');
        content = matter.stringify(rawContent.trim(), {
          ...metadata,
          date: metadata.date || new Date().toISOString().split('T')[0],
        });
        await fs.writeFile(path.join(folderPath, targetFile), content);
        if (await fs.pathExists(metadataPath)) await fs.remove(metadataPath);
        break;

      case 'explore':
        targetFile = 'explore/explore.md';
        const taskContent = await fs.pathExists(path.join(folderPath, 'definition', 'task.md')) 
          ? await fs.readFile(path.join(folderPath, 'definition', 'task.md'), 'utf-8')
          : '';
        content = `# Explore: ${metadata.title}\n\nBased on definition:\n\n${taskContent}\n\n## Research Notes\n...`;
        await fs.writeFile(path.join(folderPath, targetFile), content);
        break;

      case 'execute':
        targetFile = 'execute/execute.md';
        const exploreContent = await fs.pathExists(path.join(folderPath, 'explore', 'explore.md'))
          ? await fs.readFile(path.join(folderPath, 'explore', 'explore.md'), 'utf-8')
          : '';
        content = `# Execution: ${metadata.title}\n\nImplementing based on exploration:\n\n${exploreContent}`;
        await fs.writeFile(path.join(folderPath, targetFile), content);
        break;

      case 'review':
        targetFile = 'review/review.md';
        const executeContent = await fs.pathExists(path.join(folderPath, 'execute', 'execute.md'))
          ? await fs.readFile(path.join(folderPath, 'execute', 'execute.md'), 'utf-8')
          : '';
        content = `# Review: ${metadata.title}\n\nResults evaluation:\n\n${executeContent}`;
        await fs.writeFile(path.join(folderPath, targetFile), content);
        break;
    }

    return NextResponse.json({ success: true, file: targetFile });
  } catch (error: unknown) {
    console.error('Error executing task action:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

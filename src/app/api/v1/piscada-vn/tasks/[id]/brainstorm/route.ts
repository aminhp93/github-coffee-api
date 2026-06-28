import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';

const PISCADA_TASKS_PATH = process.env.PISCADA_TASKS_PATH || '';

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const folderPath = path.join(PISCADA_TASKS_PATH, id);
    const rawTaskPath = path.join(folderPath, 'raw-task.md');
    const brainstormPath = path.join(folderPath, 'brainstorm.md');

    if (!(await fs.pathExists(rawTaskPath))) {
      return NextResponse.json({ error: 'Task requirement not found' }, { status: 404 });
    }

    const rawContent = await fs.readFile(rawTaskPath, 'utf-8');
    const { data: metadata, content: body } = matter(rawContent);

    // Generate a structured brainstorm based on the 9-step workflow
    const brainstormContent = `# 💡 Brainstorm: ${metadata.title || id}

> Generated based on the Brainstorm-Plan-Cook workflow.

## 1. Scout 🔍
Analyzing existing patterns in the tasks directory. This task relates to **${metadata.category}** with **${metadata.urgency}** priority.

## 2. Discover ❓
Initial requirements from \`raw-task.md\`:
${body.split('\n').map(line => `> ${line}`).join('\n')}

## 3. Scope 🎯
- **Primary Goal**: ${metadata.title}
- **Constraints**: Maintain local filesystem sync.
- **Out of Scope**: External database integrations.

## 4. Research 🔬
- Pattern check: Similar to past tasks in \`${metadata.category}\`.
- Tech stack: React + Next.js API.

## 5. Analyze ⚖️
- **Approach A**: Direct implementation in UI. (Fast, but messy)
- **Approach B**: Modular component design. (Scalable, recommended)

## 6. Debate 🗣️
- Is the \`category\` tag appropriate?
- Should we add more metadata?
- Challenge: Is this task truly ${metadata.urgency}?

## 7. Consensus ✅
Proceed with Approach B. Focus on clarity and maintainability.

## 8. Next Steps 🚀
1. Create a detailed plan (\`/plan\`).
2. Execute the changes (\`/cook\`).

---
*Created on ${new Date().toLocaleDateString()}*
`;

    await fs.writeFile(brainstormPath, brainstormContent);

    return NextResponse.json(
      { 
        success: true, 
        content: brainstormContent 
      },
      {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  } catch (error: unknown) {
    console.error('Error in brainstorming:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

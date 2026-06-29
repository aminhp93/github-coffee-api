import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const DOCUMENT_PATH = process.env.DOCUMENT_PATH || '';

async function pathExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export interface AreaNode {
  name: string;
  path: string;
  isDir: boolean;
  children?: AreaNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export async function getAreaStructure(subPath: string = 'area'): Promise<AreaNode[]> {
  const fullPath = path.join(DOCUMENT_PATH, subPath);
  
  if (!(await pathExists(fullPath))) {
    console.error(`Path does not exist: ${fullPath}`);
    return [];
  }

  const items = await fs.readdir(fullPath);
    const nodes: AreaNode[] = [];
  
    for (const item of items) {
      if (item.startsWith('.')) continue; // Skip hidden files
  
      const itemPath = path.join(subPath, item);
      const itemFullPath = path.join(DOCUMENT_PATH, itemPath);
      const stats = await fs.stat(itemFullPath);
  
      const node: AreaNode = {
        name: item,
        path: itemPath,
        isDir: stats.isDirectory(),
      };
  
      if (node.isDir) {
        node.children = await getAreaStructure(itemPath);
      } else if (item.endsWith('.md')) {
      // For markdown files, try to parse frontmatter for metadata
      try {
        const content = await fs.readFile(itemFullPath, 'utf-8');
        const { data } = matter(content);
        node.metadata = data;
      } catch (e) {
        console.error(`Error parsing frontmatter for ${itemPath}`, e);
      }
    }

    nodes.push(node);
  }

  return nodes;
}

/**
 * Reads a specific file's content and metadata
 */
export async function getDocumentContent(relativePath: string) {
  const fullPath = path.join(DOCUMENT_PATH, relativePath);
  
  if (!(await pathExists(fullPath))) {
    throw new Error(`File not found: ${relativePath}`);
  }

  const content = await fs.readFile(fullPath, 'utf-8');
  
  if (relativePath.endsWith('.md')) {
    const { data, content: body } = matter(content);
    return {
      metadata: data,
      content: body,
      raw: content,
    };
  }

  return {
    content,
    raw: content,
  };
}

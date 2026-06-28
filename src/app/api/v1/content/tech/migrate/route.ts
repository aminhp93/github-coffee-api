import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { supabase } from '@/lib/supabase';

const DOCUMENT_PATH = process.env.DOCUMENT_PATH || '/Users/aminhp93/personal/githubcoffee/document';

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
  }

  try {
    // 1. Read files from both data and public/docs paths to combine them
    // For now we will focus on the new public/docs/area/knowledge/tech path as requested
    // You can adjust this path if you want to migrate data/tech as well
    const techKnowledgePath = path.join(
      DOCUMENT_PATH,
      'area/knowledge/tech'
    );

    if (!fs.existsSync(techKnowledgePath)) {
       return NextResponse.json({ error: 'Tech knowledge path not found', path: techKnowledgePath }, { status: 404 });
    }

    const files = await fs.promises.readdir(techKnowledgePath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    const records = [];

    for (const filename of mdFiles) {
      const filePath = path.join(techKnowledgePath, filename);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      
      const { data, content } = matter(fileContent);
      const slug = filename.replace('.md', '');

      records.push({
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        content: content.trim(),
        type: data.type || 'Article',
        level: data.level || 'Fundamental',
        date: data.date || new Date().toISOString().split('T')[0],
      });
    }

    // Insert into Supabase (upsert based on slug)
    const { data: insertedData, error } = await supabase
      .from('tech_knowledge')
      .upsert(records, { onConflict: 'slug' })
      .select('slug, title');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      migratedCount: records.length,
      insertedData
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

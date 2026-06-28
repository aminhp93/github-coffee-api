import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
  }

  try {
    // Fetch all documents but omit the heavy 'content' column
    const { data, error } = await supabase
      .from('tech_knowledge')
      .select('id, slug, title, type, level, date, created_at, updated_at')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching tech knowledge list:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

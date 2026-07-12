import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { phase_id, content, done } = body;

    const { error } = await supabase
      .from('dropship_phase_contents')
      .upsert({
        product_id: id,
        phase_id,
        content,
        done,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'product_id,phase_id'
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error upserting phase content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

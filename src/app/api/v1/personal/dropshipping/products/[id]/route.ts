import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;

    // 1. Get product details
    const { data: product, error: pError } = await supabase
      .from('dropship_products')
      .select('*')
      .eq('id', id)
      .single();

    if (pError) throw pError;

    // 2. Get phase contents
    const { data: phases, error: phError } = await supabase
      .from('dropship_phase_contents')
      .select('*')
      .eq('product_id', id);

    if (phError) throw phError;

    return NextResponse.json({
      product,
      phases: phases || []
    });
  } catch (error: any) {
    console.error('Error fetching dropship product detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const updates = await request.json();

    const { error } = await supabase
      .from('dropship_products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating dropship product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

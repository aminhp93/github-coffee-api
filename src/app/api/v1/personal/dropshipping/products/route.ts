import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('dropship_products')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching dropship products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, cost_price, selling_price, project_folder, criteria } = body;

    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dropship_products')
      .insert([{
        name,
        cost_price: cost_price ?? 10,
        selling_price: selling_price ?? 39.99,
        project_folder: project_folder ?? '',
        criteria: criteria ?? {
          wowFactor: false,
          problemSolving: false,
          easyShip: false,
          highMargin: false,
          perceivedValue: false,
          notInStores: false,
          nicheMarket: false,
        }
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating dropship product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

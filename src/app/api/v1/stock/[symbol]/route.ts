import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const symbol = (await params).symbol.toUpperCase();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('symbol', symbol)
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mappedData = (data || []).map((row: Record<string, unknown>) => {
      const open = (row.priceOpen as number) ?? 0;
      const close = (row.priceClose as number) ?? 0;
      const basic = (row.priceBasic as number) ?? close;
      const change = (row.change as number) ?? (close - basic);
      const pct_change = (row.pct_change as number) ?? (basic !== 0 ? ((close - basic) / basic) * 100 : 0);
      
      return {
        id: row.id as string,
        symbol: row.symbol as string,
        date: row.date ? (row.date as string).split('T')[0] : '',
        open: Number(open),
        high: Number((row.priceHigh as number) ?? close),
        low: Number((row.priceLow as number) ?? close),
        close: Number(close),
        volume: Number((row.totalVolume as number) ?? (row.dealVolume as number) ?? 0),
        change: Number(change),
        pct_change: Number(pct_change)
      };
    });

    return NextResponse.json(mappedData);
  } catch (err: unknown) {
    console.error(`Error querying stock prices for ${symbol}:`, err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

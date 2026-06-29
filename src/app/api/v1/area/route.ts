import { NextResponse } from 'next/server';
import { getAreaStructure } from '@/lib/document-sync';

export async function GET() {
  try {
    const structure = await getAreaStructure();
    return NextResponse.json(structure);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

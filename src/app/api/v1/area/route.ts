import { NextResponse } from 'next/server';
import { getAreaStructure } from '@/lib/document-sync';

export async function GET() {
  try {
    const structure = await getAreaStructure();
    return NextResponse.json(structure);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

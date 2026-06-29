import { NextRequest, NextResponse } from 'next/server';
import { getDocumentContent } from '@/lib/document-sync';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    const data = await getDocumentContent(filePath);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 404 });
  }
}

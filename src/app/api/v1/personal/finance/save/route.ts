import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const body = await request.json();
  const { data } = body; // Array of FinanceRow

  const documentPath = process.env.DOCUMENT_PATH || '/Users/aminhp93/personal/githubcoffee/document';
  const filePath = path.join(documentPath, 'area/personal/finance/data/income-expenses.md');

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Update logic: This is a simple implementation that updates specific lines based on data
  // In a real app, we'd use a more robust markdown parser/stringifier.
  // We will look for lines like "*   **Chồng (Minh):** 58.0" and replace the value.

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.forEach((row: Record<string, any>) => {
    if (row.category === 'Salary / Income') {
      content = content.replace(/(\*\*Chồng \(Minh\):\*\* )\d+\.\d+/, `$1${row.minh.toFixed(1)}`);
      content = content.replace(/(\*\*Vợ \(Nhi\):\*\* )\d+\.\d+/, `$1${row.nhi.toFixed(1)}`);
    }
    // Add more replacement rules for other categories if needed
  });

  fs.writeFileSync(filePath, content);

  return NextResponse.json({ success: true, message: 'Finance data saved to workspace' });
}

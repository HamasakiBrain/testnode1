import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const workTypes = await prisma.workType.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(workTypes);
}

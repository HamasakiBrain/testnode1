import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  date: z.string().min(1, 'Дата обязательна'),
  workTypeId: z.number().int().positive('Выберите вид работ'),
  volume: z.number().positive('Объём должен быть положительным'),
  workerName: z.string().min(1, 'ФИО исполнителя обязательно'),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const sort = searchParams.get('sort') || 'desc';

  const where: any = {};
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const entries = await prisma.logEntry.findMany({
    where,
    include: { workType: true },
    orderBy: { date: sort as 'asc' | 'desc' },
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createSchema.parse({
      ...body,
      workTypeId: Number(body.workTypeId),
      volume: Number(body.volume),
    });

    const entry = await prisma.logEntry.create({
      data: {
        date: new Date(data.date),
        workTypeId: data.workTypeId,
        volume: data.volume,
        workerName: data.workerName,
      },
      include: { workType: true },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

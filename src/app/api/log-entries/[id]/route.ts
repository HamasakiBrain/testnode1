import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  date: z.string().min(1, 'Дата обязательна'),
  workTypeId: z.number().int().positive('Выберите вид работ'),
  volume: z.number().positive('Объём должен быть положительным'),
  workerName: z.string().min(1, 'ФИО исполнителя обязательно'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entry = await prisma.logEntry.findUnique({
    where: { id: Number(id) },
    include: { workType: true },
  });

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = updateSchema.parse({
      ...body,
      workTypeId: Number(body.workTypeId),
      volume: Number(body.volume),
    });

    const entry = await prisma.logEntry.update({
      where: { id: Number(id) },
      data: {
        date: new Date(data.date),
        workTypeId: data.workTypeId,
        volume: data.volume,
        workerName: data.workerName,
      },
      include: { workType: true },
    });

    return NextResponse.json(entry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.logEntry.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

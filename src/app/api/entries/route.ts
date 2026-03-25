import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { truckNumber, weight, personName, image1Url, image2Url } = body;

    if (!truckNumber || weight === undefined || !personName || !image1Url || !image2Url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entry = await prisma.entry.create({
      data: {
        truckNumber,
        weight: parseFloat(weight.toString()),
        personName,
        image1Url,
        image2Url,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: error.message || 'Error creating entry' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const truckNumber = searchParams.get('truckNumber');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    let where: any = {};

    if (truckNumber) {
      where.truckNumber = {
        contains: truckNumber,
        mode: 'insensitive',
      };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the entire end date
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.createdAt.lt = end;
      }
    }

    const [entries, total] = await Promise.all([
      prisma.entry.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.entry.count({ where }),
    ]);

    return NextResponse.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: error.message || 'Error fetching entries' }, { status: 500 });
  }
}

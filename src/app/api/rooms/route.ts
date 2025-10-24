import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Room from '@/models/Room';

export async function GET() {
  try {
    await dbConnect();
    const rooms = await Room.find({});
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, capacity, resources } = await request.json();

    const room = await Room.create({
      name,
      capacity: parseInt(capacity),
      resources,
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Create room error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

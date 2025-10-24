import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query = {};
    if (date) {
      query = { date };
    }

    const reservations = await Reservation.find(query)
      .populate('roomId', 'name')
      .populate('userId', 'name email')
      .sort({ date: 1, startTime: 1 });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { roomId, userId, date, startTime, endTime } = await request.json();

    // Check for conflicts
    const conflictingReservation = await Reservation.findOne({
      roomId,
      date,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } }
          ]
        }
      ]
    });

    if (conflictingReservation) {
      return NextResponse.json(
        { error: 'Horário já ocupado' },
        { status: 409 }
      );
    }

    const reservation = await Reservation.create({
      roomId,
      userId,
      date,
      startTime,
      endTime,
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('roomId', 'name')
      .populate('userId', 'name email');

    return NextResponse.json(populatedReservation, { status: 201 });
  } catch (error) {
    console.error('Create reservation error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

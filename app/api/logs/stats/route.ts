import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Log from '@/models/Log';

// GET - Statistiche sui log
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const app = searchParams.get('app');

    const filter: any = {};
    if (app) {
      filter.app = app;
    }

    // Conta per livello
    const statsByLevel = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
        },
      },
    ]);

    // Conta per app
    const statsByApp = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$app',
          count: { $sum: 1 },
          lastLog: { $max: '$timestamp' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Log recenti per giorno
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const logsByDay = await Log.aggregate([
      { $match: { ...filter, timestamp: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            level: '$level',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        byLevel: statsByLevel,
        byApp: statsByApp,
        byDay: logsByDay,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

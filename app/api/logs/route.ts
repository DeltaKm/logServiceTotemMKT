import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Log, { LogLevel } from '@/models/Log';

// GET - Recupera i log con filtri
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const app = searchParams.get('app');
    const level = searchParams.get('level');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Costruisci il filtro
    const filter: any = {};
    
    if (app) {
      filter.app = app;
    }
    
    if (level) {
      filter.level = level;
    }
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    // Recupera i log
    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Conta totale per paginazione
    const total = await Log.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Crea un nuovo log
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Validazione
    if (!body.app || !body.level || !body.message) {
      return NextResponse.json(
        { success: false, error: 'app, level e message sono obbligatori' },
        { status: 400 }
      );
      
    }

    const validLevels: LogLevel[] = ['success', 'error', 'warning', 'info'];
    if (!validLevels.includes(body.level)) {
      return NextResponse.json(
        { success: false, error: 'level deve essere uno tra: success, error, warning, info' },
        { status: 400 }
      );
    }

    // Crea il log
    const log = await Log.create({
      app: body.app,
      level: body.level,
      message: body.message,
      metadata: body.metadata,
      stackTrace: body.stackTrace,
      userId: body.userId,
      environment: body.environment || 'production',
      responsePayload: body.responsePayload,
    });

    return NextResponse.json(
      { success: true, data: log },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Log from '@/models/Log';

// GET - Recupera tutte le app uniche
export async function GET() {
  try {
    await dbConnect();

    const apps = await Log.distinct('app');

    return NextResponse.json({
      success: true,
      data: apps.sort(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

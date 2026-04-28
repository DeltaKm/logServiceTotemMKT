import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Log from '@/models/Log';
import { requireDashboardAuth } from '@/lib/apiAuth';

// GET - Recupera tutte le app uniche
export async function GET(request: NextRequest) {
  const authError = requireDashboardAuth(request);
  if (authError) {
    return authError;
  }

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

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireDashboardAuth } from '@/lib/apiAuth';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/api/logs' && request.method === 'POST') {
    return NextResponse.next();
  }

  const authError = requireDashboardAuth(request);
  if (authError) {
    return authError;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/logs', '/api/logs/apps', '/api/logs/stats'],
};

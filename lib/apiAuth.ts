import { NextRequest, NextResponse } from 'next/server';

function readApiKeyFromRequest(request: NextRequest): string | null {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey) {
    return headerKey;
  }

  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7).trim();
  }

  return null;
}

function parseBasicAuth(request: NextRequest): { username: string; password: string } | null {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Basic ')) {
    return null;
  }

  const base64Credentials = authorization.slice(6).trim();

  try {
    const decoded = atob(base64Credentials);
    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex < 0) {
      return null;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return { username, password };
  } catch {
    return null;
  }
}

function basicAuthChallenge(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Log Dashboard", charset="UTF-8"',
    },
  });
}

export function requireDashboardAuth(request: NextRequest): NextResponse | null {
  const expectedUser = process.env.DASHBOARD_USER;
  const expectedPassword = process.env.DASHBOARD_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse('Server configuration error: missing dashboard credentials', {
      status: 500,
    });
  }

  const credentials = parseBasicAuth(request);

  if (!credentials) {
    return basicAuthChallenge();
  }

  if (credentials.username !== expectedUser || credentials.password !== expectedPassword) {
    return basicAuthChallenge();
  }

  return null;
}

export function requireWriteApiKey(request: NextRequest): NextResponse | null {
  const expectedKey = process.env.xApiKey;

  if (!expectedKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'Server configuration error: missing xApiKey',
      },
      { status: 500 }
    );
  }

  const providedKey = readApiKeyFromRequest(request);

  if (!providedKey || providedKey !== expectedKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  return null;
}

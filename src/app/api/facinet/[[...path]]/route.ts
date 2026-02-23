import { NextRequest, NextResponse } from 'next/server';

const FACINET_API = 'https://facinet.vercel.app';

async function proxyRequest(req: NextRequest) {
  // Extract the path after /api/facinet/
  const url = new URL(req.url);
  const pathSegments = url.pathname.replace('/api/facinet', '');
  const targetUrl = `${FACINET_API}${pathSegments}${url.search}`;

  // Forward the request headers (skip host and origin)
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower !== 'host' && lower !== 'origin' && lower !== 'referer') {
      headers[key] = value;
    }
  });

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  // Forward body for non-GET requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text();
  }

  const response = await fetch(targetUrl, init);

  // Forward the response
  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    // Skip headers that Next.js manages
    const lower = key.toLowerCase();
    if (lower !== 'transfer-encoding' && lower !== 'content-encoding') {
      responseHeaders.set(key, value);
    }
  });

  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function OPTIONS() {
  // Handle CORS preflight
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

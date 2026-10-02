import { POST } from '../app/api/generate/route';
import { NextRequest } from 'next/server';
import { resetUsageStore } from '../lib/rateLimiter';

describe('/api/generate route', () => {
  beforeEach(() => {
    resetUsageStore();
  });

  test('returns 400 when category is missing or invalid', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({ category: 'InvalidCategory', businessName: 'Acme' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid or missing category');
  });

  test('returns 400 when businessName is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({ category: 'Marketing', businessName: '' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Business name is required');
  });

  test('returns 5 prompts and decrements daily limit for valid request', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({ category: 'Marketing', businessName: 'Acme Corp' }),
      headers: { 'x-forwarded-for': '192.168.1.1' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.prompts).toHaveLength(5);
    expect(data.remainingDailyPrompts).toBe(2);
  });

  test('enforces rate limit after 3 free generations', async () => {
    const ip = '10.0.0.1';

    for (let i = 0; i < 3; i++) {
      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ category: 'Coding', businessName: 'DevCo' }),
        headers: { 'x-forwarded-for': ip },
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    const blockedReq = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({ category: 'Coding', businessName: 'DevCo' }),
      headers: { 'x-forwarded-for': ip },
    });
    const blockedRes = await POST(blockedReq);
    const data = await blockedRes.json();

    expect(blockedRes.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Daily free limit reached');
  });
});

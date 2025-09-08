const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function handleResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    const errorMessage = isJson ? (await res.json()).message || 'Request failed' : await res.text();
    throw new Error(errorMessage || `HTTP ${res.status}`);
  }
  return isJson ? res.json() : res.text();
}

export async function signup(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
} 

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse(res);
}

export async function resendOtp(email: string) {
  const res = await fetch(`${API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function GET() {
  const data = [
  {
    "id": "1",
    "title": "Sample Top",
    "price": "\u20b9999",
    "image": "/sample.jpg"
  }
];
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' }});
}

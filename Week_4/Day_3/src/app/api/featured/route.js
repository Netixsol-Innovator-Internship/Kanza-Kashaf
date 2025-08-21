export async function GET() {
  const data = [
  {
    "id": "1",
    "title": "Sample Feature",
    "image": "/sample.jpg",
    "description": "desc",
    "price": "\u20b91999"
  }
];
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' }});
}

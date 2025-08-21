export async function GET() {
  const data = [
  {
    "id": "1",
    "title": "Sample Game",
    "image": "/sample.jpg",
    "availability": "Free Now"
  }
];
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' }});
}

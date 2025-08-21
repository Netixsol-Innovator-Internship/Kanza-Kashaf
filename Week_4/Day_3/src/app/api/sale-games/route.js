export async function GET() {
  const data = [
  {
    "id": "1",
    "title": "Sample Sale",
    "image": "/sample.jpg",
    "originalPrice": "\u20b9999",
    "salePrice": "\u20b9799",
    "discount": "-20%"
  }
];
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' }});
}

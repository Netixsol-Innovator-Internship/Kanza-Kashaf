export default function ImageCard({ item }) {
  const data = item?.data?.[0]
  const img = item?.links?.[0]?.href

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
      <img src={img} alt={data?.title} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h3 className="font-bold text-lg">{data?.title}</h3>
        <p className="text-sm text-gray-400">{data?.date_created?.slice(0, 10)}</p>
      </div>
    </div>
  )
}
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import ImageCard from "../components/ImageCard"
import { useGetApodQuery, useSearchImagesQuery } from "../store/nasaApi"
import { useState } from "react"

export default function Home() {
  const { data: apod, isLoading } = useGetApodQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const { data: searchResults } = useSearchImagesQuery(searchTerm, {
    skip: !searchTerm,
  })

  return (
    <div>
      <Navbar />

      {/* APOD Section */}
      <section className="text-center p-6">
        <h2 className="text-3xl font-bold mb-4">🌌 Astronomy Picture of the Day</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="max-w-3xl mx-auto">
            <img
              src={apod?.url}
              alt={apod?.title}
              className="rounded-xl shadow-lg mx-auto"
            />
            <h3 className="mt-4 text-xl font-semibold">{apod?.title}</h3>
            <p className="text-gray-400 mt-2">{apod?.explanation}</p>
          </div>
        )}
      </section>

      {/* Search Section */}
      <section className="p-6">
        <SearchBar onSearch={setSearchTerm} />
        {searchResults?.collection?.items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {searchResults.collection.items.map((item, idx) => (
              <ImageCard key={idx} item={item} />
            ))}
          </div>
        ) : (
          searchTerm && <p className="text-center">No results found 🚫</p>
        )}
      </section>
    </div>
  )
}
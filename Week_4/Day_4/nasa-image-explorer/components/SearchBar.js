import { useState } from "react"

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center my-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search space images..."
        className="px-4 py-2 w-80 rounded-l-lg border-none outline-none text-black"
      />
      <button
        type="submit"
        className="bg-yellow-400 px-4 py-2 rounded-r-lg font-semibold hover:bg-yellow-500"
      >
        Search
      </button>
    </form>
  )
}
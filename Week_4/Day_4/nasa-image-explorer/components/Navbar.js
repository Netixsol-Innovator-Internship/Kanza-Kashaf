export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-yellow-400">NASA Explorer</h1>
      <a
        href="https://api.nasa.gov/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white"
      >
        API Docs
      </a>
    </nav>
  )
}
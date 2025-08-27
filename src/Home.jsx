import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center px-4 py-10 sm:py-20">
      <div className="w-full max-w-2xl text-center space-y-6 sm:space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Welcome to <span className="text-indigo-600">Translate & Correct</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600">
          Choose a service to get started
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Link
            to="/translate"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 text-sm sm:text-base"
          >
            Translate
          </Link>
          <Link
            to="/correction"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
          >
            Correction
          </Link>
          <Link
            to="/wordlist"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-purple-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
          >
            Word List
          </Link>
        </div>
      </div>
    </div>
  )
}

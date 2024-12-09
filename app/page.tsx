import Link from "next/link";
import { Plus, Play, Edit } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 text-center max-w-lg w-full space-y-8 transform transition-all hover:scale-105 duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Quiz Master
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          Test your knowledge and challenge yourself!
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/quiz/add"
            className="group flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Add</span>
          </Link>

          <Link
            href="/quiz/start"
            className="group flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Start</span>
          </Link>

          <Link
            href="/quiz/edit"
            className="group flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Edit className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

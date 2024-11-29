import React from 'react';
import { Menu, Search, PlayCircle } from 'lucide-react';
import { categories } from './data/categories';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-600" />
              <h1 className="ml-4 text-xl font-bold text-gray-900">Blockchain Tutorials</h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Learn Blockchain Development</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Comprehensive tutorials on multiple blockchain platforms including Ethereum, Polygon, Hyperledger, and more.
          </p>
          <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Start Learning
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <PlayCircle className="h-8 w-8 text-indigo-600" />
                <h4 className="text-xl font-semibold ml-3">{category.name}</h4>
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <span className="text-sm text-gray-500">{category.tutorialCount} tutorials</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tutorials */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Tutorials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* We'll add featured tutorials here in the next step */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
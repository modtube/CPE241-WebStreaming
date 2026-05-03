import PageContainer from '../../components/common/PageContainer';

export default function Movies() {
  return (
    <PageContainer>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Movie Catalog</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your movie collection</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Add New Movie
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Movie Cards - Placeholder */}
            {[1, 2, 3, 4, 5, 6].map((movie) => (
              <div key={movie} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Movie Title {movie}</h3>
                <p className="text-sm text-gray-600 mb-2">Genre • Year</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Rating: 4.5</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

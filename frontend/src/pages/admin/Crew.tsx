import PageContainer from '../../components/common/PageContainer';

export default function Crew() {
  return (
    <PageContainer>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Crew Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage crew members and their roles</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Add Crew Member
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Crew Member Cards */}
            {[
              { name: 'John Director', role: 'Director', movies: 12 },
              { name: 'Sarah Producer', role: 'Producer', movies: 8 },
              { name: 'Mike Editor', role: 'Editor', movies: 15 },
              { name: 'Anna Writer', role: 'Writer', movies: 6 },
              { name: 'Tom Cinematographer', role: 'Cinematographer', movies: 10 },
              { name: 'Lisa Sound', role: 'Sound Designer', movies: 9 }
            ].map((crew, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {crew.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{crew.name}</h3>
                    <p className="text-xs text-gray-600">{crew.role}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{crew.movies} movies</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Profile
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

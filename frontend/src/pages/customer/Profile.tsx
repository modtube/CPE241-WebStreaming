export default function Profile() {
  return (
    <div className="min-h-screen w-full bg-white rounded-3xl shadow-2xl p-6">
      <header className="mb-6">
        <h1 className="m-0 text-3xl text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600 leading-relaxed">Manage your account</p>
      </header>

      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h2>
        <p className="text-gray-600">View and edit your profile information.</p>
      </div>
    </div>
  );
}

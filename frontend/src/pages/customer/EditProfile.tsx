import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="-mt-6 -mr-6 -mb-6 ml-[232px] min-h-[calc(100vh+48px)] bg-black text-white">
      
      <div className="p-8 max-w-3xl pt-14"> 
        <h2 className="font-display text-2xl font-bold mb-1">Edit Profile</h2>
        <p className="text-gray-400 text-sm mb-8">Manage your account settings</p>

        {/* Profile Header (Skeleton) */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-[#141414] rounded-2xl border border-[#1e1e1e]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-2 border-[#A3526D] flex items-center justify-center">
              {/*รอใส่รูป*/}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#A3526D] flex items-center justify-center border-2 border-[#141414] hover:bg-[#7a3d52] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            </button>
          </div>
          <div className="space-y-3 flex-1">
            <div className="h-6 w-40 bg-[#1a1a1a] rounded animate-pulse"></div>
            <div className="h-4 w-56 bg-[#1a1a1a] rounded animate-pulse"></div>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/*Form Field*/}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-2">Must be unique across all users</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              disabled 
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white opacity-50 cursor-not-allowed" 
            />
            <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
          </div>
          
          <div>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Change Password
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Country</label>
            <select className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none appearance-none">
              <option value="" disabled selected>Select your country</option>
              {/*รอใส่ข้อมูลจาก Database*/}
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-8 py-3 text-sm font-semibold transition-colors">Save Changes</button>
            <button className="border border-[#2a2a2a] text-gray-400 hover:text-white rounded-lg px-8 py-3 text-sm font-semibold transition-colors">Cancel</button>
          </div>

          <div className="pt-6">
             <button 
               onClick={() => navigate('/login')}
               className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg px-8 py-3 text-sm font-semibold transition-colors w-full sm:w-auto"
             >
               Log out
             </button>
          </div>
        </div>
      </div>

      {/* Pop-up Modal: Change Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button 
                onClick={() => setIsPasswordModalOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password" 
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password" 
                  className="w-full bg-[#141414] border border-[#A3526D] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none transition-colors" 
                />
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg py-3 text-sm font-semibold transition-colors">
                Change
              </button>
              <button 
                onClick={() => setIsPasswordModalOpen(false)} 
                className="flex-1 border border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg py-3 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
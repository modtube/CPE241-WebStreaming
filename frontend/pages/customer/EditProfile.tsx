import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api,
  getCurrentUserId,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  type SessionUser,
} from "../../lib/api";

interface Country {
  country_code: string;
  country_name: string;
}

interface UserDetail {
  user_id: string;
  username: string;
  email: string;
  img_path: string | null;
  register_date: string;
  user_status: string;
  user_role: string;
  country_code: string | null;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // form state
  const [usernameInput, setUsernameInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  // password modal
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    Promise.all([
      api.get<{ user: UserDetail }>(`/api/me/${userId}`),
      api.get<{ data: Country[] }>("/api/countries"),
    ])
      .then(([profile, countriesRes]) => {
        setUser(profile.user);
        setUsernameInput(profile.user.username);
        setCountryInput(profile.user.country_code ?? "");
        setCountries(countriesRes.data);
      })
      .catch((err) => {
        setMsg({ type: "err", text: err.message ?? "โหลดข้อมูลไม่สำเร็จ" });
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setMsg(null);
    try {
      const result = await api.put<{ user: UserDetail }>(`/api/me/${userId}`, {
        username: usernameInput,
        country_code: countryInput || null,
      });
      setUser(result.user);
      // sync session
      const session = getCurrentUser();
      if (session) {
        setCurrentUser({ ...session, username: result.user.username, country_code: result.user.country_code } as SessionUser);
      }
      setMsg({ type: "ok", text: "บันทึกข้อมูลเรียบร้อย" });
    } catch (err) {
      const m = err instanceof Error ? err.message : "บันทึกไม่สำเร็จ";
      setMsg({ type: "err", text: m });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userId) return;
    setPwMsg(null);

    if (newPw !== confirmPw) {
      setPwMsg("รหัสผ่านใหม่และยืนยันไม่ตรงกัน");
      return;
    }
    if (newPw.length < 6) {
      setPwMsg("รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      await api.put(`/api/auth/${userId}/password`, {
        current_password: currentPw,
        new_password: newPw,
      });
      setIsPwModalOpen(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setMsg({ type: "ok", text: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (err) {
      const m = err instanceof Error ? err.message : "เปลี่ยนรหัสผ่านไม่สำเร็จ";
      setPwMsg(m);
    }
  };

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="-mt-6 -mr-6 -mb-6 min-h-[calc(100vh+48px)] bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="-mt-6 -mr-6 -mb-6 min-h-[calc(100vh+48px)] bg-black text-white flex items-center justify-center">
        <p className="text-red-400">ไม่พบข้อมูล user</p>
      </div>
    );
  }

  return (
    <div className="-mt-6 -mr-6 -mb-6 min-h-[calc(100vh+48px)] bg-black text-white">
      <div className="p-8 max-w-3xl pt-14">
        <h2 className="font-display text-2xl font-bold mb-1">Edit Profile</h2>
        <p className="text-gray-400 text-sm mb-8">Manage your account settings</p>

        {msg && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm ${
              msg.type === "ok"
                ? "bg-green-900/40 border border-green-700 text-green-200"
                : "bg-red-900/40 border border-red-700 text-red-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-[#141414] rounded-2xl border border-[#1e1e1e]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-2 border-[#A3526D] flex items-center justify-center text-2xl font-bold text-[#A3526D]">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              ID: {user.user_id} · Joined{" "}
              {new Date(user.register_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">Must be unique across all users</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
          </div>

          <div>
            <button
              onClick={() => setIsPwModalOpen(true)}
              className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Change Password
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Country
            </label>
            <select
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none appearance-none"
            >
              <option value="">— No country —</option>
              {countries.map((c) => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name} ({c.country_code})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-8 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setUsernameInput(user.username);
                setCountryInput(user.country_code ?? "");
                setMsg(null);
              }}
              className="border border-[#2a2a2a] text-gray-400 hover:text-white rounded-lg px-8 py-3 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="pt-6">
            <button
              onClick={handleLogout}
              className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg px-8 py-3 text-sm font-semibold transition-colors w-full sm:w-auto"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPwModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Change Password</h3>
              <button
                onClick={() => setIsPwModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {pwMsg && (
              <div className="mb-4 p-2 rounded bg-red-900/40 border border-red-700 text-red-200 text-sm">
                {pwMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full bg-[#141414] border border-[#A3526D] rounded-lg px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg py-3 text-sm font-semibold"
              >
                Change
              </button>
              <button
                onClick={() => setIsPwModalOpen(false)}
                className="flex-1 border border-[#2a2a2a] text-gray-400 hover:text-white rounded-lg py-3 text-sm font-semibold"
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

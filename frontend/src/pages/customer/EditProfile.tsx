import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";

interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  img_path: string;
  country_code: string;
}

interface Country {
  country_code: string;
  country_name: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // 🟢 Status แจ้งเตือนข้างปุ่ม Save Changes
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({
    type: null,
    msg: "",
  });

  // 🟢 Status แจ้งเตือนข้างปุ่ม Change Password (ใน Modal)
  const [passStatus, setPassStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({
    type: null,
    msg: "",
  });

  const [user, setUser] = useState<UserProfile>({
    user_id: "",
    username: "",
    email: "",
    img_path: "",
    country_code: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const [profileRes, countryRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/countries"),
        ]);
        const profileJson = await profileRes.json();
        const countryJson = await countryRes.json();

        if (profileJson.success) {
          setUser({
            user_id: profileJson.data.user_id,
            username: profileJson.data.username || "",
            email: profileJson.data.email || "",
            img_path: profileJson.data.img_path || "",
            country_code: profileJson.data.country_code || "",
          });
        }
        if (countryJson.data) setCountries(countryJson.data);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, userId, token]);

  // ฟังก์ชันบันทึกโปรไฟล์
  const handleSaveChanges = async () => {
    if (!user.username.trim()) {
      setSaveStatus({ type: "error", msg: "Username is required" });
      return;
    }
    setIsSaving(true);
    setSaveStatus({ type: null, msg: "" });

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/profile/${user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: user.username,
            img_path: user.img_path,
            country_code: user.country_code,
          }),
        },
      );
      const result = await response.json();
      if (response.ok) {
        setSaveStatus({ type: "success", msg: "Changes saved!" });
        localStorage.setItem("username", user.username);
        setTimeout(() => setSaveStatus({ type: null, msg: "" }), 3000);
      } else {
        setSaveStatus({ type: "error", msg: result.message || "Save failed" });
      }
    } catch (error) {
      setSaveStatus({ type: "error", msg: "Connection error" });
    } finally {
      setIsSaving(false);
    }
  };

  // 🟢 ฟังก์ชันเปลี่ยนรหัสผ่าน (Triple Check + Status Text)
  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPassStatus({ type: "error", msg: "Fill all fields" });
      return;
    }
    setPassStatus({ type: null, msg: "" });
    setIsChangingPass(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/profile/${user.user_id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: passwords.current,
            new_password: passwords.new,
            confirm_password: passwords.confirm,
          }),
        },
      );
      const result = await response.json();
      if (response.ok) {
        setPassStatus({ type: "success", msg: "Password changed!" });
        setPasswords({ current: "", new: "", confirm: "" });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPassStatus({ type: null, msg: "" });
        }, 2000);
      } else {
        setPassStatus({ type: "error", msg: result.message || "Failed" });
      }
    } catch (error) {
      setPassStatus({ type: "error", msg: "Error" });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="-mt-6 -mr-6 -mb-6 min-h-[calc(100vh+48px)] bg-black text-white p-8">
      <div className="max-w-3xl pt-14 mx-auto md:mx-0">
        <h2 className="font-display text-2xl font-bold mb-1">Edit Profile</h2>
        <p className="text-gray-400 text-sm mb-8">
          Manage your account settings
        </p>

        <div className="space-y-6">
          {/* Image Path */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Profile Image Path
            </label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-[#A3526D] bg-[#1a1a1a] flex-shrink-0">
                <img
                  src={user.img_path}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")
                  }
                />
              </div>
              <input
                type="text"
                value={user.img_path}
                onChange={(e) => setUser({ ...user, img_path: e.target.value })}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none"
            />
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
          </div>

          <button
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPassStatus({ type: null, msg: "" });
            }}
            className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-6 py-2.5 text-sm font-semibold"
          >
            Change Password
          </button>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Country
            </label>
            <select
              value={user.country_code}
              onChange={(e) =>
                setUser({ ...user, country_code: e.target.value })
              }
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:border-[#A3526D] outline-none appearance-none"
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((c) => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-8 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {saveStatus.msg && (
              <span
                className={`text-xs font-bold animate-in fade-in duration-300 ${saveStatus.type === "success" ? "text-green-500" : "text-red-500"}`}
              >
                {saveStatus.type === "success" ? "✓ " : "✕ "}
                {saveStatus.msg}
              </span>
            )}
            <button
              onClick={() => navigate(-1)}
              className="border border-[#2a2a2a] text-gray-400 hover:text-white rounded-lg px-8 py-3 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="bg-[#1a1a1a] border border-red-900/30 text-red-400 hover:text-white hover:bg-red-900/40 rounded-lg px-8 py-3 text-sm font-semibold w-full sm:w-auto"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 Password Modal with Status Text */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-7 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                placeholder="Current Password"
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none focus:border-[#A3526D]"
              />
              <input
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                placeholder="New Password"
                className="w-full bg-[#141414] border border-[#A3526D] rounded-lg px-4 py-3 text-white outline-none"
              />
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                placeholder="Confirm New Password"
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white outline-none"
              />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleChangePassword}
                disabled={isChangingPass}
                className="bg-[#A3526D] hover:bg-[#7a3d52] text-white rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {isChangingPass ? "Changing..." : "Change"}
              </button>

              {/* 🟢 ข้อความแจ้งเตือนข้างปุ่ม Change */}
              {passStatus.msg && (
                <span
                  className={`text-xs font-bold animate-in fade-in duration-300 ${passStatus.type === "success" ? "text-green-500" : "text-red-500"}`}
                >
                  {passStatus.type === "success" ? "✓ " : "✕ "}
                  {passStatus.msg}
                </span>
              )}

              <button
                onClick={() => setIsPasswordModalOpen(false)}
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

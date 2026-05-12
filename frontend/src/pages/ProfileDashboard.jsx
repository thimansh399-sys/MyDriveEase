import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function ProfileDashboard() {
  const { user: authUser, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUserRaw = localStorage.getItem("user");
    let storedUser = null;

    try {
      storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
    } catch {
      storedUser = null;
    }

    // Prefer context user (better for role-based app)
    const source = authUser || storedUser;

    if (!source) {
      setForm({ name: "", email: "", phone: "" });
      return;
    }

    setForm({
      name: source.name || "",
      email: source.email || "",
      phone: source.phone || "",
    });
  }, [authUser]);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const storedUserRaw = localStorage.getItem("user");
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      const userId = authUser?._id || authUser?.id || storedUser?.id || storedUser?._id;
      if (!userId) throw new Error("User id not found");

      const res = await api.put(`/auth/update-profile/${userId}`, form);

      localStorage.setItem("user", JSON.stringify(res.data));
      updateUser?.(res.data);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a1019]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 inline-block px-6 py-3 rounded-3xl shadow-lg">
            User Profile
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="bg-[#0b1220]/95 border border-[#1f2937] rounded-[35px] shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* LEFT */}
            <div className="p-10 border-b md:border-b-0 md:border-r border-[#1f2937] bg-gradient-to-b from-[#0b1220] to-[#0a1019]">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-44 h-44 rounded-full bg-green-100 border-[6px] border-white shadow-xl overflow-hidden">
                    <img
                      src={"/images/user.png"}
                      alt="profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-[#071426] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
                    📷
                  </div>
                </div>

                <h2 className="text-4xl font-bold mt-8 text-white">
                  {form.name || "Your Name"}
                </h2>

                <div className="mt-4 bg-green-500/10 text-green-300 px-6 py-2 rounded-full font-semibold border border-green-400/20">
                  ✔ Verified Member
                </div>

                <p className="text-gray-400 mt-4 text-lg">Member since Apr 2024</p>
              </div>

              <div className="mt-10 bg-green-500/10 border border-green-400/20 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 font-bold text-lg">Account Status</p>
                    <p className="text-gray-300/80 mt-1">Verified Account</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl">
                    ✓
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-8">
                <div className="bg-[#0b1220] border border-[#1f2937] rounded-2xl p-6 shadow-sm text-center">
                  <h3 className="text-gray-400 font-medium">Total Trips</h3>
                  <p className="text-3xl font-extrabold text-white mt-2">0</p>
                </div>
                <div className="bg-[#0b1220] border border-[#1f2937] rounded-2xl p-6 shadow-sm text-center">
                  <h3 className="text-gray-400 font-medium">Rating</h3>
                  <p className="text-3xl font-extrabold text-white mt-2">0.0</p>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full border-2 border-green-500 text-green-300 hover:bg-green-500/10 hover:text-green-200 font-bold py-4 rounded-2xl transition-all duration-300">
                  View My Trips →
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-10 bg-[#0a1019]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Personal Information</h2>
                  <p className="text-gray-400 mt-1">Update your personal details and contact information</p>
                </div>
              </div>

              {error ? (
                <div className="mb-6 bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm font-bold">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="mb-6 bg-green-500/15 border border-green-500/30 text-green-200 px-4 py-3 rounded-xl text-sm font-bold">
                  Profile updated successfully
                </div>
              ) : null}

              <div className="space-y-8">
                {/* NAME */}
                <div>
                  <label className="block text-green-300 font-bold mb-3 text-lg">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#0b1220] text-white border-2 border-[#1f2937] focus:border-green-400 outline-none rounded-2xl px-6 py-5 text-lg transition placeholder:text-gray-400"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-green-300 font-bold mb-3 text-lg">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-[#0b1220] text-white border-2 border-[#1f2937] focus:border-green-400 outline-none rounded-2xl px-6 py-5 text-lg transition placeholder:text-gray-400"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-green-300 font-bold mb-3 text-lg">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full bg-[#0b1220] text-white border-2 border-[#1f2937] focus:border-green-400 outline-none rounded-2xl px-6 py-5 text-lg transition placeholder:text-gray-400"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 bg-green-500/10 text-green-300 px-4 py-2 rounded-full text-sm font-bold border border-green-400/20">
                      Verified
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-400 text-black text-xl font-bold py-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <div className="border-t border-[#1f2937] pt-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Edit OTP / Password</h3>
                    <p className="text-gray-400 mt-2">Change your one-time password for extra security</p>
                  </div>
                  <button className="text-3xl text-gray-400 hover:text-green-400 transition">→</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {[
            {
              icon: "🛡️",
              title: "Secure Account",
              desc: "Your data is encrypted and secure",
            },
            {
              icon: "🔒",
              title: "Privacy Protected",
              desc: "We never share your information",
            },
            {
              icon: "🎧",
              title: "24/7 Support",
              desc: "We're here to help anytime",
            },
            {
              icon: "⭐",
              title: "Trusted Service",
              desc: "Trusted by thousands of users",
            },
          ].map((f) => (
            <div key={f.title} className="bg-[#0b1220]/95 border border-[#1f2937] rounded-3xl p-6 shadow-lg">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-xl text-white">{f.title}</h3>
              <p className="text-gray-400 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-[#071426] text-white mt-16 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400">© 2025 DriveEase. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-green-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


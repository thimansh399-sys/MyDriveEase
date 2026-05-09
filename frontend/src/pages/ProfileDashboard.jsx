import { useEffect, useState } from "react";
import api from "../utils/api";

export default function ProfilePage() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        phone: storedUser.phone || "",
        email: storedUser.email || "",
      });
    }
  }, []);

  // ✅ Save Profile
  const handleSave = async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user"));

      const res = await api.put(
        `/auth/update-profile/${storedUser.id}`,
        user
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Profile updated successfully");

    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* Header */}
      <div className="text-center pt-14 pb-10 px-4">
        <h1 className="text-5xl font-extrabold text-[#071426]">
          User Profile
        </h1>

        <p className="text-gray-500 text-lg mt-4">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto px-6 pb-20">

        <div className="bg-white rounded-[35px] shadow-2xl overflow-hidden grid md:grid-cols-2 border border-gray-100">

          {/* LEFT SIDE */}
          <div className="p-10 border-r border-gray-100 bg-gradient-to-b from-white to-[#f9fffb]">

            <div className="flex flex-col items-center text-center">

              {/* Profile Image */}
              <div className="relative">

                <div className="w-44 h-44 rounded-full bg-green-100 border-[6px] border-white shadow-xl overflow-hidden">
                  <img
                    src="/images/user.png"
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button className="absolute bottom-2 right-2 bg-[#071426] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
                  📷
                </button>

              </div>

              <h2 className="text-4xl font-bold mt-8 text-[#071426]">
                {user.name}
              </h2>

              <div className="mt-4 bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                ✔ Verified Member
              </div>

              <p className="text-gray-500 mt-4 text-lg">
                Member since Apr 2024
              </p>

            </div>

            {/* Account Status */}
            <div className="mt-10 bg-green-50 border border-green-200 rounded-3xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-green-700 font-bold text-lg">
                    Account Status
                  </p>

                  <p className="text-gray-600 mt-1">
                    Verified Account
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl">
                  ✓
                </div>

              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5 mt-8">

              <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
                <h3 className="text-gray-500 font-medium">
                  Total Trips
                </h3>

                <p className="text-3xl font-extrabold text-[#071426] mt-2">
                  0
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
                <h3 className="text-gray-500 font-medium">
                  Rating
                </h3>

                <p className="text-3xl font-extrabold text-[#071426] mt-2">
                  0.0
                </p>
              </div>

            </div>

            <button className="w-full mt-8 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-bold py-4 rounded-2xl transition-all duration-300">
              View My Trips →
            </button>

          </div>

          {/* RIGHT SIDE */}
          <div className="p-10 bg-white">

            <div className="flex items-center gap-4 mb-10">

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
                👤
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#071426]">
                  Personal Information
                </h2>

                <p className="text-gray-500 mt-1">
                  Update your personal details and contact information
                </p>
              </div>

            </div>

            {/* FORM */}
            <div className="space-y-8">

              {/* NAME */}
              <div>

                <label className="block text-[#071426] font-bold mb-3 text-lg">
                  Full Name
                </label>

                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                  className="w-full bg-white text-black border-2 border-gray-200 focus:border-green-500 outline-none rounded-2xl px-6 py-5 text-lg transition placeholder:text-gray-400"
                />

              </div>

              {/* PHONE */}
              <div>

                <label className="block text-[#071426] font-bold mb-3 text-lg">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                  className="w-full bg-white text-black border-2 border-gray-200 focus:border-green-500 outline-none rounded-2xl px-6 py-5 text-lg transition placeholder:text-gray-400"
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="block text-[#071426] font-bold mb-3 text-lg">
                  Email Address
                </label>

                <div className="relative">

                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="w-full bg-white text-black border-2 border-gray-200 focus:border-green-500 outline-none rounded-2xl px-6 py-5 text-lg transition placeholder:text-gray-400"
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                    Verified
                  </span>

                </div>

              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              {/* PASSWORD */}
              <div className="border-t pt-8 flex items-center justify-between">

                <div>
                  <h3 className="text-2xl font-bold text-[#071426]">
                    Edit OTP / Password
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Change your one-time password for extra security
                  </p>
                </div>

                <button className="text-3xl text-gray-400 hover:text-green-500 transition">
                  →
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-10">

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🛡️</div>

            <h3 className="font-bold text-xl text-[#071426]">
              Secure Account
            </h3>

            <p className="text-gray-500 mt-2">
              Your data is encrypted and secure
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🔒</div>

            <h3 className="font-bold text-xl text-[#071426]">
              Privacy Protected
            </h3>

            <p className="text-gray-500 mt-2">
              We never share your information
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🎧</div>

            <h3 className="font-bold text-xl text-[#071426]">
              24/7 Support
            </h3>

            <p className="text-gray-500 mt-2">
              We're here to help anytime
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">⭐</div>

            <h3 className="font-bold text-xl text-[#071426]">
              Trusted Service
            </h3>

            <p className="text-gray-500 mt-2">
              Trusted by thousands of users
            </p>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-[#071426] text-white mt-20 py-8 px-10 flex flex-col md:flex-row items-center justify-between">

        <p className="text-gray-400">
          © 2025 DriveEase. All rights reserved.
        </p>

        <div className="flex items-center gap-8 mt-4 md:mt-0">

          <a href="#" className="hover:text-green-400 transition">
            Terms of Service
          </a>

          <a href="#" className="hover:text-green-400 transition">
            Privacy Policy
          </a>

          <a href="#" className="hover:text-green-400 transition">
            Help Center
          </a>

        </div>

      </footer>

    </div>
  );
}
import { useState, useEffect } from "react";
import {
  Camera,
  ShieldCheck,
  Star,
  Crown,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function UserProfile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone: user.phone,
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.put("/users/me", form);

      updateUser(res.data);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* TOP HEADING */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-[#00ff8815] border border-[#00ff8840] px-6 py-3 rounded-full text-[#00ff88] font-semibold mb-5">
            <Crown size={20} />
            Premium Member Profile
          </div>

          <h1 className="text-6xl font-black tracking-tight">
            My <span className="text-[#00ff88]">Profile</span>
          </h1>

          <p className="text-gray-400 mt-5 text-lg">
            Manage your DriveEase account with premium controls
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-[#071427] to-[#020817] border border-[#00ff8830] rounded-[32px] p-8 shadow-[0_0_60px_rgba(0,255,136,0.08)] sticky top-10">
              {/* PROFILE IMAGE */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00ff88] blur-3xl opacity-20 rounded-full"></div>

                  <img
                    src={form.avatar || "/default-avatar.png"}
                    alt="profile"
                    className="relative w-52 h-52 rounded-full border-4 border-[#00ff88] object-cover shadow-2xl"
                    onError={(e) =>
                      (e.target.src = "/default-avatar.png")
                    }
                  />

                  <button className="absolute bottom-3 right-3 bg-[#00ff88] text-black p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300">
                    <Camera size={22} />
                  </button>
                </div>

                {/* NAME */}
                <h2 className="text-4xl font-bold mt-8 text-center">
                  {form.name || "DriveEase User"}
                </h2>

                {/* VERIFIED */}
                <div className="mt-4 flex items-center gap-2 bg-[#00ff8815] border border-[#00ff8840] px-5 py-2 rounded-full">
                  <ShieldCheck
                    className="text-[#00ff88]"
                    size={18}
                  />

                  <span className="text-[#00ff88] font-semibold">
                    Verified Premium Member
                  </span>
                </div>

                <p className="text-gray-400 mt-4">
                  Member since April 2024
                </p>
              </div>

              {/* STATS */}
              <div className="mt-10 space-y-5">
                <div className="bg-[#0b1727] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#7c3aed] p-3 rounded-xl">
                      <Star size={18} />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">
                        User Rating
                      </p>

                      <h4 className="font-bold text-lg">
                        4.9 / 5
                      </h4>
                    </div>
                  </div>

                  <span className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                </div>

                <div className="bg-[#0b1727] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0284c7] p-3 rounded-xl">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">
                        Location
                      </p>

                      <h4 className="font-bold">
                        Madhya Pradesh
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b1727] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#16a34a] p-3 rounded-xl">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">
                        Account Status
                      </p>

                      <h4 className="font-bold text-[#00ff88]">
                        Fully Verified
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUPPORT */}
              <button className="mt-8 w-full bg-[#00ff88] text-black py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg">
                Contact Premium Support
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-8">
            <div className="bg-gradient-to-br from-[#071427] to-[#020817] border border-[#00ff8830] rounded-[32px] p-10 shadow-[0_0_60px_rgba(0,255,136,0.08)]">
              {/* TITLE */}
              <div className="flex items-center gap-5 mb-10">
                <div className="bg-[#00ff8815] border border-[#00ff8840] p-5 rounded-2xl text-[#00ff88]">
                  <Crown size={30} />
                </div>

                <div>
                  <h2 className="text-4xl font-black">
                    Personal Information
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Update and manage your premium account
                    details
                  </p>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                {/* AVATAR URL */}
                <div className="mb-7">
                  <label className="block text-[#00ff88] mb-3 font-semibold">
                    Avatar Image URL
                  </label>

                  <input
                    type="url"
                    name="avatar"
                    value={form.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-[#0b1727] border border-[#1e293b] rounded-2xl px-6 py-5 text-white outline-none focus:border-[#00ff88] transition-all"
                  />
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  {/* NAME */}
                  <div>
                    <label className="block text-[#00ff88] mb-3 font-semibold">
                      Full Name
                    </label>

                    <div className="relative">
                      <UserInputIcon />

                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0b1727] border border-[#1e293b] rounded-2xl pl-14 pr-6 py-5 text-white outline-none focus:border-[#00ff88]"
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-[#00ff88] mb-3 font-semibold">
                      Phone Number
                    </label>

                    <div className="relative">
                      <PhoneIcon />

                      <input
                        name="phone"
                        value={form.phone}
                        disabled
                        className="w-full bg-[#0b1727] border border-[#1e293b] rounded-2xl pl-14 pr-6 py-5 text-gray-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-[#00ff88] mb-3 font-semibold">
                      Email Address
                    </label>

                    <div className="relative">
                      <MailIcon />

                      <input
                        value={user?.email || "user@gmail.com"}
                        disabled
                        className="w-full bg-[#0b1727] border border-[#1e293b] rounded-2xl pl-14 pr-6 py-5 text-gray-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* LOCATION */}
                  <div>
                    <label className="block text-[#00ff88] mb-3 font-semibold">
                      Location
                    </label>

                    <div className="relative">
                      <LocationIcon />

                      <input
                        defaultValue="Bhopal, Madhya Pradesh"
                        className="w-full bg-[#0b1727] border border-[#1e293b] rounded-2xl pl-14 pr-6 py-5 text-white outline-none focus:border-[#00ff88]"
                      />
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col md:flex-row gap-5 mt-12">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#00ff88] text-black py-5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
                  >
                    {loading
                      ? "Saving Changes..."
                      : "Save Premium Changes"}
                  </button>

                  <button
                    type="button"
                    className="flex-1 border border-[#1e293b] py-5 rounded-2xl font-bold hover:bg-[#0b1727] transition-all"
                  >
                    Reset Information
                  </button>
                </div>

                {/* SUCCESS */}
                {success && (
                  <div className="mt-8 bg-[#00ff8815] border border-[#00ff8840] text-[#00ff88] text-center py-4 rounded-2xl font-bold">
                    ✔ Profile Updated Successfully
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ICONS */

function UserInputIcon() {
  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00ff88]">
      <Crown size={20} />
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00ff88]">
      <Phone size={20} />
    </div>
  );
}

function MailIcon() {
  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00ff88]">
      <Mail size={20} />
    </div>
  );
}

function LocationIcon() {
  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00ff88]">
      <MapPin size={20} />
    </div>
  );
}
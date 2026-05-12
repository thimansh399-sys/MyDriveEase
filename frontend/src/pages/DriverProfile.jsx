import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function DriverProfile() {

  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({

    name: '',
    phone: '',
    avatar: '',

    aadhaarNumber: '',
    drivingLicenseNumber: '',

    experience: '',
    city: '',
    area: '',

  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState('');


  useEffect(() => {

    if (user) {

      setForm({

        name: user.name || '',

        phone: user.phone || '',

        avatar: user.avatar || '',

        aadhaarNumber:
          user.aadhaarNumber || '',

        drivingLicenseNumber:
          user.drivingLicenseNumber || '',

        experience:
          user.experience || '',

        city:
          user.city || '',

        area:
          user.area || '',

      });

    }

  }, [user]);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    try {

      const res = await api.put(
        '/drivers/me',
        {

          name: form.name,

          avatar: form.avatar,

          aadhaarNumber:
            form.aadhaarNumber,

          drivingLicenseNumber:
            form.drivingLicenseNumber,

          experience:
            form.experience,

          city:
            form.city,

          area:
            form.area,

        }
      );

      updateUser(res.data);

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

      }, 3000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Profile update failed'
      );

    }

    setLoading(false);

  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#052e16] px-4 py-10 text-white">

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="max-w-2xl mx-auto bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >

        {/* HEADER */}

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">

          <div className="relative w-28 h-28 mx-auto">

            <img
              src={
                form.avatar ||
                '/default-avatar.png'
              }
              alt="Driver"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.src =
                  '/default-avatar.png';
              }}
            />

          </div>

          <h1 className="text-3xl font-black mt-4 text-black">
            Driver Profile
          </h1>

          <p className="text-black font-semibold mt-1">
            Manage your professional details
          </p>

        </div>


        {/* BODY */}

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-5"
        >

          {error && (

            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-sm font-bold">

              {error}

            </div>

          )}

          {success && (

            <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-xl text-sm font-bold">

              Profile Updated Successfully

            </div>

          )}


          {/* AVATAR */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Profile Image URL

            </label>

            <input
              type="url"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* NAME */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Full Name

            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Driver name"
              required
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* PHONE */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Phone Number

            </label>

            <input
              type="text"
              value={form.phone}
              disabled
              className="w-full px-4 py-3 rounded-2xl bg-[#111827] border border-gray-700 text-gray-400 cursor-not-allowed"
            />

          </div>


          {/* AADHAAR */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Aadhaar Number

            </label>

            <input
              type="text"
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* DRIVING LICENSE */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Driving License Number

            </label>

            <input
              type="text"
              name="drivingLicenseNumber"
              value={form.drivingLicenseNumber}
              onChange={handleChange}
              placeholder="DL-XXXXXXXXXXXX"
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* EXPERIENCE */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Driving Experience

            </label>

            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="5 Years"
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* CITY */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              City

            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Delhi"
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* AREA */}

          <div>

            <label className="block text-green-400 font-bold mb-2">

              Area

            </label>

            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Connaught Place"
              className="w-full px-4 py-3 rounded-2xl bg-[#1f2937] border border-gray-700 focus:border-green-400 outline-none"
            />

          </div>


          {/* BUTTON */}

          <motion.button

            whileTap={{
              scale: 0.97,
            }}

            type="submit"

            disabled={loading}

            className="w-full bg-green-500 hover:bg-green-400 transition-all text-black py-4 rounded-2xl font-black text-lg shadow-xl disabled:opacity-50"
          >

            {loading
              ? 'Saving Changes...'
              : 'Save Profile'}

          </motion.button>

        </form>

      </motion.div>

    </div>
  );
}
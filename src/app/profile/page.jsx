"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import Header from "../components/navbar";
import Footer from "../components/footer";

export default function Dashboard() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // console.log("TOKEN IN LOCAL STORAGE:", localStorage.getItem("token"));

    axios
      .get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData((prev) => ({
          ...prev,
          ...res.data.user,
          password: "", // always reset password field
        }));
      })

      .catch((err) => {
        console.error(err);
        router.push("/login");
      });
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("/api/profile", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData((prev) => ({
        ...prev,
        ...response.data.user,
        password: "",
      }));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex bg-gray-100">
        <Toaster />

        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">Dashboard</h2>
          <Link href="/orders">
            <button className="block text-left w-full text-gray-700 hover:text-blue-500">
              Order History
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-5 block text-left w-full text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <div className="flex items-center justify-between bg-white px-8 py-4 shadow-md">
            <h1 className="text-xl font-semibold text-gray-700">
              Hi, {userData.name || "User"} 👋
            </h1>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-400"
            />
          </div>

          {/* Main Body */}
          <div className="flex-1 p-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Profile Details
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border rounded-lg px-4 py-2"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border rounded-lg px-4 py-2"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border rounded-lg px-4 py-2"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Password */}
                {isEditing && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded-lg px-4 py-2"
                      placeholder="Leave blank to keep old password"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-8 text-right">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

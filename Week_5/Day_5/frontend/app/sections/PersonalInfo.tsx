"use client";
import { useState } from "react";
import { useUpdateProfileMutation } from "../../store/api";

const PersonalInfo = ({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [updateProfile] = useUpdateProfileMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      let avatarUrl = form.avatar;

      if (avatarFile) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const body = new FormData();
        body.append("file", avatarFile);
        body.append("upload_preset", uploadPreset);

        const res = await fetch(uploadUrl, { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed");

        avatarUrl = data.secure_url;
      }

      const updatedData = { ...form, avatar: avatarUrl };
      const updatedUser = await updateProfile(updatedData).unwrap();

      setForm(updatedUser);
      setIsEditing(false);
      setAvatarFile(null);
    } catch (err: any) {
      alert("Error updating profile: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            ✏️ Edit
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              💾 Save
            </button>
            <button
              onClick={() => {
                setForm(user);
                setIsEditing(false);
                setAvatarFile(null);
              }}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Card with Avatar + Info */}
      <div className="flex items-start gap-6 bg-gray-50 p-6 rounded-lg shadow">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden text-3xl font-bold text-indigo-600">
          {form.avatar ? (
            <img
              src={form.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            form.fullName?.[0] || "U"
          )}
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "fullName" },
            { label: "Email", key: "email" },
            { label: "Mobile Number", key: "phone" },
            { label: "Nationality", key: "nationality" },
            { label: "ID Type", key: "idType" },
            { label: "ID Number", key: "idNumber" },
          ].map((field) => (
            <div key={field.key} className="flex items-center gap-2">
              <span className="text-gray-600 w-[150px]">{field.label}:</span>
              {!isEditing ? (
                <span className="font-medium">{form[field.key]}</span>
              ) : (
                <input
                  type="text"
                  name={field.key}
                  value={form[field.key] || ""}
                  onChange={handleChange}
                  className="flex-1 border rounded-lg px-3 py-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Input */}
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-gray-500"
        />
      )}
    </div>
  );
};

export default PersonalInfo;

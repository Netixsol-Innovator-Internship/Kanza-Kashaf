"use client";
import { useState } from "react";
import { useUpdateProfileMutation } from "../../store/api";

export default function PersonalInfo({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    ...user,
    addresses: user.addresses && user.addresses.length > 0 ? user.addresses : [
      { addressLine1: "", city: "", province: "", country: "", postalCode: "" },
    ],
  });
  const [updateProfile] = useUpdateProfileMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedAddresses = [...(form.addresses || [])];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value,
    };
    setForm({ ...form, addresses: updatedAddresses });
  };

  const handleAddAddress = () => {
    setForm({
      ...form,
      addresses: [
        ...(form.addresses || []),
        { addressLine1: "", city: "", province: "", country: "", postalCode: "" },
      ],
    });
  };

  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = [...(form.addresses || [])];
    updatedAddresses.splice(index, 1);
    setForm({
      ...form,
      addresses: updatedAddresses.length > 0
        ? updatedAddresses
        : [{ addressLine1: "", city: "", province: "", country: "", postalCode: "" }],
    });
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: form.name,
        addresses: form.addresses,
      };
      const updatedUser = await updateProfile(updatedData).unwrap();
      setForm({ ...form, ...updatedUser });
      setIsEditing(false);
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
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            Edit
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setForm(user);
                setIsEditing(false);
              }}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="bg-gray-50 p-6 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 w-[110px]">Name:</span>
          {!isEditing ? (
            <span className="font-medium">{form.name}</span>
          ) : (
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 w-[110px]">Email:</span>
          <span className="font-medium">{form.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 w-[110px]">Loyalty Points:</span>
          <span className="font-medium">{form.loyaltyPoints}</span>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Addresses</h3>
        {(form.addresses || []).map((addr: any, idx: number) => (
          <div
            key={idx}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4"
          >
            {["addressLine1", "city", "province", "country", "postalCode"].map(
              (field) => (
                <div key={field} className="flex items-center gap-2">
                  <span className="text-gray-600 w-[110px] capitalize">
                    {field}:
                  </span>
                  {!isEditing ? (
                    <span className="font-medium">{addr[field]}</span>
                  ) : (
                    <input
                      type="text"
                      value={addr[field] || ""}
                      onChange={(e) =>
                        handleAddressChange(idx, field, e.target.value)
                      }
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                  )}
                </div>
              )
            )}

            {isEditing && (
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => handleRemoveAddress(idx)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑 Remove
                </button>
              </div>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={handleAddAddress}
            className="mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
          >
            Add Address
          </button>
        )}
      </div>
    </div>
  );
}

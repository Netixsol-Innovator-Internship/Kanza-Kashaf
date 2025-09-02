'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAuctionMutation } from '../../store/api';
import SellCarHeader from '../components/headers/SellCarHeader';
import Navbar2 from '../components/navbars/Navbar2';

const SellYourCar = () => {
  const router = useRouter();
  const [createAuction, { isLoading }] = useCreateAuctionMutation();

  const [photoError, setPhotoError] = useState<string>('');
  const [formData, setFormData] = useState({
    dealerType: 'Dealer',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vin: '',
    year: '',
    make: '',
    carModel: '',
    mileage: '',
    engineSize: '',
    paint: '',
    hasGccSpecs: '',
    features: '',
    accidentHistory: '',
    serviceHistory: '',
    modificationStatus: '',
    minBid: '',
    endTime: '',               // ✅ new field
    photos: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Require exactly 6 images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length !== 6) {
      setPhotoError('Please upload exactly 6 images.');
      setFormData({ ...formData, photos: [] });
      return;
    }
    setPhotoError('');
    setFormData({ ...formData, photos: files });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: exactly 6 photos
    if (formData.photos.length !== 6) {
      setPhotoError('Please upload exactly 6 images.');
      return;
    }

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      // ✅ Direct upload to Cloudinary
      const uploadPhotos = await Promise.all(
        formData.photos.map(async (file) => {
          const body = new FormData();
          body.append('file', file);
          body.append('upload_preset', uploadPreset);

          const res = await fetch(uploadUrl, { method: 'POST', body });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
          return data.secure_url as string;
        })
      );

      await createAuction({
        vin: formData.vin,
        year: Number(formData.year),
        make: formData.make,
        carModel: formData.carModel,
        mileage: Number(formData.mileage),
        engineSize: formData.engineSize,
        paint: formData.paint,
        hasGccSpecs: formData.hasGccSpecs,
        features: formData.features,
        accidentHistory: formData.accidentHistory,
        serviceHistory: formData.serviceHistory,
        modificationStatus: formData.modificationStatus,
        minBid: Number(formData.minBid),
        minIncrement: 100,
        photos: uploadPhotos,
        startTime: new Date().toISOString(),          // ✅ still auto now
        endTime: new Date(formData.endTime).toISOString(), // ✅ user selected
      }).unwrap();

      alert('Car submitted successfully!');
      router.push('/AuctionListingPage');
    } catch (err: any) {
      alert('Error submitting car: ' + (err?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar2 />
      <SellCarHeader />
      <div className="max-w-[796px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Tell us about your car</h1>
        <p className="text-gray-600 max-w-3xl mb-4 pr-[115px]">
            Please give us some basics about yourself and car you’d like to sell. We’ll also need details about the car’s title status as well as 50 photos that highlight the car’s exterior and interior condition.
        </p>
        <p className="text-gray-600 max-w-3xl mb-8 pr-[115px]">
            We’ll respond to your application within a business day, and we work with you to build a custom and professional listing and get the auction live.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Info */}
          <div className="bg-[#dbe8ff] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Your Info</h2>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="dealerType" value="Dealer"
                  checked={formData.dealerType === 'Dealer'}
                  onChange={handleChange} /> Dealer
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="dealerType" value="Private party"
                  checked={formData.dealerType === 'Private party'}
                  onChange={handleChange} /> Private party
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First name*" value={formData.firstName} onChange={handleChange} className="p-2 border rounded" required />
              <input type="text" name="lastName" placeholder="Last name*" value={formData.lastName} onChange={handleChange} className="p-2 border rounded" required />
              <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
              <input type="text" name="phone" placeholder="Phone number*" value={formData.phone} onChange={handleChange} className="p-2 border rounded" required />
            </div>
          </div>

          {/* Car Details */}
          <div className="bg-[#dbe8ff] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Car Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="vin" placeholder="VIN*" value={formData.vin} onChange={handleChange} className="p-2 border rounded" required />
              <select name="year" value={formData.year} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Select Year</option>
                {Array.from({ length: 40 }, (_, i) => 2024 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <input type="text" name="make" placeholder="Make*" value={formData.make} onChange={handleChange} className="p-2 border rounded" required />
              <input type="text" name="carModel" placeholder="Model*" value={formData.carModel} onChange={handleChange} className="p-2 border rounded" required />

              <input type="number" name="mileage" placeholder="Mileage (in miles)*" value={formData.mileage} onChange={handleChange} className="p-2 border rounded" required />

              <select name="engineSize" value={formData.engineSize} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Engine Size</option>
                {['4 Cylinder','6 Cylinder','8 Cylinder','10 Cylinder','12 Cylinder'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <select name="paint" value={formData.paint} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Paint</option>
                {['Original paint','Partially Repainted','Totally Repainted'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select name="hasGccSpecs" value={formData.hasGccSpecs} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Has GCC Specs</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <textarea name="features" placeholder="Noteworthy options/features" value={formData.features} onChange={handleChange} className="w-full p-2 border rounded mt-4"></textarea>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select name="accidentHistory" value={formData.accidentHistory} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Accident History</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <select name="serviceHistory" value={formData.serviceHistory} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Full Service History</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="mr-4">
                <input type="radio" name="modificationStatus" value="Completely stock"
                  checked={formData.modificationStatus === 'Completely stock'} onChange={handleChange} /> Completely stock
              </label>
              <label>
                <input type="radio" name="modificationStatus" value="Modified"
                  checked={formData.modificationStatus === 'Modified'} onChange={handleChange} /> Modified
              </label>
            </div>

            {/* ✅ Updated section: Min Bid + End Time */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="number" 
                name="minBid" 
                placeholder="Minimum Bid*" 
                value={formData.minBid} 
                onChange={handleChange} 
                className="p-2 border rounded" 
                required 
              />
              <input 
                type="datetime-local" 
                name="endTime" 
                value={formData.endTime} 
                onChange={handleChange} 
                className="p-2 border rounded" 
                required 
              />
            </div>

            {/* ✅ File upload moved below */}
            <div className="mt-4">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="p-2 border rounded" 
              />
            </div>
          </div>
          
          {photoError && <p className="text-red-600 text-sm">{photoError}</p>}

          <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default SellYourCar;

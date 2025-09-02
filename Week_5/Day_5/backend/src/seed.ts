import 'dotenv/config';
import { connect, Types } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Car, CarSchema } from './schemas/car.schema';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import mongoose from 'mongoose';

async function run() {
  await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/realtime_auctions');
  const userModel = mongoose.model<User>('User', UserSchema);
  const carModel = mongoose.model<Car>('Car', CarSchema);
  const auctionModel = mongoose.model<Auction>('Auction', AuctionSchema);

  await userModel.deleteMany({});
  await carModel.deleteMany({});
  await auctionModel.deleteMany({});

  const user = await userModel.create({
    username: 'demo',
    email: 'demo@example.com',
    password: '$2b$10$Yg6u9qYI.0sF9O2sSn5s1Oj4w6l7u9t6j1c5VZ8o8Qy6m5Wb0e1aK', // "password" bcrypt
    fullName: 'Demo User',
    phone: '0300-0000000'
  });

  const car = await carModel.create({
    vin: 'VIN1234567890',
    year: 2018,
    make: 'Toyota',
    model: 'Camry',
    mileage: 40000,
    engineSize: '4 Cylinder',
    paint: 'Original paint',
    hasGccSpecs: 'Yes',
    features: 'Sunroof, Leather seats',
    accidentHistory: 'No',
    serviceHistory: 'Yes',
    modificationStatus: 'Completely stock',
    minBid: 5000,
    photos: []
  });

  await userModel.findByIdAndUpdate(user._id, { $push: { myCars: car._id } });

  const now = new Date();
  const end = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
  const auction = await auctionModel.create({
    car: car._id,
    sellerId: user._id,
    startTime: now,
    endTime: end,
    status: 'live',
    minIncrement: 100,
    currentPrice: 5000
  });

  console.log('Seeded user:', user.email);
  console.log('Seeded car VIN:', car.vin);
  console.log('Seeded auction id:', auction._id.toString());
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

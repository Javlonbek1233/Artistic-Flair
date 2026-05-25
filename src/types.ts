export interface SpecData {
  acceleration: string;
  driveMode: string;
  coPilots: string;
  energyEfficiency: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  description: string;
  price: string;
  speed: string;
  power: string;
  range: string;
  visualTone: "Cyber Stealth" | "Hyper Drive" | "Cosmic Lounge";
  year: string;
  accelerationTime: number; // in seconds to compare
  imageColor: string; // Hex color for the wireframe/3D representation
  imageUrl?: string;
  specs: SpecData;
}

export interface AuctionItem {
  id: string;
  vehicle: Vehicle;
  currentBid: number; // in µ
  buyNowPrice: number; // in µ
  timeLeft: number; // in seconds
  bidsCount: number;
  bidHistory: { bidder: string; amount: number; time: string }[];
}

export interface Booking {
  vehicleId: string;
  driverName: string;
  simulationSite: string;
  coreDate: string;
  tier: "Standard Grid" | "Hyper Velocity" | "Neuro-Link Reality";
}

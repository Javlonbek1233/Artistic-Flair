import { Vehicle, AuctionItem } from "./types";

export const PRELOADED_VEHICLES: Vehicle[] = [
  {
    id: "v-1",
    name: "Aetherius X-1",
    model: "Quantum Hypersport",
    description: "An ultra-sleek, matte obsidian speedway weapon designed with dynamic active-camouflage and sub-atomic gravity-deflector panels.",
    price: "4,800,000 µ",
    speed: "Mach 4.2",
    power: "Dark Matter Reactor (3.2 GW)",
    range: "65,000 Light Years",
    visualTone: "Cyber Stealth",
    year: "2088",
    accelerationTime: 0.45,
    imageColor: "#00f3ff", // Electric Cyan
    specs: {
      acceleration: "0-100 km/h in 0.45s",
      driveMode: "Sub-orbital hover / Quantum glide",
      coPilots: "AI Sentinel 'Orion'",
      energyEfficiency: "99.8% Core Quantum Efficiency"
    }
  },
  {
    id: "v-2",
    name: "Chronos Celestial",
    model: "Solar Lounge Cruiser",
    description: "Created for smooth, multi-planetary transits. Features a dynamic zero-gravity cabin dome, dynamic biological life support, and solar fusion drive.",
    price: "6,500,000 µ",
    speed: "Mach 1.8",
    power: "Helios Fusion Sphere",
    range: "Hyper-Solar Powered (Continuous)",
    visualTone: "Cosmic Lounge",
    year: "2091",
    accelerationTime: 1.80,
    imageColor: "#ff00ea", // Cyber Magenta
    specs: {
      acceleration: "0-100 km/h in 1.80s",
      driveMode: "Mag-Lev suspension / Atmospheric glide",
      coPilots: "Holographic Butler 'Elysia'",
      energyEfficiency: "Continuous Solar Collector Integration"
    }
  },
  {
    id: "v-3",
    name: "Vortex Dreadnought",
    model: "Hyper-Track Assault",
    description: "An armored track champion that features active wind-foil force-fields and twin plasma Venturi thrusters for visual and acoustic dominance.",
    price: "5,200,000 µ",
    speed: "Mach 5.1",
    power: "High-Output Plasma Reactor",
    range: "25,000 Light Years",
    visualTone: "Hyper Drive",
    year: "2089",
    accelerationTime: 0.28,
    imageColor: "#ffdd00", // Venom Yellow / Amber
    specs: {
      acceleration: "0-100 km/h in 0.28s",
      driveMode: "Ground-effect aerodynamics / Kinetic recoil",
      coPilots: "AI Tactical Overseer 'Ares'",
      energyEfficiency: "94.2% Kinetic Absorption Rate"
    }
  },
  {
    id: "v-4",
    name: "Astraeus Phantom",
    model: "Shadow Stealth interceptor",
    description: "Engineered specifically for hyper-space void navigation. Equipped with phase-shifting carbon plates and absolute silence sound-absorbing hulls.",
    price: "3,900,000 µ",
    speed: "Mach 3.8",
    power: "Singularity Core Drive",
    range: "42,000 Light Years",
    visualTone: "Cyber Stealth",
    year: "2087",
    accelerationTime: 0.52,
    imageColor: "#7000ff", // Dark Purple
    specs: {
      acceleration: "0-100 km/h in 0.52s",
      driveMode: "Quantum Tunneling / Gravimetric Repulsion",
      coPilots: "Sentient Navigation Grid 'Nova'",
      energyEfficiency: "98.5% Singularity Containment"
    }
  },
  {
    id: "v-5",
    name: "Zephyrus Lounge-GT",
    model: "Grand Lounge Roadster",
    description: "Designed for grand celestial avenues. Offers memory-liquid seating, neural sensory feedback arrays, and orbital planetary path trackers.",
    price: "5,700,000 µ",
    speed: "Mach 2.4",
    power: "Direct Anti-Hydrogen Injector",
    range: "50,000 Light Years",
    visualTone: "Cosmic Lounge",
    year: "2090",
    accelerationTime: 1.10,
    imageColor: "#00ff66", // Neon Green
    specs: {
      acceleration: "0-100 km/h in 1.10s",
      driveMode: "Triple-thruster vectored thrust",
      coPilots: "Holographic Navigator 'Lyra'",
      energyEfficiency: "96.7% Mass-Energy Conversion"
    }
  }
];

export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: "auc-1",
    vehicle: PRELOADED_VEHICLES[0], // Aetherius X-1
    currentBid: 4100000,
    buyNowPrice: 4800000,
    timeLeft: 360, // 6 minutes
    bidsCount: 14,
    bidHistory: [
      { bidder: "Pilot_Z-89", amount: 4100000, time: "2 min ago" },
      { bidder: "Nova_Enforcer", amount: 3950000, time: "5 min ago" },
      { bidder: "CyberGlider", amount: 3800000, time: "8 min ago" }
    ]
  },
  {
    id: "auc-2",
    vehicle: PRELOADED_VEHICLES[2], // Vortex Dreadnought
    currentBid: 4900000,
    buyNowPrice: 5200000,
    timeLeft: 120, // 2 minutes (hot!)
    bidsCount: 22,
    bidHistory: [
      { bidder: "TrackMonster_X", amount: 4900000, time: "30s ago" },
      { bidder: "WarpSurfer", amount: 4850000, time: "1m ago" },
      { bidder: "Sector_9B_Racer", amount: 4700000, time: "3m ago" }
    ]
  }
];

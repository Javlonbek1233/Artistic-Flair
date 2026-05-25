import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded or safely initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Fallback high-fidelity recommendations in case GEMINI_API_KEY is missing
const MOCK_RECOMMENDATIONS = [
  {
    name: "Aetherius X-1",
    model: "Quantum Hypersport",
    visualTone: "Cyber Stealth",
    price: "4.8M µ",
    speed: "Mach 4.2",
    power: "Dark Matter Reactor (3.2 GW)",
    range: "65,000 LY",
    reason: "You chosen configuration requires maximum velocity combined with stealth cloaking. The Aetherius X-1 utilizes a nanotech carbon-mesh chassis that absorbs radar and bends light for absolute visual dominance.",
    description: "Built for interstellar speedways and low-gravity hovering, featuring sub-atomic dampeners and neural-sync steering.",
    specs: {
      acceleration: "0-100 km/h in 0.45s",
      driveMode: "Sub-orbital hover / Quantum glide",
      coPilots: "AI Sentinel 'Orion'",
      energyEfficiency: "99.8% Core Utilization"
    }
  },
  {
    name: "Chronos Celestial",
    model: "Solar Lounge Cruiser",
    visualTone: "Cosmic Lounge",
    price: "6.5M µ",
    speed: "Mach 1.8",
    power: "Helios Fusion Sphere",
    range: "Inexhaustible solar",
    reason: "For your desire for infinite endurance and luxurious cruising. The Chronos features a panoramic liquid-crystal outer dome with dynamic atmospheric rendering.",
    description: "An ultra-premium lounge on magnetic levelers. Features zero-gravity recliners, a biological air filtration system, and full autopilot.",
    specs: {
      acceleration: "0-100 km/h in 1.8s",
      driveMode: "Mag-Lev suspension / Atmospheric glide",
      coPilots: "Holographic Butler 'Elysia'",
      energyEfficiency: "Infinite Solar Collector"
    }
  },
  {
    name: "Vortex Dreadnought",
    model: "Hyper-Track Assault",
    visualTone: "Hyper Drive",
    price: "5.2M µ",
    speed: "Mach 5.1",
    power: "Plasma Venturi Engine",
    range: "25,000 LY",
    reason: "Since you crave raw speed, immediate response, and uncompromising mechanical power. The Vortex is the ultimate track weapon with adaptive carbon rear stabilizers.",
    description: "An intense high-gravity track vehicle with a titanium-alloy exoskeleton, active force-field shields, and direct neural link interface.",
    specs: {
      acceleration: "0-100 km/h in 0.28s",
      driveMode: "Ground-effect aerodynamics / Kinetic recoil",
      coPilots: "AI Overseer 'Ares'",
      energyEfficiency: "High Kinetic Recovery"
    }
  }
];

// Endpoint: Recommendation API
app.post("/api/recommend", async (req, res) => {
  const { driveStyle, preferTerrain, fuelSource, visualTone } = req.body;

  try {
    const ai = getGeminiClient();

    const prompt = `You are the AutoVerse AI Vehicle Recommender, a futuristic, hyper-sophisticated automotive AI.
Based on the following user preferences:
- Driving Style: "${driveStyle || "unspecified"}"
- Preferred Terrain: "${preferTerrain || "unspecified"}"
- Energy/Fuel Source: "${fuelSource || "unspecified"}"
- Aesthetic Visual Tone: "${visualTone || "unspecified"}"

Generate a custom futuristic luxury vehicle that is the absolute perfect match for them.
Create a creative, exotic futuristic name, model type, price (in cosmic currency 'µ' or Micro-Credits), extreme specs, dynamic descriptions, and a personalized 'reason' of why this vehicle matches their exact input profile. Make the description sound highly premium, futuristic, and full of sci-fi flavor.

You must return a valid, strictly formatted JSON object exactly matching this schema:
{
  "name": "Creative Unique Vehicle Name",
  "model": "Futuristic Vehicle Classification",
  "visualTone": "The matches visual tone",
  "price": "Price estimate in µ (Micro-credits), e.g., '3.5M µ'",
  "speed": "Futuristic top speed, e.g., 'Mach 2.5' or 'Sub-warp Level 1'",
  "power": "Futuristic power source, e.g., 'Antimatter Injector'",
  "range": "Interstellar range",
  "reason": "Clear explanation of why this matches their preferences exactly.",
  "description": "Premium cinematic description of the ride.",
  "specs": {
    "acceleration": "Accelleration details, e.g. '0-100 in 0.3s'",
    "driveMode": "Drive system, e.g. 'Gravitational Levitation'",
    "coPilots": "Included AI co-pilot name & nature",
    "energyEfficiency": "Energy rating or efficiency stats"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "model", "visualTone", "price", "speed", "power", "range", "reason", "description", "specs"],
          properties: {
            name: { type: Type.STRING },
            model: { type: Type.STRING },
            visualTone: { type: Type.STRING },
            price: { type: Type.STRING },
            speed: { type: Type.STRING },
            power: { type: Type.STRING },
            range: { type: Type.STRING },
            reason: { type: Type.STRING },
            description: { type: Type.STRING },
            specs: {
              type: Type.OBJECT,
              required: ["acceleration", "driveMode", "coPilots", "energyEfficiency"],
              properties: {
                acceleration: { type: Type.STRING },
                driveMode: { type: Type.STRING },
                coPilots: { type: Type.STRING },
                energyEfficiency: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const textOutput = response.text?.trim() || "{}";
    const recommendedObj = JSON.parse(textOutput);
    return res.json({ success: true, vehicle: recommendedObj, source: "gemini-ai" });

  } catch (error: any) {
    console.warn("Gemini API call failed or is missing API key. Falling back to high-fidelity mock data.", error.message);
    
    // Select one of the high-fidelity curated mock recommendations that best matches the Visual Tone
    const toneNormalized = (visualTone || "").toLowerCase();
    let selectedMock = MOCK_RECOMMENDATIONS[0];
    if (toneNormalized.includes("lounge") || toneNormalized.includes("cosmic") || toneNormalized.includes("wealth")) {
      selectedMock = MOCK_RECOMMENDATIONS[1];
    } else if (toneNormalized.includes("track") || toneNormalized.includes("sport") || toneNormalized.includes("hyper")) {
      selectedMock = MOCK_RECOMMENDATIONS[2];
    } else {
      // Pick random
      selectedMock = MOCK_RECOMMENDATIONS[Math.floor(Math.random() * MOCK_RECOMMENDATIONS.length)];
    }

    return res.json({ 
      success: true, 
      vehicle: selectedMock, 
      source: "curated_fallback",
      message: "Showing custom vehicle matching your exact quantum profile signature."
    });
  }
});

// Mock Stripe API session simulation
app.post("/api/booking/stripe", (req, res) => {
  const { vehicleName, bookingType, creditTier } = req.body;
  
  // Return simulated Stripe checkout response
  res.json({
    success: true,
    sessionId: `cs_test_${Math.random().toString(36).substring(7)}`,
    url: "#stripe-checkout",
    message: `Secure transaction initialized for your ${bookingType} simulation on the ${vehicleName} via the auto-cleared Stripe payment grid.`,
    receiptUrl: `https://stripe.com/receipt/test_auto_${Date.now()}`
  });
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoVerse Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();

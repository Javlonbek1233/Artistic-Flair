import React, { useState } from "react";
import { Vehicle, Booking } from "../types";
import { PRELOADED_VEHICLES } from "../data";
import { Calendar, Globe, Compass, CheckCircle, Zap, ShieldCheck } from "lucide-react";

interface BookingFormProps {
  vehicles: Vehicle[];
}

export default function BookingForm({ vehicles }: BookingFormProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(PRELOADED_VEHICLES[0].id);
  const [driverName, setDriverName] = useState<string>("");
  const [simulationSite, setSimulationSite] = useState<string>("Martian Canyons High-G");
  const [dateStr, setDateStr] = useState<string>("2026-06-12");
  const [creditTier, setCreditTier] = useState<"Standard Grid" | "Hyper Velocity" | "Neuro-Link Reality">("Hyper Velocity");

  const [loading, setLoading] = useState<boolean>(false);
  const [bookingResponse, setBookingResponse] = useState<any | null>(null);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

  const sites = [
    { name: "Martian Canyons High-G", type: "Low-gravity cliff run", gravity: "0.38G" },
    { name: "Neo-Tokyo Cyber Skyways", type: "Tollway grid high velocity", gravity: "1.00G" },
    { name: "Stellar Belt Void Runway", type: "Interspace vacuum drift", gravity: "0.00G" },
    { name: "Neo-Nürburgring Quantum Track", type: "Hyper-curves dimension", gravity: "1.00G" }
  ];

  const tiers = [
    { name: "Standard Grid", price: "5000 µ", description: "Standard physical flight simulation capsule overlay." },
    { name: "Hyper Velocity", price: "12,500 µ", description: "Real orbital thruster ignition flight with AI copilot." },
    { name: "Neuro-Link Reality", price: "25,000 µ", description: "Direct spinal cord sensory synapse sync at Mach 5." }
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName) return;

    setLoading(true);
    setBookingResponse(null);

    const targetVehicle = vehicles.find((v) => v.id === selectedVehicleId) || PRELOADED_VEHICLES[0];

    try {
      // Direct integration calls mock Stripe API session simulation on server
      const resp = await fetch("/api/booking/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleName: targetVehicle.name,
          bookingType: creditTier,
          price: tiers.find(t => t.name === creditTier)?.price
        }),
      });

      const data = await resp.json();
      
      // Simulate slow transaction grid confirmation
      setTimeout(() => {
        setBookingResponse(data);
        const newBooking: Booking = {
          vehicleId: selectedVehicleId,
          driverName,
          simulationSite,
          coreDate: dateStr,
          tier: creditTier
        };
        setActiveBookings((prev) => [newBooking, ...prev]);
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error("Failed to compile stripe checkout simulation sequence:", err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
      {/* Decorative vector */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6 border-b border-white/5 pb-4">
        <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
          <Calendar className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="text-base font-extrabold font-sans text-white tracking-tight flex items-center gap-2 italic">
            Orbit Testflight Booker
          </h4>
          <p className="text-xs font-sans text-white/40 mt-1">
            Provision real-orbital hypersonic test slots across the quadrant using our Stripe-backed secure gateway.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reservation form block */}
        <div className="lg:col-span-7">
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Choose spaceship */}
              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-wider font-bold">
                  Select Spaceship / Cruiser:
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none cursor-pointer"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#0f0f15]">
                      {v.name} ({v.model})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Driver Name */}
              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-wider font-bold">
                  Pilot License / Full Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g., Pilot John Doe"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 3: Simulation Site */}
              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-wider font-bold">
                  Select Simulation Zone Site:
                </label>
                <select
                  value={simulationSite}
                  onChange={(e) => setSimulationSite(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none cursor-pointer"
                >
                  {sites.map((st) => (
                    <option key={st.name} value={st.name} className="bg-[#0f0f15]">
                      {st.name} ({st.gravity} Gravity)
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 4: Target Expedition Date */}
              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-wider font-bold">
                  Expedition Launch Date:
                </label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:border-cyan-400 outline-none cursor-pointer text-white-scheme"
                />
              </div>
            </div>

            {/* Field 5: Credit/Propulsion Tiers */}
            <div>
              <label className="text-xs font-mono text-white/50 block mb-2.5 uppercase tracking-wider font-bold">
                Select Reality Propulsion Synapse Tier:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tiers.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setCreditTier(t.name as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                      creditTier === t.name
                        ? "bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                        : "bg-[#0d0d0d] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-mono font-bold block">{t.name}</span>
                      <span className="text-[10px] text-white/40 mt-1 line-clamp-2 block leading-snug">{t.description}</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold mt-2.5 block border-t border-white/5 pt-1.5">
                      {t.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-cyan-400 text-black py-4 rounded-xl text-xs font-mono font-black uppercase tracking-widest transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Generating Stripe Session...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-500 animate-pulse" /> Confirm Reservation with Stripe
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic bookings listings / Stripe notification pane */}
        <div className="lg:col-span-5 space-y-4">
          {/* Section A: Live Checkout Feed receipt */}
          {bookingResponse && (
            <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-2xl relative overflow-hidden transition-all duration-500">
              <span className="absolute top-2 right-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> PAID SECURE
              </span>
              <h5 className="text-white text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1 font-bold">
                <CheckCircle className="w-4 h-4 text-pink-400" /> Stripe Confirmation Log
              </h5>
              <p className="text-[11px] text-white/70 font-sans leading-relaxed mb-3">
                {bookingResponse.message}
              </p>
              <div className="bg-[#050505] p-3 rounded-xl text-[10px] font-mono border border-white/5">
                <div className="flex justify-between">
                  <span className="text-white/30">SESSION_ID</span>
                  <span className="text-pink-400 font-bold">{bookingResponse.sessionId.substring(0, 18)}...</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-white/30">VIRTUAL_RECEIPT</span>
                  <a href={bookingResponse.receiptUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline truncate select-all max-w-[140px] block font-bold">
                    Click to Open Receipt
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Section B: Grid schedule registry slots */}
          <div className="p-4 bg-white/[0.015] border border-white/10 rounded-2xl max-h-[290px] overflow-y-auto">
            <h5 className="text-[10px] font-mono text-white/30 uppercase block mb-3 font-bold tracking-wider font-bold">ACTIVE Expedition Launch Registries ({activeBookings.length})</h5>
            {activeBookings.length === 0 ? (
              <div className="py-8 text-center text-[10px] font-mono text-white/20 uppercase tracking-widest font-semibold">
                [NO ACTIVE REGISTRY LOGS DETECTED]
              </div>
            ) : (
              <div className="space-y-3">
                {activeBookings.map((b, idx) => {
                  const correlatedVeh = vehicles.find((v) => v.id === b.vehicleId) || PRELOADED_VEHICLES[0];
                  return (
                    <div key={idx} className="bg-[#050505]/60 border border-white/5 p-3.5 rounded-xl text-[11px] font-mono">
                      <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                        <span className="font-bold text-white uppercase italic">{correlatedVeh.name}</span>
                        <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-2 rounded-full border border-cyan-400/20 font-bold uppercase tracking-widest">{b.tier}</span>
                      </div>
                      <div className="space-y-1 mt-2 text-white/40">
                        <div className="flex justify-between">
                          <span>PILOT:</span>
                          <span className="text-white/80 font-bold">{b.driverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Launch Site:</span>
                          <span className="text-cyan-400 font-bold">{b.simulationSite}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>STARDATE:</span>
                          <span className="text-white/70 font-semibold">{b.coreDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

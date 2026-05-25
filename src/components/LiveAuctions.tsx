import React, { useState, useEffect } from "react";
import { AuctionItem, Vehicle } from "../types";
import { INITIAL_AUCTIONS, PRELOADED_VEHICLES } from "../data";
import { Hammer, Coins, Flame, Hourglass, Plus, Check, Trash } from "lucide-react";

interface LiveAuctionsProps {
  onVehiclePurchase: (price: number, vehicle: Vehicle) => void;
}

export default function LiveAuctions({ onVehiclePurchase }: LiveAuctionsProps) {
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [userBids, setUserBids] = useState<Record<string, number>>({});
  const [bidStatus, setBidStatus] = useState<Record<string, string>>({});

  // Form states for user listing their own vehicle
  const [showListingModal, setShowListingModal] = useState<boolean>(false);
  const [customModel, setCustomModel] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<number>(3000000);
  const [selectedPredefined, setSelectedPredefined] = useState<string>("v-1");

  // 1. Simulate active countdown and random other-user real-time bidding ticks!
  useEffect(() => {
    const timer = setInterval(() => {
      // Tick countdowns down
      setAuctions((prev) => {
        return prev.map((auc) => {
          const nextTime = auc.timeLeft > 0 ? auc.timeLeft - 1 : 0;
          
          // Randomly trigger other simulated pilot bids (15% chance per tick)
          const shouldBidUser = Math.random() < 0.15 && nextTime > 0;
          if (shouldBidUser) {
            const increment = Math.floor(Math.random() * 3 + 1) * 50000;
            const newBid = auc.currentBid + increment;
            const randomPilots = ["Nova_Reaper", "Pilot_X-01", "VoidSlayer", "WarpLord", "SentinelPrime"];
            const randomPilot = randomPilots[Math.floor(Math.random() * randomPilots.length)];

            return {
              ...auc,
              timeLeft: nextTime,
              currentBid: newBid,
              bidsCount: auc.bidsCount + 1,
              bidHistory: [
                { bidder: randomPilot, amount: newBid, time: "Just now" },
                ...auc.bidHistory.map(bh => (bh.time === "Just now" ? { ...bh, time: "30s ago" } : bh))
              ].slice(0, 4) // keep last 4
            };
          }

          return { ...auc, timeLeft: nextTime };
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePlaceBid = (aucId: string, customAmount?: number) => {
    setAuctions((prev) => {
      return prev.map((auc) => {
        if (auc.id !== aucId) return auc;

        const incrementAmount = customAmount || userBids[aucId] || (auc.currentBid + 100000);
        
        if (incrementAmount <= auc.currentBid) {
          setBidStatus(prevStatus => ({ ...prevStatus, [aucId]: "Bids must exceed current standard bid levels." }));
          setTimeout(() => setBidStatus(prevStatus => ({ ...prevStatus, [aucId]: "" })), 3000);
          return auc;
        }

        // Extend countdown if time is very hot (less than 60 seconds)
        const nextTime = auc.timeLeft < 60 ? auc.timeLeft + 30 : auc.timeLeft;

        setBidStatus(prevStatus => ({ ...prevStatus, [aucId]: "Bid register confirmed on dynamic grid ledger." }));
        setTimeout(() => setBidStatus(prevStatus => ({ ...prevStatus, [aucId]: "" })), 2500);

        return {
          ...auc,
          timeLeft: nextTime,
          currentBid: incrementAmount,
          bidsCount: auc.bidsCount + 1,
          bidHistory: [
            { bidder: "You (Resonance Core ID)", amount: incrementAmount, time: "Just now" },
            ...auc.bidHistory.map(bh => (bh.time === "Just now" ? { ...bh, time: "30s ago" } : bh))
          ].slice(0, 4)
        };
      });
    });
  };

  const handleInstantBuy = (auc: AuctionItem) => {
    onVehiclePurchase(auc.buyNowPrice, auc.vehicle);
    // Remove from active listings list
    setAuctions((prev) => prev.filter((a) => a.id !== auc.id));
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const coreVehicle = PRELOADED_VEHICLES.find((v) => v.id === selectedPredefined) || PRELOADED_VEHICLES[0];
    
    const newAuction: AuctionItem = {
      id: `auc-${Math.random().toString(36).substring(7)}`,
      vehicle: {
        ...coreVehicle,
        name: customModel || coreVehicle.name,
      },
      currentBid: Math.floor(customPrice * 0.85),
      buyNowPrice: customPrice,
      timeLeft: 480, // 8 mins
      bidsCount: 1,
      bidHistory: [
        { bidder: "You (Listed)", amount: Math.floor(customPrice * 0.85), time: "Just now" }
      ]
    };

    setAuctions((prev) => [newAuction, ...prev]);
    setShowListingModal(false);
    setCustomModel("");
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div>
          <h4 className="text-base font-extrabold font-sans text-white tracking-tight flex items-center gap-2 italic">
            <Hammer className="w-5 h-5 text-cyan-400" /> Live Hyper-Drive Auctions
          </h4>
          <p className="text-xs font-sans text-white/40 mt-1">
            Real-time sub-orbital bid feeds. Secure a futuristic cruiser instantly via quantum credits.
          </p>
        </div>
        <button
          onClick={() => setShowListingModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-cyan-400 rounded-xl text-xs font-mono font-black tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
        >
          <Plus className="w-4 h-4" strokeWidth={3} /> List Vehicle
        </button>
      </div>

      {/* Primary listings grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {auctions.map((auc) => {
          const minutes = Math.floor(auc.timeLeft / 60);
          const seconds = auc.timeLeft % 60;
          const isHot = auc.timeLeft < 100;

          return (
            <div
              key={auc.id}
              className="bg-white/[0.015] border border-white/10 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Dynamic decorative backdrop colors based on status */}
              <div 
                style={{ backgroundColor: auc.vehicle.imageColor }} 
                className="absolute top-0 right-0 w-24 h-24 opacity-10 filter blur-[60px] rounded-full" 
              />

              {/* Grid Top: Countdown and Active tags */}
              <div className="flex justify-between items-center mb-4 z-10">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-[0.15em] bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
                  {auc.vehicle.visualTone}
                </span>

                <div className={`flex items-center gap-1.5 font-mono text-xs ${isHot ? "text-rose-400 animate-pulse bg-rose-950/40 border-rose-500/30" : "text-amber-400 bg-amber-950/20 border-amber-500/25"} border rounded-full px-2.5 py-1`}>
                  <Hourglass className="w-3.5 h-3.5" />
                  <span>
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                  </span>
                  {isHot && <span className="text-[9px] font-bold text-rose-500">HOT</span>}
                </div>
              </div>

              {/* Middle Section: Specs */}
              <div className="mb-4 z-10">
                <h5 className="text-lg font-sans font-extrabold italic text-white flex items-center justify-between">
                  {auc.vehicle.name}
                  <span className="text-xs text-white/40 font-mono font-normal">[{auc.vehicle.model}]</span>
                </h5>
                <p className="text-xs text-white/40 leading-relaxed mt-1 line-clamp-2">
                  {auc.vehicle.description}
                </p>
              </div>

              {/* Dynamic Prices Block */}
              <div className="grid grid-cols-2 gap-3 bg-[#0d0d0d]/40 p-4 rounded-2xl border border-white/5 mb-4 z-10">
                <div>
                  <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">Current High Bid</span>
                  <span className="text-base font-mono font-bold text-cyan-400">{auc.currentBid.toLocaleString()} µ</span>
                  <span className="text-[9px] font-mono text-white/30 block mt-0.5">({auc.bidsCount} bids logged)</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">Immediate Buy Price</span>
                  <span className="text-base font-mono font-bold text-pink-400">{auc.buyNowPrice.toLocaleString()} µ</span>
                  <span className="text-[9px] font-mono text-white/30 block mt-0.5">(Stripe Cleared)</span>
                </div>
              </div>

              {/* Status logs */}
              {bidStatus[auc.id] && (
                <div className="p-2 mb-4 bg-cyan-950/45 border border-cyan-500/25 rounded-xl text-center text-xs font-mono text-cyan-300">
                  {bidStatus[auc.id]}
                </div>
              )}

              {/* Standard bid inputs & Quick increment matrix */}
              <div className="space-y-3 z-10">
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="50000"
                    placeholder={`Min: ${(auc.currentBid + 50000).toLocaleString()}`}
                    className="flex-grow bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setUserBids(prev => ({ ...prev, [auc.id]: val }));
                    }}
                  />
                  <button
                    onClick={() => handlePlaceBid(auc.id)}
                    className="px-4 py-2 bg-white text-black hover:bg-cyan-400 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    Place Bid
                  </button>
                </div>

                {/* Instant Action buttons */}
                <div className="flex justify-between items-center gap-2 pt-1">
                  <button
                    onClick={() => handlePlaceBid(auc.id, auc.currentBid + 100000)}
                    className="flex-grow py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 rounded-xl text-xs font-mono text-center transition duration-200 cursor-pointer"
                  >
                    +100k Instant Raise
                  </button>
                  <button
                    onClick={() => handleInstantBuy(auc)}
                    className="flex-grow py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-xl text-xs font-mono text-center font-bold tracking-wide transition duration-200 cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Mini history log view section */}
              <div className="mt-4 pt-3 border-t border-white/5 z-10">
                <span className="text-[10px] font-mono text-white/30 uppercase block mb-1.5 tracking-wider font-bold">LEDGER LOG HISTORY:</span>
                <div className="space-y-1">
                  {auc.bidHistory.map((history, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                      <span className={`${idx === 0 ? "text-cyan-400 font-bold" : "text-white/40"}`}>
                        {idx === 0 ? "●" : "◦"} {history.bidder}
                      </span>
                      <span className={`${idx === 0 ? "text-cyan-400 font-bold" : "text-white/40"} font-bold`}>
                        {history.amount.toLocaleString()} µ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional: Add custom mock lists modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0d] border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
            <h4 className="text-lg font-extrabold italic font-sans text-white mb-4">
              Submit Vehicle to Hyper Auction Ledger
            </h4>
            
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 font-bold tracking-wider">Select Core Chassis Template:</label>
                <select
                  value={selectedPredefined}
                  onChange={(e) => setSelectedPredefined(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none cursor-pointer"
                >
                  {PRELOADED_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#0f0f15]">
                      {v.name} ({v.model})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 font-bold tracking-wider">Custom Designation Name (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g., Aetherius Voidmaster II"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/50 block mb-2 font-bold tracking-wider">Buy Now Value Price (µ):</label>
                <input
                  type="number"
                  min="1000000"
                  step="100000"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="flex-grow py-3 bg-white/5 border border-white/10 hover:border-white/20 select-none text-xs font-mono rounded-xl text-white/60 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 bg-white text-black hover:bg-cyan-400 transition text-xs font-mono rounded-xl font-black uppercase tracking-widest cursor-pointer"
                >
                  Load to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

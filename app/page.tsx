"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid, CheckCircle2, AlertTriangle } from 'lucide-react';
import bakimData from './data.json'; // Verileri buradan okur

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("İstanbul");
  const [sonucGoster, setSonucGoster] = useState(false);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);

  // Marka seçildiğinde modelleri filtrele
  useEffect(() => {
    if (secilenMarka) {
      const modeller = Object.keys(bakimData).filter(model => bakimData[model as keyof typeof bakimData].marka === secilenMarka);
      setMusaitModeller(modeller);
      setSecilenModel(""); // Marka değişince eski modeli sıfırla
    }
  }, [secilenMarka]);

  const sehirler = ["Adana", "Ankara", "Antalya", "Bursa", "Gaziantep", "İstanbul", "İzmir", "Kocaeli", "Konya", "Mersin"].sort();
  const popülerMarkalar = [
    { name: "Hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
    { name: "Nissan", logo: "https://www.carlogos.org/car-logos/nissan-logo.png" },
    { name: "Fiat", logo: "https://www.carlogos.org/car-logos/fiat-logo.png" },
    { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
    { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
    { name: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" }
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Navbar ve Hero (Aynı kalıyor) */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 text-left">
        <div className="flex items-center gap-3">
          <div className="bg-[#1E293B] p-2 rounded-xl text-white"><Car size={24} /></div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#1E293B]">bakimim<span className="text-blue-600">.com</span></span>
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Şen Kardeşler</span>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[850px] flex flex-col items-center justify-center text-center py-20 px-6">
        <div className="absolute inset-0 bg-[#0F172A] z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 to-slate-50" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-[800] text-white mb-10 tracking-tight leading-tight">Bakım Maliyetini <br/><span className="text-blue-400 italic font-normal text-4xl">500+ Model İçin Sorgula</span></h1>
          
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl max-w-6xl mx-auto mb-12 border border-slate-200">
            <div className="bg-slate-50 p-6 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <LayoutGrid size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marka</label>
                  <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer w-full">
                    <option value="">Seçiniz</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Fiat">Fiat</option>
                    <option value="Volkswagen">Volkswagen</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <Car size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Model</label>
                  <select disabled={!secilenMarka} value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer w-full disabled:opacity-30">
                    <option value="">{secilenMarka ? "Seçiniz" : "Önce Marka Seçin"}</option>
                    {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2 text-slate-900">
                <MapPin size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Şehir</label>
                  <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="bg-transparent font-bold outline-none cursor-pointer w-full">
                    {sehirler.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={() => setSonucGoster(true)} className="bg-[#1E293B] hover:bg-slate-800 text-white rounded-2xl font-bold py-4 shadow-lg active:scale-95 transition-all">Sorgula</button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10 py-10 bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/20 px-12 shadow-2xl">
            {popülerMarkalar.map((marka) => (
              <div key={marka.name} onClick={() => setSecilenMarka(marka.name)} className="group cursor-pointer flex flex-col items-center gap-4">
                <div className={`w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center p-4 shadow-xl transition-all border-2 ${secilenMarka === marka.name ? 'border-blue-400 scale-110' : 'border-slate-100'}`}>
                  <img src={marka.logo} alt={marka.name} className={`w-full h-full object-contain ${secilenMarka === marka.name ? 'grayscale-0' : 'grayscale'}`} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-200">{marka.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sonuç Alanı */}
      {sonucGoster && (bakimData as any)[secilenModel] && (
        <section className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in zoom-in-95">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 text-left">
            <div className="bg-[#1E293B] p-10 text-white flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight mb-2 leading-none">{secilenMarka} {secilenModel}</h2>
                <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold">{(bakimData as any)[secilenModel].km}</span>
              </div>
              <CheckCircle2 size={60} className="opacity-10" />
            </div>
            <div className="p-12">
              <div className="flex flex-col md:flex-row gap-10 items-center justify-between mb-12 border-b border-slate-100 pb-12">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{secilenSehir} Bakım Ücreti</p>
                  <p className="text-6xl font-[900] text-[#1E293B] tracking-tighter">{(bakimData as any)[secilenModel].fiyat}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-8 py-4 rounded-2xl font-bold border border-blue-100 shadow-sm flex items-center gap-2"><ShieldCheck /> Şen Kardeşler Onaylı</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div><h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest">Bakım İçeriği</h3><p className="text-slate-600 font-medium italic bg-slate-50 p-8 rounded-[2rem] border border-slate-100 leading-relaxed">"{(bakimData as any)[secilenModel].icerik}"</p></div>
                <div className="bg-indigo-50/50 p-10 rounded-[2.5rem] border border-indigo-100/50">
                  <h3 className="text-indigo-900 font-black mb-3 text-xs uppercase flex items-center gap-2"><AlertTriangle size={18} className="text-indigo-500" /> Şen Kardeşler Notu</h3>
                  <p className="text-indigo-700/80 text-sm font-semibold italic">{(bakimData as any)[secilenModel].not}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

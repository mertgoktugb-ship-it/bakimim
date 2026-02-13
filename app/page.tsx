"use client";
import React, { useState } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [sonucGoster, setSonucGoster] = useState(false);

  // Marka Listeleri
  const otomobilMarkalar = ["Alfa Romeo", "Aston Martin", "Audi", "BMW", "Cupra", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Tesla", "Tofaş", "Toyota", "Volkswagen", "Volvo"];
  const araziSuvMarkalar = ["Dacia", "Hyundai", "Jeep", "Land Rover", "Nissan"];
  const minivanVanMarkalar = ["Fiat", "Ford", "Renault", "Volkswagen"];

  const popülerMarkalar = [
    { name: "Hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
    { name: "Nissan", logo: "https://www.carlogos.org/car-logos/nissan-logo.png" },
    { name: "Fiat", logo: "https://www.carlogos.org/car-logos/fiat-logo.png" },
    { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
    { name: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
    { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
    { name: "Opel", logo: "https://www.carlogos.org/car-logos/opel-logo.png" },
    { name: "Renault", logo: "https://www.carlogos.org/car-logos/renault-logo.png" }
  ];

  const bakimVerileri = {
    "Tucson": { fiyat: "11.500 TL - 13.000 TL", icerik: "Yağ, Yağ Filtresi, Polen, Hava Filtresi, Karter Tapası", not: "Yetkili servislerde fiyatlar şehre göre %5-10 oynayabilir.", km: "20.000 KM Periyodik Bakım" },
    "Qashqai": { fiyat: "10.800 TL - 12.500 TL", icerik: "Yağ, Yağ Filtresi, Hava Filtresi, Mazot Filtresi", not: "Dizel modeller için mazot filtresi değişimi dahildir.", km: "15.000 KM Periyodik Bakım" }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      {/* Google Font Yükleme (Inter) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Navbar - Daha İnce ve Şık */}
      <nav className="flex items-center justify-between px-12 py-6 bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-[#1E293B] p-2 rounded-xl text-white shadow-xl group-hover:bg-[#334155] transition-all duration-300">
            <Car size={24} strokeWidth={2} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-tight text-[#1E293B]">bakimim<span className="text-[#3B82F6]">.com</span></span>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.3em] uppercase leading-none">Şen Kardeşler</span>
          </div>
        </div>
        <div className="hidden md:flex gap-12 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <a href="#" className="hover:text-[#3B82F6] transition-colors">Anasayfa</a>
          <a href="#" className="hover:text-[#3B82F6] transition-colors">Veri Girişi</a>
          <a href="#" className="hover:text-[#3B82F6] transition-colors">İletişim</a>
        </div>
      </nav>

      {/* Hero Section - Yeni Renk Paleti ve Yumuşak Geçişler */}
      <section className="relative min-h-[750px] flex flex-col items-center justify-center text-center overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-[#0F172A] z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-110 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/50 to-[#F8FAFC]" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-[800] text-white mb-6 tracking-tight leading-tight">
            Aracınızın Bakım Maliyetini <br/> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 italic">Şeffafça Görün!</span>
          </h1>
          
          {/* Modern Arama Kutusu - Gölge ve Köşeler Yumuşatıldı */}
          <div className="bg-white p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-6xl mx-auto mb-12 border border-slate-100">
            <div className="bg-slate-50/50 p-6 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              
              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <LayoutGrid size={18} className="text-slate-400 mr-3 group-hover:text-blue-500 transition-colors" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kategori & Marka</label>
                  <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="bg-transparent text-slate-800 font-semibold outline-none cursor-pointer appearance-none w-full">
                    <option value="">Seçiniz</option>
                    <optgroup label="Otomobil">{otomobilMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</optgroup>
                    <optgroup label="SUV & Pickup">{araziSuvMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</optgroup>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-8 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <Car size={18} className="text-slate-400 mr-3 group-hover:text-blue-500 transition-colors" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Model</label>
                  <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="bg-transparent text-slate-800 font-semibold outline-none cursor-pointer appearance-none w-full">
                    <option value="">Seçiniz</option>
                    <option value="Tucson">Tucson</option>
                    <option value="Qashqai">Qashqai</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-8 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <MapPin size={18} className="text-slate-400 mr-3 group-hover:text-blue-500 transition-colors" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Şehir</label>
                  <select className="bg-transparent text-slate-800 font-semibold outline-none cursor-pointer appearance-none w-full">
                    <option>İstanbul</option>
                    <option>Antalya</option>
                  </select>
                </div>
              </div>

              <button onClick={() => setSonucGoster(true)} className="bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-2xl font-bold tracking-tight shadow-lg shadow-slate-200 transition-all active:scale-95 py-4 flex items-center justify-center gap-2">
                <Search size={18} /> Sorgula
              </button>
            </div>
          </div>

          {/* Logo Bölümü - Daha Kibar Tasarım */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto py-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 px-10">
            {popülerMarkalar.map((marka) => (
              <div key={marka.name} onClick={() => setSecilenMarka(marka.name)} className="group cursor-pointer flex flex-col items-center gap-3">
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-3.5 shadow-md transition-all duration-500 border-2 ${secilenMarka === marka.name ? 'border-blue-400 ring-4 ring-blue-400/10 scale-110' : 'border-slate-50'}`}>
                  <img src={marka.logo} alt={marka.name} className={`w-full h-auto object-contain transition-all duration-500 ${secilenMarka === marka.name ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                </div>
                <span className={`text-[9px] font-extrabold uppercase tracking-widest ${secilenMarka === marka.name ? 'text-blue-300' : 'text-slate-400 group-hover:text-white'}`}>{marka.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sonuç Kartı - Premium Görünüm */}
      {sonucGoster && bakimVerileri[secilenModel] && (
        <section className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-[#1E293B] to-[#334155] p-10 text-white flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tighter uppercase leading-none mb-2">{secilenMarka} {secilenModel}</h2>
                <span className="bg-blue-500/20 text-blue-200 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-blue-500/30">
                  {bakimVerileri[secilenModel].km}
                </span>
              </div>
              <div className="hidden md:block opacity-20"><CheckCircle2 size={70} /></div>
            </div>
            
            <div className="p-12">
              <div className="flex flex-col md:flex-row gap-12 items-center justify-between mb-12 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Güncel Bakım Maliyeti</p>
                  <p className="text-6xl font-[900] text-[#1E293B] tracking-tighter">{bakimVerileri[secilenModel].fiyat}</p>
                </div>
                <div className="bg-slate-50 text-slate-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border border-slate-200">
                  <ShieldCheck size={22} className="text-blue-500" /> Şen Kardeşler Onaylı
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <div>
                  <h3 className="text-sm font-[900] text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Wrench size={16} /></div>
                    Değişen Parçalar
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm bg-slate-50/50 p-6 rounded-2xl border border-slate-100 italic">
                    "{bakimVerileri[secilenModel].icerik}"
                  </p>
                </div>
                <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100/50">
                  <h3 className="text-indigo-900 font-[900] mb-3 flex items-center gap-3 text-xs uppercase tracking-widest">
                    <AlertTriangle size={18} className="text-indigo-500" /> Önemli Bilgi
                  </h3>
                  <p className="text-indigo-700/80 text-sm font-semibold leading-relaxed">
                    {bakimVerileri[secilenModel].not} [cite: 2026-02-10]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="py-20 text-center border-t border-slate-200 mt-20">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em]">© 2026 Şen Kardeşler</p>
      </footer >
    </main>
  );
}

"use client"; // Tıklama özelliklerinin çalışması için bu satır şart!
import React, { useState } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid } from 'lucide-react';

export default function Home() {
  // Seçilen markayı takip eden "akıllı" değişken
  const [secilenMarka, setSecilenMarka] = useState("");

  const otomobilMarkalar = [
    "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Cadillac", "Chery", 
    "Chevrolet", "Chrysler", "Citroen", "Cupra", "Dacia", "Fiat", "Ford", "Geely", 
    "Honda", "Hyundai", "Kia", "Lada", "Lancia", "Lexus", "Lotus", "Maserati", 
    "Mazda", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Opel", 
    "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Seat", "Skoda", "Smart", 
    "Subaru", "Suzuki", "Tesla", "Tofaş", "Toyota", "Volkswagen", "Volvo"
  ];

  const araziSuvMarkalar = ["Dacia", "Hyundai", "Jeep", "Land Rover", "Nissan"];
  const minivanVanMarkalar = ["Fiat", "Ford", "Renault", "Volkswagen"];

  // İstediğin tüm markaları ve logolarını ekledim
  const popülerMarkalar = [
    { name: "Hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
    { name: "Nissan", logo: "https://www.carlogos.org/car-logos/nissan-logo.png" },
    { name: "Fiat", logo: "https://www.carlogos.org/car-logos/fiat-logo.png" },
    { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
    { name: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
    { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
    { name: "Opel", logo: "https://www.carlogos.org/car-logos/opel-logo.png" },
    { name: "Seat", logo: "https://www.carlogos.org/car-logos/seat-logo.png" },
    { name: "Skoda", logo: "https://www.carlogos.org/car-logos/skoda-logo.png" },
    { name: "Renault", logo: "https://www.carlogos.org/car-logos/renault-logo.png" }
  ];

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-blue-200 shadow-lg group-hover:scale-110 transition-transform">
            <Car size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">
              bakimim<span className="text-blue-600">.com</span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Şen Kardeşler</span>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">
          <a href="#" className="hover:text-blue-600 transition">Anasayfa</a>
          <a href="#" className="hover:text-blue-600 transition">Hakkımızda</a>
          <a href="#" className="hover:text-blue-600 transition">İletişim</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[850px] flex items-center justify-center text-white text-center overflow-hidden py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')",
            filter: "brightness(0.35) contrast(1.1)" 
          }}
        />
        
        <div className="relative z-10 px-4 w-full max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
            Araç Bakım Fiyatlarını <br/> <span className="text-blue-400 font-sans">Karşılaştır!</span>
          </h1>
          
          {/* Arama Kutusu */}
          <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl max-w-6xl mx-auto border border-white/20 mb-10">
            <div className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shadow-inner text-left font-sans">
              
              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 transition-colors py-2 px-1">
                <LayoutGrid size={20} className="text-blue-500 mr-3 opacity-70" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Araç Grubu & Marka</label>
                  <select 
                    value={secilenMarka}
                    onChange={(e) => setSecilenMarka(e.target.value)}
                    className="bg-transparent text-gray-800 font-bold outline-none w-full cursor-pointer appearance-none"
                  >
                    <option value="">Seçim Yapınız</option>
                    <optgroup label="1. OTOMOBİL">
                      {otomobilMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
                    </optgroup>
                    <optgroup label="2. ARAZİ, SUV, PICKUP">
                      {araziSuvMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
                    </optgroup>
                    <optgroup label="3. MİNİVAN, VAN, PANELVAN">
                      {minivanVanMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 transition-colors py-2 px-1">
                <Car size={20} className="text-blue-500 mr-3 opacity-70" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Model</label>
                  <select className="bg-transparent text-gray-800 font-bold outline-none w-full cursor-pointer appearance-none">
                    <option>Model Seçin</option>
                    <option>Tucson</option>
                    <option>Qashqai</option>
                    <option>Duster</option>
                    <option>Doblo</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 transition-colors py-2 px-1">
                <MapPin size={20} className="text-blue-500 mr-3 opacity-70" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Şehir</label>
                  <select className="bg-transparent text-gray-800 font-bold outline-none w-full cursor-pointer appearance-none">
                    <option>Şehir Seçin</option>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>Antalya</option>
                  </select>
                </div>
              </div>

              <button className="bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-blue-500/50 shadow-lg transition-all active:scale-95 py-4">
                Fiyatları Bul
              </button>
            </div>
          </div>

          {/* Dinamik Logo Bölümü */}
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 drop-shadow-md">Popüler Markalarla Hızlı Arama</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto py-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-8">
            {popülerMarkalar.map((marka) => (
              <div 
                key={marka.name} 
                onClick={() => setSecilenMarka(marka.name)}
                className={`group cursor-pointer flex flex-col items-center gap-2 transition-all ${secilenMarka === marka.name ? 'scale-110' : ''}`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center p-3 shadow-lg transition-all border-2 ${secilenMarka === marka.name ? 'border-blue-500' : 'border-transparent'}`}>
                  <img src={marka.logo} alt={marka.name} className={`w-full h-auto object-contain transition-all ${secilenMarka === marka.name ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${secilenMarka === marka.name ? 'text-blue-400' : 'text-gray-300 group-hover:text-blue-400'}`}>
                  {marka.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-12 text-sm font-bold tracking-wide">
            <span className="flex items-center gap-2 text-white font-sans"><ShieldCheck className="text-blue-400" size={18}/> 500+ Bakım Fiyatı</span>
            <span className="flex items-center gap-2 text-white font-sans"><ShieldCheck className="text-blue-400" size={18}/> 30+ Şehirde Servis</span>
            <span className="flex items-center gap-2 text-white font-sans"><ShieldCheck className="text-blue-400" size={18}/> 100+ Marka & Model</span>
          </div>
        </div>
      </div>
    </main>
  );
}

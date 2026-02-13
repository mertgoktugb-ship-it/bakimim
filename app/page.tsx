import React from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid } from 'lucide-react';

export default function Home() {
  // Marka listeleri - parantez içindeki modelleri sildim
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
        <div className="hidden md:flex gap-10 text-sm font-bold text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-600 transition">Anasayfa</a>
          <a href="#" className="hover:text-blue-600 transition">Hakkımızda</a>
          <a href="#" className="hover:text-blue-600 transition">İletişim</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[650px] flex items-center justify-center text-white text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')",
            filter: "brightness(0.35) contrast(1.1)" 
          }}
        />
        
        <div className="relative z-10 px-4 w-full max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
            Araç Bakım Fiyatlarını <br/> <span className="text-blue-400">Karşılaştır!</span>
          </h1>
          
          {/* Arama Kutusu */}
          <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl max-w-6xl mx-auto border border-white/20">
            <div className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shadow-inner">
              
              {/* Marka Grubu Seçimi */}
              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 transition-colors py-2 px-1 text-left font-sans">
                <LayoutGrid size={20} className="text-blue-500 mr-3 opacity-70" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Araç Grubu & Marka</label>
                  <select className="bg-transparent text-gray-800 font-bold outline-none w-full cursor-pointer appearance-none">
                    <option>Seçim Yapınız</option>
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

              {/* Model Seçimi (Modeller Buraya Geldi) */}
              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 transition-colors py-2 px-1 text-left font-sans">
                <Car size={20} className="text-blue-500 mr-3 opacity-70" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Model</label>
                  <select className="bg-transparent text-gray-800 font-bold outline-none w-full cursor-pointer appearance-none">
                    <option>Model Seçin</option>
                    <option>Tucson</option>
                    <option>Qashqai</option>
                    <option>Duster</option>
                    <option>Doblo</option>
                    <option>Transit</option>
                    <option>Egea</option>
                  </select>
                </div>
              </div>

              {/* Şehir Seçimi */}
              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 transition-colors py-2 px-1 text-left font-sans">
                <MapPin size={20} className="text-blue-500 mr-3 opacity-70" />
                <div className="flex flex-col items-start w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Şehir</label>
                  <select className="bg-transparent text-gray-800 font-bold outline-none w-full cursor-pointer appearance-none">
                    <option>Şehir Seçin</option>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>Antalya</option>
                    <option>İzmir</option>
                  </select>
                </div>
              </div>

              {/* Buton */}
              <button className="bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-blue-500/50 shadow-lg transition-all active:scale-95 py-4">
                Fiyatları Bul
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-12 text-sm font-bold tracking-wide">
            <span className="flex items-center gap-2 text-white"><ShieldCheck className="text-blue-400" size={18}/> 500+ Bakım Fiyatı</span>
            <span className="flex items-center gap-2 text-white"><ShieldCheck className="text-blue-400" size={18}/> 30+ Şehirde Servis</span>
            <span className="flex items-center gap-2 text-white"><ShieldCheck className="text-blue-400" size={18}/> 100+ Marka & Model</span>
          </div>
        </div>
      </div>

      <div className="text-center py-20 bg-gray-50">
        <h2 className="text-4xl font-black text-slate-800 mb-2">Güvenilir Servis Fiyatlarını</h2>
        <span className="text-2xl font-bold text-blue-600 uppercase tracking-[0.3em]">Kolayca Öğrenin!</span>
      </div>
    </main>
  );
}

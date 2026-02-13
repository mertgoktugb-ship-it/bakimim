"use client";
import React, { useState } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [sonucGoster, setSonucGoster] = useState(false);

  // Bakım Verilerimiz (Senin ve Ömer'in derlediği veriler)
  const bakimVerileri = {
    "Tucson": {
      fiyat: "11.500 TL - 13.000 TL",
      icerik: "Yağ, Yağ Filtresi, Polen, Hava Filtresi, Karter Tapası",
      not: "Antalya ve İstanbul servislerinde küçük farklar olabilir.",
      km: "20.000 KM Bakımı"
    },
    "Qashqai": {
      fiyat: "10.800 TL - 12.500 TL",
      icerik: "Yağ, Yağ Filtresi, Hava Filtresi, Mazot Filtresi",
      not: "Dizel modellerde mazot filtresi fiyata dahildir.",
      km: "15.000 KM Bakımı"
    }
  };

  const markalar = ["Audi", "BMW", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Mercedes-Benz", "Nissan", "Opel", "Renault", "Seat", "Skoda", "Toyota", "Volkswagen"];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar ve Hero Alanı (Önceki tasarımın aynısı kalıyor) */}
      <nav className="flex items-center justify-between px-10 py-5 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
            <Car size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">bakimim<span className="text-blue-600">.com</span></span>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase text-left">Şen Kardeşler</span>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-bold text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-600 transition">Anasayfa</a>
          <a href="#" className="hover:text-blue-600 transition">Hakkımızda</a>
        </div>
      </nav>

      <section className="relative min-h-[700px] flex flex-col items-center justify-center text-center overflow-hidden py-16 px-4">
        {/* Arka Plan */}
        <div className="absolute inset-0 bg-cover bg-center z-0 scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')", filter: "brightness(0.35)" }} />
        
        <div className="relative z-10 w-full max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">Araç Bakım Fiyatlarını <br/> <span className="text-blue-400">Karşılaştır!</span></h1>
          
          {/* Arama Kutusu */}
          <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl max-w-6xl mx-auto border border-white/20 mb-10">
            <div className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shadow-inner text-left">
              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 py-2">
                <LayoutGrid size={20} className="text-blue-500 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Marka</label>
                  <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="bg-transparent text-gray-800 font-bold outline-none cursor-pointer">
                    <option value="">Seçiniz</option>
                    {markalar.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 py-2">
                <Car size={20} className="text-blue-500 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Model</label>
                  <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="bg-transparent text-gray-800 font-bold outline-none cursor-pointer">
                    <option value="">Seçiniz</option>
                    <option value="Tucson">Tucson</option>
                    <option value="Qashqai">Qashqai</option>
                    <option value="Duster">Duster</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center group border-b-2 border-gray-100 hover:border-blue-500 py-2">
                <MapPin size={20} className="text-blue-500 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Şehir</label>
                  <select className="bg-transparent text-gray-800 font-bold outline-none cursor-pointer"><option>İstanbul</option><option>Antalya</option></select>
                </div>
              </div>

              <button 
                onClick={() => setSonucGoster(true)}
                className="bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg active:scale-95 py-4 flex items-center justify-center gap-2"
              >
                <Search size={20} /> Fiyatları Bul
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SONUÇ TABLOSU (Veriler Buraya Geliyor) */}
      {sonucGoster && bakimVerileri[secilenModel] && (
        <section className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase">{secilenMarka} {secilenModel}</h2>
                <p className="opacity-90 font-bold">{bakimVerileri[secilenModel].km}</p>
              </div>
              <CheckCircle2 size={48} className="opacity-20" />
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-8 pb-8 border-b border-gray-100">
                <div className="text-center md:text-left">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Ortalama Bakım Ücreti</p>
                  <p className="text-5xl font-black text-blue-600">{bakimVerileri[secilenModel].fiyat}</p>
                </div>
                <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                  <ShieldCheck size={20} /> Yetkili Servis Onaylı Veri
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2 underline decoration-blue-500">
                    <Wrench size={18} /> Bakım İçeriği
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{bakimVerileri[secilenModel].icerik}</p>
                </div>
                <div className="bg-yellow-50 p-5 rounded-2xl border-l-4 border-yellow-400">
                  <h3 className="text-yellow-800 font-black mb-2 flex items-center gap-2 text-sm uppercase">
                    <AlertTriangle size={16} /> Şen Kardeşler Notu
                  </h3>
                  <p className="text-yellow-700 text-sm font-medium">{bakimVerileri[secilenModel].not}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

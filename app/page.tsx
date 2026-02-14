"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Wrench, Search, Building2, Calendar, Gauge, CheckCircle2, AlertTriangle, ArrowRight, LayoutGrid } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);

  const tumMarkalar = Array.from(new Set((bakimData as any[]).map(item => item.marka))).sort();
  const tumSehirler = Array.from(new Set((bakimData as any[]).map(item => item.sehir))).filter(s => s !== "bilinmiyor").sort();

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

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set((bakimData as any[]).filter(item => item.marka === secilenMarka).map(item => item.model))).sort();
      setMusaitModeller(modeller);
    } else {
      setMusaitModeller([]);
    }
    setSecilenModel(""); 
  }, [secilenMarka]);

  const sorgula = () => {
    const filtrelenmis = (bakimData as any[]).filter(item => {
      const markaUygun = !secilenMarka || item.marka === secilenMarka;
      const modelUygun = !secilenModel || item.model === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  return (
    <main className="min-h-screen bg-[#F1F5F9] font-sans antialiased text-slate-900 text-left">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-left">
          <div className="flex items-center gap-3">
             <div className="bg-[#1E293B] p-2 rounded-lg text-white"><Car size={22} /></div>
             <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter italic">bakimim<span className="text-blue-600">.com</span></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Şen Kardeşler</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Alanı: Yazı Geri Geldi */}
      <div className="bg-[#0F172A] py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 grayscale bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight uppercase">
            Aracınız İçin Son <br/> <span className="text-blue-400 italic">Bakım Fiyatlarını Görün!</span>
          </h1>
          
          <div className="bg-white p-2 rounded-[2rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-3 bg-slate-50 border-r border-slate-100 rounded-l-xl font-bold text-sm outline-none">
                  <option value="">Tüm Markalar</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-3 bg-slate-50 border-r border-slate-100 font-bold text-sm outline-none">
                  <option value="">Tüm Modeller</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-3 bg-slate-50 font-bold text-sm outline-none">
                  <option value="">Tüm Şehirler</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl py-3 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <Search size={18} /> Sorgula
              </button>
          </div>

          {/* Marka Logoları Geri Geldi */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            {popülerMarkalar.map((marka) => (
              <div key={marka.name} onClick={() => setSecilenMarka(marka.name)} className="group cursor-pointer flex flex-col items-center gap-2">
                <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center p-3 shadow-lg transition-all border-2 ${secilenMarka === marka.name ? 'border-blue-400 scale-110' : 'border-transparent group-hover:border-blue-200'}`}>
                  <img src={marka.logo} alt={marka.name} className={`w-full h-full object-contain ${secilenMarka === marka.name ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${secilenMarka === marka.name ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>{marka.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İlan Listesi */}
      <section className="max-w-6xl mx-auto py-10 px-6">
        {sonuclar.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{sonuclar.length} Kayıt Bulundu</h2>
            {sonuclar.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all overflow-hidden flex flex-col md:flex-row items-stretch">
                <div className="p-6 md:w-64 bg-slate-50/50 flex flex-col justify-center border-r border-slate-100 text-left">
                  <span className={`w-fit px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-2 ${item.yetkili_mi === 'Evet' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.yetkili_mi === 'Evet' ? 'Yetkili Servis' : 'Özel Servis'}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 uppercase leading-none">{item.marka} {item.model}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold mt-3">
                    <MapPin size={12} className="text-blue-500" /> {item.sehir}
                  </div>
                </div>
                <div className="p-6 flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-left">
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Araç KM</span><p className="text-sm font-bold text-slate-700">{item.km} KM</p></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tarih</span><p className="text-sm font-bold text-slate-700">{item.tarih}</p></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Servis</span><p className="text-sm font-bold text-blue-600 truncate">{item.servis_adi}</p></div>
                  <div className="flex flex-col items-end"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fiyat</span><p className="text-xl font-black text-slate-900">{item.fiyat_tl} TL</p></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest">Sorgu Sonuçları Burada Listelenecek</p>
          </div>
        )}
      </section>

      <footer className="py-10 text-center text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">
        © 2026 Şen Kardeşler - bakimim.com
      </footer>
    </main>
  );
}

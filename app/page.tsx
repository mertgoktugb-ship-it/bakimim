"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid, CheckCircle2, AlertTriangle, Building2, ChevronDown } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);

  // Veri tabanındaki tüm benzersiz markaları çek
  const tumMarkalar = Array.from(new Set((bakimData as any[]).map(item => item.marka))).sort();
  
  // Veri tabanındaki tüm benzersiz şehirleri çek
  const tumSehirler = Array.from(new Set((bakimData as any[]).map(item => item.sehir))).filter(s => s !== "bilinmiyor").sort();

  // Marka seçildiğinde o markaya ait benzersiz modelleri filtrele
  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(
        (bakimData as any[])
          .filter(item => item.marka === secilenMarka)
          .map(item => item.model)
      )).sort();
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
    <main className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 text-left">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-[#1E293B] p-2 rounded-xl text-white shadow-lg"><Car size={24} /></div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#1E293B]">bakimim<span className="text-blue-600">.com</span></span>
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none">Şen Kardeşler</span>
          </div>
        </div>
      </nav>

      {/* Hero & Arama Kutusu */}
      <section className="relative min-h-[600px] flex flex-col items-center justify-center text-center py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A] z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 to-slate-50" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-[800] text-white mb-10 tracking-tight leading-tight">Bakım Maliyetini <br/><span className="text-blue-400 italic">Şeffafça Görün!</span></h1>
          
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl max-w-6xl mx-auto border border-slate-200">
            <div className="bg-slate-50 p-6 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <LayoutGrid size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marka</label>
                  <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer w-full appearance-none">
                    <option value="">Tüm Markalar</option>
                    {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <Car size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Model</label>
                  <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer w-full appearance-none">
                    <option value="">Tüm Modeller</option>
                    {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2">
                <MapPin size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Şehir</label>
                  <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer w-full appearance-none">
                    <option value="">Tüm Şehirler</option>
                    {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={sorgula} className="bg-[#1E293B] hover:bg-slate-800 text-white rounded-2xl font-bold py-4 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                <Search size={18} /> Sorgula
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sonuç Listesi */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        {sonuclar.length > 0 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{sonuclar.length} Kayıt Bulundu</p>
            {sonuclar.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-2xl">
                <div className="bg-[#1E293B] p-8 text-white md:w-80 flex flex-col justify-center border-r border-white/10">
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.servis_tipi === 'Yetkili Servis' ? 'bg-blue-500' : 'bg-amber-500 text-slate-900'}`}>
                      {item.servis_tipi}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{item.marka} {item.model}</h2>
                  <p className="text-blue-400 font-bold text-sm mt-1">{item.bakim_turu}</p>
                  <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={14} className="text-blue-500" /> {item.sehir} {item.ilce !== "bilinmiyor" ? `/ ${item.ilce}` : ''}
                  </div>
                </div>

                <div className="p-10 flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-50 pb-8 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Servis Noktası</p>
                      <p className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Building2 size={20} className="text-blue-600" /> {item.bayi_adi}
                      </p>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bakım Fiyatı</p>
                      <p className="text-3xl font-black text-[#1E293B] tracking-tighter">{item.fiyat_tl ? `${item.fiyat_tl} TL` : item.fiyat}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-[11px] font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Wrench size={14} className="text-blue-500" /> Yapılan İşlemler
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(item.yapilan_islemler) ? item.yapilan_islemler.map((islem: string, i: number) => (
                          <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-lg border border-slate-200">{islem}</span>
                        )) : <p className="text-slate-500 text-sm italic">{item.icerik}</p>}
                      </div>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                      <h3 className="text-[11px] font-black text-blue-900 mb-2 flex items-center gap-2 uppercase tracking-widest">
                        <AlertTriangle size={14} className="text-blue-600" /> Şen Kardeşler Notu
                      </h3>
                      <p className="text-blue-800/70 text-xs font-semibold leading-relaxed italic">"{item.not}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Search size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Arama kriterlerine uygun kayıt bulunamadı.</p>
          </div>
        )}
      </section>

      <footer className="py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
        © 2026 Şen Kardeşler - bakimim.com
      </footer>
    </main>
  );
}

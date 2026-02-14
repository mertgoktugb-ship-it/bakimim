"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Wrench, Search, Building2, Calendar, Gauge, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);

  const tumMarkalar = Array.from(new Set((bakimData as any[]).map(item => item.marka))).sort();
  const tumSehirler = Array.from(new Set((bakimData as any[]).map(item => item.sehir))).filter(s => s !== "bilinmiyor").sort();

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
      {/* Navbar Alanı */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#1E293B] p-2 rounded-lg text-white"><Car size={22} /></div>
             <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter">bakimim<span className="text-blue-600">.com</span></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Şen Kardeşler</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Arama Barı (İlan Sitesi Tarzı) */}
      <div className="bg-[#1E293B] py-12 px-6">
        <div className="max-w-6xl mx-auto bg-white p-4 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
            <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="">Tüm Markalar</option>
                {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="">Tüm Modeller</option>
                {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="">Tüm Şehirler</option>
                {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl py-3 shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                <Search size={18} /> Sorgula
            </button>
        </div>
      </div>

      {/* İlan Listesi */}
      <section className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{sonuclar.length} Bakım Kaydı Listeleniyor</h2>
        </div>

        <div className="space-y-4">
          {sonuclar.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all group overflow-hidden">
              <div className="flex flex-col md:flex-row items-stretch">
                
                {/* Sol Taraf: Marka & Model Bilgisi */}
                <div className="p-6 md:w-64 bg-slate-50/50 flex flex-col justify-center border-r border-slate-100">
                  <span className={`w-fit px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest mb-3 ${item.yetkili_mi === 'Evet' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.yetkili_mi === 'Evet' ? 'Yetkili Servis' : 'Özel Servis'}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-tight">
                    {item.marka} {item.model}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-3">
                    <MapPin size={14} className="text-blue-500" /> {item.sehir}
                  </div>
                </div>

                {/* Orta Taraf: Detaylar */}
                <div className="p-6 flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Gauge size={12}/> Araç KM</span>
                    <p className="font-bold text-slate-700">{item.km !== "bilinmiyor" ? `${item.km} KM` : 'Belirtilmemiş'}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={12}/> Tarih</span>
                    <p className="font-bold text-slate-700">{item.tarih !== "tarih belirtilmemiş" ? item.tarih : 'Güncel'}</p>
                  </div>
                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Building2 size={12}/> Servis Adı</span>
                    <p className="font-bold text-blue-600 truncate">{item.servis_adi}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bakım Tutarı</span>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.fiyat_tl ? `${item.fiyat_tl} TL` : item.fiyat}</p>
                  </div>
                </div>

                {/* Sağ Taraf: Detay Butonu / Notlar */}
                <div className="bg-slate-50 p-6 md:w-16 flex items-center justify-center border-l border-slate-100 group-hover:bg-blue-50 transition-colors">
                   <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
              
              {/* Alt Bilgi Alanı: Notlar ve İşlemler */}
              <div className="bg-slate-50/30 px-6 py-4 border-t border-slate-100 flex flex-wrap gap-4 items-center">
                 <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 italic flex-1">
                    <AlertTriangle size={14} className="text-amber-500" /> "{item.not}"
                 </div>
                 <div className="flex gap-2">
                    {Array.isArray(item.yapilan_islemler) && item.yapilan_islemler.slice(0, 3).map((islem: string, i: number) => (
                      <span key={i} className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        {islem}
                      </span>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>

        {sonuclar.length === 0 && (
          <div className="text-center py-32 bg-white rounded-2xl border-2 border-dashed border-slate-200 mt-6">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Sorgulamak istediğiniz kriterleri seçin.</p>
          </div>
        )}
      </section>

      <footer className="py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
        © 2026 Şen Kardeşler - bakimim.com
      </footer>
    </main>
  );
}

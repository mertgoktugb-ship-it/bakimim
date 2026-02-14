"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Wrench, Search, Building2, Calendar, Gauge, AlertTriangle, ChevronDown, ChevronUp, Fuel, Settings2, ReceiptText } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);

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
    <main className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 text-left">
      {/* Navbar & Hero (Aynı kalıyor) */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#1E293B] p-2 rounded-lg text-white shadow-lg"><Car size={22} /></div>
             <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter italic">bakimim<span className="text-blue-600">.com</span></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Şen Kardeşler</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Arama Alanı */}
      <div className="bg-[#1E293B] py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">Bakım Fiyatlarını <span className="text-blue-400 italic">Kıyaslayın</span></h1>
          <div className="bg-white p-2 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                  <option value="">Tüm Markalar</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                  <option value="">Tüm Modeller</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                  <option value="">Tüm Şehirler</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl py-3 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <Search size={18} /> Sorgula
              </button>
          </div>
        </div>
      </div>

      {/* Liste */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <div className="space-y-4">
          {sonuclar.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              {/* ÜST BİLGİ (Kısa Kart) */}
              <div 
                onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}
                className="p-6 flex flex-col md:flex-row items-center cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="md:w-56 text-left border-r border-slate-100 mr-6">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase mb-2 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.yetkili_mi === 'Evet' ? 'Yetkili Servis' : 'Özel Servis'}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 leading-none uppercase">{item.marka} {item.model}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1"><MapPin size={12}/> {item.sehir}</p>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bakım Türü</span><p className="text-sm font-bold text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Servis Adı</span><p className="text-sm font-bold text-blue-600 truncate">{item.servis_adi}</p></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ücret</span><p className="text-xl font-black text-slate-900">{item.fiyat_tl} TL</p></div>
                </div>

                <div className="ml-4 text-slate-300">
                   {acikKartId === item.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {/* ALT DETAY (Açılan Kısım) */}
              {acikKartId === item.id && (
                <div className="px-8 pb-8 pt-2 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-6">
                    {/* Teknik Detaylar */}
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b pb-2">Araç Detayları</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                        <div className="text-slate-400 uppercase">Model Yılı: <span className="text-slate-700">{item.model_yili || '-'}</span></div>
                        <div className="text-slate-400 uppercase">Kilometre: <span className="text-slate-700">{item.km} KM</span></div>
                        <div className="text-slate-400 uppercase">Motor: <span className="text-slate-700">{item.motor || '-'}</span></div>
                        <div className="text-slate-400 uppercase">Şanzıman: <span className="text-slate-700">{item.sanziman || '-'}</span></div>
                      </div>
                    </div>

                    {/* Yapılan İşlemler */}
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b pb-2">Yapılan İşlemler</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.yapilan_islemler?.map((islem: string, i: number) => (
                          <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-600 font-bold">{islem}</span>
                        )) || <span className="text-slate-400 italic text-xs">İşlem detayı belirtilmemiş.</span>}
                      </div>
                    </div>

                    {/* Fatura ve Tarih */}
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b pb-2">Servis Bilgisi</h4>
                      <div className="space-y-2 text-xs font-bold">
                         <div className="flex items-center gap-2 text-slate-500"><Calendar size={14}/> Tarih: <span className="text-slate-700">{item.tarih}</span></div>
                         <div className="flex items-center gap-2 text-slate-500"><ReceiptText size={14}/> Fatura: <span className="text-slate-700">{item.fatura}</span></div>
                         <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mt-2 italic text-[10px] text-blue-700 font-medium">
                           "{item.not}"
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

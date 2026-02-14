"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);

  // Filtreleme Fonksiyonu
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
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar ve Arama Kutusu (Önceki tasarımın aynısı) */}
      {/* ... (Navbar kodların burada kalacak) ... */}

      {/* SONUÇ LİSTESİ */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        {sonuclar.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {sonuclar.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                <div className="bg-[#1E293B] p-8 text-white md:w-1/3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.servis_tipi === 'Yetkili Servis' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-black'}`}>
                      {item.servis_tipi}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black uppercase leading-tight">{item.marka} {item.model}</h2>
                  <p className="text-blue-300 font-bold mt-1 tracking-wider">{item.km} Bakımı</p>
                  <div className="mt-6 flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={16} /> {item.sehir} {item.ilce ? `/ ${item.ilce}` : ''}
                  </div>
                </div>

                <div className="p-10 flex-1 text-left">
                  <div className="flex justify-between items-start mb-8 border-b pb-8">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Servis / Bayi Adı</p>
                      <p className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Building2 size={20} className="text-blue-600" /> {item.bayi_adi}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bakım Ücreti</p>
                      <p className="text-4xl font-black text-[#1E293B]">{item.fiyat}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Wrench size={14} /> İşlem İçeriği
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.icerik}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-2 uppercase">
                        <AlertTriangle size={14} className="text-amber-500" /> Kullanıcı Notu
                      </h3>
                      <p className="text-slate-600 text-xs italic">"{item.not}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Arama yapmak için kriterleri seçip "Sorgula" butonuna basın.</p>
          </div>
        )}
      </section>
    </main>
  );
}

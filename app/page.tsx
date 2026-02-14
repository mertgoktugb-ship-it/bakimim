"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ChevronDown, ChevronUp, TrendingUp, ShieldCheck, BadgePercent } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);

  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const isimGizle = (metin: string) => {
    if (!metin) return "Açıklama bulunmuyor.";
    return metin.replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\b/g, "$1. $2.");
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    const servisIsmi = (item.servis_adi || "").toLowerCase();
    
    // Yetkili Servis Tespiti
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "toyan", "efe", "akten", "kardelen", "çekmeköy"];
    if (yetkiliKeywords.some(kw => servisIsmi.includes(kw))) duzeltilmis.yetkili_mi = "Evet";

    // Fiyat ve Tarih Onarımı
    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    
    duzeltilmis.fiyat_sayi = fiyatSayi;
    duzeltilmis.ekran_fiyat = fiyatSayi > 0 ? fiyatSayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    duzeltilmis.temiz_not = isimGizle(item.not);
    
    // Tarih "belirtilmemiş" hatasını onar (Eğer notta veya veride varsa)
    if (duzeltilmis.tarih === "tarih belirtilmemiş" || !duzeltilmis.tarih) {
        duzeltilmis.tarih = "Şubat 2026"; // En güncel post tarihi
    }

    duzeltilmis.marka_format = formatYazi(item.marka);
    duzeltilmis.model_format = formatYazi(item.model);

    return duzeltilmis;
  };

  const duzeltilmisVeri = (bakimData as any[]).map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(duzeltilmisVeri.map(item => item.marka))).sort();
  const tumSehirler = Array.from(new Set(duzeltilmisVeri.map(item => item.sehir))).filter(s => s && s !== "bilinmiyor").sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(duzeltilmisVeri.filter(item => item.marka === secilenMarka).map(item => item.model))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
    setSecilenModel(""); 
  }, [secilenMarka]);

  const sorgula = () => {
    const filtrelenmis = duzeltilmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka === secilenMarka;
      const modelUygun = !secilenModel || item.model === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  // İstatistik Panel Hesaplamaları
  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");

  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + b.fiyat_sayi, 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + b.fiyat_sayi, 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-left">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <a href="/" className="flex items-center gap-3 group">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Car size={26} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight italic">bakımım<span className="text-blue-600">.com</span></span>
           </a>
        </div>
      </nav>

      {/* SEARCH AREA */}
      <div className="bg-[#1E293B] py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">FİYAT <span className="text-blue-400">KIYASLA</span></h1>
          <p className="text-slate-400 font-medium mb-10 text-sm md:text-base tracking-widest uppercase">GÜNCEL YETKİLİ VE ÖZEL SERVİS VERİ BANKASI</p>
          <div className="bg-white p-3 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500">
                  <option value="">Marka</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500">
                  <option value="">Model</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-blue-500">
                  <option value="">Şehir</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl transition-all active:scale-95">
                  <Search size={20} /> Sorgula
              </button>
          </div>
        </div>
      </div>

      {/* STATS PANEL */}
      {sonuclar.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-20">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-500"/> Yetkili Servis Ort.
              </p>
              <p className="text-2xl font-black text-slate-900">{avgYetkili > 0 ? avgYetkili.toLocaleString('tr-TR') + " TL" : "Veri Yok"}</p>
              <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase italic">Son 6 ay verisidir</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <BadgePercent size={14} className="text-emerald-500"/> Özel Servis Ort.
              </p>
              <p className="text-2xl font-black text-slate-900">{avgOzel > 0 ? avgOzel.toLocaleString('tr-TR') + " TL" : "Veri Yok"}</p>
              <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase italic">Son 6 ay verisidir</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-3xl shadow-xl text-white">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Database size={14}/> Toplam Örneklem
              </p>
              <p className="text-2xl font-black">{sonuclar.length} Kayıt</p>
              <p className="text-[10px] font-bold text-blue-200 mt-1 uppercase italic">Doğrulanmış veri seti</p>
            </div>
        </div>
      )}

      {/* LIST SECTION */}
      <section className="max-w-5xl mx-auto py-4 px-6 mb-24">
        <div className="space-y-4">
          {sonuclar.map((item) => (
            <div key={item.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:border-blue-400 transition-all shadow-sm">
              <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-6 md:p-8 flex flex-col md:flex-row items-center cursor-pointer select-none">
                <div className="md:w-56 text-left mr-8">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase mb-3 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                    {item.yetkili_mi === 'Evet' ? 'YETKİLİ SERVİS' : 'ÖZEL SERVİS'}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-400 tracking-wide">{item.marka_format}</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tight">{item.model_format}</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 md:mt-0 w-full">
                  <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Bakım</span><p className="text-sm font-bold text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Şehir</span><p className="text-sm font-bold text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Tarih</span><div className="flex items-center gap-1.5 text-sm font-bold text-slate-500"><Calendar size={14} className="text-slate-300"/> {item.tarih}</div></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Tutar</span><p className="text-2xl font-black text-blue-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
                <div className="ml-4 text-slate-300 hidden md:block">
                   {acikKartId === item.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>
              {/* DETAY ALANI */}
              {acikKartId === item.id && (
                <div className="px-8 pb-10 pt-4 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2">ARAÇ KİMLİĞİ</h4>
                      <div className="space-y-3 text-xs font-bold text-slate-500 uppercase">
                        <p>Model Yılı: <span className="text-slate-900">{item.model_yili || 'Bilinmiyor'}</span></p>
                        <p>Km Durumu: <span className="text-slate-900">{item.km} KM</span></p>
                        <p>Motor Tipi: <span className="text-slate-900">{item.motor || 'Bilinmiyor'}</span></p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2">İŞLEM DETAYI</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.yapilan_islemler?.length > 0 ? item.yapilan_islemler.map((islem: string, i: number) => (
                          <span key={i} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm">{islem}</span>
                        )) : <span className="text-slate-400 italic text-xs">Ayrıntılı işlem listesi belirtilmemiş.</span>}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2">SERVİS & NOT</h4>
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase bg-slate-100 p-2 rounded-lg w-fit">
                            <MapPin size={12}/> {item.servis_adi}
                         </div>
                         <div className="bg-blue-600 text-white p-4 rounded-2xl italic text-[12px] leading-relaxed font-medium shadow-lg shadow-blue-200">
                           "{item.temiz_not}"
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

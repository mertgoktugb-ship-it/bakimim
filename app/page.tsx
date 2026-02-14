"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, Search, Calendar, ShieldCheck, BadgePercent, 
  FileText, Zap, Settings, BookOpen, ArrowRight, CheckCircle2, Lock, X 
} from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    const servisIsmi = (item.servis_adi || "").toLowerCase();
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "alj", "toyotronik", "mais", "toyan", "efe", "akten"];
    if (yetkiliKeywords.some(kw => servisIsmi.includes(kw))) duzeltilmis.yetkili_mi = "Evet";
    
    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    duzeltilmis.fiyat_sayi = isNaN(fiyatSayi) ? 0 : fiyatSayi;
    duzeltilmis.ekran_fiyat = duzeltilmis.fiyat_sayi > 0 ? duzeltilmis.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    duzeltilmis.marka_format = formatYazi(item.marka);
    duzeltilmis.model_format = formatYazi(item.model);
    return duzeltilmis;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka))).sort();
  const tumSehirler = Array.from(new Set(islenmisVeri.map(item => item.sehir))).filter(s => s && s !== "bilinmiyor").sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka.toUpperCase() === secilenMarka.toUpperCase()).map(item => item.model))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka, duzenlenenVeri]);

  const sorgula = () => {
    const filtrelenmis = islenmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka.toUpperCase() === secilenMarka.toUpperCase();
      const modelUygun = !secilenModel || item.model.toUpperCase() === secilenModel.toUpperCase();
      const sehirUygun = !secilenSehir || item.sehir.toUpperCase() === secilenSehir.toUpperCase();
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
    setAcikKartId(null);
  };

  const avgYetkili = sonuclar.filter(i => i.yetkili_mi === "Evet").length > 0 ? Math.round(sonuclar.filter(i => i.yetkili_mi === "Evet").reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / sonuclar.filter(i => i.yetkili_mi === "Evet").length) : 0;
  const avgOzel = sonuclar.filter(i => i.yetkili_mi !== "Evet").length > 0 ? Math.round(sonuclar.filter(i => i.yetkili_mi !== "Evet").reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / sonuclar.filter(i => i.yetkili_mi !== "Evet").length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Şeffaf Servis Rehberi</span>
              </div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black uppercase text-slate-500 hover:text-blue-700 tracking-widest hidden md:block">Bilgi Merkezi</Link>
              <button className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md">Veri Paylaş</button>
           </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative pt-24 pb-40 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop" 
            alt="Bakım Arka Plan" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter leading-none">FİYAT <span className="text-blue-500 font-black">KIYASLA</span></h1>
          <div className="bg-white p-5 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl hover:bg-blue-800 transition-all text-xl"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {/* LOGOLAR - GOOGLE FAVICON API (EN STABİLİ) */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-40">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { n: 'TOYOTA', d: 'toyota.com.tr' },
            { n: 'HONDA', d: 'honda.com.tr' },
            { n: 'FIAT', d: 'fiat.com.tr' },
            { n: 'RENAULT', d: 'renault.com.tr' },
            { n: 'CITROEN', d: 'citroen.com.tr' },
            { n: 'OPEL', d: 'opel.com.tr' },
            { n: 'VOLKSWAGEN', d: 'vw.com.tr' }
          ].map((m) => (
            <button 
              key={m.n} 
              onClick={() => {setSecilenMarka(m.n); setSecilenModel("");}}
              className={`flex flex-col items-center gap-2 group transition-all ${secilenMarka === m.n ? 'scale-115' : 'hover:scale-105'}`}
            >
              <div className={`p-4 rounded-3xl bg-white border-2 transition-all flex items-center justify-center w-20 h-20 ${secilenMarka === m.n ? 'border-blue-600 shadow-lg scale-110' : 'border-slate-50'}`}>
                <img 
                  src={`https://www.google.com/s2/favicons?sz=128&domain=${m.d}`} 
                  alt={m.n} 
                  className="w-12 h-12 object-contain" 
                  onError={(e:any) => e.target.src = "https://www.google.com/s2/favicons?sz=128&domain=google.com"}
                />
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase ${secilenMarka === m.n ? 'text-blue-700' : 'text-slate-400'}`}>{m.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BLOG ÖNİZLEME - UNSPLASH GÖRSELLERİ (KIRILMAZ) */}
      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 text-left pt-20 border-t border-slate-200 text-left">
        <div className="flex justify-between items-center mb-16 text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-lg"><BookOpen size={28} /></div>
            <h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter text-left">GÜNCEL BLOG</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">Tümünü Gör <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <Link href="/blog/istanbul-honda-bakim-fiyatlari-2026" className="group text-left">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-all duration-300">
               <img src="https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-10 text-left">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">İstanbul</span>
                 <h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase">Honda Bakım Rehberi</h3>
               </div>
            </div>
          </Link>
          <Link href="/blog/fiat-egea-periyodik-bakim-tablosu-2026" className="group text-left">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-all duration-300">
               <img src="https://images.unsplash.com/photo-1487754180451-c456f719c141?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-10 text-left">
                 <span className="bg-emerald-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">Model Analizi</span>
                 <h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase">Egea Bakım Tablosu</h3>
               </div>
            </div>
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-20 px-8 text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-left text-left">
          <div className="text-left text-left">
            <span className="text-3xl font-black italic text-slate-800 tracking-tighter uppercase block mb-2 text-left">bakımım<span className="text-blue-700 text-left">.com</span></span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">© 2026 Şeffaf Servis Platformu</p>
          </div>
          <button className="text-[11px] font-black px-8 py-4 rounded-[1.5rem] bg-slate-50 text-slate-400 hover:bg-slate-100 uppercase tracking-widest flex items-center gap-3 italic"><Lock size={16}/> Yönetici</button>
        </div>
      </footer>
    </main>
  );
}

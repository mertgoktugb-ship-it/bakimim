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

  const yetkiliGrup = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelGrup = sonuclar.filter(i => i.yetkili_mi !== "Evet");
  const avgYetkili = yetkiliGrup.length > 0 ? Math.round(yetkiliGrup.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliGrup.length) : 0;
  const avgOzel = ozelGrup.length > 0 ? Math.round(ozelGrup.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelGrup.length) : 0;

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

      {/* LOGOLAR */}
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
                />
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase ${secilenMarka === m.n ? 'text-blue-700' : 'text-slate-400'}`}>{m.n}</span>
            </button>
          ))}
          {secilenMarka && (
             <button onClick={() => {setSecilenMarka(""); setSecilenModel(""); setSonuclar([]);}} className="flex flex-col items-center gap-2 group transition-all">
                <div className="p-4 rounded-3xl bg-red-50 text-red-500 border-2 border-transparent group-hover:bg-red-100 transition-all w-20 h-20 flex items-center justify-center"><X size={32}/></div>
                <span className="text-[10px] font-black text-red-500 tracking-widest uppercase">Kaldır</span>
             </button>
          )}
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600"/> Yetkili Servis Ortalaması
              </p>
              <p className="text-5xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500"/> Özel Servis Ortalaması
              </p>
              <p className="text-5xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      {/* SONUÇ LİSTESİ */}
      <section className="max-w-5xl mx-auto px-6 space-y-6 mt-16 text-left">
        {sonuclar.length > 0 ? (
          sonuclar.map((item) => (
            <div key={item.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all">
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center cursor-pointer text-left" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>
                  <div className="md:w-72 mr-10 text-left">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                    <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter text-left">{item.model_format}</h2>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full font-black uppercase italic text-left">
                    <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 tracking-widest text-left">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                    <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 tracking-widest text-left">Şehir</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                    <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 tracking-widest text-left">Zaman</span><p className="text-base text-slate-500">{item.tarih || "Şubat 2026"}</p></div>
                    <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] text-slate-300 mb-2 tracking-widest text-left">Fiyat</span><p className="text-4xl font-black text-blue-700 tracking-tighter text-left">{item.ekran_fiyat}</p></div>
                  </div>
              </div>
              {acikKartId === item.id && (
                <div className="p-12 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                  <div className="space-y-3 uppercase font-bold text-left"><p className="text-[11px] font-black text-slate-400 tracking-widest border-b pb-2 mb-4 text-left">Detaylar</p><p className="text-sm">Motor: <span className="text-slate-900">{item.motor || '-'}</span></p><p className="text-sm">Kilometre: <span className="text-slate-900">{item.km} KM</span></p></div>
                  <div className="space-y-3 uppercase font-bold text-left"><p className="text-[11px] font-black text-slate-400 tracking-widest border-b pb-2 mb-4 text-left">Servis</p><p className="text-sm">İsim: <span className="text-slate-900">{item.servis_adi}</span></p></div>
                  <div className="bg-[#0f172a] text-white p-8 rounded-[2.5rem] shadow-xl text-left italic">
                    <p className="text-left font-medium">"{item.not || "Bakım kayıtları doğrulanmış kullanıcı verisidir."}"</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          secilenMarka && <div className="py-20 text-center text-slate-300 font-black uppercase italic tracking-widest">Arama Sonucu Yok</div>
        )}
      </section>

      {/* BLOG ÖNİZLEME */}
      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 text-left pt-20 border-t border-slate-200">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-lg"><BookOpen size={28} /></div>
            <h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter text-left">GÜNCEL BLOG</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">Tümünü Gör <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <Link href="/blog/istanbul-honda-bakim-fiyatlari-2026" className="group">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-all duration-300">
               <img src="https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-10 text-left">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase text-left">İstanbul</span>
                 <h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase text-left">Honda Bakım Rehberi</h3>
               </div>
            </div>
          </Link>
          <Link href="/blog/fiat-egea-periyodik-bakim-tablosu-2026" className="group text-left">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-all duration-300">
               <img src="https://images.unsplash.com/photo-1487754180451-c456f719c141?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-10 text-left">
                 <span className="bg-emerald-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase text-left">Model Analizi</span>
                 <h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase text-left">Egea Bakım Tablosu</h3>
               </div>
            </div>
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-20 px-8 text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-left">
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

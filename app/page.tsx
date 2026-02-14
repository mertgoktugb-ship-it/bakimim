"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, Search, Calendar, ShieldCheck, BadgePercent, 
  Edit3, X, Check, FileText, Upload, Zap, Settings, 
  Lock, Save, BookOpen, ArrowRight, CheckCircle2
} from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getMarkaIcon = (marka: string) => {
    const m = (marka || "").toLowerCase();
    if (m.includes('toyota') || m.includes('honda')) return <Zap size={20} className="text-blue-500" />;
    return <Settings size={20} className="text-slate-400" />;
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    const servisIsmi = (item.servis_adi || "").toLowerCase();
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "alj", "toyotronik", "mais", "toyan"];
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
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka === secilenMarka).map(item => item.model))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka, duzenlenenVeri]);

  const sorgula = () => {
    const filtrelenmis = islenmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka === secilenMarka;
      const modelUygun = !secilenModel || item.model === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  const avgYetkili = sonuclar.filter(i => i.yetkili_mi === "Evet").length > 0 ? Math.round(sonuclar.filter(i => i.yetkili_mi === "Evet").reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / sonuclar.filter(i => i.yetkili_mi === "Evet").length) : 0;
  const avgOzel = sonuclar.filter(i => i.yetkili_mi !== "Evet").length > 0 ? Math.round(sonuclar.filter(i => i.yetkili_mi !== "Evet").reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / sonuclar.filter(i => i.yetkili_mi !== "Evet").length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Şeffaf Servis Rehberi</span>
              </div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black uppercase text-slate-500 hover:text-blue-700 tracking-widest hidden md:block">Bilgi Merkezi</Link>
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md flex items-center gap-2 transition-transform active:scale-95">
                <FileText size={14}/> Veri Paylaş
              </button>
           </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-[#0f172a] pt-20 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase italic tracking-tighter">FİYAT <span className="text-blue-500">KIYASLA</span></h1>
          
          {/* ARAMA KUTUSU */}
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl text-lg hover:bg-blue-800 transition-all"><Search size={24} /> Sorgula</button>
          </div>

          {/* MARKA LOGOLARI (ARAMA KUTUSUNUN ALTINDA) */}
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {['TOYOTA', 'HONDA', 'RENAULT', 'CITROEN', 'OPEL', 'VOLKSWAGEN', 'MERCEDES', 'BMW'].map((marka) => (
              <button 
                key={marka}
                onClick={() => { setSecilenMarka(marka); setSecilenModel(""); }}
                className={`px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all uppercase border-2 ${secilenMarka === marka ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-transparent border-white/20 text-white/60 hover:border-white/50 hover:text-white'}`}
              >
                {marka}
              </button>
            ))}
            {secilenMarka && (
              <button onClick={() => {setSecilenMarka(""); setSecilenModel("");}} className="px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest bg-red-500/20 text-red-400 border-2 border-transparent hover:bg-red-500/30 uppercase">Temizle</button>
            )}
          </div>
        </div>
      </div>

      {/* ORTALAMA PANELİ */}
      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 relative z-20">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600"/> Yetkili Servis Ortalaması
              </p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500"/> Özel Servis Ortalaması
              </p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      {/* LİSTELEME */}
      <section className="max-w-5xl mx-auto px-6 space-y-6 mt-10">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all group">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer text-left" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex items-center gap-2 text-slate-400 font-bold mb-1">
                    {getMarkaIcon(item.marka)}
                    <span className="text-sm tracking-widest italic uppercase">{item.marka_format}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter text-left">{item.model_format}</h2>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black uppercase italic">
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Bakım Tipi</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Zaman</span><p className="text-base text-slate-500 font-bold">{item.tarih || "Şubat 2026"}</p></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[11px] text-slate-300 mb-2">Toplam</span><p className="text-3xl font-black text-blue-700 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic">
                <div className="space-y-2 uppercase text-left font-bold"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Teknik Bilgi</p><p>Motor: {item.motor || '-'}</p><p>KM: {item.km}</p></div>
                <div className="space-y-2 uppercase text-left font-bold"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Nokta</p><p>Servis: {item.servis_adi}</p></div>
                <div className="bg-blue-700 text-white p-6 rounded-[2.5rem] shadow-lg text-left leading-relaxed">"{item.not || "Bakım kaydı kullanıcı tarafından doğrulanmıştır."}"</div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* BLOG ÖNİZLEME */}
      <section className="max-w-5xl mx-auto px-6 mt-28 mb-20 text-left pt-20 border-t border-slate-200">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-700 p-2 rounded-xl text-white shadow-lg"><BookOpen size={24} /></div>
            <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">REHBERLER</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">Tüm Yazılar <ArrowRight size={18}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <Link href="/blog/istanbul-honda-bakim-fiyatlari-2026" className="group">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-6 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-all duration-300">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-8 text-left">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full mb-3 inline-block tracking-widest uppercase">Bölgesel</span>
                 <h3 className="text-2xl font-black text-white leading-tight italic tracking-tight uppercase">İstanbul Honda Bakım Rehberi</h3>
               </div>
            </div>
          </Link>
          <Link href="/blog/yetkili-vs-ozel-servis" className="group">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-6 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-all duration-300">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-8 text-left">
                 <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-full mb-3 inline-block tracking-widest uppercase">Analiz</span>
                 <h3 className="text-2xl font-black text-white leading-tight italic tracking-tight uppercase">Servis Fiyat Kıyaslaması</h3>
               </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-16 px-8 mt-20 text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <span className="text-2xl font-black italic text-slate-800 tracking-tighter uppercase">bakımım<span className="text-blue-700">.com</span></span>
          <div className="flex gap-8 items-center">
             <button className="text-[10px] font-black px-5 py-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 uppercase tracking-widest flex items-center gap-2 italic"><Lock size={14}/> Yönetici Girişi</button>
          </div>
        </div>
      </footer>
    </main>
  );
}

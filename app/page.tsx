"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Sayfalar arası geçiş için şart!
import { Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, Database, Edit3, X, Check, Info, FileText, Upload, Zap, Settings, Mail, ChevronDown, ChevronUp, Lock, Save, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  
  const [adminModu, setAdminModu] = useState(false);
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [yuklenenDosya, setYuklenenDosya] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

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
    if (m.includes('mercedes') || m.includes('bmw') || m.includes('audi')) return <ShieldCheck size={20} className="text-slate-700" />;
    if (m.includes('renault') || m.includes('fiat') || m.includes('ford')) return <Settings size={20} className="text-slate-500" />;
    return <Car size={20} className="text-blue-600" />;
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    const servisIsmi = (item.servis_adi || "").toLowerCase();
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "toyan", "efe", "akten", "kardelen", "çekmeköy", "mıçı", "tekbaş", "asal", "kamer"];
    if (yetkiliKeywords.some(kw => servisIsmi.includes(kw))) duzeltilmis.yetkili_mi = "Evet";
    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    duzeltilmis.fiyat_sayi = isNaN(fiyatSayi) ? 0 : fiyatSayi;
    duzeltilmis.ekran_fiyat = duzeltilmis.fiyat_sayi > 0 ? duzeltilmis.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    duzeltilmis.temiz_not = (item.not || "").replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\b/g, "$1. $2.");
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

  const degisikligiKaydet = () => {
    const yeniVeri = duzenlenenVeri.map(item => item.id === editForm.id ? editForm : item);
    setDuzenlenenVeri(yeniVeri);
    setIsEditing(null);
    setSonuclar(sonuclar.map(item => item.id === editForm.id ? veriyiDüzelt(editForm) : item));
  };

  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Şeffaf Servis Rehberi</span>
              </div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black uppercase text-slate-500 hover:text-blue-700 transition-colors tracking-widest hidden md:block">Blog</Link>
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md">Veri Paylaş</button>
           </div>
      </nav>

      {adminModu && (
        <div className="bg-orange-50 border-b border-orange-200 p-4 sticky top-[82px] z-40 flex justify-center gap-4 animate-in slide-in-from-top-4">
           <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit3 size={16}/> Yönetici Modu Aktif.</p>
           <button onClick={() => {}} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg">YENİ DATA.JSON İNDİR</button>
        </div>
      )}

      {/* HERO & SEARCH AREA */}
      <div className="bg-[#0f172a] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">FİYAT <span className="text-blue-500">KIYASLA</span></h1>
          <p className="text-blue-400 font-bold mb-12 text-sm md:text-lg tracking-wide uppercase italic">Güncel servis fiyatlarını hemen öğrenin!</p>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all active:scale-95 text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {/* STATS PANEL */}
      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <ShieldCheck size={18} className="text-blue-600"/> Yetkili Servis Ortalaması
              </p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <BadgePercent size={18} className="text-emerald-500"/> Özel Servis Ortalaması
              </p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      {/* LIST SECTION */}
      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10">
        {sonuclar.map((item) => (
          <div key={item.id} className={`bg-white rounded-[2.5rem] border overflow-hidden transition-all shadow-sm ${isEditing === item.id ? 'border-orange-500 ring-8 ring-orange-50' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer relative text-left" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ SERVİS' : 'ÖZEL SERVİS'}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2 text-left uppercase text-slate-400 font-bold">
                      {getMarkaIcon(item.marka)}
                      <span className="text-sm tracking-widest italic">{item.marka_format}</span>
                    </div>
                    <span className="text-3xl font-black text-slate-800 text-left uppercase italic tracking-tighter">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black uppercase italic">
                  <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 mb-2">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 mb-2">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 mb-2">Tarih</span><p className="text-base text-slate-500">{item.tarih}</p></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[11px] font-black text-slate-300 mb-2">Tutar</span><p className="text-3xl font-black text-blue-700">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm animate-in slide-in-from-top-4 text-left italic">
                <div className="space-y-2 uppercase"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Araç Detayları</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>Km:</b> {item.km} KM</p><p><b>Yıl:</b> {item.model_yili || '-'}</p></div>
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                <div className="bg-blue-700 text-white p-6 rounded-[2rem] shadow-lg text-left">"{item.temiz_not}"</div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* BLOG ÖNİZLEME BÖLÜMÜ */}
      <section className="max-w-5xl mx-auto px-6 mt-28 mb-20 text-left border-t border-slate-200 pt-20">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-700 p-2 rounded-xl text-white shadow-lg"><BookOpen size={24} /></div>
            <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">Haberler & Blog</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest hover:underline flex items-center gap-2">Tümünü Gör <ArrowRight size={16}/></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link href="/blog/yetkili-vs-ozel-servis" className="group cursor-pointer">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-6 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-transform duration-300">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-8 text-left uppercase">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-3 inline-block tracking-widest">Analiz</span>
                 <h3 className="text-2xl font-black text-white leading-tight italic tracking-tight">Servis Fiyat Farkları Analizi</h3>
               </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed italic mb-4 px-2 text-left">2026 bakım masraflarında %70 tasarruf etmek mümkün mü? Verilerle inceliyoruz.</p>
          </Link>
          <Link href="/blog/bakim-faturasi-dusurme" className="group cursor-pointer">
            <div className="bg-slate-200 aspect-video rounded-[3rem] mb-6 overflow-hidden relative shadow-inner group-hover:-translate-y-2 transition-transform duration-300 text-left">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-8 text-left uppercase">
                 <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-3 inline-block tracking-widest">İpucu</span>
                 <h3 className="text-2xl font-black text-white leading-tight italic tracking-tight text-left">Faturayı Düşürmenin 5 Yolu</h3>
               </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed italic mb-4 px-2 text-left">Servis faturanızdaki 'gereksiz' kalemleri nasıl elersiniz? Tasarruf tüyoları.</p>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-16 px-8 text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-black italic text-slate-800 tracking-tighter uppercase">bakımım<span className="text-blue-700">.com</span></span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">© 2026 Tüm hakları saklıdır.</p>
          </div>
          <button onClick={() => setAdminModu(!adminModu)} className="flex items-center gap-2 text-[10px] font-black px-5 py-2.5 rounded-2xl transition-all shadow-sm bg-slate-50 text-slate-400 hover:bg-slate-100 uppercase tracking-widest italic"><Lock size={14}/> Yönetici</button>
        </div>
      </footer>
    </main>
  );
}

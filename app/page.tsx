"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, Search, Calendar, ShieldCheck, BadgePercent, 
  FileText, Zap, Settings, BookOpen, ArrowRight, Lock, 
  Edit3, X, Save, Copy, Check, Upload, MapPin, Gauge, Fuel
} from 'lucide-react';
import bakimData from './data.json';

const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi? 2026 Karşılaştırması", ozet: "2026 bakım masraflarında tasarruf etmenin yollarını verilerle inceledik.", renk: "from-blue-900 to-slate-900" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", ozet: "Başkentteki hibrit sahipleri için güncel batarya revizyon maliyetleri.", renk: "from-slate-800 to-blue-900" }
];

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [adminModu, setAdminModu] = useState(false);
  const [formAcik, setFormAcik] = useState(false);
  const [servisTipi, setServisTipi] = useState("Yetkili");
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
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-left">Şeffaf Servis Rehberi</span>
              </div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-2 mr-2"><BookOpen size={16}/> BLOG</Link>
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 shadow-md flex items-center gap-2 transition-all">
                <FileText size={14}/> Veri Paylaş
              </button>
              <button onClick={() => setAdminModu(!adminModu)} className="text-slate-200 hover:text-slate-400 ml-2 transition-colors"><Lock size={16}/></button>
           </div>
      </nav>

      {/* ARKA PLAN FOTOĞRAFLI ARAMA ALANI */}
      <div className="relative h-[60vh] flex items-center justify-center px-6 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=2000" alt="Servis Arka Plan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-[2px]"></div>
        <div className="relative max-w-4xl mx-auto text-center w-full">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none">FİYAT <span className="text-blue-500 font-black">KIYASLA</span></h1>
          <div className="bg-white p-5 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-xl"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {/* STATS & LIST SECTIONS (Aynı Şekilde Korundu) */}
      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> Yetkili Servis Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-emerald-500"><BadgePercent size={18}/> Özel Servis Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      {/* FORM MODAL (İŞTE ÇALIŞMAYAN KISIM BURASIYDI) */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="bg-blue-700 p-10 text-white flex justify-between items-start sticky top-0 z-10 text-left">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter leading-none">Bakım Verisi Paylaş</h2>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-3">SÜRÜCÜLER ARASINDA ŞEFFAFLIK SAĞLAYIN</p>
              </div>
              <button onClick={() => setFormAcik(false)} className="bg-[#1e40af] p-3 rounded-2xl hover:bg-blue-800 transition-all shadow-lg"><X size={28} /></button>
            </div>
            
            <div className="p-10 space-y-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Car size={14}/> Marka / Model</label><input placeholder="Örn: Honda Civic 2024" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Bakım Tarihi</label><input type="date" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Servis Adı</label><input placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Gauge size={14}/> Araç Kilometresi</label><input placeholder="Örn: 30.000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BadgePercent size={14}/> Ödenen Tutar (TL)</label><input placeholder="Örn: 12.500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner">
                    <button onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${servisTipi === 'Yetkili' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>YETKİLİ</button>
                    <button onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${servisTipi === 'Özel' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> Şehir</label><input placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Fuel size={14}/> Motor / Yakıt</label><input placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50/50 hover:bg-blue-50 transition-all cursor-pointer group relative text-left">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-5 rounded-3xl shadow-sm group-hover:scale-110 transition-transform"><Upload size={32} className="text-blue-600" /></div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">FATURA VEYA FİŞ YÜKLE</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GÖRSEL VEYA PDF (OPSİYONEL)</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-700 text-white py-7 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98] mt-4">VERİYİ ONAYA GÖNDER</button>
            </div>
          </div>
        </div>
      )}

      {/* Blog and Results Sections continued... */}
    </main>
  );
}

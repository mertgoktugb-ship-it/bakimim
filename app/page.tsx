"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  X, Check, Info, FileText, Upload, User,
  Zap, Settings, BookOpen, ArrowRight, Gauge, Fuel 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import bakimData from './data.json';

const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi?", renk: "from-slate-900 to-black" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", renk: "from-slate-800 to-slate-900" }
];

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const [formData, setFormData] = useState({
    ad_soyad: '',
    marka_model: '',
    servis_adi: '',
    km: '',
    fiyat: '',
    sehir: '',
    motor: ''
  });

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str || str.toLowerCase() === "bilinmiyor") return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getMarkaIcon = (marka: string) => {
    const m = (marka || "").toLowerCase();
    if (m.includes('toyota') || m.includes('honda')) return <Zap size={20} className="text-yellow-500" />;
    return <Car size={20} className="text-yellow-600" />;
  };

  // --- İSİM GİZLEME MOTORU (GÜNCELLENDİ) ---
  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    
    // Fiyat Ayarı
    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    duzeltilmis.fiyat_sayi = isNaN(fiyatSayi) ? 0 : fiyatSayi;
    duzeltilmis.ekran_fiyat = duzeltilmis.fiyat_sayi > 0 ? duzeltilmis.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    
    // İSİM GİZLEME: "Mert Şen" -> "M. Ş."
    let hamIsim = item.ad_soyad || item.isim || "";
    if (hamIsim) {
        duzeltilmis.bas_harfler = hamIsim
            .trim()
            .split(/\s+/)
            .map((p: string) => p.charAt(0).toUpperCase() + ".")
            .join(" ");
    } else {
        duzeltilmis.bas_harfler = "";
    }
    
    duzeltilmis.marka_format = formatYazi(item.marka || item.marka_model);
    duzeltilmis.model_format = formatYazi(item.model || "");
    return duzeltilmis;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka_format))).sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka]);

  const sorgula = () => {
    const filtrelenmis = islenmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka_format === secilenMarka;
      const modelUygun = !secilenModel || item.model_format === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    const { error } = await supabase.from('bakim_kayitlari').insert([formData]);
    setYukleniyor(false);
    if (!error) {
      alert("Başarıyla gönderildi!");
      setFormAcik(false);
      setFormData({ ad_soyad: '', marka_model: '', servis_adi: '', km: '', fiyat: '', sehir: '', motor: '' });
    }
  };

  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center"><Car size={28} strokeWidth={2.5} /></div>
              <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-yellow-500">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Şeffaf Servis Rehberi</span></div>
           </Link>
           <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-md flex items-center gap-2 transition-all"><FileText size={14}/> Veri Paylaş</button>
      </nav>

      <div className="bg-[#0f172a] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter text-center text-left">FİYAT <span className="text-yellow-500 text-left">KIYASLA</span></h1>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option></select>
              <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-yellow-400 transition-all text-left">
            <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer">
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.marka_format}</span>
                    <span className="text-3xl font-black text-slate-800 italic leading-none">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full font-black text-left">
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tarih</span><div className="text-base text-slate-500">{item.tarih}</div></div>
                  <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase">Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Detaylar</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>KM:</b> {item.km}</p></div>
                <div className="space-y-2 uppercase text-left"><p

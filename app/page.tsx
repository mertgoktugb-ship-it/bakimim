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

  // İSİM VE NOT FİLTRELEME - EN KRİTİK KISIM
  const veriyiFiltrele = (item: any) => {
    let d = { ...item };
    
    // 1. Gerçek İsimden Baş Harf Çıkarma (Tolga Karan -> T. K.)
    const hamIsim = d.ad_soyad || d.isim || "";
    if (hamIsim) {
      const parcalar = hamIsim.trim().split(/\s+/);
      d.kullanici_bas_harf = parcalar.map((p: string) => p.charAt(0).toUpperCase() + ".").join(" ");
    } else {
      d.kullanici_bas_harf = "K. V.";
    }

    // 2. Notun İçindeki İsimleri Temizleme (Tolga Karan'ın aldığı teklif -> Alınan teklif)
    let temizNot = d.not || "";
    if (hamIsim) {
      // İsmi notun içinden silen regex
      const isimRegex = new RegExp(hamIsim, 'gi');
      temizNot = temizNot.replace(isimRegex, "Kullanıcı");
    }
    // Ekstra güvenlik: Not içindeki isim benzeri yapıları da (Yasin Yilman gibi) kısalt
    d.temiz_not = temizNot.replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşüöü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşüöü]+\b/g, "$1. $2.");

    return d;
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = veriyiFiltrele(item);
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
    setAcikKartId(null);
  };

  const avgYetkili = sonuclar.filter(i => i.yetkili_mi === "Evet").length > 0 ? Math.round(sonuclar.filter(i => i.yetkili_mi === "Evet").reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / sonuclar.filter(i => i.yetkili_mi === "Evet").length) : 0;
  const avgOzel = sonuclar.filter(i => i.yetkili_mi !== "Evet").length > 0 ? Math.round(sonuclar.filter(i => i.yetkili_mi !== "Evet").reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / sonuclar.filter(i => i.yetkili_mi !== "Evet").length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"><Car size={28} strokeWidth={2.5} className="text-blue-400" /></div>
              <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-blue-700">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-left">Şeffaf Servis Rehberi</span></div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-2 mr-2"><BookOpen size={16}/> BLOG</Link>
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 shadow-md flex items-center gap-2 transition-all"><FileText size={14}/> Veri Paylaş</button>
              <button onClick={() => setAdminModu(!adminModu)} className="text-slate-200 hover:text-slate-400 ml-2 transition-colors"><Lock size={16}/></button>
           </div>
      </nav>

      {/* ARAMA VE STATS ALANLARI AYNI ŞEKİLDE DEVAM EDİYOR... */}
      <div className="relative h-[60vh] flex items-center justify-center px-6 overflow-hidden text-left">
        <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-[2px]"></div>
        <div className="relative max-w-4xl mx-auto text-center w-full text-left">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none text-center">FİYAT <span className="text-blue-500 font-black">KIYASLA</span></h1>
          <div className="bg-white p-5 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-xl"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 space-y-6 mt-16 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all text-left cursor-pointer" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center text-left">
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">{item.model_format}</h2>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full font-black uppercase italic text-left">
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Tarih</span><p className="text-base text-slate-500">{item.tarih}</p></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[11px] text-slate-300 mb-2">Tutar</span><p className="text-4xl font-black text-blue-700 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Detaylar</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>KM:</b> {item.km}</p></div>
                <div className="space-y-2 uppercase text-left text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                
                {/* DOĞRU FİLTRELENMİŞ MAVİ KUTU */}
                <div className="bg-blue-600 text-white p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none">{item.kullanici_bas_harf}</p>
                  <div className="mt-5 text-[12px] font-bold border-t border-white/20 pt-4 opacity-90 leading-relaxed">
                    "{item.temiz_not || "Doğrulanmış fatura kaydıdır."}"
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* VERİ PAYLAŞ FORMU VE DİĞER BÖLÜMLER... */}
    </main>
  );
}

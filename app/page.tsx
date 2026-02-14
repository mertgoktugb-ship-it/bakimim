"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Database, Edit3, X, Check, Info, FileText, Upload, 
  Zap, Settings, Mail, Lock, Save, BookOpen, ArrowRight, Gauge, Fuel 
} from 'lucide-react';
import bakimData from './data.json';

// --- BLOG VERİLERİ (ALTIN KOD TASARIMIYLA) ---
const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi?", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", renk: "from-[#1e293b] to-[#334155]" }
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
    if (!str || str.toLowerCase() === "bilinmiyor") return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getMarkaIcon = (marka: string) => {
    const m = (marka || "").toLowerCase();
    if (m.includes('toyota') || m.includes('honda')) return <Zap size={20} className="text-blue-500" />;
    if (m.includes('mercedes') || m.includes('bmw') || m.includes('audi')) return <ShieldCheck size={20} className="text-slate-700" />;
    return <Car size={20} className="text-blue-600" />;
  };

  const veriyiDüzelt = (item: any) => {
    let d = { ...item };
    
    // 1. MARKA & MODEL DÜZELTME (Chery vb. büyük-küçük harf sorunu çözüldü)
    const rawMarka = d.marka || d.Marka || "";
    const rawModel = d.model || d.Model || "";
    d.marka_format = formatYazi(rawMarka);
    d.model_format = formatYazi(rawModel);

    // 2. İSİM GİZLEME (ALTIN KOD REGEX)
    const hamIsim = d.ad_soyad || d.isim || d.Kullanıcı || "";
    d.bas_harfler = hamIsim ? hamIsim.trim().split(/\s+/).map((p: any) => p.charAt(0).toUpperCase() + ".").join(" ") : "Y. K.";
    d.temiz_not = (d.not || "").replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşüöü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşüöü]+\b/g, "$1. $2.");

    // 3. FİYAT & SERVİS
    const hamFiyat = d.fiyat_tl || d.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    d.fiyat_sayi = isNaN(fiyatSayi) ? 0 : fiyatSayi;
    d.ekran_fiyat = d.fiyat_sayi > 0 ? d.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";

    const sName = (d.servis_adi || "").toLowerCase();
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "alj", "toyotronik", "mais", "efe"];
    if (yetkiliKeywords.some(kw => sName.includes(kw))) d.yetkili_mi = "Evet";
    
    if (!d.tarih || d.tarih.includes("belirtilmemiş")) d.tarih = "Şubat 2026";
    
    return d;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka_format))).filter(Boolean).sort();
  const tumSehirler = Array.from(new Set(islenmisVeri.map(item => item.sehir))).filter(s => s && s !== "bilinmiyor").sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).filter(Boolean).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka, duzenlenenVeri]);

  const sorgula = () => {
    const filtrelenmis = islenmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka_format === secilenMarka;
      const modelUygun = !secilenModel || item.model_format === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  // ORTALAMA HESAPLAMALARI (BUILD HATASINI ÇÖZEN KISIM)
  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      {/* NAVBAR */}
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

      {/* SEARCH AREA */}
      <div className="bg-[#0f172a] py-20 px-6 text-left">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter text-center">FİYAT <span className="text-blue-500">KIYASLA</span></h1>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> Yetkili Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-emerald-500"><BadgePercent size={18}/> Özel Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      {/* RESULTS LIST */}
      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all text-left">
            <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer text-left">
                <div className="md:w-64 mr-10 text-left text-left">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex flex-col gap-1 text-left text-left">
                    <div className="flex items-center gap-2 uppercase font-bold text-slate-400">{getMarkaIcon(item.marka_format)}<span className="text-sm tracking-widest">{item.marka_format}</span></div>
                    <span className="text-3xl font-black text-slate-800 tracking-tight italic">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black">
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase">Tarih</span><div className="text-base text-slate-500">{item.tarih}</div></div>
                  <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tutar</span><p className="text-3xl font-black text-blue-700 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic">Detaylar</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>KM:</b> {item.km || '-'}</p></div>
                <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic text-left text-left">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                <div className="bg-blue-600 text-white p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none">{item.bas_harfler}</p>
                  <div className="mt-5 text-[12px] font-bold border-t border-white/20 pt-4 opacity-90 leading-relaxed text-left">"{item.temiz_not || "Doğrulanmış fatura kaydıdır."}"</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* BLOG FOOTER */}
      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 pt-20 border-t border-slate-200 text-left text-left">
        <div className="flex justify-between items-center mb-12 text-left">
          <div className="flex items-center gap-4 text-left"><div className="bg-blue-700 p-3 rounded-2xl text-white shadow-lg text-left"><BookOpen size={28} /></div><h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter text-left">Servis Rehberi</h2></div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2 text-left">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group text-left"><div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300 text-left`}><div className="absolute bottom-8 left-10 text-left"><span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase text-left">İçerik</span><h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase text-left text-left">{blog.baslik}</h3></div></div></Link>
          ))}
        </div>
      </section>

      {/* FORM MODAL */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300 text-left">
            <div className="bg-blue-700 p-10 text-white flex justify-between items-start sticky top-0 z-10 text-left">
              <div><h2 className="text-4xl font-black italic tracking-tighter leading-none text-left">Bakım Verisi Paylaş</h2><p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-3 text-left">ŞEFFAFLIĞA KATKIDA BULUNUN</p></div>
              <button onClick={() => setFormAcik(false)} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all text-left"><X size={28} /></button>
            </div>
            <div className="p-10 space-y-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Car size={14}/> Marka / Model</label><input placeholder="Örn: Toyota C-HR" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Bakım Tarihi</label><input type="date" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Servis Adı</label><input placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Gauge size={14}/> Kilometre</label><input placeholder="Örn: 15.000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BadgePercent size={14}/> Tutar (TL)</label><input placeholder="Örn: 9.500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner text-left">
                    <button onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Yetkili' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400'}`}>YETKİLİ</button>
                    <button onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Özel' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><MapPin size={14}/> Şehir</label><input placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner text-left" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Fuel size={14}/> Motor / Yakıt</label><input placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner text-left" /></div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50/50 hover:bg-blue-50 transition-all cursor-pointer relative text-left">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                <div className="flex flex-col items-center gap-4 text-left">
                  <div className="bg-white p-5 rounded-3xl shadow-sm text-left"><Upload size={32} className="text-blue-600" /></div>
                  <p className="text-sm font-black text-slate-800 uppercase text-left text-left">FATURA VEYA FİŞ YÜKLE</p>
                </div>
              </div>
              <button className="w-full bg-blue-700 text-white py-7 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98] mt-4 text-left">VERİYİ ONAYA GÖNDER</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

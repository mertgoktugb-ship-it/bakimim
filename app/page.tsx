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
  { id: "istanbul-honda-bakim-fiyatlari-2026", kategori: "Bölgesel Analiz", baslik: "İstanbul Honda Bakım Rehberi 2026", renk: "from-[#0f172a] to-[#1e293b]" },
  { id: "fiat-egea-periyodik-bakim-tablosu-2026", kategori: "Model Rehberi", baslik: "Fiat Egea Bakım Tablosu 2026", renk: "from-[#1e293b] to-[#334155]" }
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
  const [duzenlemeId, setDuzenlemeId] = useState<number | null>(null);

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  // İSİM SOYİSİM -> Y.Y. FORMATINA ÇEVİREN FONKSİYON
  const basHarfYap = (isim: string) => {
    if (!isim) return "";
    const parcalar = isim.trim().split(' ');
    return parcalar.map(p => p.charAt(0).toUpperCase() + ".").join(' ');
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
    
    // VERİ SAHİBİ İSMİNİ BURADA FİLTRELİYORUZ
    duzeltilmis.kullanici_bas_harf = basHarfYap(item.ad_soyad || item.isim || "");
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

  const hucreGuncelle = (id: number, alan: string, deger: string) => {
    const yeniVeri = duzenlenenVeri.map(i => i.id === id ? { ...i, [alan]: deger } : i);
    setDuzenlenenVeri(yeniVeri);
  };

  const jsonIndir = () => {
    const veriString = JSON.stringify(duzenlenenVeri, null, 2);
    navigator.clipboard.writeText(veriString);
    alert("VERİ KOPYALANDI!");
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
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md flex items-center gap-2">
                <FileText size={14}/> Veri Paylaş
              </button>
              <button onClick={() => setAdminModu(!adminModu)} className={`text-[10px] font-black px-5 py-2.5 rounded-xl border transition-all ${adminModu ? 'bg-red-600 text-white border-red-700 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {adminModu ? 'YÖNETİCİ AKTİF' : 'GİRİŞ'}
              </button>
           </div>
      </nav>

      {adminModu && (
        <div className="bg-orange-50 border-b border-orange-200 p-4 sticky top-[82px] z-40 flex justify-center gap-4 animate-in slide-in-from-top-4">
           <button onClick={jsonIndir} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-orange-700 flex items-center gap-2 transition-colors">
             <Save size={14}/> DATA.JSON KOPYALA
           </button>
        </div>
      )}

      <div className="bg-[#0f172a] py-24 px-6 text-left">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none text-center">FİYAT <span className="text-blue-500 font-black">KIYASLA</span></h1>
          <div className="bg-white p-5 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer text-left"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer text-left"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer text-left"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-xl text-left"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20 text-left">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> Yetkili Servis Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-emerald-500"><BadgePercent size={18}/> Özel Servis Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      <section className="max-w-5xl mx-auto px-6 space-y-6 mt-16 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all text-left">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center text-left relative">
                {adminModu && (
                  <div className="absolute top-6 right-8 flex gap-2 z-30">
                    <button onClick={() => setDuzenlemeId(duzenlemeId === item.id ? null : item.id)} className={`p-2 rounded-lg transition-colors ${duzenlemeId === item.id ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'bg-blue-50 text-blue-600'}`}>
                      {duzenlemeId === item.id ? <Check size={16} /> : <Edit3 size={16} />}
                    </button>
                    <button onClick={() => { if(confirm("Silmek istediğinize emin misiniz?")) setDuzenlenenVeri(duzenlenenVeri.filter(v => v.id !== item.id)) }} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><X size={16} /></button>
                  </div>
                )}
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  {duzenlemeId === item.id ? (
                    <input className="text-2xl font-black bg-slate-50 p-2 rounded-xl w-full border border-blue-200 outline-none" value={item.model} onClick={(e) => e.stopPropagation()} onChange={(e) => hucreGuncelle(item.id, 'model', e.target.value)} />
                  ) : (
                    <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter cursor-pointer text-left" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>{item.model_format}</h2>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full font-black uppercase italic text-left cursor-pointer" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Bakım</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-50 p-2 rounded border border-blue-100 outline-none" value={item.bakim_turu} onClick={(e) => e.stopPropagation()} onChange={(e) => hucreGuncelle(item.id, 'bakim_turu', e.target.value)} /> : <p className="text-base text-slate-700">{item.bakim_turu}</p>}
                  </div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Konum</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-50 p-2 rounded border border-blue-100 outline-none" value={item.sehir} onClick={(e) => e.stopPropagation()} onChange={(e) => hucreGuncelle(item.id, 'sehir', e.target.value)} /> : <p className="text-base text-slate-700">{item.sehir}</p>}
                  </div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2">Tarih</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-50 p-2 rounded border border-blue-100 outline-none" value={item.tarih} onClick={(e) => e.stopPropagation()} onChange={(e) => hucreGuncelle(item.id, 'tarih', e.target.value)} /> : <p className="text-base text-slate-500">{item.tarih}</p>}
                  </div>
                  <div className="flex flex-col items-end md:items-start text-left text-left"><span className="text-[11px] text-slate-300 mb-2">Tutar</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-50 p-2 rounded border border-blue-100 outline-none text-left" value={item.fiyat} onClick={(e) => e.stopPropagation()} onChange={(e) => hucreGuncelle(item.id, 'fiyat', e.target.value)} /> : <p className="text-4xl font-black text-blue-700 tracking-tighter">{item.ekran_fiyat}</p>}
                  </div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left">
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 text-left text-left">Detaylar</p>
                  <p><b>Motor:</b> {item.motor || '-'}</p>
                  <p><b>KM:</b> {item.km}</p>
                </div>
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 text-left text-left">Servis Bilgisi</p>
                  <p><b>Servis:</b> {item.servis_adi}</p>
                </div>
                
                {/* SADECE BAŞ HARFLER VE MAVİ KUTU (YASİN YILMAN -> Y. Y.) */}
                <div className="bg-blue-600 text-white p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center animate-in fade-in duration-500 text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none">{item.kullanici_bas_harf}</p>
                  <div className="mt-5 text-[12px] font-bold leading-relaxed border-t border-white/20 pt-4">
                    "{item.not || "Doğrulanmış kullanıcı kaydıdır."}"
                  </div>
                </div>
            </div>
            )}
          </div>
        ))}
      </section>

      {/* VERİ PAYLAŞ FORMU */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="bg-blue-700 p-10 text-white flex justify-between items-start sticky top-0 z-10 text-left">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter leading-none">Bakım Verisi Paylaş</h2>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-3">SÜRÜCÜLER ARASINDA ŞEFFAFLIK SAĞLAYIN</p>
              </div>
              <button onClick={() => setFormAcik(false)} className="bg-[#1e40af] p-3 rounded-2xl hover:bg-blue-800 transition-all shadow-lg text-left"><X size={28} /></button>
            </div>
            
            <div className="p-10 space-y-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Car size={14}/> Marka / Model</label><input placeholder="Örn: Honda Civic 2024" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Bakım Tarihi</label><input type="date" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Servis Adı</label><input placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left"><Gauge size={14}/> Araç Kilometresi</label><input placeholder="Örn: 30.000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left"><BadgePercent size={14}/> Ödenen Tutar (TL)</label><input placeholder="Örn: 12.500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left"><ShieldCheck size={14}/> Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner">
                    <button onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${servisTipi === 'Yetkili' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>YETKİLİ</button>
                    <button onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${servisTipi === 'Özel' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left"><MapPin size={14}/> Şehir</label><input placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left text-left text-left"><Fuel size={14}/> Motor / Yakıt</label><input placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner hover:bg-slate-100 transition-colors" /></div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50/50 hover:bg-blue-50 transition-all cursor-pointer group relative text-left text-left text-left text-left text-left text-left text-left text-left">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                <div className="flex flex-col items-center gap-4 text-left">
                  <div className="bg-white p-5 rounded-3xl shadow-sm group-hover:scale-110 transition-transform text-left text-left text-left text-left text-left text-left text-left text-left"><Upload size={32} className="text-blue-600" /></div>
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

      {/* BLOG ÖNİZLEME */}
      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 pt-20 border-t border-slate-200 text-left">
        <div className="flex justify-between items-center mb-16 text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-lg text-left text-left"><BookOpen size={28} /></div>
            <h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter text-left text-left">GÜNCEL BLOG</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2 text-left text-left">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="group text-left text-left text-left text-left text-left text-left text-left text-left text-left">
              <div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300 text-left text-left text-left text-left text-left text-left text-left text-left text-left`}>
                 <div className="absolute bottom-8 left-10 text-left text-left text-left text-left text-left text-left text-left text-left text-left">
                   <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase text-left text-left text-left text-left text-left text-left text-left text-left text-left">İçerik</span>
                   <h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase text-left text-left text-left text-left text-left text-left text-left text-left text-left">{blog.baslik}</h3>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-20 px-8 text-left text-left text-left text-left text-left text-left text-left text-left text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-left text-left text-left text-left text-left text-left text-left text-left text-left">
          <div className="text-left text-left text-left text-left text-left text-left text-left text-left text-left">
            <span className="text-3xl font-black italic text-slate-800 tracking-tighter uppercase block mb-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left">bakımım<span className="text-blue-700 text-left text-left text-left text-left text-left text-left text-left text-left text-left">.com</span></span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left text-left text-left text-left text-left text-left text-left text-left text-left">© 2026 Şeffaf Servis Platformu</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

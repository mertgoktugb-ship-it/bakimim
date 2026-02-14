"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, Database, Edit3, X, Check, Info, FileText, Upload, Zap, Settings, Activity } from 'lucide-react';
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
    if (!duzeltilmis.tarih || duzeltilmis.tarih.includes("belirtilmemiş")) duzeltilmis.tarih = "Şubat 2026";
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

  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <a href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center">
                <Car size={28} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] mt-1 uppercase">Şeffaf Servis Rehberi</span>
              </div>
           </a>
           <div className="flex items-center gap-3">
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 shadow-md flex items-center gap-2">
                <FileText size={14}/> Veri Paylaş
              </button>
              <button onClick={() => setAdminModu(!adminModu)} className={`text-[10px] font-black px-4 py-2.5 rounded-xl border ${adminModu ? 'bg-orange-500 text-white border-orange-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {adminModu ? 'YÖNETİCİ AKTİF' : 'GİRİŞ'}
              </button>
           </div>
      </nav>

      {/* SEARCH AREA */}
      <div className="bg-[#0f172a] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">FİYAT <span className="text-blue-500">KIYASLA</span></h1>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all active:scale-95 text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {/* STATS PANEL */}
      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> Yetkili Servis Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><BadgePercent size={18} className="text-emerald-500"/> Özel Servis Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      )}

      {/* LIST SECTION */}
      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>
                <div className="md:w-64 mr-10">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ SERVİS' : 'ÖZEL SERVİS'}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">{getMarkaIcon(item.marka)}<span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.marka_format}</span></div>
                    <span className="text-3xl font-black text-slate-800">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full">
                  <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase mb-2">Bakım</span><p className="text-base font-bold text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase mb-2">Şehir</span><p className="text-base font-bold text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase mb-2">Tarih</span><p className="text-base font-bold text-slate-500">{item.tarih}</p></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[11px] font-black text-slate-300 uppercase mb-2">Tutar</span><p className="text-3xl font-black text-blue-700 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div className="space-y-2"><p className="text-[10px] font-black text-slate-400 uppercase">Detaylar</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>Kilometre:</b> {item.km} KM</p><p><b>Yıl:</b> {item.model_yili || '-'}</p></div>
                <div className="space-y-2"><p className="text-[10px] font-black text-slate-400 uppercase">Servis</p><p><b>Adı:</b> {item.servis_adi}</p></div>
                <div className="bg-blue-700 text-white p-6 rounded-3xl italic">"{item.temiz_not}"</div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* VERİ EKLEME MODAL (Genişletilmiş Form) */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95">
            <div className="bg-blue-700 p-8 text-white flex justify-between items-center sticky top-0">
              <div><h2 className="text-2xl font-black italic">Bakım Verisi Paylaş</h2><p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Gerçek fatura verisi paylaşın</p></div>
              <button onClick={() => setFormAcik(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Marka Model & Tutar */}
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Marka - Model</label><input placeholder="Örn: Toyota C-HR" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Ödenen Tutar (TL)</label><input placeholder="Örn: 15.400" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>
              
              {/* Tarih & Servis Tipi */}
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Bakım Tarihi</label><input type="text" placeholder="Örn: 14.02.2026" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Servis Tipi</label>
                <div className="flex gap-2">
                  <button className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black text-slate-400 border-2 border-transparent hover:border-blue-700 focus:bg-blue-700 focus:text-white transition-all">YETKİLİ</button>
                  <button className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black text-slate-400 border-2 border-transparent hover:border-blue-700 focus:bg-blue-700 focus:text-white transition-all">ÖZEL</button>
                </div>
              </div>

              {/* Servis Adı & Şehir */}
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Servis Adı</label><input placeholder="Örn: Toyota ALJ Ankara" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Şehir</label><input placeholder="Örn: Ankara" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>

              {/* Araç KM & Motor */}
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Araç Kilometre</label><input placeholder="Örn: 45.000" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Motor / Yakıt</label><input placeholder="Örn: 1.8 Hibrit" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none" /></div>

              {/* Fatura Yükle */}
              <div className="col-span-full border-2 border-dashed border-slate-200 rounded-[2rem] p-6 text-center bg-slate-50/50 hover:bg-blue-50 relative">
                <input type="file" onChange={(e: any) => setYuklenenDosya(e.target.files[0]?.name)} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-blue-600" />
                  <p className="text-xs font-black text-slate-700 uppercase">{yuklenenDosya || "FATURA / FİŞ EKLE (OPSİYONEL)"}</p>
                </div>
              </div>

              <button onClick={() => { alert('Veriler onaya gönderildi!'); setFormAcik(false); }} className="col-span-full bg-blue-700 text-white py-6 rounded-[2rem] font-black text-lg uppercase shadow-xl hover:bg-blue-800 transition-all active:scale-95">Veriyi Onaya Gönder</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ChevronDown, ChevronUp, TrendingUp, ShieldCheck, BadgePercent, Database, Edit3, Save, X, Check, Info, Mail } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  
  const [adminModu, setAdminModu] = useState(false);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const isimGizle = (metin: string) => {
    if (!metin) return "Açıklama bulunmuyor.";
    return metin.replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\b/g, "$1. $2.");
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
    duzeltilmis.temiz_not = isimGizle(item.not);
    duzeltilmis.marka_format = formatYazi(item.marka);
    duzeltilmis.model_format = formatYazi(item.model);

    if (duzeltilmis.tarih === "tarih belirtilmemiş" || !duzeltilmis.tarih) {
      duzeltilmis.tarih = "Şubat 2026";
    }

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
    setSecilenModel(""); 
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

  const editBaslat = (item: any) => {
    setIsEditing(item.id);
    setEditForm({...item});
  };

  const degisikligiKaydet = () => {
    const yeniVeri = duzenlenenVeri.map(item => item.id === editForm.id ? editForm : item);
    setDuzenlenenVeri(yeniVeri);
    setIsEditing(null);
    const yeniSonuclar = sonuclar.map(item => item.id === editForm.id ? veriyiDüzelt(editForm) : item);
    setSonuclar(yeniSonuclar);
  };

  const jsonIndir = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(duzenlenenVeri, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");

  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-left pb-20">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <a href="/" className="flex items-center gap-3 group">
              <div className="bg-[#1E293B] p-2.5 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-105 flex items-center justify-center">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 tracking-normal italic">bakımım<span className="text-blue-600">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Şeffaf Servis Rehberi</span>
              </div>
           </a>
           <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 text-xs font-black text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 uppercase tracking-widest border border-slate-200 rounded-xl">
                 <Mail size={16}/> Bize Ulaşın
              </button>
              <button onClick={() => setAdminModu(!adminModu)} className={`text-[10px] font-black px-5 py-2.5 rounded-xl border transition-all ${adminModu ? 'bg-orange-500 text-white border-orange-600 shadow-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'} shadow-md`}>
                {adminModu ? 'YÖNETİCİ MODU AKTİF' : 'YÖNETİCİ GİRİŞİ'}
              </button>
           </div>
      </nav>

      {adminModu && (
        <div className="bg-orange-50 border-b border-orange-200 p-4 sticky top-[82px] z-40 flex justify-center gap-4 animate-in fade-in slide-in-from-top-4">
           <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit3 size={16}/> Verileri düzenleyip yeni dosyayı indirin.</p>
           <button onClick={jsonIndir} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"><Save size={14}/> DATA.JSON İNDİR</button>
        </div>
      )}

      {/* SEARCH AREA */}
      <div className="bg-[#1E293B] py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic">FİYAT <span className="text-blue-400">KIYASLA</span></h1>
          <p className="text-blue-400 font-bold mb-12 text-sm md:text-lg tracking-wide uppercase opacity-90">Güncel servis fiyatlarını hemen öğrenin!</p>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-base outline-none focus:ring-4 ring-blue-100 transition-all">
                  <option value="">Marka Seçin</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-base outline-none focus:ring-4 ring-blue-100 transition-all">
                  <option value="">Model Seçin</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-base outline-none focus:ring-4 ring-blue-100 transition-all">
                  <option value="">Şehir Seçin</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl transition-all active:scale-95 text-lg">
                  <Search size={24} /> Sorgula
              </button>
          </div>
        </div>
      </div>

      {/* STATS PANEL - CENTERED & CLEAN */}
      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 text-center">
                <ShieldCheck size={18} className="text-blue-500"/> Yetkili Servis Ortalaması
              </p>
              <p className="text-4xl font-black text-slate-900 text-center">{avgYetkili.toLocaleString('tr-TR')} TL</p>
              <p className="text-[11px] font-bold text-blue-400 mt-2 uppercase italic text-center">Son 6 Ay Piyasa Verisi</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 text-center">
                <BadgePercent size={18} className="text-emerald-500"/> Özel Servis Ortalaması
              </p>
              <p className="text-4xl font-black text-slate-900 text-center">{avgOzel.toLocaleString('tr-TR')} TL</p>
              <p className="text-[11px] font-bold text-emerald-400 mt-2 uppercase italic text-center">Son 6 Ay Piyasa Verisi</p>
            </div>
        </div>
      )}

      {/* RESULT INFO BAR */}
      {sonuclar.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mb-6">
           <div className="bg-blue-50/50 border border-blue-100 rounded-2xl px-6 py-3 flex items-center gap-3 text-blue-700">
              <Info size={18} />
              <p className="text-sm font-bold">
                Şu anda <span className="underline decoration-2 underline-offset-4">{secilenMarka || "seçili"}</span> marka için <span className="text-blue-900 font-black">{sonuclar.length} gerçek kullanıcı verisini</span> listeliyorsunuz.
              </p>
           </div>
        </div>
      )}

      {/* LIST SECTION */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="space-y-5">
          {sonuclar.map((item) => (
            <div key={item.id} className={`bg-white rounded-[2.5rem] border overflow-hidden transition-all shadow-sm hover:shadow-md ${isEditing === item.id ? 'border-orange-500 ring-8 ring-orange-50' : 'border-slate-200'}`}>
              {isEditing === item.id ? (
                <div className="p-10 space-y-8 text-left">
                  <div className="flex justify-between items-center border-b border-orange-100 pb-6">
                    <h3 className="font-black text-2xl text-slate-800 uppercase italic">KAYIT GÜNCELLE</h3>
                    <div className="flex gap-3">
                       <button onClick={() => setIsEditing(null)} className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"><X size={24}/></button>
                       <button onClick={degisikligiKaydet} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-100"><Check size={22}/> DEĞİŞİKLİKLERİ KAYDET</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bakım Ücreti (Sadece Rakam)</label>
                      <input type="text" value={editForm.fiyat_tl} onChange={(e) => setEditForm({...editForm, fiyat_tl: e.target.value})} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-lg outline-none focus:ring-4 ring-emerald-100" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Şehir</label>
                      <input type="text" value={editForm.sehir} onChange={(e) => setEditForm({...editForm, sehir: e.target.value})} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-lg outline-none focus:ring-4 ring-emerald-100" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bakım Tarihi</label>
                      <input type="text" value={editForm.tarih} onChange={(e) => setEditForm({...editForm, tarih: e.target.value})} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-lg outline-none focus:ring-4 ring-emerald-100" />
                    </div>
                    <div className="col-span-full flex flex-col gap-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Kullanıcı Notu</label>
                      <textarea rows={4} value={editForm.not} onChange={(e) => setEditForm({...editForm, not: e.target.value})} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-base outline-none focus:ring-4 ring-emerald-100 leading-relaxed" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  {adminModu && (
                    <button onClick={(e) => { e.stopPropagation(); editBaslat(item); }} className="absolute right-8 top-8 z-30 bg-orange-500 text-white px-6 py-2.5 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-xs font-black hover:bg-orange-600 scale-90 group-hover:scale-100">
                      <Edit3 size={16}/> KAYDI DÜZENLE
                    </button>
                  )}
                  <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer select-none text-left">
                    <div className="md:w-64 text-left mr-10">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase mb-4 inline-block tracking-widest shadow-sm ${item.yetkili_mi === 'Evet' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {item.yetkili_mi === 'Evet' ? 'YETKİLİ SERVİS' : 'ÖZEL SERVİS'}
                      </span>
                      <div className="flex flex-col gap-1 leading-tight">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.marka_format}</span>
                        <span className="text-3xl font-black text-slate-800 tracking-tight">{item.model_format}</span>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left">
                      <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 tracking-[0.2em]">Bakım Türü</span><p className="text-base font-bold text-slate-700">{item.bakim_turu}</p></div>
                      <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 tracking-[0.2em]">Konum</span><p className="text-base font-bold text-slate-700">{item.sehir}</p></div>
                      <div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 tracking-[0.2em]">İşlem Tarihi</span><div className="flex items-center gap-2 text-base font-bold text-slate-500"><Calendar size={18} className="text-slate-200"/> {item.tarih}</div></div>
                      <div className="flex flex-col items-end md:items-start"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 tracking-[0.2em]">Ödenen Tutar</span><p className="text-3xl font-black text-blue-600 tracking-tighter text-right md:text-left">{item.ekran_fiyat}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {acikKartId === item.id && isEditing !== item.id && (
                <div className="px-10 pb-12 pt-6 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                    <div className="space-y-5 text-left">
                      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.3em] border-b border-slate-200 pb-3 flex items-center gap-2">ARAÇ KİMLİĞİ</h4>
                      <div className="space-y-4 text-xs font-bold text-slate-500 uppercase text-left">
                        <p className="flex justify-between">MODEL YILI: <span className="text-slate-900">{item.model_yili || 'BİLİNMİYOR'}</span></p>
                        <p className="flex justify-between">KİLOMETRE: <span className="text-slate-900">{item.km} KM</span></p>
                        <p className="flex justify-between">MOTOR: <span className="text-slate-900">{item.motor || 'BİLİNMİYOR'}</span></p>
                      </div>
                    </div>
                    <div className="space-y-5 text-left">
                      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.3em] border-b border-slate-200 pb-3">YAPILAN İŞLEMLER</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {item.yapilan_islemler?.length > 0 ? item.yapilan_islemler.map((islem: string, i: number) => (
                          <span key={i} className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-[11px] font-bold text-slate-600 shadow-sm">{islem}</span>
                        )) : <span className="text-slate-400 italic text-xs">Döküm girilmemiş.</span>}
                      </div>
                    </div>
                    <div className="space-y-5 text-left">
                      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.3em] border-b border-slate-200 pb-3">SERVİS & NOT</h4>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase bg-white border border-slate-200 p-3 rounded-2xl w-fit shadow-sm">
                            <MapPin size={16} className="text-blue-500"/> {item.servis_adi}
                         </div>
                         <div className="bg-blue-600 text-white p-6 rounded-[2rem] italic text-[13px] leading-relaxed font-medium shadow-2xl shadow-blue-200 relative text-left">
                           "{item.temiz_not}"
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

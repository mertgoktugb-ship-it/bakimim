"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ChevronDown, ChevronUp, TrendingUp, ShieldCheck, BadgePercent, Database, Edit3, Save, X, Check } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  
  // --- ADMIN PANELİ STATE'LERİ ---
  const [adminModu, setAdminModu] = useState(false);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // İlk yüklemede veriyi state'e al
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
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "toyan", "efe", "akten", "kardelen", "çekmeköy"];
    
    if (yetkiliKeywords.some(kw => servisIsmi.includes(kw))) duzeltilmis.yetkili_mi = "Evet";

    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    
    duzeltilmis.fiyat_sayi = fiyatSayi;
    duzeltilmis.ekran_fiyat = fiyatSayi > 0 ? fiyatSayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    duzeltilmis.temiz_not = isimGizle(item.not);
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

  // --- ADMIN FONKSİYONLARI ---
  const editBaslat = (item: any) => {
    setIsEditing(item.id);
    setEditForm({...item});
  };

  const degisikligiKaydet = () => {
    const yeniVeri = duzenlenenVeri.map(item => item.id === editForm.id ? editForm : item);
    setDuzenlenenVeri(yeniVeri);
    setIsEditing(null);
    // Sorgu sonuçlarını da güncelle
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
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + b.fiyat_sayi, 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + b.fiyat_sayi, 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-left relative">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <a href="/" className="flex items-center gap-3 group">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
                <Car size={26} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight italic">bakımım<span className="text-blue-600">.com</span></span>
           </a>
           
           <button 
             onClick={() => setAdminModu(!adminModu)} 
             className={`text-[10px] font-bold px-4 py-2 rounded-full border transition-all ${adminModu ? 'bg-orange-500 text-white border-orange-600' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
           >
             {adminModu ? 'YÖNETİCİ MODU AÇIK' : 'YÖNETİCİ GİRİŞİ'}
           </button>
      </nav>

      {/* ADMIN ARAÇLARI ÇUBUĞU */}
      {adminModu && (
        <div className="bg-orange-50 border-b border-orange-200 p-4 sticky top-[77px] z-40 flex justify-center gap-4">
           <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit3 size={16}/> Düzenleme modundasınız. Değişiklikler bittikten sonra dosyayı indirin.</p>
           <button onClick={jsonIndir} className="bg-orange-600 text-white px-4 py-1 rounded-lg text-xs font-black shadow-md hover:bg-orange-700 transition-colors flex items-center gap-2">
             <Save size={14}/> YENİ DATA.JSON İNDİR
           </button>
        </div>
      )}

      {/* SEARCH AREA */}
      <div className="bg-[#1E293B] py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">FİYAT <span className="text-blue-400">KIYASLA</span></h1>
          <div className="bg-white p-3 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-none">
                  <option value="">Marka</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-none">
                  <option value="">Model</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm outline-none">
                  <option value="">Şehir</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl transition-all">
                  <Search size={20} /> Sorgula
              </button>
          </div>
        </div>
      </div>

      {/* STATS PANEL */}
      {sonuclar.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-20">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500"/> Yetkili Ort.</p>
              <p className="text-2xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BadgePercent size={14} className="text-emerald-500"/> Özel Ort.</p>
              <p className="text-2xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-3xl shadow-xl text-white">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3 flex items-center gap-2"><Database size={14}/> Toplam</p>
              <p className="text-2xl font-black">{sonuclar.length} Kayıt</p>
            </div>
        </div>
      )}

      {/* LIST SECTION */}
      <section className="max-w-5xl mx-auto py-4 px-6 mb-24">
        <div className="space-y-4">
          {sonuclar.map((item) => (
            <div key={item.id} className={`bg-white rounded-[32px] border overflow-hidden transition-all shadow-sm ${isEditing === item.id ? 'border-orange-500 ring-4 ring-orange-100' : 'border-slate-200'}`}>
              
              {/* DÜZENLEME FORMU (ŞİMDİ BURADA) */}
              {isEditing === item.id ? (
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="font-black text-xl text-slate-800 uppercase">KAYDI DÜZENLE (ID: {item.id})</h3>
                    <div className="flex gap-2">
                       <button onClick={() => setIsEditing(null)} className="p-2 bg-slate-100 text-slate-500 rounded-xl"><X/></button>
                       <button onClick={degisikligiKaydet} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2"><Check size={18}/> KAYDET</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Fiyat (TL)</label>
                      <input type="text" value={editForm.fiyat_tl} onChange={(e) => setEditForm({...editForm, fiyat_tl: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 ring-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Şehir</label>
                      <input type="text" value={editForm.sehir} onChange={(e) => setEditForm({...editForm, sehir: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Tarih</label>
                      <input type="text" value={editForm.tarih} onChange={(e) => setEditForm({...editForm, tarih: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" />
                    </div>
                    <div className="col-span-full flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Kullanıcı Notu (İsimleri Buradan Silebilirsin)</label>
                      <textarea rows={3} value={editForm.not} onChange={(e) => setEditForm({...editForm, not: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" />
                    </div>
                  </div>
                </div>
              ) : (
                /* STANDART GÖRÜNÜM */
                <div className="relative group">
                  {adminModu && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); editBaslat(item); }} 
                      className="absolute right-6 top-6 z-30 bg-orange-500 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-black"
                    >
                      <Edit3 size={16}/> DÜZENLE
                    </button>
                  )}
                  <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-6 md:p-8 flex flex-col md:flex-row items-center cursor-pointer">
                    <div className="md:w-56 text-left mr-8">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase mb-3 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                        {item.yetkili_mi === 'Evet' ? 'YETKİLİ SERVİS' : 'ÖZEL SERVİS'}
                      </span>
                      <div className="flex flex-col leading-none">
                        <span className="text-sm font-semibold text-slate-400 tracking-wide">{item.marka_format}</span>
                        <span className="text-2xl font-black text-slate-800 tracking-tight">{item.model_format}</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 md:mt-0 w-full text-left">
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase mb-1">Bakım</span><p className="text-sm font-bold text-slate-700">{item.bakim_turu}</p></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase mb-1">Şehir</span><p className="text-sm font-bold text-slate-700">{item.sehir}</p></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-300 uppercase mb-1">Tarih</span><div className="flex items-center gap-1.5 text-sm font-bold text-slate-500"><Calendar size={14}/> {item.tarih}</div></div>
                      <div className="flex flex-col items-end md:items-start"><span className="text-[10px] font-black text-slate-300 uppercase mb-1">Tutar</span><p className="text-2xl font-black text-blue-600">{item.ekran_fiyat}</p></div>
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

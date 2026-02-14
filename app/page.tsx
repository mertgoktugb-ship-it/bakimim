"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ChevronDown, ChevronUp, ReceiptText, TrendingUp, Database, Award } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);

  // Yazım Düzenleme (HEPSİ BÜYÜK -> Baş Harfi Büyük)
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
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "toyan", "efe"];
    
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

  const duzeltilmisVeri = (bakimData as any[]).map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(duzeltilmisVeri.map(item => item.marka))).sort();
  const tumSehirler = Array.from(new Set(duzeltilmisVeri.map(item => item.sehir))).filter(s => s && s !== "bilinmiyor").sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(duzeltilmisVeri.filter(item => item.marka === secilenMarka).map(item => item.model))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
    setSecilenModel(""); 
  }, [secilenMarka]);

  const sorgula = () => {
    const filtrelenmis = duzeltilmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka === secilenMarka;
      const modelUygun = !secilenModel || item.model === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  const ortalamaFiyat = sonuclar.length > 0 
    ? Math.round(sonuclar.reduce((acc, curr) => acc + (curr.fiyat_sayi || 0), 0) / sonuclar.length) 
    : 0;

  return (
    <main className="min-h-screen bg-[#F1F5F9] text-left">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
           <a href="/" className="flex items-center gap-2 w-fit group">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
                <Car size={22} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-800 italic">bakımım<span className="text-blue-600">.com</span></span>
           </a>
        </div>
      </nav>

      <div className="bg-[#0F172A] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">ARAÇ BAKIM <span className="text-blue-500 italic">ARŞİVİ</span></h1>
          <div className="bg-white p-2 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none">
                  <option value="">Marka Seçin</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none">
                  <option value="">Model Seçin</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none">
                  <option value="">Şehir Seçin</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl py-3 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg transition-all">
                  <Search size={18} /> Sorgula
              </button>
          </div>
        </div>
      </div>

      {sonuclar.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 -mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><TrendingUp size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ortalama Fiyat</p>
                <p className="text-xl font-black text-slate-900">{ortalamaFiyat.toLocaleString('tr-TR')} TL</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-600"><Database size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kayıtlı Veri</p>
                <p className="text-xl font-black text-slate-900">{sonuclar.length} Kayıt</p>
              </div>
            </div>
        </div>
      )}

      <section className="max-w-5xl mx-auto py-4 px-6 mb-20">
        <div className="space-y-3">
          {sonuclar.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-all shadow-sm">
              <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-5 flex flex-col md:flex-row items-center cursor-pointer select-none">
                <div className="md:w-52 text-left mr-6">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase mb-1.5 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.yetkili_mi === 'Evet' ? 'Yetkili Servis' : 'Özel Servis'}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-medium text-slate-500">{item.marka_format}</span>
                    <span className="text-lg font-black text-slate-800">{item.model_format}</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-0">
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Bakım</span><p className="text-xs font-bold text-slate-700 truncate">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Şehir</span><p className="text-xs font-bold text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Tarih</span><div className="flex items-center gap-1 text-xs font-bold text-slate-500"><Calendar size={12}/> {item.tarih}</div></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Ücret</span><p className="text-lg font-black text-blue-600">{item.ekran_fiyat}</p></div>
                </div>
                <div className="ml-4 text-slate-300 hidden md:block">
                   {acikKartId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {acikKartId === item.id && (
                <div className="px-6 pb-6 pt-4 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 text-left">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Araç Detayları</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-xs font-bold">
                        <span className="text-slate-500">KM: <span className="text-slate-800">{item.km}</span></span>
                        <span className="text-slate-500">Yıl: <span className="text-slate-800">{item.model_yili || '-'}</span></span>
                        <span className="text-slate-500">Motor: <span className="text-slate-800">{item.motor || '-'}</span></span>
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">İşlemler</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.yapilan_islemler?.length > 0 ? item.yapilan_islemler.map((islem: string, i: number) => (
                          <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">{islem}</span>
                        )) : <span className="text-slate-400 italic text-xs">Belirtilmemiş.</span>}
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Servis Notu</h4>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 italic text-[11px] text-slate-600 leading-relaxed font-medium">
                        "{item.temiz_not}"
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

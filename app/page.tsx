"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ChevronDown, ChevronUp, ReceiptText } from 'lucide-react';
import bakimData from './data.json';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);

  // İsim Gizleme Mantığı (Mert Bayrak -> M. B.)
  const isimGizle = (metin: string) => {
    if (!metin) return "Açıklama bulunmuyor.";
    return metin.replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\b/g, "$1. $2.");
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    const servisIsmi = (item.servis_adi || "").toLowerCase();

    // Yetkili Servis ve Şehir Düzeltmeleri
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "efe", "toyan"];
    if (yetkiliKeywords.some(kw => servisIsmi.includes(kw))) duzeltilmis.yetkili_mi = "Evet";

    // Fiyat Hata Koruması
    let hamFiyat = item.fiyat_tl || item.fiyat || "Fiyat Alınız";
    let fiyatMetni = String(hamFiyat);
    if (fiyatMetni !== "Fiyat Alınız" && !fiyatMetni.includes("TL")) fiyatMetni += " TL";
    duzeltilmis.ekran_fiyat = fiyatMetni;

    // Not kısmındaki isimleri gizle
    duzeltilmis.temiz_not = isimGizle(item.not);

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

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-left">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
           <div className="bg-[#1E293B] p-2 rounded-lg text-white shadow-lg"><Car size={22} /></div>
           <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter italic uppercase">bakimim<span className="text-blue-600">.com</span></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Şen Kardeşler</span>
           </div>
        </div>
      </nav>

      <div className="bg-[#1E293B] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tight">Bakım Fiyatlarını <span className="text-blue-400 italic">Kıyaslayın</span></h1>
          <div className="bg-white p-2 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none">
                  <option value="">Tüm Markalar</option>
                  {tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none">
                  <option value="">Tüm Modeller</option>
                  {musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none">
                  <option value="">Tüm Şehirler</option>
                  {tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={sorgula} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl py-3 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg transition-all active:scale-95">
                  <Search size={18} /> Sorgula
              </button>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto py-12 px-6">
        <div className="space-y-4">
          {sonuclar.length > 0 ? sonuclar.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
              <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-6 flex flex-col md:flex-row items-center cursor-pointer select-none">
                <div className="md:w-56 text-left border-r border-slate-100 mr-6">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase mb-2 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.yetkili_mi === 'Evet' ? 'Yetkili Servis' : 'Özel Servis'}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 leading-none uppercase">{item.marka} {item.model}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1"><MapPin size={12}/> {item.sehir}</p>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Bakım Türü</span><p className="text-sm font-bold text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Servis Adı</span><p className="text-sm font-bold text-blue-600 truncate">{item.servis_adi}</p></div>
                  <div className="flex flex-col items-end md:items-start"><span className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Ücret</span><p className="text-xl font-black text-slate-900 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
                <div className="ml-4 text-slate-300">
                   {acikKartId === item.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {acikKartId === item.id && (
                <div className="px-8 pb-8 pt-4 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3 text-left">
                      <h4 className="text-[10px] font-black text-slate-800 uppercase border-b pb-1 tracking-widest">Araç Detayları</h4>
                      <div className="space-y-2 text-xs font-bold text-slate-600">
                        <p className="uppercase">Model Yılı: <span className="text-slate-900">{item.model_yili || '-'}</span></p>
                        <p className="uppercase">Kilometre: <span className="text-slate-900">{item.km} KM</span></p>
                        <p className="uppercase">Motor: <span className="text-slate-900">{item.motor || '-'}</span></p>
                      </div>
                    </div>
                    <div className="space-y-3 text-left">
                      <h4 className="text-[10px] font-black text-slate-800 uppercase border-b pb-1 tracking-widest">Yapılan İşlemler</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.yapilan_islemler?.length > 0 ? item.yapilan_islemler.map((islem: string, i: number) => (
                          <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-700">{islem}</span>
                        )) : <span className="text-slate-400 italic text-xs">Belirtilmemiş.</span>}
                      </div>
                    </div>
                    <div className="space-y-3 text-left">
                      <h4 className="text-[10px] font-black text-slate-800 uppercase border-b pb-1 tracking-widest">Ek Bilgiler</h4>
                      <div className="space-y-2 mb-3">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Calendar size={14}/> {item.tarih}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 italic text-[11px] text-blue-800 leading-relaxed font-medium">
                        "{item.temiz_not}"
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Arama kriterlerine uygun sonuç bulunamadı.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

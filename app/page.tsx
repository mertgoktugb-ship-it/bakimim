"use client";
import React, { useState, useEffect } from 'react';
import { Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, Database, Edit3, X, Check, Info, FileText, Upload, Zap, Settings, Mail, ChevronDown, ChevronUp, Lock, Save, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
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

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

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
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <a href="/" className="flex items-center gap-3 group text-left">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] mt-1 uppercase text-left">Şeffaf Servis Rehberi</span>
              </div>
           </a>
           <div className="flex items-center gap-3">
              <button onClick={() => setFormAcik(true)} className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 shadow-md flex items-center gap-2 transition-all">
                <FileText size={14}/> Veri Paylaş
              </button>
           </div>
      </nav>

      {adminModu && (
        <div className="bg-orange-50 border-b border-orange-200 p-4 sticky top-[82px] z-40 flex justify-center gap-4 animate-in slide-in-from-top-4">
           <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit3 size={16}/> Yönetici Modu Aktif.</p>
           <button onClick={jsonIndir} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-orange-700 flex items-center gap-2 transition-all"><Save size={14}/> YENİ DATA.JSON İNDİR</button>
        </div>
      )}

      <div className="bg-[#0f172a] py-20 px-6 text-left">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter text-center">FİYAT <span className="text-blue-500">KIYASLA</span></h1>
          <p className="text-blue-400 font-bold mb-12 text-sm md:text-lg tracking-wide uppercase text-center">Güncel servis fiyatlarını hemen öğrenin!</p>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all active:scale-95 text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {sonuclar.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20 text-left">
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

      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className={`bg-white rounded-[2.5rem] border overflow-hidden transition-all shadow-sm ${isEditing === item.id ? 'border-orange-500 ring-8 ring-orange-50' : 'border-slate-200'}`}>
            {isEditing === item.id ? (
              <div className="p-10 space-y-6 text-left animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b pb-4 text-left">
                  <h3 className="font-black text-xl text-slate-800 uppercase italic tracking-tight text-left">Kaydı Düzenle</h3>
                  <div className="flex gap-2 text-left">
                    <button onClick={() => setIsEditing(null)} className="p-2 bg-slate-100 text-slate-500 rounded-xl"><X/></button>
                    <button onClick={degisikligiKaydet} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2"><Check size={18}/> KAYDET</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex flex-col gap-1 text-left"><label className="text-[10px] font-black text-slate-400 uppercase text-left">Fiyat</label><input type="text" value={editForm.fiyat_tl} onChange={(e) => setEditForm({...editForm, fiyat_tl: e.target.value})} className="p-3 bg-slate-50 border rounded-xl outline-none" /></div>
                  <div className="flex flex-col gap-1 text-left"><label className="text-[10px] font-black text-slate-400 uppercase text-left">Şehir</label><input type="text" value={editForm.sehir} onChange={(e) => setEditForm({...editForm, sehir: e.target.value})} className="p-3 bg-slate-50 border rounded-xl outline-none" /></div>
                </div>
              </div>
            ) : (
              <div className="relative group text-left">
                <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer text-left">
                    <div className="md:w-64 mr-10 text-left">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase mb-4 inline-block tracking-widest ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                      <div className="flex flex-col gap-1 text-left">
                        <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-left">{getMarkaIcon(item.marka)}<span className="text-sm tracking-widest text-left">{item.marka_format}</span></div>
                        <span className="text-3xl font-black text-slate-800 tracking-tight italic text-left">{item.model_format}</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black">
                      <div className="flex flex-col text-left"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 text-left">Bakım</span><p className="text-base font-bold text-slate-700 text-left">{item.bakim_turu}</p></div>
                      <div className="flex flex-col text-left"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 text-left">Konum</span><p className="text-base font-bold text-slate-700 text-left">{item.sehir}</p></div>
                      <div className="flex flex-col text-left"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 text-left">Tarih</span><div className="flex items-center gap-1 text-base font-bold text-slate-500 text-left"><Calendar size={14}/> {item.tarih}</div></div>
                      <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] font-black text-slate-300 uppercase mb-2 text-left text-left">Tutar</span><p className="text-3xl font-black text-blue-700 tracking-tighter text-left">{item.ekran_fiyat}</p></div>
                    </div>
                </div>
                {acikKartId === item.id && (
                  <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-left animate-in slide-in-from-top-4">
                    <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic text-left">Detaylar</p><p className="text-left"><b>Motor:</b> {item.motor || '-'}</p><p className="text-left"><b>KM:</b> {item.km} KM</p></div>
                    <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic text-left">Servis Bilgisi</p><p className="text-left"><b>Servis:</b> {item.servis_adi}</p></div>
                    <div className="bg-blue-700 text-white p-6 rounded-[2rem] shadow-lg leading-relaxed text-left">"{item.temiz_not}"</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      <footer className="bg-white border-t border-slate-200 py-16 px-8 text-left mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-left">
          <div className="flex flex-col gap-2 text-left">
            <span className="text-2xl font-black italic text-slate-800 uppercase text-left">bakımım<span className="text-blue-700">.com</span></span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">© 2026 Şeffaf Servis Rehberi</p>
          </div>
          <div className="flex gap-8 items-center text-left">
             <button onClick={() => setAdminModu(!adminModu)} className={`flex items-center gap-2 text-[10px] font-black px-5 py-2.5 rounded-2xl transition-all shadow-sm ${adminModu ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}><Lock size={14}/> {adminModu ? 'KAPAT' : 'GİRİŞ'}</button>
          </div>
        </div>
      </footer>

      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[3.5rem] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-300 text-left">
            <div className="bg-blue-700 p-10 text-white flex justify-between items-center rounded-t-[3.5rem] text-left">
              <div><h2 className="text-3xl font-black italic tracking-tight text-left uppercase">Veri Paylaş</h2></div>
              <button onClick={() => setFormAcik(false)} className="bg-white/10 p-3 rounded-2xl"><X size={28} /></button>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <input placeholder="Marka - Model" className="p-5 bg-slate-50 rounded-3xl font-bold outline-none text-left" />
              <input placeholder="Tutar (TL)" className="p-5 bg-slate-50 rounded-3xl font-bold outline-none text-left" />
              <button onClick={() => setFormAcik(false)} className="col-span-full bg-blue-700 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase italic shadow-lg">Gönder</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, Search, Calendar, ShieldCheck, BadgePercent, 
  FileText, Zap, Settings, BookOpen, ArrowRight, Lock, 
  Edit3, X, Save, Copy, Check 
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
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [duzenlemeId, setDuzenlemeId] = useState<number | null>(null);

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const basHarfYap = (isim: string) => {
    if (!isim) return "Kullanıcı";
    const parcalar = isim.trim().split(' ');
    return parcalar.map(p => p.charAt(0).toUpperCase() + ".").join('');
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
    duzeltilmis.kullanici_bas_harf = basHarfYap(item.ad_soyad || item.isim);
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

  const veriyiSil = (id: number) => {
    const yeniVeri = duzenlenenVeri.filter(i => i.id !== id);
    setDuzenlenenVeri(yeniVeri);
    setSonuclar(sonuclar.filter(i => i.id !== id));
  };

  const hucreGuncelle = (id: number, alan: string, deger: string) => {
    const yeniVeri = duzenlenenVeri.map(i => i.id === id ? { ...i, [alan]: deger } : i);
    setDuzenlenenVeri(yeniVeri);
  };

  const jsonIndir = () => {
    const veriString = JSON.stringify(duzenlenenVeri, null, 2);
    navigator.clipboard.writeText(veriString);
    alert("Güncel veriler kopyalandı! data.json dosyasına yapıştırabilirsiniz.");
  };

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
              <button onClick={() => setAdminModu(!adminModu)} className={`text-[10px] font-black px-5 py-2.5 rounded-xl border transition-all ${adminModu ? 'bg-red-600 text-white border-red-700 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {adminModu ? 'YÖNETİCİ AKTİF' : 'GİRİŞ'}
              </button>
           </div>
      </nav>

      {adminModu && (
        <div className="bg-orange-50 border-b border-orange-200 p-4 sticky top-[82px] z-40 flex justify-center gap-4 animate-in slide-in-from-top-4">
           <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit3 size={16}/> Yönetici Modu Aktif</p>
           <button onClick={jsonIndir} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-orange-700 flex items-center gap-2 transition-colors">
             <Save size={14}/> DATA.JSON KOPYALA
           </button>
        </div>
      )}

      <div className="bg-[#0f172a] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none text-center">FİYAT <span className="text-blue-500 font-black">KIYASLA</span></h1>
          <div className="bg-white p-5 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer text-left"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer text-left"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer text-left"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-xl text-left"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 space-y-6 mt-12 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all text-left">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center text-left relative">
                
                {adminModu && (
                  <div className="absolute top-6 right-8 flex gap-2">
                    <button onClick={() => setDuzenlemeId(duzenlemeId === item.id ? null : item.id)} className={`p-2 rounded-lg transition-colors ${duzenlemeId === item.id ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {duzenlemeId === item.id ? <Check size={16} /> : <Edit3 size={16} />}
                    </button>
                    <button onClick={() => veriyiSil(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><X size={16} /></button>
                  </div>
                )}

                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  {duzenlemeId === item.id ? (
                    <input className="text-2xl font-black bg-slate-100 p-2 rounded-xl w-full" value={item.model} onChange={(e) => hucreGuncelle(item.id, 'model', e.target.value)} />
                  ) : (
                    <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter text-left cursor-pointer" onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)}>{item.model_format}</h2>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full font-black uppercase italic text-left">
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Bakım</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-100 p-1 rounded" value={item.bakim_turu} onChange={(e) => hucreGuncelle(item.id, 'bakim_turu', e.target.value)} /> : <p className="text-base text-slate-700 text-left">{item.bakim_turu}</p>}
                  </div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Konum</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-100 p-1 rounded" value={item.sehir} onChange={(e) => hucreGuncelle(item.id, 'sehir', e.target.value)} /> : <p className="text-base text-slate-700 text-left">{item.sehir}</p>}
                  </div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tarih</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-100 p-1 rounded" value={item.tarih} onChange={(e) => hucreGuncelle(item.id, 'tarih', e.target.value)} /> : <p className="text-base text-slate-500 text-left">{item.tarih}</p>}
                  </div>
                  <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left text-left">Tutar</span>
                    {duzenlemeId === item.id ? <input className="bg-slate-100 p-1 rounded" value={item.fiyat} onChange={(e) => hucreGuncelle(item.id, 'fiyat', e.target.value)} /> : <p className="text-4xl font-black text-blue-700 tracking-tighter text-left">{item.ekran_fiyat}</p>}
                  </div>
                </div>
            </div>

            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left">
                <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 text-left">Detaylar</p>
                  <p className="text-left"><b>Motor:</b> {item.motor || '-'}</p>
                  <p className="text-left"><b>KM:</b> {item.km}</p>
                </div>
                <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 text-left">Servis</p>
                  <p className="text-left"><b>Adı:</b> {item.servis_adi}</p>
                </div>
                <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 rounded-[2rem] shadow-lg text-left text-left">"{item.not || "Doğrulanmış fatura kaydıdır."}"</div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 pt-20 border-t border-slate-200 text-left">
        <div className="flex justify-between items-center mb-16 text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-lg text-left"><BookOpen size={28} /></div>
            <h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter text-left">GÜNCEL BLOG</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2 text-left text-left">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="group text-left text-left text-left">
              <div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300 text-left`}>
                 <div className="absolute bottom-8 left-10 text-left">
                   <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase text-left">{blog.kategori}</span>
                   <h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase text-left">{blog.baslik}</h3>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-20 px-8 text-left text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-left text-left">
          <div className="text-left text-left text-left">
            <span className="text-3xl font-black italic text-slate-800 tracking-tighter uppercase block mb-2 text-left">bakımım<span className="text-blue-700 text-left">.com</span></span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left text-left text-left text-left">© 2026 Şeffaf Servis Platformu</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

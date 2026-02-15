"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  X, Check, Info, FileText, Upload, User,
  Zap, Settings, BookOpen, ArrowRight, Gauge, Fuel 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import bakimData from './data.json';

// --- BLOG VERİLERİ ---
const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi?", renk: "from-slate-900 to-black" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", renk: "from-slate-800 to-slate-900" }
];

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [formAcik, setFormAcik] = useState(false);
  const [servisTipi, setServisTipi] = useState("Yetkili");
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const [formData, setFormData] = useState({
    ad_soyad: '',
    marka_model: '',
    tarih: '',
    servis_adi: '',
    km: '',
    fiyat: '',
    sehir: '',
    motor: ''
  });

  useEffect(() => {
    setDuzenlenenVeri(bakimData);
  }, []);

  const formatYazi = (str: string) => {
    if (!str || str.toLowerCase() === "bilinmiyor") return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    duzeltilmis.fiyat_sayi = isNaN(fiyatSayi) ? 0 : fiyatSayi;
    duzeltilmis.ekran_fiyat = duzeltilmis.fiyat_sayi > 0 ? duzeltilmis.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    
    let hamIsim = item.ad_soyad || item.isim || "";
    duzeltilmis.bas_harfler = hamIsim ? hamIsim.trim().split(/\s+/).map((p: any) => p.charAt(0).toUpperCase() + ".").join(" ") : "";
    
    duzeltilmis.marka_format = formatYazi(item.marka || item.marka_model);
    duzeltilmis.model_format = formatYazi(item.model || "");
    return duzeltilmis;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka_format))).sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka]);

  const sorgula = () => {
    const filtrelenmis = islenmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka_format === secilenMarka;
      const modelUygun = !secilenModel || item.model_format === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(filtrelenmis);
  };

  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    const { error } = await supabase.from('bakim_kayitlari').insert([formData]);
    setYukleniyor(false);
    if (!error) {
      alert("Başarıyla gönderildi!");
      setFormAcik(false);
      setFormData({ ad_soyad: '', marka_model: '', tarih: '', servis_adi: '', km: '', fiyat: '', sehir: '', motor: '' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center"><Car size={28} strokeWidth={2.5} /></div>
              <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-yellow-500">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Şeffaf Servis Rehberi</span></div>
           </Link>
           <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-md flex items-center gap-2 transition-all"><FileText size={14}/> Veri Paylaş</button>
      </nav>

      <div className="bg-[#0f172a] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">FİYAT <span className="text-yellow-500">KIYASLA</span></h1>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option></select>
              <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-yellow-400 transition-all text-left">
            <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer">
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.marka_format}</span>
                    <span className="text-3xl font-black text-slate-800 italic leading-none">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full font-black text-left">
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu}</p></div>
                  <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tarih</span><div className="text-base text-slate-500">{item.tarih}</div></div>
                  <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase">Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic">Detaylar</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>KM:</b> {item.km}</p></div>
                <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic text-left text-left">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                <div className="bg-yellow-500 text-slate-900 p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none">{item.bas_harfler}</p>
                  <div className="mt-5 text-[12px] font-bold border-t border-slate-900/20 pt-4 opacity-90 leading-relaxed text-left">"{item.not || "Doğrulanmış kullanıcı paylaşımı."}"</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* --- BLOG BÖLÜMÜ (TEKRAR EKLENDİ) --- */}
      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 pt-20 border-t border-slate-200">
        <div className="flex justify-between items-center mb-12 text-left">
          <div className="flex items-center gap-4 text-left"><div className="bg-yellow-500 p-3 rounded-2xl text-slate-900 shadow-lg"><BookOpen size={28} /></div><h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter">Servis Rehberi</h2></div>
          <Link href="/blog" className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group"><div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300`}><div className="absolute bottom-8 left-10 text-left"><span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">İçerik</span><h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase">{blog.baslik}</h3></div></div></Link>
          ))}
        </div>
      </section>

      {/* FORM MODAL */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={veriyiGonder} className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="bg-yellow-500 p-10 text-slate-900 flex justify-between items-start sticky top-0 z-10 text-left">
              <div><h2 className="text-4xl font-black italic tracking-tighter leading-none text-left">Bakım Verisi Paylaş</h2><p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mt-3 text-left">ŞEFFAFLIĞA KATKIDA BULUNUN</p></div>
              <button type="button" onClick={() => setFormAcik(false)} className="bg-black/10 p-3 rounded-2xl hover:bg-black/20 transition-all"><X size={28} /></button>
            </div>
            <div className="p-10 space-y-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><User size={14}/> Ad Soyad</label><input required value={formData.ad_soyad} onChange={(e)=>setFormData({...formData, ad_soyad: e.target.value})} placeholder="Örn: Mert Şen" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Car size={14}/> Marka / Model</label><input required value={formData.marka_model} onChange={(e)=>setFormData({...formData, marka_model: e.target.value})} placeholder="Örn: Honda Civic 2024" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Servis Adı</label><input required value={formData.servis_adi} onChange={(e)=>setFormData({...formData, servis_adi: e.target.value})} placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Gauge size={14}/> Kilometre</label><input required value={formData.km} onChange={(e)=>setFormData({...formData, km: e.target.value})} placeholder="Örn: 15.000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><BadgePercent size={14}/> Tutar (TL)</label><input required value={formData.fiyat} onChange={(e)=>setFormData({...formData, fiyat: e.target.value})} placeholder="Örn: 9.500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> Şehir</label><input required value={formData.sehir} onChange={(e)=>setFormData({...formData, sehir: e.target.value})} placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2 text-left md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Fuel size={14}/> Motor / Yakıt</label><input required value={formData.motor} onChange={(e)=>setFormData({...formData, motor: e.target.value})} placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
              </div>
              <button disabled={yukleniyor} type="submit" className="w-full bg-yellow-500 text-slate-900 py-7 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl hover:bg-yellow-400 disabled:opacity-50">
                {yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

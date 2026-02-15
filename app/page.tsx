"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Settings, X, Info, FileText, Upload, User, 
  Zap, BookOpen, ArrowRight, Gauge, Fuel, FileCheck 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- BLOG VERİLERİ ---
const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi?", renk: "from-slate-900 to-black" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", renk: "from-slate-800 to-slate-900" }
];

export default function Home() {
  // Filtreleme
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  
  // Veriler
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  
  // UI Kontrol
  const [formAcik, setFormAcik] = useState(false);
  const [servisTipi, setServisTipi] = useState("Yetkili");
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  
  // Yükleme Durumları
  const [yukleniyor, setYukleniyor] = useState(false);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);
  const [resimSecildi, setResimSecildi] = useState<File | null>(null);

  // VERİTABANI ÇEKME
  useEffect(() => {
    const veriCek = async () => {
        setVeriYukleniyor(true);
        let { data, error } = await supabase
            .from('bakim_kayitlari')
            .select('*')
            .eq('onayli_mi', true)
            .order('id', { ascending: false });

        if (data) {
            setDuzenlenenVeri(data);
            setSonuclar(data);
        }
        setVeriYukleniyor(false);
    };
    veriCek();
  }, []);

  // FORMATLAMA FONKSİYONLARI
  const formatYazi = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getMarkaIcon = (marka: string) => {
    const m = (marka || "").toLowerCase();
    if (m.includes('toyota') || m.includes('honda')) return <Zap size={20} className="text-yellow-500" />;
    if (m.includes('mercedes') || m.includes('bmw') || m.includes('audi')) return <ShieldCheck size={20} className="text-slate-700" />;
    return <Car size={20} className="text-yellow-600" />;
  };

  // VERİ İŞLEME (GÖRÜNTÜLEME İÇİN)
  const veriyiDüzelt = (item: any) => {
    let duzeltilmis = { ...item };
    
    // Fiyat
    duzeltilmis.ekran_fiyat = item.fiyat ? item.fiyat.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    
    // İsim Gizleme (M. Y.)
    if (item.ad_soyad) {
        duzeltilmis.bas_harfler = item.ad_soyad.trim().split(/\s+/).map((p: string) => p.charAt(0).toUpperCase() + ".").join(" ");
    } else {
        duzeltilmis.bas_harfler = "";
    }

    duzeltilmis.marka_format = formatYazi(item.marka);
    duzeltilmis.model_format = formatYazi(item.model);
    return duzeltilmis;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka_format))).filter(Boolean).sort();
  const tumSehirler = Array.from(new Set(islenmisVeri.map(item => item.sehir))).filter(Boolean).sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).sort();
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

  // --- GELİŞMİŞ GÖNDERİM (RESİM YÜKLEMELİ) ---
  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll('input');
    
    let resimUrl = null;

    // 1. Resim Varsa Yükle
    if (resimSecildi) {
      const dosyaAdi = `${Date.now()}_${resimSecildi.name.replace(/\s+/g, '_')}`;
      const { data: resimData, error: resimHata } = await supabase.storage
        .from('faturalar') // Bucket adı
        .upload(dosyaAdi, resimSecildi);

      if (!resimHata && resimData) {
        const { data: urlData } = supabase.storage.from('faturalar').getPublicUrl(dosyaAdi);
        resimUrl = urlData.publicUrl;
      }
    }

    // 2. Veriyi Hazırla
    const yeniKayit = {
        ad_soyad: (inputs[0] as HTMLInputElement).value,
        marka: (inputs[1] as HTMLInputElement).value,
        model: (inputs[2] as HTMLInputElement).value,
        yil: parseInt((inputs[3] as HTMLInputElement).value) || null, // Yeni
        tarih: (inputs[4] as HTMLInputElement).value || new Date().toISOString().split('T')[0],
        servis_adi: (inputs[5] as HTMLInputElement).value,
        km: parseInt((inputs[6] as HTMLInputElement).value),
        fiyat: parseFloat((inputs[7] as HTMLInputElement).value),
        sehir: (inputs[8] as HTMLInputElement).value,
        ilce: (inputs[9] as HTMLInputElement).value, // Yeni (SEO için)
        yakit_motor: (inputs[10] as HTMLInputElement).value,
        
        yetkili_mi: servisTipi === "Yetkili",
        fatura_url: resimUrl,
        onayli_mi: false
    };

    const { error } = await supabase.from('bakim_kayitlari').insert([yeniKayit]);

    setYukleniyor(false);
    if (!error) {
        alert("Veri ve fatura başarıyla gönderildi! Onaylandıktan sonra yayınlanacaktır.");
        setFormAcik(false);
        setResimSecildi(null);
        form.reset();
    } else {
        alert("Hata oluştu: " + error.message);
    }
  };

  // İstatistikler
  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === true);
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== true);
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center"><Car size={28} strokeWidth={2.5} /></div>
              <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-yellow-500">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-left">Şeffaf Servis Rehberi</span></div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest flex items-center gap-2 mr-2"><BookOpen size={16}/> BLOG</Link>
              <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-md flex items-center gap-2 transition-all"><FileText size={14}/> Veri Paylaş</button>
           </div>
      </nav>

      <div className="bg-[#0f172a] py-20 px-6 text-left">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter text-center text-left">FİYAT <span className="text-yellow-500 text-left">KIYASLA</span></h1>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map((m:any) => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map((m:any) => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option>{tumSehirler.map((s:any) => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {veriYukleniyor ? (
          <div className="text-center py-20 font-bold text-slate-400 animate-pulse">Veriler Supabase'den çekiliyor...</div>
      ) : sonuclar.length > 0 ? (
        <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20 text-left">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-left"><ShieldCheck size={18} className="text-yellow-600"/> Yetkili Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center text-left text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-emerald-600"><BadgePercent size={18}/> Özel Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400 font-bold">Kayıt bulunamadı.</div>
      )}

      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-yellow-400 transition-all text-left">
            <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer text-left">
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2 uppercase font-bold text-slate-400">{getMarkaIcon(item.marka)}<span className="text-sm tracking-widest">{item.marka_format}</span></div>
                    <span className="text-3xl font-black text-slate-800 tracking-tight italic">{item.model_format} <span className="text-slate-300 text-xl not-italic">'{item.yil ? item.yil.toString().slice(2) : '-'}</span></span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black">
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Bakım</span><p className="text-base text-slate-700">{item.yakit_motor || "-"}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Konum</span><p className="text-base text-slate-700">{item.sehir} {item.ilce && <span className="text-slate-400 text-xs">/ {item.ilce}</span>}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tarih</span><div className="text-base text-slate-500">{item.tarih || "2024"}</div></div>
                  <div className="flex flex-col items-end md:items-start text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic">Detaylar</p><p><b>Motor:</b> {item.yakit_motor || '-'}</p><p><b>KM:</b> {item.km}</p></div>
                <div className="space-y-2 uppercase text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                <div className="bg-yellow-500 text-slate-900 p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none text-left">{item.bas_harfler}</p>
                  <div className="mt-5 text-[12px] font-bold border-t border-slate-900/20 pt-4 opacity-90 leading-relaxed text-left">
                    "{item.notlar || "Doğrulanmış kullanıcı paylaşımı."}"
                    {item.fatura_url && (
                        <a href={item.fatura_url} target="_blank" className="block mt-4 bg-slate-900 text-white py-2 px-4 rounded-xl text-center hover:bg-slate-800 transition-all flex items-center justify-center gap-2 not-italic">
                            <FileCheck size={16} /> Faturayı Görüntüle
                        </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 pt-20 border-t border-slate-200">
        <div className="flex justify-between items-center mb-12 text-left">
          <div className="flex items-center gap-4 text-left"><div className="bg-yellow-500 p-3 rounded-2xl text-slate-900 shadow-lg"><BookOpen size={28} /></div><h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter text-left">Servis Rehberi</h2></div>
          <Link href="/blog" className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2 text-left">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group"><div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300`}><div className="absolute bottom-8 left-10 text-left"><span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">İçerik</span><h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase">{blog.baslik}</h3></div></div></Link>
          ))}
        </div>
      </section>

      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300 text-left">
            <div className="bg-yellow-500 p-10 text-slate-900 flex justify-between items-start sticky top-0 z-10 text-left">
              <div><h2 className="text-4xl font-black italic tracking-tighter leading-none text-left">Bakım Verisi Paylaş</h2><p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mt-3 text-left">ŞEFFAFLIĞA KATKIDA BULUNUN</p></div>
              <button onClick={() => setFormAcik(false)} className="bg-black/10 p-3 rounded-2xl hover:bg-black/20 transition-all text-left"><X size={28} /></button>
            </div>
            <form onSubmit={veriyiGonder} className="p-10 space-y-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><User size={14}/> Ad Soyad</label><input required placeholder="Örn: Mert Şen" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Car size={14}/> Marka</label><input required placeholder="Örn: Honda" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Info size={14}/> Model</label><input required placeholder="Örn: Civic" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Calendar size={14}/> Model Yılı</label><input type="number" placeholder="Örn: 2023" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>

                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Calendar size={14}/> Bakım Tarihi</label><input required type="date" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Settings size={14}/> Servis Adı</label><input required placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Gauge size={14}/> Kilometre</label><input required type="number" placeholder="Örn: 15000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><BadgePercent size={14}/> Tutar (TL)</label><input required type="number" placeholder="Örn: 9500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><ShieldCheck size={14}/> Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner text-left">
                    <button type="button" onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Yetkili' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>YETKİLİ</button>
                    <button type="button" onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Özel' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>ÖZEL</button>
                  </div>
                </div>
                
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><MapPin size={14}/> Şehir</label><input required placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><MapPin size={14}/> İlçe</label><input placeholder="Örn: Kadıköy" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Fuel size={14}/> Motor / Yakıt</label><input required placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
              </div>

              {/* FOTOĞRAF YÜKLEME ALANI */}
              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50/50 hover:bg-blue-50 transition-all cursor-pointer relative mt-4">
                <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setResimSecildi(e.target.files[0]);
                        }
                    }}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-5 rounded-3xl shadow-sm text-yellow-600">
                    {resimSecildi ? <Check size={32} /> : <Upload size={32} />}
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase">
                    {resimSecildi ? "Dosya Seçildi: " + resimSecildi.name : "FATURA VEYA FİŞ FOTOĞRAFI YÜKLE"}
                  </p>
                </div>
              </div>

              <button disabled={yukleniyor} type="submit" className="w-full bg-yellow-500 text-slate-900 py-7 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl hover:bg-yellow-400 transition-all active:scale-[0.98] mt-4 text-left">
                {yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

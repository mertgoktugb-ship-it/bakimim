"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Database, Edit3, X, Check, Info, FileText, Upload, 
  Zap, Settings, Mail, Lock, Save, BookOpen, ArrowRight, Gauge, Fuel, User
} from 'lucide-react';
// Supabase bağlantısını ekliyoruz
import { supabase } from '../lib/supabase';
// json importunu sildik veya kullanmayacağız, veriler artık db'den gelecek

// --- BLOG VERİLERİ (Sarı Temaya Uygun Koyu Renkler) ---
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
  const [adminModu, setAdminModu] = useState(false);
  const [formAcik, setFormAcik] = useState(false);
  const [servisTipi, setServisTipi] = useState("Yetkili");
  
  // JSON yerine verileri Supabase'den çekeceğiz, başlangıç boş dizi
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);

  // --- SUPABASE'DEN VERİ ÇEKME ---
  useEffect(() => {
    const veriCek = async () => {
        setVeriYukleniyor(true);
        // Sadece 'onayli_mi' true olanları çekiyoruz
        let { data, error } = await supabase
            .from('bakim_kayitlari')
            .select('*')
            .eq('onayli_mi', true)
            .order('id', { ascending: false });

        if (data) {
            setDuzenlenenVeri(data);
        }
        setVeriYukleniyor(false);
    };
    veriCek();
  }, []);

  const formatYazi = (str: string) => {
    if (!str || str.toLowerCase() === "bilinmiyor") return "";
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getMarkaIcon = (marka: string) => {
    const m = (marka || "").toLowerCase();
    if (m.includes('toyota') || m.includes('honda')) return <Zap size={20} className="text-yellow-500" />;
    if (m.includes('mercedes') || m.includes('bmw') || m.includes('audi')) return <ShieldCheck size={20} className="text-slate-700" />;
    return <Car size={20} className="text-yellow-600" />;
  };

  const veriyiDüzelt = (item: any) => {
    // SUPABASE UYUMLULUK AYARI (Eski kod mantığı bozulmasın diye mapping yapıyoruz)
    if (item.marka_model && !item.marka) {
        const parts = item.marka_model.split(' ');
        item.marka = parts[0];
        item.model = parts.slice(1).join(' ');
    }
    if (item.yakit_motor) item.motor = item.yakit_motor;
    if (item.notlar) item.not = item.notlar;
    // -----------------------------------------------------------------------

    let duzeltilmis = { ...item };
    const servisIsmi = (item.servis_adi || "").toLowerCase();
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "efe", "ata"];
    
    // Veritabanından gelen yetkili_mi varsa onu kullan, yoksa tahmin et
    if (item.yetkili_mi === "Evet" || yetkiliKeywords.some(kw => servisIsmi.includes(kw))) {
        duzeltilmis.yetkili_mi = "Evet";
    } else {
        duzeltilmis.yetkili_mi = "Hayır";
    }
    
    let hamFiyat = item.fiyat_tl || item.fiyat || 0;
    let fiyatSayi = typeof hamFiyat === 'string' ? parseFloat(hamFiyat.replace(/[^\d]/g, '')) : hamFiyat;
    duzeltilmis.fiyat_sayi = isNaN(fiyatSayi) ? 0 : fiyatSayi;
    duzeltilmis.ekran_fiyat = duzeltilmis.fiyat_sayi > 0 ? duzeltilmis.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    
    // --- İSİM GİZLEME KODUNUZ (A harfini kaldırıyoruz) ---
    // let hamIsim = item.ad_soyad || item.isim || "";
    // if (!hamIsim && item.not) {
    //     const notIsimMatch = item.not.match(/^([A-ZİĞÜŞÖÇ][a-zığüşöç\.]+(\s+[A-ZİĞÜŞÖÇ][a-zığüşöç\.]+)*)/);
    //     if (notIsimMatch) hamIsim = notIsimMatch[0];
    // }
    // if (hamIsim) {
    //     if (hamIsim.includes('.')) {
    //         duzeltilmis.bas_harfler = hamIsim;
    //     } else {
    //         duzeltilmis.bas_harfler = hamIsim.trim().split(/\s+/).map((p: any) => p.charAt(0).toUpperCase() + ".").join(" ");
    //     }
    // } else {
    //     duzeltilmis.bas_harfler = ""; 
    // }
    duzeltilmis.bas_harfler = ""; // 'A.' veya herhangi bir baş harf görünmemesi için boş bırakıldı.
    // ---------------------------------------------

    duzeltilmis.temiz_not = (item.not || "").replace(/\b([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\s+([A-ZÇĞİÖŞÜ])[a-zçğıöşü]+\b/g, "$1. $2.");
    duzeltilmis.marka_format = formatYazi(item.marka);
    duzeltilmis.model_format = formatYazi(item.model);
    return duzeltilmis;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka))).filter(Boolean).sort();
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

  // Açılışta tüm verileri göster (opsiyonel, boş kalmasın diye)
  useEffect(() => {
    if (islenmisVeri.length > 0 && sonuclar.length === 0) {
        setSonuclar(islenmisVeri);
    }
  }, [islenmisVeri]);


  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll('input');
    
    const data = {
        ad_soyad: (inputs[0] as HTMLInputElement).value,
        marka_model: (inputs[1] as HTMLInputElement).value,
        tarih: (inputs[2] as HTMLInputElement).value,
        servis_adi: (inputs[3] as HTMLInputElement).value,
        km: parseInt((inputs[4] as HTMLInputElement).value),
        fiyat: parseFloat((inputs[5] as HTMLInputElement).value),
        sehir: (inputs[6] as HTMLInputElement).value,
        yakit_motor: (inputs[7] as HTMLInputElement).value,
        yetkili_mi: servisTipi === "Yetkili" ? "Evet" : "Hayır",
        onayli_mi: false
    };

    const { error } = await supabase.from('bakim_kayitlari').insert([data]);

    setYukleniyor(false);
    if (!error) {
        alert("Veri başarıyla onaya gönderildi!");
        setFormAcik(false);
        form.reset();
    } else {
        alert("Hata: " + error.message);
    }
  };

  const yetkiliKayitlar = sonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = sonuclar.filter(i => i.yetkili_mi !== "Evet");
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center transition-transform hover:scale-105"><Car size={28} strokeWidth={2.5} /></div>
              <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-yellow-500">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-left">Şeffaf Servis Rehberi</span></div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest flex items-center gap-2 mr-2"><BookOpen size={16}/> BLOG</Link>
              <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-md flex items-center gap-2 transition-all"><FileText size={14}/> Veri Paylaş</button>
              <button onClick={() => setAdminModu(!adminModu)} className="text-slate-300 hover:text-slate-500 ml-2 transition-colors"><Lock size={16}/></button>
           </div>
      </nav>

      <div className="bg-[#0f172a] py-20 px-6 text-left">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter text-center text-left">FİYAT <span className="text-yellow-500 text-left">KIYASLA</span></h1>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Marka Seçin</option>{tumMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Model Seçin</option>{musaitModeller.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={secilenSehir} onChange={(e) => setSecilenSehir(e.target.value)} className="p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none cursor-pointer"><option value="">Şehir Seçin</option>{tumSehirler.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-lg"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {veriYukleniyor ? (
          <div className="text-center py-20 font-bold text-slate-400">Veriler Yükleniyor...</div>
      ) : sonuclar.length > 0 && (
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
      )}

      <section className="max-w-5xl mx-auto px-6 space-y-5 mt-10 text-left">
        {sonuclar.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-yellow-400 transition-all text-left">
            <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer text-left">
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2 uppercase font-bold text-slate-400">{getMarkaIcon(item.marka)}<span className="text-sm tracking-widest">{item.marka_format}</span></div>
                    <span className="text-3xl font-black text-slate-800 tracking-tight italic">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black">
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu || item.motor}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left text-left text-left text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tarih</span><div className="text-base text-slate-500">{item.tarih}</div></span></div>
                  <div className="flex flex-col items-end md:items-start text-left text-left text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left text-left text-left text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic">Detaylar</p><p><b>Motor:</b> {item.motor || '-'}</p><p><b>KM:</b> {item.km}</p></div>
                <div className="space-y-2 uppercase text-left text-left text-left text-left text-left text-left text-left text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic text-left text-left text-left">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                <div className="bg-yellow-500 text-slate-900 p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none text-left">{item.bas_harfler}</p>
                  <div className="mt-5 text-[12px] font-bold border-t border-slate-900/20 pt-4 opacity-90 leading-relaxed text-left text-left text-left">"{item.temiz_not || "Doğrulanmış kullanıcı paylaşımı."}"</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* --- BLOG BÖLÜMÜ (Aynen korundu) --- */}
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
            <div className="bg-yellow-500 p-10 text-slate-900 flex justify-between items-start sticky top-0 z-10 text-left text-left">
              <div><h2 className="text-4xl font-black italic tracking-tighter leading-none text-left text-left text-left text-left text-left">Bakım Verisi Paylaş</h2><p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mt-3 text-left">ŞEFFAFLIĞA KATKIDA BULUNUN</p></div>
              <button onClick={() => setFormAcik(false)} className="bg-black/10 p-3 rounded-2xl hover:bg-black/20 transition-all text-left text-left text-left text-left"><X size={28} /></button>
            </div>
            <form onSubmit={veriyiGonder} className="p-10 space-y-10 text-left text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-left">
                <div className="space-y-2 text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left"><User size={14}/> Ad Soyad</label><input required placeholder="Örn: Mert Şen" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left"><Car size={14}/> Marka / Model</label><input required placeholder="Örn: Honda Civic 2024" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left"><Calendar size={14}/> Bakım Tarihi</label><input required type="date" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left"><Settings size={14}/> Servis Adı</label><input required placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left"><Gauge size={14}/> Kilometre</label><input required type="number" placeholder="Örn: 15.000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner text-left" /></div>
                <div className="space-y-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left"><BadgePercent size={14}/> Tutar (TL)</label><input required type="number" placeholder="Örn: 9.500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner text-left text-left" /></div>
                <div className="space-y-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><ShieldCheck size={14}/> Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">
                    <button type="button" onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Yetkili' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>YETKİLİ</button>
                    <button type="button" onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Özel' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="space-y-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><MapPin size={14}/> Şehir</label><input required placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left" /></div>
                <div className="space-y-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left"><Fuel size={14}/> Motor / Yakıt</label><input required placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left" /></div>
              </div>
              <button disabled={yukleniyor} type="submit" className="w-full bg-yellow-500 text-slate-900 py-7 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl hover:bg-yellow-400 transition-all active:scale-[0.98] mt-4 text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left text-left">
                {yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

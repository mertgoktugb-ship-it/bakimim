"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  X, Check, Info, FileText, Upload, User,
  Zap, Settings, BookOpen, ArrowRight, Gauge, Fuel 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  
  // VERİLER ARTIK JSON DEĞİL, BOŞ DİZİ İLE BAŞLIYOR
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true); // Sayfa açılış animasyonu için

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

  // --- 1. ADIM: VERİLERİ ARTIK SUPABASE'DEN ÇEKİYORUZ ---
  useEffect(() => {
    fetchVeriler();
  }, []);

  const fetchVeriler = async () => {
    setVeriYukleniyor(true);
    // Veritabanından 'onayli_mi' kutusu TRUE olanları çek
    let { data, error } = await supabase
      .from('bakim_kayitlari')
      .select('*')
      .eq('onayli_mi', true) // Sadece onaylıları göster
      .order('id', { ascending: false }); // En yeniler üstte

    if (error) {
      console.log("Veri çekme hatası:", error);
    } else {
      if (data) {
        setDuzenlenenVeri(data);
        setSonuclar(data); // İlk açılışta hepsini göster
      }
    }
    setVeriYukleniyor(false);
  };

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
    let duzeltilmis = { ...item };
    
    // Veritabanından gelen 'marka_model' tek parça olduğu için onu ayıklamaya çalışalım
    // Eğer veritabanında ayrı ayrı marka ve model sütunları yoksa, marka_model'i kullanırız
    let markaStr = item.marka_model || item.marka || "";
    
    let hamFiyat = item.fiyat || 0;
    duzeltilmis.fiyat_sayi = Number(hamFiyat);
    duzeltilmis.ekran_fiyat = duzeltilmis.fiyat_sayi > 0 ? duzeltilmis.fiyat_sayi.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız";
    
    // İSİM GİZLEME MANTIĞI (KORUNDU)
    let hamIsim = item.ad_soyad || "";
    if (hamIsim) {
        duzeltilmis.bas_harfler = hamIsim.trim().split(/\s+/).map((p: string) => p.charAt(0).toUpperCase() + ".").join(" ");
    } else {
        duzeltilmis.bas_harfler = "";
    }
    
    duzeltilmis.marka_format = formatYazi(markaStr);
    // Model bilgisini marka_model içinden çıkarmak zor olabilir, şimdilik aynısını basalım veya veritabanı yapına göre ayarlarız
    duzeltilmis.model_format = formatYazi(markaStr); 
    
    // Yetkili Servis Kontrolü
    const servisIsmi = (item.servis_adi || "").toLowerCase();
    const yetkiliKeywords = ["arkas", "otokoç", "birmot", "doğuş", "mengerler", "inallar", "herter", "alj", "toyotronik", "mais", "efe", "ata", "yetkili"];
    // Veritabanında yetkili_mi sütunu varsa onu kullan, yoksa tahmin et
    if (item.yetkili_mi === "Evet" || yetkiliKeywords.some(kw => servisIsmi.includes(kw))) {
        duzeltilmis.yetkili_mi = "Evet";
    } else {
        duzeltilmis.yetkili_mi = "Hayır";
    }

    return duzeltilmis;
  };

  const islenmisVeri = duzenlenenVeri.map(veriyiDüzelt);
  
  // Filtreler için listeleri oluştur
  const tumMarkalar = Array.from(new Set(islenmisVeri.map(item => item.marka_format.split(" ")[0]))).sort(); // Sadece ilk kelimeyi marka alalım
  
  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(islenmisVeri.filter(item => item.marka_format.includes(secilenMarka)).map(item => item.marka_format))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka, duzenlenenVeri]);

  const sorgula = () => {
    const filtrelenmis = islenmisVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka_format.includes(secilenMarka);
      const modelUygun = !secilenModel || item.marka_format === secilenModel;
      const sehirUygun = !secilenSehir || (item.sehir && item.sehir === secilenSehir);
      return markaUygun && modelUygun && sehirUygun;
    });
    setSonuclar(duzenlenenVeri.filter(d => filtrelenmis.some(f => f.id === d.id)));
  };

  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    
    const yeniVeri = {
        ad_soyad: formData.ad_soyad,
        marka_model: formData.marka_model,
        tarih: formData.tarih || new Date().toISOString().split('T')[0], // Tarih yoksa bugünü at
        servis_adi: formData.servis_adi,
        km: parseInt(formData.km),
        fiyat: parseFloat(formData.fiyat),
        sehir: formData.sehir,
        yakit_motor: formData.motor, // DB'deki sütun adı 'yakit_motor'
        yetkili_mi: servisTipi === "Yetkili" ? "Evet" : "Hayır",
        onayli_mi: false // Yeni veri onaysız gider
    };

    const { error } = await supabase.from('bakim_kayitlari').insert([yeniVeri]);
    setYukleniyor(false);
    
    if (!error) {
      alert("Başarıyla gönderildi! Yönetici onayından sonra yayınlanacak.");
      setFormAcik(false);
      setFormData({ ad_soyad: '', marka_model: '', tarih: '', servis_adi: '', km: '', fiyat: '', sehir: '', motor: '' });
      // Listeyi yenilememize gerek yok çünkü onaylanmadı henüz
    } else {
      alert("Hata: " + error.message);
    }
  };

  // İstatistikler (Sonuçlar üzerinden hesaplanır)
  const renderSonuclar = sonuclar.map(veriyiDüzelt);
  const yetkiliKayitlar = renderSonuclar.filter(i => i.yetkili_mi === "Evet");
  const ozelKayitlar = renderSonuclar.filter(i => i.yetkili_mi !== "Evet");
  
  const avgYetkili = yetkiliKayitlar.length > 0 ? Math.round(yetkiliKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / yetkiliKayitlar.length) : 0;
  const avgOzel = ozelKayitlar.length > 0 ? Math.round(ozelKayitlar.reduce((a, b) => a + (b.fiyat_sayi || 0), 0) / ozelKayitlar.length) : 0;

  // Şehir listesi
  const tumSehirler = Array.from(new Set(islenmisVeri.map(item => item.sehir))).filter(Boolean).sort();

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

      <div className="bg-[#0f172a] py-20 px-6">
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

      {/* Yükleniyor veya Sonuç Yok Durumu */}
      {veriYukleniyor ? (
         <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Veriler Supabase'den çekiliyor...</div>
      ) : renderSonuclar.length === 0 ? (
         <div className="text-center py-20 text-slate-400 font-bold">Kriterlere uygun kayıt bulunamadı.</div>
      ) : (
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
        {renderSonuclar.map((item:any) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-yellow-400 transition-all text-left">
            <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer text-left">
                <div className="md:w-64 mr-10 text-left">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block ${item.yetkili_mi === 'Evet' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{item.yetkili_mi === 'Evet' ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2 uppercase font-bold text-slate-400">{getMarkaIcon(item.marka_format)}<span className="text-sm tracking-widest">{item.marka_format}</span></div>
                    <span className="text-3xl font-black text-slate-800 tracking-tight italic">{item.model_format}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full text-left font-black">
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Bakım</span><p className="text-base text-slate-700">{item.yakit_motor || item.bakim_turu || "Periyodik"}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Konum</span><p className="text-base text-slate-700">{item.sehir}</p></div>
                  <div className="flex flex-col text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tarih</span><div className="text-base text-slate-500">{item.tarih || "2024"}</div></div>
                  <div className="flex flex-col items-end md:items-start text-left text-left"><span className="text-[11px] text-slate-300 mb-2 uppercase text-left">Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                </div>
            </div>
            {acikKartId === item.id && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm italic text-left animate-in slide-in-from-top-4">
                <div className="space-y-2 uppercase text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic">Detaylar</p><p><b>Motor:</b> {item.yakit_motor || '-'}</p><p><b>KM:</b> {item.km}</p></div>
                <div className="space-y-2 uppercase text-left text-left text-left"><p className="text-[10px] font-black text-slate-400 tracking-widest border-b pb-1 mb-2 italic text-left text-left">Servis Bilgisi</p><p><b>Servis:</b> {item.servis_adi}</p></div>
                <div className="bg-yellow-500 text-slate-900 p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center text-left">
                  <p className="text-3xl font-black italic tracking-tighter uppercase leading-none text-left">{item.bas_harfler}</p>
                  <div className="mt-5 text-[12px] font-bold border-t border-slate-900/20 pt-4 opacity-90 leading-relaxed text-left text-left">"{item.notlar || item.not || "Doğrulanmış kullanıcı paylaşımı."}"</div>
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
            <form onSubmit={veriyiGonder} className="p-10 space-y-10 text-left text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-left">
                <div className="space-y-2 text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><User size={14}/> Ad Soyad</label><input required value={formData.ad_soyad} onChange={(e)=>setFormData({...formData, ad_soyad: e.target.value})} placeholder="Örn: Mert Şen" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Car size={14}/> Marka / Model</label><input required value={formData.marka_model} onChange={(e)=>setFormData({...formData, marka_model: e.target.value})} placeholder="Örn: Honda Civic 2024" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Settings size={14}/> Servis Adı</label><input required value={formData.servis_adi} onChange={(e)=>setFormData({...formData, servis_adi: e.target.value})} placeholder="Örn: Honda Mutluhan" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Gauge size={14}/> Kilometre</label><input required value={formData.km} onChange={(e)=>setFormData({...formData, km: e.target.value})} placeholder="Örn: 15.000" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><BadgePercent size={14}/> Tutar (TL)</label><input required value={formData.fiyat} onChange={(e)=>setFormData({...formData, fiyat: e.target.value})} placeholder="Örn: 9.500" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><ShieldCheck size={14}/> Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner text-left text-left">
                    <button type="button" onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Yetkili' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>YETKİLİ</button>
                    <button type="button" onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase transition-all ${servisTipi === 'Özel' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="space-y-2 text-left text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><MapPin size={14}/> Şehir</label><input required value={formData.sehir} onChange={(e)=>setFormData({...formData, sehir: e.target.value})} placeholder="Örn: İstanbul" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
                <div className="space-y-2 text-left md:col-span-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left"><Fuel size={14}/> Motor / Yakıt</label><input required value={formData.motor} onChange={(e)=>setFormData({...formData, motor: e.target.value})} placeholder="Örn: 1.5 VTEC / Benzin" className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-bold outline-none text-left shadow-inner" /></div>
              </div>
              <button disabled={yukleniyor} type="submit" className="w-full bg-yellow-500 text-slate-900 py-7 rounded-[2.5rem] font-black text-2xl uppercase italic tracking-tighter shadow-xl hover:bg-yellow-400 disabled:opacity-50 text-left">
                {yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

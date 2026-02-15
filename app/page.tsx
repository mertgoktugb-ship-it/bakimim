"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Settings, X, Check, Info, FileText, Upload, User, 
  Zap, BookOpen, ArrowRight, Gauge, Fuel, FileCheck, Wrench, MessageSquare, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- BLOG VERİLERİ (Build hatasını çözen eksik değişken) ---
const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi?", renk: "from-slate-900 to-black" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", renk: "from-slate-800 to-slate-900" }
];

// --- ÖZEL SELECT BİLEŞENİ ---
const CustomSelect = ({ label, value, options, onChange, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-50 rounded-2xl font-bold cursor-pointer flex items-center justify-between transition-all hover:bg-slate-100 border border-transparent active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={18} className="text-slate-400 shrink-0" />}
          <span className={value ? "text-slate-800" : "text-slate-400"}>
            {value || label}
          </span>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            <div 
              onClick={() => { onChange(""); setIsOpen(false); }}
              className="px-5 py-3 hover:bg-slate-50 text-slate-400 text-sm font-bold cursor-pointer transition-colors"
            >
              {label} (Sıfırla)
            </div>
            {options.map((opt: string) => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center justify-between ${value === opt ? 'bg-yellow-50 text-yellow-700' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                {opt}
                {value === opt && <Check size={14} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [filtreServisTipi, setFiltreServisTipi] = useState("Farketmez");

  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [istatistikVerisi, setIstatistikVerisi] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [formAcik, setFormAcik] = useState(false);
  const [servisTipi, setServisTipi] = useState("Yetkili");
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);
  const [resimSecildi, setResimSecildi] = useState<File | null>(null);

  const normalizeMetin = (str: string) => {
    if (!str) return "";
    const temiz = str.trim();
    return temiz.charAt(0).toLocaleUpperCase('tr-TR') + temiz.slice(1).toLocaleLowerCase('tr-TR');
  };

  const veriCek = useCallback(async () => {
    setVeriYukleniyor(true);
    try {
      const { data, error } = await supabase
        .from('bakim_kayitlari')
        .select('*')
        .eq('onayli_mi', true)
        .order('id', { ascending: false });

      if (data) {
        const valideEdilmisData = data.filter(item => item.marka && item.model && item.fiyat).map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir), 
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          ekran_fiyat: item.fiyat ? item.fiyat.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız",
          bas_harfler: item.ad_soyad ? item.ad_soyad.trim().split(/\s+/).map((p: string) => p.charAt(0).toUpperCase() + ".").join(" ") : ""
        }));
        setDuzenlenenVeri(valideEdilmisData);
        setSonuclar(valideEdilmisData);
        setIstatistikVerisi(valideEdilmisData);
      }
    } finally {
      setVeriYukleniyor(false);
    }
  }, []);

  useEffect(() => { veriCek(); }, [veriCek]);

  const tumMarkalar = Array.from(new Set(duzenlenenVeri.map(item => item.marka_format))).sort();
  const tumSehirler = Array.from(new Set(duzenlenenVeri.map(item => item.sehir))).sort();

  useEffect(() => {
    if (secilenMarka) {
      const modeller = Array.from(new Set(duzenlenenVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).sort();
      setMusaitModeller(modeller);
    } else { setMusaitModeller([]); }
  }, [secilenMarka, duzenlenenVeri]);

  const sorgula = () => {
    const temelFiltre = duzenlenenVeri.filter(item => {
      const markaUygun = !secilenMarka || item.marka_format === secilenMarka;
      const modelUygun = !secilenModel || item.model_format === secilenModel;
      const sehirUygun = !secilenSehir || item.sehir === secilenSehir;
      return markaUygun && modelUygun && sehirUygun;
    });
    const listeFiltresi = temelFiltre.filter(item => {
      if (filtreServisTipi === "Yetkili") return item.yetkili_mi === true;
      if (filtreServisTipi === "Özel") return item.yetkili_mi === false;
      return true;
    });
    setIstatistikVerisi(temelFiltre);
    setSonuclar(listeFiltresi);
  };

  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll('input');
    const textArea = form.querySelector('textarea');
    let resimUrl = null;

    try {
      if (resimSecildi) {
        const dosyaAdi = `${Date.now()}_${resimSecildi.name.replace(/\s+/g, '_')}`;
        const { data: resimData, error: resimHata } = await supabase.storage.from('faturalar').upload(dosyaAdi, resimSecildi);
        if (!resimHata && resimData) {
          const { data: urlData } = supabase.storage.from('faturalar').getPublicUrl(dosyaAdi);
          resimUrl = urlData.publicUrl;
        }
      }
      await supabase.from('bakim_kayitlari').insert([{
        ad_soyad: (inputs[0] as HTMLInputElement).value,
        marka: (inputs[1] as HTMLInputElement).value,
        model: (inputs[2] as HTMLInputElement).value,
        yil: parseInt((inputs[3] as HTMLInputElement).value) || null,
        tarih: (inputs[4] as HTMLInputElement).value || new Date().toISOString().split('T')[0],
        bakim_turu: (inputs[5] as HTMLInputElement).value,
        servis_adi: (inputs[6] as HTMLInputElement).value,
        km: parseInt((inputs[7] as HTMLInputElement).value),
        fiyat: parseFloat((inputs[8] as HTMLInputElement).value),
        sehir: (inputs[9] as HTMLInputElement).value,
        ilce: (inputs[10] as HTMLInputElement).value,
        yakit_motor: (inputs[11] as HTMLInputElement).value,
        notlar: textArea ? textArea.value : "",
        yetkili_mi: servisTipi === "Yetkili",
        servis_tipi: servisTipi === "Yetkili" ? "yetkili" : "ozel",
        kaynak: "site_formu",
        fatura_url: resimUrl,
        onayli_mi: false
      }]);
      alert("Veri başarıyla onaya gönderildi!");
      setFormAcik(false);
      setResimSecildi(null);
      form.reset();
    } finally { setYukleniyor(false); }
  };

  const avgYetkili = istatistikVerisi.filter(i => i.yetkili_mi).length > 0 
    ? Math.round(istatistikVerisi.filter(i => i.yetkili_mi).reduce((a, b) => a + (b.fiyat || 0), 0) / istatistikVerisi.filter(i => i.yetkili_mi).length) : 0;
  const avgOzel = istatistikVerisi.filter(i => !i.yetkili_mi).length > 0 
    ? Math.round(istatistikVerisi.filter(i => !i.yetkili_mi).reduce((a, b) => a + (b.fiyat || 0), 0) / istatistikVerisi.filter(i => !i.yetkili_mi).length) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left relative font-sans">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center transition-transform hover:scale-105"><Car size={28} /></div>
          <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-yellow-500">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Şeffaf Servis Rehberi</span></div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest flex items-center gap-2 mr-2"><BookOpen size={16}/> BLOG</Link>
          <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-md flex items-center gap-2 transition-all active:scale-95"><FileText size={14}/> Veri Paylaş</button>
        </div>
      </nav>

      <div className="bg-[#0f172a] py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-10 uppercase italic tracking-tighter">FİYAT <span className="text-yellow-500">KIYASLA</span></h1>
          <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-5 gap-4">
            <CustomSelect label="Marka Seçin" value={secilenMarka} options={tumMarkalar} onChange={setSecilenMarka} icon={Car} />
            <CustomSelect label="Model Seçin" value={secilenModel} options={musaitModeller} onChange={setSecilenModel} icon={Info} />
            <CustomSelect label="Şehir Seçin" value={secilenSehir} options={tumSehirler} onChange={setSecilenSehir} icon={MapPin} />
            <CustomSelect label="Servis Tipi" value={filtreServisTipi} options={["Farketmez", "Yetkili", "Özel"]} onChange={setFiltreServisTipi} icon={ShieldCheck} />
            <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-3 uppercase shadow-xl transition-all text-lg active:scale-95"><Search size={24} /> Sorgula</button>
          </div>
        </div>
      </div>

      {veriYukleniyor ? (
        <div className="text-center py-20 font-bold text-slate-300 animate-pulse text-2xl uppercase italic tracking-widest">Veritabanına Bağlanılıyor...</div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto px-6 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-20">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center transition-transform hover:-translate-y-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><ShieldCheck size={18} className="text-yellow-600"/> Yetkili Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgYetkili.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center transition-transform hover:-translate-y-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-emerald-600"><BadgePercent size={18}/> Özel Ortalaması</p>
              <p className="text-4xl font-black text-slate-900">{avgOzel.toLocaleString('tr-TR')} TL</p>
            </div>
          </div>

          <section className="max-w-5xl mx-auto px-6 space-y-6">
            {sonuclar.length > 0 ? sonuclar.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-yellow-400 transition-all">
                <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 md:p-10 flex flex-col md:flex-row items-center cursor-pointer">
                  <div className="md:w-64 mr-10">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase mb-4 inline-block shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900 shadow-yellow-500/30' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}>
                      {item.yetkili_mi ? 'YETKİLİ SERVİS' : 'ÖZEL SERVİS'}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 uppercase font-bold text-slate-400">
                        {item.marka_format === 'Honda' || item.marka_format === 'Toyota' ? <Zap size={20} className="text-yellow-500" /> : <Car size={20} className="text-yellow-600" />}
                        <span className="text-sm tracking-widest">{item.marka_format}</span>
                      </div>
                      <span className="text-3xl font-black text-slate-800 tracking-tight italic">{item.model_format} <span className="text-slate-300 text-xl not-italic">'{item.yil ? item.yil.toString().slice(2) : '-'}</span></span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 w-full font-black">
                    <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase tracking-wider">Bakım</span><p className="text-base text-slate-700">{item.bakim_turu || "Periyodik"}</p></div>
                    <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase tracking-wider">Konum</span><p className="text-base text-slate-700 truncate">{item.sehir} {item.ilce && <span className="text-slate-400 text-xs">/ {item.ilce}</span>}</p></div>
                    <div className="flex flex-col"><span className="text-[11px] text-slate-300 mb-2 uppercase tracking-wider">Tarih</span><div className="text-base text-slate-500">{item.tarih ? item.tarih.split('-').reverse().join('.') : '-'}</div></div>
                    <div className="flex flex-col items-end md:items-start">
                      <span className="text-[11px] text-slate-300 mb-2 uppercase tracking-wider">Tutar</span>
                      <p className="text-3xl font-black text-yellow-600 tracking-tighter whitespace-nowrap">{item.ekran_fiyat}</p>
                    </div>
                  </div>
                </div>
                {acikKartId === item.id && (
                  <div className="p-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-200 pb-2">Detaylar</p>
                      <div className="flex flex-col gap-3">
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Motor</span><span className="text-base font-bold text-slate-700">{item.yakit_motor || '-'}</span></div>
                        <div><span className="block text-[10px] font-bold text-slate-400 uppercase">KM</span><span className="text-base font-bold text-slate-700">{item.km ? item.km.toLocaleString('tr-TR') : '-'}</span></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-200 pb-2 mb-2">Servis Bilgisi</span>
                      <div className="flex items-center gap-2 text-slate-700 font-bold mt-1"><MapPin size={20} className="text-yellow-500 shrink-0" /><span className="text-base">{item.servis_adi}</span></div>
                    </div>
                    <div className="bg-yellow-500 text-slate-900 p-7 rounded-[2.5rem] shadow-lg flex flex-col justify-center relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 text-yellow-400/20 group-hover:scale-110 transition-transform duration-500"><MessageSquare size={100} /></div>
                      {item.bas_harfler && <p className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-4 relative z-10">{item.bas_harfler}</p>}
                      <div className={`text-[12px] font-bold opacity-90 leading-relaxed relative z-10 ${item.bas_harfler ? 'border-t border-slate-900/20 pt-4' : ''}`}>
                        {item.notlar ? `"${item.notlar}"` : "Kullanıcı notu bulunmuyor."}
                        {item.fatura_url && (
                          <a href={item.fatura_url} target="_blank" className="block mt-4 bg-slate-900 text-white py-2.5 px-4 rounded-xl text-center hover:bg-slate-800 transition-all flex items-center justify-center gap-2 not-italic text-xs font-black shadow-xl">
                            <FileCheck size={16} /> FATURAYI GÖRÜNTÜLE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )) : <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200"><p className="text-slate-400 font-bold text-lg italic">Aradığınız kriterde hiçbir kayıt bulunamadı.</p></div>}
          </section>
        </>
      )}

      {/* BLOGS */}
      <section className="max-w-5xl mx-auto px-6 mt-32 mb-20 pt-20 border-t border-slate-200">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4"><div className="bg-yellow-500 p-3 rounded-2xl text-slate-900 shadow-lg"><BookOpen size={28} /></div><h2 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter">Servis Rehberi</h2></div>
          <Link href="/blog" className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group"><div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300`}><div className="absolute bottom-8 left-10 text-left"><span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">İçerik</span><h3 className="text-3xl font-black text-white leading-tight italic tracking-tight uppercase">{blog.baslik}</h3></div></div></Link>
          ))}
        </div>
      </section>

      {/* MODAL FORM */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="bg-yellow-500 p-10 text-slate-900 flex justify-between items-start sticky top-0 z-10 shadow-lg">
              <div><h2 className="text-4xl font-black italic tracking-tighter leading-none">Bakım Verisi Paylaş</h2><p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mt-3">ŞEFFAFLIĞA KATKIDA BULUNUN</p></div>
              <button onClick={() => setFormAcik(false)} className="bg-black/10 p-3 rounded-2xl hover:bg-black/20 transition-all"><X size={28} /></button>
            </div>
            <form onSubmit={veriyiGonder} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Ad Soyad</label><input required placeholder="Örn: Mert Şen" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Car size={14}/> Marka</label><input required placeholder="Örn: Honda" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Model</label><input required placeholder="Örn: Civic" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Model Yılı</label><input type="number" placeholder="2024" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Tarih</label><input required type="date" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Wrench size={14}/> Bakım Türü</label><input required placeholder="10.000 Bakımı" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Servis Adı</label><input required placeholder="Honda Plaza" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Gauge size={14}/> Kilometre</label><input required type="number" placeholder="15000" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BadgePercent size={14}/> Tutar (TL)</label><input required type="number" placeholder="12500" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> Şehir</label><input required placeholder="İstanbul" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> İlçe</label><input placeholder="Kadıköy" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Fuel size={14}/> Motor</label><input required placeholder="1.5 VTEC" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner" /></div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servis Tipi</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 shadow-inner">
                    <button type="button" onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${servisTipi === 'Yetkili' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>YETKİLİ</button>
                    <button type="button" onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${servisTipi === 'Özel' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14}/> Notlar</label><textarea className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold outline-none shadow-inner h-32 resize-none" placeholder="Bakım hakkında detaylar, tavsiyeler..."></textarea></div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center bg-slate-50/50 hover:bg-yellow-50 transition-all cursor-pointer relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => e.target.files && setResimSecildi(e.target.files[0])} />
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-yellow-600">{resimSecildi ? <Check size={32} /> : <Upload size={32} />}</div>
                  <p className="text-sm font-black text-slate-800 uppercase">{resimSecildi ? resimSecildi.name : "Fatura veya Fiş Fotoğrafı Yükle"}</p>
                </div>
              </div>

              <button disabled={yukleniyor} type="submit" className="w-full bg-yellow-500 text-slate-900 py-6 rounded-[2.5rem] font-black text-xl uppercase italic shadow-xl hover:bg-yellow-400 transition-all active:scale-[0.98]">{yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}</button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </main>
  );
}

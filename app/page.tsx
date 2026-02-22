"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Settings, X, Check, Info, FileText, Upload, User, 
  Zap, BookOpen, ArrowRight, Gauge, Fuel, Wrench, MessageSquare, 
  ChevronDown, BadgeCheck, Menu, 
  Home as HomeIcon, Mail, ChevronRight, Moon, Sun, Layers, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- BLOG VERİLERİ ---
const blogYazilari = [
  { slug: "yetkili-vs-ozel-servis", kategori: "Analiz", baslik: "Yetkili Servis mi Özel Servis mi?", renk: "from-slate-900 to-black" },
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara Toyota C-HR Batarya Değişimi", renk: "from-slate-800 to-slate-900" }
];

const BAKIM_KATEGORILERI = ["Periyodik Bakım", "Ağır Bakım", "Alt Takım & Yürüyen Aksam"];

const CustomSelect = ({ label, value, options, onChange, icon: Icon, isDark }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 rounded-2xl font-bold cursor-pointer flex items-center justify-between transition-all border border-transparent active:scale-[0.98] ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}`}>
        <div className="flex items-center gap-2 truncate text-left">
          {Icon && <Icon size={18} className="text-slate-400 shrink-0" />}
          <span className={value ? (isDark ? "text-white" : "text-slate-800") : "text-slate-400"}>{value || label}</span>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className={`absolute top-[110%] left-0 w-full rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
          <div className="max-h-60 overflow-y-auto custom-scrollbar text-left">
            <div onClick={() => { onChange(""); setIsOpen(false); }} className={`px-5 py-3 text-sm font-bold cursor-pointer italic ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-50'}`}>Tümünü Göster</div>
            {options.map((opt: string) => (
              <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-5 py-3 text-sm font-bold cursor-pointer flex items-center justify-between transition-colors ${value === opt ? 'bg-yellow-500 text-slate-900' : isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>{opt}{value === opt && <Check size={14} />}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function BakimimApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formAcik, setFormAcik] = useState(false);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [secilenBakimKategorisi, setSecilenBakimKategorisi] = useState("");
  const [filtreServisTipi, setFiltreServisTipi] = useState("Farketmez");
  const [servisTipi, setServisTipi] = useState("Yetkili");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [istatistikVerisi, setIstatistikVerisi] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);
  const [resimSecildi, setResimSecildi] = useState<File | null>(null);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const normalizeMetin = (str: string) => {
    if (!str) return "";
    const temiz = str.trim();
    return temiz.charAt(0).toLocaleUpperCase('tr-TR') + temiz.slice(1).toLocaleLowerCase('tr-TR');
  };

  const veriCek = useCallback(async () => {
    setVeriYukleniyor(true);
    try {
      const { data } = await supabase.from('bakim_kayitlari').select('*').eq('onayli_mi', true).order('id', { ascending: false });
      if (data) {
        const valideEdilmisData = data.map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir), 
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          bakim_turu_format: normalizeMetin(item.bakim_turu),
          ekran_fiyat: item.fiyat ? item.fiyat.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız",
          fatura_onayli: !!item.fatura_url,
          kullanici_onayli: !item.fatura_url
        }));
        setDuzenlenenVeri(valideEdilmisData);
        setSonuclar(valideEdilmisData);
        setIstatistikVerisi(valideEdilmisData);
      }
    } finally { setVeriYukleniyor(false); }
  }, []);

  useEffect(() => { veriCek(); }, [veriCek]);

  useEffect(() => {
    if (secilenMarka) {
      setMusaitModeller(Array.from(new Set(duzenlenenVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).sort());
    } else setMusaitModeller([]);
  }, [secilenMarka, duzenlenenVeri]);

  const tumMarkalar = Array.from(new Set(duzenlenenVeri.map(item => item.marka_format))).sort();
  const tumSehirler = Array.from(new Set(duzenlenenVeri.map(item => item.sehir))).sort();

  const sorgula = () => {
    const temelFiltre = duzenlenenVeri.filter(item => {
      const mUygun = !secilenMarka || item.marka_format === secilenMarka;
      const moUygun = !secilenModel || item.model_format === secilenModel;
      const sUygun = !secilenSehir || item.sehir === secilenSehir;
      const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
      let kUygun = !secilenBakimKategorisi;
      if (secilenBakimKategorisi === "Periyodik Bakım") kUygun = m.includes("bakım") || m.includes("yağ");
      else if (secilenBakimKategorisi === "Alt Takım & Yürüyen Aksam") kUygun = m.includes("fren") || m.includes("alt takım") || m.includes("balata") || m.includes("disk");
      else if (secilenBakimKategorisi === "Ağır Bakım") kUygun = m.includes("ağır") || m.includes("triger");
      return mUygun && moUygun && sUygun && kUygun;
    });
    setSonuclar(temelFiltre.filter(item => {
      if (filtreServisTipi === "Yetkili") return item.yetkili_mi;
      if (filtreServisTipi === "Özel") return !item.yetkili_mi;
      return true;
    }));
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
        const { data: resimData } = await supabase.storage.from('faturalar').upload(dosyaAdi, resimSecildi);
        if (resimData) {
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
        yakit_motor: (inputs[11] as HTMLInputElement).value,
        notlar: textArea ? textArea.value : "",
        yetkili_mi: servisTipi === "Yetkili",
        fatura_url: resimUrl,
        onayli_mi: false
      }]);
      alert("Veri başarıyla onaya gönderildi!");
      setFormAcik(false);
      setResimSecildi(null);
      form.reset();
    } finally { setYukleniyor(false); }
  };

  const getKategoriLinkEki = (item: any) => {
    const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
    if (m.includes("ağır") || m.includes("triger")) return "/agir-bakim-fiyatlari";
    if (m.includes("alt takım") || m.includes("balata") || m.includes("fren")) return "/alt-takim-yuruyen-aksam-fiyatlari";
    return "/periyodik-bakim-fiyatlari";
  };

  const getMedian = (arr: any[]) => {
    if (arr.length === 0) return 0;
    const values = arr.map(i => i.fiyat || 0).sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
  };

  const medYetkili = Math.round(getMedian(istatistikVerisi.filter(i => i.yetkili_mi)));
  const medOzel = Math.round(getMedian(istatistikVerisi.filter(i => !i.yetkili_mi)));

  return (
    <main className={`min-h-screen pb-20 text-left relative font-sans transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* YAN MENÜ */}
      <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div className={`absolute top-0 left-0 h-full w-80 shadow-2xl transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#0f172a] text-white">
            <span className="text-2xl font-black italic uppercase">BAKIMIM<span className="text-yellow-500">.COM</span></span>
            <button onClick={() => setIsMenuOpen(false)} className="bg-white/10 p-2 rounded-xl text-white"><X size={24}/></button>
          </div>
          <nav className="flex-1 p-6 space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl font-black italic uppercase transition-all shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-yellow-500 hover:text-slate-950' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-yellow-500'}`}><div className="flex items-center gap-4"><HomeIcon size={22}/> ANASAYFA</div><ChevronRight size={18}/></Link>
            <Link href="/blog" onClick={() => setIsMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl font-black italic uppercase transition-all shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-yellow-500 hover:text-slate-950' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-yellow-500'}`}><div className="flex items-center gap-4"><BookOpen size={22}/> BLOG</div><ChevronRight size={18}/></Link>
            <Link href="/hakkimizda" onClick={() => setIsMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl font-black italic uppercase transition-all shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-yellow-500 hover:text-slate-950' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-yellow-500'}`}><div className="flex items-center gap-4"><Users size={22}/> HAKKIMIZDA</div><ChevronRight size={18}/></Link>
          </nav>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/5 space-y-4">
             <button onClick={() => { setIsMenuOpen(false); setFormAcik(true); }} className="w-full bg-[#0f172a] text-white p-5 rounded-2xl font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-lg"><Zap size={20} className="text-yellow-500"/> VERİ PAYLAŞ</button>
             <button onClick={toggleDarkMode} className={`w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-white'}`}>{isDarkMode ? <><Sun size={18}/> GÜNDÜZ MODU</> : <><Moon size={18}/> KARANLIK MOD</>}</button>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm border-b transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-yellow-500 hover:text-slate-950' : 'bg-slate-50 text-slate-600 hover:bg-yellow-500'}`}><Menu size={24}/></button>
          <Link href="/" className="flex items-center gap-3"><div className="bg-[#0f172a] p-2 rounded-xl text-yellow-400"><Car size={24} /></div><span className={`text-2xl font-black italic uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>bakımım<span className="text-yellow-500">.com</span></span></Link>
        </div>
        <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-md active:scale-95"><FileText size={14}/> Veri Paylaş</button>
      </nav>

      {/* HERO SECTION */}
      <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-[#0f172a]'} py-16 px-6 transition-colors`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase italic tracking-tighter">FİYAT <span className="text-yellow-500">KIYASLA</span></h1>
          <div className={`p-5 rounded-[2.5rem] shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <CustomSelect label="Marka" value={secilenMarka} options={tumMarkalar} onChange={setSecilenMarka} icon={Car} isDark={isDarkMode} />
            <CustomSelect label="Model" value={secilenModel} options={musaitModeller} onChange={setSecilenModel} icon={Info} isDark={isDarkMode} />
            <CustomSelect label="Bakım Türü" value={secilenBakimKategorisi} options={BAKIM_KATEGORILERI} onChange={setSecilenBakimKategorisi} icon={Layers} isDark={isDarkMode} />
            <CustomSelect label="Şehir" value={secilenSehir} options={tumSehirler} onChange={setSecilenSehir} icon={MapPin} isDark={isDarkMode} />
            <CustomSelect label="Servis" value={filtreServisTipi} options={["Farketmez", "Yetkili", "Özel"]} onChange={setFiltreServisTipi} icon={ShieldCheck} isDark={isDarkMode} />
            <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-2 uppercase shadow-xl transition-all active:scale-95"><Search size={22} /> SORGULA</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-10 mb-12 relative z-20">
          <div className={`p-8 rounded-[2rem] shadow-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2"><ShieldCheck size={18} className="text-yellow-600"/> Yetkili Servis Ortalaması</p>
            <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{medYetkili.toLocaleString('tr-TR')} TL</p>
          </div>
          <div className={`p-8 rounded-[2rem] shadow-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2 text-indigo-600"><BadgePercent size={18}/> Özel Servis Ortalaması</p>
            <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{medOzel.toLocaleString('tr-TR')} TL</p>
          </div>
        </div>

        {/* BİREBİR KOPYALANAN SONUÇ KARTLARI */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 text-left">
          {sonuclar.length > 0 ? sonuclar.map((item) => (
            <div key={item.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm transition-all flex flex-col h-fit group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} ${acikKartId === item.id ? 'ring-2 ring-yellow-500 shadow-xl' : ''}`}>
              <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 flex-1 flex flex-col text-left cursor-pointer relative">
                <div className="absolute top-8 right-8"><ChevronDown size={20} className={`text-slate-400 transition-transform ${acikKartId === item.id ? 'rotate-180 text-yellow-500' : ''}`} /></div>
                
                <div className="flex justify-between items-start mb-6 pr-8">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>{item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex gap-1">
                    {item.fatura_onayli && <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg"><ShieldCheck size={12} strokeWidth={4} /></div>}
                    {item.kullanici_onayli && <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg"><BadgeCheck size={12} strokeWidth={4} /></div>}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-[10px] tracking-[0.2em] mb-1 leading-none"><Car size={14} /><span>{item.marka_format}</span></div>
                  <h3 className={`text-2xl font-black italic uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'} leading-tight`}>{item.model_format} <span className="text-slate-500 text-lg not-italic">'{item.yil ? item.yil.toString().slice(2) : '-'}</span></h3>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                      <Layers size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {item.bakim_kategorisi === "Periyodik Bakım" ? `PERİYODİK BAKIM (${item.km?.toLocaleString('tr-TR')} KM)` : `${item.bakim_kategorisi} (${item.km?.toLocaleString('tr-TR')} KM)`}
                      </span>
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-tight px-3 py-1 rounded-lg w-fit border ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100 shadow-none'}`}>
                       {item.bakim_turu_format}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2 text-left">
                  <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Şehir</span><p className="text-xs font-bold uppercase truncate">{item.sehir}</p></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 text-slate-400">Durum</span>
                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-tighter ${item.fatura_onayli ? 'text-emerald-500' : 'text-blue-500'}`}>
                      {item.fatura_onayli ? 'Belge Destekli Kullanıcı Bildirimi' : 'Kullanıcı Beyanı'}
                    </p>
                  </div>
                </div>

                {acikKartId === item.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 text-left">
                    <div className="flex flex-col bg-transparent border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Fuel size={12}/> Motor & Yakıt Bilgisi</span>
                      <p className="text-xs font-bold uppercase">{item.yakit_motor || 'Belirtilmemiş'}</p>
                    </div>
                    <div className="flex flex-col bg-transparent border border-slate-200 dark:border-slate-700 p-4 rounded-xl mt-3">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><MessageSquare size={12}/> Kullanıcı Notu</span>
                      <p className="text-xs font-bold italic leading-relaxed">{item.notlar ? `"${item.notlar}"` : 'Detay belirtilmemiş.'}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 pt-0 flex flex-col gap-4 mt-auto">
                <div className={`pt-6 border-t flex justify-between items-end ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div><span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 block text-left">Toplam Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.ekran_fiyat}</p></div>
                  <div className="text-[10px] font-black text-slate-400 uppercase italic">{item.tarih ? item.tarih.split('-').reverse().join('.') : '-'}</div>
                </div>
                
                <Link 
                  href={`/bakim-fiyatlari/${(item.marka_format || '').toLowerCase().replace(/\s+/g, '-')}/${(item.model_format || '').toLowerCase().replace(/\s+/g, '-')}${getKategoriLinkEki(item)}`}
                  className={`w-full py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all hover:bg-yellow-500 hover:text-slate-900 border ${isDarkMode ? 'bg-transparent text-slate-400 border-slate-700 hover:border-yellow-500' : 'bg-transparent text-slate-500 border-slate-200 hover:border-yellow-500'}`}
                >
                  TÜM {item.marka_format} {item.model_format} BAKIMLARINI GÖR <ArrowRight size={14}/>
                </Link>
              </div>
            </div>
          )) : <div className="col-span-full text-center py-32 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 uppercase font-black italic tracking-widest text-left px-10">Kayıt Bulunamadı</div>}
        </section>
      </div>

      {/* VERİ PAYLAŞ FORMU */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div className="bg-yellow-500 p-10 text-slate-900 flex justify-between items-start sticky top-0 z-10 shadow-lg">
              <div><h2 className="text-4xl font-black italic tracking-tighter leading-none">Bakım Verisi Paylaş</h2><p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest mt-3">ŞEFFAFLIĞA KATKIDA BULUNUN</p></div>
              <button onClick={() => setFormAcik(false)} className="bg-black/10 p-3 rounded-2xl hover:bg-black/20"><X size={28} /></button>
            </div>
            <form onSubmit={veriyiGonder} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><User size={14}/> Ad Soyad</label><input required className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="Adınız" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Car size={14}/> Marka</label><input required className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="Örn: Honda" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Info size={14}/> Model</label><input required className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="Örn: Civic" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Calendar size={14}/> Yıl</label><input type="number" className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="2024" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Calendar size={14}/> Tarih</label><input required type="date" className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Wrench size={14}/> Bakım Türü</label><input required className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="10.000 Bakımı" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Settings size={14}/> Servis Adı</label><input required className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="Servis İsmi" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Gauge size={14}/> KM</label><input required type="number" className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="15000" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><BadgePercent size={14}/> Tutar</label><input required type="number" className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="12500" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><MapPin size={14}/> Şehir</label><input required className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="İstanbul" /></div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1 text-left">Servis Tipi</label>
                  <div className={`flex p-1.5 rounded-2xl gap-2 shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <button type="button" onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${servisTipi === 'Yetkili' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}>YETKİLİ</button>
                    <button type="button" onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${servisTipi === 'Özel' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}>ÖZEL</button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><MessageSquare size={14}/> Notlar</label><textarea className={`w-full p-4 border-0 rounded-2xl font-bold shadow-inner h-32 resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} placeholder="Detaylar..."></textarea></div>
              </div>
              <div className={`border-2 border-dashed rounded-[2.5rem] p-10 text-center cursor-pointer relative ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => e.target.files && setResimSecildi(e.target.files[0])} />
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-yellow-600">{resimSecildi ? <Check size={32} /> : <Upload size={32} />}</div>
                  <p className="text-sm font-black uppercase text-slate-400">{resimSecildi ? resimSecildi.name : "Fatura Yükle"}</p>
                </div>
              </div>
              <button disabled={yukleniyor} type="submit" className="w-full bg-yellow-500 text-slate-900 py-6 rounded-[2.5rem] font-black text-xl uppercase italic shadow-xl hover:bg-yellow-400 transition-all">{yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}</button>
            </form>
          </div>
        </div>
      )}

      {/* BLOG ÖNİZLEME */}
      <section className="max-w-7xl mx-auto px-6 mt-32 border-t border-slate-200/10 pt-20">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4"><div className="bg-yellow-500 p-3 rounded-2xl text-slate-900 shadow-lg"><BookOpen size={28} /></div><h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Servis Rehberi</h2></div>
          <Link href="/blog" className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2">Tüm Yazılar <ArrowRight size={20}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group">
              <div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] overflow-hidden relative shadow-xl group-hover:-translate-y-2 transition-all duration-300`}>
                <div className="absolute bottom-8 left-10 text-left">
                  <span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block uppercase">Analiz</span>
                  <h3 className="text-3xl font-black text-white leading-tight italic uppercase">{blog.baslik}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </main>
  );
}

"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Settings, X, Check, Info, FileText, User, 
  Zap, BookOpen, ArrowRight, Gauge, Fuel, Wrench, MessageSquare, ChevronDown, BadgeCheck, Menu, 
  Home as HomeIcon, ChevronRight, Layers, Moon, Sun, Upload, Mail, Users
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
        <div className={`absolute top-[110%] left-0 w-full rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Sidebar kontrolü
  const [formAcik, setFormAcik] = useState(false); // Veri paylaş formu kontrolü
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("");
  const [secilenBakimKategorisi, setSecilenBakimKategorisi] = useState("");
  const [filtreServisTipi, setFiltreServisTipi] = useState("Farketmez");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [istatistikVerisi, setIstatistikVerisi] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);
  const [servisTipi, setServisTipi] = useState("Yetkili");
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
      const { data } = await supabase
        .from('bakim_kayitlari')
        .select('*')
        .eq('onayli_mi', true)
        .order('id', { ascending: false });

      if (data) {
        const valideEdilmisData = data.map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir), 
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          bakim_turu_format: normalizeMetin(item.bakim_turu),
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
      else if (secilenBakimKategorisi === "Alt Takım & Yürüyen Aksam") kUygun = m.includes("fren") || m.includes("alt takım");
      else if (secilenBakimKategorisi === "Ağır Bakım") kUygun = m.includes("ağır") || m.includes("triger");

      return mUygun && moUygun && sUygun && kUygun;
    });
    setSonuclar(temelFiltre);
  };

  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    setYukleniyor(true);
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
      const inputs = formElement.querySelectorAll('input');
      await supabase.from('bakim_kayitlari').insert([{
        ad_soyad: (inputs[1] as HTMLInputElement).value, 
        marka: (inputs[2] as HTMLInputElement).value,
        model: (inputs[3] as HTMLInputElement).value,
        yil: parseInt((inputs[4] as HTMLInputElement).value) || null,
        tarih: (inputs[5] as HTMLInputElement).value,
        bakim_turu: (inputs[6] as HTMLInputElement).value,
        servis_adi: (inputs[7] as HTMLInputElement).value,
        km: parseInt((inputs[8] as HTMLInputElement).value),
        fiyat: parseFloat((inputs[9] as HTMLInputElement).value),
        sehir: (inputs[10] as HTMLInputElement).value,
        yakit_motor: (inputs[11] as HTMLInputElement).value,
        notlar: (formElement.querySelector('textarea') as HTMLTextAreaElement).value,
        yetkili_mi: servisTipi === "Yetkili",
        fatura_url: resimUrl
      }]);
      alert("Veri onaya gönderildi!");
      setFormAcik(false);
    } catch (error) { alert("Hata oluştu."); } finally { setYukleniyor(false); }
  };

  const getKategoriLinkEki = (item: any) => {
    const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
    if (m.includes("ağır") || m.includes("triger")) return "/agir-bakim-fiyatlari";
    if (m.includes("alt takım") || m.includes("balata") || m.includes("fren")) return "/alt-takim-yuruyen-aksam-fiyatlari";
    return "/periyodik-bakim-fiyatlari";
  };

  return (
    <main className={`min-h-screen pb-20 text-left relative font-sans transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* SIDEBAR MENU */}
      <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>
        <div className={`absolute top-0 left-0 h-full w-80 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-slate-100'}`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#0f172a] text-white">
            <span className="text-2xl font-black italic uppercase">BAKIMIM<span className="text-yellow-500">.COM</span></span>
            <button onClick={() => setIsMenuOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-yellow-500 hover:text-slate-900 transition-colors"><X size={24}/></button>
          </div>
          <nav className="flex-1 p-6 space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-xs hover:bg-yellow-500 hover:text-slate-900 transition-all"><HomeIcon size={20}/> ANA SAYFA</Link>
            <Link href="/hakkimizda" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-xs hover:bg-yellow-500 hover:text-slate-900 transition-all"><Users size={20}/> HAKKIMIZDA</Link>
          </nav>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm border-b transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800"><Menu size={24}/></button>
          <Link href="/" className="text-2xl font-black italic uppercase">bakımım<span className="text-yellow-500">.com</span></Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
          <button onClick={() => setFormAcik(true)} className="bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-md active:scale-95">Veri Paylaş</button>
        </div>
      </nav>

      {/* HERO & SEARCH */}
      <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-[#0f172a]'} py-20 px-6 text-center`}>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase italic tracking-tighter">FİYAT <span className="text-yellow-500">KIYASLA</span></h1>
        <div className={`max-w-7xl mx-auto p-5 rounded-[2.5rem] shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <CustomSelect label="Marka" value={secilenMarka} options={tumMarkalar} onChange={setSecilenMarka} icon={Car} isDark={isDarkMode} />
          <CustomSelect label="Model" value={secilenModel} options={musaitModeller} onChange={setSecilenModel} icon={Info} isDark={isDarkMode} />
          <CustomSelect label="Bakım" value={secilenBakimKategorisi} options={BAKIM_KATEGORILERI} onChange={setSecilenBakimKategorisi} icon={Layers} isDark={isDarkMode} />
          <CustomSelect label="Şehir" value={secilenSehir} options={tumSehirler} onChange={setSecilenSehir} icon={MapPin} isDark={isDarkMode} />
          <CustomSelect label="Servis" value={filtreServisTipi} options={["Farketmez", "Yetkili", "Özel"]} onChange={setFiltreServisTipi} icon={ShieldCheck} isDark={isDarkMode} />
          <button onClick={sorgula} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-2 uppercase transition-all active:scale-95"><Search size={22} /> SORGULA</button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sonuclar.map((item) => (
          <div key={item.id} className={`rounded-[2.5rem] border p-8 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>{item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}</span>
              {item.fatura_onayli && <div className="bg-emerald-500 text-white p-1.5 rounded-full"><ShieldCheck size={12} strokeWidth={4} /></div>}
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4">{item.model_format} <span className="text-slate-500 text-lg">'{item.yil?.toString().slice(2)}</span></h3>
            <p className="text-xs font-bold text-slate-400 uppercase mb-4">{item.bakim_turu_format}</p>
            <div className="pt-6 border-t mt-auto flex justify-between items-end">
              <div><span className="text-[10px] text-slate-500 uppercase font-black block">Toplam Tutar</span><p className="text-3xl font-black text-yellow-600">{item.fiyat?.toLocaleString('tr-TR')} TL</p></div>
              <Link href={`/bakim-fiyatlari/${item.marka_format.toLowerCase().replace(/\s+/g, '-')}/${item.model_format.toLowerCase().replace(/\s+/g, '-')}${getKategoriLinkEki(item)}`} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-yellow-500"><ArrowRight size={20}/></Link>
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {formAcik && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div className="bg-yellow-500 p-10 text-slate-900 flex justify-between items-start sticky top-0 z-10">
              <h2 className="text-4xl font-black italic uppercase">Veri Paylaş</h2>
              <button onClick={() => setFormAcik(false)} className="bg-black/10 p-3 rounded-2xl"><X size={28} /></button>
            </div>
            <form onSubmit={veriyiGonder} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Adınız" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold border-0" />
                <input required placeholder="Marka" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold border-0" />
                <input required placeholder="Model" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold border-0" />
                <input required type="number" placeholder="KM" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold border-0" />
                <input required type="number" placeholder="Tutar" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold border-0" />
                <input required placeholder="Şehir" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold border-0" />
                <div className="md:col-span-2 flex gap-2">
                  <button type="button" onClick={() => setServisTipi("Yetkili")} className={`flex-1 py-4 rounded-2xl font-black ${servisTipi === 'Yetkili' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>YETKİLİ</button>
                  <button type="button" onClick={() => setServisTipi("Özel")} className={`flex-1 py-4 rounded-2xl font-black ${servisTipi === 'Özel' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>ÖZEL</button>
                </div>
              </div>
              <button type="submit" className="w-full bg-yellow-500 text-slate-900 py-6 rounded-[2.5rem] font-black text-xl uppercase italic shadow-xl">VERİYİ ONAYA GÖNDER</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

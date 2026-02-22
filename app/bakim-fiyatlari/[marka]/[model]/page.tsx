"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, 
  MapPin, BadgeCheck, Gauge, Fuel, ChevronDown, MessageSquare, Layers, ShieldAlert 
} from 'lucide-react';

// 4 KLASÖR GERİ ÇIKAN DOĞRU YOL
import { supabase } from '../../../../lib/supabase'; 

const slugify = (text: string) => {
  const trMap: { [key: string]: string } = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
  return text ? text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match]).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : '';
};

export default function ModelDetaySayfasi() {
  const params = useParams();
  const pathname = usePathname();
  const [kayitlar, setKayitlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const normalizeMetin = (str: string) => {
    if (!str) return "";
    const temiz = str.trim();
    return temiz.charAt(0).toLocaleUpperCase('tr-TR') + temiz.slice(1).toLocaleLowerCase('tr-TR');
  };

  const kategorizeEt = (metin: string) => {
    const m = metin.toLocaleLowerCase('tr-TR');
    if (m.includes("ağır") || m.includes("triger") || m.includes("revizyon") || m.includes("şanzıman")) return "Ağır Bakım";
    if (m.includes("alt takım") || m.includes("yürüyen") || m.includes("fren") || m.includes("balata")) return "Alt Takım & Yürüyen Aksam";
    return "Periyodik Bakım";
  };

  const veriCek = useCallback(async () => {
    setYukleniyor(true);
    try {
      const { data } = await supabase.from('bakim_kayitlari').select('*').eq('onayli_mi', true).order('fiyat', { ascending: true });

      if (data) {
        const filtrelenmis = data.map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir), 
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          bakim_kategorisi: kategorizeEt(item.bakim_turu || ""),
          bakim_turu_format: normalizeMetin(item.bakim_turu),
          ekran_fiyat: item.fiyat ? item.fiyat.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız",
          bas_harfler: item.ad_soyad ? item.ad_soyad.trim().split(/\s+/).map((p: string) => p.charAt(0).toUpperCase() + ".").join(" ") : "K.B.",
          fatura_onayli: !!item.fatura_url,
          kullanici_onayli: !item.fatura_url
        })).filter(item => {
          // URL'deki isimle (boşluklu vb.) veritabanını hatasız eşleştirir
          const markaMatch = slugify(item.marka_format) === params.marka;
          const modelMatch = slugify(item.model_format) === params.model;
          return markaMatch && modelMatch;
        });

        setKayitlar(filtrelenmis);
      }
    } finally {
      setYukleniyor(false);
    }
  }, [params.marka, params.model]);

  useEffect(() => { veriCek(); }, [veriCek]);

  if (yukleniyor) return <div className="min-h-screen flex items-center justify-center font-black text-yellow-500 uppercase italic animate-pulse">VERİLER SENKRONİZE EDİLİYOR...</div>;

  return (
    <main className={`min-h-screen pb-20 text-left transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* HERO ALANI */}
      <div className="py-16 px-6 border-b bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 font-black uppercase text-[10px] tracking-widest transition-colors"><ArrowLeft size={16} /> Ana Sayfaya Dön</Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
            {normalizeMetin(params.marka?.toString().replace(/-/g, ' '))} <span className="text-yellow-500">{normalizeMetin(params.model?.toString().replace(/-/g, ' '))}</span><br/>
            TÜM BAKIM FİYATLARI
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {kayitlar.length > 0 ? kayitlar.map((item) => {
            
            // Kartın altındaki buton için dinamik yönlendirme URL'si (Kategoriye göre)
            let kategoriPath = "";
            if (item.bakim_kategorisi === "Periyodik Bakım") kategoriPath = "/periyodik-bakim-fiyatlari";
            else if (item.bakim_kategorisi === "Ağır Bakım") kategoriPath = "/agir-bakim-fiyatlari";
            else if (item.bakim_kategorisi === "Alt Takım & Yürüyen Aksam") kategoriPath = "/alt-takim-yuruyen-aksam-fiyatlari";
            const linkHref = `/bakim-fiyatlari/${slugify(item.marka_format)}/${slugify(item.model_format)}${kategoriPath}`;

            return (
              <div key={item.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm transition-all flex flex-col h-fit group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'} ${acikKartId === item.id ? 'ring-2 ring-yellow-500 shadow-xl' : ''}`}>
                <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 cursor-pointer flex-1 flex flex-col relative">
                  
                  <div className="absolute top-8 right-8"><ChevronDown size={20} className={`text-slate-400 transition-transform ${acikKartId === item.id ? 'rotate-180 text-yellow-500' : ''}`} /></div>
                  
                  <div className="flex justify-between items-start mb-6 pr-8">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>{item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}</span>
                    <div className="flex gap-1">
                      {item.fatura_onayli ? (
                        <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg" title="Belge Destekli Kullanıcı Bildirimi"><ShieldCheck size={12} strokeWidth={4} /></div>
                      ) : (
                        <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg" title="Kullanıcı Beyanı"><BadgeCheck size={12} strokeWidth={4} /></div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 text-left">
                    <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-[10px] tracking-[0.2em] mb-1">
                      {item.marka_format === 'Honda' || item.marka_format === 'Toyota' ? <Zap size={14} className="text-yellow-500" /> : <Car size={14} />}
                      <span>{item.marka_format}</span>
                    </div>
                    <h3 className={`text-2xl font-black italic uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {item.model_format} <span className="text-slate-500 text-lg not-italic">'{item.yil ? item.yil.toString().slice(2) : '-'}</span>
                    </h3>
                  </div>

                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Bakım Kategorisi</span>
                      <p className="text-sm font-bold text-yellow-600 dark:text-yellow-500">{item.bakim_kategorisi}</p>
                      <p className="text-[11px] text-slate-400 italic line-clamp-1">{item.bakim_turu_format}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Konum</span><p className="text-xs font-bold truncate">{item.sehir}</p></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Tarih</span><p className="text-xs font-bold text-slate-500">{item.tarih ? item.tarih.split('-').reverse().join('.') : '-'}</p></div>
                    </div>
                  </div>

                  <div className={`mt-auto pt-6 border-t flex justify-between items-end ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 block text-left">Toplam Tutar</span>
                      <p className="text-3xl font-black text-yellow-600 tracking-tighter text-left">{item.ekran_fiyat}</p>
                    </div>
                  </div>
                </div>

                {acikKartId === item.id && (
                  <div className={`p-8 border-t space-y-6 animate-in slide-in-from-top-4 duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="space-y-4 text-left text-slate-800">
                      <div><span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bakım Detayı</span><p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{item.bakim_turu_format}</p></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Motor</span><p className="text-sm font-bold">{item.yakit_motor || '-'}</p></div>
                        <div><span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kilometre</span><p className="text-sm font-bold">{item.km ? item.km.toLocaleString('tr-TR') : '-'} KM</p></div>
                      </div>
                    </div>
                    <div className="bg-yellow-500 text-slate-900 p-6 rounded-3xl shadow-lg relative overflow-hidden text-left">
                       <div className="flex items-center justify-between mb-4">
                         <span className="text-3xl font-black italic tracking-tighter uppercase">{item.bas_harfler}</span>
                         <ShieldAlert size={20} className="opacity-50" />
                       </div>
                       <p className="text-xs font-bold opacity-90 italic leading-relaxed mb-4">"{item.notlar || 'Kullanıcı notu bulunmuyor.'}"</p>
                       {item.fatura_onayli ? (
                         <div className="bg-slate-900 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black tracking-widest uppercase"><ShieldCheck size={14} className="text-emerald-400" /> Belge Destekli Bildirim</div>
                       ) : (
                         <div className="bg-slate-800/20 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black tracking-widest uppercase"><BadgeCheck size={14} className="opacity-50" /> Kullanıcı Beyanı</div>
                       )}
                    </div>
                  </div>
                )}

                <Link 
                  href={linkHref} 
                  className={`block w-full text-center py-5 text-[10px] font-black uppercase tracking-widest border-t transition-all ${isDarkMode ? 'bg-slate-800/50 text-yellow-500 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
                >
                  Tüm {item.marka_format} {item.model_format} Bakımlarını Gör
                </Link>

              </div>
            );
          }) : (
            <div className={`col-span-full text-center py-32 rounded-[3rem] border border-dashed ${isDarkMode ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
              <p className="font-bold text-lg italic uppercase tracking-widest text-center">Bu araca ait kayıt bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

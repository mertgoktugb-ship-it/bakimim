"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, 
  MapPin, BadgeCheck, Gauge, Fuel, ChevronDown, MessageSquare, Layers 
} from 'lucide-react';

export default function AgirBakimDetaySayfasi({ params }: { params: any }) {
  const [resolvedParams, setResolvedParams] = useState<{ marka: string, model: string } | null>(null);
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
    if (m.includes("alt takım") || m.includes("fren") || m.includes("balata") || m.includes("disk")) return "Alt Takım & Yürüyen Aksam";
    return "Periyodik Bakım";
  };

  useEffect(() => {
    const veriGetir = async () => {
      const p = await params;
      setResolvedParams(p);

      // TİRE VE BOŞLUK SORUNUNU ÇÖZEN KRİTİK KISIM
      const markaSorgu = p.marka.replace(/-/g, '%');
      const modelSorgu = p.model.replace(/-/g, '%');

      const { data } = await supabase
        .from('bakim_kayitlari')
        .select('*')
        .eq('onayli_mi', true)
        .ilike('marka', `%${markaSorgu}%`)
        .ilike('model', `%${modelSorgu}%`)
        .order('fiyat', { ascending: true });

      if (data) {
        const duzenlenmisData = data.map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir),
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          bakim_kategorisi: kategorizeEt(item.bakim_turu || ""),
          bakim_turu_format: normalizeMetin(item.bakim_turu),
          ekran_fiyat: item.fiyat ? item.fiyat.toLocaleString('tr-TR') + " TL" : "Fiyat Alınız",
          fatura_onayli: !!item.fatura_url,
          kullanici_onayli: !item.fatura_url
        })).filter(item => item.bakim_kategorisi === "Ağır Bakım");

        setKayitlar(duzenlenmisData);
      }
      setYukleniyor(false);
    };
    veriGetir();
  }, [params]);

  if (yukleniyor || !resolvedParams) {
    return <div className={`min-h-screen flex items-center justify-center font-black text-yellow-500 italic tracking-widest uppercase ${isDarkMode ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>Veriler Yükleniyor...</div>;
  }

  const getMedian = (arr: any[]) => {
    if (arr.length === 0) return 0;
    const values = arr.map(i => i.fiyat || 0).sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
  };

  const medYetkili = Math.round(getMedian(kayitlar.filter(i => i.yetkili_mi)));
  const medOzel = Math.round(getMedian(kayitlar.filter(i => !i.yetkili_mi)));

  return (
    <main className={`min-h-screen pb-20 text-left font-sans transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      <div className={`py-16 px-6 border-b ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-[#0f172a] border-slate-800'} text-white`}>
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 transition-colors font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-yellow-500 text-left">
              <Car size={32} />
              <span className="font-black italic uppercase tracking-widest text-sm">{normalizeMetin(resolvedParams.marka.replace(/-/g, ' '))} Veri Havuzu</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-left">
              {normalizeMetin(resolvedParams.marka.replace(/-/g, ' '))} <span className="text-yellow-500">{normalizeMetin(resolvedParams.model.replace(/-/g, ' '))}</span><br/>AĞIR BAKIM FİYATLARI
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-4 flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" /> TOPLAM {kayitlar.length} DOĞRULANMIŞ AĞIR BAKIM VERİSİ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-10 mb-20 relative z-20">
          <div className={`p-8 rounded-[2rem] shadow-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-yellow-600"/> Yetkili Servis Ort.
            </span>
            <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {medYetkili > 0 ? `${medYetkili.toLocaleString('tr-TR')} TL` : "Veri Yok"}
            </p>
          </div>
          <div className={`p-8 rounded-[2rem] shadow-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <BadgePercent size={18}/> Özel Servis Ort.
            </span>
            <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {medOzel > 0 ? `${medOzel.toLocaleString('tr-TR')} TL` : "Veri Yok"}
            </p>
          </div>
        </div>

        <h2 className={`text-2xl font-black italic uppercase tracking-tight flex items-center gap-3 mb-10 text-left ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          <div className="w-8 h-1 bg-yellow-500 rounded-full"></div>
          Ağır Bakım Kayıtları
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {kayitlar.length > 0 ? kayitlar.map((item) => (
            <div 
              key={item.id} 
              className={`rounded-[2.5rem] border overflow-hidden shadow-sm transition-all flex flex-col h-fit group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} ${acikKartId === item.id ? 'ring-2 ring-yellow-500 shadow-xl' : ''}`}
            >
              <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 flex-1 flex flex-col text-left cursor-pointer relative">
                 <div className="absolute top-8 right-8">
                  <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${acikKartId === item.id ? 'rotate-180 text-yellow-500' : ''}`} />
                </div>

                <div className="flex justify-between items-start mb-6 pr-8">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>
                    {item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}
                  </span>
                  <div className="flex gap-1">
                    {item.fatura_onayli && <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg"><ShieldCheck size={12} strokeWidth={4} /></div>}
                    {item.kullanici_onayli && <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg"><BadgeCheck size={12} strokeWidth={4} /></div>}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-[10px] tracking-[0.2em] mb-1 leading-none">
                    <Car size={14} /><span>{item.marka_format}</span>
                  </div>
                  <h3 className={`text-2xl font-black italic uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'} leading-tight`}>
                    {item.model_format} <span className="text-slate-500 text-lg not-italic">'{item.yil ? item.yil.toString().slice(2) : '-'}</span>
                  </h3>
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                      <Layers size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        AĞIR BAKIM ({item.km?.toLocaleString('tr-TR')} KM)
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
              </div>

            </div>
          )) : (
            <div className="col-span-full text-center py-24 bg-transparent rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-lg font-black text-slate-400 uppercase italic tracking-widest">Henüz Ağır Bakım Kaydı Bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

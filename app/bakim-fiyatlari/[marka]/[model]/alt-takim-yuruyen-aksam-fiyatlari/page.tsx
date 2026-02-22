"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, 
  MapPin, BadgeCheck, Gauge, Fuel, ChevronDown, MessageSquare, Layers 
} from 'lucide-react';

export default function AltTakimSayfasi({ params }: { params: any }) {
  const [resolvedParams, setResolvedParams] = useState<any>(null);
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

  useEffect(() => {
    const veriGetir = async () => {
      const p = await params;
      setResolvedParams(p);

      // TİGGO 7 / 7 PRO KARIŞIKLIĞINI ÖNLEYEN KESKİN EŞLEŞME
      const markaEslestirme = p.marka.replace(/-/g, ' ');
      const modelEslestirme = p.model.replace(/-/g, ' ');

      const { data } = await supabase
        .from('bakim_kayitlari')
        .select('*')
        .eq('onayli_mi', true)
        .ilike('marka', markaEslestirme)
        .ilike('model', modelEslestirme)
        .order('fiyat', { ascending: true });

      if (data) {
        const duzenlenmisData = data.map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir),
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          bakim_turu_format: normalizeMetin(item.bakim_turu),
          fatura_onayli: !!item.fatura_url,
          kullanici_onayli: !item.fatura_url
        })).filter(item => {
          const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
          // Alt Takım Filtresi: Fren, balata, disk veya direkt alt takım geçenler
          return m.includes("alt takım") || m.includes("fren") || m.includes("balata") || m.includes("disk") || m.includes("amortisör");
        });
        setKayitlar(duzenlenmisData);
      }
      setYukleniyor(false);
    };
    veriGetir();
  }, [params]);

  if (yukleniyor || !resolvedParams) {
    return <div className={`min-h-screen flex items-center justify-center font-black text-yellow-500 uppercase ${isDarkMode ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>YÜKLENİYOR...</div>;
  }

  return (
    <main className={`min-h-screen pb-20 text-left transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* HEADER */}
      <div className="py-16 px-6 border-b bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
            {normalizeMetin(resolvedParams.marka.replace(/-/g, ' '))} <span className="text-yellow-500">{normalizeMetin(resolvedParams.model.replace(/-/g, ' '))}</span><br/>ALT TAKIM FİYATLARI
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-4 flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" /> TOPLAM {kayitlar.length} DOĞRULANMIŞ ALT TAKIM VERİSİ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Layers size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        ALT TAKIM & FREN SİSTEMİ
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
                  <div><span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 block text-left">Toplam Tutar</span><p className="text-3xl font-black text-yellow-600 tracking-tighter">{item.fiyat?.toLocaleString('tr-TR')} TL</p></div>
                  <div className="text-[10px] font-black text-slate-400 uppercase italic">{item.tarih ? item.tarih.split('-').reverse().join('.') : '-'}</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-24 bg-transparent rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-lg font-black text-slate-400 uppercase italic tracking-widest">Henüz Alt Takım Kaydı Bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

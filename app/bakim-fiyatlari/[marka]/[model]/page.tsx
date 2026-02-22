"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, 
  MapPin, BadgeCheck, Gauge, Fuel, ChevronDown, MessageSquare, Layers 
} from 'lucide-react';

export default function ModelDetaySayfasi({ params }: { params: any }) {
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

      // URL'deki tireleri boşluğa çevirerek tam eşleşme sağlıyoruz (Tiggo 7 Pro sorunu çözümü)
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
        setKayitlar(data.map(item => ({
          ...item,
          sehir: normalizeMetin(item.sehir),
          marka_format: normalizeMetin(item.marka),
          model_format: normalizeMetin(item.model),
          bakim_turu_format: normalizeMetin(item.bakim_turu),
          fatura_onayli: !!item.fatura_url
        })));
      }
      setYukleniyor(false);
    };
    veriGetir();
  }, [params]);

  if (yukleniyor || !resolvedParams) return <div className="min-h-screen flex items-center justify-center font-black text-yellow-500 uppercase">YÜKLENİYOR...</div>;

  return (
    <main className={`min-h-screen pb-20 text-left transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      <div className="py-16 px-6 border-b bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16} /> Ana Sayfaya Dön</Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
            {normalizeMetin(resolvedParams.marka.replace(/-/g, ' '))} <span className="text-yellow-500">{normalizeMetin(resolvedParams.model.replace(/-/g, ' '))}</span><br/>BAKIM FİYATLARI
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kayitlar.map((item) => (
            <div key={item.id} className={`rounded-[2.5rem] border overflow-hidden shadow-sm transition-all flex flex-col h-fit group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} ${acikKartId === item.id ? 'ring-2 ring-yellow-500 shadow-xl' : ''}`}>
              <div onClick={() => setAcikKartId(acikKartId === item.id ? null : item.id)} className="p-8 flex-1 flex flex-col text-left cursor-pointer relative">
                <div className="absolute top-8 right-8"><ChevronDown size={20} className={`text-slate-400 transition-transform ${acikKartId === item.id ? 'rotate-180 text-yellow-500' : ''}`} /></div>
                <div className="flex justify-between items-start mb-6 pr-8">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>{item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}</span>
                  <div className="flex gap-1">{item.fatura_onayli && <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg"><ShieldCheck size={12} strokeWidth={4} /></div>}</div>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-[10px] tracking-[0.2em] mb-1"><Car size={14} /><span>{item.marka_format}</span></div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">{item.model_format} <span className="text-slate-500 text-lg">'{item.yil?.toString().slice(2)}</span></h3>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500"><Layers size={14} /><span className="text-[10px] font-black uppercase">{item.km?.toLocaleString('tr-TR')} KM KAYDI</span></div>
                    <p className={`text-xs font-bold uppercase tracking-tight px-3 py-1 rounded-lg w-fit border ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-100 shadow-none'}`}>{item.bakim_turu_format}</p>
                  </div>
                </div>
                {acikKartId === item.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                    <div className="flex flex-col bg-transparent border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-black mb-1 flex items-center gap-1"><Fuel size={12}/> Yakıt & Motor</span>
                      <p className="text-xs font-bold uppercase">{item.yakit_motor || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 pt-0 mt-auto border-t flex justify-between items-end">
                <div><span className="text-[10px] text-slate-500 uppercase font-black block">Toplam Tutar</span><p className="text-3xl font-black text-yellow-600">{item.fiyat?.toLocaleString('tr-TR')} TL</p></div>
                <div className="text-[10px] font-black text-slate-400 italic">{item.tarih?.split('-').reverse().join('.')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

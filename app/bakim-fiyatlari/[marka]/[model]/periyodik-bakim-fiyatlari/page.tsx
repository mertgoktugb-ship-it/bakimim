"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, 
  MapPin, BadgeCheck, Gauge, Fuel, ChevronDown, MessageSquare, Layers 
} from 'lucide-react';

export default function PeriyodikBakimSayfasi({ params }: { params: any }) {
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
          bakim_turu_format: normalizeMetin(item.bakim_turu),
          fatura_onayli: !!item.fatura_url,
          kullanici_onayli: !item.fatura_url
        })).filter(item => {
          const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
          return !m.includes("ağır") && !m.includes("triger") && !m.includes("alt takım") && !m.includes("balata");
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
      <div className="py-16 px-6 border-b bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16} /> Ana Sayfaya Dön</Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
            {normalizeMetin(resolvedParams.marka.replace(/-/g, ' '))} <span className="text-yellow-500">{normalizeMetin(resolvedParams.model.replace(/-/g, ' '))}</span><br/>PERİYODİK BAKIM FİYATLARI
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kayitlar.map((item) => (
            <div key={item.id} className={`rounded-[2.5rem] border p-8 flex flex-col h-fit ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>{item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}</span>
                <div className="flex gap-1">
                  {item.fatura_onayli ? <div className="bg-emerald-500 text-white p-1.5 rounded-full"><ShieldCheck size={12} strokeWidth={4} /></div> : <div className="bg-blue-500 text-white p-1.5 rounded-full"><BadgeCheck size={12} strokeWidth={4} /></div>}
                </div>
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">{item.model_format} <span className="text-slate-500 text-lg">'{item.yil?.toString().slice(2)}</span></h3>
              <div className="flex items-center gap-2 text-yellow-600 mb-4"><Layers size={14} /><span className="text-[10px] font-black uppercase">PERİYODİK BAKIM ({item.km?.toLocaleString('tr-TR')} KM)</span></div>
              <p className={`text-[10px] font-black uppercase mb-4 ${item.fatura_onayli ? 'text-emerald-500' : 'text-blue-500'}`}>{item.fatura_onayli ? 'Belge Destekli Kullanıcı Bildirimi' : 'Kullanıcı Beyanı'}</p>
              <div className="pt-6 border-t mt-auto flex justify-between items-end">
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

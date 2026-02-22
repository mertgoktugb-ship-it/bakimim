"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Zap, Car, Layers, ChevronDown, Fuel, MessageSquare, BadgeCheck } from 'lucide-react';

export default function AgirBakimDetaySayfasi({ params }: { params: any }) {
  const [resolvedParams, setResolvedParams] = useState<any>(null);
  const [kayitlar, setKayitlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [acikKartId, setAcikKartId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    const veriGetir = async () => {
      const p = await params;
      setResolvedParams(p);
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
        const filtered = data.filter(item => {
          const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
          return m.includes("ağır") || m.includes("triger") || m.includes("revizyon") || m.includes("şanzıman");
        });
        setKayitlar(filtered);
      }
      setYukleniyor(false);
    };
    veriGetir();
  }, [params]);

  if (yukleniyor || !resolvedParams) return <div className="min-h-screen flex items-center justify-center font-black text-yellow-500">YÜKLENİYOR...</div>;

  return (
    <main className={`min-h-screen pb-20 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      <div className="py-16 px-6 border-b bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16} /> Ana Sayfaya Dön</Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
            {resolvedParams.marka.replace(/-/g, ' ')} <span className="text-yellow-500">{resolvedParams.model.replace(/-/g, ' ')}</span><br/>AĞIR BAKIM FİYATLARI
          </h1>
        </div>
      </div>
      {/* Burada yukarıdaki Kart yapısının aynısı kayitlar.map ile dönebilir */}
    </main>
  );
}

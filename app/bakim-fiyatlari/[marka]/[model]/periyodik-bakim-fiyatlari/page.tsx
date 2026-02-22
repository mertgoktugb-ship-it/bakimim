"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
// ... Lucide importları ...

export default function PeriyodikBakimSayfasi({ params }: { params: any }) {
  const [resolvedParams, setResolvedParams] = useState<any>(null);
  const [kayitlar, setKayitlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

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
        .ilike('model', modelEslestirme);

      if (data) {
        const filtered = data.filter(item => {
          const m = (item.bakim_turu || "").toLocaleLowerCase('tr-TR');
          // Periyodik Bakım Kapsayıcı Filtre: Balata veya Triger geçse bile "bakım" geçiyorsa periyodiktir.
          return m.includes("periyodik") || m.includes("bakım") || m.includes("yağ") || m.includes("filtre");
        });
        setKayitlar(filtered);
      }
      setYukleniyor(false);
    };
    veriGetir();
  }, [params]);

  // ... UI Kodları yukarıdaki sayfalarla aynı şekilde devam eder ...
}

"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const blogIcerikleri: any = {
  "yetkili-vs-ozel-servis": {
    kategori: "Analiz",
    baslik: "Yetkili Servis mi Özel Servis mi? 2026 Fiyat Karşılaştırması",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Araç sahiplerinin en büyük ikilemi: Garantiyi bozmamak için fahiş fiyatlar ödemek mi, yoksa güvenilir bir özel serviste tasarruf etmek mi? bakımım.com verilerine göre, bir Toyota C-HR periyodik bakımı yetkili serviste 45.390 TL'ye kadar çıkarken, özel servislerde aynı işlem 9.496 TL bandında yapılabiliyor.",
      "Tavsiyemiz: Eğer aracınızın garantisi devam ediyorsa yetkili servisten vazgeçmeyin. Ancak garantisi bitmiş araçlar için TSE onaylı özel servisler, bütçenizi korumanın en akıllı yoludur."
    ]
  },
  "bakim-faturasi-dusurme": {
    kategori: "İpucu",
    baslik: "Bakım Faturasını Düşürmenin 5 Yolu: Servise Gitmeden Önce Okuyun!",
    tarih: "13 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Servis faturanızdaki 'gereksiz' kalemleri nasıl elersiniz? İşte tasarruf tüyoları:",
      "1. Silecek suyunuzu gitmeden önce kendiniz doldurun.",
      "2. Filtreleri kontrol edin.",
      "3. Sadece gerekli görülen işlemlere onay verin."
    ]
  }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  if (!yazi) {
    return (
      <div className="p-20 text-center uppercase font-black">
        <h1 className="text-4xl mb-4">Yazı Bulunamadı</h1>
        <Link href="/blog" className="text-blue-700 underline text-sm">Blog Listesine Dön</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-left">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg"><Car size={28} className="text-blue-400" /></div>
              <span className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-700 uppercase tracking-widest">
             <ArrowLeft size={16}/> Geri Dön
           </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-black px-4 py-2 rounded-xl uppercase tracking-widest mb-6 inline-block">{yazi.kategori}</span>
        <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-tight mb-10 text-left">{yazi.baslik}</h1>
        
        <div className="flex items-center gap-6 mb-16 border-y border-slate-100 py-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><Calendar size={16}/> {yazi.tarih}</div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><User size={16}/> {yazi.yazar}</div>
        </div>

        <div className="space-y-8 text-left">
          {yazi.icerik.map((p: string, i: number) => (
            <p key={i} className="text-xl text-slate-600 leading-relaxed font-medium italic">{

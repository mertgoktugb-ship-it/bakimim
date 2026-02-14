"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Search, Clock, ChevronRight } from 'lucide-react';

const blogIcerikleri: any = {
  "yetkili-vs-ozel-servis": {
    kategori: "Strateji",
    baslik: "Yetkili Servis mi Özel Servis mi? 2026 Fiyat Karşılaştırması",
    foto: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1600",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "5 Dakika",
    icerik: ["2026 yılı bakım maliyetleri karşılaştırması...", "Garantisi bitmiş araçlar için özel servis avantajları..."]
  },
  "istanbul-honda-bakim-fiyatlari-2026": {
    kategori: "Bölgesel Analiz",
    baslik: "İstanbul Honda Bakım Fiyatları 2026: Servis Rehberi",
    foto: "https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1600",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: ["İstanbul'daki Honda servislerinde fiyatlar semte göre değişiyor.", "Maslak ve Bostancı bölgelerindeki fiyat analizlerimiz."]
  }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  if (!yazi) return <div className="p-20 text-center">İçerik Bulunamadı.</div>;

  return (
    <main className="min-h-screen bg-white pb-20 text-left">
      <nav className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white flex items-center justify-center">
                <Car size={24} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <span className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <ArrowLeft size={16} /> Geri Dön
           </Link>
      </nav>

      <div className="w-full h-[50vh] relative bg-slate-200">
         <img 
            src={yazi.foto} 
            alt={yazi.baslik} 
            className="w-full h-full object-cover"
            onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1487754180451-c456f719c141?auto=format&fit=crop&q=80&w=1600"}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-50">
          <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase mb-8 inline-block">{yazi.kategori}</span>
          <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase mb-12 leading-tight">{yazi.baslik}</h1>
          <div className="space-y-8">
            {yazi.icerik.map((p: string, i: number) => (
              <p key={i} className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6">{p}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}

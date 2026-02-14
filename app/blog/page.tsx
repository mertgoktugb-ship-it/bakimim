"use client";
import React from 'react';
import Link from 'next/link';
import { Car, BookOpen, ArrowRight, Home } from 'lucide-react';

const blogYazilari = [
  {
    slug: "yetkili-vs-ozel-servis",
    kategori: "Analiz",
    baslik: "Yetkili Servis mi Özel Servis mi? 2026 Fiyat Karşılaştırması",
    ozet: "2026 bakım masraflarında %70 tasarruf etmek mümkün mü? Verilerle servis fiyatlarını mercek altına aldık.",
  },
  {
    slug: "2026-toyota-c-hr-bakim-maliyeti",
    kategori: "Model Analizi",
    baslik: "Toyota C-HR Periyodik Bakım Fiyatları 2026: Güncel Rehber",
    ozet: "Toyota C-HR kullanıcıları için güncel fiyatlar ve yetkili-özel servis kıyaslamaları.",
  },
  {
    slug: "bakim-faturasi-dusurme",
    kategori: "İpucu",
    baslik: "Bakım Faturasını Düşürmenin 5 Yolu: Servise Gitmeden Önce Okuyun!",
    ozet: "Servis faturanızdaki gereksiz kalemleri nasıl elersiniz? Tasarruf tüyoları.",
  },
  {
    slug: "istanbul-honda-bakim-fiyatlari-2026",
    kategori: "Bölgesel",
    baslik: "İstanbul Honda Bakım Fiyatları 2026: Servis Rehberi",
    ozet: "İstanbul'da Honda Civic ve City sahipleri için servis maliyet analizi.",
  }
];

export default function BlogListeleme() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-blue-700">.com</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Bilgi Kütüphanesi</span>
              </div>
           </Link>
           <Link href="/" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-700 uppercase tracking-widest transition-all">
             <Home size={16}/> Ana Sayfa
           </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-16">
          <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-xl"><BookOpen size={32} /></div>
          <h1 className="text-4xl md:text-6xl font-black italic text-slate-800 uppercase tracking-tighter text-left">Servis Rehberi</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group cursor-pointer">
              <div className="bg-slate-200 aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-inner transition-transform group-hover:-translate-y-2 duration-300">
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-10 text-left">
                   <span className="bg-blue-600 text-white text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">{blog.kategori}</span>
                   <h2 className="text-3xl font-black text-white leading-tight uppercase italic tracking-tight text-left">{blog.baslik}</h2>
                 </div>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed italic mb-6 px-4 text-left text-lg">{blog.ozet}</p>
              <div className="flex items-center gap-2 text-blue-700 font-black text-sm uppercase tracking-widest px-4 group-hover:gap-6 transition-all">
                Makaleyi Oku <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

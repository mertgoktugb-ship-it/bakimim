"use client";
import React from 'react';
import Link from 'next/link';
import { Car, BookOpen, ArrowRight, Home } from 'lucide-react';

const blogYazilari = [
  { slug: "ankara-toyota-chr-batarya-degisim-maliyeti", kategori: "Hibrit", baslik: "Ankara C-HR Batarya Fiyatları", ozet: "Ankara'da hibrit batarya revizyonu ve değişim maliyetleri.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "istanbul-renault-clio-agir-bakim-fiyatlari", kategori: "Ağır Bakım", baslik: "İstanbul Clio Triger Seti 2026", ozet: "Renault Clio için triger ve ağır bakım fatura analizi.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "izmir-volkswagen-golf-bakim-ucretleri", kategori: "Model Analizi", baslik: "İzmir VW Golf Bakım Ücretleri", ozet: "Golf 8 ve 7.5 modelleri için İzmir servis rehberi.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "adana-fiat-egea-servis-maliyetleri", kategori: "Bölgesel", baslik: "Adana Egea Servis Maliyetleri", ozet: "Fiat Egea için Adana sanayi ve yetkili servis kıyaslaması.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "samsun-honda-civic-sanziman-yagi-degisimi", kategori: "Teknik", baslik: "Samsun Civic Şanzıman Bakımı", ozet: "Civic CVT şanzıman yağı değişiminde Samsun fiyatları.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "opel-astra-triger-kayisi-degisim-fiyati", kategori: "Ağır Bakım", baslik: "Astra Triger Değişim Fiyatı", ozet: "Opel Astra triger kayışı değişiminde 2026 güncel tutarlar.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "citroen-c4x-periyodik-bakim-tablosu", kategori: "Rehber", baslik: "Citroen C4X Bakım Tablosu", ozet: "C4X kullanıcıları için 2026 periyodik bakım detayları.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "istanbul-bmw-periyodik-bakim-fiyatlari", kategori: "Premium", baslik: "İstanbul BMW Servis Fiyatları", ozet: "BMW 3 ve 5 serisi için İstanbul'daki fatura örnekleri.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "ankara-mercedes-periyodik-bakim-rehberi", kategori: "Premium", baslik: "Ankara Mercedes Bakım Rehberi", ozet: "Mercedes A ve C serisi için Ankara özel servis analizleri.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "izmir-ford-focus-agir-bakim-maliyeti", kategori: "Ağır Bakım", baslik: "İzmir Focus Ağır Bakım Fiyatı", ozet: "Ford Focus ağır bakım ve triger maliyetleri İzmir.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "samsun-toyota-corolla-hibrit-bakim-fiyatlari", kategori: "Bölgesel", baslik: "Samsun Corolla Hibrit Bakımı", ozet: "Toyota Corolla Hibrit modelleri için Samsun servis verileri.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "adana-hyundai-i20-bakim-fiyatlari", kategori: "Model Analizi", baslik: "Adana Hyundai i20 Bakım", ozet: "Hyundai i20 sahipleri için Adana servis maliyetleri.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "istanbul-audi-a3-sanziman-bakimi", kategori: "Teknik", baslik: "İstanbul Audi A3 DSG Bakımı", ozet: "Audi A3 DSG şanzıman ve tüp değişim maliyetleri İstanbul.", renk: "from-[#0f172a] to-[#1e293b]" },
  { slug: "ankara-skoda-octavia-agir-bakim-ucreti", kategori: "Ağır Bakım", baslik: "Ankara Octavia Ağır Bakım", ozet: "Skoda Octavia triger ve devirdaim maliyetleri Ankara.", renk: "from-[#1e293b] to-[#334155]" },
  { slug: "izmir-seat-leon-bakim-maliyeti-2026", kategori: "Model Analizi", baslik: "İzmir Seat Leon Bakım Rehberi", ozet: "Seat Leon kullanıcıları için İzmir'deki güncel faturalar.", renk: "from-[#0f172a] to-[#1e293b]" }
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Bilgi Kütüphanesi</span>
              </div>
           </Link>
           <Link href="/" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-700 uppercase tracking-widest transition-all">
             <Home size={16}/> ANA SAYFA
           </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-16 text-left">
          <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-xl"><BookOpen size={32} /></div>
          <h1 className="text-4xl md:text-6xl font-black italic text-slate-800 uppercase tracking-tighter text-left">Servis Rehberi</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {blogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${blog.renk} aspect-video rounded-[3rem] mb-8 overflow-hidden relative shadow-inner transition-transform group-hover:-translate-y-2 duration-300`}>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-10 text-left">
                   <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">{blog.kategori}</span>
                   <h2 className="text-3xl font-black text-white leading-tight uppercase italic tracking-tight">{blog.baslik}</h2>
                 </div>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed italic mb-6 px-4 text-left text-lg line-clamp-2">{blog.ozet}</p>
              <div className="flex items-center gap-2 text-blue-700 font-black text-sm uppercase tracking-widest px-4 group-hover:gap-6 transition-all text-left">
                Makaleyi Oku <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

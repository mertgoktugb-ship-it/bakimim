"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Search, Clock } from 'lucide-react';

const blogIcerikleri: any = {
  "istanbul-honda-bakim-fiyatlari-2026": {
    kategori: "Bölgesel Analiz",
    baslik: "İstanbul Honda Bakım Fiyatları 2026: Servis Rehberi",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: [
      "İstanbul genelinde Honda Civic ve CR-V modelleri için bakım maliyetleri semte göre değişiyor. Maslak Oto Sanayi, rekabetin en yüksek olduğu bölgelerin başında geliyor.",
      "Özellikle şanzıman yağı değişimi gibi kritik bakımlarda yetkili servis fiyatlarını sitemizdeki özel servis faturalarıyla kıyaslamadan karar vermeyin."
    ]
  },
  "fiat-egea-periyodik-bakim-tablosu-2026": {
    kategori: "Model Rehberi",
    baslik: "Fiat Egea Periyodik Bakım Fiyatları 2026",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "6 Dakika",
    icerik: [
      "Türkiye'nin en çok tercih edilen otomobili Fiat Egea'nın 2026 bakım maliyetlerini inceledik.",
      "Ankara, İstanbul ve Bursa'daki Fiat sahiplerinin paylaştığı güncel fatura verilerine göre 20.000 km bakımı ortalaması 6.500 TL civarında seyrediyor."
    ]
  }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  if (!yazi) return <div className="p-20 text-center font-black uppercase italic text-slate-400 text-left">İçerik Bulunamadı</div>;

  return (
    <main className="min-h-screen bg-white pb-20 text-left text-left">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 sticky top-0 z-50 flex justify-between items-center text-left">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center">
                <Car size={24} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <span className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter text-left">bakımım<span className="text-blue-700 text-left">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-700 uppercase tracking-widest text-left">
             <ArrowLeft size={16} /> Geri Dön
           </Link>
      </nav>

      {/* GÖRSEL KALDIRILDI - YERİNE RENK GEÇİŞLİ BAŞLIK ALANI GELDİ */}
      <div className="w-full h-[35vh] bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative text-left">
         <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 text-left text-left">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-slate-50 text-left">
          <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase mb-8 inline-block tracking-widest text-left">{yazi.kategori}</span>
          <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-tight mb-12 text-left">{yazi.baslik}</h1>
          
          <div className="flex gap-8 py-8 border-y border-slate-100 mb-12 text-left">
            <div className="flex flex-col text-left"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left text-left">Yazar</span><span className="text-xs font-black text-slate-800 italic text-left">{yazi.yazar}</span></div>
            <div className="flex flex-col text-left"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left text-left">Tarih</span><span className="text-xs font-black text-slate-800 italic text-left">{yazi.tarih}</span></div>
          </div>

          <div className="space-y-12 text-left text-left">
            {yazi.icerik.map((p: string, i: number) => (
              <p key={i} className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic border-l-8 border-blue-50 pl-8 text-left text-left">{p}</p>
            ))}
          </div>

          <div className="mt-20 p-8 md:p-12 bg-[#0f172a] rounded-[3rem] text-white relative overflow-hidden text-left text-left">
             <h3 className="text-3xl font-black italic uppercase mb-4 tracking-tighter leading-none relative z-10 text-left">Fiyat Karşılaştırmaya <span className="text-blue-500 underline text-left">Hemen Başla</span></h3>
             <Link href="/" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl inline-flex items-center gap-3 mt-8 relative z-10 hover:bg-blue-500 transition-all text-left"><Search size={18} /> Sorgula</Link>
          </div>
        </div>
      </article>
    </main>
  );
}

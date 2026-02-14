"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Calendar, User, Share2, Search } from 'lucide-react';

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
  "2026-toyota-c-hr-bakim-maliyeti": {
    kategori: "Model Analizi",
    baslik: "Toyota C-HR Periyodik Bakım Fiyatları 2026: Güncel Rehber",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Toyota C-HR sahipleri için 2026 yılı bakım maliyetleri hibrit sistem kontrolleriyle birlikte şekilleniyor. Yetkili servislerde sunulan hibrit sağlık check-up'ı önemli bir avantaj olsa da, parça fiyatlarındaki artış kullanıcıları özel servislere yönlendiriyor.",
      "Özellikle 60.000 ve 90.000 gibi ağır bakımlarda, yetkili servis faturaları 40 bin TL sınırını zorlayabiliyor."
    ]
  },
  "bakim-faturasi-dusurme": {
    kategori: "İpucu",
    baslik: "Bakım Faturasını Düşürmenin 5 Yolu: Servise Gitmeden Önce Okuyun!",
    tarih: "13 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "1. Silecek suyunu kendiniz doldurun. 2. Hava ve polen filtrelerini kendiniz değiştirmeyi deneyin. 3. Servis kampanyalarını sitemizden takip edin."
    ]
  },
  "istanbul-honda-bakim-fiyatlari-2026": {
    kategori: "Bölgesel",
    baslik: "İstanbul Honda Bakım Fiyatları 2026: Servis Rehberi",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "İstanbul'da Honda Civic, City veya CR-V sahibiyseniz, 2026 verilerimize göre yetkili servislerde periyodik bakım 18.000 TL'den başlıyor. Özel servislerde ise bu rakam 7.000 TL bandına kadar düşebiliyor.",
      "Anadolu ve Avrupa yakasındaki Honda uzmanı özel servisleri sitemiz üzerinden karşılaştırarak en iyi fiyatı alabilirsiniz."
    ]
  }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  if (!yazi) return <div className="p-20 text-center font-black uppercase">Yazı bulunamadı.</div>;

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

      <article className="max-w-3xl mx-auto px-6 py-20 text-left">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-black px-4 py-2 rounded-xl uppercase tracking-widest mb-6 inline-block">{yazi.kategori}</span>
        <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-[0.9] mb-10 text-left">{yazi.baslik}</h1>
        
        <div className="flex items-center gap-6 mb-16 border-y border-slate-100 py-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><Calendar size={16}/> {yazi.tarih}</div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><User size={16}/> {yazi.yazar}</div>
        </div>

        <div className="space-y-8 text-left">
          {yazi.icerik.map((p: string, i: number) => (
            <p key={i} className="text-xl text-slate-600 leading-relaxed font-medium italic pl-4 border-l-4 border-blue-50">{p}</p>
          ))}
        </div>

        {/* CTA BUTONU: Blog okuyan adamı sorgulamaya yönlendiriyoruz */}
        <div className="mt-20 p-10 bg-blue-700 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
           <div className="text-left">
              <h3 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">Aracının Bakımı Ne Kadar?</h3>
              <p className="text-blue-100 font-bold uppercase text-[10px] tracking-widest">Binlerce servis verisiyle anında sorgula</p>
           </div>
           <Link href="/" className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform shrink-0">
             <Search size={18} /> Hemen Sorgula
           </Link>
        </div>
      </article>
    </main>
  );
}

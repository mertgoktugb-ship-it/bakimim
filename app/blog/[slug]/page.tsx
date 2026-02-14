"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Calendar, User, Search, BookOpen, Clock, ChevronRight } from 'lucide-react';

const blogIcerikleri: any = {
  "yetkili-vs-ozel-servis": {
    kategori: "Strateji",
    baslik: "Yetkili Servis mi Özel Servis mi? 2026 Fiyat Karşılaştırması",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "5 Dakika",
    icerik: [
      "2026 yılı itibarıyla yedek parça ve işçilik maliyetlerindeki artış, araç sahiplerini zorlu bir karara itiyor: Yetkili servis güveni mi, özel servis ekonomisi mi? Verilerimize göre popüler modellerde yetkili ve özel servis arasındaki fiyat farkı %70'e ulaşmış durumda.",
      "Tavsiyemiz: Eğer aracınızın garantisi devam ediyorsa yetkili servisten vazgeçmeyin. Ancak garantisi bitmiş araçlar için TSE onaylı ve bakimim.com üzerinde yüksek puan almış özel servisler, bütçenizi korumanın en akıllı yoludur."
    ]
  },
  "istanbul-honda-bakim-fiyatlari-2026": {
    kategori: "Bölgesel Analiz",
    baslik: "İstanbul Honda Bakım Fiyatları 2026: Servis Rehberi",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: [
      "İstanbul'da Honda Civic ve City sahipleri için 2026 yılı bakım maliyetleri semte göre büyük değişkenlik gösteriyor. Anadolu yakasındaki uzman özel servislerde 10.000 km bakımı ortalama 7.500 TL bandında seyrediyor.",
      "Avrupa yakasında Maslak ve Bostancı bölgeleri rekabetin en yüksek olduğu noktalar. Yetkili servislerde ise standart bakım ücretlerinin 18.000 TL bandından başladığını gözlemliyoruz. Sitemizdeki güncel fatura verilerini kontrol etmeden randevu almayın."
    ]
  },
  "ankara-toyota-servis-ucretleri-2026": {
    kategori: "Bölgesel Analiz",
    baslik: "Ankara Toyota Servis Ücretleri: İvedik ve Şaşmaz Rehberi",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: [
      "Ankara'nın sert iklim koşulları, Toyota Corolla ve C-HR kullanıcıları için düzenli bakımı hayati kılıyor. Şaşmaz ve İvedik Oto Sanayi sitelerinde yaptığımız araştırmalar, Toyota bakımlarının Ankara'da oldukça rekabetçi olduğunu gösteriyor.",
      "Özellikle hibrit modeller için Ankara'daki uzman servisleri sitemiz üzerinden filtreleyerek, yetkili servis kalitesinde ama çok daha uygun fiyatlı hizmet almanız mümkün."
    ]
  },
  "opel-zafira-periyodik-bakim-ucreti": {
    kategori: "Model Rehberi",
    baslik: "Opel Zafira Periyodik Bakım Ücreti 2026: Güncel Tablo",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "3 Dakika",
    icerik: [
      "Geniş ailelerin tercihi Opel Zafira, periyodik bakımda filtre grubu ve yağ kalitesi konusunda hassas bir model. 2026 verilerimize göre Opel Zafira modelleri için standart bakım maliyetleri 8.500 TL'den başlıyor.",
      "Ağır bakım (Triger seti ve devirdaim) maliyetlerinin 22.000 TL bandını zorladığı bu dönemde, bakimim.com üzerindeki kullanıcı faturası paylaşımları size en net fiyatı sunacaktır."
    ]
  },
  "izmir-citroen-ozel-servis-fiyatlari": {
    kategori: "Bölgesel Analiz",
    baslik: "İzmir Citroen Özel Servis Fiyatları: 6. Sanayi ve Bornova",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: [
      "İzmir'deki Citroen kullanıcıları için Bornova ve 6. Sanayi bölgeleri ana merkezler. Citroen C3, C4 ve C5 Aircross modelleri için 2026 yılı özel servis bakım maliyetleri ortalama 7.000 TL ile 9.500 TL arasında değişiyor.",
      "Ege bölgesindeki sıcak hava şartları nedeniyle klima bakımı ve soğutma sistemi kontrollerinin bu periyotlara eklenmesini önemle tavsiye ediyoruz."
    ]
  }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  if (!yazi) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-9xl font-black text-slate-200 mb-4 tracking-tighter italic">404</h1>
          <p className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-8 italic">İçerik Bulunamadı</p>
          <Link href="/blog" className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl inline-block hover:scale-105 transition-transform">Rehberlere Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-left">
      {/* ÜST NAVİGASYON */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform group-hover:rotate-6">
                <Car size={24} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <span className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-700 uppercase tracking-[0.2em] transition-all group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Geri Dön
           </Link>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-left">
        {/* ÜST BİLGİ */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest">{yazi.kategori}</span>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{yazi.okumaSuresi}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black italic text-slate-900 uppercase tracking-tighter leading-[0.9] mb-12 text-left">
            {yazi.baslik}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black italic">MŞ</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Yazar</span>
                <span className="text-xs font-black text-slate-800 uppercase italic">{yazi.yazar}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Yayın Tarihi</span>
              <span className="text-xs font-black text-slate-800 uppercase italic">{yazi.tarih}</span>
            </div>
          </div>
        </div>

        {/* İÇERİK */}
        <div className="space-y-12">
          {yazi.icerik.map((p: string, i: number) => (
            <p key={i} className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic border-l-8 border-blue-50 pl-8 text-left">
              {p}
            </p>
          ))}
        </div>

        {/* REKLAM / CTA ALANI */}
        <div className="mt-24 p-8 md:p-16 bg-[#0f172a] rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl group">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <Car size={200} strokeWidth={1} />
           </div>
           
           <div className="relative z-10 text-left max-w-xl">
              <h3 className="text-4xl md:text-6xl font-black uppercase italic mb-6 tracking-tighter leading-none">Aracının Bakım Fiyatını <span className="text-blue-500 underline">Öğren</span></h3>
              <p className="text-blue-300 font-bold uppercase text-sm tracking-widest mb-10 opacity-80 leading-relaxed">Binlerce gerçek kullanıcı faturası arasından kendi aracının bakım maliyetini anında sorgula.</p>
              
              <Link href="/" className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-xl w-full md:w-auto inline-flex">
                <Search size={20} /> Hemen Sorgula <ChevronRight size={20} />
              </Link>
           </div>
        </div>

        {/* DİĞER YAZILAR */}
        <div className="mt-32 pt-20 border-t border-slate-100">
           <h4 className="text-2xl font-black italic text-slate-800 uppercase tracking-tighter mb-12 flex items-center gap-4">
             <BookOpen size={28} className="text-blue-700" /> İlginizi Çekebilir
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.keys(blogIcerikleri).filter(k => k !== slug).slice(0, 2).map(key => (
                <Link key={key} href={`/blog/${key}`} className="group p-8 bg-slate-50 rounded-[2.5rem] hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-100">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">{blogIcerikleri[key].kategori}</span>
                  <h5 className="text-xl font-black text-slate-800 uppercase italic tracking-tight group-hover:text-blue-800 transition-colors leading-tight">{blogIcerikleri[key].baslik}</h5>
                </Link>
              ))}
           </div>
        </div>
      </article>
    </main>
  );
}

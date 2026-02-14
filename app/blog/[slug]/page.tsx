"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Calendar, Search, BookOpen, Clock, ChevronRight } from 'lucide-react';

const blogIcerikleri: any = {
  "yetkili-vs-ozel-servis": {
    kategori: "Strateji",
    baslik: "Yetkili Servis mi Özel Servis mi? 2026 Fiyat Karşılaştırması",
    foto: "https://images.unsplash.com/photo-1632733711679-5292d6863600?q=80&w=1000&auto=format&fit=crop",
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
    foto: "https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=1000&auto=format&fit=crop", // Honda ruhuna uygun servis görseli
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: [
      "İstanbul'da Honda Civic ve City sahipleri için 2026 yılı bakım maliyetleri semte göre büyük değişkenlik gösteriyor. Anadolu yakasındaki uzman özel servislerde 10.000 km bakımı ortalama 7.500 TL bandında seyrediyor.",
      "Avrupa yakasında Maslak ve Bostancı bölgeleri rekabetin en yüksek olduğu noktalar. Yetkili servislerde ise standart bakım ücretlerinin 18.000 TL bandından başladığını gözlemliyoruz. Sitemizdeki güncel fatura verilerini kontrol etmeden randevu almayın."
    ]
  },
  "fiat-egea-periyodik-bakim-tablosu-2026": {
    kategori: "Model Rehberi",
    baslik: "Fiat Egea Periyodik Bakım Fiyatları 2026: 1.3 Multijet ve 1.4 Fire",
    foto: "https://images.unsplash.com/photo-1487754180451-c456f719c141?q=80&w=1000&auto=format&fit=crop",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "6 Dakika",
    icerik: [
      "Türkiye'nin en çok satan modeli Fiat Egea için bakım maliyetleri 2026 yılında da kullanıcı dostu kalmaya devam ediyor. 1.4 Fire benzinli motorların bakımı özel servislerde 5.500 TL bandından başlarken, 1.3 Multijet dizel motorlarda bu rakam 7.200 TL seviyelerine çıkıyor.",
      "Egea sahiplerinin özellikle her 20.000 km'de bir mazot filtresi değişimine dikkat etmesi gerekiyor. Yetkili servislerdeki 'Egea Bakım Paketleri'ni sitemiz üzerinden özel servis fiyatlarıyla kıyaslayabilirsiniz."
    ]
  },
  "ankara-toyota-servis-ucretleri-2026": {
    kategori: "Bölgesel Analiz",
    baslik: "Ankara Toyota Servis Ücretleri: İvedik ve Şaşmaz Rehberi",
    foto: "https://images.unsplash.com/photo-1517524008436-bbdb53c57d59?q=80&w=1000&auto=format&fit=crop",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    okumaSuresi: "4 Dakika",
    icerik: [
      "Ankara'nın sert iklim koşulları, Toyota Corolla ve C-HR kullanıcıları için düzenli bakımı hayati kılıyor. Şaşmaz ve İvedik Oto Sanayi sitelerinde yaptığımız araştırmalar, Toyota bakımlarının Ankara'da oldukça rekabetçi olduğunu gösteriyor.",
      "Özellikle hibrit modeller için Ankara'daki uzman servisleri sitemiz üzerinden filtreleyerek, yetkili servis kalitesinde ama çok daha uygun fiyatlı hizmet almanız mümkün."
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
          <Link href="/blog" className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl inline-block">Geri Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-left">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform hover:rotate-6">
                <Car size={24} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <span className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-700 uppercase tracking-[0.2em] transition-all">
             <ArrowLeft size={16} /> Geri Dön
           </Link>
      </nav>

      {/* BLOG FOTOĞRAFI - ANA GÖRSEL */}
      <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden bg-slate-100">
         <img 
            src={yazi.foto} 
            alt={yazi.baslik} 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 text-left">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-slate-50">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest">{yazi.kategori}</span>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{yazi.okumaSuresi}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-[0.9] mb-12">
            {yazi.baslik}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100 mb-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Yazar</span>
              <span className="text-xs font-black text-slate-800 uppercase italic">{yazi.yazar}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tarih</span>
              <span className="text-xs font-black text-slate-800 uppercase italic">{yazi.tarih}</span>
            </div>
          </div>

          <div className="space-y-12">
            {yazi.icerik.map((p: string, i: number) => (
              <p key={i} className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic border-l-8 border-blue-50 pl-8">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-20 p-8 md:p-12 bg-blue-50 rounded-[2.5rem] border-2 border-dashed border-blue-200 text-left">
             <h3 className="text-2xl font-black italic text-blue-900 uppercase mb-4 tracking-tighter">Aracın İçin En İyi Fiyatı Bul</h3>
             <p className="text-blue-700/70 font-bold uppercase text-xs tracking-widest mb-8">Hemen ana sayfamıza git ve kendi aracının verilerini karşılaştır.</p>
             <Link href="/" className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl inline-flex items-center gap-3">
               <Search size={18} /> Sorgulamaya Başla
             </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Search, Clock, Calendar, User, ChevronRight } from 'lucide-react';

const blogIcerikleri: any = {
  "ankara-toyota-chr-batarya-degisim-maliyeti": { kategori: "Hibrit Rehberi", baslik: "Ankara Toyota C-HR Batarya Değişimi", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "6 dk", icerik: [{ altBaslik: "Batarya Ömrü ve Maliyet", metin: "Ankara'daki C-HR sahipleri için hibrit batarya değişimi yetkili servislerde yüksek maliyetli olsa da Ostim uzmanları hücre bazlı değişimle %50 tasarruf sağlıyor." }] },
  "istanbul-renault-clio-agir-bakim-fiyatlari": { kategori: "Ağır Bakım", baslik: "İstanbul Clio Triger Seti Değişimi", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "5 dk", icerik: [{ altBaslik: "Ağır Bakım Zamanı", metin: "İstanbul trafiğinde Clio için ağır bakım hayati önem taşır. Maslak ve İkitelli sanayideki fatura paylaşımlarını sitemizden kıyaslayabilirsiniz." }] },
  "izmir-volkswagen-golf-bakim-ucretleri": { kategori: "Model Analizi", baslik: "İzmir VW Golf Bakım Rehberi", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "4 dk", icerik: [{ altBaslik: "İzmir VW Servisleri", metin: "Bornova ve 3. Sanayi sitesindeki VW uzmanları Golf sahiplerine yetkili servis kalitesinde ve çok daha uygun fiyata hizmet sunuyor." }] },
  "adana-fiat-egea-servis-maliyetleri": { kategori: "Bölgesel", baslik: "Adana Egea Bakım Analizi", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "5 dk", icerik: [{ altBaslik: "Adana Sanayi Deneyimi", metin: "Yeşiloba bölgesindeki Fiat uzmanları Egea bakımında en çok tercih edilenler arasında. Ortalama fatura 4.800 TL seviyesinde." }] },
  "samsun-honda-civic-sanziman-yagi-degisimi": { kategori: "Teknik Bakım", baslik: "Samsun Civic CVT Bakımı", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "6 dk", icerik: [{ altBaslik: "CVT Şanzıman Sağlığı", metin: "Samsun'daki Honda sahipleri için şanzıman yağı değişiminde orijinal yağ kullanımı kritik. Yetkili servis fiyatlarını sitemizden takip edin." }] },
  "opel-astra-triger-kayisi-degisim-fiyati": { kategori: "Ağır Bakım", baslik: "Astra Triger Değişim Maliyeti", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "5 dk", icerik: [{ altBaslik: "Motor Ömrü İçin Kritik", metin: "Opel Astra modellerinde triger değişimi 2026 yılında özel servislerde ortalama 14.000 TL bandında seyretmektedir." }] },
  "citroen-c4x-periyodik-bakim-tablosu": { kategori: "Rehber", baslik: "Citroen C4X 2026 Bakım Planı", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "4 dk", icerik: [{ altBaslik: "Garanti ve Periyodik Bakım", metin: "C4X kullanıcıları garanti süresince yetkili servis, sonrasında ise Bosch Car Service gibi kurumsal özel servisleri tercih ediyor." }] },
  "istanbul-bmw-periyodik-bakim-fiyatlari": { kategori: "Premium", baslik: "İstanbul BMW Servis Ücretleri", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "7 dk", icerik: [{ altBaslik: "BMW Maslak Uzmanları", metin: "İstanbul'da BMW sahipleri yüksek yetkili servis faturaları yerine Maslak bölgesindeki sertifikalı özel servisleri tercih ediyor." }] },
  "ankara-mercedes-periyodik-bakim-rehberi": { kategori: "Premium", baslik: "Ankara Mercedes Servis Rehberi", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "6 dk", icerik: [{ altBaslik: "Yıldız Bakımı Ankara", metin: "Şaşmaz bölgesindeki Mercedes uzmanları parça kalitesi ve uygun işçilikle yetkili servise güçlü bir alternatif sunuyor." }] },
  "izmir-ford-focus-agir-bakim-maliyeti": { kategori: "Ağır Bakım", baslik: "İzmir Focus Triger Değişimi", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "5 dk", icerik: [{ altBaslik: "Ege'de Ford Bakımı", metin: "İzmir sanayi sitelerinde Ford Focus ağır bakım maliyetleri 2026 faturalarına göre 11.000 TL'den başlamaktadır." }] },
  "samsun-toyota-corolla-hibrit-bakim-fiyatlari": { kategori: "Bölgesel", baslik: "Samsun Corolla Hibrit Servis", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "4 dk", icerik: [{ altBaslik: "Karadeniz'de Hibrit Bakımı", metin: "Toyota Corolla Hibrit modelleri için Samsun'daki kullanıcı faturalarını sitemizden ilçe bazlı filtreleyebilirsiniz." }] },
  "adana-hyundai-i20-bakim-fiyatlari": { kategori: "Model Analizi", baslik: "Adana Hyundai i20 Bakım Ücreti", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "4 dk", icerik: [{ altBaslik: "Ekonomik Servis Adana", metin: "Adana'da Hyundai i20 periyodik bakımı sanayi bölgelerinde 3.800 TL'ye kadar düşebilen faturalarla yapılmaktadır." }] },
  "istanbul-audi-a3-sanziman-bakimi": { kategori: "Teknik", baslik: "İstanbul Audi A3 DSG Fiyatları", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "6 dk", icerik: [{ altBaslik: "DSG Tüp Değişimi", metin: "Audi A3 sahipleri için İstanbul trafiğinde şanzıman sağlığı kritik. Özel servis faturalarını incelemeden karar vermeyin." }] },
  "ankara-skoda-octavia-agir-bakim-ucreti": { kategori: "Ağır Bakım", baslik: "Ankara Octavia Servis Rehberi", tarih: "15 Şubat 2026", yazar: "bakımım.com", sure: "5 dk", icerik: [{ altBaslik: "Skoda Ankara Sanayi", metin: "Octavia ağır bakım faturaları Ankara özel servislerinde yetkili servislerin yarı fiyatına (ortalama 15.500 TL) yapılmaktadır." }] },
  "izmir-seat-leon-bakim-maliyeti-2026": { kategori: "Model Analizi", baslik: "İzmir Seat Leon Fiyat Analizi", tarih: "15 Şubat 2026", yazar: "Mert Şen", sure: "4 dk", icerik: [{ altBaslik: "İzmir'de Leon Keyfi", metin: "Seat Leon periyodik bakımları için İzmir'deki şeffaf fatura paylaşımları 5.500 TL bandında yoğunlaşmaktadır." }] }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  if (!yazi) return <div className="p-20 text-center font-black uppercase italic text-slate-400">İçerik Bulunamadı</div>;

  return (
    <main className="min-h-screen bg-white pb-20 text-left">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 sticky top-0 z-50 flex justify-between items-center text-left">
           <Link href="/" className="flex items-center gap-3 text-left">
              <div className="bg-[#0f172a] p-2 rounded-xl text-white shadow-lg flex items-center justify-center">
                <Car size={20} className="text-blue-400" />
              </div>
              <span className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-700 uppercase tracking-widest transition-all">
             <ArrowLeft size={16} /> LİSTEYE DÖN
           </Link>
      </nav>

      <div className="w-full h-[35vh] bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative text-left">
         <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
         <div className="absolute bottom-12 left-0 w-full px-6 text-left">
            <div className="max-w-4xl mx-auto text-left">
               <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase mb-4 inline-block tracking-widest">{yazi.kategori}</span>
               <h1 className="text-4xl md:text-6xl font-black text-white leading-tight italic tracking-tighter uppercase">{yazi.baslik}</h1>
            </div>
         </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 relative z-10 text-left">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-slate-50 text-left">
          <div className="flex gap-8 py-6 border-b border-slate-100 mb-12 text-slate-400 font-bold uppercase text-[10px] tracking-widest text-left">
            <div className="flex items-center gap-2 text-left"><User size={14} className="text-blue-600"/> {yazi.yazar}</div>
            <div className="flex items-center gap-2 text-left"><Calendar size={14} className="text-blue-600"/> {yazi.tarih}</div>
            <div className="flex items-center gap-2 text-left"><Clock size={14} className="text-blue-600"/> {yazi.sure}</div>
          </div>

          <div className="space-y-12 text-left">
            {yazi.icerik.map((bolum: any, i: number) => (
              <div key={i} className="space-y-4 text-left">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight flex items-center gap-3 text-left">
                  <ChevronRight size={24} className="text-blue-600" /> {bolum.altBaslik}
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium italic border-l-8 border-blue-50 pl-8 text-left">{bolum.metin}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 md:p-12 bg-[#0f172a] rounded-[3rem] text-white relative overflow-hidden text-left">
             <h3 className="text-3xl font-black italic uppercase mb-4 tracking-tighter leading-none relative z-10">Kendi <span className="text-blue-500 underline">Fiyatını Sorgula</span></h3>
             <Link href="/" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl inline-flex items-center gap-3 mt-8 relative z-10 hover:bg-blue-500 transition-all">SORGULAMAYA BAŞLA</Link>
          </div>
        </div>
      </article>
    </main>
  );
}

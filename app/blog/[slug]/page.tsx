"use client";
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Hata yönetimi için
import { Car, ArrowLeft, Calendar, User, Clock, Share2, Tag } from 'lucide-react';

// --- BLOG İÇERİK VERİTABANI ---
// Buraya yeni yazı ekledikçe sayfa otomatik oluşur.
const blogIcerikleri: Record<string, any> = {
  "yetkili-vs-ozel-servis": {
    baslik: "YETKİLİ SERVİS Mİ ÖZEL SERVİS Mİ? 2026 KARŞILAŞTIRMASI",
    tarih: "12 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ANALİZ",
    okumaSuresi: "5 Dakika",
    gorsel: "from-slate-900 to-black",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Otomobil sahiplerinin en büyük ikilemlerinden biri: Garantisi bitmiş bir araç için yetkili servise gitmeye devam mı etmeli, yoksa sanayideki güvendiğimiz ustaya mı teslim etmeli? 2026 yılı itibarıyla artan yedek parça maliyetleri ve işçilik ücretleri bu makası iyice açtı.
      </p>
      
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">1. Fiyat Farkı Ne Kadar?</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Yaptığımız son analizlere göre, C segmenti bir aracın (Örn: Golf, Corolla, Megane) periyodik bakımı için yetkili servisler ortalama <strong>8.500 TL - 12.000 TL</strong> arasında fiyat verirken, kurumsal özel servisler aynı işlemi orijinal parçalarla <strong>4.500 TL - 6.000 TL</strong> bandında tamamlayabiliyor. Bu da %50'ye varan bir tasarruf demek.
      </p>

      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">2. Garanti Bozulur mu?</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        TSE 12047 hizmet yeterlilik belgesine sahip özel servislerde yapılan bakımlar, yasal olarak aracınızın garantisini bozmaz. Ancak pratikte "iyi niyet garantisi" gibi durumlar için markalar yetkili servis geçmişini şart koşabilir.
      </p>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-xl">
        <h4 class="font-bold text-slate-900 mb-2 uppercase">Özet Tavsiyemiz:</h4>
        <p class="text-slate-700">Aracınızın garantisi devam ediyorsa veya DSG gibi hassas şanzımanlara sahipseniz Yetkili Servis; garantiniz bittiyse ve standart bir motora sahipseniz kaliteli bir Özel Servis tercih etmek 2026 şartlarında en mantıklı yoldur.</p>
      </div>
    `
  },
  "ankara-toyota-chr-batarya-degisim-maliyeti": {
    baslik: "ANKARA TOYOTA C-HR BATARYA DEĞİŞİM MALİYETLERİ",
    tarih: "10 Şubat 2026",
    yazar: "Editör",
    kategori: "HİBRİT",
    okumaSuresi: "3 Dakika",
    gorsel: "from-slate-800 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Toyota C-HR sahiplerinin korkulu rüyası hibrit batarya ömrü, özellikle Ankara gibi sert kışların yaşandığı bölgelerde daha erken gündeme gelebiliyor. Peki 2026 yılında Ankara'da batarya değişim maliyetleri ne durumda?
      </p>

      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Yetkili Servis Fiyatları</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Ankara'daki (ALJ, Efe, Toyan) yetkili servislerinde komple batarya değişimi şu an için <strong>90.000 TL ile 110.000 TL</strong> arasında değişmektedir. Bu fiyata genellikle 10 yıl hibrit sistem garantisi dahildir.
      </p>

      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Hücre Değişimi ve Revizyon</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        İvedik ve Şaşmaz sanayisindeki hibrit uzmanları, bataryayı komple değiştirmek yerine "ölü hücreleri" yenileyerek (Revizyon) sorunu çözebiliyor. Bu işlemin maliyeti ise ortalama <strong>25.000 TL - 35.000 TL</strong> bandında.
      </p>
    `
  },
  "istanbul-clio-triger-seti-degisim-ucreti": {
    baslik: "İSTANBUL RENAULT CLIO TRİGER SETİ DEĞİŞİMİ 2026",
    tarih: "08 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "AĞIR BAKIM",
    okumaSuresi: "4 Dakika",
    gorsel: "from-[#0f172a] to-[#1e293b]",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Renault Clio 4 (1.5 dCi) ve Clio 5 (1.0 TCe) modelleri için İstanbul'da triger seti değişim ücretlerini Mais yetkili servisleri ve Maslak/Bostancı sanayi fiyatlarıyla karşılaştırdık.
      </p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
        <li><strong>Yetkili Servis:</strong> 14.500 TL - 18.000 TL (Devirdaim dahil)</li>
        <li><strong>Özel Servis (Mais Parça):</strong> 8.000 TL - 10.000 TL</li>
        <li><strong>Özel Servis (Yan Sanayi):</strong> 5.500 TL - 7.000 TL</li>
      </ul>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Triger kayışı kopması motorun tamamen yenilenmesini gerektirecek ağır hasarlara yol açar. Bu nedenle 4 yıl veya 80.000 km sınırını aşmamanızı öneriyoruz.
      </p>
    `
  },
  "izmir-vw-golf-bakim-ucretleri": {
    baslik: "İZMİR VW GOLF PERİYODİK BAKIM ÜCRETLERİ",
    tarih: "05 Şubat 2026",
    yazar: "Editör",
    kategori: "MODEL ANALİZİ",
    okumaSuresi: "3 Dakika",
    gorsel: "from-black to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        İzmir Vosmer ve Gaziemir sanayi sitesi verilerine göre VW Golf 7.5 ve 8 modelleri için 2026 yılı bakım tablosu şekillenmeye başladı.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Standart yağ bakımı (Castrol yağ + Mann filtreler) İzmir özel servislerinde <strong>4.200 TL</strong> seviyesindeyken, yetkili servislerde bu rakam <strong>9.800 TL</strong>'ye kadar çıkmaktadır.
      </p>
    `
  },
  "adana-egea-servis-maliyetleri": {
    baslik: "ADANA FIAT EGEA SERVİS MALİYETLERİ",
    tarih: "01 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "BÖLGESEL",
    okumaSuresi: "2 Dakika",
    gorsel: "from-slate-900 to-slate-800",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Türkiye'nin en çok satan aracı Fiat Egea için Adana bölgesindeki servis maliyetleri, Türkiye ortalamasının %15 altında seyrediyor.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Adana'da 1.4 Fire Egea yağ bakımı işçilik dahil <strong>2.800 TL</strong>'ye kadar bulunabiliyor. 1.3 Multijet zincir değişimi ise ortalama <strong>12.000 TL</strong> civarında.
      </p>
    `
  }
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Slug'a göre veriyi çek
  const slug = params.slug;
  const post = blogIcerikleri[slug];

  // Eğer yazı bulunamazsa basit bir hata ekranı göster
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Aradığınız içerik bulunamadı.</h2>
        <Link href="/blog" className="bg-yellow-500 text-slate-900 px-8

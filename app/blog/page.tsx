"use client";
import React from 'react';
import Link from 'next/link';
import { Car, BookOpen, ArrowRight, Calendar, User, ArrowLeft } from 'lucide-react';

// --- BLOG LİSTE VERİTABANI (15 YAZI) ---
const tumBlogYazilari = [
  // 1
  {
    slug: "yetkili-vs-ozel-servis",
    baslik: "YETKİLİ SERVİS Mİ ÖZEL SERVİS Mİ? 2026 KARŞILAŞTIRMASI",
    ozet: "2026 bakım masraflarında tasarruf etmenin yollarını, garanti durumlarını ve fiyat farklarını verilerle inceledik.",
    tarih: "12 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ANALİZ",
    renk: "from-slate-900 to-black"
  },
  // 2
  {
    slug: "ankara-toyota-chr-batarya-degisim-maliyeti",
    baslik: "ANKARA TOYOTA C-HR BATARYA DEĞİŞİM MALİYETLERİ",
    ozet: "Başkentteki hibrit sahipleri için güncel batarya revizyon ve değişim maliyetlerini servis servis listeledik.",
    tarih: "10 Şubat 2026",
    yazar: "Editör",
    kategori: "HİBRİT",
    renk: "from-emerald-900 to-slate-900"
  },
  // 3
  {
    slug: "istanbul-clio-triger-seti-degisim-ucreti",
    baslik: "İSTANBUL RENAULT CLIO TRİGER SETİ DEĞİŞİMİ 2026",
    ozet: "Renault Clio 4 ve 5 modelleri için İstanbul genelinde triger ve ağır bakım fatura analizleri.",
    tarih: "08 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "AĞIR BAKIM",
    renk: "from-yellow-600 to-slate-900"
  },
  // 4
  {
    slug: "izmir-vw-golf-bakim-ucretleri",
    baslik: "İZMİR VW GOLF PERİYODİK BAKIM ÜCRETLERİ",
    ozet: "Golf 7.5 ve 8 modelleri için İzmir sanayi ve yetkili servis fiyat karşılaştırması.",
    tarih: "05 Şubat 2026",
    yazar: "Editör",
    kategori: "MODEL ANALİZİ",
    renk: "from-blue-900 to-slate-900"
  },
  // 5
  {
    slug: "adana-egea-servis-maliyetleri",
    baslik: "ADANA FIAT EGEA SERVİS MALİYETLERİ",
    ozet: "Fiat Egea 1.4 Fire ve 1.3 Multijet için Adana bölgesindeki en uygun servis önerileri.",
    tarih: "01 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "BÖLGESEL",
    renk: "from-slate-800 to-slate-900"
  },
  // 6
  {
    slug: "chery-tiggo-bakim-araliklari-fiyatlari",
    baslik: "CHERY TIGGO 7 VE 8 BAKIM ARALIKLARI",
    ozet: "Chery sahiplerinin en çok sorduğu soru: 5.000 km bakımı zorunlu mu? Garanti bozulur mu?",
    tarih: "14 Şubat 2026",
    yazar: "Editör",
    kategori: "POPÜLER",
    renk: "from-red-900 to-black"
  },
  // 7
  {
    slug: "honda-civic-cvt-sanziman-yagi-degisimi",
    baslik: "HONDA CIVIC CVT ŞANZIMAN YAĞI DEĞİŞİMİ",
    ozet: "FC5 ve FE1 kasa Civic'lerde şanzıman ömrünü uzatmak için hangi yağ kullanılmalı? Orijinal vs Yan Sanayi.",
    tarih: "13 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ŞANZIMAN",
    renk: "from-red-800 to-slate-900"
  },
  // 8
  {
    slug: "ford-focus-dpf-iptali-temizligi",
    baslik: "FORD FOCUS DİZEL PARTİKÜL FİLTRESİ SORUNLARI",
    ozet: "Tıkanan DPF için iptal mi temizlik mi? Muayeneden geçme garantili çözümler.",
    tarih: "11 Şubat 2026",
    yazar: "Editör",
    kategori: "DİZEL",
    renk: "from-blue-800 to-black"
  },
  // 9
  {
    slug: "bmw-320i-g20-fren-balata-maliyetleri",
    baslik: "BMW 3 SERİSİ (G20) FREN BALATA MALİYETLERİ",
    ozet: "Borusan servis fiyatları ile Textar/Brembo özel servis fiyatlarını kıyasladık.",
    tarih: "09 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "PREMIUM",
    renk: "from-blue-900 to-slate-800"
  },
  // 10
  {
    slug: "peugeot-3008-adblue-arizasi-cozumu",
    baslik: "PEUGEOT 3008 ADBLUE DEPOSU ARIZASI",
    ozet: "Kronikleşen AdBlue pompa arızası için değişim maliyetleri ve iptal yöntemleri.",
    tarih: "07 Şubat 2026",
    yazar: "Editör",
    kategori: "KRONİK",
    renk: "from-indigo-900 to-black"
  },
  // 11
  {
    slug: "hyundai-i20-vs-bayon-bakim-karsilastirmasi",
    baslik: "HYUNDAI i20 VS BAYON: BAKIM MALİYETLERİ",
    ozet: "Aynı motora sahip iki aracın servis fiyatları neden farklı? SUV tarifesi gerçek mi?",
    tarih: "06 Şubat 2026",
    yazar: "Editör",
    kategori: "KARŞILAŞTIRMA",
    renk: "from-sky-800 to-slate-900"
  },
  // 12
  {
    slug: "mercedes-c200-periyodik-bakim-a-ve-b",
    baslik: "MERCEDES SERVİS A VE SERVİS B FARKI",
    ozet: "Gösterge panelindeki Servis A ve Servis B uyarıları ne anlama geliyor? Fiyat farkı ne kadar?",
    tarih: "04 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "REHBER",
    renk: "from-slate-600 to-black"
  },
  // 13
  {
    slug: "lpg-bakimi-fiyatlari-2026",
    baslik: "2026 LPG SİSTEMİ FİLTRE DEĞİŞİM FİYATLARI",
    ozet: "Prins, BRC ve Atiker sistemlerinin 10.000 km filtre bakım ücretleri.",
    tarih: "03 Şubat 2026",
    yazar: "Editör",
    kategori: "LPG",
    renk: "from-orange-800 to-slate-900"
  },
  // 14
  {
    slug: "kis-lastigi-degisim-balans-ucretleri",
    baslik: "2026 KIŞ LASTİĞİ DEĞİŞİM VE BALANS ÜCRETLERİ",
    ozet: "Lastikçiler odası tarifesi ve piyasadaki gerçek sökme takma fiyatları.",
    tarih: "02 Şubat 2026",
    yazar: "Editör",
    kategori: "MEVSİMSEL",
    renk: "from-slate-700 to-slate-900"
  },
  // 15
  {
    slug: "oto-ekspertiz-dolandiriciligi",
    baslik: "OTO EKSPERTİZ RAPORLARINDAKİ HİLELER",
    ozet: "İkinci el araç alırken dikkat! Ucuz ekspertiz paketlerinde bakılmayan hayati noktalar.",
    tarih: "30 Ocak 2026",
    yazar: "Mert Şen",
    kategori: "UYARI",
    renk: "from-red-900 to-slate-900"
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center transition-transform hover:scale-105">
                <Car size={28} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic uppercase">
                  bakımım<span className="text-yellow-500">.com</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                  Şeffaf Servis Rehberi
                </span>
              </div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={16}/> ANA SAYFAYA DÖN
              </Link>
           </div>
      </nav>

      {/* HERO HEADER */}
      <div className="bg-[#0f172a] py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 bg-yellow-500 text-slate-900 rounded-3xl mb-6 shadow-xl">
                <BookOpen size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">
                SERVİS <span className="text-yellow-500">REHBERİ</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                Otomobil bakımı, yedek parça fiyatları ve servis analizleri hakkında en güncel içerikler ve uzman görüşleri.
            </p>
        </div>
      </div>

      {/* BLOG LISTESI */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tumBlogYazilari.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group">
              <article className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 h-full flex flex-col">
                {/* GÖRSEL ALANI (Gradyan) */}
                <div className={`bg-gradient-to-br ${blog.renk} aspect-video relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                    <div className="absolute top-6 left-6">
                        <span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                            {blog.kategori}
                        </span>
                    </div>
                </div>
                
                {/* İÇERİK ALANI */}
                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-yellow-500"/> {blog.tarih}</span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase italic tracking-tight leading-none group-hover:text-yellow-600 transition-colors">
                        {blog.baslik}
                    </h2>
                    
                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-3">
                        {blog.ozet}
                    </p>
                    
                    <div className="mt-auto flex items-center text-yellow-600 font-black text-xs uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                        MAKALEYİ OKU <ArrowRight size={16} />
                    </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-16 px-8 text-center mt-20">
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="text-2xl font-black italic text-slate-800 uppercase">
              bakımım<span className="text-yellow-500">.com</span>
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              © 2026 Şeffaf Servis Rehberi
            </p>
          </div>
      </footer>
    </main>
  );
}

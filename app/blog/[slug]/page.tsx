"use client";
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Car, ArrowLeft, Calendar, User, Clock, Share2, Tag, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';

// --- 15 ADET BLOG İÇERİK VERİTABANI ---
const blogIcerikleri: Record<string, any> = {
  // 1. ANALİZ
  "yetkili-vs-ozel-servis": {
    baslik: "YETKİLİ SERVİS Mİ ÖZEL SERVİS Mİ? 2026 KARŞILAŞTIRMASI",
    tarih: "12 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ANALİZ",
    okumaSuresi: "5 Dakika",
    gorsel: "from-slate-900 to-black",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Otomobil sahiplerinin en büyük ikilemi: Garantisi bitmiş bir araç için yetkili servise gitmeye devam mı etmeli, yoksa sanayiye mi dönmeli? 2026 yılı itibarıyla artan yedek parça maliyetleri bu makası iyice açtı.
      </p>
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Fiyat Farkı Uçurumu</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        C segmenti bir araç (Golf, Corolla, Megane) için yetkili servisler ortalama <strong>8.500 TL - 12.000 TL</strong> fiyat verirken, kurumsal özel servisler aynı işlemi <strong>4.500 TL - 6.000 TL</strong> bandında tamamlıyor.
      </p>
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-xl">
        <h4 class="font-bold text-slate-900 mb-2 uppercase">Özet Tavsiye:</h4>
        <p class="text-slate-700">Garanti bittiyse ve motorunuz standartsa (Turbo/Hibrit değilse), Bosch Car Service veya Eurorepar gibi kurumsal özel servisler en mantıklı tercihtir.</p>
      </div>
    `
  },
  // 2. HİBRİT
  "ankara-toyota-chr-batarya-degisim-maliyeti": {
    baslik: "ANKARA TOYOTA C-HR BATARYA DEĞİŞİM MALİYETLERİ",
    tarih: "10 Şubat 2026",
    yazar: "Editör",
    kategori: "HİBRİT",
    okumaSuresi: "3 Dakika",
    gorsel: "from-emerald-900 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Toyota C-HR batarya ömrü dolduğunda karşılaşılan maliyetler 2026'da ne durumda? Ankara özelinde fiyatları inceledik.
      </p>
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Komple Değişim vs Revizyon</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
        <li><strong>Yetkili Servis (Sıfır Batarya):</strong> 90.000 TL - 110.000 TL (10 Yıl Garanti)</li>
        <li><strong>Özel Servis (Hücre Değişimi):</strong> 25.000 TL - 35.000 TL (1-2 Yıl Garanti)</li>
      </ul>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Aracınızı uzun süre kullanacaksanız sıfır batarya, satmayı düşünüyorsanız revizyon daha mantıklı bir seçenektir.
      </p>
    `
  },
  // 3. AĞIR BAKIM
  "istanbul-clio-triger-seti-degisim-ucreti": {
    baslik: "İSTANBUL RENAULT CLIO TRİGER SETİ DEĞİŞİMİ 2026",
    tarih: "08 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "AĞIR BAKIM",
    okumaSuresi: "4 Dakika",
    gorsel: "from-yellow-600 to-slate-900", // Renault Sarısı
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Renault Clio 4 (1.5 dCi) ve Clio 5 (1.0 TCe) triger seti değişim ücretleri. Mais servisi ile sanayi arasındaki farka inanamayacaksınız.
      </p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
        <li><strong>Yetkili Servis:</strong> 14.500 TL - 18.000 TL</li>
        <li><strong>Sanayi (Mais Parça):</strong> 8.000 TL - 10.000 TL</li>
        <li><strong>Sanayi (Yan Sanayi):</strong> 5.500 TL - 7.000 TL</li>
      </ul>
      <div class="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-xl">
        <h4 class="font-bold text-red-900 mb-2 uppercase">Dikkat:</h4>
        <p class="text-red-700">Triger setinde asla "Çin malı" yan sanayi ürün kullanmayın. Kopması durumunda motor rektifiyesi 100.000 TL'yi bulabilir.</p>
      </div>
    `
  },
  // 4. MODEL ANALİZİ
  "izmir-vw-golf-bakim-ucretleri": {
    baslik: "İZMİR VW GOLF PERİYODİK BAKIM ÜCRETLERİ",
    tarih: "05 Şubat 2026",
    yazar: "Editör",
    kategori: "MODEL ANALİZİ",
    okumaSuresi: "3 Dakika",
    gorsel: "from-blue-900 to-slate-900", // VW Mavisi
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Golf 7.5 ve Golf 8 sahipleri için İzmir (Gaziemir/Bornova) servis fiyatları.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Standart yağ bakımı (Castrol yağ + Mann filtreler) İzmir özel servislerinde <strong>4.200 TL</strong> seviyesindeyken, Vosmer gibi yetkili servislerde bu rakam <strong>9.800 TL</strong>'ye kadar çıkmaktadır.
      </p>
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">DSG Bakımı</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        DSG mekatronik tüp değişimi ve şanzıman yağı değişimi için İzmir sanayisinde ortalama fiyat <strong>7.000 TL</strong> civarındadır.
      </p>
    `
  },
  // 5. BÖLGESEL
  "adana-egea-servis-maliyetleri": {
    baslik: "ADANA FIAT EGEA SERVİS MALİYETLERİ",
    tarih: "01 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "BÖLGESEL",
    okumaSuresi: "2 Dakika",
    gorsel: "from-slate-800 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Adana Metal Sanayi Sitesi'nde Fiat Egea bakım maliyetleri Türkiye ortalamasının %15 altındadır.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        1.3 Multijet zincir değişimi Adana'da işçilik dahil <strong>12.000 TL</strong>'ye yapılabilmektedir. Yetkili serviste bu işlem 25.000 TL'yi bulur.
      </p>
    `
  },
  // 6. CHERY (TREND)
  "chery-tiggo-bakim-araliklari-fiyatlari": {
    baslik: "CHERY TIGGO 7 VE 8 BAKIM ARALIKLARI VE FİYATLARI",
    tarih: "14 Şubat 2026",
    yazar: "Editör",
    kategori: "POPÜLER",
    okumaSuresi: "4 Dakika",
    gorsel: "from-red-900 to-black", // Chery Kırmızısı
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Türkiye pazarını domine eden Chery modellerinde en büyük kafa karışıklığı: Bakım 5.000 km'de mi 15.000 km'de mi?
      </p>
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">5.000 KM Bakımı Şart mı?</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Chery Türkiye, ilk rodaj bakımını 5.000 km'de ücretsiz veya çok düşük bir ücretle (sadece yağ parası) yapmaktadır. Sonraki bakımlar 15.000 km veya 1 yıldır.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        2026 yılı yetkili servis periyodik bakım ücreti ortalama <strong>7.500 TL</strong>'dir. Garantinin bozulmaması için (5 yıl/150.000 km) yetkili servise gitmek şu an için elzem görünüyor.
      </p>
    `
  },
  // 7. HONDA (TEKNİK)
  "honda-civic-cvt-sanziman-yagi-degisimi": {
    baslik: "HONDA CIVIC CVT ŞANZIMAN YAĞI NE ZAMAN DEĞİŞMELİ?",
    tarih: "13 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ŞANZIMAN",
    okumaSuresi: "4 Dakika",
    gorsel: "from-red-800 to-slate-900", // Honda Kırmızısı
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Honda Civic FC5 ve FE1 kasalardaki CVT şanzıman, uzun ömürlü olması için düzenli yağ değişimine muhtaçtır. Yanlış yağ kullanımı şanzımanı 10.000 km'de bitirebilir.
      </p>
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Hangi Yağ Kullanılmalı?</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Kesinlikle <strong>Honda HCF-2</strong> onaylı yağ kullanılmalıdır. Motul veya Eneos'un CVT yağları da uyumludur ancak servis orijinal teneke yağı önerir.
      </p>
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-xl">
        <h4 class="font-bold text-slate-900 mb-2 uppercase">Maliyet:</h4>
        <p class="text-slate-700">Yetkili serviste değişim 6.000 TL civarındayken, Honda özel servislerinde 3.500 TL'ye orijinal yağ ile değişim yapılmaktadır. Değişim periyodu: 40.000 km veya 2 yıldır.</p>
      </div>
    `
  },
  // 8. FORD (DİZEL PARTİKÜL)
  "ford-focus-dpf-iptali-temizligi": {
    baslik: "FORD FOCUS DİZEL PARTİKÜL FİLTRESİ (DPF) SORUNLARI",
    tarih: "11 Şubat 2026",
    yazar: "Editör",
    kategori: "DİZEL",
    okumaSuresi: "3 Dakika",
    gorsel: "from-blue-800 to-black", // Ford Mavisi
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Ford Focus 1.5 TDCi motorlarda sıkça görülen "Motor Arızası - Servise Gidin" uyarısının baş şüphelisi DPF tıkanıklığıdır.
      </p>
      <h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Temizlik mi İptal mi?</h3>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        DPF iptali muayeneden geçmez ve çevreye zararlıdır. Bunun yerine <strong>ilaçlı makine temizliği</strong> (Ortalama 2.500 TL) yaptırmak %90 oranında sorunu çözer.
      </p>
    `
  },
  // 9. BMW (PREMIUM)
  "bmw-320i-g20-fren-balata-maliyetleri": {
    baslik: "BMW 3 SERİSİ (G20) FREN DİSK VE BALATA MALİYETLERİ",
    tarih: "09 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "PREMIUM",
    okumaSuresi: "3 Dakika",
    gorsel: "from-blue-900 to-slate-800", // BMW Mavisi
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        BMW sahiplerinin servis ekranında "Fren Sistemini Kontrol Edin" uyarısını gördüğünde karşılaşacağı fatura bedelleri.
      </p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
        <li><strong>Borusan / Kosifler (Yetkili):</strong> Ön-Arka Balata + Fişler: 22.000 TL</li>
        <li><strong>Özel Servis (Textar/Brembo):</strong> Ön-Arka Balata + Fişler: 9.500 TL</li>
      </ul>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        BMW'nin orijinal balata üreticisi genellikle Textar veya Jurid'dir. Özel serviste bu markaları taktırmak kalite kaybı yaşatmaz.
      </p>
    `
  },
  // 10. PEUGEOT (KRONİK)
  "peugeot-3008-adblue-arizasi-cozumu": {
    baslik: "PEUGEOT 3008 ADBLUE DEPOSU ARIZASI VE DEĞİŞİMİ",
    tarih: "07 Şubat 2026",
    yazar: "Editör",
    kategori: "KRONİK",
    okumaSuresi: "4 Dakika",
    gorsel: "from-indigo-900 to-black",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Peugeot ve Citroen grubu (PSA) araçların korkulu rüyası: "AdBlue Arızası - Motoru Durdurun" uyarısı.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Genellikle depo içindeki pompa veya sensör bozulur. Depo komple değişir. Yetkili serviste bu işlem <strong>35.000 TL</strong> civarındayken, yazılım ile AdBlue iptali (önerilmez ama yapılır) 5.000 TL civarındadır.
      </p>
    `
  },
  // 11. HYUNDAI (KARŞILAŞTIRMA)
  "hyundai-i20-vs-bayon-bakim-karsilastirmasi": {
    baslik: "HYUNDAI i20 VS BAYON: BAKIM MALİYETLERİ AYNI MI?",
    tarih: "06 Şubat 2026",
    yazar: "Editör",
    kategori: "KARŞILAŞTIRMA",
    okumaSuresi: "3 Dakika",
    gorsel: "from-sky-800 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Aynı motor ve altyapıyı kullanan i20 ve Bayon arasında servis fiyat farkı var mı?
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Şaşırtıcı bir şekilde yetkili servislerde "SUV tarifesi" uygulanarak Bayon bakımları i20'ye göre <strong>%15 daha pahalı</strong> fiyatlandırılmaktadır. 1.4 MPI motor için i20 bakımı 6.000 TL iken, Bayon için 7.000 TL talep edilmektedir.
      </p>
    `
  },
  // 12. MERCEDES (EĞİTİM)
  "mercedes-c200-periyodik-bakim-a-ve-b": {
    baslik: "MERCEDES SERVİS A VE SERVİS B BAKIMI NEDİR?",
    tarih: "04 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "REHBER",
    okumaSuresi: "5 Dakika",
    gorsel: "from-slate-600 to-black", // Mercedes Gümüşü/Siyahı
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Mercedes araçlarda gösterge panelinde çıkan "Servis A" ve "Servis B" uyarılarının anlamı ve fiyat farkları.
      </p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
        <li><strong>Servis A (Küçük Bakım):</strong> Yağ, Yağ Filtresi, Genel Kontrol. (Ortalama 14.000 TL)</li>
        <li><strong>Servis B (Büyük Bakım):</strong> + Hava Filtresi, Polen Filtresi, Fren Hidroliği. (Ortalama 20.000 TL)</li>
      </ul>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Özel servislerde (Mengerler çıkışlı ustalar vb.) bu rakamlar yarı yarıya düşmektedir.
      </p>
    `
  },
  // 13. LPG
  "lpg-bakimi-fiyatlari-2026": {
    baslik: "2026 LPG SİSTEMİ BAKIM VE FİLTRE DEĞİŞİM FİYATLARI",
    tarih: "03 Şubat 2026",
    yazar: "Editör",
    kategori: "LPG",
    okumaSuresi: "2 Dakika",
    gorsel: "from-orange-800 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Prins, BRC, Atiker gibi markaların 10.000 km filtre bakım ücretleri.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Yerli sistemlerde (Atiker) filtre değişimi <strong>400-600 TL</strong> arasındayken, ithal sistemlerde (Prins) bu rakam <strong>1.500 TL</strong>'yi bulabilmektedir. Yakıt tasarrufu için filtre değişimi şarttır.
      </p>
    `
  },
  // 14. LASTİK
  "kis-lastigi-degisim-balans-ucretleri": {
    baslik: "2026 KIŞ LASTİĞİ DEĞİŞİM VE BALANS ÜCRETLERİ",
    tarih: "02 Şubat 2026",
    yazar: "Editör",
    kategori: "MEVSİMSEL",
    okumaSuresi: "2 Dakika",
    gorsel: "from-slate-700 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Lastikçiler Odası tarifesi ve piyasa gerçekleri. 4 lastik sökme takma ve balans ücreti ne kadar?
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        15-16 inç jantlar için ortalama değişim ücreti <strong>800 TL - 1.000 TL</strong>, 18 inç ve üzeri jantlar için <strong>1.500 TL</strong> civarındadır. Lastik oteli ücreti ise sezonluk 1.500 TL'dir.
      </p>
    `
  },
  // 15. EKSPERTİZ
  "oto-ekspertiz-dolandiriciligi": {
    baslik: "OTO EKSPERTİZ RAPORLARINDAKİ HİLELERE DİKKAT!",
    tarih: "30 Ocak 2026",
    yazar: "Mert Şen",
    kategori: "UYARI",
    okumaSuresi: "6 Dakika",
    gorsel: "from-red-900 to-slate-900",
    icerik: `
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        İkinci el araç alırken "Airbag Kontrolü" yaptırmamak size pahalıya patlayabilir. Ekspertiz paketlerindeki tuzaklar.
      </p>
      <p class="mb-6 text-lg leading-relaxed text-slate-700">
        Ucuz (Bronz/Gümüş) paketlerde genellikle OBD beyin kontrolü ve Airbag sökme/takma kontrolü <strong>yapılmaz</strong>. Sadece kaporta boyaya bakıp aracı alırsanız, direnç atılmış patlak airbagli bir araç sahibi olabilirsiniz. Mutlaka "Full Paket" veya "Airbag Garantili" paket seçin.
      </p>
    `
  }
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Slug'a göre veriyi çek
  const slug = params.slug;
  const post = blogIcerikleri[slug];

  // Eğer yazı bulunamazsa 404 sayfası
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Aradığınız içerik bulunamadı.</h2>
        <Link href="/blog" className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">
          Blog Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
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
              <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={16}/> LİSTEYE DÖN
              </Link>
           </div>
      </nav>

      {/* HERO SECTION - KONUYA ÖZEL RENK */}
      <div className={`relative py-32 px-6 overflow-hidden bg-gradient-to-br ${post.gorsel}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
            <span className="bg-yellow-500 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">
                {post.kategori}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase italic tracking-tighter mb-8">
                {post.baslik}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-slate-300 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-yellow-500"/> {post.tarih}
                </div>
                <div className="flex items-center gap-2">
                    <User size={16} className="text-yellow-500"/> {post.yazar}
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-yellow-500"/> {post.okumaSuresi} Okuma
                </div>
            </div>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <article className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100">
            {/* HTML İçeriği */}
            <div 
                className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-yellow-600 hover:prose-a:text-yellow-500"
                dangerouslySetInnerHTML={{ __html: post.icerik }} 
            />
            
            {/* PAYLAŞIM ALANI */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14}/> {post.kategori}
                </span>
                <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all">
                    <Share2 size={14}/> Paylaş
                </button>
            </div>
        </div>
      </article>

      {/* OKUMAYA DEVAM ET */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-8">Diğer Yazılara Göz Atın</h3>
        <div className="flex justify-center">
            <Link href="/blog" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl">
                Tüm Blogları Gör
            </Link>
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

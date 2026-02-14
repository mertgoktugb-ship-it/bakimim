"use client";
import React from 'react';
import Link from 'next/link';
import { Car, ArrowLeft, Calendar, User, Clock, Share2, Tag } from 'lucide-react';

const blogIcerikleri: Record<string, any> = {
  "yetkili-vs-ozel-servis": {
    baslik: "YETKİLİ SERVİS Mİ ÖZEL SERVİS Mİ? 2026 KARŞILAŞTIRMASI",
    tarih: "12 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ANALİZ",
    okumaSuresi: "5 Dakika",
    gorsel: "from-slate-900 to-black",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Otomobil sahiplerinin en büyük ikilemi: Garantisi bitmiş bir araç için yetkili servise gitmeye devam mı etmeli? 2026 yılı itibarıyla artan maliyetler bu makası iyice açtı.</p><h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Fiyat Farkı Uçurumu</h3><p class="mb-6 text-lg leading-relaxed text-slate-700">C segmenti bir araç için yetkili servisler ortalama <strong>8.500 - 12.000 TL</strong> fiyat verirken, kurumsal özel servisler <strong>4.500 - 6.000 TL</strong> bandında tamamlıyor.</p><div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-xl"><h4 class="font-bold text-slate-900 mb-2 uppercase">Özet Tavsiye:</h4><p class="text-slate-700">Garanti bittiyse ve motorunuz standartsa, Bosch Car Service veya Eurorepar gibi kurumsal özel servisler en mantıklı tercihtir.</p></div>`
  },
  "ankara-toyota-chr-batarya-degisim-maliyeti": {
    baslik: "ANKARA TOYOTA C-HR BATARYA DEĞİŞİM MALİYETLERİ",
    tarih: "10 Şubat 2026",
    yazar: "Editör",
    kategori: "HİBRİT",
    okumaSuresi: "3 Dakika",
    gorsel: "from-emerald-900 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Toyota C-HR batarya ömrü dolduğunda karşılaşılan maliyetler 2026'da ne durumda?</p><h3 class="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase italic">Fiyatlar</h3><ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700"><li><strong>Yetkili Servis:</strong> 90.000 TL - 110.000 TL</li><li><strong>Özel Servis (Revizyon):</strong> 25.000 TL - 35.000 TL</li></ul>`
  },
  "istanbul-clio-triger-seti-degisim-ucreti": {
    baslik: "İSTANBUL RENAULT CLIO TRİGER SETİ DEĞİŞİMİ 2026",
    tarih: "08 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "AĞIR BAKIM",
    okumaSuresi: "4 Dakika",
    gorsel: "from-yellow-600 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Clio 4 (1.5 dCi) ve Clio 5 (1.0 TCe) triger seti değişim ücretleri.</p><ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700"><li><strong>Yetkili Servis:</strong> 14.500 TL - 18.000 TL</li><li><strong>Sanayi (Mais):</strong> 8.000 TL - 10.000 TL</li></ul><div class="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-xl"><h4 class="font-bold text-red-900 mb-2 uppercase">Dikkat:</h4><p class="text-red-700">Asla yan sanayi triger kullanmayın.</p></div>`
  },
  "izmir-vw-golf-bakim-ucretleri": {
    baslik: "İZMİR VW GOLF PERİYODİK BAKIM ÜCRETLERİ",
    tarih: "05 Şubat 2026",
    yazar: "Editör",
    kategori: "MODEL ANALİZİ",
    okumaSuresi: "3 Dakika",
    gorsel: "from-blue-900 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Golf 7.5 ve 8 sahipleri için İzmir servis fiyatları.</p><p class="mb-6 text-lg leading-relaxed text-slate-700">Standart yağ bakımı İzmir özel servislerinde <strong>4.200 TL</strong> iken, yetkili servislerde <strong>9.800 TL</strong> civarındadır.</p>`
  },
  "adana-egea-servis-maliyetleri": {
    baslik: "ADANA FIAT EGEA SERVİS MALİYETLERİ",
    tarih: "01 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "BÖLGESEL",
    okumaSuresi: "2 Dakika",
    gorsel: "from-slate-800 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Adana Metal Sanayi Sitesi'nde Fiat Egea bakım maliyetleri.</p><p class="mb-6 text-lg leading-relaxed text-slate-700">1.3 Multijet zincir değişimi Adana'da <strong>12.000 TL</strong>'ye yapılabilmektedir.</p>`
  },
  "chery-tiggo-bakim-araliklari-fiyatlari": {
    baslik: "CHERY TIGGO 7 VE 8 BAKIM ARALIKLARI VE FİYATLARI",
    tarih: "14 Şubat 2026",
    yazar: "Editör",
    kategori: "POPÜLER",
    okumaSuresi: "4 Dakika",
    gorsel: "from-red-900 to-black",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Chery modellerinde bakım 5.000 km'de mi 15.000 km'de mi?</p><p class="mb-6 text-lg leading-relaxed text-slate-700">İlk bakım 5.000 km'de, sonraki bakımlar 15.000 km veya 1 yıldır. Yetkili servis ücreti ortalama <strong>7.500 TL</strong>'dir.</p>`
  },
  "honda-civic-cvt-sanziman-yagi-degisimi": {
    baslik: "HONDA CIVIC CVT ŞANZIMAN YAĞI NE ZAMAN DEĞİŞMELİ?",
    tarih: "13 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "ŞANZIMAN",
    okumaSuresi: "4 Dakika",
    gorsel: "from-red-800 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Honda Civic CVT şanzıman için kesinlikle <strong>Honda HCF-2</strong> onaylı yağ kullanılmalıdır.</p><div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 rounded-r-xl"><h4 class="font-bold text-slate-900 mb-2 uppercase">Maliyet:</h4><p class="text-slate-700">Özel servislerde 3.500 TL'ye orijinal yağ ile değişim yapılmaktadır.</p></div>`
  },
  "ford-focus-dpf-iptali-temizligi": {
    baslik: "FORD FOCUS DİZEL PARTİKÜL FİLTRESİ (DPF) SORUNLARI",
    tarih: "11 Şubat 2026",
    yazar: "Editör",
    kategori: "DİZEL",
    okumaSuresi: "3 Dakika",
    gorsel: "from-blue-800 to-black",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Ford Focus 1.5 TDCi motorlarda DPF tıkanıklığı. İptal yerine <strong>ilaçlı makine temizliği</strong> (2.500 TL) önerilir.</p>`
  },
  "bmw-320i-g20-fren-balata-maliyetleri": {
    baslik: "BMW 3 SERİSİ (G20) FREN DİSK VE BALATA MALİYETLERİ",
    tarih: "09 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "PREMIUM",
    okumaSuresi: "3 Dakika",
    gorsel: "from-blue-900 to-slate-800",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">BMW G20 fren maliyetleri.</p><ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700"><li><strong>Borusan:</strong> 22.000 TL</li><li><strong>Özel Servis (Textar):</strong> 9.500 TL</li></ul>`
  },
  "peugeot-3008-adblue-arizasi-cozumu": {
    baslik: "PEUGEOT 3008 ADBLUE DEPOSU ARIZASI VE DEĞİŞİMİ",
    tarih: "07 Şubat 2026",
    yazar: "Editör",
    kategori: "KRONİK",
    okumaSuresi: "4 Dakika",
    gorsel: "from-indigo-900 to-black",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Peugeot AdBlue deposu kronik arızası. Yetkili serviste değişim <strong>35.000 TL</strong> civarındadır.</p>`
  },
  "hyundai-i20-vs-bayon-bakim-karsilastirmasi": {
    baslik: "HYUNDAI i20 VS BAYON: BAKIM MALİYETLERİ AYNI MI?",
    tarih: "06 Şubat 2026",
    yazar: "Editör",
    kategori: "KARŞILAŞTIRMA",
    okumaSuresi: "3 Dakika",
    gorsel: "from-sky-800 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Bayon bakımları i20'ye göre <strong>%15 daha pahalı</strong> fiyatlandırılmaktadır.</p>`
  },
  "mercedes-c200-periyodik-bakim-a-ve-b": {
    baslik: "MERCEDES SERVİS A VE SERVİS B BAKIMI NEDİR?",
    tarih: "04 Şubat 2026",
    yazar: "Mert Şen",
    kategori: "REHBER",
    okumaSuresi: "5 Dakika",
    gorsel: "from-slate-600 to-black",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Servis A (Küçük Bakım): ~14.000 TL. Servis B (Büyük Bakım): ~20.000 TL.</p>`
  },
  "lpg-bakimi-fiyatlari-2026": {
    baslik: "2026 LPG SİSTEMİ BAKIM VE FİLTRE DEĞİŞİM FİYATLARI",
    tarih: "03 Şubat 2026",
    yazar: "Editör",
    kategori: "LPG",
    okumaSuresi: "2 Dakika",
    gorsel: "from-orange-800 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Yerli sistemlerde filtre değişimi <strong>400-600 TL</strong>, ithal sistemlerde <strong>1.500 TL</strong>'yi bulabilmektedir.</p>`
  },
  "kis-lastigi-degisim-balans-ucretleri": {
    baslik: "2026 KIŞ LASTİĞİ DEĞİŞİM VE BALANS ÜCRETLERİ",
    tarih: "02 Şubat 2026",
    yazar: "Editör",
    kategori: "MEVSİMSEL",
    okumaSuresi: "2 Dakika",
    gorsel: "from-slate-700 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">15-16 inç jantlar için değişim <strong>800 TL - 1.000 TL</strong> civarındadır.</p>`
  },
  "oto-ekspertiz-dolandiriciligi": {
    baslik: "OTO EKSPERTİZ RAPORLARINDAKİ HİLELERE DİKKAT!",
    tarih: "30 Ocak 2026",
    yazar: "Mert Şen",
    kategori: "UYARI",
    okumaSuresi: "6 Dakika",
    gorsel: "from-red-900 to-slate-900",
    icerik: `<p class="mb-6 text-lg leading-relaxed text-slate-700">Ucuz paketlerde Airbag kontrolü yapılmaz. Mutlaka Airbag Garantili paket seçin.</p>`
  }
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  // Params'ı await ile çözümlüyoruz (Next.js 16 Fix)
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const post = blogIcerikleri[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Aradığınız içerik bulunamadı.</h2>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
           Hata Kodu: SLUG_NOT_FOUND (Aranan: {slug || 'Tanımsız'})
        </div>
        <Link href="/blog" className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">
          Blog Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center transition-transform hover:scale-105"><Car size={28} strokeWidth={2.5} /></div>
              <div className="flex flex-col leading-tight"><span className="text-3xl font-black text-slate-800 italic uppercase">bakımım<span className="text-yellow-500">.com</span></span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Şeffaf Servis Rehberi</span></div>
           </Link>
           <div className="flex items-center gap-4">
              <Link href="/blog" className="text-[10px] font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest flex items-center gap-2"><ArrowLeft size={16}/> LİSTEYE DÖN</Link>
           </div>
      </nav>

      <div className={`relative py-32 px-6 overflow-hidden bg-gradient-to-br ${post.gorsel}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
            <span className="bg-yellow-500 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest shadow-lg">{post.kategori}</span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase italic tracking-tighter mb-8">{post.baslik}</h1>
            <div className="flex flex-wrap justify-center items-center gap-6 text-slate-300 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2"><Calendar size={16} className="text-yellow-500"/> {post.tarih}</div>
                <div className="flex items-center gap-2"><User size={16} className="text-yellow-500"/> {post.yazar}</div>
                <div className="flex items-center gap-2"><Clock size={16} className="text-yellow-500"/> {post.okumaSuresi} Okuma</div>
            </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-yellow-600 hover:prose-a:text-yellow-500" dangerouslySetInnerHTML={{ __html: post.icerik }} />
            <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag size={14}/> {post.kategori}</span>
                <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all"><Share2 size={14}/> Paylaş</button>
            </div>
        </div>
      </article>

      <footer className="bg-white border-t border-slate-200 py-16 px-8 text-center mt-20">
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="text-2xl font-black italic text-slate-800 uppercase">bakımım<span className="text-yellow-500">.com</span></span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Şeffaf Servis Rehberi</p>
          </div>
      </footer>
    </main>
  );
}

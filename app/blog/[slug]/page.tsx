"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car, ArrowLeft, Calendar, User, Share2, BookOpen } from 'lucide-react';

// GELECEK VİZYONU: Buradaki veriler ileride bir veritabanından (Supabase vb.) gelecek.
const blogIcerikleri: any = {
  "yetkili-vs-ozel-servis": {
    kategori: "Analiz",
    baslik: "Yetkili Servis mi Özel Servis mi? 2026 Fiyat Karşılaştırması",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Araç sahiplerinin en büyük ikilemi: Garantiyi bozmamak için fahiş fiyatlar ödemek mi, yoksa güvenilir bir özel serviste tasarruf etmek mi? bakımım.com verilerine göre, bir Toyota C-HR periyodik bakımı yetkili serviste 45.390 TL'ye kadar çıkarken, özel servislerde aynı işlem 9.496 TL bandında yapılabiliyor.",
      "Peki bu devasa fark nereden kaynaklanıyor? İlk sebep işçilik saat ücretleri. Yetkili servislerde standart olan bu ücret, özel servislerde çok daha esnek olabiliyor. İkinci büyük fark ise parça tercihi. Orijinal logolu parçalar ile aynı fabrikadan çıkan ama üzerinde marka logosu olmayan OEM (Muadil) parçalar arasında %50'ye varan fiyat farkı mevcut.",
      "Tavsiyemiz: Eğer aracınızın garantisi devam ediyorsa yetkili servisten vazgeçmeyin. Ancak garantisi bitmiş araçlar için TSE onaylı özel servisler, bütçenizi korumanın en akıllı yoludur."
    ]
  },
  "bakim-faturasi-dusurme": {
    kategori: "İpucu",
    baslik: "Bakım Faturasını Düşürmenin 5 Yolu: Servise Gitmeden Önce Okuyun!",
    tarih: "13 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Servis faturanızdaki 'gereksiz' kalemleri nasıl elersiniz? İşte tasarruf tüyoları:",
      "1. Silecek suyunuzu gitmeden önce kendiniz doldurun. Servisler bu basit işlem için faturaya ciddi rakamlar ekleyebiliyor.",
      "2. Filtreleri kontrol edin. Polen filtresi gibi parçaları kendiniz değiştirmek hem kolaydır hem de maliyeti %80 düşürür.",
      "3. Sadece gerekli görülen işlemlere onay verin. Servis danışmanının 'şunu da yapalım mı?' dediği her kalem için aciliyetini sorgulayın.",
      "4. Parça fiyatlarını internetten karşılaştırın. 5. Bakım kampanya dönemlerini takip edin."
    ]
  },
  "2026-toyota-c-hr-bakim-maliyeti": {
    kategori: "Model Analizi",
    baslik: "Toyota C-HR Periyodik Bakım Fiyatları 2026: Güncel Rehber",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Toyota C-HR kullanıcıları için yetkili ve özel servis arasındaki makas 2026 yılında daha da açıldı. Özellikle hibrit modellerde sistem kontrolü (Hybrid Health Check) için yetkili servislerin sunduğu uzmanlık hala vazgeçilmez bir artı.",
      "Ancak 60.000 km sonrası ağır bakımlarda fren hidroliği, şanzıman yağı ve buji değişimleri devreye girdiğinde parça maliyetleri ciddi oranda artıyor. Bu aşamada kullanıcılar, hibrit sistem uzmanlığı olan TSE onaylı özel servisleri tercih ederek 30-40 bin TL'lik faturaları 12-15 bin TL bandına çekebiliyor.",
      "Unutmayın: Hibrit araçlarda yağ seçimi (genellikle 0W-16 veya 0W-20) motor ömrü için kritiktir. Özel servis tercih etseniz bile yağın kalitesinden asla ödün vermeyin."
    ]
  },
  "periyodik-bakim-neleri-kapsar": {
    kategori: "Rehber",
    baslik: "Standart Periyodik Bakımda Neler Değişir? Faturadaki Kalemlerin Anlamı",
    tarih: "14 Şubat 2026",
    yazar: "Mert Şen",
    icerik: [
      "Motor yağı, yağ filtresi ve hava filtresi her periyodik bakımın 'kutsal üçlüsüdür'. Bu parçalar değişmeden bir bakıma 'tamam' denilemez.",
      "Faturanızda gördüğünüz 'Karter Tapası Pulu' gibi küçük kalemler aslında yağ sızıntısını önlemek için hayati önem taşır. Öte yandan, 'Balata Temizleme Spreyi' veya 'Cam Suyu Katkısı' gibi kalemler faturayı şişiren ufak detaylardır ve çoğu zaman opsiyoneldir.",
      "İşçilik ücreti ise genellikle markanın belirlediği 'standart iş saati' üzerinden hesaplanır. Lüks segment markalarda işçilik saati 2.500 TL üzerindeyken, ekonomik segmentte bu rakam 1.200 TL civarındadır."
    ]
  }
};

export default function BlogDetay() {
  const params = useParams();
  const slug = params?.slug as string;
  const yazi = blogIcerikleri[slug];

  // Eğer URL'deki slug yukarıdaki listede yoksa 404 gösteriyoruz
  if (!yazi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#F8FAFC]">
        <h1 className="text-4xl font-black text-slate-800 mb-4 uppercase italic tracking-tighter">İçerik Bulunamadı</h1>
        <p className="text-slate-500 mb-8 font-bold uppercase text-xs tracking-widest">Aradığınız makale yayından kaldırılmış veya taşınmış olabilir.</p>
        <Link href="/blog" className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Blog Listesine Dön</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 text-left">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Car size={28} strokeWidth={2.5} className="text-blue-400" />
              </div>
              <span className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">bakımım<span className="text-blue-700">.com</span></span>
           </Link>
           <Link href="/blog" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-700 uppercase tracking-widest transition-all">
             <ArrowLeft size={16}/> Geri Dön
           </Link>
      </nav>

      {/* ARTICLE HEADER */}
      <article className="max-w-3xl mx-auto px-6 py-20 text-left">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={16} className="text-blue-600" />
          <span className="bg-blue-100 text-blue-700 text-[11px] font-black px-4 py-2 rounded-xl uppercase tracking-widest inline-block">{yazi.kategori}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-[0.9] mb-12 text-left">{yazi.baslik}</h1>
        
        <div className="flex items-center gap-6 mb-16 border-y border-slate-100 py-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Calendar size={16}/> {yazi.tarih}</div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><User size={16}/> {yazi.yazar}</div>
        </div>

        {/* CONTENT */}
        <div className="space-y-10 text-left">
          {yazi.icerik.map((p: string, i: number) => (
            <p key={i} className="text-xl text-slate-600 leading-relaxed font-medium italic border-l-4 border-slate-100 pl-6">{p}</p>
          ))}
        </div>

        {/* SHARE SECTION */}
        <div className="mt-20 p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-left">
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Faydalı mı?</p>
             <p className="text-lg font-black text-slate-800 italic uppercase">Bu rehberi paylaşın</p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-[#1E293B] text-white p-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center"><Share2 size={24}/></button>
              <button className="flex-1 md:flex-none bg-emerald-500 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">WhatsApp</button>
           </div>
        </div>
      </article>
    </main>
  );
}

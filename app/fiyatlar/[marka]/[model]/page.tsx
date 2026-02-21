import { supabase } from '../../../../lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, MapPin } from 'lucide-react';

// 1. SEO Ayarları - Google botları bu kısmı okur
export async function generateMetadata({ params }: { params: Promise<{ marka: string, model: string }> }): Promise<Metadata> {
  const { marka, model } = await params;
  const markaUpper = marka.toUpperCase();
  const modelUpper = model.toUpperCase();
  
  return {
    title: `${markaUpper} ${modelUpper} Bakım Fiyatları 2026 | bakimim.com`,
    description: `${markaUpper} ${modelUpper} periyodik bakım maliyetleri, yetkili ve özel servis fiyat karşılaştırmaları.`,
  }
}

// 2. Sayfa İçeriği - Kullanıcı bu kısmı görür
export default async function ModelDetaySayfasi({ params }: { params: Promise<{ marka: string, model: string }> }) {
  const { marka, model } = await params;

  // Veritabanından sadece bu araca özel onaylı verileri çekiyoruz
  const { data: kayitlar } = await supabase
    .from('bakim_kayitlari')
    .select('*')
    .eq('onayli_mi', true)
    .ilike('marka', marka)
    .ilike('model', model)
    .order('fiyat', { ascending: true });

  const getMedian = (arr: any[]) => {
    if (!arr || arr.length === 0) return 0;
    const values = arr.map(i => i.fiyat || 0).sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
  };

  const medYetkili = Math.round(getMedian(kayitlar?.filter(i => i.yetkili_mi) || []));
  const medOzel = Math.round(getMedian(kayitlar?.filter(i => !i.yetkili_mi) || []));

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 text-left font-sans">
      {/* Sayfa Üstü (Header) */}
      <div className="bg-[#0f172a] text-white py-12 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 transition-colors font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-yellow-500">
              <Car size={32} />
              <span className="font-black italic uppercase tracking-widest text-sm">{marka} Veri Merkezi</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
              {marka} <span className="text-yellow-500">{model}</span><br/>BAKIM MALİYETLERİ
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-4 flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" /> TOPLAM {kayitlar?.length || 0} GÜNCEL KAYIT BULUNDU
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Özet İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-10 mb-16 relative z-20">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center hover:border-yellow-500 transition-all">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-yellow-600"/> Yetkili Servis Ortalaması
            </span>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              {medYetkili > 0 ? `${medYetkili.toLocaleString('tr-TR')} TL` : "Veri Bekleniyor"}
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center hover:border-indigo-500 transition-all">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <BadgePercent size={18}/> Özel Servis Ortalaması
            </span>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              {medOzel > 0 ? `${medOzel.toLocaleString('tr-TR')} TL` : "Veri Bekleniyor"}
            </p>
          </div>
        </div>

        {/* Detaylı Kayıt Listesi */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-800 flex items-center gap-3 mb-8">
            <div className="w-8 h-1 bg-yellow-500 rounded-full"></div>
            Kullanıcı Bildirimleri
          </h2>
          
          {kayitlar && kayitlar.length > 0 ? kayitlar.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`mt-1 p-3 rounded-2xl ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-slate-900 text-white'}`}>
                    <Car size={24} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.yetkili_mi ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.tarih?.split('-').reverse().join('.')}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 uppercase italic tracking-tight">{item.bakim_turu}</p>
                    <p className="text-sm font-bold text-slate-500">{item.km?.toLocaleString('tr-TR')} KM • {item.yakit_motor || 'Bilinmiyor'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Şehir</span>
                    <div className="flex items-center gap-1 font-bold text-slate-700 uppercase">
                      <MapPin size={14} className="text-slate-400" />
                      {item.sehir}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam Tutar</span>
                    <span className="text-3xl font-black text-yellow-600 tracking-tighter">{item.fiyat?.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>
              </div>

              {(item.fatura_url || item.notlar) && (
                <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-4 text-left">
                  {item.notlar && <p className="text-xs font-bold text-slate-500 italic">"{item.notlar}"</p>}
                  {item.fatura_url && (
                    <div className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
                      <ShieldCheck size={14} /> Belge ile doğrulanmış kullanıcı bildirimi
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-lg font-black text-slate-400 uppercase italic tracking-widest">Henüz onaylı veri bulunmuyor.</p>
              <Link href="/" className="text-yellow-600 font-bold text-sm underline mt-2 inline-block">Sorgu ekranına dön</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

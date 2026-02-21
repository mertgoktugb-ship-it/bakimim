import { supabase } from '../../../../lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, MapPin, BadgeCheck, Calendar, Gauge, Fuel } from 'lucide-react';

// 1. SEO Ayarları
export async function generateMetadata({ params }: { params: Promise<{ marka: string, model: string }> }): Promise<Metadata> {
  const { marka, model } = await params;
  const markaUpper = marka.toUpperCase();
  const modelUpper = model.toUpperCase();
  
  return {
    title: `${markaUpper} ${modelUpper} Bakım Fiyatları 2026 | bakimim.com`,
    description: `${markaUpper} ${modelUpper} güncel servis bakım maliyetlerini, yetkili ve özel servis fiyatlarını kıyaslayın.`,
  }
}

// 2. Sayfa İçeriği
export default async function ModelDetaySayfasi({ params }: { params: Promise<{ marka: string, model: string }> }) {
  const { marka, model } = await params;

  // Veritabanından verileri çek
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
      {/* Üst Başlık Alanı */}
      <div className="bg-[#0f172a] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 transition-colors font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-yellow-500">
              <Car size={32} />
              <span className="font-black italic uppercase tracking-widest text-sm">{marka} Veri Havuzu</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
              {marka} <span className="text-yellow-500">{model}</span><br/>BAKIM MALİYETLERİ
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-4 flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" /> TOPLAM {kayitlar?.length || 0} GÜNCEL KULLANICI BİLGİSİ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Ortalamalar - Üst Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-10 mb-20 relative z-20">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-yellow-600"/> Yetkili Servis Ort.
            </span>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              {medYetkili > 0 ? `${medYetkili.toLocaleString('tr-TR')} TL` : "Veri Yok"}
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <BadgePercent size={18}/> Özel Servis Ort.
            </span>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              {medOzel > 0 ? `${medOzel.toLocaleString('tr-TR')} TL` : "Veri Yok"}
            </p>
          </div>
        </div>

        {/* 3'LÜ GRID LİSTELEME */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-800 flex items-center gap-3">
            <div className="w-8 h-1 bg-yellow-500 rounded-full"></div>
            Paylaşılan Tüm Kayıtlar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {kayitlar && kayitlar.length > 0 ? kayitlar.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:border-yellow-400 transition-all flex flex-col h-full">
                {/* Kart Üst Kısım */}
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>
                    {item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}
                  </span>
                  {item.fatura_url && (
                    <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                      <ShieldCheck size={12} strokeWidth={4} />
                    </div>
                  )}
                </div>

                {/* Kart Bilgi Kısmı */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-[10px] tracking-[0.2em] mb-1">
                    <Car size={14} />
                    <span>{item.marka} {item.model}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight mb-4">
                    {item.bakim_turu}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><MapPin size={10}/> Şehir</span>
                        <p className="text-xs font-bold text-slate-700 uppercase">{item.sehir}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Gauge size={10}/> Kilometre</span>
                        <p className="text-xs font-bold text-slate-700">{item.km?.toLocaleString('tr-TR')} KM</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Fuel size={10}/> Motor / Yakıt</span>
                      <p className="text-xs font-bold text-slate-700">{item.yakit_motor || 'Bilinmiyor'}</p>
                    </div>
                  </div>
                </div>

                {/* Kart Alt Kısım - Fiyat */}
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ödenen Tutar</span>
                    <span className="text-3xl font-black text-yellow-600 tracking-tighter">
                      {item.fiyat?.toLocaleString('tr-TR')} TL
                    </span>
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase italic">
                    {item.tarih?.split('-').reverse().join('.')}
                  </div>
                </div>

                {/* Fatura Onay Rozeti */}
                {item.fatura_url && (
                  <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
                    <BadgeCheck size={12} /> Belge Onaylı
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-lg font-black text-slate-400 uppercase italic tracking-widest">Bu modele ait henüz kayıt bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

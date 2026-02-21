import { supabase } from '../../../../lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, BadgePercent, Zap, Car, MapPin, BadgeCheck, Gauge, Fuel, ShieldAlert } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ marka: string, model: string }> }): Promise<Metadata> {
  const { marka, model } = await params;
  const markaUpper = marka.toUpperCase();
  const modelUpper = model.toUpperCase();
  
  return {
    title: `${markaUpper} ${modelUpper} Bakım Fiyatları 2026 | bakimim.com`,
    description: `${markaUpper} ${modelUpper} güncel servis bakım maliyetlerini kıyaslayın.`,
  }
}

export default async function ModelDetaySayfasi({ params }: { params: Promise<{ marka: string, model: string }> }) {
  const { marka, model } = await params;

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
    // Dark mode desteği için bg-slate-950 ve text-slate-200 ekledik
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20 text-left font-sans transition-colors duration-500">
      
      {/* Header - Sabit Koyu Renk Kalabilir Karizmatik Duruyor */}
      <div className="bg-[#0f172a] text-white py-16 px-6 border-b border-slate-800">
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
              <Zap size={14} className="text-yellow-500" /> TOPLAM {kayitlar?.length || 0} DOĞRULANMIŞ VERİ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Ortalamalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-10 mb-20 relative z-20">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-yellow-600"/> Yetkili Servis Ort.
            </span>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {medYetkili > 0 ? `${medYetkili.toLocaleString('tr-TR')} TL` : "Veri Yok"}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <BadgePercent size={18}/> Özel Servis Ort.
            </span>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {medOzel > 0 ? `${medOzel.toLocaleString('tr-TR')} TL` : "Veri Yok"}
            </p>
          </div>
        </div>

        {/* Liste Başlığı */}
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-3 mb-10">
          <div className="w-8 h-1 bg-yellow-500 rounded-full"></div>
          Servis Kayıtları
        </h2>

        {/* 3'lü Izgara */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kayitlar && kayitlar.length > 0 ? kayitlar.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-yellow-400 transition-all flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>
                  {item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}
                </span>
                <div className="flex gap-1">
                  {item.fatura_url && <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg"><ShieldCheck size={12} strokeWidth={4} /></div>}
                  {!item.fatura_url && <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg"><BadgeCheck size={12} strokeWidth={4} /></div>}
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 uppercase font-bold text-slate-400 text-[10px] tracking-[0.2em] mb-1">
                  <Car size={14} />
                  <span>{item.marka} {item.model}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tight mb-6">
                  {item.bakim_turu}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><MapPin size={10}/> Şehir</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{item.sehir}</p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Gauge size={10}/> Kilometre</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.km?.toLocaleString('tr-TR')} KM</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Fuel size={10}/> Motor & Yakıt</span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.yakit_motor || 'Bilinmiyor'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam Tutar</span>
                  <span className="text-3xl font-black text-yellow-600 tracking-tighter">
                    {item.fiyat?.toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase italic">
                  {item.tarih?.split('-').reverse().join('.')}
                </div>
              </div>

              {/* Onay Rozeti ve Açıklaması */}
              <div className="mt-4 flex flex-col gap-2">
                {item.fatura_url ? (
                  <div className="inline-flex items-center gap-2 text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 w-fit px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                    <ShieldCheck size={12} /> Belge Onaylı Kullanıcı Bildirimi
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                    <BadgeCheck size={12} /> Kullanıcı Bildirimi
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-lg font-black text-slate-400 uppercase italic tracking-widest text-left px-10">Henüz kayıt bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

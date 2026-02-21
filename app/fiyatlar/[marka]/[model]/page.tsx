import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { Car, MapPin, ShieldCheck, BadgePercent, ArrowLeft, Zap, BadgeCheck } from 'lucide-react';

// 1. DİNAMİK SEO BAŞLIKLARI (Google için en kritik kısım)
export async function generateMetadata({ params }: { params: { marka: string, model: string } }): Promise<Metadata> {
  const marka = params.marka.toUpperCase();
  const model = params.model.toUpperCase();
  
  return {
    title: `${marka} ${model} Bakım Fiyatları 2026 | Yetkili ve Özel Servis Karşılaştır`,
    description: `${marka} ${model} periyodik bakım, ağır bakım ve alt takım onarım fiyatlarını güncel servis verileriyle kıyaslayın. Yetkili ve özel servis ortalamalarını görün.`,
  }
}

export default async function ModelDetaySayfasi({ params }: { params: { marka: string, model: string } }) {
  const { marka, model } = params;

  // 2. VERİTABANINDAN SADECE BU ARACI ÇEK
  const { data: kayitlar } = await supabase
    .from('bakim_kayitlari')
    .select('*')
    .eq('onayli_mi', true)
    .ilike('marka', marka)
    .ilike('model', model)
    .order('fiyat', { ascending: true });

  const normalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // 3. İSTATİSTİK HESAPLAMA (Sadece bu modele özel)
  const getMedian = (arr: any[]) => {
    if (arr.length === 0) return 0;
    const values = arr.map(i => i.fiyat || 0).sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
  };

  const medYetkili = Math.round(getMedian(kayitlar?.filter(i => i.yetkili_mi) || []));
  const medOzel = Math.round(getMedian(kayitlar?.filter(i => !i.yetkili_mi) || []));

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* ÜST BİLGİ ALANI */}
      <div className="bg-[#0f172a] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-8 transition-colors font-bold uppercase text-xs tracking-widest">
            <ArrowLeft size={16} /> Tüm Modellere Dön
          </Link>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
            {marka} <span className="text-yellow-500">{model}</span> <br /> BAKIM FİYATLARI
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Sistemde Kayıtlı {kayitlar?.length || 0} Güncel Veri Bulunmaktadır
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* MODEL ÖZEL İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-10 mb-12 relative z-20">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-yellow-600"/> Yetkili Servis Ortalaması
            </p>
            <p className="text-4xl font-black text-slate-900">{medYetkili.toLocaleString('tr-TR')} TL</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2 text-indigo-600">
              <BadgePercent size={18}/> Özel Servis Ortalaması
            </p>
            <p className="text-4xl font-black text-slate-900">{medOzel.toLocaleString('tr-TR')} TL</p>
          </div>
        </div>

        {/* VERİ LİSTESİ */}
        <div className="space-y-4">
          <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-800 mb-6">En Son Paylaşılan Kayıtlar</h2>
          {kayitlar && kayitlar.length > 0 ? kayitlar.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:border-yellow-400 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${item.yetkili_mi ? 'bg-yellow-500 text-slate-900' : 'bg-indigo-600 text-white'}`}>
                    {item.yetkili_mi ? 'YETKİLİ' : 'ÖZEL'}
                  </span>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.bakim_turu}</p>
                    <p className="text-lg font-black text-slate-800">{item.km.toLocaleString('tr-TR')} KM Bakımı</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Konum</span>
                    <span className="font-bold text-slate-700">{item.sehir}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Tutar</span>
                    <span className="text-2xl font-black text-yellow-600">{item.fiyat.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>
              </div>
              {item.fatura_url && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  <ShieldCheck size={14} /> Belge ile doğrulanmış kullanıcı bildirimi
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-20 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="font-bold text-slate-400 uppercase italic">Henüz bu modele ait onaylı veri bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

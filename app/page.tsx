"use client";
import React, { useState } from 'react';
import { Car, Search, ShieldCheck, PenTool, Share2, ChevronRight, CheckCircle, AlertCircle, BookOpen, User, Settings, Gauge, Wrench, Fuel, Calendar, MapPin, CreditCard, ClipboardCheck, Info } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function AnaSayfa() {
  const [formData, setFormData] = useState({
    ad_soyad: '',
    marka: '',
    servis: '',
    fiyat: '',
    km: '',
    sehir: ''
  });

  const [durum, setDurum] = useState({ mesaj: '', tip: '' });
  const [yukleniyor, setYukleniyor] = useState(false);

  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setDurum({ mesaj: '', tip: '' });

    try {
      const { error } = await supabase
        .from('bakim_kayitlari')
        .insert([{
          ad_soyad: formData.ad_soyad,
          marka_model: formData.marka,
          servis_adi: formData.servis,
          fiyat: parseFloat(formData.fiyat),
          km: parseInt(formData.km),
          sehir: formData.sehir,
          onayli_mi: false
        }]);

      if (error) throw error;
      setDurum({ mesaj: 'Veri başarıyla onaya gönderildi!', tip: 'basari' });
      setFormData({ ad_soyad: '', marka: '', servis: '', fiyat: '', km: '', sehir: '' });
    } catch (error) {
      setDurum({ mesaj: 'Bir hata oluştu, lütfen tekrar deneyin.', tip: 'hata' });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-yellow-200">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center transition-transform hover:scale-105 text-yellow-400">
                <Car size={28} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">
                  bakımım<span className="text-yellow-500">.com</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                  Şeffaf Servis Rehberi
                </span>
              </div>
           </div>
           <div className="hidden md:flex items-center gap-8">
              <Link href="/blog" className="text-xs font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                <BookOpen size={16}/> Servis Rehberi
              </Link>
              <button className="bg-[#0f172a] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-md">Giriş Yap</button>
           </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-[#0f172a] pt-24 pb-32 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter leading-[0.9]">
            Hangi Servis <br/> <span className="text-yellow-500">Kaç Para?</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
            2026 model araç bakımları, yetkili servis faturaları ve kullanıcı yorumları. <span className="text-white underline decoration-yellow-500 decoration-2">Sürpriz faturalara son.</span>
          </p>
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-yellow-500 transition-colors">
              <Search size={24} />
            </div>
            <input type="text" placeholder="Araç marka, model veya şehir yazın..." className="w-full bg-white/5 border-2 border-white/10 text-white pl-16 pr-8 py-7 rounded-[2.5rem] text-lg font-semibold focus:outline-none focus:border-yellow-500 focus:bg-white/10 transition-all shadow-2xl backdrop-blur-md" />
          </div>
        </div>
      </section>

      {/* VERİ PAYLAŞIM FORMU */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 relative z-20 pb-20">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 text-yellow-600 font-black text-sm uppercase tracking-widest mb-2">
                <Share2 size={20}/> VERİ TABANINA KATKI SAĞLA
              </div>
              <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tight text-slate-800">Servis Fiyatı Paylaş</h2>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <ShieldCheck className="text-green-500" size={32} />
              <p className="text-[11px] font-bold text-slate-500 uppercase leading-tight">Verileriniz Güvenle <br/> İncelenir</p>
            </div>
          </div>

          <form onSubmit={veriyiGonder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required value={formData.ad_soyad} onChange={(e)=>setFormData({...formData, ad_soyad: e.target.value})} type="text" placeholder="Örn: Mert Şen" className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-12 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all text-slate-800" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-slate-400">Araç Marka / Model</label>
              <input required value={formData.marka} onChange={(e)=>setFormData({...formData, marka: e.target.value})} type="text" placeholder="Örn: Clio 1.0 TCe" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all text-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-slate-400">Servis Adı</label>
              <input required value={formData.servis} onChange={(e)=>setFormData({...formData, servis: e.target.value})} type="text" placeholder="Örn: Ankara Mais" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all text-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-slate-400">Bakım Ücreti (TL)</label>
              <input required value={formData.fiyat} onChange={(e)=>setFormData({...formData, fiyat: e.target.value})} type="number" placeholder="Örn: 8500" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all text-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-slate-400">Şehir</label>
              <input required value={formData.sehir} onChange={(e)=>setFormData({...formData, sehir: e.target.value})} type="text" placeholder="Örn: İstanbul" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all text-slate-800" />
            </div>
            <div className="flex items-end">
              <button disabled={yukleniyor} className="w-full bg-[#0f172a] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                {yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}
                {!yukleniyor && <ChevronRight size={20} />}
              </button>
            </div>
          </form>

          {durum.mesaj && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 font-bold text-xs uppercase tracking-wider ${durum.tip === 'basari' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {durum.tip === 'basari' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
              {durum.mesaj}
            </div>
          )}
        </div>
      </section>

      {/* DEV REHBER BÖLÜMÜ (İŞTE BURASI O ASIL KOD!) */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#0f172a] rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-20 relative z-10">
            <div className="bg-yellow-500 p-6 rounded-[2.5rem] shadow-2xl shadow-yellow-500/20 text-slate-900">
              <PenTool size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
                2026 Periyodik <br/> <span className="text-yellow-500 text-3xl md:text-5xl">Bakım Rehberi</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-xl italic border-l-4 border-yellow-500 pl-4 uppercase text-xs tracking-widest">
                Her 15.000 KM'de bir yapılması gereken kritik işlemler listesi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[
              { t: "Motor Yağı Değişimi", d: "0W-20 veya 5W-30 tam sentetik yağ.", i: <Fuel size={20}/> },
              { t: "Yağ Filtresi", d: "Motor ömrü için orijinal filtre kullanımı.", i: <Settings size={20}/> },
              { t: "Hava Filtresi", d: "Performans ve yakıt ekonomisi için kritik.", i: <Gauge size={20}/> },
              { t: "Polen Filtresi", d: "Kabin içi hava kalitesi ve klima verimi.", i: <Wrench size={20}/> },
              { t: "Fren Hidroliği", d: "Her 2 yılda bir nem kontrolü ve değişim.", i: <ShieldCheck size={20}/> },
              { t: "Soğutma Sıvısı", d: "Antifriz derecesi ve sızıntı kontrolü.", i: <Info size={20}/> },
              { t: "Buji Kontrolü", d: "Ateşleme sistemi verimlilik testi.", i: <PenTool size={20}/> },
              { t: "Fren Balataları", d: "Aşınma sensörü ve kalınlık ölçümü.", i: <ClipboardCheck size={20}/> },
              { t: "Lastik Basınçları", d: "Mevsimsel ayar ve rotasyon işlemi.", i: <MapPin size={20}/> },
              { t: "Silecek Suyu", d: "Konsantre silecek sıvısı tamamlaması.", i: <Calendar size={20}/> },
              { t: "Akü Testi", d: "Amper değeri ve voltaj ölçümü.", i: <CreditCard size={20}/> },
              { t: "Alt Takım Kontrolü", d: "Salıncak, rot başı ve körük incelemesi.", i: <BookOpen size={20}/> },
              { t: "Kayış Kontrolü", d: "V-Kayışı gerginlik ve çatlak kontrolü.", i: <Settings size={20}/> },
              { t: "Yazılım Güncelleme", d: "ECU ve multimedya sistemi kontrolü.", i: <Gauge size={20}/> },
              { t: "Far Ayarları", d: "Gece görüşü için açısal kalibrasyon.", i: <Wrench size={20}/> }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-yellow-500 bg-yellow-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    {item.i}
                  </div>
                  <h3 className="font-black uppercase italic tracking-tight text-sm text-yellow-500 leading-tight">
                    {item.t}
                  </h3>
                </div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider pl-12">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-16 px-8 text-center">
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="text-2xl font-black italic text-slate-800 uppercase leading-none">
              bakımım<span className="text-yellow-500">.com</span>
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              © 2026 Şeffaf Servis Rehberi - Tüm Hakları Saklıdır.
            </p>
          </div>
      </footer>
    </main>
  );
}

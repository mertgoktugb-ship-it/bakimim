"use client";
import React, { useState } from 'react';
import { Car, Search, ShieldCheck, Database, PenTool, Share2, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
// Supabase bağlantısını içeri alıyoruz
import { supabase } from '@/lib/supabase';

export default function AnaSayfa() {
  // FORM STATE YÖNETİMİ
  const [formData, setFormData] = useState({
    marka_model: '',
    servis_adi: '',
    bakim_turu: 'Periyodik Bakım',
    sehir: '',
    fiyat: '',
    km: '',
    notlar: ''
  });

  const [durum, setDurum] = useState<{ tipi: 'basari' | 'hata' | null, mesaj: string }>({ tipi: null, mesaj: '' });
  const [yukleniyor, setYukleniyor] = useState(false);

  // FORM GÖNDERME FONKSİYONU
  const veriyiGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setDurum({ tipi: null, mesaj: '' });

    try {
      const { error } = await supabase
        .from('bakim_kayitlari')
        .insert([
          {
            marka_model: formData.marka_model,
            servis_adi: formData.servis_adi,
            bakim_turu: formData.bakim_turu,
            sehir: formData.sehir,
            fiyat: parseFloat(formData.fiyat),
            km: parseInt(formData.km),
            notlar: formData.notlar,
            onayli_mi: false // Admin onayı bekleyecek
          }
        ]);

      if (error) throw error;

      setDurum({ tipi: 'basari', mesaj: 'Veriler başarıyla onaya gönderildi! Teşekkür ederiz.' });
      // Formu temizle
      setFormData({ marka_model: '', servis_adi: '', bakim_turu: 'Periyodik Bakım', sehir: '', fiyat: '', km: '', notlar: '' });
      
    } catch (error: any) {
      setDurum({ tipi: 'hata', mesaj: 'Bir hata oluştu: ' + error.message });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-yellow-200">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-2xl text-yellow-400 shadow-lg flex items-center justify-center transition-transform hover:scale-105">
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
              <Link href="/blog" className="text-xs font-black text-slate-500 hover:text-yellow-600 uppercase tracking-widest transition-colors">Servis Rehberi</Link>
              <button className="bg-[#0f172a] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-md">Giriş Yap</button>
           </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-[#0f172a] pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter leading-[0.9]">
            Hangi Servis <br/> <span className="text-yellow-500">Kaç Para?</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
            2026 model araç bakımları, yetkili servis faturaları ve kullanıcı yorumları. <span className="text-white underline decoration-yellow-500 decoration-2">Sürpriz faturalara son.</span>
          </p>
          
          {/* ARAMA BARI */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-yellow-500 transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Araç marka, model veya şehir yazın... (Örn: Clio 2026 Bakım)"
              className="w-full bg-white/5 border-2 border-white/10 text-white pl-16 pr-8 py-7 rounded-[2.5rem] text-lg font-semibold focus:outline-none focus:border-yellow-500 focus:bg-white/10 transition-all shadow-2xl backdrop-blur-md"
            />
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
              <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tight">Servis Fiyatı Paylaş</h2>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
              <ShieldCheck className="text-green-500" size={32} />
              <p className="text-[11px] font-bold text-slate-500 uppercase leading-tight">Verileriniz Anonim <br/> Olarak İncelenir</p>
            </div>
          </div>

          <form onSubmit={veriyiGonder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Araç Marka / Model</label>
              <input 
                required
                value={formData.marka_model}
                onChange={(e) => setFormData({...formData, marka_model: e.target.value})}
                type="text" placeholder="Örn: Renault Clio 1.0 TCe" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Servis Adı</label>
              <input 
                required
                value={formData.servis_adi}
                onChange={(e) => setFormData({...formData, servis_adi: e.target.value})}
                type="text" placeholder="Örn: Ankara Mais Yetkili Servis" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bakım Ücreti (TL)</label>
              <input 
                required
                value={formData.fiyat}
                onChange={(e) => setFormData({...formData, fiyat: e.target.value})}
                type="number" placeholder="Örn: 8500" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Araç Kilometresi</label>
              <input 
                required
                value={formData.km}
                onChange={(e) => setFormData({...formData, km: e.target.value})}
                type="number" placeholder="Örn: 20000" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Şehir</label>
              <input 
                required
                value={formData.sehir}
                onChange={(e) => setFormData({...formData, sehir: e.target.value})}
                type="text" placeholder="Örn: İstanbul" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:border-yellow-500 outline-none font-bold transition-all" 
              />
            </div>
            <div className="flex items-end">
              <button 
                disabled={yukleniyor}
                className="w-full bg-[#0f172a] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {yukleniyor ? 'GÖNDERİLİYOR...' : 'VERİYİ ONAYA GÖNDER'}
                {!yukleniyor && <ChevronRight size={20} />}
              </button>
            </div>
          </form>

          {/* BİLDİRİM MESAJLARI */}
          {durum.tipi && (
            <div className={`mt-8 p-5 rounded-2xl flex items-center gap-4 animate-bounce ${durum.tipi === 'basari' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {durum.tipi === 'basari' ? <CheckCircle /> : <AlertCircle />}
              <span className="font-black uppercase tracking-wider text-xs">{durum.mesaj}</span>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-16 px-8 text-center">
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="text-2xl font-black italic text-slate-800 uppercase">
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

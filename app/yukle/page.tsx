"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import bakimData from '../data.json'; // Senin json dosyanın yolu

export default function VeriYukleme() {
  const [durum, setDurum] = useState("Bekliyor...");

  const verileriYukle = async () => {
    setDurum("Yükleme başlıyor...");
    
    // JSON verisini Supabase formatına çeviriyoruz
    const hazirVeriler = bakimData.map((item: any) => {
      // Fiyatı sayıya çevirme temizliği
      let hamFiyat = item.fiyat_tl || item.fiyat || "0";
      let temizFiyat = parseFloat(hamFiyat.toString().replace(/[^\d]/g, ''));

      return {
        marka_model: item.marka + " " + item.model,
        servis_adi: item.servis_adi || "Bilinmiyor",
        fiyat: isNaN(temizFiyat) ? 0 : temizFiyat,
        km: parseInt(item.km) || 0,
        sehir: item.sehir || "İstanbul",
        ad_soyad: item.isim || item.ad_soyad || "Anonim", // İsim yoksa Anonim olsun
        yetkili_mi: item.yetkili_mi || "Hayır",
        onayli_mi: true, // Eskiler zaten onaylı sayılır
        yakit_motor: item.motor || "",
        notlar: item.not || "" // Varsa notları da alalım
      };
    });

    // Supabase'e parça parça gönderelim (Hata olmasın diye)
    const { error } = await supabase
      .from('bakim_kayitlari')
      .insert(hazirVeriler);

    if (error) {
      console.error(error);
      setDurum("HATA: " + error.message);
    } else {
      setDurum("BAŞARILI! Tüm veriler veritabanına aktarıldı.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl text-center">
        <h1 className="text-2xl font-black mb-4">Veri Göçü Başlat</h1>
        <p className="mb-6 text-slate-500">JSON dosyasındaki {bakimData.length} kaydı veritabanına yükle.</p>
        <button 
          onClick={verileriYukle}
          className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
        >
          YÜKLEMEYİ BAŞLAT
        </button>
        <p className="mt-4 font-bold text-blue-600">{durum}</p>
      </div>
    </div>
  );
}

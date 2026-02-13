import React from 'react';
import { Car, MapPin, Wrench, Search } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded text-white">
            <Car size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800">bakimim<span className="text-blue-500">.com</span></span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="#">Anasayfa</a>
          <a href="#">Hakkımızda</a>
          <a href="#">İletişim</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center text-white text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')",
            filter: "brightness(0.4)" 
          }}
        />
        
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Araç Bakım Fiyatlarını Karşılaştır!</h1>
          <p className="text-lg text-gray-200 mb-8">En uygun bakım fiyatlarını şehir şehir karşılaştır ve hemen bul!</p>

          {/* Arama Kutusu */}
          <div className="bg-white p-4 rounded-lg shadow-xl flex flex-wrap gap-4 items-center justify-center max-w-5xl mx-auto">
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50 min-w-[180px]">
              <Car size={18} className="text-gray-400 mr-2" />
              <select className="bg-transparent text-gray-700 outline-none w-full"><option>Marka Seçin</option></select>
            </div>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50 min-w-[180px]">
              <Car size={18} className="text-gray-400 mr-2" />
              <select className="bg-transparent text-gray-700 outline-none w-full"><option>Model Seçin</option></select>
            </div>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50 min-w-[180px]">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <select className="bg-transparent text-gray-700 outline-none w-full"><option>Şehir Seçin</option></select>
            </div>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50 min-w-[180px]">
              <Wrench size={18} className="text-gray-400 mr-2" />
              <select className="bg-transparent text-gray-700 outline-none w-full"><option>Bakım Tipi</option></select>
            </div>
            <button className="bg-blue-600 text-white px-8 py-2.5 rounded font-bold hover:bg-blue-700 transition">
              Fiyatları Bul
            </button>
          </div>

          <div className="flex justify-center gap-8 mt-10 text-sm font-medium">
            <span>✓ 500+ Bakım Fiyatı</span>
            <span>📍 30+ Şehirde Servis</span>
            <span>🚗 100+ Marka & Model</span>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">
          Güvenilir Servis Fiyatlarını <span className="text-blue-600">Kolayca Öğrenin!</span>
        </h2>
      </div>
    </main>
  );
}

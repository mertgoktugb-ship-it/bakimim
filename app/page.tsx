"use client";
import React, { useState } from 'react';
import { Car, MapPin, Wrench, Search, ShieldCheck, LayoutGrid, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';

export default function Home() {
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenSehir, setSecilenSehir] = useState("İstanbul"); // Varsayılan şehir
  const [sonucGoster, setSonucGoster] = useState(false);

  // Türkiye'nin tüm illeri (Senin listen baz alınarak alfabetik dizildi)
  const sehirler = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ].sort((a, b) => a.localeCompare(b, 'tr')); // Türkçe karakterlere göre sıralar

  const otomobilMarkalar = ["Alfa Romeo", "Aston Martin", "Audi", "BMW", "Cupra", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Tesla", "Tofaş", "Toyota", "Volkswagen", "Volvo"];
  const araziSuvMarkalar = ["Dacia", "Hyundai", "Jeep", "Land Rover", "Nissan"];
  const minivanVanMarkalar = ["Fiat", "Ford", "Renault", "Volkswagen"];

  const popülerMarkalar = [
    { name: "Hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
    { name: "Nissan", logo: "https://www.carlogos.org/car-logos/nissan-logo.png" },
    { name: "Fiat", logo: "https://www.carlogos.org/car-logos/fiat-logo.png" },
    { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
    { name: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
    { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
    { name: "Opel", logo: "https://www.carlogos.org/car-logos/opel-logo.png" },
    { name: "Renault", logo: "https://www.carlogos.org/car-logos/renault-logo.png" }
  ];

  const bakimVerileri = {
    "Tucson": { fiyat: "11.500 TL - 13.000 TL", icerik: "Yağ, Yağ Filtresi, Polen, Hava Filtresi, Karter Tapası", not: "Yetkili servislerde fiyatlar şehre göre %5-10 oynayabilir.", km: "20.000 KM Periyodik Bakım" },
    "Qashqai": { fiyat: "10.800 TL - 12.500 TL", icerik: "Yağ, Yağ Filtresi, Hava Filtresi, Mazot Filtresi", not: "Dizel modeller için mazot filtresi değişimi dahildir.", km: "15.000 KM Periyodik Bakım" }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-[#1E293B] p-2 rounded-xl text-white shadow-lg transition-transform group-hover:scale-105">
            <Car size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-tight text-[#1E293B]">bakimim<span className="text-blue-600">.com</span></span>
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none">Şen Kardeşler</span>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-600 transition-colors">Anasayfa</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Hakkımızda</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[850px] flex flex-col items-center justify-center text-center py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A] z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 grayscale mix-blend-overlay scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-transparent to-slate-50" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-[800] text-white mb-8 tracking-tight leading-tight drop-shadow-xl">
            Aracınızın Bakım Maliyetini <br/> 
            <span className="text-blue-400 italic">Şeffafça Görün!</span>
          </h1>
          
          {/* Arama Kutusu - Şehir Listesi Entegre Edildi */}
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl max-w-6xl mx-auto mb-12 border border-slate-200">
            <div className="bg-slate-50 p-6 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              
              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2 font-sans">
                <LayoutGrid size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Marka</label>
                  <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer appearance-none w-full">
                    <option value="">Seçiniz</option>
                    <optgroup label="Otomobil">{otomobilMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</optgroup>
                    <optgroup label="SUV & Pickup">{araziSuvMarkalar.map(m => <option key={m} value={m}>{m}</option>)}</optgroup>
                  </select>
                </div>
              </div>

              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2 font-sans">
                <Car size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Model</label>
                  <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)} className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer appearance-none w-full">
                    <option value="">Seçiniz</option>
                    <option value="Tucson">Tucson</option>
                    <option value="Qashqai">Qashqai</option>
                    <option value="Duster">Duster</option>
                  </select>
                </div>
              </div>

              {/* Şehir Seçimi (Tüm İller Buraya Geldi) */}
              <div className="flex items-center group relative border-r border-slate-200 last:border-0 px-2 font-sans">
                <MapPin size={18} className="text-blue-600 mr-3" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Şehir</label>
                  <select 
                    value={secilenSehir}
                    onChange={(e) => setSecilenSehir(e.target.value)}
                    className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer appearance-none w-full"
                  >
                    {sehirler.map(sehir => (
                      <option key={sehir} value={sehir}>{sehir}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={() => setSonucGoster(true)} className="bg-[#1E293B] hover:bg-slate-800 text-white rounded-2xl font-bold transition-all active:scale-95 py-4 flex items-center justify-center gap-2 shadow-lg">
                <Search size={18} /> Sorgula
              </button>
            </div>
          </div>

          {/* Logo Bölümü */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 max-w-6xl mx-auto py-10 bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/20 px-12 shadow-2xl">
            {popülerMarkalar.map((marka) => (
              <div key={marka.name} onClick={() => setSecilenMarka(marka.name)} className="group cursor-pointer flex flex-col items-center gap-4">
                <div className={`w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center p-4 shadow-xl transition-all duration-500 border-2 ${secilenMarka === marka.name ? 'border-blue-400 ring-4 ring-blue-400/20 scale-110 shadow-blue-500/20' : 'border-slate-100 group-hover:border-blue-200 group-hover:scale-105'}`}>
                  <img src={marka.logo} alt={marka.name} className={`w-full h-full object-contain transition-all duration-500 ${secilenMarka === marka.name ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${secilenMarka === marka.name ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {marka.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sonuç Kartı */}
      {sonucGoster && bakimVerileri[secilenModel] && (
        <section className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#1E293B] p-10 text-white flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight mb-2 leading-none">{secilenMarka} {secilenModel}</h2>
                <div className="flex gap-2 items-center">
                  <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                    {bakimVerileri[secilenModel].km}
                  </span>
                  <span className="bg-slate-500/20 text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-500/30">
                    {secilenSehir} Verisi
                  </span>
                </div>
              </div>
              <CheckCircle2 size={60} className="opacity-10 hidden md:block" />
            </div>
            <div className="p-12 text-left">
              <div className="flex flex-col md:flex-row gap-10 items-center justify-between mb-12 border-b border-slate-100 pb-12">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Güncel Bakım Ücreti</p>
                  <p className="text-6xl font-[900] text-[#1E293B] tracking-tighter">{bakimVerileri[secilenModel].fiyat}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border border-blue-100 shadow-sm">
                  <ShieldCheck size={22} /> Şen Kardeşler Onaylı
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest">Değişen Parçalar</h3>
                  <p className="text-slate-600 font-medium leading-relaxed italic bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    "{bakimVerileri[secilenModel].icerik}"
                  </p>
                </div>
                <div className="bg-indigo-50/50 p-10 rounded-[2.5rem] border border-indigo-100/50">
                  <h3 className="text-indigo-900 font-black mb-3 text-xs uppercase tracking-widest flex items-center gap-3">
                    <AlertTriangle size={18} className="text-indigo-500" /> Şen Kardeşler Notu
                  </h3>
                  <p className="text-indigo-700/80 text-sm font-semibold leading-relaxed">
                    {bakimVerileri[secilenModel].not} [cite: 2026-02-10]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
        © 2026 Şen Kardeşler - bakimim.com
      </footer>
    </main>
  );
}

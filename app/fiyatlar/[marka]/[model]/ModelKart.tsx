"use client";
import React, { useState } from 'react';
import { ShieldCheck, BadgeCheck, Car, MapPin, Gauge, Fuel, ChevronDown, MessageSquare } from 'lucide-react';

export default function ModelKart({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border transition-all cursor-pointer flex flex-col h-fit ${
        isOpen ? 'border-yellow-500 shadow-xl' : 'border-slate-100 dark:border-slate-800 shadow-sm hover:border-yellow-400'
      }`}
    >
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
        </div>
      </div>

      {/* AÇILAN KISIM (Detaylar) */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Fuel size={10}/> Motor & Yakıt Detayı</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase">{item.yakit_motor || 'Belirtilmemiş'}</p>
            </div>
            {item.notlar && (
              <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 flex items-center gap-1"><MessageSquare size={10}/> Kullanıcı Notu</span>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 italic leading-relaxed">"{item.notlar}"</p>
              </div>
            )}
            {item.fatura_url && (
              <div className="pt-2">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={14} /> BU KAYIT BELGE İLE DOĞRULANMIŞTIR
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
        <div>
          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam Tutar</span>
          <span className="text-3xl font-black text-yellow-600 tracking-tighter">
            {item.fiyat?.toLocaleString('tr-TR')} TL
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="text-[10px] font-black text-slate-300 uppercase italic">
            {item.tarih?.split('-').reverse().join('.')}
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-yellow-500' : ''}`} />
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Car, MapPin, Search, Calendar, ShieldCheck, BadgePercent, 
  Settings, X, Check, Info, FileText, User, 
  Zap, BookOpen, ArrowRight, Gauge, Fuel, Wrench, MessageSquare, ChevronDown, BadgeCheck, Menu, 
  Home as HomeIcon, ChevronRight, Layers, Moon, Sun, Upload, Mail, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const BAKIM_KATEGORILERI = ["Periyodik Bakım", "Ağır Bakım", "Alt Takım & Yürüyen Aksam"];

// URL YÖNLENDİRME MANTIĞI
const getKategoriPath = (kategori: string) => {
  if (kategori === 'Ağır Bakım') return 'agir-bakim-fiyatlari';
  if (kategori === 'Periyodik Bakım') return 'periyodik-bakim-fiyatlari';
  if (kategori === 'Alt Takım & Yürüyen Aksam') return 'alt-takim-yuruyen-aksam-fiyatlari';
  return '';
};

const CustomSelect = ({ label, value, options, onChange, icon: Icon, isDark }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 rounded-2xl font-bold cursor-pointer flex items-center justify-between transition-all border border-transparent active:scale-[0.98] ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}`}>
        <div className="flex items-center gap-2 truncate text-left">
          {Icon && <Icon size={18} className="text-slate-400 shrink-0" />}
          <span className={value ? (isDark ? "text-white" : "text-slate-800") : "text-slate-400"}>{value || label}</span>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className={`absolute top-[110%] left-0 w-full rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="max-h-60 overflow-y-auto custom-scrollbar text-left">
            {options.map((opt: string) => (
              <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-5 py-3 text-sm font-bold cursor-pointer flex items-center justify-between transition-colors ${value === opt ? 'bg-yellow-500 text-slate-900' : isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>{opt}{value === opt && <Check size={14} />}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function BakimimApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [secilenBakimKategorisi, setSecilenBakimKategorisi] = useState("");
  const [duzenlenenVeri, setDuzenlenenVeri] = useState<any[]>([]);
  const [musaitModeller, setMusaitModeller] = useState<string[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const normalizeMetin = (str: string) => {
    if (!str) return "";
    const temiz = str.trim();
    return temiz.charAt(0).toLocaleUpperCase('tr-TR') + temiz.slice(1).toLocaleLowerCase('tr-TR');
  };

  const veriCek = useCallback(async () => {
    const { data } = await supabase.from('bakim_kayitlari').select('*').eq('onayli_mi', true);
    if (data) {
      setDuzenlenenVeri(data.map(item => ({ ...item, marka_format: normalizeMetin(item.marka), model_format: normalizeMetin(item.model) })));
    }
  }, []);

  useEffect(() => { veriCek(); }, [veriCek]);

  useEffect(() => {
    if (secilenMarka) {
      setMusaitModeller(Array.from(new Set(duzenlenenVeri.filter(item => item.marka_format === secilenMarka).map(item => item.model_format))).sort());
    }
  }, [secilenMarka, duzenlenenVeri]);

  const tumMarkalar = Array.from(new Set(duzenlenenVeri.map(item => item.marka_format))).sort();

  return (
    <main className={`min-h-screen pb-20 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-800'}`}>
      <div className="max-w-4xl mx-auto px-6 pt-20 text-center">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8">Bakım <span className="text-yellow-500">Maliyetini</span> Sorgula</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <CustomSelect label="Marka Seç" value={secilenMarka} options={tumMarkalar} onChange={setSecilenMarka} icon={Car} isDark={isDarkMode} />
          <CustomSelect label="Model Seç" value={secilenModel} options={musaitModeller} onChange={setSecilenModel} icon={Settings} isDark={isDarkMode} />
          <CustomSelect label="Bakım Türü" value={secilenBakimKategorisi} options={BAKIM_KATEGORILERI} onChange={setSecilenBakimKategorisi} icon={Layers} isDark={isDarkMode} />
        </div>

        {secilenMarka && secilenModel && secilenBakimKategorisi && (
          <Link 
            href={`/bakim-fiyatlari/${secilenMarka.toLocaleLowerCase('tr-TR').replace(/\s+/g, '-')}/${secilenModel.toLocaleLowerCase('tr-TR').replace(/\s+/g, '-')}/${getKategoriPath(secilenBakimKategorisi)}`}
            className="inline-flex items-center gap-4 bg-yellow-500 text-slate-900 px-12 py-5 rounded-full font-black italic uppercase hover:bg-yellow-400 transition-all shadow-2xl active:scale-95"
          >
            FİYATLARI GÖR <ArrowRight size={20} />
          </Link>
        )}
      </div>
    </main>
  );
}

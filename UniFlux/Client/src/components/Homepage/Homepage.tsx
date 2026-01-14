import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Sparkles, Activity, Database, ShieldCheck, 
  Lock, Search, Fingerprint, Layers, Github, 
  Sun, Moon, ArrowRight, Globe, Zap, CheckCircle2,
  BarChart3, Languages, Radio, Network, Landmark,
  School, Box, TerminalSquare, MousePointer2, Calendar, X,Users
} from 'lucide-react';

const HomePage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [activeRole, setActiveRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [typewriterText, setTypewriterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const engineRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const consoleLines = [
    "> initializing uniflux_ai_core...",
    "> loading NEP_2020_framework...",
    "> analyzing faculty_workload_balance...",
    "> resolving room_conflict_nodes...",
    "> SUCCESS: timetable_generated_0_clashes."
  ];

  useEffect(() => {
    let lineIdx = 0; let charIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < consoleLines.length) {
        if (charIdx < consoleLines[lineIdx].length) {
          setTypewriterText(prev => prev + consoleLines[lineIdx][charIdx]);
          charIdx++;
        } else {
          setTypewriterText(prev => prev + "\n");
          lineIdx++; charIdx = 0;
        }
      } else { setTypewriterText(""); lineIdx = 0; }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPercent(prev => (prev < 100 ? prev + 1 : 0));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-1000 font-sans selection:bg-blue-500 selection:text-white ${isDarkMode ? 'bg-[#050810] text-white' : 'bg-[#FAFBFF] text-slate-900'}`}>
      
      {/* 1. DYNAMIC NAVIGATION */}
      <nav className="fixed top-6 inset-x-0 z-50 max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className={`backdrop-blur-2xl border transition-all rounded-[2.5rem] flex items-center justify-between px-10 py-4 ${
          isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/70 border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              UNIFLUX
            </span>
          </div>
          
          <div className="hidden lg:flex gap-10 items-center font-bold text-[11px] uppercase tracking-[0.25em]">
            <NavBtn label="Engine" onClick={() => scrollToSection(engineRef)} isDarkMode={isDarkMode} />
            <NavBtn label="Compliance" onClick={() => scrollToSection(complianceRef)} isDarkMode={isDarkMode} />
            <NavBtn label="Security" onClick={() => scrollToSection(securityRef)} isDarkMode={isDarkMode} />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-2xl transition-all hover:scale-110 active:scale-90 ${isDarkMode ? 'bg-white/10 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white dark:bg-blue-600 px-7 py-3 rounded-2xl text-xs font-black tracking-widest hover:shadow-xl transition-all active:scale-95">
              GET STARTED
            </button>
          </div>
        </motion.div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative pt-64 pb-32 px-6 text-center max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-5 py-2 mb-12 text-[10px] font-black uppercase tracking-[0.3em] border rounded-full bg-blue-500/5 border-blue-500/10 text-blue-600">
          <Radio size={14} className="animate-pulse text-red-500" /> NEP 2020 AI Core v4.0 Active
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className={`text-6xl md:text-[110px] font-[1000] mb-8 tracking-[-0.07em] leading-[0.85] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
        >
          Campus Operations <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Autonomous.</span>
        </motion.h1>
        
        <p className="text-xl mb-16 max-w-2xl mx-auto font-medium leading-relaxed opacity-60">
          Replace manual scheduling with neural optimization. Designed specifically for multi-department universities to digitally manage and automate academic operations.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-sm flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-500/20 transition-all group active:scale-95">
                REQUEST ACCESS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="https://github.com/abhisek2004/UniFlux" className="bg-white border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-3xl font-black text-sm flex items-center gap-3 hover:bg-slate-50 transition-all">
                <Github size={20} /> VIEW SOURCE
            </a>
        </div>
      </header>

      {/* 3. ENGINE PREVIEW - DIRECTIONAL PHYSICS */}
      <section ref={engineRef} className="py-32 px-6 max-w-7xl mx-auto scroll-mt-32">
        <div className="grid lg:grid-cols-12 gap-10">
            {/* AI Console: SLIDE FROM LEFT */}
            <motion.div 
              initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }}
              className="lg:col-span-5"
            >
                <div className="bg-[#0A0F1E] rounded-[3rem] border border-white/10 p-10 h-full shadow-2xl relative group">
                    <pre className="font-mono text-sm text-blue-400/90 leading-relaxed whitespace-pre-wrap h-64 overflow-hidden italic">
                        {typewriterText}<span className="animate-pulse bg-blue-500 text-transparent">|</span>
                    </pre>
                    <div className="mt-10">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-3">
                            <span>NEURAL OPTIMIZATION</span>
                            <span>{loadingPercent}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                            <motion.div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full" style={{ width: `${loadingPercent}%` }} transition={{ type: "spring", stiffness: 40 }} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Role View: SLIDE FROM RIGHT */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }}
              className="lg:col-span-7"
            >
                <div className={`p-10 rounded-[3.5rem] border h-full transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-200/60 shadow-xl'}`}>
                    <div className="flex gap-3 mb-12 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl w-fit">
                        {['student', 'faculty', 'admin'].map((role) => (
                            <button 
                                key={role}
                                onClick={() => setActiveRole(role as any)}
                                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeRole === role ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeRole} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className={`rounded-[2.5rem] p-10 min-h-[350px] border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}
                        >
                            {activeRole === 'student' && <RoleView title="Student Dashboard" icon={<MousePointer2 className="text-blue-500"/>} stats={[{l: "ABC Credits", v: "124.5", c: "blue"}, {l: "Attendance", v: "92%", c: "green"}]} />}
                            {activeRole === 'faculty' && <RoleView title="Faculty Schedule" icon={<Calendar className="text-purple-500"/>} stats={[{l: "Weekly Load", v: "18h", c: "purple"}, {l: "Clash Status", v: "Optimal", c: "green"}]} />}
                            {activeRole === 'admin' && <RoleView title="Campus Governance" icon={<Landmark className="text-orange-500"/>} stats={[{l: "Institutes", v: "12", c: "orange"}, {l: "Compliance", v: "98%", c: "indigo"}]} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 4. COMPLIANCE BENTO GRID - MULTI-DIRECTIONAL SETTLING */}
      <section ref={complianceRef} className="py-48 max-w-7xl mx-auto px-6 scroll-mt-32">
         <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Main: FROM LEFT */}
            <motion.div 
               initial={{ opacity: 0, x: -150 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring", bounce: 0.3 }} viewport={{ once: true }}
               className="lg:col-span-8"
            >
               <div className={`h-full p-16 rounded-[4rem] border transition-all duration-700 relative overflow-hidden group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200/60 shadow-xl'}`}>
                  <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 text-blue-600"><Database size={400} /></div>
                  <div className="bg-green-500/10 p-5 rounded-3xl w-fit mb-12"><CheckCircle2 className="text-green-500 w-10 h-10" /></div>
                  <h2 className="text-5xl font-black mb-8 tracking-tighter italic leading-none">NEP 2020 Validated</h2>
                  <p className="text-2xl opacity-60 leading-relaxed font-medium mb-12 max-w-xl">UniFlux replaces fragmented tools with a single unified system. Fully aligned with NEP 2020 requirements for intelligent credit management.</p>
                  <div className="flex flex-wrap gap-4">
                     {['Credit-Based', 'Locker Sync', 'Multi-Entry'].map(tag => (
                       <span key={tag} className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em]">{tag}</span>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* Right Stack: FROM RIGHT and BOTTOM */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               <motion.div initial={{ opacity: 0, x: 150 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring" }} viewport={{ once: true }}>
                  <SmallCard isDarkMode={isDarkMode} icon={<Layers className="text-indigo-500" />} title="Modular ERP" desc="Build custom university plug-ins effortlessly." />
               </motion.div>
               <motion.div initial={{ opacity: 0, y: 150 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, type: "spring" }} viewport={{ once: true }} className="flex-1 p-10 rounded-[3.5rem] border bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden">
                  <Globe size={40} className="mb-10 opacity-70" />
                  <h3 className="text-3xl font-black mb-4 tracking-tight">Unified Engine</h3>
                  <p className="opacity-80 font-medium">Fast, flexible, scalable intelligence for academic operations.</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 5. SECURITY SECTION - STAGGERED FROM SIDES */}
      <section ref={securityRef} className={`py-48 transition-colors duration-1000 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-950 text-white'} scroll-mt-32 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
           <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <ShieldCheck size={80} className="mx-auto mb-12 text-blue-500" />
           </motion.div>
           <h2 className="text-7xl font-black mb-20 tracking-tighter italic">Hardened Security.</h2>
           <div className="grid md:grid-cols-3 gap-8 text-left">
              <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}><SecurityCard icon={<Lock />} title="RBAC Shield" desc="Granular permissions for multi-department nodes." /></motion.div>
              <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}><SecurityCard icon={<Fingerprint />} title="Biometric Sync" desc="Hardware-level faculty workload tracking." /></motion.div>
              <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}><SecurityCard icon={<Search />} title="Deep Audit" desc="Total transparency for AI-suggested operations." /></motion.div>
           </div>
        </div>
      </section>

      {/* 6. MODAL SYSTEM */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl overflow-hidden text-slate-900">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-950 transition-colors"><X size={24} /></button>
              <div className="text-center mb-10">
                <div className="bg-blue-600 p-4 rounded-3xl w-fit mx-auto mb-6 text-white shadow-xl shadow-blue-200"><Cpu size={32} /></div>
                <h2 className="text-4xl font-black tracking-tighter italic">Select Your Role</h2>
              </div>
              <div className="space-y-4">
                <ModalRoleBtn onClick={() => navigate('/register/student')} icon={<Globe className="text-blue-500" />} label="Student" sub="Access courses & credits" />
                <ModalRoleBtn onClick={() => navigate('/register/teacher')} icon={<Users className="text-green-500" />} label="Teacher" sub="Manage workloads" />
                <ModalRoleBtn onClick={() => navigate('/register/hod')} icon={<Landmark className="text-purple-500" />} label="HOD" sub="Departmental control" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-24 text-center opacity-30">
         <p className="text-[10px] font-black tracking-[0.6em] uppercase">UNIFLUX CORE • THE OPEN-SOURCE STANDARD • 2026</p>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const RoleView = ({ title, icon, stats }: any) => (
  <div className="space-y-10 text-left">
    <div className="flex items-center gap-5">
       <div className="bg-white dark:bg-white/10 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">{icon}</div>
       <h3 className="text-3xl font-bold italic tracking-tight uppercase tracking-tighter">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-6">
       {stats.map((s: any, i: number) => (
         <div key={i} className={`p-8 rounded-[2rem] border ${s.c === 'blue' ? 'bg-blue-500/5 border-blue-500/10' : s.c === 'green' ? 'bg-green-500/5 border-green-500/10' : 'bg-purple-500/5 border-purple-500/10'}`}>
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{s.l}</p>
            <p className={`text-5xl font-[1000] tracking-tighter text-${s.c}-600`}>{s.v}</p>
         </div>
       ))}
    </div>
  </div>
);

const ModalRoleBtn = ({ icon, label, sub, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-6 p-6 border-2 border-slate-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group text-left">
    <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-white transition-colors">{icon}</div>
    <div><p className="text-xl font-black tracking-tight">{label}</p><p className="text-sm text-slate-400 font-medium">{sub}</p></div>
    <ArrowRight className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors" />
  </button>
);

const NavBtn = ({ label, onClick, isDarkMode }: any) => (
  <button onClick={onClick} className={`transition-all hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</button>
);

const SmallCard = ({ icon, title, desc, isDarkMode }: any) => (
  <div className={`p-10 rounded-[3.5rem] border transition-all hover:scale-105 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
    <div className="mb-8">{icon}</div>
    <h3 className="text-3xl font-black mb-4 tracking-tighter italic">{title}</h3>
    <p className="opacity-60 text-sm font-medium">{desc}</p>
  </div>
);

const SecurityCard = ({ icon, title, desc }: any) => (
  <div className="p-12 rounded-[4rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
    <div className="text-blue-500 mb-10 group-hover:scale-110 transition-transform">{React.cloneElement(icon, { size: 48 })}</div>
    <h3 className="text-3xl font-black mb-4 italic tracking-tight">{title}</h3>
    <p className="text-slate-400 font-medium text-base leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;
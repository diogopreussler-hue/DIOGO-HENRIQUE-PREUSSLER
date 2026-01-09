
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, PlusCircle, Trash2, FileSpreadsheet, 
  Building2, CalendarDays, ShoppingBag, 
  Printer, Target, ExternalLink, Sun, TrendingUp, Cloud, Link as LinkIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell
} from 'recharts';
import { Expense, PaymentStatus, TimelineTask, ProjectSettings, Quote, ProjectData } from './types';

const EXPENSE_TYPES = [
  'Pintor', 'Encanador', 'Calfinagem', 'Gesseiro', 'Pedreiro', 'Eletricista', 
  'Carpinteiro', 'Engenheiro', 'Arquiteto', 'Marmoraria', 'Serralheria',
  'Cimento', 'Areia/Brita', 'Ferro', 'Tijolo', 'Telha', 'Piso/Revestimento', 
  'Tintas', 'Material Elétrico', 'Material Hidráulico', 'Outros'
];

const INITIAL_PROJECTS: Record<string, ProjectData> = {
  'Residencial Preussler I': {
    settings: { projectName: 'Residencial Preussler I', clientName: 'Família Oliveira', startDate: '2025-01-05', endDate: '2025-11-20', builtArea: 320, estimatedM2Value: 3800, wallEstimation: 55000, feePercentage: 12, cashInHand: 85000, cashDate: '2025-05-22' },
    expenses: [
      { id: '1', date: '2025-05-01', nfNumber: '102', type: 'Cimento', product: 'Cimento Votoran 50kg (150 sacos)', provider: 'Atacado da Construção', quantity: 150, unitValue: 32, originalValue: 5250, negotiatedValue: 4800, discount: 450, status: PaymentStatus.PAID },
      { id: '2', date: '2025-05-03', nfNumber: 'REC-01', type: 'Pedreiro', product: 'Mão de Obra Alvenaria 1º Pav', provider: 'Mestre José & Equipe', quantity: 1, unitValue: 15000, originalValue: 16500, negotiatedValue: 15000, discount: 1500, status: PaymentStatus.PAID },
      { id: '3', date: '2025-05-05', nfNumber: 'NF-882', type: 'Ferro', product: 'Vergalhão CA-50 10mm', provider: 'Siderúrgica Sul', quantity: 80, unitValue: 45, originalValue: 4100, negotiatedValue: 3600, discount: 500, status: PaymentStatus.PAID },
    ],
    quotes: [
      { id: 'q1', description: 'Esquadrias de PVC', quantity: '12 peças', paymentMethod: '6x no boleto', date: '2025-05-20', options: [{provider: 'Esquadrias Sul', value: 45000, approved: true}, {provider: 'PVC Prime', value: 48500, approved: false}] }
    ],
    tasks: [
      { id: 't1', stage: 'Fundação e Baldrame', progress: 100, estimatedDays: 25, startDate: '2025-01-05', endDate: '2025-02-05' },
      { id: 't2', stage: 'Alvenaria', progress: 65, estimatedDays: 45, startDate: '2025-02-10', endDate: '2025-04-15' }
    ],
    version: '6.0'
  },
  'Edifício Grand Garden': {
    settings: { projectName: 'Edifício Grand Garden', clientName: 'Investidores NP', startDate: '2024-10-01', endDate: '2026-12-15', builtArea: 1200, estimatedM2Value: 4200, wallEstimation: 150000, feePercentage: 10, cashInHand: 450000, cashDate: '2025-01-01' },
    expenses: [
      { id: 'g1', date: '2025-01-10', nfNumber: '5544', type: 'Engenheiro', product: 'Projeto Estrutural Completo', provider: 'Eng. Roberto Silva', quantity: 1, unitValue: 25000, originalValue: 28000, negotiatedValue: 25000, discount: 3000, status: PaymentStatus.PAID },
      { id: 'g2', date: '2025-02-15', nfNumber: '887', type: 'Pedreiro', product: 'Escavação e Estacas', provider: 'Terraplanagem Rápida', quantity: 1, unitValue: 85000, originalValue: 92000, negotiatedValue: 85000, discount: 7000, status: PaymentStatus.PAID }
    ],
    quotes: [],
    tasks: [{ id: 'tg1', stage: 'Projetos', progress: 100, estimatedDays: 60, startDate: '2024-10-01', endDate: '2024-12-01' }],
    version: '6.0'
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'quotes' | 'timeline'>('dashboard');
  const [activeProjectKey, setActiveProjectKey] = useState<string>(() => localStorage.getItem('pre_active_key') || 'Residencial Preussler I');
  
  const [settings, setSettings] = useState<ProjectSettings>(() => {
    const saved = localStorage.getItem(`pre_set_${activeProjectKey}`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS[activeProjectKey]?.settings || INITIAL_PROJECTS['Residencial Preussler I'].settings;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`pre_exp_${activeProjectKey}`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS[activeProjectKey]?.expenses || [];
  });
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem(`pre_quo_${activeProjectKey}`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS[activeProjectKey]?.quotes || [];
  });
  const [tasks, setTasks] = useState<TimelineTask[]>(() => {
    const saved = localStorage.getItem(`pre_tsk_${activeProjectKey}`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS[activeProjectKey]?.tasks || [];
  });

  useEffect(() => {
    localStorage.setItem('pre_active_key', activeProjectKey);
    localStorage.setItem(`pre_set_${activeProjectKey}`, JSON.stringify(settings));
    localStorage.setItem(`pre_exp_${activeProjectKey}`, JSON.stringify(expenses));
    localStorage.setItem(`pre_quo_${activeProjectKey}`, JSON.stringify(quotes));
    localStorage.setItem(`pre_tsk_${activeProjectKey}`, JSON.stringify(tasks));
  }, [activeProjectKey, settings, expenses, quotes, tasks]);

  const switchProject = (key: string) => {
    setActiveProjectKey(key);
    const proj = INITIAL_PROJECTS[key] || INITIAL_PROJECTS['Residencial Preussler I'];
    const sS = localStorage.getItem(`pre_set_${key}`);
    const sE = localStorage.getItem(`pre_exp_${key}`);
    const sQ = localStorage.getItem(`pre_quo_${key}`);
    const sT = localStorage.getItem(`pre_tsk_${key}`);
    
    setSettings(sS ? JSON.parse(sS) : proj.settings);
    setExpenses(sE ? JSON.parse(sE) : proj.expenses);
    setQuotes(sQ ? JSON.parse(sQ) : proj.quotes);
    setTasks(sT ? JSON.parse(sT) : proj.tasks);
  };

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.negotiatedValue, 0), [expenses]);
  const totalPaid = useMemo(() => expenses.filter(e => e.status === PaymentStatus.PAID).reduce((sum, e) => sum + e.negotiatedValue, 0), [expenses]);
  const totalEconomy = useMemo(() => expenses.reduce((sum, e) => sum + e.discount, 0), [expenses]);
  const budgetedTotal = (settings.builtArea * settings.estimatedM2Value) + settings.wallEstimation;
  const financialProgress = Math.round((totalSpent / budgetedTotal) * 100) || 0;
  const paymentProgress = totalSpent > 0 ? Math.round((totalPaid / totalSpent) * 100) : 0;
  const pendingPayments = totalSpent - totalPaid;

  const typeData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => data[e.type] = (data[e.type] || 0) + e.negotiatedValue);
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [expenses]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, [field]: value };
        if (field === 'negotiatedValue' || field === 'originalValue') {
          updated.discount = Math.max(0, (updated.originalValue || 0) - (updated.negotiatedValue || 0));
        }
        return updated;
      }
      return e;
    }));
  };

  const addExpense = () => {
    const newExp: Expense = {
      id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], nfNumber: '', type: 'Outros', product: '', provider: '', quantity: 1, unitValue: 0, originalValue: 0, negotiatedValue: 0, discount: 0, status: PaymentStatus.PENDING
    };
    setExpenses([newExp, ...expenses]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] pb-12 font-sans text-[#1A3240]">
      {/* HEADER PROFISSIONAL COM LOGO CORRIGIDO */}
      <header className="bg-white border-b-2 border-[#C5A059]/20 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-[#1A3240] p-4 rounded-xl shadow-lg border border-[#C5A059]/30">
               {/* LOGO DA IMAGEM ENVIADA PELO USUÁRIO */}
               <img src="https://i.imgur.com/v8tTf70.png" alt="Preussler" className="h-20 w-auto object-contain" />
            </div>
            <div className="h-14 w-px bg-slate-200"></div>
            <div>
              <p className="text-[10px] font-black uppercase text-[#C5A059] tracking-widest">Preussler Imobiliária</p>
              <h1 className="text-xl font-black uppercase tracking-tighter text-[#1A3240]">Gestão Estratégica de Obras</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* SELETOR DE OBRA NO TOPO - VISIBILIDADE MELHORADA */}
             <div className="relative group">
                <button className="flex items-center gap-3 bg-[#FDFBF7] border-2 border-[#C5A059] px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all shadow-md">
                  <Building2 size={16} className="text-[#C5A059]" /> {activeProjectKey}
                </button>
                <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                   <p className="p-4 text-[10px] font-black uppercase text-[#C5A059] border-b border-slate-50 tracking-widest bg-slate-50 rounded-t-2xl">Selecionar Obra Ativa</p>
                   {Object.keys(INITIAL_PROJECTS).map(key => (
                     <button key={key} onClick={() => switchProject(key)} className={`w-full text-left px-5 py-4 text-xs font-black uppercase hover:bg-[#FDFBF7] hover:text-[#C5A059] transition-all border-b border-slate-50 last:border-none ${activeProjectKey === key ? 'text-[#C5A059] bg-[#FDFBF7]' : 'text-slate-600'}`}>
                       {key}
                     </button>
                   ))}
                </div>
             </div>
             <button onClick={handlePrint} className="bg-[#1A3240] text-white px-6 py-3.5 rounded-xl text-[11px] font-black uppercase shadow-lg border-b-4 border-[#C5A059] flex items-center gap-2 hover:bg-black transition-all active:translate-y-1 active:border-b-0">
               <Printer size={16} /> Relatório PDF
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* NAVEGAÇÃO E LINK SITE */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
          <nav className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
              { id: 'table', label: 'Planilha de Gastos', icon: FileSpreadsheet },
              { id: 'timeline', label: 'Cronograma Obra', icon: CalendarDays },
              { id: 'quotes', label: 'Orçamentos', icon: ShoppingBag },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shrink-0 ${activeTab === tab.id ? 'bg-[#1A3240] text-[#C5A059] shadow-md' : 'text-slate-400 hover:text-[#1A3240]'}`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </nav>
          <a href="https://www.preusslerimoveis.com.br/obras" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase text-[#C5A059] bg-white px-5 py-3 rounded-xl border-2 border-[#C5A059]/20 hover:border-[#C5A059] transition-all shadow-sm">
            Site Oficial • Obras <ExternalLink size={14} />
          </a>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* CARDS COM PERCENTUAIS SOLICITADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orçamento Global</p>
                <p className="text-3xl font-black text-[#1A3240] tracking-tighter">{formatCurrency(budgetedTotal)}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="text-[11px] font-black text-[#C5A059] uppercase bg-[#FDFBF7] px-3 py-1 rounded-lg border border-[#C5A059]/20">Utilizado: {financialProgress}%</span>
                  <Target size={18} className="text-slate-200" />
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investido (Realizado)</p>
                <p className="text-3xl font-black text-[#1A3240] tracking-tighter">{formatCurrency(totalSpent)}</p>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[11px] font-black text-[#C5A059] uppercase">Status de Pagamento: {paymentProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-[#1A3240] transition-all duration-1000 ease-out" style={{width: `${paymentProgress}%`}}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Economia Gerada</p>
                <p className="text-3xl font-black text-[#C5A059] tracking-tighter">{formatCurrency(totalEconomy)}</p>
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-50">
                   <TrendingUp size={16} className="text-emerald-500" />
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Gestão Preussler Ativa</span>
                </div>
              </div>

              <div className="bg-[#1A3240] p-8 rounded-[2.5rem] text-white shadow-2xl border-b-8 border-[#C5A059]">
                <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">A Pagar (Saldo Obra)</p>
                <p className="text-3xl font-black tracking-tighter">{formatCurrency(pendingPayments)}</p>
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/10">
                   <span className="text-[10px] uppercase font-bold text-white/40 italic">Saldo Bancário: {formatCurrency(settings.cashInHand)}</span>
                </div>
              </div>
            </div>

            {/* GRÁFICO */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
               <div className="flex justify-between items-center mb-12">
                 <h3 className="text-sm font-black uppercase text-[#1A3240] flex items-center gap-4">
                   <div className="w-2.5 h-8 bg-[#C5A059] rounded-full shadow-lg"></div> Distribuição Financeira por Atividade
                 </h3>
               </div>
               <div className="h-[450px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={typeData.slice(0, 8)}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#1A3240'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                     <Tooltip 
                        cursor={{fill: '#FDFBF7'}}
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', padding: '20px'}} 
                     />
                     <Bar dataKey="value" fill="#1A3240" radius={[15, 15, 0, 0]} barSize={50}>
                       {typeData.map((_, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#C5A059' : '#1A3240'} />)}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {/* PLANILHA COM EDIÇÃO DIRETA */}
        {activeTab === 'table' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-[#FDFBF7]">
               <h2 className="text-2xl font-black uppercase text-[#1A3240] tracking-tighter">Gestão de Lançamentos</h2>
               <button onClick={addExpense} className="bg-[#1A3240] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center gap-3 border-b-4 border-[#C5A059] hover:bg-black transition-all">
                 <PlusCircle size={18} /> Novo Lançamento
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#1A3240] text-[#C5A059] font-black uppercase tracking-widest text-[10px]">
                    <th className="px-8 py-6">Data / NF</th>
                    <th className="px-8 py-6">Categoria</th>
                    <th className="px-8 py-6">Atividade / Produto</th>
                    <th className="px-8 py-6">Parceiro</th>
                    <th className="px-8 py-6 text-right">Orçado R$</th>
                    <th className="px-8 py-6 text-right">Pago R$</th>
                    <th className="px-8 py-6 text-center">Pago?</th>
                    <th className="px-8 py-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-5">
                         <input type="date" value={exp.date} onChange={(e) => updateExpense(exp.id, 'date', e.target.value)} className="bg-transparent border-none focus:ring-0 p-0 font-bold text-xs" />
                         <input type="text" placeholder="Documento" value={exp.nfNumber} onChange={(e) => updateExpense(exp.id, 'nfNumber', e.target.value)} className="text-[10px] text-slate-400 bg-transparent border-none focus:ring-0 p-0 block w-full uppercase mt-1" />
                      </td>
                      <td className="px-6 py-5">
                        <select value={exp.type} onChange={(e) => updateExpense(exp.id, 'type', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase p-2 focus:ring-2 focus:ring-[#C5A059] outline-none">
                          {EXPENSE_TYPES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <input type="text" value={exp.product} onChange={(e) => updateExpense(exp.id, 'product', e.target.value)} className="bg-transparent border-none focus:ring-0 p-0 font-bold text-xs w-full text-slate-700" />
                      </td>
                      <td className="px-6 py-5">
                        <input type="text" value={exp.provider} onChange={(e) => updateExpense(exp.id, 'provider', e.target.value)} className="bg-transparent border-none focus:ring-0 p-0 text-xs text-slate-400 italic" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <input type="number" value={exp.originalValue} onChange={(e) => updateExpense(exp.id, 'originalValue', parseFloat(e.target.value))} className="bg-transparent border-none focus:ring-0 p-0 font-bold text-right text-xs w-24 text-slate-300 line-through" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <input type="number" value={exp.negotiatedValue} onChange={(e) => updateExpense(exp.id, 'negotiatedValue', parseFloat(e.target.value))} className="bg-[#FDFBF7] border border-[#C5A059]/30 rounded-lg px-3 py-2 font-black text-right text-xs w-28 text-[#1A3240]" />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button onClick={() => updateExpense(exp.id, 'status', exp.status === PaymentStatus.PAID ? PaymentStatus.PENDING : PaymentStatus.PAID)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-sm transition-all ${exp.status === PaymentStatus.PAID ? 'bg-[#C5A059] text-white' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {exp.status === PaymentStatus.PAID ? 'Sim' : 'Não'}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))} className="text-slate-200 hover:text-red-500 transition-colors p-2"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA CRONOGRAMA */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <h2 className="text-2xl font-black uppercase text-[#1A3240] tracking-tighter mb-8">Cronograma e Evolução Física</h2>
                <div className="grid grid-cols-1 gap-6">
                   {tasks.map(task => (
                     <div key={task.id} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-full md:w-1/3">
                           <input value={task.stage} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t, stage: e.target.value} : t))} className="text-lg font-black uppercase text-[#1A3240] bg-transparent border-none focus:ring-0 w-full" />
                           <p className="text-[10px] font-bold text-[#C5A059] uppercase mt-2">Fase da Obra • NP</p>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                           <div className="flex gap-4">
                              <div className="flex-1">
                                 <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Início Estimado</p>
                                 <input type="date" value={task.startDate} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t, startDate: e.target.value} : t))} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Previsão Final</p>
                                 <input type="date" value={task.endDate} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t, endDate: e.target.value} : t))} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold" />
                              </div>
                           </div>
                           <div className="pt-2">
                              <div className="flex justify-between text-[10px] font-black uppercase text-slate-600 mb-2">
                                 <span>Execução: {task.progress}%</span>
                              </div>
                              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#1A3240]" style={{width: `${task.progress}%`}}></div>
                              </div>
                              <input type="range" min="0" max="100" value={task.progress} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t, progress: parseInt(e.target.value)} : t))} className="w-full h-2 mt-4 accent-[#C5A059]" />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* ABA ORÇAMENTOS */}
        {activeTab === 'quotes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {quotes.map(quote => (
               <div key={quote.id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                  <h3 className="text-xl font-black uppercase text-[#1A3240] mb-6">{quote.description}</h3>
                  <div className="space-y-4">
                     {quote.options.map((opt, i) => (
                       <div key={i} className={`p-6 rounded-2xl border-2 flex justify-between items-center transition-all ${opt.approved ? 'border-[#C5A059] bg-[#FDFBF7] shadow-md' : 'border-slate-100 opacity-60'}`}>
                          <div>
                             <p className="text-xs font-black uppercase text-slate-700">{opt.provider}</p>
                             <button className="flex items-center gap-2 text-[9px] font-black text-[#C5A059] mt-3 uppercase hover:underline">
                                <LinkIcon size={12} /> Ver Orçamento PDF
                             </button>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-[#1A3240]">{formatCurrency(opt.value)}</p>
                             <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md mt-2 inline-block ${opt.approved ? 'bg-[#1A3240] text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {opt.approved ? 'Aprovado' : 'Em Análise'}
                             </span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             ))}
          </div>
        )}
      </main>

      {/* RODAPÉ PROFISSIONAL */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 mb-12 border-t-2 border-slate-100 pt-10 print:hidden">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
               <div className="bg-[#FDFBF7] p-4 rounded-full text-[#C5A059] shadow-inner"><Sun size={28}/></div>
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Tempo em Nova Petrópolis</p>
                  <p className="text-base font-black text-[#1A3240]">Predomínio de Sol • 22°C</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
               <div className="bg-emerald-50 p-4 rounded-full text-emerald-600 shadow-inner"><TrendingUp size={28}/></div>
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Cenário Financeiro</p>
                  <p className="text-base font-black text-[#1A3240]">Selic: 11,25% • CUB/RS: Estável</p>
               </div>
            </div>
            <div className="bg-[#1A3240] p-6 rounded-3xl shadow-2xl flex items-center gap-5 text-white border-b-4 border-[#C5A059]">
               <div className="bg-white/10 p-4 rounded-full text-[#C5A059]"><Cloud size={28}/></div>
               <div>
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Segurança de Dados</p>
                  <p className="text-base font-black uppercase">Backup em Nuvem • OK</p>
               </div>
            </div>
         </div>
         <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-50 pt-8 opacity-60">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A3240]">© 2025 Preussler Negócios Imobiliários • Excelência em Obras</p>
            <div className="flex items-center gap-8">
               <img src="https://i.imgur.com/v8tTf70.png" alt="Preussler Small" className="h-8 grayscale brightness-0" />
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;

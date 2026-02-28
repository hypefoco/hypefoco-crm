import React, { useState, useEffect, useMemo, useRef } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Users, TrendingUp, DollarSign, Plus, Search, X, Edit2, Trash2, ChevronDown, Calendar, Target, LayoutDashboard, ArrowUpRight, ArrowDownRight, Megaphone, Calculator, UserX, MessageSquare, Check, Clock, Percent, TrendingDown, Download, Upload, FileSpreadsheet, Menu, ChevronLeft, Phone, Video, Mail, FileText, Send, CalendarDays, AlertCircle, Settings, UserPlus, Image, User, Wallet, Receipt, CreditCard, PiggyBank, ChevronRight, FileCheck, Ban, RefreshCw, FolderKanban, GripVertical, Palette, MoreHorizontal, Link2, CircleDot, Building, UserCog, Coins, Layers, Package, Eye, LogOut, Lock, BarChart2, Smile, Play, Square, ListChecks, CheckSquare, CalendarRange, Timer } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ============================================
// HYPEFOCO STUDIO CRM - COMERCIAL
// Sistema focado em gestão de leads e vendas
// ============================================

// Configuração do Supabase
const SUPABASE_URL = "https://pszgvqonximzvdsfdkvy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzemd2cW9ueGltenZkc2Zka3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzU0NTUsImV4cCI6MjA4NzIxMTQ1NX0.gT70WZdWJPYDqspE4lZqdwFhdx3nsN6wkAxz4LXGPzM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEY = "hypefoco-crm-comercial-v4";

// Tipos de Atividades para CRM de Design
const ACTIVITY_TYPES = [
  { id: "call", name: "Ligação", icon: "Phone", color: "text-cyan-400 bg-cyan-900/30" },
  { id: "meeting", name: "Reunião/Apresentação", icon: "Video", color: "text-violet-400 bg-violet-900/30" },
  { id: "email", name: "Enviar Email", icon: "Mail", color: "text-amber-400 bg-amber-900/30" },
  { id: "proposal", name: "Enviar Proposta", icon: "FileText", color: "text-pink-400 bg-pink-900/30" },
  { id: "followup", name: "Follow-up", icon: "Send", color: "text-lime-400 bg-lime-900/30" },
  { id: "briefing", name: "Briefing/Diagnóstico", icon: "MessageSquare", color: "text-orange-400 bg-orange-900/30" },
  { id: "reminder", name: "Lembrete", icon: "AlertCircle", color: "text-red-400 bg-red-900/30" },
  { id: "other", name: "Outro", icon: "Calendar", color: "text-gray-400 bg-gray-800/50" },
];

// Dados iniciais VAZIOS para começar do zero
const initialData = {
  clients: [],
  leads: [],
  lostLeads: [],
  trafficInvestment: [],
  activities: [],
  teamMembers: [], // Responsáveis do comercial
  projects: {
    columns: [
      { id: "briefing", name: "Briefing", color: "#8b5cf6", icon: "clipboard" },
      { id: "criacao", name: "Em Criação", color: "#f59e0b", icon: "pencil" },
      { id: "revisao", name: "Revisão", color: "#06b6d4", icon: "eye" },
      { id: "aprovacao", name: "Aprovação", color: "#ec4899", icon: "thumbsup" },
      { id: "entregue", name: "Entregue", color: "#22c55e", icon: "check" }
    ],
    cards: [],
    tasks: [], // Tarefas vinculadas a projetos
  },
  budgetConfig: {
    // Custos Estrutura
    structureCosts: [
      { id: 1, name: "Creative Cloud", value: 280, description: "Adobe", category: "Software" },
      { id: 2, name: "Energia", value: 650, description: "Média", category: "Escritório" },
      { id: 3, name: "Nuvem", value: 16, description: "Dropbox / Onedrive / Drive", category: "Software" },
      { id: 4, name: "Computador (renovação)", value: 83.33, description: "Troca de 1 PC (valor de 5000) em 60 meses", category: "Equipamentos" },
      { id: 5, name: "Ar condicionado (depreciação)", value: 218, description: "Depreciação mensal", category: "Equipamentos" },
      { id: 6, name: "Impressora (depreciação)", value: 23.34, description: "Troca de impressora", category: "Equipamentos" },
      { id: 7, name: "Cadeira", value: 52, description: "4 cadeiras (depreciação)", category: "Equipamentos" },
      { id: 8, name: "Ferramenta de gerenciamento", value: 256, description: "Trello / Asana / Notion", category: "Software" },
      { id: 9, name: "Domínio e hospedagem", value: 20, description: "Wix / GoDaddy / Registro.br", category: "Software" },
      { id: 10, name: "Cursos, eventos e livros", value: 100, description: "Reserva para capacitação", category: "Capacitação" },
      { id: 11, name: "Reserva para escritório", value: 300, description: "Reserva de emergência", category: "Reserva" },
      { id: 12, name: "Transporte", value: 100, description: "Gasolina / Uber", category: "Transporte" },
      { id: 13, name: "Inscrição em prêmios", value: 500, description: "Média de 6 inscrições/ano", category: "Marketing" },
      { id: 14, name: "Contabilidade", value: 500, description: "Serviço contábil", category: "Serviços" },
      { id: 15, name: "Freepik", value: 110, description: "Banco de imagens", category: "Software" },
      { id: 16, name: "Claude", value: 120, description: "IA", category: "Software" },
      { id: 17, name: "Associação", value: 27, description: "Associação profissional", category: "Serviços" }
    ],
    // Custos Pessoal
    teamCosts: [
      { id: 1, name: "Esmeraldo", salary: 5000, thirteenth: 416.67, charges: 0, hoursPerDay: 8, daysPerMonth: 20 },
      { id: 2, name: "Thiago", salary: 1300, thirteenth: 108.33, charges: 0, hoursPerDay: 4, daysPerMonth: 20 },
      { id: 3, name: "Elias", salary: 2000, thirteenth: 166.67, charges: 90, hoursPerDay: 8, daysPerMonth: 20 },
      { id: 4, name: "Rayane", salary: 2500, thirteenth: 208.33, charges: 90, hoursPerDay: 8, daysPerMonth: 20 }
    ],
    // Divisão de Horas
    hoursDistribution: {
      meetingHoursPerDay: 3,
      meetingDaysPerMonth: 4,
      adminHoursPerDay: 4,
      adminDaysPerMonth: 20
    },
    // Margens padrão
    defaultMargins: {
      negotiation: 0,
      profit: 20,
      tax: 6,
      commission: 0
    },
    // Opções de parcelamento
    installmentOptions: [
      { id: 1, name: "12x Cartão", installments: 12, percentage: 10 },
      { id: 2, name: "6x Boleto", installments: 6, percentage: 8 }
    ],
    // Configuração padrão das propostas
    proposalDefaults: {
      method: [
        { step: "01", title: "IMERSÃO", description: "Essência e história da empresa. Análise da concorrência e mercado. Pesquisa com fundadores, público e funcionários." },
        { step: "02", title: "CONCEITUAÇÃO", description: "Estratégia e direção criativa" },
        { step: "03", title: "CRIAÇÃO", description: "Design e experimentação visual" },
        { step: "04", title: "ENTREGA", description: "Entrega e Implementação" }
      ],
      directPayment: { start: 40, approval: 30, delivery: 30 },
      validityDays: 5,
      estimatedWeeks: 8
    }
  },
  budgets: [], // Orçamentos criados
  proposalCounter: 0, // Contador para código das propostas
  financial: {
    months: {},
    categories: {
      expense: ["Custos Fixos", "Salários", "Freelancer", "Comissão", "Investimentos", "Parcelamentos", "Impostos", "Marketing", "Ferramentas", "Outros"],
      income: ["Identidade Visual", "Rebranding", "Projeto Gráfico", "Editorial", "Motion Design", "Embalagem", "Audiovisual", "Outro"]
    }
  },
  pautas: {
    employeeSchedules: {},
    assignments: [],
    events: [],
  },
  lossReasons: [
    "Preço acima do orçamento",
    "Optou por concorrente",
    "Projeto cancelado/adiado",
    "Sem resposta/Ghosting",
    "Escopo não atendido",
    "Timing inadequado",
    "Não tinha fit com o projeto",
    "Outro"
  ]
};

// Estágios do Pipeline Profissional
const PIPELINE_STAGES = [
  { id: "backlog", name: "Backlog / Prospecção", probability: 5, color: "border-gray-400 bg-gray-800/50" },
  { id: "novo", name: "Novo Lead (Inbound)", probability: 10, color: "border-lime-400 bg-lime-900/30" },
  { id: "triagem", name: "Em Triagem / Contato", probability: 20, color: "border-cyan-400 bg-cyan-900/30" },
  { id: "diagnostico", name: "Reunião Diagnóstico", probability: 40, color: "border-amber-400 bg-amber-900/30" },
  { id: "elaborando", name: "Elaborando Proposta", probability: 50, color: "border-orange-400 bg-orange-900/30" },
  { id: "apresentada", name: "Proposta Apresentada", probability: 60, color: "border-pink-400 bg-pink-900/30" },
  { id: "negociacao", name: "Follow-up / Negociação", probability: 75, color: "border-violet-400 bg-violet-900/30" },
  { id: "fechado", name: "Fechado / Onboarding", probability: 100, color: "border-emerald-400 bg-emerald-900/30" },
];

// Role definitions and per-role tab access
const ROLES = [
  { id: "designer", label: "Designer", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
  { id: "head_projetos", label: "Head de Projetos", color: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
  { id: "comercial", label: "Comercial", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
  { id: "diretor_criacao", label: "Diretor de Criação", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30" },
  { id: "admin", label: "Admin", color: "bg-lime-500/20 text-lime-400 border border-lime-500/30" },
];

const ROLE_TABS = {
  designer: ["projects"],
  head_projetos: ["projects", "pautas"],
  comercial: ["comercial", "pipeline", "budgets", "activities", "clients", "lost"],
  diretor_criacao: ["home", "comercial", "pipeline", "projects", "pautas", "budgets", "activities", "clients", "lost", "financial", "investment"],
  admin: ["home", "comercial", "pipeline", "projects", "pautas", "budgets", "activities", "clients", "lost", "financial", "investment", "data", "settings"],
};

const EMOJI_LIST = [
  "😀","😃","😄","😁","😆","😂","🤣","😊","😇","🙂","😉","😌","😍","🥰","😘","😋","😛","😝","😜","🤪","🤓","😎","🤩","🥳","😏","😒","😞","😟","😕","😣","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","😱","😨","😰","😥","🤔","🤗","🫡","🤭","🤥","😶","😐","😑","😬","🙄","😯","😮","😲","🥱","😴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","💀","🤖","🎃","👍","👎","✌️","🤞","🤘","👌","👈","👉","👆","👇","👏","🙌","🙏","💪","🦾","🤝","✍️","💅","💃","🕺","🧑‍💻","👨‍💻","👩‍💻","🧑‍🎨","👨‍🎨","👩‍🎨","🧑‍💼","👨‍💼","👩‍💼","🌟","⭐","💫","✨","🔥","💥","❄️","🌊","🌈","☀️","🌙","⚡","🎯","🎮","🎲","🎨","🎭","🎬","🎤","🎧","🎼","🎹","🎸","🏆","🥇","🏅","💝","💖","❤️","🧡","💛","💚","💙","💜","🖤","💔","💋","🌺","🌸","🌼","🌻","🌹","🌷","🌿","🍀","🍁","🍃","🐶","🐱","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🦆","🦅","🦉","🐺","🐴","🦄","🐝","🦋","🐌","🐞","🐟","🐬","🐳","🦈","🐊","🐘","🦒","🦘","🐕","🐩","🐈","🍎","🍊","🍋","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🫒","🥑","🍆","🥦","🥕","🌽","🌶️","🧄","🧅","🥔","🍠","🥐","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍣","🍤","🍙","🥟","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍵","☕","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧃","🥤","🧋","💻","📱","⌨️","🖥️","🖨️","🖱️","🖲️","💾","💿","📀","📷","📸","📹","🎥","📽️","🎞️","📞","☎️","📟","📠","📺","📻","🧭","⏰","⌚","📡","🔋","🔌","💡","🔦","🕯️","🪔","🧯","🛢️","💰","💵","💳","💎","⚖️","🔧","🔨","⛏️","⚙️","🗜️","🔩","🪛","🔫","🧲","💣","🪓","🔪","🗡️","⚔️","🛡️","🚪","🪟","🪞","🛏️","🛋️","🚽","🚿","🛁","🧴","🧷","🧹","🧺","🧻","🧼","🫧","🪥","🪒","🧽","🪣","🧰","🪤","🪣","📦","📫","📪","📬","📭","📮","📯","📢","📣","📜","📄","📃","📑","🗒️","🗓️","📆","📅","📇","🗃️","🗳️","🗂️","📋","📁","📂","🗂️","🗄️","🗑️","📊","📈","📉","🗺️","📍","📌","📎","🖇️","📏","📐","✂️","🪡","🧵","🪢","🖊️","🖋️","✒️","🖌️","🖍️","📝","✏️","🔍","🔎","🔐","🔏","🔓","🔒","🗝️","🔑",
];

const checkTeamMember = async (email) => {
  try {
    const queryPromise = supabase
      .from("studio_members")
      .select("owner_user_id, role")
      .eq("member_email", email)
      .maybeSingle();
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ data: null, error: null }), 5000)
    );
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
};

// Hook para persistência de dados (localStorage) com backup automático
// ============================================
// COMPONENTE DE LOGIN/CADASTRO
// ============================================
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { name } }
        });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      }
    } catch (err) {
      setError(err.message === "Invalid login credentials" ? "Email ou senha incorretos" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={24} className="text-gray-900" />
            </div>
            <span className="text-2xl font-bold text-white">Hype<span className="text-lime-400">foco</span></span>
          </div>
          <p className="text-gray-500">Sistema de Gestão Comercial</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {isLogin ? "Entrar na conta" : "Criar conta"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-lime-500 focus:outline-none"
                  placeholder="Seu nome" required={!isLogin} />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-lime-500 focus:outline-none"
                placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-lime-500 focus:outline-none"
                placeholder="••••••••" required minLength={6} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-lime-500 hover:bg-lime-400 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />Aguarde...</> : <><Lock size={18} />{isLogin ? "Entrar" : "Criar conta"}</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-lime-400 hover:text-lime-300 text-sm">
              {isLogin ? "Não tem conta? Criar agora" : "Já tem conta? Fazer login"}
            </button>
          </div>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">Seus dados ficam seguros na nuvem</p>
      </div>
    </div>
  );
};

// ============================================
// HOOK DE PERSISTÊNCIA COM SUPABASE
// ============================================
const usePersistedState = (key, defaultValue, user) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const saveTimeoutRef = useRef(null);
  const dataRef = useRef(data);

  // Manter ref atualizada
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const k in source) {
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        result[k] = deepMerge(target[k] || {}, source[k]);
      } else if (source[k] !== undefined) {
        result[k] = source[k];
      }
    }
    return result;
  };

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      if (!user) { 
        setIsLoading(false); 
        return; 
      }

      console.log("🔄 Carregando dados para usuário:", user.id);
      setIsLoading(true);

      try {
        // Primeiro tenta carregar do Supabase (com timeout de 8s)
        const queryPromise = supabase
          .from('crm_data')
          .select('data')
          .eq('user_id', user.id)
          .maybeSingle();
        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 8000)
        );
        const { data: cloudData, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (error && error.message !== "timeout") {
          console.error("Erro ao buscar do Supabase:", error);
          throw error;
        }
        if (error?.message === "timeout") {
          console.warn("⚠️ Timeout ao buscar dados da nuvem, usando fallback local");
          throw error;
        }

        if (cloudData?.data) {
          const merged = deepMerge(defaultValue, cloudData.data);
          setData(merged);
          localStorage.setItem(key, JSON.stringify(merged));
          console.log("☁️ Dados carregados da nuvem!", Object.keys(cloudData.data));
        } else {
          // Sem dados na nuvem - verifica localStorage para migração
          console.log("📭 Sem dados na nuvem, verificando localStorage...");
          const localData = localStorage.getItem(key);
          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              const merged = deepMerge(defaultValue, parsed);
              setData(merged);
              
              // Migra para o Supabase
              console.log("🚀 Migrando dados para a nuvem...");
              const { error: insertError } = await supabase
                .from('crm_data')
                .insert({ 
                  user_id: user.id, 
                  data: merged
                });
              
              if (insertError) {
                console.error("Erro ao migrar dados:", insertError);
                // Tenta upsert se insert falhar
                const { error: upsertError } = await supabase
                  .from('crm_data')
                  .upsert({ 
                    user_id: user.id, 
                    data: merged
                  }, { onConflict: 'user_id' });
                
                if (upsertError) {
                  console.error("Erro no upsert:", upsertError);
                } else {
                  console.log("✅ Dados migrados com upsert!");
                }
              } else {
                console.log("✅ Dados migrados para a nuvem!");
              }
            } catch (parseError) {
              console.error("Erro ao parsear localStorage:", parseError);
            }
          } else {
            console.log("📝 Iniciando com dados padrão");
            setData(defaultValue);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        // Fallback para localStorage
        const localData = localStorage.getItem(key);
        if (localData) {
          try {
            setData(deepMerge(defaultValue, JSON.parse(localData)));
            console.log("📱 Usando dados do localStorage como fallback");
          } catch (e) {
            console.error("Erro no fallback:", e);
          }
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [user?.id]);

  // Função para salvar no Supabase
  const saveToCloud = async (dataToSave) => {
    if (!user?.id) {
      console.warn("⚠️ Usuário não logado");
      return false;
    }

    setSaveStatus('saving');
    
    try {
      console.log("💾 Salvando na nuvem...");

      const { error: upsertError } = await supabase
        .from('crm_data')
        .upsert({ user_id: user.id, data: dataToSave }, { onConflict: 'user_id' });

      if (upsertError) throw upsertError;

      console.log("☁️ Salvo na nuvem!", new Date().toLocaleTimeString());
      setSaveStatus('saved');
      
      // Reset status após 2 segundos
      setTimeout(() => setSaveStatus('idle'), 2000);
      return true;
    } catch (err) {
      console.error("❌ Falha ao salvar:", err);
      setSaveStatus('error');
      return false;
    }
  };

  // Função de atualização
  const updateData = (newData) => {
    const updatedData = typeof newData === 'function' ? newData(data) : newData;
    
    // Atualiza estado imediatamente
    setData(updatedData);
    
    // Salva no localStorage imediatamente (backup local)
    try {
      localStorage.setItem(key, JSON.stringify(updatedData));
      console.log("💾 Salvo no localStorage");
    } catch (err) {
      console.error("Erro ao salvar no localStorage:", err);
    }

    // Debounce para salvar no Supabase (1 segundo)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setSaveStatus('saving');
    saveTimeoutRef.current = setTimeout(() => {
      saveToCloud(updatedData);
    }, 1000);
  };

  // Salvar ao fechar/recarregar página
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Cancela o debounce pendente
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Salva no localStorage garantido
      try {
        localStorage.setItem(key, JSON.stringify(dataRef.current));
      } catch (err) {
        console.error("Erro ao salvar antes de fechar:", err);
      }
      
      // Tenta salvar no Supabase via fetch síncrono (keepalive)
      if (user?.id && dataRef.current) {
        try {
          fetch(`${SUPABASE_URL}/rest/v1/crm_data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              user_id: user.id,
              data: dataRef.current,
              updated_at: new Date().toISOString()
            }),
            keepalive: true
          });
        } catch (err) {
          console.error("Erro no save final:", err);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user?.id, key]);

  return [data, updateData, isLoading, saveStatus];
};

// Componentes de UI reutilizáveis
const Card = ({ children, className = "", onClick }) => (
  <div 
    className={`bg-gray-900 rounded-2xl border border-gray-800 shadow-sm hover:shadow-lg hover:shadow-lime-500/5 transition-all duration-300 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-800 text-gray-300",
    success: "bg-emerald-900/50 text-emerald-400 border border-emerald-700",
    warning: "bg-amber-900/50 text-amber-400 border border-amber-700",
    danger: "bg-red-900/50 text-red-400 border border-red-700",
    info: "bg-cyan-900/50 text-cyan-400 border border-cyan-700",
    lime: "bg-lime-900/50 text-lime-400 border border-lime-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", size = "md", onClick, className = "", icon: Icon, disabled = false }) => {
  const variants = {
    primary: "bg-gradient-to-r from-lime-500 to-emerald-500 text-gray-900 hover:from-lime-400 hover:to-emerald-400 shadow-lg shadow-lime-500/20 font-semibold",
    secondary: "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700",
    ghost: "bg-transparent text-gray-400 hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, icon: Icon }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all`}
      />
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-hidden animate-in`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Sidebar Component com menu retrátil
const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, user, onLogout, saveStatus, memberRole }) => {
  const allMenuItems = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "comercial", label: "Comercial", icon: TrendingUp },
    { id: "pipeline", label: "Pipeline", icon: Target },
    { id: "projects", label: "Projetos", icon: FolderKanban },
    { id: "pautas", label: "Pautas", icon: BarChart2 },
    { id: "budgets", label: "Orçamentos", icon: Calculator },
    { id: "activities", label: "Atividades", icon: CalendarDays },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "lost", label: "Leads Perdidos", icon: UserX },
    { id: "financial", label: "Financeiro", icon: DollarSign },
    { id: "investment", label: "Investimento", icon: Megaphone },
    { id: "data", label: "Backup / Dados", icon: FileSpreadsheet },
    { id: "settings", label: "Configurações", icon: Settings },
  ];
  const allowedTabs = memberRole ? (ROLE_TABS[memberRole] || []) : null;
  const menuItems = allowedTabs ? allMenuItems.filter(item => allowedTabs.includes(item.id)) : allMenuItems;

  // Status de salvamento visual
  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return { text: 'Salvando...', color: 'text-amber-400', dot: 'bg-amber-500 animate-pulse' };
      case 'saved':
        return { text: 'Salvo ✓', color: 'text-lime-400', dot: 'bg-lime-500' };
      case 'error':
        return { text: 'Erro!', color: 'text-red-400', dot: 'bg-red-500 animate-pulse' };
      default:
        return { text: 'Sincronizado', color: 'text-gray-500', dot: 'bg-lime-500 animate-pulse' };
    }
  };

  const statusDisplay = getSaveStatusDisplay();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-950 text-white h-screen sticky top-0 flex flex-col border-r border-gray-800 transition-all duration-300`}>
      {/* Header do Sidebar */}
      <div className={`p-4 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <svg viewBox="0 0 544.15 115.52" className="h-8 w-auto" fill="#f0e9e3">
            <g>
              <g>
                <path d="M164.28,35.08l-18.82,53.77c-2.02,5.75-3.98,10.44-5.88,14.06-1.9,3.62-4.59,6.63-8.07,9.02-3.47,2.39-7.94,3.59-13.39,3.59-3.66,0-7.73-.6-12.21-1.79l-.11-11.99c3.96,1.27,7.65,1.9,11.09,1.9,3.73,0,6.59-.93,8.57-2.8,1.98-1.87,3.79-5.12,5.43-9.75h-8.07l-14.23-44.14h-9.97v-11.88h20.17l14.34,44.92h1.57l15.57-44.92h14Z"/>
                <path d="M218.3,41.97c4.26,5.19,6.39,12.01,6.39,20.45,0,6.05-1.06,11.31-3.19,15.8-2.13,4.48-5.06,7.9-8.79,10.25-3.74,2.35-7.99,3.53-12.77,3.53-8.29,0-13.71-3.62-16.24-10.87h-.67l2.13,11.88v21.62h-13.22V35.08h7.95l3.92,9.41h.56c.97-3.43,2.84-6.01,5.6-7.73,2.76-1.72,6.39-2.58,10.87-2.58,7.39,0,13.22,2.6,17.48,7.79ZM207.82,75.47c2.43-3.1,3.64-7.41,3.64-12.94,0-5.08-1.25-9.09-3.75-12.04-2.5-2.95-6.03-4.43-10.59-4.43-5.45,0-9.45,2.32-11.99,6.95v19.49c1.42,2.76,3.21,4.72,5.38,5.88,2.17,1.16,4.67,1.74,7.51,1.74,4.11,0,7.37-1.55,9.8-4.65Z"/>
                <path d="M40.67,94.87l-11.38-3.77v-25.65c-9.12,7.01-19.35,12.59-29.29,12.59v-12.63c9.08,0,20.13-8.14,29.29-16.48v-16.81C29.29,7.05,42.24,1.63,46.21.57c7.16-1.92,14.46,1.12,18.17,7.55,2.03,3.51,7.32,16.29-9.67,33.28-.94.94-2.1,2.15-3.45,3.55-2.63,2.74-5.79,6.03-9.35,9.47v17.62l22.24-29.88c4.01-5.52,10.98-7.56,17.34-5.07,6.24,2.44,9.96,8.47,9.35,15.1l.07,38.9-12.63.02-.07-39.23.04-.76c.16-1.37-.65-1.99-1.36-2.27-.71-.28-1.73-.37-2.54.75l-.05.07-33.65,45.2ZM50.45,12.63c-.32,0-.65.04-.98.13-3.76,1.01-7.56,7.39-7.56,19.37v4.32c.08-.08.16-.16.24-.24,1.39-1.45,2.59-2.7,3.63-3.74,7.92-7.92,9.55-14.76,7.66-18.03-.67-1.16-1.77-1.8-2.99-1.8Z"/>
                <path d="M290.32,68.13h-43.13c.75,4.18,2.61,7.23,5.6,9.13,2.99,1.9,7.39,2.86,13.22,2.86,7.54,0,14.45-.97,20.73-2.91v11.76c-6.57,2.02-13.56,3.03-20.95,3.03-10.98,0-19.1-2.59-24.37-7.79-5.27-5.19-7.9-12.23-7.9-21.12,0-9.41,2.74-16.58,8.23-21.51,5.49-4.93,12.71-7.39,21.68-7.39,8.44,0,15.03,2.26,19.77,6.78,4.74,4.52,7.11,11.26,7.11,20.22v6.95ZM277.55,58.38c0-8.21-4.71-12.32-14.12-12.32-4.56,0-8.23.92-11.03,2.74-2.8,1.83-4.58,5.02-5.32,9.58h30.47Z"/>
              </g>
              <path d="M359.22,46.95h-31.14c8.59,4.48,14.77,10.46,18.54,17.92,3.77,7.47,5.66,15.09,5.66,22.85s-1.81,14.24-5.43,18.77c-3.62,4.52-8.83,6.78-15.63,6.78-6.13,0-10.79-2.5-14-7.51-3.21-5-4.82-13.41-4.82-25.21,0-9.48.45-19.64,1.34-30.47-4.63-1.64-9.71-2.69-15.24-3.14v-11.88h16.8c1.27-11.58,2.84-22.59,4.71-33.05,4.71.37,7.95,1.4,9.75,3.08,1.79,1.68,2.69,3.86,2.69,6.55,0,4.11-1.98,11.8-5.94,23.08v.34h32.71v11.88ZM336.42,70.81c-2.13-5.53-5.66-10.27-10.59-14.23-.15,5.83-.22,13.82-.22,23.97,0,5.45.2,9.67.62,12.66.41,2.99,1.05,5.1,1.9,6.33.86,1.23,2.03,1.85,3.53,1.85,5.3,0,7.95-4.56,7.95-13.67,0-5.75-1.06-11.39-3.19-16.92Z"/>
              <path d="M379.14,88.35c-4.3-2.43-7.6-5.82-9.91-10.19-2.32-4.37-3.47-9.39-3.47-15.07s1.16-10.7,3.47-15.07c2.31-4.37,5.62-7.77,9.91-10.19,4.29-2.43,9.28-3.64,14.96-3.64s10.66,1.21,14.96,3.64c4.29,2.43,7.62,5.82,9.97,10.19,2.35,4.37,3.53,9.39,3.53,15.07s-1.18,10.7-3.53,15.07c-2.35,4.37-5.68,7.77-9.97,10.19-4.3,2.43-9.28,3.64-14.96,3.64s-10.66-1.21-14.96-3.64ZM405.58,75.46c2.5-3.1,3.75-7.23,3.75-12.38s-1.25-9.28-3.75-12.38c-2.5-3.1-6.33-4.65-11.48-4.65s-8.96,1.55-11.43,4.65c-2.46,3.1-3.7,7.23-3.7,12.38s1.23,9.28,3.7,12.38c2.46,3.1,6.27,4.65,11.43,4.65s8.98-1.55,11.48-4.65Z"/>
              <path d="M432.72,47.62c2.69-4.33,6.44-7.65,11.26-9.97,4.82-2.31,10.32-3.47,16.52-3.47,4.63,0,8.59.47,11.88,1.4,3.29.93,5.86,1.96,7.73,3.08v13.56c-5.68-4.11-12.17-6.16-19.49-6.16-5.53,0-10.03,1.38-13.5,4.14-3.47,2.76-5.21,7.06-5.21,12.88s1.72,9.84,5.15,12.71c3.43,2.88,8.22,4.31,14.34,4.31,4.33,0,8.4-.73,12.21-2.18s6.95-3.19,9.41-5.21v13.11c-1.79,1.42-4.65,2.8-8.57,4.14-3.92,1.34-8.42,2.02-13.5,2.02-7.1,0-13.05-1.29-17.87-3.86-4.82-2.58-8.42-6.05-10.81-10.42-2.39-4.37-3.59-9.24-3.59-14.62,0-5.97,1.34-11.13,4.03-15.46Z"/>
              <path d="M500.74,88.35c-4.3-2.43-7.6-5.82-9.91-10.19-2.32-4.37-3.47-9.39-3.47-15.07s1.16-10.7,3.47-15.07c2.31-4.37,5.62-7.77,9.91-10.19,4.29-2.43,9.28-3.64,14.96-3.64s10.66,1.21,14.96,3.64c4.29,2.43,7.62,5.82,9.97,10.19,2.35,4.37,3.53,9.39,3.53,15.07s-1.18,10.7-3.53,15.07c-2.35,4.37-5.68,7.77-9.97,10.19-4.3,2.43-9.28,3.64-14.96,3.64s-10.66-1.21-14.96-3.64ZM527.17,75.46c2.5-3.1,3.75-7.23,3.75-12.38s-1.25-9.28-3.75-12.38c-2.5-3.1-6.33-4.65-11.48-4.65s-8.96,1.55-11.43,4.65c-2.46,3.1-3.7,7.23-3.7,12.38s1.23,9.28,3.7,12.38c2.46,3.1,6.27,4.65,11.43,4.65s8.98-1.55,11.48-4.65Z"/>
            </g>
          </svg>
        )}
        {isCollapsed && (
          <svg viewBox="0 0 91.35 114.87" className="w-8 h-8" fill="#84cc16">
            <path d="M40.67,94.87l-11.38-3.77v-25.65c-9.12,7.01-19.35,12.59-29.29,12.59v-12.63c9.08,0,20.13-8.14,29.29-16.48v-16.81C29.29,7.05,42.24,1.63,46.21.57c7.16-1.92,14.46,1.12,18.17,7.55,2.03,3.51,7.32,16.29-9.67,33.28-.94.94-2.1,2.15-3.45,3.55-2.63,2.74-5.79,6.03-9.35,9.47v17.62l22.24-29.88c4.01-5.52,10.98-7.56,17.34-5.07,6.24,2.44,9.96,8.47,9.35,15.1l.07,38.9-12.63.02-.07-39.23.04-.76c.16-1.37-.65-1.99-1.36-2.27-.71-.28-1.73-.37-2.54.75l-.05.07-33.65,45.2ZM50.45,12.63c-.32,0-.65.04-.98.13-3.76,1.01-7.56,7.39-7.56,19.37v4.32c.08-.08.16-.16.24-.24,1.39-1.45,2.59-2.7,3.63-3.74,7.92-7.92,9.55-14.76,7.66-18.03-.67-1.16-1.77-1.8-2.99-1.8Z"/>
          </svg>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {!isCollapsed && <p className="text-gray-600 text-sm mb-4 px-4">CRM Comercial</p>}
      
      {/* Menu com scroll */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setActiveView(item.id)} title={isCollapsed ? item.label : ""}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeView === item.id ? "bg-lime-500 text-gray-900 shadow-lg shadow-lime-500/30 font-semibold" : "text-gray-400 hover:text-lime-400 hover:bg-gray-800/50"
            }`}>
            <item.icon size={20} />
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer do Sidebar - sempre visível */}
      <div className="p-4 border-t border-gray-800 bg-gray-950">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-lime-500/20 rounded-full flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-lime-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-200 truncate">{user?.user_metadata?.name || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                {memberRole && (() => { const r = ROLES.find(x => x.id === memberRole); return r ? <span className={`mt-0.5 inline-block text-xs px-2 py-0.5 rounded-full ${r.color}`}>{r.label}</span> : null; })()}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${statusDisplay.dot}`} />
              <span className={statusDisplay.color}>{statusDisplay.text}</span>
            </div>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
              <LogOut size={18} /><span className="text-sm">Sair</span>
            </button>
          </div>
        ) : (
          <button onClick={onLogout} title="Sair" className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// HOME VIEW - DASHBOARD PRINCIPAL (SALA DO CAPITÃO)
// ============================================
const HomeView = ({ data, updateData }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [contactNote, setContactNote] = useState("");

  const leads = data.leads || [];
  const clients = data.clients || [];
  const projects = data.projects || { columns: [], cards: [] };
  const financial = data.financial || { months: {} };
  const activities = data.activities || [];
  const budgets = data.budgets || [];

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  // Data atual
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const currentMonthData = financial.months?.[monthKey] || {};

  // Calcular saldo atual
  // Calcular saldo atual do mês corrente
  const calculateCurrentBalance = () => {
    const monthData = currentMonthData;
    
    // Se o mês tem um saldo inicial manual, usa ele
    if (monthData.initialBalanceOverride !== undefined) {
      const received = (monthData.entries || []).reduce((acc, e) => acc + (e.received || 0), 0);
      const paid = (monthData.expenses || []).reduce((acc, e) => acc + (e.paid || 0), 0);
      return monthData.initialBalanceOverride + received - paid;
    }
    
    // Caso contrário, calcula automaticamente
    // Começa com o saldo inicial do ano
    let balance = financial.initialBalances?.[currentYear] || 0;
    
    // Soma os resultados de todos os meses do ano até o atual
    for (let m = 0; m <= currentMonth; m++) {
      const key = `${currentYear}-${String(m + 1).padStart(2, '0')}`;
      const mData = financial.months?.[key] || { entries: [], expenses: [] };
      
      // Se esse mês tem override, usa ele como base
      if (mData.initialBalanceOverride !== undefined && m < currentMonth) {
        balance = mData.initialBalanceOverride;
      }
      
      const totalReceived = (mData.entries || []).reduce((acc, e) => acc + (e.received || 0), 0);
      const totalPaid = (mData.expenses || []).reduce((acc, e) => acc + (e.paid || 0), 0);
      balance += totalReceived - totalPaid;
    }
    
    return balance;
  };

  const currentBalance = calculateCurrentBalance();
  const monthGoal = currentMonthData.goal || 0;
  const monthReceived = (currentMonthData.entries || []).reduce((acc, e) => acc + (e.received || 0), 0);
  const goalPercentage = monthGoal > 0 ? (monthReceived / monthGoal) * 100 : 0;

  // Leads que precisam de contato (+3 dias sem contato)
  const getLastContactDate = (lead) => {
    if (lead.contactHistory && lead.contactHistory.length > 0) {
      const sorted = [...lead.contactHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
      return new Date(sorted[0].date);
    }
    return new Date(lead.createdAt);
  };

  const leadsNeedingContact = leads.filter(lead => {
    const lastContact = getLastContactDate(lead);
    const daysSince = Math.floor((today - lastContact) / (1000 * 60 * 60 * 24));
    return daysSince >= 3;
  }).map(lead => ({
    ...lead,
    daysSinceContact: Math.floor((today - getLastContactDate(lead)) / (1000 * 60 * 60 * 24))
  })).sort((a, b) => b.daysSinceContact - a.daysSinceContact);

  // Projetos em andamento (não entregues)
  const activeProjects = projects.cards.filter(card => {
    const col = projects.columns.find(c => c.id === card.columnId);
    return col && col.id !== 'entregue';
  });

  // Projetos por coluna
  const projectsByColumn = projects.columns.map(col => ({
    ...col,
    count: projects.cards.filter(c => c.columnId === col.id).length
  }));

  // Atividades pendentes (futuras e de hoje)
  const pendingActivities = activities.filter(act => {
    if (act.completed) return false;
    const actDate = new Date(act.date);
    return actDate >= new Date(today.toDateString());
  }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

  // Atividades atrasadas
  const overdueActivities = activities.filter(act => {
    if (act.completed) return false;
    const actDate = new Date(act.date);
    return actDate < new Date(today.toDateString());
  });

  // Orçamentos recentes (últimos 7 dias)
  const recentBudgets = budgets.filter(b => {
    const created = new Date(b.createdAt);
    const daysSince = Math.floor((today - created) / (1000 * 60 * 60 * 24));
    return daysSince <= 7;
  });

  // Adicionar contato ao lead
  const handleAddContact = () => {
    if (!selectedLead || !contactNote.trim()) return;

    const newContact = {
      id: Date.now(),
      date: new Date().toISOString(),
      note: contactNote.trim()
    };

    updateData(prev => ({
      ...prev,
      leads: prev.leads.map(l => 
        l.id === selectedLead.id 
          ? { ...l, contactHistory: [...(l.contactHistory || []), newContact] }
          : l
      )
    }));

    setIsContactModalOpen(false);
    setSelectedLead(null);
    setContactNote("");
  };

  // Contar leads por estágio (usando status que é o campo correto)
  const leadsByStage = {
    novo: leads.filter(l => l.status === 'novo').length,
    triagem: leads.filter(l => l.status === 'triagem').length,
    diagnostico: leads.filter(l => l.status === 'diagnostico').length,
    elaborando: leads.filter(l => l.status === 'elaborando').length,
    apresentada: leads.filter(l => l.status === 'apresentada').length,
    negociacao: leads.filter(l => l.status === 'negociacao').length,
    backlog: leads.filter(l => l.status === 'backlog').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">🚀 Dashboard</h1>
          <p className="text-gray-500 text-sm">Sala do Capitão • {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Saldo Atual */}
        <Card className={`p-4 ${currentBalance >= 0 ? 'border-emerald-700 bg-emerald-900/10' : 'border-red-700 bg-red-900/10'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className={currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'} />
            <p className="text-xs text-gray-400">Saldo Atual</p>
          </div>
          <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(currentBalance)}
          </p>
        </Card>

        {/* Meta do Mês */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-lime-400" />
            <p className="text-xs text-gray-400">Meta do Mês</p>
          </div>
          <p className="text-2xl font-bold text-lime-400">{goalPercentage.toFixed(0)}%</p>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
            <div 
              className="bg-lime-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${Math.min(goalPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(monthReceived)} / {formatCurrency(monthGoal)}</p>
        </Card>

        {/* Leads Ativos */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-cyan-400" />
            <p className="text-xs text-gray-400">Leads no Funil</p>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{leads.length}</p>
          <p className="text-xs text-gray-500">{leadsByStage.apresentada + leadsByStage.negociacao} em negociação</p>
        </Card>

        {/* Projetos Ativos */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban size={16} className="text-violet-400" />
            <p className="text-xs text-gray-400">Projetos Ativos</p>
          </div>
          <p className="text-2xl font-bold text-violet-400">{activeProjects.length}</p>
          <p className="text-xs text-gray-500">{projects.cards.filter(c => c.columnId === 'entregue').length} entregues</p>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      {(leadsNeedingContact.length > 0 || overdueActivities.length > 0) && (
        <Card className="p-4 border-amber-700 bg-amber-900/10">
          <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
            <AlertCircle size={18} /> Pontos de Atenção
          </h3>
          <div className="space-y-2">
            {leadsNeedingContact.length > 0 && (
              <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-amber-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-bold text-amber-400">{leadsNeedingContact.length}</span> leads precisam de contato (+3 dias)
                  </span>
                </div>
              </div>
            )}
            {overdueActivities.length > 0 && (
              <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-red-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-bold text-red-400">{overdueActivities.length}</span> atividades atrasadas
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads que precisam de contato */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2">
            <Phone size={18} className="text-amber-400" /> Leads Aguardando Contato
          </h3>
          {leadsNeedingContact.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {leadsNeedingContact.slice(0, 10).map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-200 text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.company || 'Sem empresa'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      lead.daysSinceContact >= 7 ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'
                    }`}>
                      {lead.daysSinceContact} dias
                    </span>
                    <button
                      onClick={() => { setSelectedLead(lead); setIsContactModalOpen(true); }}
                      className="p-1.5 bg-lime-600 hover:bg-lime-500 rounded-lg transition-colors"
                      title="Registrar contato"
                    >
                      <Plus size={14} className="text-gray-900" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-600">
              <Check size={24} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">Todos os leads com contato em dia!</p>
            </div>
          )}
        </Card>

        {/* Projetos por Status */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2">
            <FolderKanban size={18} className="text-violet-400" /> Projetos na Casa
          </h3>
          {projectsByColumn.length > 0 ? (
            <div className="space-y-2">
              {projectsByColumn.map(col => (
                <div key={col.id} className="flex items-center gap-3">
                  <div 
                    className="w-2 h-8 rounded"
                    style={{ backgroundColor: col.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{col.name}</span>
                      <span className="text-gray-400 font-bold">{col.count}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                      <div 
                        className="h-1.5 rounded-full transition-all"
                        style={{ 
                          backgroundColor: col.color,
                          width: `${projects.cards.length > 0 ? (col.count / projects.cards.length) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">Nenhum projeto cadastrado</p>
          )}
        </Card>

        {/* Próximas Atividades */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2">
            <CalendarDays size={18} className="text-cyan-400" /> Próximas Atividades
          </h3>
          {pendingActivities.length > 0 ? (
            <div className="space-y-2">
              {pendingActivities.map(act => {
                const actDate = new Date(act.date);
                const isToday = actDate.toDateString() === today.toDateString();
                const lead = leads.find(l => l.id === act.leadId);
                return (
                  <div key={act.id} className={`p-3 rounded-lg ${isToday ? 'bg-lime-900/20 border border-lime-700' : 'bg-gray-800/50'}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-200 text-sm">{act.title}</p>
                      <span className={`text-xs ${isToday ? 'text-lime-400' : 'text-gray-500'}`}>
                        {isToday ? 'Hoje' : actDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {lead && <p className="text-xs text-cyan-400 mt-1">{lead.name}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">Nenhuma atividade pendente</p>
          )}
        </Card>

        {/* Pipeline Resumo */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2">
            <Target size={18} className="text-lime-400" /> Pipeline Comercial
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {[
              { stage: 'novo', label: 'Novo', color: 'bg-gray-600', count: leadsByStage.novo },
              { stage: 'triagem', label: 'Triagem', color: 'bg-slate-600', count: leadsByStage.triagem },
              { stage: 'diagnostico', label: 'Diagnóstico', color: 'bg-cyan-600', count: leadsByStage.diagnostico },
              { stage: 'elaborando', label: 'Elaborando', color: 'bg-violet-600', count: leadsByStage.elaborando },
              { stage: 'apresentada', label: 'Apresentada', color: 'bg-amber-600', count: leadsByStage.apresentada },
              { stage: 'negociacao', label: 'Negociação', color: 'bg-lime-600', count: leadsByStage.negociacao },
              { stage: 'backlog', label: 'Backlog', color: 'bg-pink-600', count: leadsByStage.backlog }
            ].map(item => (
              <div key={item.stage} className="text-center">
                <div className={`${item.color} rounded-lg p-3 mb-1`}>
                  <p className="text-xl font-bold text-white">{item.count}</p>
                </div>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
          
          {/* Total em proposta/negociação */}
          {(leadsByStage.apresentada + leadsByStage.negociacao) > 0 && (
            <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-700 rounded-lg">
              <p className="text-xs text-gray-400">Valor em negociação</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(
                  leads
                    .filter(l => l.status === 'apresentada' || l.status === 'negociacao')
                    .reduce((acc, l) => acc + (l.value || 0), 0)
                )}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Orçamentos Recentes */}
      {recentBudgets.length > 0 && (
        <Card className="p-4">
          <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2">
            <Calculator size={18} className="text-emerald-400" /> Orçamentos Recentes (últimos 7 dias)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentBudgets.map(budget => (
              <div key={budget.id} className="p-3 bg-gray-800/50 rounded-lg">
                <p className="font-medium text-gray-200 text-sm truncate">{budget.name}</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(budget.calculatedValue)}</p>
                <p className="text-xs text-gray-500">{new Date(budget.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal Registrar Contato */}
      <Modal isOpen={isContactModalOpen} onClose={() => { setIsContactModalOpen(false); setSelectedLead(null); setContactNote(""); }} title="Registrar Contato">
        {selectedLead && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-800 rounded-xl">
              <p className="font-medium text-gray-200">{selectedLead.name}</p>
              <p className="text-sm text-gray-500">{selectedLead.company || 'Sem empresa'}</p>
            </div>
            
            {/* Histórico de contatos */}
            {selectedLead.contactHistory && selectedLead.contactHistory.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Histórico de contatos:</p>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {[...selectedLead.contactHistory].sort((a, b) => new Date(b.date) - new Date(a.date)).map(contact => (
                    <div key={contact.id} className="p-2 bg-gray-800/50 rounded-lg text-sm">
                      <p className="text-gray-300">{contact.note}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(contact.date).toLocaleDateString('pt-BR')} às {new Date(contact.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Como foi o contato?</label>
              <textarea
                value={contactNote}
                onChange={(e) => setContactNote(e.target.value)}
                placeholder="Descreva o contato realizado..."
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:border-lime-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => { setIsContactModalOpen(false); setSelectedLead(null); setContactNote(""); }}>Cancelar</Button>
          <Button onClick={handleAddContact} disabled={!contactNote.trim()}>Registrar Contato</Button>
        </div>
      </Modal>
    </div>
  );
};

// Comercial View (antiga Dashboard) com Filtros Funcionais
const ComercialView = ({ data }) => {
  const [periodFilter, setPeriodFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [monthFilter, setMonthFilter] = useState("all");

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  const months = [
    { value: "all", label: "Todos os meses" },
    { value: "0", label: "Janeiro" }, { value: "1", label: "Fevereiro" }, { value: "2", label: "Março" },
    { value: "3", label: "Abril" }, { value: "4", label: "Maio" }, { value: "5", label: "Junho" },
    { value: "6", label: "Julho" }, { value: "7", label: "Agosto" }, { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" }, { value: "10", label: "Novembro" }, { value: "11", label: "Dezembro" },
  ];

  // Função para filtrar por período
  const filterByPeriod = (items, dateField = 'createdAt') => {
    if (periodFilter === "all") return items;
    
    return items.filter(item => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();
      
      if (yearFilter && itemYear !== parseInt(yearFilter)) return false;
      if (monthFilter !== "all" && itemMonth !== parseInt(monthFilter)) return false;
      
      return true;
    });
  };

  const stats = useMemo(() => {
    // Filtrar dados pelo período (excluindo clientes legacy das estatísticas)
    const filteredLeads = filterByPeriod(data.leads);
    const filteredClients = filterByPeriod(data.clients.filter(c => !c.isLegacy), 'closedAt');
    const filteredLostLeads = filterByPeriod(data.lostLeads, 'lostDate');
    const filteredInvestment = periodFilter === "all" 
      ? data.trafficInvestment 
      : data.trafficInvestment.filter(t => {
          if (yearFilter && t.year !== parseInt(yearFilter)) return false;
          if (monthFilter !== "all") {
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            if (t.month !== monthNames[parseInt(monthFilter)]) return false;
          }
          return true;
        });

    const totalLeads = filteredLeads.length;
    const totalClients = filteredClients.length;
    const lostLeads = filteredLostLeads.length;
    const totalInvestment = filteredInvestment.reduce((acc, t) => acc + t.amount, 0);
    
    // Taxa de Conversão (Clientes / (Clientes + Perdidos))
    const totalProcessed = totalClients + lostLeads;
    const conversionRate = totalProcessed > 0 ? ((totalClients / totalProcessed) * 100).toFixed(1) : 0;
    
    // Receita total (Faturamento)
    const totalRevenue = filteredClients.reduce((acc, c) => acc + (c.value || 0), 0);
    
    // Ticket Médio (Faturamento / Clientes)
    const avgTicket = totalClients > 0 ? totalRevenue / totalClients : 0;
    
    // CAC (Investimento / Novos Clientes de Tráfego Pago)
    const paidClients = filteredClients.filter(c => c.source === "Tráfego Pago").length;
    const cac = paidClients > 0 ? totalInvestment / paidClients : 0;
    
    // Ciclo de Vendas Médio (dias entre entrada e fechamento)
    const clientsWithDates = filteredClients.filter(c => c.createdAt && c.closedAt);
    const totalDays = clientsWithDates.reduce((acc, c) => {
      const start = new Date(c.createdAt);
      const end = new Date(c.closedAt);
      return acc + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, 0);
    const avgCycle = clientsWithDates.length > 0 ? Math.round(totalDays / clientsWithDates.length) : 0;
    
    // Forecast Ponderado (Soma de valor * probabilidade)
    const forecast = filteredLeads.reduce((acc, lead) => {
      const stage = PIPELINE_STAGES.find(s => s.id === lead.status);
      const probability = stage ? stage.probability / 100 : 0;
      return acc + ((lead.value || 0) * probability);
    }, 0);
    
    // Leads de tráfego pago
    const paidLeadsCount = filteredLeads.filter(l => l.source === "Tráfego Pago").length + 
                          filteredClients.filter(c => c.source === "Tráfego Pago").length +
                          filteredLostLeads.filter(l => l.source === "Tráfego Pago").length;
    
    const costPerLead = paidLeadsCount > 0 ? totalInvestment / paidLeadsCount : 0;

    // === MÉTRICAS DE ORÇAMENTO ===
    // Total de orçamentos (leads + clientes + perdidos que têm proposalType != none)
    const allWithProposal = [
      ...filteredLeads.filter(l => l.proposalType && l.proposalType !== "none"),
      ...filteredClients.filter(c => c.proposalType && c.proposalType !== "none"),
      ...filteredLostLeads.filter(l => l.proposalType && l.proposalType !== "none")
    ];
    const totalProposals = allWithProposal.length;

    // Orçamentos só enviados (PDF/email)
    const sentOnly = allWithProposal.filter(item => item.proposalType === "sent");
    const totalSentOnly = sentOnly.length;
    const clientsSentOnly = filteredClients.filter(c => c.proposalType === "sent").length;
    const lostSentOnly = filteredLostLeads.filter(l => l.proposalType === "sent").length;
    const conversionSentOnly = (clientsSentOnly + lostSentOnly) > 0 
      ? ((clientsSentOnly / (clientsSentOnly + lostSentOnly)) * 100).toFixed(1) 
      : 0;
    const revenueSentOnly = filteredClients.filter(c => c.proposalType === "sent").reduce((acc, c) => acc + (c.value || 0), 0);

    // Propostas apresentadas em reunião
    const presented = allWithProposal.filter(item => item.proposalType === "presented");
    const totalPresented = presented.length;
    const clientsPresented = filteredClients.filter(c => c.proposalType === "presented").length;
    const lostPresented = filteredLostLeads.filter(l => l.proposalType === "presented").length;
    const conversionPresented = (clientsPresented + lostPresented) > 0 
      ? ((clientsPresented / (clientsPresented + lostPresented)) * 100).toFixed(1) 
      : 0;
    const revenuePresented = filteredClients.filter(c => c.proposalType === "presented").reduce((acc, c) => acc + (c.value || 0), 0);
    
    return { 
      totalLeads, 
      totalClients, 
      lostLeads,
      totalInvestment,
      conversionRate,
      totalRevenue,
      avgTicket,
      cac,
      avgCycle,
      forecast,
      costPerLead,
      paidLeadsCount,
      // Métricas de orçamento
      totalProposals,
      totalSentOnly,
      clientsSentOnly,
      conversionSentOnly,
      revenueSentOnly,
      totalPresented,
      clientsPresented,
      conversionPresented,
      revenuePresented
    };
  }, [data, periodFilter, yearFilter, monthFilter]);

  // Dados de motivos de perda
  const lossReasonsData = useMemo(() => {
    const filteredLost = periodFilter === "all" ? data.lostLeads : filterByPeriod(data.lostLeads, 'lostDate');
    const reasons = {};
    filteredLost.forEach(lead => {
      if (lead.lostReason) {
        reasons[lead.lostReason] = (reasons[lead.lostReason] || 0) + 1;
      }
    });
    return Object.entries(reasons).map(([name, value]) => ({ name, value }));
  }, [data, periodFilter, yearFilter, monthFilter]);

  // Dados de segmento
  const segmentData = useMemo(() => {
    const allItems = [...data.leads, ...data.clients, ...data.lostLeads];
    const filtered = periodFilter === "all" ? allItems : filterByPeriod(allItems);
    const segments = {};
    filtered.forEach(item => {
      if (item.segment) {
        segments[item.segment] = (segments[item.segment] || 0) + 1;
      }
    });
    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  }, [data, periodFilter, yearFilter, monthFilter]);

  // Dados de origem
  const sourceData = useMemo(() => {
    const allItems = [...data.leads, ...data.clients, ...data.lostLeads];
    const filtered = periodFilter === "all" ? allItems : filterByPeriod(allItems);
    const sources = {};
    filtered.forEach(item => {
      if (item.source) {
        sources[item.source] = (sources[item.source] || 0) + 1;
      }
    });
    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  }, [data, periodFilter, yearFilter, monthFilter]);

  const COLORS = ["#84cc16", "#06b6d4", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#10b981"];

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-100 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={20} className="text-gray-900" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Dashboard Comercial</h1>
          <p className="text-gray-500 mt-1">Métricas e análises de vendas</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select
            value={periodFilter}
            onChange={(v) => setPeriodFilter(v)}
            options={[
              { value: "all", label: "Todo período" },
              { value: "filtered", label: "Filtrar por data" },
            ]}
          />
          {periodFilter === "filtered" && (
            <>
              <Select
                value={yearFilter}
                onChange={setYearFilter}
                options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
              />
              <Select
                value={monthFilter}
                onChange={setMonthFilter}
                options={months}
              />
            </>
          )}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Leads"
          value={stats.totalLeads}
          subtitle="leads ativos no funil"
          icon={Target}
          color="bg-lime-400"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.conversionRate}%`}
          subtitle="vendas ganhas / total"
          icon={Percent}
          color="bg-emerald-400"
        />
        <StatCard
          title="Ticket Médio"
          value={`R$ ${stats.avgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
          subtitle="faturamento / clientes"
          icon={DollarSign}
          color="bg-amber-400"
        />
        <StatCard
          title="Ciclo de Vendas"
          value={`${stats.avgCycle} dias`}
          subtitle="média entrada → fechamento"
          icon={Clock}
          color="bg-cyan-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CAC"
          value={`R$ ${stats.cac.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
          subtitle="custo de aquisição"
          icon={Calculator}
          color="bg-pink-400"
        />
        <StatCard
          title="Forecast Ponderado"
          value={`R$ ${(stats.forecast / 1000).toFixed(1)}k`}
          subtitle="oportunidades × probabilidade"
          icon={TrendingUp}
          color="bg-violet-400"
        />
        <StatCard
          title="Investimento Ads"
          value={`R$ ${stats.totalInvestment.toLocaleString('pt-BR')}`}
          subtitle="total em tráfego pago"
          icon={Megaphone}
          color="bg-orange-400"
        />
        <StatCard
          title="Faturamento"
          value={`R$ ${(stats.totalRevenue / 1000).toFixed(1)}k`}
          subtitle={`${stats.totalClients} clientes fechados`}
          icon={TrendingUp}
          color="bg-lime-400"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-6">Motivos de Perda</h3>
          {lossReasonsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={lossReasonsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {lossReasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#f3f4f6" }}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-600">
              <div className="text-center">
                <TrendingDown size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhuma perda registrada</p>
              </div>
            </div>
          )}
          {lossReasonsData.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {lossReasonsData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-6">Origem dos Leads</h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={100} />
                <Tooltip 
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#f3f4f6" }}
                  formatter={(value) => [value, "Leads"]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-600">
              <div className="text-center">
                <Target size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhum lead cadastrado</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Resumo do Funil */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-100 mb-6">Resumo do Funil</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-lime-400" />
              <span className="font-medium text-gray-300">Leads Ativos</span>
            </div>
            <span className="text-3xl font-bold text-lime-400 block mt-2">{stats.totalLeads}</span>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-emerald-400" />
              <span className="font-medium text-gray-300">Clientes</span>
            </div>
            <span className="text-3xl font-bold text-emerald-400 block mt-2">{stats.totalClients}</span>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <UserX size={20} className="text-red-400" />
              <span className="font-medium text-gray-300">Perdidos</span>
            </div>
            <span className="text-3xl font-bold text-red-400 block mt-2">{stats.lostLeads}</span>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
              <Calculator size={20} className="text-cyan-400" />
              <span className="font-medium text-gray-300">Custo/Lead</span>
            </div>
            <span className="text-3xl font-bold text-cyan-400 block mt-2">R$ {stats.costPerLead.toFixed(0)}</span>
          </div>
        </div>
      </Card>

      {/* Comparativo: Orçamento Enviado vs Proposta Apresentada */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-100 mb-2">Orçamentos Realizados</h3>
        <p className="text-gray-500 text-sm mb-6">Comparativo entre enviar PDF vs apresentar em reunião</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total de Orçamentos */}
          <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <FileSpreadsheet size={20} className="text-violet-400" />
              </div>
              <span className="font-semibold text-gray-200">Total de Orçamentos</span>
            </div>
            <span className="text-4xl font-bold text-violet-400">{stats.totalProposals}</span>
            <p className="text-gray-500 text-sm mt-2">propostas enviadas/apresentadas</p>
          </div>

          {/* Só Enviado (PDF/Email) */}
          <div className="p-5 bg-gray-800/50 rounded-xl border border-amber-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Upload size={20} className="text-amber-400" />
              </div>
              <span className="font-semibold text-gray-200">Só Enviou PDF</span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-3xl font-bold text-amber-400">{stats.totalSentOnly}</span>
                <span className="text-gray-500 text-sm ml-2">orçamentos</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Fechados</span>
                <span className="font-semibold text-emerald-400">{stats.clientsSentOnly}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Taxa de Conversão</span>
                <span className="font-bold text-amber-400">{stats.conversionSentOnly}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Receita Gerada</span>
                <span className="font-semibold text-lime-400">R$ {(stats.revenueSentOnly / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* Apresentado em Reunião */}
          <div className="p-5 bg-gray-800/50 rounded-xl border border-emerald-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Users size={20} className="text-emerald-400" />
              </div>
              <span className="font-semibold text-gray-200">Apresentou em Reunião</span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-3xl font-bold text-emerald-400">{stats.totalPresented}</span>
                <span className="text-gray-500 text-sm ml-2">apresentações</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Fechados</span>
                <span className="font-semibold text-emerald-400">{stats.clientsPresented}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Taxa de Conversão</span>
                <span className="font-bold text-emerald-400">{stats.conversionPresented}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Receita Gerada</span>
                <span className="font-semibold text-lime-400">R$ {(stats.revenuePresented / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insight */}
        {(stats.totalSentOnly > 0 && stats.totalPresented > 0) && (
          <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-sm text-gray-400">
              💡 <span className="text-gray-300 font-medium">Insight:</span>{' '}
              {parseFloat(stats.conversionPresented) > parseFloat(stats.conversionSentOnly) ? (
                <>Apresentar em reunião tem <span className="text-emerald-400 font-semibold">{(parseFloat(stats.conversionPresented) - parseFloat(stats.conversionSentOnly)).toFixed(1)}% mais conversão</span> que só enviar PDF.</>
              ) : parseFloat(stats.conversionSentOnly) > parseFloat(stats.conversionPresented) ? (
                <>Enviar PDF está convertendo <span className="text-amber-400 font-semibold">{(parseFloat(stats.conversionSentOnly) - parseFloat(stats.conversionPresented)).toFixed(1)}% mais</span> que apresentar em reunião.</>
              ) : (
                <>As duas abordagens têm a mesma taxa de conversão.</>
              )}
            </p>
          </div>
        )}
      </Card>

      {/* Análise de Aprendizado do Funil */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-violet-500">
            <TrendingUp size={20} className="text-gray-900" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100">Análise de Aprendizado</h3>
            <p className="text-sm text-gray-500">Probabilidades calculadas com base nos dados reais</p>
          </div>
        </div>

        <FunnelAnalysis data={data} />
      </Card>
    </div>
  );
};

// Componente de Análise do Funil com Aprendizado
const FunnelAnalysis = ({ data }) => {
  const analysis = useMemo(() => {
    // Filtrar clientes legacy (não contam nas estatísticas do CRM)
    const clients = (data.clients || []).filter(c => !c.isLegacy);
    const lostLeads = data.lostLeads || [];
    const leads = data.leads || [];
    
    // Total histórico de leads que já passaram pelo funil (finalizados)
    const totalHistorical = clients.length + lostLeads.length;
    
    if (totalHistorical < 1) {
      return { hasData: false };
    }

    // ========================================
    // CÁLCULO DO FUNIL COMPLETO
    // ========================================
    
    // 1. LEADS → ORÇAMENTOS
    // Quantos leads chegaram a receber orçamento (enviado ou apresentado)?
    const clientsWithProposal = clients.filter(c => c.proposalType === 'sent' || c.proposalType === 'presented');
    const lostWithProposal = lostLeads.filter(l => l.proposalType === 'sent' || l.proposalType === 'presented');
    const totalWithProposal = clientsWithProposal.length + lostWithProposal.length;
    
    // Taxa: de todos os leads finalizados, quantos % receberam orçamento?
    const leadToProposalRate = totalHistorical > 0 ? (totalWithProposal / totalHistorical) : 0;
    
    // 2. ORÇAMENTOS → FECHAMENTO
    // Dos que receberam orçamento, quantos fecharam?
    const proposalToCloseRate = totalWithProposal > 0 ? (clientsWithProposal.length / totalWithProposal) : 0;
    
    // 3. TAXA GERAL (Lead → Fechamento)
    const overallConversionRate = totalHistorical > 0 ? (clients.length / totalHistorical) : 0;
    
    // ========================================
    // CÁLCULOS PARA META
    // ========================================
    
    // Para fechar 1 projeto, quantos ORÇAMENTOS precisa fazer?
    const proposalsPerProject = proposalToCloseRate > 0 ? Math.ceil(1 / proposalToCloseRate) : 0;
    
    // Para fechar 1 projeto, quantos LEADS precisa contatar?
    const leadsPerProject = overallConversionRate > 0 ? Math.ceil(1 / overallConversionRate) : 0;
    
    // Para fazer 1 orçamento, quantos leads precisa contatar?
    const leadsPerProposal = leadToProposalRate > 0 ? Math.ceil(1 / leadToProposalRate) : 0;
    
    // ========================================
    // ANÁLISE POR TIPO DE PROPOSTA
    // ========================================
    
    const clientsSent = clients.filter(c => c.proposalType === 'sent').length;
    const clientsPresented = clients.filter(c => c.proposalType === 'presented').length;
    const lostSent = lostLeads.filter(l => l.proposalType === 'sent').length;
    const lostPresented = lostLeads.filter(l => l.proposalType === 'presented').length;
    
    const totalSent = clientsSent + lostSent;
    const totalPresented = clientsPresented + lostPresented;
    
    const conversionSent = totalSent > 0 ? (clientsSent / totalSent) : 0;
    const conversionPresented = totalPresented > 0 ? (clientsPresented / totalPresented) : 0;
    
    // ========================================
    // ANÁLISE POR ORIGEM
    // ========================================
    
    const sourceStats = {};
    [...clients, ...lostLeads].forEach(item => {
      const source = item.source || 'Outro';
      if (!sourceStats[source]) {
        sourceStats[source] = { total: 0, converted: 0, proposals: 0 };
      }
      sourceStats[source].total++;
      if (clients.find(c => c.id === item.id)) {
        sourceStats[source].converted++;
      }
      if (item.proposalType === 'sent' || item.proposalType === 'presented') {
        sourceStats[source].proposals++;
      }
    });
    
    const sourceRanking = Object.entries(sourceStats)
      .filter(([_, stats]) => stats.total >= 2)
      .map(([source, stats]) => ({
        source,
        total: stats.total,
        converted: stats.converted,
        proposals: stats.proposals,
        rate: stats.total > 0 ? (stats.converted / stats.total * 100) : 0
      }))
      .sort((a, b) => b.rate - a.rate);
    
    const bestSource = sourceRanking[0];
    const worstSource = sourceRanking[sourceRanking.length - 1];
    
    // ========================================
    // PROBABILIDADES POR ETAPA
    // ========================================
    
    const stageConversion = {};
    PIPELINE_STAGES.forEach(stage => {
      const baseProb = stage.probability / 100;
      const adjustedProb = baseProb * (overallConversionRate > 0 ? (overallConversionRate * 2) : 1);
      
      stageConversion[stage.id] = {
        name: stage.name,
        defaultProb: stage.probability,
        realProb: Math.min(Math.round(adjustedProb * 100), 95),
        leadsInStage: leads.filter(l => l.status === stage.id).length
      };
    });
    
    // Ticket médio
    const avgTicket = clients.length > 0 
      ? clients.reduce((acc, c) => acc + (c.value || 0), 0) / clients.length 
      : 0;
    
    // Receita potencial do funil atual
    const funnelPotential = leads.reduce((acc, lead) => {
      const stageProb = stageConversion[lead.status]?.realProb || 10;
      return acc + ((lead.value || 0) * stageProb / 100);
    }, 0);

    return {
      hasData: true,
      // Taxas do funil
      leadToProposalRate: (leadToProposalRate * 100).toFixed(1),
      proposalToCloseRate: (proposalToCloseRate * 100).toFixed(1),
      overallConversionRate: (overallConversionRate * 100).toFixed(1),
      // Quantidades para meta
      leadsPerProject,
      proposalsPerProject,
      leadsPerProposal,
      // Totais
      totalHistorical,
      totalWithProposal,
      totalClients: clients.length,
      // Origens
      bestSource,
      worstSource,
      sourceRanking,
      // Etapas
      stageConversion,
      // Valores
      avgTicket,
      funnelPotential,
      // Por tipo
      conversionSent: (conversionSent * 100).toFixed(1),
      conversionPresented: (conversionPresented * 100).toFixed(1),
      totalSent,
      totalPresented
    };
  }, [data]);

  if (!analysis.hasData) {
    return (
      <div className="text-center py-8">
        <div className="p-4 rounded-full bg-gray-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <TrendingUp size={24} className="text-gray-600" />
        </div>
        <p className="text-gray-400">Dados insuficientes para análise</p>
        <p className="text-gray-600 text-sm mt-1">Feche pelo menos 1 projeto para gerar insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Funil Visual */}
      <div className="p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/50 rounded-xl border border-gray-700">
        <h4 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <TrendingDown size={18} className="text-lime-400" />
          Seu Funil de Vendas (dados reais)
        </h4>
        <div className="flex items-center justify-between gap-2">
          {/* Leads */}
          <div className="flex-1 text-center">
            <div className="bg-lime-900/30 border border-lime-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-lime-400">{analysis.totalHistorical}</p>
              <p className="text-xs text-gray-400 mt-1">Leads contatados</p>
            </div>
          </div>
          
          <div className="text-gray-600">
            <ChevronDown size={24} className="rotate-[-90deg]" />
            <p className="text-xs text-center">{analysis.leadToProposalRate}%</p>
          </div>
          
          {/* Orçamentos */}
          <div className="flex-1 text-center">
            <div className="bg-violet-900/30 border border-violet-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-violet-400">{analysis.totalWithProposal}</p>
              <p className="text-xs text-gray-400 mt-1">Orçamentos feitos</p>
            </div>
          </div>
          
          <div className="text-gray-600">
            <ChevronDown size={24} className="rotate-[-90deg]" />
            <p className="text-xs text-center">{analysis.proposalToCloseRate}%</p>
          </div>
          
          {/* Fechados */}
          <div className="flex-1 text-center">
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-emerald-400">{analysis.totalClients}</p>
              <p className="text-xs text-gray-400 mt-1">Projetos fechados</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            Taxa geral: <span className="text-lime-400 font-semibold">{analysis.overallConversionRate}%</span> dos leads viram projeto
          </p>
        </div>
      </div>

      {/* Cards de Meta */}
      <div className="p-5 bg-gray-800/50 rounded-xl border border-lime-700/50">
        <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
          <Target size={18} className="text-lime-400" />
          Para fechar 1 projeto, você precisa de:
        </h4>
        <p className="text-sm text-gray-500 mb-4">Baseado no seu histórico real de conversões</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-lime-900/40 to-gray-900/50 rounded-xl border border-lime-600/50">
            <p className="text-5xl font-bold text-lime-400">{analysis.leadsPerProject}</p>
            <p className="text-lg text-gray-300 mt-1">leads para contatar</p>
            <p className="text-xs text-gray-500 mt-2">Taxa de conversão geral: {analysis.overallConversionRate}%</p>
          </div>
          
          <div className="p-5 bg-gradient-to-br from-violet-900/40 to-gray-900/50 rounded-xl border border-violet-600/50">
            <p className="text-5xl font-bold text-violet-400">{analysis.proposalsPerProject}</p>
            <p className="text-lg text-gray-300 mt-1">orçamentos para fazer</p>
            <p className="text-xs text-gray-500 mt-2">Taxa orçamento→fechamento: {analysis.proposalToCloseRate}%</p>
          </div>
        </div>
      </div>

      {/* Simulador de Meta Mensal */}
      <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
        <h4 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <Calculator size={18} className="text-cyan-400" />
          Simulador de Meta Mensal
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 5].map(target => (
            <div key={target} className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <p className="text-xs text-gray-500 mb-2">Meta: {target} projeto{target > 1 ? 's' : ''}/mês</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-lime-400">{analysis.leadsPerProject * target} leads</p>
                <p className="text-lg font-bold text-violet-400">{analysis.proposalsPerProject * target} orçamentos</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-800">
                <p className="text-sm text-emerald-400 font-semibold">R$ {(analysis.avgTicket * target).toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-600">receita estimada</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Probabilidades por Etapa */}
      <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700">
        <h4 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <Percent size={18} className="text-cyan-400" />
          Probabilidades Dinâmicas por Etapa
        </h4>
        <div className="space-y-3">
          {Object.values(analysis.stageConversion).filter(s => s.name !== "Fechado / Onboarding").map((stage) => (
            <div key={stage.name} className="flex items-center gap-4">
              <div className="w-40 text-sm text-gray-400 truncate">{stage.name}</div>
              <div className="flex-1 h-6 bg-gray-900 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-lime-600 to-lime-400 rounded-full transition-all"
                  style={{ width: `${stage.realProb}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {stage.realProb}% (padrão: {stage.defaultProb}%)
                </span>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm text-gray-500">{stage.leadsInStage} leads</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-4">
          * Probabilidades ajustadas automaticamente com base na taxa de conversão real do seu histórico
        </p>
      </div>

      {/* Melhor e Pior Origem */}
      {analysis.bestSource && analysis.worstSource && analysis.bestSource.source !== analysis.worstSource.source && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-emerald-900/20 rounded-xl border border-emerald-700/50">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight size={18} className="text-emerald-400" />
              <span className="font-semibold text-emerald-400">Melhor Origem</span>
            </div>
            <p className="text-2xl font-bold text-gray-200">{analysis.bestSource.source}</p>
            <p className="text-sm text-gray-400 mt-1">
              {analysis.bestSource.rate.toFixed(1)}% de conversão ({analysis.bestSource.converted}/{analysis.bestSource.total})
            </p>
          </div>
          <div className="p-5 bg-red-900/20 rounded-xl border border-red-700/50">
            <div className="flex items-center gap-2 mb-3">
              <ArrowDownRight size={18} className="text-red-400" />
              <span className="font-semibold text-red-400">Pior Origem</span>
            </div>
            <p className="text-2xl font-bold text-gray-200">{analysis.worstSource.source}</p>
            <p className="text-sm text-gray-400 mt-1">
              {analysis.worstSource.rate.toFixed(1)}% de conversão ({analysis.worstSource.converted}/{analysis.worstSource.total})
            </p>
          </div>
        </div>
      )}

      {/* Insights Automáticos */}
      <div className="p-5 bg-gray-800/30 rounded-xl border border-gray-700">
        <h4 className="font-semibold text-gray-200 mb-3">💡 Insights do Sistema</h4>
        <div className="space-y-2 text-sm text-gray-400">
          {analysis.conversionRate < 20 && (
            <p>• Sua taxa de conversão está abaixo de 20%. Foque em qualificar melhor os leads antes de avançar no funil.</p>
          )}
          {analysis.conversionRate >= 30 && (
            <p>• Excelente! Taxa de conversão acima de 30% indica um funil bem otimizado.</p>
          )}
          {parseFloat(analysis.conversionPresented) > parseFloat(analysis.conversionSent) + 10 && (
            <p>• Apresentar propostas em reunião converte {(parseFloat(analysis.conversionPresented) - parseFloat(analysis.conversionSent)).toFixed(0)}% melhor. Priorize apresentações ao vivo.</p>
          )}
          {analysis.bestSource && analysis.bestSource.rate > 40 && (
            <p>• <span className="text-lime-400">{analysis.bestSource.source}</span> é sua melhor fonte. Considere aumentar investimento neste canal.</p>
          )}
          {analysis.leadsPerProject > 10 && (
            <p>• Você precisa de muitos leads por fechamento. Revise seu processo de qualificação.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Pipeline View com Novos Estágios
const PipelineView = ({ data, updateData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedLeadForTimeline, setSelectedLeadForTimeline] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadForActivity, setSelectedLeadForActivity] = useState(null);
  const [selectedLeadForContacts, setSelectedLeadForContacts] = useState(null);
  const [leadToLose, setLeadToLose] = useState(null);
  const [lossReason, setLossReason] = useState("");
  const [customLossReason, setCustomLossReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activityForm, setActivityForm] = useState({
    type: "call", title: "", description: "", date: new Date().toISOString().split('T')[0], time: "09:00"
  });
  const [newContact, setNewContact] = useState({ name: "", role: "", phone: "", email: "" });
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", source: "Tráfego Pago", segment: "Sem segmento", status: "novo", value: 0, notes: "", createdAt: new Date().toISOString().split('T')[0], proposalType: "none", responsibleId: "", contacts: []
  });

  const teamMembers = data.teamMembers || [];
  const activeStages = PIPELINE_STAGES.filter(s => s.id !== "fechado");
  
  // Filtrar leads pela pesquisa
  const filteredLeads = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return data.leads;
    const term = searchTerm.toLowerCase().trim();
    const termDigits = term.replace(/\D/g, '');
    
    return data.leads.filter(lead => {
      const name = (lead.name || "").toLowerCase();
      const phone = (lead.phone || "").replace(/\D/g, '');
      const email = (lead.email || "").toLowerCase();
      
      // Busca por nome
      if (name.includes(term)) return true;
      
      // Busca por telefone (só dígitos)
      if (termDigits && phone.includes(termDigits)) return true;
      
      // Busca por email
      if (email.includes(term)) return true;
      
      // Busca em contatos adicionais
      if (lead.contacts && lead.contacts.length > 0) {
        const foundInContacts = lead.contacts.some(c => 
          (c.name || "").toLowerCase().includes(term) ||
          (c.phone || "").replace(/\D/g, '').includes(termDigits) ||
          (c.email || "").toLowerCase().includes(term)
        );
        if (foundInContacts) return true;
      }
      
      return false;
    });
  }, [data.leads, searchTerm]);
  
  const getStageLeads = (stageId) => filteredLeads.filter(l => l.status === stageId);
  const getStageValue = (stageId) => getStageLeads(stageId).reduce((acc, l) => acc + (l.value || 0), 0);
  
  const getLeadActivities = (leadId) => (data.activities || []).filter(a => a.leadId === leadId);
  const getLeadPendingActivities = (leadId) => getLeadActivities(leadId).filter(a => !a.completed);
  
  const getResponsible = (responsibleId) => teamMembers.find(m => m.id === responsibleId);

  // Função para gerar timeline completa do lead
  const getLeadTimeline = (lead) => {
    if (!lead) return [];
    
    const timeline = [];
    const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
    const formatDateTime = (date) => {
      const d = new Date(date);
      return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };
    
    // 1. Lead criado
    timeline.push({
      id: `lead-created-${lead.id}`,
      type: 'lead_created',
      icon: '🎯',
      title: 'Lead criado',
      description: `Origem: ${lead.source || 'Não informada'}`,
      date: lead.createdAt,
      dateFormatted: formatDate(lead.createdAt),
      color: 'bg-gray-600'
    });
    
    // 2. Histórico de contatos (comunicações)
    if (lead.contactHistory && lead.contactHistory.length > 0) {
      lead.contactHistory.forEach(contact => {
        timeline.push({
          id: `contact-${contact.id}`,
          type: 'contact',
          icon: '📞',
          title: 'Contato realizado',
          description: contact.note,
          date: contact.date,
          dateFormatted: formatDateTime(contact.date),
          color: 'bg-cyan-600'
        });
      });
    }
    
    // 3. Atividades relacionadas
    const activities = (data.activities || []).filter(a => a.leadId === lead.id);
    activities.forEach(activity => {
      const actType = ACTIVITY_TYPES.find(t => t.id === activity.type);
      timeline.push({
        id: `activity-${activity.id}`,
        type: 'activity',
        icon: activity.completed ? '✅' : '📅',
        title: activity.title,
        description: `${actType?.name || 'Atividade'}${activity.completed ? ' (concluída)' : ''}`,
        date: activity.date,
        dateFormatted: formatDate(activity.date),
        color: activity.completed ? 'bg-emerald-600' : 'bg-amber-600',
        completed: activity.completed
      });
    });
    
    // 4. Orçamentos vinculados
    const budgets = (data.budgets || []).filter(b => b.leadId === lead.id);
    budgets.forEach(budget => {
      timeline.push({
        id: `budget-${budget.id}`,
        type: 'budget',
        icon: '💰',
        title: `Orçamento: ${budget.name}`,
        description: `Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.calculatedValue || 0)}`,
        date: budget.createdAt,
        dateFormatted: formatDate(budget.createdAt),
        color: 'bg-emerald-600',
        link: { type: 'budget', id: budget.id }
      });
    });
    
    // 5. Mudanças de estágio (se houver histórico)
    if (lead.stageHistory && lead.stageHistory.length > 0) {
      lead.stageHistory.forEach(change => {
        const stage = PIPELINE_STAGES.find(s => s.id === change.to);
        timeline.push({
          id: `stage-${change.date}`,
          type: 'stage_change',
          icon: '📊',
          title: `Movido para ${stage?.name || change.to}`,
          description: change.reason || '',
          date: change.date,
          dateFormatted: formatDate(change.date),
          color: 'bg-violet-600'
        });
      });
    }
    
    // 6. Verificar se virou cliente
    const client = (data.clients || []).find(c => c.convertedFromLead === lead.id);
    if (client) {
      timeline.push({
        id: `converted-${client.id}`,
        type: 'converted',
        icon: '🎉',
        title: 'Convertido em Cliente!',
        description: `Valor do fechamento: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.value || 0)}`,
        date: client.closedAt || client.createdAt,
        dateFormatted: formatDate(client.closedAt || client.createdAt),
        color: 'bg-lime-600',
        link: { type: 'client', id: client.id }
      });
      
      // 7. Projetos do cliente
      const projects = (data.projects?.cards || []).filter(p => p.clientId === client.id);
      projects.forEach(project => {
        const col = (data.projects?.columns || []).find(c => c.id === project.columnId);
        timeline.push({
          id: `project-${project.id}`,
          type: 'project',
          icon: '📁',
          title: `Projeto: ${project.name}`,
          description: `Status: ${col?.name || 'Em andamento'}`,
          date: project.createdAt || client.closedAt,
          dateFormatted: formatDate(project.createdAt || client.closedAt),
          color: col?.color || 'bg-violet-600',
          link: { type: 'project', id: project.id }
        });
      });
      
      // 8. Pagamentos recebidos (entradas do financeiro vinculadas)
      const allEntries = [];
      Object.keys(data.financial?.months || {}).forEach(monthKey => {
        const monthData = data.financial.months[monthKey];
        (monthData.entries || []).forEach(entry => {
          if (entry.clientId === client.id) {
            allEntries.push({ ...entry, monthKey });
          }
        });
      });
      
      allEntries.forEach(entry => {
        if (entry.received > 0) {
          timeline.push({
            id: `payment-${entry.id}`,
            type: 'payment',
            icon: '💵',
            title: entry.description || 'Pagamento recebido',
            description: `Recebido: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.received)}`,
            date: entry.date || entry.monthKey,
            dateFormatted: formatDate(entry.date || entry.monthKey + '-01'),
            color: 'bg-emerald-600'
          });
        }
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return timeline;
  };

  const handleSave = () => {
    if (editingLead) {
      updateData(prev => ({
        ...prev,
        leads: prev.leads.map(l => l.id === editingLead.id ? { ...formData, id: l.id } : l)
      }));
    } else {
      const newLead = {
        ...formData,
        id: Date.now(),
        createdAt: formData.createdAt || new Date().toISOString().split('T')[0]
      };
      updateData(prev => ({ ...prev, leads: [...prev.leads, newLead] }));
    }
    setIsModalOpen(false);
    setEditingLead(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "", email: "", phone: "", source: "Tráfego Pago", segment: "Sem segmento", status: "novo", value: 0, notes: "", createdAt: new Date().toISOString().split('T')[0], proposalType: "none", responsibleId: "", contacts: []
    });
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({ ...lead, contacts: lead.contacts || [], responsibleId: lead.responsibleId || "" });
    setIsModalOpen(true);
  };

  // Funções de contatos
  const openContactsModal = (lead) => {
    setSelectedLeadForContacts(lead);
    setNewContact({ name: "", role: "", phone: "", email: "" });
    setIsContactsModalOpen(true);
  };

  const addContact = () => {
    if (!newContact.name || !selectedLeadForContacts) return;
    
    const contact = { ...newContact, id: Date.now() };
    updateData(prev => ({
      ...prev,
      leads: prev.leads.map(l => 
        l.id === selectedLeadForContacts.id 
          ? { ...l, contacts: [...(l.contacts || []), contact] }
          : l
      )
    }));
    setNewContact({ name: "", role: "", phone: "", email: "" });
    // Atualiza o lead selecionado
    setSelectedLeadForContacts(prev => ({
      ...prev,
      contacts: [...(prev.contacts || []), contact]
    }));
  };

  const removeContact = (contactId) => {
    updateData(prev => ({
      ...prev,
      leads: prev.leads.map(l => 
        l.id === selectedLeadForContacts.id 
          ? { ...l, contacts: (l.contacts || []).filter(c => c.id !== contactId) }
          : l
      )
    }));
    setSelectedLeadForContacts(prev => ({
      ...prev,
      contacts: (prev.contacts || []).filter(c => c.id !== contactId)
    }));
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      updateData(prev => ({ ...prev, leads: prev.leads.filter(l => l.id !== id) }));
    }
  };

  const moveToStage = (leadId, newStatus) => {
    if (newStatus === "fechado") {
      const lead = data.leads.find(l => l.id === leadId);
      if (lead) convertToClient(lead);
    } else {
      updateData(prev => ({
        ...prev,
        leads: prev.leads.map(l => l.id === leadId ? { 
          ...l, 
          status: newStatus,
          lastStageChange: new Date().toISOString(),
          stageHistory: [
            ...(l.stageHistory || []),
            { from: l.status, to: newStatus, date: new Date().toISOString() }
          ]
        } : l)
      }));
    }
  };

  const openLossModal = (lead) => {
    setLeadToLose(lead);
    setLossReason("");
    setCustomLossReason("");
    setIsLossModalOpen(true);
  };

  const handleMarkAsLost = () => {
    if (!leadToLose || !lossReason) return;
    
    const finalReason = lossReason === "Outro" ? customLossReason : lossReason;
    
    const lostLead = {
      ...leadToLose,
      lostReason: finalReason,
      lostDate: new Date().toISOString().split('T')[0]
    };
    
    updateData(prev => ({
      ...prev,
      leads: prev.leads.filter(l => l.id !== leadToLose.id),
      lostLeads: [...prev.lostLeads, lostLead]
    }));
    
    setIsLossModalOpen(false);
    setLeadToLose(null);
  };

  const convertToClient = (lead) => {
    const newClient = {
      id: Date.now(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.name,
      segment: lead.segment,
      source: lead.source,
      value: lead.value,
      proposalType: lead.proposalType,
      createdAt: lead.createdAt,
      closedAt: new Date().toISOString().split('T')[0],
    };
    updateData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient],
      leads: prev.leads.filter(l => l.id !== lead.id)
    }));
  };

  // Funções de Atividades
  const openActivityModal = (lead) => {
    setSelectedLeadForActivity(lead);
    setActivityForm({
      type: "call", title: "", description: "", date: new Date().toISOString().split('T')[0], time: "09:00"
    });
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = () => {
    if (!activityForm.title || !selectedLeadForActivity) return;
    
    const newActivity = {
      ...activityForm,
      id: Date.now(),
      leadId: selectedLeadForActivity.id,
      completed: false
    };
    
    updateData(prev => ({
      ...prev,
      activities: [...(prev.activities || []), newActivity]
    }));
    
    setIsActivityModalOpen(false);
    setSelectedLeadForActivity(null);
  };

  const toggleActivityComplete = (activityId) => {
    updateData(prev => ({
      ...prev,
      activities: (prev.activities || []).map(a => 
        a.id === activityId ? { ...a, completed: !a.completed } : a
      )
    }));
  };

  const deleteActivity = (activityId) => {
    updateData(prev => ({
      ...prev,
      activities: (prev.activities || []).filter(a => a.id !== activityId)
    }));
  };

  const getActivityIcon = (typeId) => {
    const iconMap = { call: Phone, meeting: Video, email: Mail, proposal: FileText, followup: Send, briefing: MessageSquare, reminder: AlertCircle, other: Calendar };
    return iconMap[typeId] || Calendar;
  };

  const segments = ["Sem segmento", "Gastronomia", "Arquitetura", "Beleza", "Tecnologia", "Saúde", "Jurídico", "Moda", "Fitness", "Imobiliário", "Educação", "Varejo", "Outro"];
  const sources = ["Tráfego Pago", "Instagram", "Site", "Indicação", "LinkedIn", "WhatsApp", "Prospecção Ativa", "Outro"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Pipeline de Vendas</h1>
          <p className="text-gray-500 mt-1">{filteredLeads.length} leads {searchTerm && `(de ${data.leads.length} total)`}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Legenda de tempo */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-gray-800/50 rounded-lg text-xs">
            <span className="text-gray-500">Tempo no estágio:</span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded border-2 border-gray-600"></span>
              <span className="text-gray-400">&lt;3d</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded border-2 border-amber-500"></span>
              <span className="text-amber-400">3-6d</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded border-2 border-red-500"></span>
              <span className="text-red-400">7d+</span>
            </span>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, telefone..."
              className="pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 w-64"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button icon={Plus} onClick={() => { setEditingLead(null); resetForm(); setIsModalOpen(true); }}>
            Novo Lead
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {activeStages.map((stage) => (
            <Card key={stage.id} className={`w-72 p-4 border-t-4 ${stage.color} flex-shrink-0`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-200 text-sm">{stage.name}</h3>
                  <p className="text-xs text-gray-500">{stage.probability}% probabilidade</p>
                </div>
                <span className="text-sm font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-lg">{getStageLeads(stage.id).length}</span>
              </div>
              <p className="text-sm text-lime-400 font-semibold mb-4">
                R$ {getStageValue(stage.id).toLocaleString('pt-BR')}
              </p>
              
              <div className="space-y-3 max-h-[450px] overflow-y-auto">
                {getStageLeads(stage.id).map((lead) => {
                  const responsible = getResponsible(lead.responsibleId);
                  
                  // Calcular dias no estágio atual
                  const lastStageChange = lead.lastStageChange || lead.createdAt;
                  const daysInStage = Math.floor((new Date() - new Date(lastStageChange)) / (1000 * 60 * 60 * 24));
                  
                  // Definir cor da borda baseado no tempo
                  let borderColor = 'border-gray-700 hover:border-lime-500/50'; // < 3 dias (normal)
                  let timeIndicator = null;
                  
                  if (daysInStage >= 7) {
                    borderColor = 'border-red-500/70 hover:border-red-400';
                    timeIndicator = { color: 'text-red-400 bg-red-900/50', label: `${daysInStage}d` };
                  } else if (daysInStage >= 3) {
                    borderColor = 'border-amber-500/70 hover:border-amber-400';
                    timeIndicator = { color: 'text-amber-400 bg-amber-900/50', label: `${daysInStage}d` };
                  }
                  
                  return (
                  <div 
                    key={lead.id} 
                    className={`p-3 bg-gray-800/80 rounded-xl border-2 ${borderColor} transition-all group relative`}
                    title={`Há ${daysInStage} dia${daysInStage !== 1 ? 's' : ''} neste estágio`}
                  >
                    {/* Indicador de tempo no canto */}
                    {timeIndicator && (
                      <div className={`absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${timeIndicator.color}`}>
                        {timeIndicator.label}
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {responsible && (
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-600" title={responsible.name}>
                              {responsible.photo ? (
                                <img src={responsible.photo} alt={responsible.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-lime-600 flex items-center justify-center text-xs font-bold text-gray-900">
                                  {responsible.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          )}
                          <p className="font-medium text-gray-200 text-sm truncate">{lead.name}</p>
                        </div>
                        <p className="text-xs text-lime-400 mt-1">R$ {(lead.value || 0).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button 
                          onClick={() => handleEdit(lead)} 
                          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)} 
                          className="p-1.5 hover:bg-red-900/50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-lime-900/50 rounded-full text-lime-400">{lead.source}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-400">{lead.segment}</span>
                      {getLeadPendingActivities(lead.id).length > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-cyan-900/50 rounded-full text-cyan-400 flex items-center gap-1">
                          <CalendarDays size={10} />
                          {getLeadPendingActivities(lead.id).length}
                        </span>
                      )}
                      {(lead.contacts || []).length > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-violet-900/50 rounded-full text-violet-400 flex items-center gap-1">
                          <Users size={10} />
                          {lead.contacts.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center justify-between gap-2">
                        <select
                          onChange={(e) => e.target.value && moveToStage(lead.id, e.target.value)}
                          className="flex-1 text-xs py-1.5 px-2 bg-gray-700 text-gray-300 rounded-lg border-0 cursor-pointer min-w-0"
                          defaultValue=""
                        >
                          <option value="">Mover...</option>
                          {PIPELINE_STAGES.filter(s => s.id !== stage.id).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => { setSelectedLeadForTimeline(lead); setIsTimelineModalOpen(true); }}
                            className="p-1.5 bg-amber-900/50 text-amber-400 rounded-lg hover:bg-amber-900 transition-colors"
                            title="Ver Histórico"
                          >
                            <Clock size={12} />
                          </button>
                          <button 
                            onClick={() => openContactsModal(lead)}
                            className="p-1.5 bg-violet-900/50 text-violet-400 rounded-lg hover:bg-violet-900 transition-colors"
                            title="Contatos"
                          >
                            <Users size={12} />
                          </button>
                          <button 
                            onClick={() => openActivityModal(lead)}
                            className="p-1.5 bg-cyan-900/50 text-cyan-400 rounded-lg hover:bg-cyan-900 transition-colors"
                            title="Atividades"
                          >
                            <CalendarDays size={12} />
                          </button>
                          <button 
                            onClick={() => openLossModal(lead)}
                            className="p-1.5 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900 transition-colors"
                            title="Perdido"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
                
                {getStageLeads(stage.id).length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    <Target size={28} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhum lead</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Novo/Editar Lead */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLead ? "Editar Lead" : "Novo Lead"} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nome / Empresa" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} placeholder="Nome do lead" />
          <Input label="Valor Estimado (R$)" type="number" value={formData.value} onChange={(v) => setFormData({...formData, value: parseInt(v) || 0})} />
          <Input label="Email (principal)" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="email@exemplo.com" />
          
          {/* Telefone com botão WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-400">Telefone (principal)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(00) 00000-0000"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
              />
              {formData.phone && (
                <a
                  href={`https://wa.me/${formData.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl transition-colors flex items-center justify-center"
                  title="Abrir WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          <Select
            label="Origem"
            value={formData.source}
            onChange={(v) => setFormData({...formData, source: v})}
            options={sources.map(s => ({ value: s, label: s }))}
          />
          <Select
            label="Segmento"
            value={formData.segment}
            onChange={(v) => setFormData({...formData, segment: v})}
            options={segments.map(s => ({ value: s, label: s }))}
          />
          <Select
            label="Etapa"
            value={formData.status}
            onChange={(v) => setFormData({...formData, status: v})}
            options={activeStages.map(s => ({ value: s.id, label: s.name }))}
          />
          <Select
            label="Tipo de Proposta"
            value={formData.proposalType || "none"}
            onChange={(v) => setFormData({...formData, proposalType: v})}
            options={[
              { value: "none", label: "Ainda não enviou proposta" },
              { value: "sent", label: "Orçamento enviado (só PDF/email)" },
              { value: "presented", label: "Proposta apresentada (reunião)" },
            ]}
          />
          <Select
            label="Responsável"
            value={formData.responsibleId || ""}
            onChange={(v) => setFormData({...formData, responsibleId: v})}
            options={[
              { value: "", label: "Sem responsável" },
              ...teamMembers.map(m => ({ value: m.id.toString(), label: m.name }))
            ]}
          />
          <Input label="Data de Entrada" type="date" value={formData.createdAt} onChange={(v) => setFormData({...formData, createdAt: v})} />
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-400">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full mt-1.5 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
              rows={3}
              placeholder="Anotações sobre o lead..."
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          {editingLead ? (
            <div className="flex gap-2">
              <button
                onClick={() => { setIsModalOpen(false); openContactsModal(editingLead); }}
                className="flex items-center gap-2 px-4 py-2 text-violet-400 hover:bg-violet-900/30 rounded-xl transition-colors"
              >
                <Users size={18} />
                <span className="text-sm font-medium">Contatos ({(editingLead.contacts || []).length})</span>
              </button>
              <button
                onClick={() => { setIsModalOpen(false); openActivityModal(editingLead); }}
                className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:bg-cyan-900/30 rounded-xl transition-colors"
              >
                <CalendarDays size={18} />
                <span className="text-sm font-medium">Atividades</span>
              </button>
            </div>
          ) : <div />}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingLead ? "Salvar" : "Criar Lead"}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Contatos do Lead */}
      <Modal isOpen={isContactsModalOpen} onClose={() => setIsContactsModalOpen(false)} title={selectedLeadForContacts ? `Contatos - ${selectedLeadForContacts.name}` : "Contatos"}>
        {selectedLeadForContacts && (
          <div className="space-y-6">
            {/* Lista de contatos existentes */}
            {(selectedLeadForContacts.contacts || []).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Contatos cadastrados</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(selectedLeadForContacts.contacts || []).map(contact => (
                    <div key={contact.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200 text-sm">{contact.name}</p>
                            {contact.role && <p className="text-xs text-violet-400">{contact.role}</p>}
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {contact.phone}
                            </span>
                          )}
                          {contact.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} />
                              {contact.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {contact.phone && (
                          <a
                            href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                        )}
                        <button onClick={() => removeContact(contact.id)} className="p-2 hover:bg-red-900/50 rounded-lg">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulário novo contato */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Adicionar novo contato</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Nome" 
                  value={newContact.name} 
                  onChange={(v) => setNewContact({...newContact, name: v})} 
                  placeholder="Nome do contato"
                />
                <Input 
                  label="Cargo / Função" 
                  value={newContact.role} 
                  onChange={(v) => setNewContact({...newContact, role: v})} 
                  placeholder="Ex: Diretor, Gerente..."
                />
                <Input 
                  label="Telefone" 
                  value={newContact.phone} 
                  onChange={(v) => setNewContact({...newContact, phone: v})} 
                  placeholder="(00) 00000-0000"
                />
                <Input 
                  label="Email" 
                  value={newContact.email} 
                  onChange={(v) => setNewContact({...newContact, email: v})} 
                  placeholder="email@exemplo.com"
                />
              </div>
              <Button className="mt-4" icon={UserPlus} onClick={addContact} disabled={!newContact.name}>
                Adicionar Contato
              </Button>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={() => setIsContactsModalOpen(false)}>Fechar</Button>
        </div>
      </Modal>

      {/* Modal Motivo de Perda */}
      <Modal isOpen={isLossModalOpen} onClose={() => setIsLossModalOpen(false)} title="Marcar Lead como Perdido" size="sm">
        <div className="space-y-4">
          {leadToLose && (
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <p className="font-medium text-gray-200">{leadToLose.name}</p>
              <p className="text-sm text-gray-500">R$ {(leadToLose.value || 0).toLocaleString('pt-BR')}</p>
            </div>
          )}
          
          <Select
            label="Motivo da Perda"
            value={lossReason}
            onChange={setLossReason}
            options={[
              { value: "", label: "Selecione um motivo..." },
              ...data.lossReasons.map(r => ({ value: r, label: r }))
            ]}
          />
          
          {lossReason === "Outro" && (
            <Input
              label="Especifique o motivo"
              value={customLossReason}
              onChange={setCustomLossReason}
              placeholder="Descreva o motivo..."
            />
          )}
          
          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              <MessageSquare size={16} className="inline mr-2" />
              Este registro ajudará a entender os motivos de perda.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsLossModalOpen(false)}>Cancelar</Button>
          <Button 
            variant="danger" 
            onClick={handleMarkAsLost}
            disabled={!lossReason || (lossReason === "Outro" && !customLossReason)}
          >
            Confirmar Perda
          </Button>
        </div>
      </Modal>

      {/* Modal Atividades do Lead */}
      <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title={selectedLeadForActivity ? `Atividades - ${selectedLeadForActivity.name}` : "Atividades"}>
        {selectedLeadForActivity && (
          <div className="space-y-6">
            {/* Lista de atividades existentes */}
            {getLeadActivities(selectedLeadForActivity.id).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Atividades agendadas</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getLeadActivities(selectedLeadForActivity.id).map(activity => {
                    const IconComp = getActivityIcon(activity.type);
                    const actType = ACTIVITY_TYPES.find(t => t.id === activity.type);
                    return (
                      <div key={activity.id} className={`p-3 rounded-lg border ${activity.completed ? 'bg-gray-800/30 border-gray-800 opacity-60' : 'bg-gray-800/50 border-gray-700'}`}>
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleActivityComplete(activity.id)}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${activity.completed ? 'bg-lime-500 border-lime-500' : 'border-gray-600 hover:border-lime-500'}`}
                          >
                            {activity.completed && <Check size={12} className="text-gray-900" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`p-1 rounded ${actType?.color || 'bg-gray-700'}`}>
                                <IconComp size={12} />
                              </span>
                              <span className={`text-sm font-medium ${activity.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                {activity.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{activity.date}</span>
                              {activity.time && <span>{activity.time}</span>}
                            </div>
                          </div>
                          <button onClick={() => deleteActivity(activity.id)} className="p-1 hover:bg-red-900/50 rounded">
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Formulário nova atividade */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Nova atividade</h4>
              <div className="space-y-3">
                <Select
                  label="Tipo"
                  value={activityForm.type}
                  onChange={(v) => setActivityForm({...activityForm, type: v})}
                  options={ACTIVITY_TYPES.map(t => ({ value: t.id, label: t.name }))}
                />
                <Input 
                  label="Título" 
                  value={activityForm.title} 
                  onChange={(v) => setActivityForm({...activityForm, title: v})} 
                  placeholder="Ex: Ligar para agendar reunião"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    label="Data" 
                    type="date" 
                    value={activityForm.date} 
                    onChange={(v) => setActivityForm({...activityForm, date: v})} 
                  />
                  <Input 
                    label="Horário" 
                    type="time" 
                    value={activityForm.time} 
                    onChange={(v) => setActivityForm({...activityForm, time: v})} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsActivityModalOpen(false)}>Fechar</Button>
          <Button onClick={handleSaveActivity} disabled={!activityForm.title}>Adicionar Atividade</Button>
        </div>
      </Modal>

      {/* Modal Timeline / Histórico do Lead */}
      <Modal isOpen={isTimelineModalOpen} onClose={() => { setIsTimelineModalOpen(false); setSelectedLeadForTimeline(null); }} title="📜 Histórico Completo">
        {selectedLeadForTimeline && (() => {
          const timeline = getLeadTimeline(selectedLeadForTimeline);
          const client = (data.clients || []).find(c => c.convertedFromLead === selectedLeadForTimeline.id);
          
          return (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Header com info do lead */}
              <div className="p-4 bg-gray-800 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">{selectedLeadForTimeline.name}</h3>
                    {selectedLeadForTimeline.company && (
                      <p className="text-sm text-gray-400">{selectedLeadForTimeline.company}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-lime-900/50 rounded-full text-lime-400">{selectedLeadForTimeline.source}</span>
                      <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">{selectedLeadForTimeline.segment}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-lime-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedLeadForTimeline.value || 0)}
                    </p>
                    {client && (
                      <span className="text-xs px-2 py-1 bg-emerald-900/50 rounded-full text-emerald-400">✓ Cliente</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Status atual */}
              <div className="flex items-center gap-2 px-2">
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  {PIPELINE_STAGES.slice(0, -1).map((stage, idx) => {
                    const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === selectedLeadForTimeline.status);
                    const isActive = idx <= currentIdx || client;
                    return (
                      <div 
                        key={stage.id}
                        className="h-full float-left transition-all"
                        style={{ 
                          width: `${100 / (PIPELINE_STAGES.length - 1)}%`,
                          backgroundColor: isActive ? (client ? '#22c55e' : '#84cc16') : '#374151'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                {PIPELINE_STAGES.slice(0, -1).map(stage => (
                  <span key={stage.id} className={selectedLeadForTimeline.status === stage.id ? 'text-lime-400 font-bold' : ''}>
                    {stage.name}
                  </span>
                ))}
              </div>
              
              {/* Timeline */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Clock size={14} /> Linha do Tempo
                </h4>
                
                {timeline.length > 0 ? (
                  <div className="relative">
                    {/* Linha vertical */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
                    
                    <div className="space-y-4">
                      {timeline.map((item, idx) => (
                        <div key={item.id} className="relative flex gap-4 pl-10">
                          {/* Ícone */}
                          <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${item.color} shadow-lg`}>
                            {item.icon}
                          </div>
                          
                          {/* Conteúdo */}
                          <div className="flex-1 p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-200">{item.title}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{item.dateFormatted}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum evento registrado ainda</p>
                  </div>
                )}
              </div>
              
              {/* Resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-700">
                <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-cyan-400">
                    {(data.activities || []).filter(a => a.leadId === selectedLeadForTimeline.id).length}
                  </p>
                  <p className="text-xs text-gray-500">Atividades</p>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-violet-400">
                    {(selectedLeadForTimeline.contactHistory || []).length}
                  </p>
                  <p className="text-xs text-gray-500">Contatos</p>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-amber-400">
                    {(data.budgets || []).filter(b => b.leadId === selectedLeadForTimeline.id).length}
                  </p>
                  <p className="text-xs text-gray-500">Orçamentos</p>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold text-emerald-400">
                    {Math.floor((new Date() - new Date(selectedLeadForTimeline.createdAt)) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-xs text-gray-500">Dias no funil</p>
                </div>
              </div>
            </div>
          );
        })()}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => { setIsTimelineModalOpen(false); setSelectedLeadForTimeline(null); }}>Fechar</Button>
        </div>
      </Modal>
    </div>
  );
};

// Clients View
const ClientsView = ({ data, updateData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [showLegacyOnly, setShowLegacyOnly] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedClientForTimeline, setSelectedClientForTimeline] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", company: "", email: "", phone: "", cnpj: "", city: "", segment: "", value: 0 });

  const segments = [...new Set(data.clients.map(c => c.segment).filter(Boolean))];

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  // Função para gerar timeline do cliente
  const getClientTimeline = (client) => {
    if (!client) return [];
    
    const timeline = [];
    const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
    const formatDateTime = (date) => {
      const d = new Date(date);
      return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };
    
    // 1. Buscar lead original
    const originalLead = (data.leads || []).find(l => l.id === client.convertedFromLead);
    const lostLead = (data.lostLeads || []).find(l => l.convertedFromLead === client.convertedFromLead || l.id === client.convertedFromLead);
    
    if (originalLead) {
      // Lead criado
      timeline.push({
        id: `lead-created`,
        type: 'lead_created',
        icon: '🎯',
        title: 'Lead criado',
        description: `Origem: ${originalLead.source || 'Não informada'}`,
        date: originalLead.createdAt,
        dateFormatted: formatDate(originalLead.createdAt),
        color: 'bg-gray-600'
      });
      
      // Contatos do lead
      if (originalLead.contactHistory && originalLead.contactHistory.length > 0) {
        originalLead.contactHistory.forEach(contact => {
          timeline.push({
            id: `contact-${contact.id}`,
            type: 'contact',
            icon: '📞',
            title: 'Contato realizado',
            description: contact.note,
            date: contact.date,
            dateFormatted: formatDateTime(contact.date),
            color: 'bg-cyan-600'
          });
        });
      }
    }
    
    // 2. Atividades vinculadas ao lead ou cliente
    const activities = (data.activities || []).filter(a => 
      a.leadId === client.convertedFromLead || a.clientId === client.id
    );
    activities.forEach(activity => {
      const actType = ACTIVITY_TYPES.find(t => t.id === activity.type);
      timeline.push({
        id: `activity-${activity.id}`,
        type: 'activity',
        icon: activity.completed ? '✅' : '📅',
        title: activity.title,
        description: `${actType?.name || 'Atividade'}${activity.completed ? ' (concluída)' : ''}`,
        date: activity.date,
        dateFormatted: formatDate(activity.date),
        color: activity.completed ? 'bg-emerald-600' : 'bg-amber-600'
      });
    });
    
    // 3. Orçamentos vinculados
    const budgets = (data.budgets || []).filter(b => 
      b.leadId === client.convertedFromLead || b.clientId === client.id
    );
    budgets.forEach(budget => {
      timeline.push({
        id: `budget-${budget.id}`,
        type: 'budget',
        icon: '💰',
        title: `Orçamento: ${budget.name}`,
        description: formatCurrency(budget.calculatedValue || 0),
        date: budget.createdAt,
        dateFormatted: formatDate(budget.createdAt),
        color: 'bg-amber-600'
      });
    });
    
    // 4. Conversão em cliente
    timeline.push({
      id: `converted`,
      type: 'converted',
      icon: '🎉',
      title: 'Fechou negócio!',
      description: `Valor: ${formatCurrency(client.value || 0)}`,
      date: client.closedAt || client.createdAt,
      dateFormatted: formatDate(client.closedAt || client.createdAt),
      color: 'bg-lime-600'
    });
    
    // 5. Projetos
    const projects = (data.projects?.cards || []).filter(p => p.clientId === client.id);
    projects.forEach(project => {
      const col = (data.projects?.columns || []).find(c => c.id === project.columnId);
      timeline.push({
        id: `project-${project.id}`,
        type: 'project',
        icon: '📁',
        title: `Projeto: ${project.name}`,
        description: `Status: ${col?.name || 'Em andamento'}`,
        date: project.createdAt || client.closedAt,
        dateFormatted: formatDate(project.createdAt || client.closedAt),
        color: 'bg-violet-600'
      });
    });
    
    // 6. Pagamentos recebidos
    const allEntries = [];
    Object.keys(data.financial?.months || {}).forEach(monthKey => {
      const monthData = data.financial.months[monthKey];
      (monthData.entries || []).forEach(entry => {
        if (entry.clientId === client.id) {
          allEntries.push({ ...entry, monthKey });
        }
      });
    });
    
    allEntries.forEach(entry => {
      if (entry.received > 0) {
        timeline.push({
          id: `payment-${entry.id}`,
          type: 'payment',
          icon: '💵',
          title: entry.description || 'Pagamento recebido',
          description: `Recebido: ${formatCurrency(entry.received)}`,
          date: entry.date || entry.monthKey + '-15',
          dateFormatted: formatDate(entry.date || entry.monthKey + '-15'),
          color: 'bg-emerald-600'
        });
      }
    });
    
    // Ordenar por data
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return timeline;
  };

  const filteredClients = useMemo(() => {
    return data.clients.filter(client => {
      const matchesSearch = (client.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (client.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (client.cnpj || "").includes(searchTerm) ||
                           (client.city || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = segmentFilter === "all" || client.segment === segmentFilter;
      const matchesLegacy = !showLegacyOnly || client.isLegacy;
      return matchesSearch && matchesSegment && matchesLegacy;
    });
  }, [data.clients, searchTerm, segmentFilter, showLegacyOnly]);

  // Clientes do CRM (não legacy) para estatísticas
  const crmClients = useMemo(() => data.clients.filter(c => !c.isLegacy), [data.clients]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setEditForm({
      name: client.name || "",
      company: client.company || "",
      email: client.email || "",
      phone: client.phone || "",
      cnpj: client.cnpj || "",
      city: client.city || "",
      segment: client.segment || "",
      value: client.value || 0
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    updateData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === editingClient.id ? { ...c, ...editForm } : c)
    }));
    setIsEditModalOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      updateData(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== id) }));
    }
  };

  // Exportar para contabilidade
  const exportForAccounting = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    // Buscar entradas do mês que têm clientId
    const monthData = data.financial?.months?.[monthKey] || { entries: [] };
    const entriesWithClient = (monthData.entries || []).filter(e => e.clientId);
    
    // Criar mapa de valores por cliente - usa valor previsto (valor da nota)
    const clientPayments = {};
    entriesWithClient.forEach(entry => {
      if (!clientPayments[entry.clientId]) {
        clientPayments[entry.clientId] = 0;
      }
      // Usa predicted (valor da nota) ao invés de received (valor líquido com taxas)
      clientPayments[entry.clientId] += entry.predicted || entry.received || 0;
    });
    
    // Gerar CSV
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let csv = "Nome,Empresa,CNPJ,Cidade,Valor\n";
    
    Object.entries(clientPayments).forEach(([clientId, value]) => {
      const client = data.clients.find(c => c.id === parseInt(clientId));
      if (client && value > 0) {
        csv += `"${client.name || ''}","${client.company || ''}","${client.cnpj || ''}","${client.city || ''}","${value.toFixed(2).replace('.', ',')}"\n`;
      }
    });
    
    // Se não há pagamentos vinculados, exportar todos os clientes com valor
    if (Object.keys(clientPayments).length === 0) {
      filteredClients.forEach(client => {
        csv += `"${client.name || ''}","${client.company || ''}","${client.cnpj || ''}","${client.city || ''}","${(client.value || 0).toFixed(2).replace('.', ',')}"\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_contabilidade_${months[currentMonth]}_${currentYear}.csv`;
    link.click();
  };

  const totalValue = filteredClients.reduce((acc, c) => acc + (c.value || 0), 0);
  const legacyCount = data.clients.filter(c => c.isLegacy).length;
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: "", company: "", email: "", phone: "", cnpj: "", city: "", segment: "", value: 0 });

  const handleCreateClient = () => {
    if (!newClientForm.name) return;
    
    const newClient = {
      id: Date.now(),
      ...newClientForm,
      value: parseFloat(newClientForm.value) || 0,
      isLegacy: true, // Não afeta estatísticas do CRM
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    updateData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
    
    setIsNewClientModalOpen(false);
    setNewClientForm({ name: "", company: "", email: "", phone: "", cnpj: "", city: "", segment: "", value: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Clientes</h1>
          <p className="text-gray-500 mt-1">
            {crmClients.length} do CRM {legacyCount > 0 && `+ ${legacyCount} antigos`} • R$ {totalValue.toLocaleString('pt-BR')} faturado
          </p>
        </div>
        <div className="flex gap-2">
          <Button icon={Download} variant="secondary" onClick={exportForAccounting}>
            Exportar p/ Contabilidade
          </Button>
          <Button icon={Plus} onClick={() => setIsNewClientModalOpen(true)}>
            Cadastrar Cliente
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar por nome, CNPJ ou cidade..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
            />
          </div>
          {segments.length > 0 && (
            <Select
              value={segmentFilter}
              onChange={setSegmentFilter}
              options={[
                { value: "all", label: "Todos os segmentos" },
                ...segments.map(s => ({ value: s, label: s }))
              ]}
            />
          )}
          {legacyCount > 0 && (
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showLegacyOnly}
                onChange={(e) => setShowLegacyOnly(e.target.checked)}
                className="rounded border-gray-600 text-amber-500 focus:ring-amber-500"
              />
              Só antigos
            </label>
          )}
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className={`p-5 hover:border-lime-500/30 transition-all ${client.isLegacy ? 'border-amber-800/50' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0 ${client.isLegacy ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-lime-400 to-emerald-500'}`}>
                  {(client.name || "?").charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-100">{client.name}</h3>
                    {client.isLegacy && <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 text-amber-400 rounded">ANTIGO</span>}
                  </div>
                  {client.company && <p className="text-sm text-gray-400">{client.company}</p>}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                    {client.email && <span>{client.email}</span>}
                    {client.phone && <span>{client.phone}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mt-1">
                    {client.cnpj && <span className="text-cyan-400">{client.cnpj}</span>}
                    {client.city && <span className="text-gray-500">📍 {client.city}</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-gray-500">Valor fechado</p>
                  <p className="font-semibold text-lime-400">R$ {(client.value || 0).toLocaleString('pt-BR')}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {client.segment && <Badge variant="lime">{client.segment}</Badge>}
                  {client.source && <Badge variant="info">{client.source}</Badge>}
                </div>
                
                <button 
                  onClick={() => { setSelectedClientForTimeline(client); setIsTimelineModalOpen(true); }}
                  className="p-2 hover:bg-amber-900/50 rounded-lg transition-colors"
                  title="Ver Histórico"
                >
                  <Clock size={16} className="text-amber-400" />
                </button>
                <button onClick={() => handleEdit(client)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Edit2 size={16} className="text-gray-500" />
                </button>
                <button onClick={() => handleDelete(client.id)} className="p-2 hover:bg-red-900/50 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
            
            {(client.createdAt || client.closedAt) && !client.isLegacy && (
              <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-800 text-sm">
                {client.createdAt && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span>Entrada: {new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {client.closedAt && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Check size={14} className="text-emerald-500" />
                    <span>Fechado: {new Date(client.closedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
        
        {filteredClients.length === 0 && (
          <Card className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">Nenhum cliente encontrado</p>
            <p className="text-gray-600 text-sm mt-2">Feche leads no pipeline para adicionar clientes</p>
          </Card>
        )}
      </div>

      {/* Modal Editar Cliente */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Cliente">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome / Contato" value={editForm.name} onChange={(v) => setEditForm({...editForm, name: v})} />
            <Input label="Empresa" value={editForm.company} onChange={(v) => setEditForm({...editForm, company: v})} placeholder="Nome da empresa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={editForm.email} onChange={(v) => setEditForm({...editForm, email: v})} />
            <Input label="Telefone" value={editForm.phone} onChange={(v) => setEditForm({...editForm, phone: v})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="CNPJ" value={editForm.cnpj} onChange={(v) => setEditForm({...editForm, cnpj: v})} placeholder="00.000.000/0000-00" />
            <Input label="Cidade" value={editForm.city} onChange={(v) => setEditForm({...editForm, city: v})} placeholder="Ex: São Paulo - SP" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Segmento" value={editForm.segment} onChange={(v) => setEditForm({...editForm, segment: v})} />
            <Input label="Valor (R$)" type="number" value={editForm.value} onChange={(v) => setEditForm({...editForm, value: parseFloat(v) || 0})} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit}>Salvar</Button>
        </div>
      </Modal>

      {/* Modal Cadastrar Novo Cliente */}
      <Modal isOpen={isNewClientModalOpen} onClose={() => setIsNewClientModalOpen(false)} title="Cadastrar Cliente">
        <div className="space-y-4">
          <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-xl">
            <p className="text-sm text-amber-400">
              ⚠️ Clientes cadastrados aqui não afetam as estatísticas do CRM (dashboard, funil, metas). 
              Use para clientes antigos ou que não passaram pelo pipeline.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome / Contato" value={newClientForm.name} onChange={(v) => setNewClientForm({...newClientForm, name: v})} placeholder="Nome do contato" />
            <Input label="Empresa" value={newClientForm.company} onChange={(v) => setNewClientForm({...newClientForm, company: v})} placeholder="Nome da empresa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={newClientForm.email} onChange={(v) => setNewClientForm({...newClientForm, email: v})} />
            <Input label="Telefone" value={newClientForm.phone} onChange={(v) => setNewClientForm({...newClientForm, phone: v})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="CNPJ" value={newClientForm.cnpj} onChange={(v) => setNewClientForm({...newClientForm, cnpj: v})} placeholder="00.000.000/0000-00" />
            <Input label="Cidade" value={newClientForm.city} onChange={(v) => setNewClientForm({...newClientForm, city: v})} placeholder="Ex: São Paulo - SP" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Segmento" value={newClientForm.segment} onChange={(v) => setNewClientForm({...newClientForm, segment: v})} />
            <Input label="Valor Total (R$)" type="number" value={newClientForm.value} onChange={(v) => setNewClientForm({...newClientForm, value: v})} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsNewClientModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateClient} disabled={!newClientForm.name}>Cadastrar</Button>
        </div>
      </Modal>

      {/* Modal Timeline / Histórico do Cliente */}
      <Modal isOpen={isTimelineModalOpen} onClose={() => { setIsTimelineModalOpen(false); setSelectedClientForTimeline(null); }} title="📜 Jornada do Cliente">
        {selectedClientForTimeline && (() => {
          const timeline = getClientTimeline(selectedClientForTimeline);
          const projects = (data.projects?.cards || []).filter(p => p.clientId === selectedClientForTimeline.id);
          
          // Calcular total recebido
          let totalReceived = 0;
          Object.keys(data.financial?.months || {}).forEach(monthKey => {
            const monthData = data.financial.months[monthKey];
            (monthData.entries || []).forEach(entry => {
              if (entry.clientId === selectedClientForTimeline.id) {
                totalReceived += entry.received || 0;
              }
            });
          });
          
          return (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Header com info do cliente */}
              <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-lime-900/30 border border-emerald-700 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">{selectedClientForTimeline.name}</h3>
                    {selectedClientForTimeline.company && (
                      <p className="text-sm text-gray-400">{selectedClientForTimeline.company}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {selectedClientForTimeline.segment && (
                        <span className="text-xs px-2 py-1 bg-lime-900/50 rounded-full text-lime-400">{selectedClientForTimeline.segment}</span>
                      )}
                      {selectedClientForTimeline.city && (
                        <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">{selectedClientForTimeline.city}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Valor do contrato</p>
                    <p className="text-xl font-bold text-lime-400">{formatCurrency(selectedClientForTimeline.value || 0)}</p>
                  </div>
                </div>
              </div>
              
              {/* Cards de resumo */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-800 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalReceived)}</p>
                  <p className="text-xs text-gray-500">Total Recebido</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl text-center">
                  <p className="text-2xl font-bold text-violet-400">{projects.length}</p>
                  <p className="text-xs text-gray-500">Projetos</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-xl text-center">
                  <p className="text-2xl font-bold text-cyan-400">
                    {selectedClientForTimeline.closedAt 
                      ? Math.floor((new Date() - new Date(selectedClientForTimeline.closedAt)) / (1000 * 60 * 60 * 24))
                      : '-'
                    }
                  </p>
                  <p className="text-xs text-gray-500">Dias como cliente</p>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Clock size={14} /> Linha do Tempo
                </h4>
                
                {timeline.length > 0 ? (
                  <div className="relative">
                    {/* Linha vertical */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
                    
                    <div className="space-y-4">
                      {timeline.map((item, idx) => (
                        <div key={item.id} className="relative flex gap-4 pl-10">
                          {/* Ícone */}
                          <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${item.color} shadow-lg`}>
                            {item.icon}
                          </div>
                          
                          {/* Conteúdo */}
                          <div className="flex-1 p-3 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-200">{item.title}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{item.dateFormatted}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum evento registrado</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => { setIsTimelineModalOpen(false); setSelectedClientForTimeline(null); }}>Fechar</Button>
        </div>
      </Modal>
    </div>
  );
};

// Lost Leads View
const LostLeadsView = ({ data, updateData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");

  const filteredLeads = useMemo(() => {
    return data.lostLeads.filter(lead => {
      const matchesSearch = (lead.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesReason = reasonFilter === "all" || lead.lostReason === reasonFilter;
      return matchesSearch && matchesReason;
    });
  }, [data.lostLeads, searchTerm, reasonFilter]);

  const handleReactivate = (lead) => {
    const reactivatedLead = {
      ...lead,
      status: "novo",
      id: Date.now(),
    };
    delete reactivatedLead.lostReason;
    delete reactivatedLead.lostDate;
    
    updateData(prev => ({
      ...prev,
      leads: [...prev.leads, reactivatedLead],
      lostLeads: prev.lostLeads.filter(l => l.id !== lead.id)
    }));
  };

  const handleDelete = (id) => {
    if (confirm("Excluir permanentemente?")) {
      updateData(prev => ({
        ...prev,
        lostLeads: prev.lostLeads.filter(l => l.id !== id)
      }));
    }
  };

  const lostReasons = [...new Set(data.lostLeads.map(l => l.lostReason).filter(Boolean))];
  const totalLostValue = filteredLeads.reduce((acc, l) => acc + (l.value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Leads Perdidos</h1>
          <p className="text-gray-500 mt-1">{data.lostLeads.length} leads • R$ {totalLostValue.toLocaleString('pt-BR')} em oportunidades</p>
        </div>
      </div>

      {lostReasons.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={setSearchTerm}
                icon={Search}
              />
            </div>
            <Select
              value={reasonFilter}
              onChange={setReasonFilter}
              options={[
                { value: "all", label: "Todos os motivos" },
                ...lostReasons.map(r => ({ value: r, label: r }))
              ]}
            />
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                  {(lead.name || "?").charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">{lead.name}</h3>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm text-gray-500">Valor perdido</p>
                  <p className="font-semibold text-red-400">R$ {(lead.value || 0).toLocaleString('pt-BR')}</p>
                </div>
                
                <Badge variant="danger">{lead.lostReason}</Badge>
                
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleReactivate(lead)}>
                    Reativar
                  </Button>
                  <button onClick={() => handleDelete(lead.id)} className="p-2 hover:bg-red-900/50 rounded-lg transition-colors">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
              {lead.lostDate && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span className="text-sm">Perdido em {new Date(lead.lostDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {lead.source && <Badge variant="info">{lead.source}</Badge>}
              {lead.segment && <Badge variant="lime">{lead.segment}</Badge>}
            </div>
          </Card>
        ))}
        
        {filteredLeads.length === 0 && (
          <Card className="p-12 text-center">
            <UserX size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">Nenhum lead perdido</p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Investment View
const InvestmentView = ({ data, updateData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [formData, setFormData] = useState({
    month: "Janeiro", year: new Date().getFullYear(), amount: 0
  });

  const monthsList = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const years = [2023, 2024, 2025, 2026];

  // Filtrar clientes legacy das estatísticas
  const crmClients = data.clients.filter(c => !c.isLegacy);
  const totalInvestment = data.trafficInvestment.reduce((acc, t) => acc + t.amount, 0);
  const paidClients = crmClients.filter(c => c.source === "Tráfego Pago").length;
  const paidClientsRevenue = crmClients.filter(c => c.source === "Tráfego Pago").reduce((acc, c) => acc + (c.value || 0), 0);
  const roi = totalInvestment > 0 ? (((paidClientsRevenue - totalInvestment) / totalInvestment) * 100).toFixed(0) : 0;

  const handleSave = () => {
    if (editingInvestment) {
      updateData(prev => ({
        ...prev,
        trafficInvestment: prev.trafficInvestment.map(t => 
          t.id === editingInvestment.id ? { ...formData, id: t.id } : t
        )
      }));
    } else {
      const existing = data.trafficInvestment.find(t => t.month === formData.month && t.year === formData.year);
      if (existing) {
        if (confirm("Já existe registro para este mês. Deseja somar o valor?")) {
          updateData(prev => ({
            ...prev,
            trafficInvestment: prev.trafficInvestment.map(t => 
              t.month === formData.month && t.year === formData.year 
                ? { ...t, amount: t.amount + formData.amount }
                : t
            )
          }));
        }
      } else {
        const newInvestment = {
          ...formData,
          id: Date.now(),
        };
        updateData(prev => ({ ...prev, trafficInvestment: [...prev.trafficInvestment, newInvestment] }));
      }
    }
    setIsModalOpen(false);
    setEditingInvestment(null);
    setFormData({ month: "Janeiro", year: new Date().getFullYear(), amount: 0 });
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setFormData(investment);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Excluir este registro?")) {
      updateData(prev => ({
        ...prev,
        trafficInvestment: prev.trafficInvestment.filter(t => t.id !== id)
      }));
    }
  };

  const sortedInvestments = [...data.trafficInvestment].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return monthsList.indexOf(b.month) - monthsList.indexOf(a.month);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Investimento em Tráfego</h1>
          <p className="text-gray-500 mt-1">Controle de gastos com anúncios</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingInvestment(null); setFormData({ month: "Janeiro", year: new Date().getFullYear(), amount: 0 }); setIsModalOpen(true); }}>
          Registrar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Total Investido</p>
          <p className="text-2xl font-bold text-gray-100 mt-1">R$ {totalInvestment.toLocaleString('pt-BR')}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Clientes de Tráfego</p>
          <p className="text-2xl font-bold text-lime-400 mt-1">{paidClients}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Receita de Tráfego</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {paidClientsRevenue.toLocaleString('pt-BR')}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">ROI</p>
          <p className={`text-2xl font-bold mt-1 ${parseInt(roi) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {roi}%
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-100 mb-6">Histórico</h3>
        {sortedInvestments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mês/Ano</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Valor</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedInvestments.map((investment) => (
                  <tr key={investment.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-200">{investment.month}</span>
                      <span className="text-gray-500 ml-2">{investment.year}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-lime-400">R$ {investment.amount.toLocaleString('pt-BR')}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(investment)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <Edit2 size={16} className="text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(investment.id)} className="p-2 hover:bg-red-900/50 rounded-lg transition-colors">
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum investimento registrado</p>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInvestment ? "Editar" : "Novo Investimento"} size="sm">
        <div className="space-y-4">
          <Select
            label="Mês"
            value={formData.month}
            onChange={(v) => setFormData({...formData, month: v})}
            options={monthsList.map(m => ({ value: m, label: m }))}
          />
          <Select
            label="Ano"
            value={formData.year}
            onChange={(v) => setFormData({...formData, year: parseInt(v)})}
            options={years.map(y => ({ value: y, label: y.toString() }))}
          />
          <Input 
            label="Valor (R$)" 
            type="number" 
            value={formData.amount} 
            onChange={(v) => setFormData({...formData, amount: parseInt(v) || 0})} 
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
};

// Activities View - Agenda de Atividades
const ActivitiesView = ({ data, updateData, setActiveView }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterLead, setFilterLead] = useState("all");
  const [formData, setFormData] = useState({
    type: "call",
    leadId: "",
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    completed: false
  });

  const activities = data.activities || [];
  
  // Ordenar atividades por data/hora
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA - dateB;
    });
  }, [activities]);

  // Filtrar atividades
  const filteredActivities = useMemo(() => {
    return sortedActivities.filter(activity => {
      const matchesType = filterType === "all" || activity.type === filterType;
      const matchesLead = filterLead === "all" || activity.leadId === parseInt(filterLead);
      return matchesType && matchesLead;
    });
  }, [sortedActivities, filterType, filterLead]);

  // Atividades de hoje e próximas
  const today = new Date().toISOString().split('T')[0];
  const todayActivities = sortedActivities.filter(a => a.date === today && !a.completed);
  const upcomingActivities = sortedActivities.filter(a => a.date > today && !a.completed).slice(0, 5);
  const overdueActivities = sortedActivities.filter(a => a.date < today && !a.completed);

  const getLeadName = (leadId) => {
    const lead = data.leads.find(l => l.id === leadId);
    return lead?.name || 'Lead não encontrado';
  };

  const getActivityType = (typeId) => {
    return ACTIVITY_TYPES.find(t => t.id === typeId) || ACTIVITY_TYPES[7];
  };

  const getActivityIcon = (typeId) => {
    const iconMap = {
      call: Phone,
      meeting: Video,
      email: Mail,
      proposal: FileText,
      followup: Send,
      briefing: MessageSquare,
      reminder: AlertCircle,
      other: Calendar
    };
    return iconMap[typeId] || Calendar;
  };

  const handleSave = () => {
    if (!formData.leadId || !formData.title) {
      alert("Preencha o lead e o título da atividade");
      return;
    }

    if (editingActivity) {
      updateData(prev => ({
        ...prev,
        activities: prev.activities.map(a => 
          a.id === editingActivity.id ? { ...formData, id: a.id, leadId: parseInt(formData.leadId) } : a
        )
      }));
    } else {
      const newActivity = {
        ...formData,
        id: Date.now(),
        leadId: parseInt(formData.leadId)
      };
      updateData(prev => ({ 
        ...prev, 
        activities: [...(prev.activities || []), newActivity] 
      }));
    }
    setIsModalOpen(false);
    setEditingActivity(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: "call",
      leadId: "",
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      completed: false
    });
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({ ...activity, leadId: activity.leadId.toString() });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Excluir esta atividade?")) {
      updateData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a.id !== id)
      }));
    }
  };

  const toggleComplete = (id) => {
    updateData(prev => ({
      ...prev,
      activities: prev.activities.map(a => 
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  };

  const isToday = (dateStr) => dateStr === today;
  const isOverdue = (dateStr) => dateStr < today;
  const isFuture = (dateStr) => dateStr > today;

  // Componente de Card de Atividade
  const ActivityCard = ({ activity, showLead = true }) => {
    const actType = getActivityType(activity.type);
    const IconComponent = getActivityIcon(activity.type);
    
    return (
      <div className={`p-4 rounded-xl border transition-all ${
        activity.completed 
          ? 'bg-gray-800/30 border-gray-800 opacity-60' 
          : isOverdue(activity.date)
            ? 'bg-red-900/20 border-red-800'
            : isToday(activity.date)
              ? 'bg-lime-900/20 border-lime-700'
              : 'bg-gray-800/50 border-gray-700'
      }`}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleComplete(activity.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              activity.completed 
                ? 'bg-lime-500 border-lime-500' 
                : 'border-gray-600 hover:border-lime-500'
            }`}
          >
            {activity.completed && <Check size={12} className="text-gray-900" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`p-1.5 rounded-lg ${actType.color}`}>
                <IconComponent size={14} />
              </span>
              <span className={`font-medium ${activity.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {activity.title}
              </span>
            </div>
            
            {showLead && (
              <p className="text-sm text-lime-400 mt-1">{getLeadName(activity.leadId)}</p>
            )}
            
            {activity.description && (
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
            )}
            
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(activity.date)}
              </span>
              {activity.time && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <button onClick={() => handleEdit(activity)} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
              <Edit2 size={14} className="text-gray-500" />
            </button>
            <button onClick={() => handleDelete(activity.id)} className="p-1.5 hover:bg-red-900/50 rounded-lg transition-colors">
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Atividades</h1>
          <p className="text-gray-500 mt-1">Agenda e tarefas com seus leads</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingActivity(null); resetForm(); setIsModalOpen(true); }}>
          Nova Atividade
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-lime-500/20">
              <CalendarDays size={20} className="text-lime-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-lime-400">{todayActivities.length}</p>
              <p className="text-xs text-gray-500">Para hoje</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Clock size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">{upcomingActivities.length}</p>
              <p className="text-xs text-gray-500">Próximas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{overdueActivities.length}</p>
              <p className="text-xs text-gray-500">Atrasadas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Check size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{activities.filter(a => a.completed).length}</p>
              <p className="text-xs text-gray-500">Concluídas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Atividades de Hoje */}
      {todayActivities.length > 0 && (
        <Card className="p-5">
          <h3 className="text-lg font-bold text-lime-400 mb-4 flex items-center gap-2">
            <CalendarDays size={20} />
            Hoje ({todayActivities.length})
          </h3>
          <div className="space-y-3">
            {todayActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </Card>
      )}

      {/* Atividades Atrasadas */}
      {overdueActivities.length > 0 && (
        <Card className="p-5 border-red-800">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            Atrasadas ({overdueActivities.length})
          </h3>
          <div className="space-y-3">
            {overdueActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </Card>
      )}

      {/* Todas as Atividades */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h3 className="text-lg font-bold text-gray-100">Todas as Atividades</h3>
          <div className="flex gap-3">
            <Select
              value={filterType}
              onChange={setFilterType}
              options={[
                { value: "all", label: "Todos os tipos" },
                ...ACTIVITY_TYPES.map(t => ({ value: t.id, label: t.name }))
              ]}
            />
            <Select
              value={filterLead}
              onChange={setFilterLead}
              options={[
                { value: "all", label: "Todos os leads" },
                ...data.leads.map(l => ({ value: l.id.toString(), label: l.name }))
              ]}
            />
          </div>
        </div>
        
        {filteredActivities.length > 0 ? (
          <div className="space-y-3">
            {filteredActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade encontrada</p>
          </div>
        )}
      </Card>

      {/* Modal Nova/Editar Atividade */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingActivity ? "Editar Atividade" : "Nova Atividade"}>
        <div className="space-y-4">
          <Select
            label="Lead"
            value={formData.leadId}
            onChange={(v) => setFormData({...formData, leadId: v})}
            options={[
              { value: "", label: "Selecione um lead..." },
              ...data.leads.map(l => ({ value: l.id.toString(), label: l.name }))
            ]}
          />
          <Select
            label="Tipo de Atividade"
            value={formData.type}
            onChange={(v) => setFormData({...formData, type: v})}
            options={ACTIVITY_TYPES.map(t => ({ value: t.id, label: t.name }))}
          />
          <Input 
            label="Título" 
            value={formData.title} 
            onChange={(v) => setFormData({...formData, title: v})} 
            placeholder="Ex: Ligar para agendar reunião"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Data" 
              type="date" 
              value={formData.date} 
              onChange={(v) => setFormData({...formData, date: v})} 
            />
            <Input 
              label="Horário" 
              type="time" 
              value={formData.time} 
              onChange={(v) => setFormData({...formData, time: v})} 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Descrição (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full mt-1.5 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
              rows={3}
              placeholder="Detalhes da atividade..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{editingActivity ? "Salvar" : "Criar Atividade"}</Button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================
// PROJECT DETAIL PANEL
// ============================================
const ProjectDetailPanel = ({ project, data, updateData, onClose }) => {
  const [tick, setTick] = useState(0);
  const [descValue, setDescValue] = useState(project.description || '');
  const [nameValue, setNameValue] = useState(project.name || '');
  const [showCronograma, setShowCronograma] = useState(false);

  // Task modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ name: '', description: '', responsibleId: '', deadline: '', estimatedHours: 0 });

  // Checklist state
  const [newChecklistName, setNewChecklistName] = useState('');
  const [checklistInputs, setChecklistInputs] = useState({});
  const [editingChecklistName, setEditingChecklistName] = useState(null);
  const [checklistRenameValue, setChecklistRenameValue] = useState('');

  // Phase modal
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [phaseForm, setPhaseForm] = useState({ name: '', deadline: '', description: '' });

  // Comments
  const [commentText, setCommentText] = useState('');
  const [commentAuthorId, setCommentAuthorId] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const teamMembers = data.teamMembers || [];
  const allTasks = data.projects?.tasks || [];
  const tasks = allTasks.filter(t => t.projectId === project.id);
  const clients = data.clients || [];
  const columns = data.projects?.columns || [];
  const client = clients.find(c => c.id === project.clientId || c.id === parseInt(project.clientId));
  const checklists = project.checklists || [];
  const schedulePhases = project.schedulePhases || [];
  const comments = project.comments || [];
  const responsible = teamMembers.find(m => m.id === project.responsibleId || m.id === parseInt(project.responsibleId));

  // Sync when project changes
  useEffect(() => {
    setDescValue(project.description || '');
    setNameValue(project.name || '');
  }, [project.id]);

  // Real-time tick for tracking display
  useEffect(() => {
    const hasTracking = tasks.some(t => t.isTracking);
    if (!hasTracking) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  // ── Current phase / deadline logic ───────────────────────
  const sortedPhases = [...schedulePhases].sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'));
  const currentPhase = sortedPhases.find(p => !p.completed);
  const effectiveDeadline = currentPhase?.deadline || project.deadline || null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const deadlineDate = effectiveDeadline ? new Date(effectiveDeadline + 'T00:00') : null;
  const isOverdue = deadlineDate && deadlineDate < today;
  const daysUntil = deadlineDate ? Math.ceil((deadlineDate - today) / 86400000) : null;

  // ── Helpers ──────────────────────────────────────────────
  const getMember = (id) => teamMembers.find(m => m.id === id || m.id === parseInt(id));

  const formatSeconds = (secs) => {
    const t = Math.floor(secs);
    return `${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor((t%3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
  };

  const getTrackedSeconds = (task) => {
    let base = task.trackedSeconds || 0;
    if (task.isTracking && task.trackingStartedAt) base += (Date.now() - task.trackingStartedAt) / 1000;
    return Math.floor(base);
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // ── Updater helpers ───────────────────────────────────────
  const updateProjects = (updater) => updateData(prev => ({ ...prev, projects: updater(prev.projects || { columns: [], cards: [], tasks: [] }) }));

  const updateProjectCard = (updater) => updateData(prev => ({
    ...prev,
    projects: { ...prev.projects, cards: (prev.projects?.cards || []).map(c => c.id === project.id ? updater(c) : c) }
  }));

  // ── Description ───────────────────────────────────────────
  const handleDescBlur = () => {
    if (descValue !== project.description) updateProjectCard(c => ({ ...c, description: descValue }));
  };

  // ── Task CRUD ─────────────────────────────────────────────
  const handleSaveTask = () => {
    if (!taskForm.name) return;
    updateProjects(proj => {
      const tasks = proj.tasks || [];
      if (editingTask) return { ...proj, tasks: tasks.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t) };
      const newTask = { ...taskForm, id: Date.now(), projectId: project.id, trackedSeconds: 0, isTracking: false, trackingStartedAt: null, completed: false, checklists: [], createdAt: new Date().toISOString() };
      return { ...proj, tasks: [...tasks, newTask] };
    });
    setIsTaskModalOpen(false); setEditingTask(null);
    setTaskForm({ name: '', description: '', responsibleId: '', deadline: '', estimatedHours: 0 });
  };

  const handleDeleteTask = (taskId) => { if (!confirm('Excluir esta tarefa?')) return; updateProjects(proj => ({ ...proj, tasks: (proj.tasks || []).filter(t => t.id !== taskId) })); };

  const handleToggleTaskComplete = (task) => {
    if (task.isTracking) {
      updateProjects(proj => ({ ...proj, tasks: (proj.tasks || []).map(t => { if (t.id !== task.id) return t; const el = (Date.now() - (t.trackingStartedAt || Date.now())) / 1000; return { ...t, isTracking: false, trackedSeconds: (t.trackedSeconds || 0) + el, trackingStartedAt: null, completed: !t.completed }; }) }));
    } else {
      updateProjects(proj => ({ ...proj, tasks: (proj.tasks || []).map(t => t.id === task.id ? { ...t, completed: !t.completed } : t) }));
    }
  };

  const handleToggleTracking = (task) => {
    updateProjects(proj => ({ ...proj, tasks: (proj.tasks || []).map(t => { if (t.id !== task.id) return t; if (t.isTracking) { const el = (Date.now() - (t.trackingStartedAt || Date.now())) / 1000; return { ...t, isTracking: false, trackedSeconds: (t.trackedSeconds || 0) + el, trackingStartedAt: null }; } return { ...t, isTracking: true, trackingStartedAt: Date.now() }; }) }));
  };

  // ── Phase CRUD ────────────────────────────────────────────
  const handleSavePhase = () => {
    if (!phaseForm.name) return;
    updateProjectCard(c => { const phases = c.schedulePhases || []; if (editingPhase) return { ...c, schedulePhases: phases.map(p => p.id === editingPhase.id ? { ...p, ...phaseForm } : p) }; return { ...c, schedulePhases: [...phases, { ...phaseForm, id: Date.now(), completed: false }] }; });
    setIsPhaseModalOpen(false); setEditingPhase(null); setPhaseForm({ name: '', deadline: '', description: '' });
  };

  const handleDeletePhase = (phaseId) => { if (!confirm('Excluir esta fase?')) return; updateProjectCard(c => ({ ...c, schedulePhases: (c.schedulePhases || []).filter(p => p.id !== phaseId) })); };

  const handleTogglePhaseComplete = (phaseId) => updateProjectCard(c => ({ ...c, schedulePhases: (c.schedulePhases || []).map(p => p.id === phaseId ? { ...p, completed: !p.completed } : p) }));

  // ── Checklist CRUD ────────────────────────────────────────
  const handleAddProjectChecklist = () => { if (!newChecklistName.trim()) return; updateProjectCard(c => ({ ...c, checklists: [...(c.checklists || []), { id: Date.now(), name: newChecklistName.trim(), items: [] }] })); setNewChecklistName(''); };
  const handleRenameProjectChecklist = (clId) => { if (!checklistRenameValue.trim()) { setEditingChecklistName(null); return; } updateProjectCard(c => ({ ...c, checklists: (c.checklists || []).map(cl => cl.id === clId ? { ...cl, name: checklistRenameValue.trim() } : cl) })); setEditingChecklistName(null); };
  const handleDeleteProjectChecklist = (clId) => { if (!confirm('Excluir esta checklist?')) return; updateProjectCard(c => ({ ...c, checklists: (c.checklists || []).filter(cl => cl.id !== clId) })); };
  const handleAddChecklistItem = (clId, text) => { if (!text.trim()) return; updateProjectCard(c => ({ ...c, checklists: (c.checklists || []).map(cl => cl.id === clId ? { ...cl, items: [...(cl.items || []), { id: Date.now(), text: text.trim(), checked: false, deadline: '', responsibleId: '' }] } : cl) })); };
  const handleToggleChecklistItem = (clId, itemId) => updateProjectCard(c => ({ ...c, checklists: (c.checklists || []).map(cl => cl.id === clId ? { ...cl, items: (cl.items || []).map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) } : cl) }));
  const handleDeleteChecklistItem = (clId, itemId) => updateProjectCard(c => ({ ...c, checklists: (c.checklists || []).map(cl => cl.id === clId ? { ...cl, items: (cl.items || []).filter(item => item.id !== itemId) } : cl) }));
  const handleUpdateChecklistItem = (clId, itemId, updates) => updateProjectCard(c => ({ ...c, checklists: (c.checklists || []).map(cl => cl.id === clId ? { ...cl, items: (cl.items || []).map(item => item.id === itemId ? { ...item, ...updates } : item) } : cl) }));

  // ── Comment CRUD ──────────────────────────────────────────
  const handleAddComment = () => {
    if (!commentText.trim() || !commentAuthorId) return;
    updateProjectCard(c => ({
      ...c,
      comments: [...(c.comments || []), { id: Date.now(), authorId: commentAuthorId, text: commentText.trim(), createdAt: new Date().toISOString(), editedAt: null }]
    }));
    setCommentText('');
  };

  const handleSaveEditComment = (commentId) => {
    if (!editingCommentText.trim()) return;
    updateProjectCard(c => ({
      ...c,
      comments: (c.comments || []).map(cm => cm.id === commentId ? { ...cm, text: editingCommentText.trim(), editedAt: new Date().toISOString() } : cm)
    }));
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    if (!confirm('Excluir este comentário?')) return;
    updateProjectCard(c => ({ ...c, comments: (c.comments || []).filter(cm => cm.id !== commentId) }));
  };

  const inputCls = "bg-gray-800/50 border border-gray-700/60 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-lime-500 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[88vh] flex flex-col bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">

        {/* ─── Header ─── */}
        <div className="flex-shrink-0 border-b border-gray-800 px-6 py-4">
          {/* Row 1: close + name + cronograma button */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
            <input
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onBlur={() => nameValue.trim() && nameValue !== project.name && updateProjectCard(c => ({ ...c, name: nameValue.trim() }))}
              className="flex-1 min-w-0 bg-transparent text-base font-bold text-gray-100 focus:outline-none border-b border-transparent focus:border-lime-500 transition-colors pb-0.5"
            />
            <button
              onClick={() => setShowCronograma(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                showCronograma
                  ? 'bg-lime-500/20 border border-lime-500/40 text-lime-400'
                  : 'bg-gray-800 border border-gray-700/60 text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <CalendarRange size={12} /> Cronograma
            </button>
          </div>

          {/* Row 2: editable meta fields */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-9">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Responsável:</span>
              <select
                value={project.responsibleId?.toString() || ''}
                onChange={e => updateProjectCard(c => ({ ...c, responsibleId: e.target.value ? (parseInt(e.target.value) || e.target.value) : '' }))}
                className={inputCls}
              >
                <option value="">Nenhum</option>
                {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              {responsible && (responsible.photo
                ? <img src={responsible.photo} alt="" className="w-5 h-5 rounded-full object-cover border border-lime-500/40" />
                : <div className="w-5 h-5 rounded-full bg-lime-500/20 border border-lime-500/40 flex items-center justify-center"><span className="text-lime-400 text-[10px] font-bold">{responsible.name?.[0]}</span></div>
              )}
            </div>
            <span className="text-gray-700 text-xs">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Cliente:</span>
              <select
                value={project.clientId?.toString() || ''}
                onChange={e => updateProjectCard(c => ({ ...c, clientId: e.target.value ? (parseInt(e.target.value) || e.target.value) : '' }))}
                className={inputCls}
              >
                <option value="">Nenhum</option>
                {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.name}{cl.company ? ` · ${cl.company}` : ''}</option>)}
              </select>
            </div>
            <span className="text-gray-700 text-xs">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Coluna:</span>
              <select
                value={project.columnId?.toString() || ''}
                onChange={e => updateProjectCard(c => ({ ...c, columnId: e.target.value }))}
                className={inputCls}
              >
                {columns.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
              </select>
            </div>
            <span className="text-gray-700 text-xs">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Prazo:</span>
              <input
                type="date"
                value={project.deadline || ''}
                onChange={e => updateProjectCard(c => ({ ...c, deadline: e.target.value }))}
                className={inputCls}
              />
            </div>
            <span className="text-gray-700 text-xs">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Horas:</span>
              <input
                type="number"
                defaultValue={project.estimatedHours || ''}
                onBlur={e => updateProjectCard(c => ({ ...c, estimatedHours: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className={`${inputCls} w-16`}
              />
            </div>
          </div>

          {/* Row 3: deadline badge + task count */}
          <div className="flex items-center gap-2 pl-9 mt-2">
            {effectiveDeadline ? (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium ${
                isOverdue ? 'bg-red-900/30 border border-red-700/50 text-red-400'
                  : daysUntil !== null && daysUntil <= 7 ? 'bg-amber-900/30 border border-amber-700/40 text-amber-400'
                  : 'bg-gray-800/60 border border-gray-700/50 text-gray-500'
              }`}>
                <Calendar size={10} />
                {currentPhase && <span className="text-gray-600 mr-0.5 max-w-[100px] truncate">{currentPhase.name} ·</span>}
                {new Date(effectiveDeadline + 'T12:00').toLocaleDateString('pt-BR')}
                {isOverdue && <span className="ml-1 font-bold text-red-300">· Atrasado</span>}
                {!isOverdue && daysUntil !== null && daysUntil <= 7 && daysUntil > 0 && <span className="ml-1 text-amber-300">· {daysUntil}d</span>}
                {!isOverdue && daysUntil === 0 && <span className="ml-1 font-bold text-amber-300">· Hoje!</span>}
              </div>
            ) : null}
            {tasks.length > 0 && (
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <CheckSquare size={10} />
                {tasks.filter(t => t.completed).length}/{tasks.length} tarefas
              </span>
            )}
          </div>
        </div>

        {/* ─── Body: 2 columns ─── */}
        <div className="flex flex-1 min-h-0">

          {/* Left column */}
          <div className="flex-1 overflow-y-auto min-w-0">
            {!showCronograma ? (
              <>
                {/* Description */}
                <div className="px-6 py-4 border-b border-gray-800/60">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Descrição</p>
                  <textarea
                    value={descValue}
                    onChange={e => setDescValue(e.target.value)}
                    onBlur={handleDescBlur}
                    placeholder="Adicione uma descrição ao projeto..."
                    className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-700 resize-none focus:outline-none leading-relaxed min-h-[56px]"
                    rows={3}
                  />
                </div>

                {/* ─── Tarefas ─── */}
                <div className="px-6 py-4 border-b border-gray-800/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare size={13} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tarefas</span>
                {tasks.length > 0 && <span className="text-xs text-gray-600">({tasks.filter(t=>t.completed).length}/{tasks.length})</span>}
              </div>
              <button
                onClick={() => { setEditingTask(null); setTaskForm({ name: '', description: '', responsibleId: '', deadline: '', estimatedHours: 0 }); setIsTaskModalOpen(true); }}
                className="flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300 px-2 py-1 rounded-lg hover:bg-lime-500/10 transition-colors"
              >
                <Plus size={12} /> Nova tarefa
              </button>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-gray-700 text-center py-3">Nenhuma tarefa. Clique em "Nova tarefa" para começar.</p>
            ) : (
              <div className="space-y-1.5">
                {tasks.map(task => {
                  const member = getMember(task.responsibleId);
                  const trackedSecs = getTrackedSeconds(task);
                  const isTaskOverdue = task.deadline && !task.completed && new Date(task.deadline + 'T23:59') < today;
                  return (
                    <div key={task.id} className={`group rounded-xl p-2.5 transition-all ${
                      task.completed ? 'bg-gray-800/20' : isTaskOverdue ? 'bg-red-900/10 border border-red-800/30' : 'bg-gray-800/50 hover:bg-gray-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleTaskComplete(task)} className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 hover:border-lime-500'
                          }`}>
                            {task.completed && <Check size={9} className="text-white" />}
                          </div>
                        </button>
                        <span className={`flex-1 text-sm min-w-0 truncate ${task.completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>{task.name}</span>
                        {task.isTracking && <span className="text-xs text-lime-400 animate-pulse flex-shrink-0">●</span>}
                        <span className={`text-xs font-mono flex-shrink-0 tabular-nums ${task.isTracking ? 'text-lime-400' : 'text-gray-600'}`}>{formatSeconds(trackedSecs)}</span>
                        {!task.completed && (
                          <button onClick={() => handleToggleTracking(task)} className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${task.isTracking ? 'bg-red-500/20 text-red-400' : 'bg-lime-500/10 text-lime-500 hover:bg-lime-500/20'}`}>
                            {task.isTracking ? <Square size={9} fill="currentColor" /> : <Play size={9} fill="currentColor" />}
                          </button>
                        )}
                        <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingTask(task); setTaskForm({ name: task.name, description: task.description || '', responsibleId: task.responsibleId || '', deadline: task.deadline || '', estimatedHours: task.estimatedHours || 0 }); setIsTaskModalOpen(true); }} className="p-1 hover:bg-gray-700 rounded"><Edit2 size={11} className="text-gray-500" /></button>
                          <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-red-900/30 rounded"><Trash2 size={11} className="text-red-500" /></button>
                        </div>
                      </div>
                      {(member || task.deadline || task.estimatedHours > 0) && (
                        <div className="flex items-center gap-3 mt-1 pl-6 text-xs text-gray-600">
                          {member && <span className="flex items-center gap-1">{member.photo ? <img src={member.photo} alt="" className="w-3 h-3 rounded-full object-cover" /> : <div className="w-3 h-3 rounded-full bg-lime-500/20" />}{member.name}</span>}
                          {task.deadline && <span className={isTaskOverdue ? 'text-red-500' : ''}>{new Date(task.deadline + 'T12:00').toLocaleDateString('pt-BR')}</span>}
                          {task.estimatedHours > 0 && <span>{task.estimatedHours}h est.</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

                {/* ─── Checklists ─── */}
                <div className="px-6 py-4 pb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ListChecks size={13} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Checklists</span>
                      {checklists.length > 0 && <span className="text-xs text-gray-600">({checklists.length})</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={newChecklistName}
                      onChange={e => setNewChecklistName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddProjectChecklist()}
                      placeholder="Nome da nova checklist..."
                      className="flex-1 px-3 py-1.5 bg-gray-800/70 border border-gray-700/60 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-lime-500"
                    />
                    <button onClick={handleAddProjectChecklist} disabled={!newChecklistName.trim()} className="px-3 py-1.5 bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 rounded-lg text-sm transition-colors disabled:opacity-40 flex items-center gap-1 flex-shrink-0">
                      <Plus size={13} /> Criar
                    </button>
                  </div>
                  {checklists.length === 0 ? (
                    <p className="text-xs text-gray-700 text-center py-2">Nenhuma checklist criada.</p>
                  ) : (
                    <div className="space-y-3">
                      {checklists.map(cl => {
                        const completedCount = (cl.items || []).filter(i => i.checked).length;
                        const totalCount = (cl.items || []).length;
                        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                        return (
                          <div key={cl.id} className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/40">
                              {editingChecklistName === cl.id ? (
                                <input value={checklistRenameValue} onChange={e => setChecklistRenameValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRenameProjectChecklist(cl.id); if (e.key === 'Escape') setEditingChecklistName(null); }} onBlur={() => handleRenameProjectChecklist(cl.id)} autoFocus className="flex-1 px-2 py-0.5 bg-gray-800 border border-lime-500 rounded text-sm text-gray-200 focus:outline-none" />
                              ) : (
                                <span className="flex-1 text-sm font-semibold text-gray-200">{cl.name}</span>
                              )}
                              <span className="text-xs text-gray-600 font-mono">{completedCount}/{totalCount}</span>
                              <button onClick={() => { setEditingChecklistName(cl.id); setChecklistRenameValue(cl.name); }} className="p-1 hover:bg-gray-700 rounded"><Edit2 size={11} className="text-gray-500" /></button>
                              <button onClick={() => handleDeleteProjectChecklist(cl.id)} className="p-1 hover:bg-red-900/30 rounded"><Trash2 size={11} className="text-red-500" /></button>
                            </div>
                            {totalCount > 0 && (
                              <div className="px-3 py-1.5 border-b border-gray-700/30">
                                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-lime-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                            )}
                            <div className="px-3 pb-2">
                              {(cl.items || []).map(item => {
                                const itemMember = getMember(item.responsibleId);
                                return (
                                  <div key={item.id} className="group/item flex items-center gap-2 py-1.5 hover:bg-gray-700/30 rounded px-1 -mx-1 transition-colors">
                                    <button onClick={() => handleToggleChecklistItem(cl.id, item.id)} className="flex-shrink-0">
                                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-lime-500 border-lime-500' : 'border-gray-600 hover:border-lime-500'}`}>
                                        {item.checked && <Check size={9} className="text-gray-900" />}
                                      </div>
                                    </button>
                                    <span className={`flex-1 text-sm min-w-0 ${item.checked ? 'line-through text-gray-600' : 'text-gray-300'}`}>{item.text}</span>
                                    {(itemMember || item.deadline) && (
                                      <div className="flex items-center gap-1.5 text-xs text-gray-600 group-hover/item:hidden">
                                        {itemMember && <span>{itemMember.name?.split(' ')[0]}</span>}
                                        {item.deadline && <span>{new Date(item.deadline + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>}
                                      </div>
                                    )}
                                    <div className="hidden group-hover/item:flex items-center gap-1.5">
                                      <select value={item.responsibleId || ''} onChange={e => handleUpdateChecklistItem(cl.id, item.id, { responsibleId: e.target.value ? (parseInt(e.target.value) || e.target.value) : '' })} className="text-xs bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-gray-500 focus:outline-none focus:border-lime-500" title="Responsável">
                                        <option value="">Resp.</option>
                                        {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                      </select>
                                      <input type="date" value={item.deadline || ''} onChange={e => handleUpdateChecklistItem(cl.id, item.id, { deadline: e.target.value })} className="text-xs bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-gray-500 focus:outline-none focus:border-lime-500" />
                                      <button onClick={() => handleDeleteChecklistItem(cl.id, item.id)} className="p-0.5 hover:bg-red-900/30 rounded"><X size={10} className="text-gray-600 hover:text-red-400" /></button>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700/30">
                                <input
                                  value={checklistInputs[cl.id] || ''}
                                  onChange={e => setChecklistInputs(prev => ({ ...prev, [cl.id]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter' && (checklistInputs[cl.id] || '').trim()) { handleAddChecklistItem(cl.id, checklistInputs[cl.id]); setChecklistInputs(prev => ({ ...prev, [cl.id]: '' })); } }}
                                  placeholder="Adicionar item..."
                                  className="flex-1 text-sm px-2 py-1 bg-transparent border-b border-gray-700/50 text-gray-300 placeholder-gray-700 focus:outline-none focus:border-lime-500"
                                />
                                <button onClick={() => { if ((checklistInputs[cl.id] || '').trim()) { handleAddChecklistItem(cl.id, checklistInputs[cl.id]); setChecklistInputs(prev => ({ ...prev, [cl.id]: '' })); } }} className="px-2 py-1 text-lime-500 hover:bg-lime-500/10 rounded transition-colors"><Plus size={13} /></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ─── Cronograma view ─── */
              <div className="px-6 py-4 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarRange size={13} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cronograma</span>
                  </div>
                  <button onClick={() => { setEditingPhase(null); setPhaseForm({ name: '', deadline: '', description: '' }); setIsPhaseModalOpen(true); }} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus size={12} /> Fase
                  </button>
                </div>
                {sortedPhases.length === 0 ? (
                  <p className="text-xs text-gray-700 text-center py-3">Sem fases cadastradas.</p>
                ) : (
                  <div className="space-y-1.5">
                    {sortedPhases.map(phase => {
                      const isCurrent = phase.id === currentPhase?.id;
                      const isPhaseOverdue = phase.deadline && !phase.completed && new Date(phase.deadline + 'T23:59') < today;
                      return (
                        <div key={phase.id} className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all ${isCurrent ? 'bg-amber-900/15 border border-amber-700/40' : phase.completed ? 'opacity-50 bg-gray-800/20' : 'bg-gray-800/40 hover:bg-gray-800/70'}`}>
                          <button onClick={() => handleTogglePhaseComplete(phase.id)} className="flex-shrink-0">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${phase.completed ? 'bg-emerald-500 border-emerald-500' : isCurrent ? 'border-amber-400' : 'border-gray-600 hover:border-lime-500'}`}>
                              {phase.completed && <Check size={10} className="text-white" />}
                              {isCurrent && !phase.completed && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                            </div>
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${phase.completed ? 'line-through text-gray-600' : isCurrent ? 'text-amber-300 font-medium' : 'text-gray-300'}`}>{phase.name}</span>
                              {isCurrent && <span className="text-xs text-amber-600 font-medium flex-shrink-0">← atual</span>}
                            </div>
                            {phase.description && <p className="text-xs text-gray-600 truncate mt-0.5">{phase.description}</p>}
                          </div>
                          {phase.deadline && (
                            <span className={`text-xs flex-shrink-0 font-medium ${isPhaseOverdue ? 'text-red-400' : phase.completed ? 'text-gray-600' : 'text-gray-500'}`}>
                              {new Date(phase.deadline + 'T12:00').toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingPhase(phase); setPhaseForm({ name: phase.name, deadline: phase.deadline || '', description: phase.description || '' }); setIsPhaseModalOpen(true); }} className="p-1 hover:bg-gray-700 rounded"><Edit2 size={11} className="text-gray-500" /></button>
                            <button onClick={() => handleDeletePhase(phase.id)} className="p-1 hover:bg-red-900/30 rounded"><Trash2 size={11} className="text-red-500" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Right column: Comments ─── */}
          <div className="w-72 flex-shrink-0 flex flex-col border-l border-gray-800">
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={12} /> Comentários
                {comments.length > 0 && <span className="text-gray-600 font-normal ml-1">({comments.length})</span>}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {[...comments].reverse().map(cm => {
                const author = getMember(cm.authorId);
                return (
                  <div key={cm.id} className="group">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {author?.photo
                          ? <img src={author.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                          : <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center"><span className="text-gray-400 text-[10px] font-bold">{author?.name?.[0] || '?'}</span></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-gray-300">{author?.name || 'Desconhecido'}</span>
                          <span className="text-[10px] text-gray-600">{formatDateTime(cm.createdAt)}</span>
                          {cm.editedAt && <span className="text-[10px] text-gray-700 italic">editado</span>}
                        </div>
                        {editingCommentId === cm.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              value={editingCommentText}
                              onChange={e => setEditingCommentText(e.target.value)}
                              autoFocus
                              rows={2}
                              className="w-full text-xs px-2 py-1.5 bg-gray-800 border border-lime-500 rounded-lg text-gray-300 resize-none focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleSaveEditComment(cm.id)} className="text-[10px] text-lime-400 hover:text-lime-300">salvar</button>
                              <button onClick={() => setEditingCommentId(null)} className="text-[10px] text-gray-600 hover:text-gray-400">cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 leading-relaxed break-words">{cm.text}</p>
                        )}
                        {editingCommentId !== cm.id && (
                          <div className="flex gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingCommentId(cm.id); setEditingCommentText(cm.text); }} className="text-[10px] text-gray-600 hover:text-gray-300">editar</button>
                            <button onClick={() => handleDeleteComment(cm.id)} className="text-[10px] text-gray-600 hover:text-red-400">excluir</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {comments.length === 0 && (
                <p className="text-xs text-gray-700 text-center py-6">Nenhum comentário ainda.</p>
              )}
            </div>
            <div className="flex-shrink-0 px-4 py-3 border-t border-gray-800 space-y-2">
              <select
                value={commentAuthorId}
                onChange={e => setCommentAuthorId(e.target.value)}
                className="w-full text-xs px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:border-lime-500"
              >
                <option value="">De: selecionar membro</option>
                {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <div className="flex gap-2">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  placeholder="Escrever comentário..."
                  rows={2}
                  className="flex-1 text-xs px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 resize-none focus:outline-none focus:border-lime-500 placeholder-gray-600"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || !commentAuthorId}
                  className="px-2.5 py-1.5 bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 rounded-lg text-xs disabled:opacity-40 flex-shrink-0 self-end"
                >
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Modal */}
        <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}>
          <div className="space-y-4">
            <Input label="Nome da Tarefa" value={taskForm.name} onChange={v => setTaskForm({...taskForm, name: v})} placeholder="Ex: Criar identidade visual" />
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Descrição</label>
              <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} placeholder="Detalhes da tarefa..." className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:border-lime-500 focus:outline-none resize-none" rows={3} />
            </div>
            <Select label="Responsável" value={taskForm.responsibleId?.toString() || ''} onChange={v => setTaskForm({...taskForm, responsibleId: v ? (parseInt(v) || v) : ''})} options={[{ value: '', label: 'Sem responsável' }, ...teamMembers.map(m => ({ value: m.id.toString(), label: m.name }))]} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prazo" type="date" value={taskForm.deadline} onChange={v => setTaskForm({...taskForm, deadline: v})} />
              <Input label="Horas Estimadas" type="number" value={taskForm.estimatedHours || ''} onChange={v => setTaskForm({...taskForm, estimatedHours: parseFloat(v) || 0})} placeholder="Ex: 4" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTask}>{editingTask ? 'Salvar' : 'Criar Tarefa'}</Button>
          </div>
        </Modal>

        {/* Phase Modal */}
        <Modal isOpen={isPhaseModalOpen} onClose={() => setIsPhaseModalOpen(false)} title={editingPhase ? 'Editar Fase' : 'Nova Fase do Cronograma'}>
          <div className="space-y-4">
            <Input label="Nome da Fase" value={phaseForm.name} onChange={v => setPhaseForm({...phaseForm, name: v})} placeholder="Ex: Imersão, Criação, Entrega..." />
            <Input label="Prazo de Entrega" type="date" value={phaseForm.deadline} onChange={v => setPhaseForm({...phaseForm, deadline: v})} />
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Descrição (opcional)</label>
              <textarea value={phaseForm.description} onChange={e => setPhaseForm({...phaseForm, description: e.target.value})} placeholder="O que será entregue nesta fase..." className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:border-lime-500 focus:outline-none resize-none" rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsPhaseModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePhase}>{editingPhase ? 'Salvar' : 'Adicionar Fase'}</Button>
          </div>
        </Modal>

      </div>
    </div>
  );
};

// ============================================
// PROJECTS VIEW - KANBAN
// ============================================
const ProjectsView = ({ data, updateData }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({ name: "", columnId: "" });
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnForm, setColumnForm] = useState({ name: "", color: "#8b5cf6", icon: "clipboard" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const projects = data.projects || { columns: [], cards: [], tasks: [] };
  const columns = projects.columns || [];
  const cards = projects.cards || [];
  const allTasks = projects.tasks || [];
  const clients = data.clients || [];
  const teamMembers = data.teamMembers || [];

  // Cores disponíveis para colunas
  const availableColors = [
    "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#22c55e", 
    "#ef4444", "#3b82f6", "#84cc16", "#f97316", "#6366f1"
  ];

  // Ícones disponíveis
  const availableIcons = [
    { id: "clipboard", label: "📋" },
    { id: "pencil", label: "✏️" },
    { id: "eye", label: "👁️" },
    { id: "thumbsup", label: "👍" },
    { id: "check", label: "✅" },
    { id: "star", label: "⭐" },
    { id: "rocket", label: "🚀" },
    { id: "fire", label: "🔥" },
    { id: "clock", label: "⏰" },
    { id: "flag", label: "🚩" }
  ];

  const getIconEmoji = (iconId) => {
    const icon = availableIcons.find(i => i.id === iconId);
    return icon ? icon.label : "📋";
  };

  // Funções de drag and drop
  const handleDragStart = (e, card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedCard && draggedCard.columnId !== columnId) {
      const updatedCards = cards.map(c => 
        c.id === draggedCard.id ? { ...c, columnId } : c
      );
      updateData(prev => ({
        ...prev,
        projects: { ...prev.projects, cards: updatedCards }
      }));
    }
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const getProjectTasks = (cardId) => allTasks.filter(t => t.projectId === cardId);

  // Criação de novo projeto
  const handleCreateProject = () => {
    if (!newProjectForm.name || !newProjectForm.columnId) return;
    const newCard = {
      id: Date.now(), createdAt: new Date().toISOString(),
      name: newProjectForm.name, columnId: newProjectForm.columnId,
      description: '', clientId: '', responsibleId: '',
      deadline: '', estimatedHours: 0,
      checklists: [], schedulePhases: [],
    };
    updateData(prev => ({
      ...prev,
      projects: { ...prev.projects, cards: [...(prev.projects?.cards || []), newCard] }
    }));
    setIsNewProjectModalOpen(false);
    setNewProjectForm({ name: "", columnId: "" });
  };

  const handleDeleteCard = (cardId) => {
    if (!confirm("Excluir este projeto?")) return;
    const updatedCards = cards.filter(c => c.id !== cardId);
    updateData(prev => ({
      ...prev,
      projects: { ...prev.projects, cards: updatedCards }
    }));
  };

  // CRUD de Colunas
  const handleSaveColumn = () => {
    if (!columnForm.name) return;
    
    if (editingColumn) {
      const updatedColumns = columns.map(c => 
        c.id === editingColumn.id ? { ...columnForm, id: c.id } : c
      );
      updateData(prev => ({
        ...prev,
        projects: { ...prev.projects, columns: updatedColumns }
      }));
    } else {
      const newColumn = { ...columnForm, id: Date.now().toString() };
      updateData(prev => ({
        ...prev,
        projects: { ...prev.projects, columns: [...(prev.projects?.columns || []), newColumn] }
      }));
    }
    
    setIsColumnModalOpen(false);
    setEditingColumn(null);
    setColumnForm({ name: "", color: "#8b5cf6", icon: "clipboard" });
  };

  const handleEditColumn = (column) => {
    setEditingColumn(column);
    setColumnForm(column);
    setIsColumnModalOpen(true);
  };

  const handleDeleteColumn = (columnId) => {
    const columnCards = cards.filter(c => c.columnId === columnId);
    if (columnCards.length > 0) {
      alert("Mova ou exclua os projetos desta coluna primeiro.");
      return;
    }
    if (!confirm("Excluir esta coluna?")) return;
    const updatedColumns = columns.filter(c => c.id !== columnId);
    updateData(prev => ({
      ...prev,
      projects: { ...prev.projects, columns: updatedColumns }
    }));
  };

  return (
    <>
    {/* Project Detail Panel - full screen overlay */}
    {selectedProject && (
      <ProjectDetailPanel
        project={cards.find(c => c.id === selectedProject.id) || selectedProject}
        data={data}
        updateData={updateData}
        onClose={() => setSelectedProject(null)}
      />
    )}

    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Projetos</h1>
          <p className="text-gray-500 text-sm">Kanban para gerenciar seus projetos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={Plus}
            onClick={() => { setEditingColumn(null); setColumnForm({ name: "", color: "#8b5cf6", icon: "clipboard" }); setIsColumnModalOpen(true); }}
          >
            Nova Coluna
          </Button>
          <Button
            icon={Plus}
            onClick={() => {
              setNewProjectForm({ name: "", columnId: columns[0]?.id || "" });
              setIsNewProjectModalOpen(true);
            }}
          >
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map(column => {
            const columnCards = cards.filter(c => c.columnId === column.id);
            const isOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className={`w-72 flex-shrink-0 flex flex-col bg-gray-900/50 rounded-2xl border transition-all ${
                  isOver ? 'border-lime-500 bg-lime-900/10' : 'border-gray-800'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div
                  className="p-3 border-b border-gray-800 flex items-center justify-between"
                  style={{ borderTopColor: column.color, borderTopWidth: '3px' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getIconEmoji(column.icon)}</span>
                    <h3 className="font-semibold text-gray-200">{column.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
                      {columnCards.length}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditColumn(column)}
                      className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Edit2 size={14} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteColumn(column.id)}
                      className="p-1.5 hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {columnCards.map(card => {
                    const client = clients.find(c => c.id === card.clientId);
                    const responsible = teamMembers.find(m => m.id === card.responsibleId || m.id === parseInt(card.responsibleId));
                    const isDragging = draggedCard?.id === card.id;
                    const isHovered = hoveredCardId === card.id;
                    const projectTasks = getProjectTasks(card.id);
                    const completedTasks = projectTasks.filter(t => t.completed).length;
                    const isOverdue = card.deadline && new Date(card.deadline + 'T23:59') < new Date();

                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        onMouseEnter={() => setHoveredCardId(card.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                        onClick={() => setSelectedProject(card)}
                        className={`p-3 bg-gray-800 rounded-xl border cursor-pointer transition-all ${
                          isDragging ? 'opacity-50 scale-95 cursor-grabbing' : isHovered ? 'border-lime-600 shadow-lg shadow-lime-500/10' : 'border-gray-700 hover:border-gray-600'
                        } ${isOverdue ? 'border-l-2 border-l-red-500' : ''}`}
                      >
                        {/* Card header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-gray-200 text-sm flex-1 leading-tight">{card.name}</h4>
                          <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-1 hover:bg-red-900/50 rounded"
                              title="Excluir projeto"
                            >
                              <Trash2 size={12} className="text-red-500" />
                            </button>
                          </div>
                        </div>

                        {card.description && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{card.description}</p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 text-xs mb-2">
                          {client && (
                            <span className="px-2 py-0.5 bg-cyan-900/40 text-cyan-400 rounded flex items-center gap-1">
                              <User size={10} /> {client.name}
                            </span>
                          )}
                          {card.deadline && (
                            <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isOverdue ? 'bg-red-900/40 text-red-400' : 'bg-amber-900/40 text-amber-400'}`}>
                              <Calendar size={10} /> {new Date(card.deadline + 'T12:00').toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          {projectTasks.length > 0 && (
                            <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded flex items-center gap-1">
                              <CheckSquare size={10} /> {completedTasks}/{projectTasks.length}
                            </span>
                          )}
                        </div>

                        {/* Footer: responsible + task progress bar */}
                        <div className="flex items-center justify-between gap-2">
                          {responsible ? (
                            <div className="flex items-center gap-1.5">
                              {responsible.photo ? (
                                <img src={responsible.photo} alt={responsible.name} className="w-6 h-6 rounded-full object-cover border border-gray-600" title={responsible.name} />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-lime-500/20 border border-lime-500/40 flex items-center justify-center" title={responsible.name}>
                                  <span className="text-lime-400 text-xs font-bold">{responsible.name?.[0]}</span>
                                </div>
                              )}
                              <span className="text-xs text-gray-500 truncate max-w-20">{responsible.name}</span>
                            </div>
                          ) : <div />}
                          {card.estimatedHours > 0 && (
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <Clock size={10} /> {card.estimatedHours}h
                            </span>
                          )}
                        </div>

                        {/* Tasks preview on hover */}
                        {isHovered && projectTasks.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-700 space-y-1">
                            {projectTasks.slice(0, 4).map(task => {
                              const taskMember = teamMembers.find(m => m.id === task.responsibleId || m.id === parseInt(task.responsibleId));
                              return (
                                <div key={task.id} className="flex items-center gap-2 text-xs">
                                  <div className={`w-3 h-3 rounded-full border flex-shrink-0 flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500'}`}>
                                    {task.completed && <Check size={8} className="text-white" />}
                                  </div>
                                  <span className={`flex-1 truncate ${task.completed ? 'line-through text-gray-600' : 'text-gray-400'}`}>{task.name}</span>
                                  {taskMember && (
                                    taskMember.photo
                                      ? <img src={taskMember.photo} alt="" className="w-4 h-4 rounded-full object-cover flex-shrink-0" />
                                      : <div className="w-4 h-4 rounded-full bg-lime-500/20 flex items-center justify-center flex-shrink-0"><span className="text-lime-400 text-xs">{taskMember.name?.[0]}</span></div>
                                  )}
                                </div>
                              );
                            })}
                            {projectTasks.length > 4 && (
                              <p className="text-xs text-gray-600 text-center pt-0.5">+{projectTasks.length - 4} tarefas</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {columnCards.length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                      <p className="text-sm">Arraste projetos aqui</p>
                    </div>
                  )}
                </div>

                {/* Add card button */}
                <button
                  onClick={() => {
                    setNewProjectForm({ name: "", columnId: column.id });
                    setIsNewProjectModalOpen(true);
                  }}
                  className="m-2 p-2 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Adicionar projeto
                </button>
              </div>
            );
          })}

          {/* Add column button */}
          <button
            onClick={() => { setEditingColumn(null); setColumnForm({ name: "", color: "#8b5cf6", icon: "clipboard" }); setIsColumnModalOpen(true); }}
            className="w-72 flex-shrink-0 flex flex-col items-center justify-center bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-800 hover:border-gray-700 transition-colors"
          >
            <Plus size={24} className="text-gray-600 mb-2" />
            <span className="text-gray-600">Nova Coluna</span>
          </button>
        </div>
      </div>

      {/* Modal Novo Projeto */}
      <Modal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} title="Novo Projeto">
        <div className="space-y-4">
          <Input
            label="Nome do Projeto"
            value={newProjectForm.name}
            onChange={(v) => setNewProjectForm({...newProjectForm, name: v})}
            placeholder="Ex: Identidade Visual - Cliente X"
          />
          <Select
            label="Coluna"
            value={newProjectForm.columnId}
            onChange={(v) => setNewProjectForm({...newProjectForm, columnId: v})}
            options={columns.map(c => ({ value: c.id, label: c.name }))}
          />
        </div>
        <p className="text-xs text-gray-600 mt-3">Os demais dados (cliente, responsável, prazo, etc.) podem ser preenchidos ao abrir o projeto.</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setIsNewProjectModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateProject}>Criar Projeto</Button>
        </div>
      </Modal>

      {/* Modal Nova/Editar Coluna */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} title={editingColumn ? "Editar Coluna" : "Nova Coluna"}>
        <div className="space-y-4">
          <Input 
            label="Nome da Coluna" 
            value={columnForm.name} 
            onChange={(v) => setColumnForm({...columnForm, name: v})} 
            placeholder="Ex: Em Produção"
          />
          
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => setColumnForm({...columnForm, color})}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    columnForm.color === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Ícone</label>
            <div className="flex gap-2 flex-wrap">
              {availableIcons.map(icon => (
                <button
                  key={icon.id}
                  onClick={() => setColumnForm({...columnForm, icon: icon.id})}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    columnForm.icon === icon.id 
                      ? 'bg-gray-700 ring-2 ring-lime-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {icon.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-6 rounded"
                style={{ backgroundColor: columnForm.color }}
              />
              <span className="text-lg">{getIconEmoji(columnForm.icon)}</span>
              <span className="font-medium text-gray-200">{columnForm.name || "Nome da coluna"}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsColumnModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveColumn}>{editingColumn ? "Salvar" : "Criar Coluna"}</Button>
        </div>
      </Modal>
    </div>
    </>
  );
};

// ============================================
// BUDGETS VIEW - ORÇAMENTOS
// ============================================
const BudgetsView = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSelectTemplateOpen, setIsSelectTemplateOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalTab, setProposalTab] = useState("dados");
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingCost, setEditingCost] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedBudgetForProposal, setSelectedBudgetForProposal] = useState(null);
  
  const budgetConfig = data.budgetConfig || initialData.budgetConfig;
  const budgets = data.budgets || [];
  const budgetTemplates = data.budgetTemplates || [];
  const clients = data.clients || [];
  const leads = data.leads || [];
  const proposalDefaults = budgetConfig.proposalDefaults || initialData.budgetConfig.proposalDefaults;
  
  const structureCosts = budgetConfig.structureCosts || [];
  const teamCosts = budgetConfig.teamCosts || [];
  const defaultMargins = budgetConfig.defaultMargins || { negotiation: 0, profit: 20, tax: 6, commission: 0 };
  const installmentOptions = budgetConfig.installmentOptions || [
    { id: 1, name: "12x Cartão", installments: 12, percentage: 10 },
    { id: 2, name: "6x Boleto", installments: 6, percentage: 8 }
  ];

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  const formatCurrencyClean = (value) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0);

  // Gerar código da proposta: ano (2 dígitos) + número sequencial (2 dígitos)
  const generateProposalCode = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const counter = (data.proposalCounter || 0) + 1;
    return `${year}${counter.toString().padStart(2, '0')}`;
  };

  // Formatar data por extenso
  const formatDateExtended = (date) => {
    const d = new Date(date);
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Estado do formulário de proposta
  const [proposalForm, setProposalForm] = useState({
    code: "",
    date: new Date().toISOString().split('T')[0],
    serviceName: "",
    clientName: "",
    tagline: "",
    subtitle: "",
    challenge: {
      scenario: "",
      pain: "",
      objective: ""
    },
    method: proposalDefaults?.method || [],
    deliveryMode: "packages", // "packages" ou "list"
    packages: [],
    listItems: [],
    directPayment: proposalDefaults?.directPayment || { start: 40, approval: 30, delivery: 30 },
    estimatedWeeks: proposalDefaults?.estimatedWeeks || 8,
    validityDays: proposalDefaults?.validityDays || 5
  });

  // Cálculos principais
  const totalStructureCosts = structureCosts.reduce((acc, c) => acc + (c.value || 0), 0);
  const totalTeamCosts = teamCosts.reduce((acc, t) => acc + (t.salary || 0) + (t.thirteenth || 0) + (t.charges || 0), 0);
  const totalFixedCosts = totalStructureCosts + totalTeamCosts;
  
  // Horas disponíveis
  const totalHoursPerMonth = teamCosts.reduce((acc, t) => acc + ((t.hoursPerDay || 8) * (t.daysPerMonth || 20)), 0);
  const meetingHours = (budgetConfig.hoursDistribution?.meetingHoursPerDay || 3) * (budgetConfig.hoursDistribution?.meetingDaysPerMonth || 4) * teamCosts.length;
  const adminHours = (budgetConfig.hoursDistribution?.adminHoursPerDay || 4) * (budgetConfig.hoursDistribution?.adminDaysPerMonth || 20);
  const productiveHours = totalHoursPerMonth - meetingHours - adminHours;
  
  // Custo hora
  const costPerHour = productiveHours > 0 ? totalFixedCosts / productiveHours : 0;
  
  // Custo hora por pessoa
  const getPersonCostPerHour = (person) => {
    const totalCost = (person.salary || 0) + (person.thirteenth || 0) + (person.charges || 0);
    const hours = (person.hoursPerDay || 8) * (person.daysPerMonth || 20);
    return hours > 0 ? totalCost / hours : 0;
  };
  
  // Custo operacional por hora
  const operationalCostPerHour = productiveHours > 0 ? totalStructureCosts / productiveHours : 0;

  // Estado do formulário de orçamento
  const [budgetForm, setBudgetForm] = useState({
    name: "",
    clientId: "",
    leadId: "",
    items: [],
    variableCosts: [],
    margins: { ...defaultMargins },
    installments: 1
  });

  // Estado do formulário de custo estrutura
  const [costForm, setCostForm] = useState({ name: "", value: 0, description: "", category: "Software" });
  
  // Estado do formulário de pessoa
  const [teamForm, setTeamForm] = useState({ name: "", salary: 0, thirteenth: 0, charges: 0, hoursPerDay: 8, daysPerMonth: 20 });

  // Estado do formulário de template
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    items: [],
    variableCosts: [],
    margins: { ...defaultMargins },
    installments: 1
  });

  // Categorias de custos estrutura
  const costCategories = ["Software", "Escritório", "Equipamentos", "Capacitação", "Reserva", "Transporte", "Marketing", "Serviços"];

  // Calcular orçamento
  const calculateBudget = (budget) => {
    // Custo de pessoal
    const personnelCost = budget.items.reduce((acc, item) => {
      const person = teamCosts.find(t => t.name === item.person);
      if (!person) return acc;
      const hourCost = getPersonCostPerHour(person);
      return acc + (hourCost * (item.hours || 0));
    }, 0);
    
    // Horas totais
    const totalHours = budget.items.reduce((acc, item) => acc + (item.hours || 0), 0);
    
    // Custo operacional
    const operationalCost = totalHours * operationalCostPerHour;
    
    // Custo fixo total
    const fixedCostTotal = personnelCost + operationalCost;
    
    // Custos variáveis
    const variableCostsTotal = (budget.variableCosts || []).reduce((acc, c) => acc + (c.value || 0), 0);
    
    // Custo total de produção
    const productionCost = fixedCostTotal + variableCostsTotal;
    
    // Margens
    const margins = budget.margins || defaultMargins;
    const totalMarginPercent = (margins.negotiation || 0) + (margins.profit || 0) + (margins.tax || 0) + (margins.commission || 0);
    const correspondingPercent = 100 - totalMarginPercent;
    
    // Valor bruto (regra de 3)
    const grossValue = correspondingPercent > 0 ? (productionCost * 100) / correspondingPercent : productionCost;
    
    // Valores das margens
    const negotiationValue = grossValue * ((margins.negotiation || 0) / 100);
    const profitValue = grossValue * ((margins.profit || 0) / 100);
    const taxValue = grossValue * ((margins.tax || 0) / 100);
    const commissionValue = grossValue * ((margins.commission || 0) / 100);
    const totalMarginsValue = negotiationValue + profitValue + taxValue + commissionValue;
    
    // Arredondar
    const roundedValue = Math.ceil(grossValue / 10) * 10;
    const installmentValue = budget.installments > 0 ? roundedValue / budget.installments : roundedValue;
    
    return {
      personnelCost,
      operationalCost,
      fixedCostTotal,
      variableCostsTotal,
      productionCost,
      correspondingPercent,
      negotiationValue,
      profitValue,
      taxValue,
      commissionValue,
      totalMarginsValue,
      grossValue,
      roundedValue,
      installmentValue,
      totalHours
    };
  };

  // Salvar orçamento
  const handleSaveBudget = () => {
    if (!budgetForm.name) return;
    
    const calc = calculateBudget(budgetForm);
    const budgetToSave = {
      ...budgetForm,
      id: editingBudget?.id || Date.now(),
      createdAt: editingBudget?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      calculatedValue: calc.roundedValue
    };
    
    if (editingBudget) {
      updateData(prev => ({
        ...prev,
        budgets: prev.budgets.map(b => b.id === editingBudget.id ? budgetToSave : b)
      }));
    } else {
      updateData(prev => ({
        ...prev,
        budgets: [...(prev.budgets || []), budgetToSave]
      }));
    }
    
    setIsModalOpen(false);
    setEditingBudget(null);
    setBudgetForm({ name: "", clientId: "", items: [], variableCosts: [], margins: { ...defaultMargins }, installments: 1 });
  };

  // Adicionar item ao orçamento
  const addBudgetItem = () => {
    setBudgetForm(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), task: "", person: teamCosts[0]?.name || "", days: 1, hoursPerDay: 8, hours: 8 }]
    }));
  };

  // Atualizar item do orçamento
  const updateBudgetItem = (itemId, field, value) => {
    setBudgetForm(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== itemId) return item;
        const updated = { ...item, [field]: value };
        if (field === 'days' || field === 'hoursPerDay') {
          updated.hours = (updated.days || 1) * (updated.hoursPerDay || 8);
        }
        return updated;
      })
    }));
  };

  // Remover item do orçamento
  const removeBudgetItem = (itemId) => {
    setBudgetForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Adicionar custo variável
  const addVariableCost = () => {
    setBudgetForm(prev => ({
      ...prev,
      variableCosts: [...prev.variableCosts, { id: Date.now(), name: "", value: 0 }]
    }));
  };

  // Salvar custo estrutura
  const handleSaveCost = () => {
    if (!costForm.name) return;
    
    if (editingCost) {
      updateData(prev => ({
        ...prev,
        budgetConfig: {
          ...prev.budgetConfig,
          structureCosts: prev.budgetConfig.structureCosts.map(c => c.id === editingCost.id ? { ...costForm, id: c.id } : c)
        }
      }));
    } else {
      updateData(prev => ({
        ...prev,
        budgetConfig: {
          ...prev.budgetConfig,
          structureCosts: [...(prev.budgetConfig?.structureCosts || []), { ...costForm, id: Date.now() }]
        }
      }));
    }
    
    setIsCostModalOpen(false);
    setEditingCost(null);
    setCostForm({ name: "", value: 0, description: "", category: "Software" });
  };

  // Salvar pessoa da equipe
  const handleSaveTeam = () => {
    if (!teamForm.name) return;
    
    if (editingTeam) {
      updateData(prev => ({
        ...prev,
        budgetConfig: {
          ...prev.budgetConfig,
          teamCosts: prev.budgetConfig.teamCosts.map(t => t.id === editingTeam.id ? { ...teamForm, id: t.id } : t)
        }
      }));
    } else {
      updateData(prev => ({
        ...prev,
        budgetConfig: {
          ...prev.budgetConfig,
          teamCosts: [...(prev.budgetConfig?.teamCosts || []), { ...teamForm, id: Date.now() }]
        }
      }));
    }
    
    setIsTeamModalOpen(false);
    setEditingTeam(null);
    setTeamForm({ name: "", salary: 0, thirteenth: 0, charges: 0, hoursPerDay: 8, daysPerMonth: 20 });
  };

  // Excluir orçamento
  const handleDeleteBudget = (id) => {
    if (!confirm("Excluir este orçamento?")) return;
    updateData(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id)
    }));
  };

  // Salvar template
  const handleSaveTemplate = () => {
    if (!templateForm.name) return;
    
    const templateToSave = {
      ...templateForm,
      id: editingTemplate?.id || Date.now(),
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (editingTemplate) {
      updateData(prev => ({
        ...prev,
        budgetTemplates: (prev.budgetTemplates || []).map(t => t.id === editingTemplate.id ? templateToSave : t)
      }));
    } else {
      updateData(prev => ({
        ...prev,
        budgetTemplates: [...(prev.budgetTemplates || []), templateToSave]
      }));
    }
    
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
    setTemplateForm({ name: "", description: "", items: [], variableCosts: [], margins: { ...defaultMargins }, installments: 1 });
  };

  // Excluir template
  const handleDeleteTemplate = (id) => {
    if (!confirm("Excluir este modelo?")) return;
    updateData(prev => ({
      ...prev,
      budgetTemplates: (prev.budgetTemplates || []).filter(t => t.id !== id)
    }));
  };

  // Usar template para criar orçamento
  const handleUseTemplate = (template) => {
    setBudgetForm({
      name: "",
      clientId: "",
      items: template.items.map(item => ({ ...item, id: Date.now() + Math.random() })),
      variableCosts: template.variableCosts.map(vc => ({ ...vc, id: Date.now() + Math.random() })),
      margins: { ...template.margins },
      installments: template.installments || 1
    });
    setIsSelectTemplateOpen(false);
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  // ========== FUNÇÕES DE PROPOSTA ==========
  
  // Abrir modal de proposta a partir de um orçamento
  const openProposalModal = (budget) => {
    const calc = calculateBudget(budget);
    const client = clients.find(c => c.id === budget.clientId);
    const lead = leads.find(l => l.id === budget.leadId);
    const clientName = client?.name || lead?.name || "";
    
    // Verificar se já existe proposta salva no orçamento
    if (budget.proposal) {
      setProposalForm(budget.proposal);
    } else {
      // Criar nova proposta com dados do orçamento
      const newCode = generateProposalCode();
      
      // Agrupar itens por categoria/pessoa para criar pacotes
      const packages = [];
      const itemsByPerson = {};
      (budget.items || []).forEach(item => {
        const key = item.person || 'Geral';
        if (!itemsByPerson[key]) {
          itemsByPerson[key] = { name: key, items: [], value: 0 };
        }
        itemsByPerson[key].items.push(item.task);
        // Calcular valor proporcional do item
        const person = teamCosts.find(t => t.name === item.person);
        const personCostPerHour = person ? getPersonCostPerHour(person) : 0;
        const operationalCost = (item.hours || 0) * operationalCostPerHour;
        const personnelCost = (item.hours || 0) * personCostPerHour;
        itemsByPerson[key].value += personnelCost + operationalCost;
      });
      
      // Converter para array de pacotes
      Object.values(itemsByPerson).forEach(pkg => {
        packages.push({
          id: Date.now() + Math.random(),
          name: pkg.name,
          items: pkg.items,
          value: Math.round(pkg.value)
        });
      });
      
      setProposalForm({
        code: newCode,
        date: new Date().toISOString().split('T')[0],
        serviceName: budget.name || "Proposta Comercial",
        clientName: clientName,
        tagline: "",
        subtitle: "",
        challenge: {
          scenario: "",
          pain: "",
          objective: ""
        },
        method: proposalDefaults?.method || [],
        deliveryMode: "packages",
        packages: packages.length > 0 ? packages : [{ id: Date.now(), name: "Escopo do Projeto", items: budget.items.map(i => i.task), value: calc.roundedValue }],
        listItems: budget.items.map(i => i.task),
        directPayment: proposalDefaults?.directPayment || { start: 40, approval: 30, delivery: 30 },
        estimatedWeeks: proposalDefaults?.estimatedWeeks || 8,
        validityDays: proposalDefaults?.validityDays || 5
      });
    }
    
    setSelectedBudgetForProposal(budget);
    setProposalTab("dados");
    setIsProposalModalOpen(true);
  };

  // Salvar proposta no orçamento
  const handleSaveProposal = () => {
    if (!selectedBudgetForProposal) return;
    
    // Incrementar contador se for proposta nova
    const isNewProposal = !selectedBudgetForProposal.proposal;
    
    updateData(prev => ({
      ...prev,
      proposalCounter: isNewProposal ? (prev.proposalCounter || 0) + 1 : prev.proposalCounter,
      budgets: prev.budgets.map(b => 
        b.id === selectedBudgetForProposal.id 
          ? { ...b, proposal: proposalForm }
          : b
      )
    }));
    
    setIsProposalModalOpen(false);
    setSelectedBudgetForProposal(null);
  };

  // Adicionar pacote na proposta
  const addProposalPackage = () => {
    setProposalForm(prev => ({
      ...prev,
      packages: [...prev.packages, { id: Date.now(), name: "Novo Pacote", items: [], value: 0 }]
    }));
  };

  // Atualizar pacote
  const updateProposalPackage = (pkgId, field, value) => {
    setProposalForm(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => pkg.id === pkgId ? { ...pkg, [field]: value } : pkg)
    }));
  };

  // Remover pacote
  const removeProposalPackage = (pkgId) => {
    setProposalForm(prev => ({
      ...prev,
      packages: prev.packages.filter(pkg => pkg.id !== pkgId)
    }));
  };

  // Adicionar item a um pacote
  const addItemToPackage = (pkgId) => {
    setProposalForm(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => 
        pkg.id === pkgId 
          ? { ...pkg, items: [...pkg.items, ""] }
          : pkg
      )
    }));
  };

  // Atualizar item de um pacote
  const updatePackageItem = (pkgId, itemIndex, value) => {
    setProposalForm(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => 
        pkg.id === pkgId 
          ? { ...pkg, items: pkg.items.map((item, idx) => idx === itemIndex ? value : item) }
          : pkg
      )
    }));
  };

  // Remover item de um pacote
  const removePackageItem = (pkgId, itemIndex) => {
    setProposalForm(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => 
        pkg.id === pkgId 
          ? { ...pkg, items: pkg.items.filter((_, idx) => idx !== itemIndex) }
          : pkg
      )
    }));
  };

  // Adicionar item ao template
  const addTemplateItem = () => {
    setTemplateForm(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), task: "", person: teamCosts[0]?.name || "", days: 1, hoursPerDay: 8, hours: 8 }]
    }));
  };

  // Atualizar item do template
  const updateTemplateItem = (itemId, field, value) => {
    setTemplateForm(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== itemId) return item;
        const updated = { ...item, [field]: value };
        if (field === 'days' || field === 'hoursPerDay') {
          updated.hours = (updated.days || 1) * (updated.hoursPerDay || 8);
        }
        return updated;
      })
    }));
  };

  // Remover item do template
  const removeTemplateItem = (itemId) => {
    setTemplateForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Adicionar custo variável ao template
  const addTemplateVariableCost = () => {
    setTemplateForm(prev => ({
      ...prev,
      variableCosts: [...prev.variableCosts, { id: Date.now(), name: "", value: 0 }]
    }));
  };

  // Tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "templates", label: "Modelos", icon: FileText },
    { id: "structure", label: "Custos Estrutura", icon: Building },
    { id: "team", label: "Custos Pessoal", icon: UserCog },
    { id: "hours", label: "Divisão de Horas", icon: Clock },
    { id: "hourCost", label: "Custo Hora", icon: Coins }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Orçamentos</h1>
          <p className="text-gray-500 text-sm">Calculadora de orçamentos baseada em custo/hora</p>
        </div>
        {activeTab === "dashboard" && (
          <div className="flex gap-2">
            {budgetTemplates.length > 0 && (
              <Button variant="secondary" icon={FileText} onClick={() => setIsSelectTemplateOpen(true)}>
                Usar Modelo
              </Button>
            )}
            <Button icon={Plus} onClick={() => { setEditingBudget(null); setBudgetForm({ name: "", clientId: "", items: [], variableCosts: [], margins: { ...defaultMargins }, installments: 1 }); setIsModalOpen(true); }}>
              Novo Orçamento
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-lime-500 text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-xs text-gray-500">Custo Fixo Total</p>
              <p className="text-xl font-bold text-amber-400">{formatCurrency(totalFixedCosts)}</p>
              <p className="text-xs text-gray-600">mensal</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500">Horas Produtivas</p>
              <p className="text-xl font-bold text-cyan-400">{productiveHours}h</p>
              <p className="text-xs text-gray-600">por mês</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500">Custo/Hora Empresa</p>
              <p className="text-xl font-bold text-emerald-400">{formatCurrency(costPerHour)}</p>
              <p className="text-xs text-gray-600">base</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500">Orçamentos</p>
              <p className="text-xl font-bold text-violet-400">{budgets.length}</p>
              <p className="text-xs text-gray-600">criados</p>
            </Card>
          </div>

          {/* Lista de Orçamentos */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-100 mb-4">Orçamentos Salvos</h3>
            {budgets.length > 0 ? (
              <div className="space-y-2">
                {budgets.map(budget => {
                  const client = clients.find(c => c.id === budget.clientId);
                  const lead = leads.find(l => l.id === budget.leadId);
                  const hasProposal = !!budget.proposal;
                  return (
                    <div key={budget.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-200">{budget.name}</p>
                          {hasProposal && (
                            <span className="text-xs px-2 py-0.5 bg-violet-900/50 text-violet-400 rounded-full">
                              #{budget.proposal.code}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          {lead && <span className="text-lime-400 bg-lime-900/30 px-2 py-0.5 rounded">Lead: {lead.name}</span>}
                          {client && <span className="text-cyan-400">Cliente: {client.name}</span>}
                          <span>{new Date(budget.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span>{budget.items?.length || 0} itens</span>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-xl font-bold text-emerald-400">{formatCurrency(budget.calculatedValue)}</p>
                        {budget.installments > 1 && (
                          <p className="text-xs text-gray-500">{budget.installments}x de {formatCurrency(budget.calculatedValue / budget.installments)}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => openProposalModal(budget)}
                          className={`p-2 rounded-lg transition-colors ${hasProposal ? 'bg-violet-900/50 hover:bg-violet-900' : 'hover:bg-violet-900/50'}`}
                          title={hasProposal ? "Editar Proposta" : "Gerar Proposta"}
                        >
                          <FileText size={16} className="text-violet-400" />
                        </button>
                        <button 
                          onClick={() => { setEditingBudget(budget); setBudgetForm(budget); setIsModalOpen(true); }}
                          className="p-2 hover:bg-gray-700 rounded-lg"
                          title="Editar Orçamento"
                        >
                          <Edit2 size={16} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="p-2 hover:bg-red-900/50 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Calculator size={32} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum orçamento criado</p>
                <p className="text-sm">Clique em "Novo Orçamento" para começar</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Modelos de orçamento para reutilizar</p>
            <Button icon={Plus} onClick={() => { setEditingTemplate(null); setTemplateForm({ name: "", description: "", items: [], variableCosts: [], margins: { ...defaultMargins }, installments: 1 }); setIsTemplateModalOpen(true); }}>
              Novo Modelo
            </Button>
          </div>
          
          {budgetTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetTemplates.map(template => {
                const totalHours = template.items.reduce((acc, item) => acc + (item.hours || 0), 0);
                return (
                  <Card key={template.id} className="p-4 hover:border-lime-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-100">{template.name}</h3>
                        {template.description && <p className="text-xs text-gray-500 mt-1">{template.description}</p>}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => { setEditingTemplate(template); setTemplateForm(template); setIsTemplateModalOpen(true); }}
                          className="p-1.5 hover:bg-gray-700 rounded-lg"
                        >
                          <Edit2 size={14} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1.5 hover:bg-red-900/50 rounded-lg"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Itens de trabalho:</span>
                        <span className="text-gray-200">{template.items.length}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Horas totais:</span>
                        <span className="text-cyan-400">{totalHours}h</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Margens:</span>
                        <span className="text-gray-200">
                          {(template.margins?.commission || 0) + (template.margins?.negotiation || 0) + (template.margins?.profit || 0) + (template.margins?.tax || 0)}%
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full mt-4 p-2 bg-lime-600 hover:bg-lime-500 text-gray-900 font-medium rounded-lg transition-colors"
                    >
                      Usar este Modelo
                    </button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <FileText size={32} className="mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">Nenhum modelo criado</p>
              <p className="text-sm text-gray-600 mt-1">Crie modelos para agilizar a criação de orçamentos</p>
              <Button 
                icon={Plus} 
                className="mt-4"
                onClick={() => { setEditingTemplate(null); setTemplateForm({ name: "", description: "", items: [], variableCosts: [], margins: { ...defaultMargins }, installments: 1 }); setIsTemplateModalOpen(true); }}
              >
                Criar Primeiro Modelo
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Custos Estrutura Tab */}
      {activeTab === "structure" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Custos fixos mensais da empresa</p>
            <Button icon={Plus} onClick={() => { setEditingCost(null); setCostForm({ name: "", value: 0, description: "", category: "Software" }); setIsCostModalOpen(true); }}>
              Adicionar Custo
            </Button>
          </div>
          
          {/* Agrupar por categoria */}
          {costCategories.map(category => {
            const categoryCosts = structureCosts.filter(c => c.category === category);
            if (categoryCosts.length === 0) return null;
            const categoryTotal = categoryCosts.reduce((acc, c) => acc + (c.value || 0), 0);
            
            return (
              <Card key={category} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-200">{category}</h3>
                  <span className="text-amber-400 font-bold">{formatCurrency(categoryTotal)}</span>
                </div>
                <div className="space-y-2">
                  {categoryCosts.map(cost => (
                    <div key={cost.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-gray-300 text-sm">{cost.name}</p>
                        {cost.description && <p className="text-xs text-gray-600">{cost.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{formatCurrency(cost.value)}</span>
                        <button onClick={() => { setEditingCost(cost); setCostForm(cost); setIsCostModalOpen(true); }} className="p-1 hover:bg-gray-700 rounded">
                          <Edit2 size={14} className="text-gray-500" />
                        </button>
                        <button onClick={() => {
                          if (confirm("Excluir este custo?")) {
                            updateData(prev => ({
                              ...prev,
                              budgetConfig: {
                                ...prev.budgetConfig,
                                structureCosts: prev.budgetConfig.structureCosts.filter(c => c.id !== cost.id)
                              }
                            }));
                          }
                        }} className="p-1 hover:bg-red-900/50 rounded">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
          
          <Card className="p-4 bg-amber-900/20 border-amber-700">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold">Total Custos Estrutura</span>
              <span className="text-2xl font-bold text-amber-400">{formatCurrency(totalStructureCosts)}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Custos Pessoal Tab */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Custos com equipe (salários + encargos)</p>
            <Button icon={Plus} onClick={() => { setEditingTeam(null); setTeamForm({ name: "", salary: 0, thirteenth: 0, charges: 0, hoursPerDay: 8, daysPerMonth: 20 }); setIsTeamModalOpen(true); }}>
              Adicionar Pessoa
            </Button>
          </div>
          
          <Card className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                    <th className="pb-2">Nome</th>
                    <th className="pb-2">Salário</th>
                    <th className="pb-2">13º (mensal)</th>
                    <th className="pb-2">Encargos</th>
                    <th className="pb-2">Total/mês</th>
                    <th className="pb-2">Horas/mês</th>
                    <th className="pb-2">Custo/hora</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {teamCosts.map(person => {
                    const total = (person.salary || 0) + (person.thirteenth || 0) + (person.charges || 0);
                    const hours = (person.hoursPerDay || 8) * (person.daysPerMonth || 20);
                    const hourCost = hours > 0 ? total / hours : 0;
                    
                    return (
                      <tr key={person.id} className="border-b border-gray-800/50">
                        <td className="py-3 text-gray-200">{person.name}</td>
                        <td className="py-3 text-gray-400">{formatCurrency(person.salary)}</td>
                        <td className="py-3 text-gray-400">{formatCurrency(person.thirteenth)}</td>
                        <td className="py-3 text-gray-400">{formatCurrency(person.charges)}</td>
                        <td className="py-3 text-emerald-400 font-medium">{formatCurrency(total)}</td>
                        <td className="py-3 text-cyan-400">{hours}h</td>
                        <td className="py-3 text-amber-400 font-medium">{formatCurrency(hourCost)}</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <button onClick={() => { setEditingTeam(person); setTeamForm(person); setIsTeamModalOpen(true); }} className="p-1 hover:bg-gray-700 rounded">
                              <Edit2 size={14} className="text-gray-500" />
                            </button>
                            <button onClick={() => {
                              if (confirm("Excluir esta pessoa?")) {
                                updateData(prev => ({
                                  ...prev,
                                  budgetConfig: {
                                    ...prev.budgetConfig,
                                    teamCosts: prev.budgetConfig.teamCosts.filter(t => t.id !== person.id)
                                  }
                                }));
                              }
                            }} className="p-1 hover:bg-red-900/50 rounded">
                              <Trash2 size={14} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card className="p-4 bg-emerald-900/20 border-emerald-700">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">Total Custos Pessoal</span>
              <span className="text-2xl font-bold text-emerald-400">{formatCurrency(totalTeamCosts)}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Divisão de Horas Tab */}
      {activeTab === "hours" && (
        <div className="space-y-4">
          <p className="text-gray-400">Entenda as horas disponíveis para produção</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-bold text-gray-200 mb-3">Horas Totais</h3>
              <p className="text-3xl font-bold text-gray-100">{totalHoursPerMonth}h</p>
              <p className="text-xs text-gray-500">Total disponível no mês</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-bold text-gray-200 mb-3">Reuniões + Administrativo</h3>
              <p className="text-3xl font-bold text-red-400">-{meetingHours + adminHours}h</p>
              <p className="text-xs text-gray-500">Reuniões: {meetingHours}h | Admin: {adminHours}h</p>
            </Card>
            
            <Card className="p-4 bg-lime-900/20 border-lime-700">
              <h3 className="font-bold text-lime-400 mb-3">Horas Produtivas</h3>
              <p className="text-3xl font-bold text-lime-400">{productiveHours}h</p>
              <p className="text-xs text-gray-500">Disponível para projetos</p>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="font-bold text-gray-200 mb-4">Configurar Horas Não Produtivas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500">Reuniões (h/dia)</label>
                <input
                  type="number"
                  value={budgetConfig.hoursDistribution?.meetingHoursPerDay || 3}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      hoursDistribution: { ...prev.budgetConfig?.hoursDistribution, meetingHoursPerDay: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Dias com reunião/mês</label>
                <input
                  type="number"
                  value={budgetConfig.hoursDistribution?.meetingDaysPerMonth || 4}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      hoursDistribution: { ...prev.budgetConfig?.hoursDistribution, meetingDaysPerMonth: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Admin (h/dia)</label>
                <input
                  type="number"
                  value={budgetConfig.hoursDistribution?.adminHoursPerDay || 4}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      hoursDistribution: { ...prev.budgetConfig?.hoursDistribution, adminHoursPerDay: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Dias admin/mês</label>
                <input
                  type="number"
                  value={budgetConfig.hoursDistribution?.adminDaysPerMonth || 20}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      hoursDistribution: { ...prev.budgetConfig?.hoursDistribution, adminDaysPerMonth: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Custo Hora Tab */}
      {activeTab === "hourCost" && (
        <div className="space-y-4">
          <p className="text-gray-400">Cálculo do custo por hora da empresa</p>
          
          <Card className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                  <th className="pb-3">Item</th>
                  <th className="pb-3 text-right">Custo</th>
                  <th className="pb-3 text-right">Horas/mês</th>
                  <th className="pb-3 text-right">Valor/hora</th>
                </tr>
              </thead>
              <tbody>
                {teamCosts.map(person => {
                  const total = (person.salary || 0) + (person.thirteenth || 0) + (person.charges || 0);
                  const hours = (person.hoursPerDay || 8) * (person.daysPerMonth || 20);
                  return (
                    <tr key={person.id} className="border-b border-gray-800/50">
                      <td className="py-3 text-gray-200">{person.name}</td>
                      <td className="py-3 text-right text-gray-400">{formatCurrency(total)}</td>
                      <td className="py-3 text-right text-gray-400">{hours}h</td>
                      <td className="py-3 text-right text-emerald-400">{formatCurrency(getPersonCostPerHour(person))}</td>
                    </tr>
                  );
                })}
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 text-gray-200">Custo Fixo Estrutura</td>
                  <td className="py-3 text-right text-gray-400">{formatCurrency(totalStructureCosts)}</td>
                  <td className="py-3 text-right text-gray-400">{productiveHours}h</td>
                  <td className="py-3 text-right text-emerald-400">{formatCurrency(operationalCostPerHour)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-emerald-600">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Custo Hora da Empresa</p>
              <p className="text-4xl font-bold text-emerald-400">{formatCurrency(costPerHour)}</p>
              <p className="text-sm text-gray-500 mt-2">Base para cálculo de orçamentos</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-bold text-gray-200 mb-4">Margens Padrão</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500">Negociação (%)</label>
                <input
                  type="number"
                  value={defaultMargins.negotiation}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      defaultMargins: { ...prev.budgetConfig?.defaultMargins, negotiation: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Lucro (%)</label>
                <input
                  type="number"
                  value={defaultMargins.profit}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      defaultMargins: { ...prev.budgetConfig?.defaultMargins, profit: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Imposto (%)</label>
                <input
                  type="number"
                  value={defaultMargins.tax}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      defaultMargins: { ...prev.budgetConfig?.defaultMargins, tax: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Comissão (%)</label>
                <input
                  type="number"
                  value={defaultMargins.commission}
                  onChange={(e) => updateData(prev => ({
                    ...prev,
                    budgetConfig: {
                      ...prev.budgetConfig,
                      defaultMargins: { ...prev.budgetConfig?.defaultMargins, commission: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                />
              </div>
            </div>
          </Card>
          
          {/* Opções de Parcelamento */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-200">💳 Opções de Parcelamento</h3>
              <button
                onClick={() => updateData(prev => ({
                  ...prev,
                  budgetConfig: {
                    ...prev.budgetConfig,
                    installmentOptions: [...(prev.budgetConfig?.installmentOptions || []), { id: Date.now(), name: "Nova Opção", installments: 3, percentage: 5 }]
                  }
                }))}
                className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
            
            {installmentOptions.length > 0 ? (
              <div className="space-y-3">
                {installmentOptions.map((option, idx) => (
                  <div key={option.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-800/50 rounded-lg">
                    <div className="col-span-4">
                      <label className="text-xs text-gray-500">Nome</label>
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateData(prev => ({
                          ...prev,
                          budgetConfig: {
                            ...prev.budgetConfig,
                            installmentOptions: prev.budgetConfig.installmentOptions.map((o, i) => 
                              i === idx ? { ...o, name: e.target.value } : o
                            )
                          }
                        }))}
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                        placeholder="Ex: 12x Cartão"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-gray-500">Parcelas</label>
                      <input
                        type="number"
                        value={option.installments}
                        onChange={(e) => updateData(prev => ({
                          ...prev,
                          budgetConfig: {
                            ...prev.budgetConfig,
                            installmentOptions: prev.budgetConfig.installmentOptions.map((o, i) => 
                              i === idx ? { ...o, installments: parseInt(e.target.value) || 1 } : o
                            )
                          }
                        }))}
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                        min="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs text-gray-500">Acréscimo (%)</label>
                      <input
                        type="number"
                        value={option.percentage}
                        onChange={(e) => updateData(prev => ({
                          ...prev,
                          budgetConfig: {
                            ...prev.budgetConfig,
                            installmentOptions: prev.budgetConfig.installmentOptions.map((o, i) => 
                              i === idx ? { ...o, percentage: parseFloat(e.target.value) || 0 } : o
                            )
                          }
                        }))}
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                        step="0.5"
                      />
                    </div>
                    <div className="col-span-2">
                      <button
                        onClick={() => updateData(prev => ({
                          ...prev,
                          budgetConfig: {
                            ...prev.budgetConfig,
                            installmentOptions: prev.budgetConfig.installmentOptions.filter((_, i) => i !== idx)
                          }
                        }))}
                        className="w-full p-2 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma opção de parcelamento configurada</p>
            )}
          </Card>
        </div>
      )}

      {/* Modal Novo Orçamento */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBudget ? "Editar Orçamento" : "Novo Orçamento"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Nome do Orçamento" value={budgetForm.name} onChange={(v) => setBudgetForm({...budgetForm, name: v})} placeholder="Ex: Identidade Visual - Cliente X" />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Vincular a Lead"
              value={budgetForm.leadId?.toString() || ""}
              onChange={(v) => setBudgetForm({...budgetForm, leadId: v ? parseInt(v) : ""})}
              options={[{ value: "", label: "Nenhum lead" }, ...leads.map(l => ({ value: l.id.toString(), label: `${l.name}${l.company ? ` - ${l.company}` : ''}` }))]}
            />
            <Select
              label="Vincular a Cliente"
              value={budgetForm.clientId?.toString() || ""}
              onChange={(v) => setBudgetForm({...budgetForm, clientId: v ? parseInt(v) : ""})}
              options={[{ value: "", label: "Nenhum cliente" }, ...clients.map(c => ({ value: c.id.toString(), label: c.name }))]}
            />
          </div>
          
          {/* Itens do orçamento */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-200">Horas de Trabalho</h4>
              <button onClick={addBudgetItem} className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1">
                <Plus size={14} /> Adicionar Item
              </button>
            </div>
            
            {budgetForm.items.length > 0 ? (
              <div className="space-y-2">
                {budgetForm.items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <input
                        placeholder="Tarefa"
                        value={item.task}
                        onChange={(e) => updateBudgetItem(item.id, 'task', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={item.person}
                        onChange={(e) => updateBudgetItem(item.id, 'person', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      >
                        {teamCosts.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Dias"
                        value={item.days}
                        onChange={(e) => updateBudgetItem(item.id, 'days', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="h/dia"
                        value={item.hoursPerDay}
                        onChange={(e) => updateBudgetItem(item.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-1 text-center text-cyan-400 text-sm font-medium">
                      {item.hours}h
                    </div>
                    <div className="col-span-1">
                      <button onClick={() => removeBudgetItem(item.id)} className="p-2 hover:bg-red-900/50 rounded-lg">
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Adicione itens de trabalho</p>
            )}
          </div>
          
          {/* Custos Variáveis */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-200">Custos Variáveis</h4>
              <button onClick={addVariableCost} className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1">
                <Plus size={14} /> Adicionar
              </button>
            </div>
            
            {budgetForm.variableCosts.length > 0 ? (
              <div className="space-y-2">
                {budgetForm.variableCosts.map((cost, idx) => (
                  <div key={cost.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-8">
                      <input
                        placeholder="Descrição"
                        value={cost.name}
                        onChange={(e) => setBudgetForm(prev => ({
                          ...prev,
                          variableCosts: prev.variableCosts.map((c, i) => i === idx ? { ...c, name: e.target.value } : c)
                        }))}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Valor"
                        value={cost.value}
                        onChange={(e) => setBudgetForm(prev => ({
                          ...prev,
                          variableCosts: prev.variableCosts.map((c, i) => i === idx ? { ...c, value: parseFloat(e.target.value) || 0 } : c)
                        }))}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <button onClick={() => setBudgetForm(prev => ({ ...prev, variableCosts: prev.variableCosts.filter((_, i) => i !== idx) }))} className="p-2 hover:bg-red-900/50 rounded-lg">
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">Nenhum custo variável</p>
            )}
          </div>
          
          {/* Margens */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <h4 className="font-medium text-gray-200 mb-3">Margens e Impostos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500">Comissão (%)</label>
                <input type="number" value={budgetForm.margins?.commission || 0} onChange={(e) => setBudgetForm({...budgetForm, margins: {...budgetForm.margins, commission: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Negociação (%)</label>
                <input type="number" value={budgetForm.margins?.negotiation || 0} onChange={(e) => setBudgetForm({...budgetForm, margins: {...budgetForm.margins, negotiation: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Lucro (%)</label>
                <input type="number" value={budgetForm.margins?.profit || 0} onChange={(e) => setBudgetForm({...budgetForm, margins: {...budgetForm.margins, profit: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Imposto (%)</label>
                <input type="number" value={budgetForm.margins?.tax || 0} onChange={(e) => setBudgetForm({...budgetForm, margins: {...budgetForm.margins, tax: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-300">Parcelas</label>
            <input type="number" min="1" value={budgetForm.installments} onChange={(e) => setBudgetForm({...budgetForm, installments: parseInt(e.target.value) || 1})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
          </div>
          
          {/* Preview do cálculo */}
          {budgetForm.items.length > 0 && (() => {
            const calc = calculateBudget(budgetForm);
            return (
              <div className="p-4 bg-emerald-900/20 border border-emerald-700 rounded-xl">
                <h4 className="font-medium text-emerald-400 mb-3">Resumo do Orçamento</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-400">Custo Pessoal:</p><p className="text-right text-gray-200">{formatCurrency(calc.personnelCost)}</p>
                  <p className="text-gray-400">Custo Operacional:</p><p className="text-right text-gray-200">{formatCurrency(calc.operationalCost)}</p>
                  <p className="text-gray-400">Custos Variáveis:</p><p className="text-right text-gray-200">{formatCurrency(calc.variableCostsTotal)}</p>
                  <p className="text-gray-400 font-medium border-t border-gray-700 pt-2">Custo de Produção:</p><p className="text-right text-gray-200 font-medium border-t border-gray-700 pt-2">{formatCurrency(calc.productionCost)}</p>
                  <p className="text-gray-500 text-xs">Percentual base:</p><p className="text-right text-gray-500 text-xs">{calc.correspondingPercent.toFixed(0)}%</p>
                  
                  {/* Margens detalhadas */}
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-amber-400 mb-2">Margens e Impostos:</p>
                  </div>
                  {(budgetForm.margins?.commission || 0) > 0 && (
                    <><p className="text-gray-400 pl-2">• Comissão ({budgetForm.margins.commission}%):</p><p className="text-right text-amber-400">{formatCurrency(calc.commissionValue)}</p></>
                  )}
                  {(budgetForm.margins?.negotiation || 0) > 0 && (
                    <><p className="text-gray-400 pl-2">• Negociação ({budgetForm.margins.negotiation}%):</p><p className="text-right text-amber-400">{formatCurrency(calc.negotiationValue)}</p></>
                  )}
                  {(budgetForm.margins?.profit || 0) > 0 && (
                    <><p className="text-gray-400 pl-2">• Lucro ({budgetForm.margins.profit}%):</p><p className="text-right text-lime-400">{formatCurrency(calc.profitValue)}</p></>
                  )}
                  {(budgetForm.margins?.tax || 0) > 0 && (
                    <><p className="text-gray-400 pl-2">• Imposto ({budgetForm.margins.tax}%):</p><p className="text-right text-red-400">{formatCurrency(calc.taxValue)}</p></>
                  )}
                  <p className="text-gray-400 font-medium">Total Margens:</p><p className="text-right text-amber-400 font-medium">{formatCurrency(calc.totalMarginsValue)}</p>
                  
                  {/* Valor à vista */}
                  <div className="col-span-2 border-t border-emerald-700 mt-2 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-bold">💵 À Vista:</span>
                      <span className="text-2xl font-bold text-emerald-400">{formatCurrency(calc.roundedValue)}</span>
                    </div>
                    {budgetForm.installments > 1 && (
                      <p className="text-right text-sm text-gray-400">{budgetForm.installments}x de {formatCurrency(calc.installmentValue)}</p>
                    )}
                  </div>
                  
                  {/* Opções de Parcelamento */}
                  {installmentOptions.length > 0 && (
                    <div className="col-span-2 mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-cyan-400 mb-2">💳 Opções de Parcelamento:</p>
                      <div className="space-y-2">
                        {installmentOptions.map(option => {
                          const totalWithInterest = calc.roundedValue * (1 + (option.percentage / 100));
                          const installmentValue = totalWithInterest / option.installments;
                          return (
                            <div key={option.id} className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                              <span className="text-gray-300 text-sm">{option.name} (+{option.percentage}%)</span>
                              <div className="text-right">
                                <span className="text-cyan-400 font-bold">{option.installments}x {formatCurrency(installmentValue)}</span>
                                <p className="text-xs text-gray-500">Total: {formatCurrency(totalWithInterest)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveBudget}>{editingBudget ? "Salvar" : "Criar Orçamento"}</Button>
        </div>
      </Modal>

      {/* Modal Custo Estrutura */}
      <Modal isOpen={isCostModalOpen} onClose={() => setIsCostModalOpen(false)} title={editingCost ? "Editar Custo" : "Novo Custo"}>
        <div className="space-y-4">
          <Input label="Nome" value={costForm.name} onChange={(v) => setCostForm({...costForm, name: v})} placeholder="Ex: Adobe Creative Cloud" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valor (R$)" type="number" value={costForm.value} onChange={(v) => setCostForm({...costForm, value: parseFloat(v) || 0})} />
            <Select label="Categoria" value={costForm.category} onChange={(v) => setCostForm({...costForm, category: v})} options={costCategories.map(c => ({ value: c, label: c }))} />
          </div>
          <Input label="Descrição" value={costForm.description} onChange={(v) => setCostForm({...costForm, description: v})} placeholder="Detalhes do custo" />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsCostModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveCost}>{editingCost ? "Salvar" : "Adicionar"}</Button>
        </div>
      </Modal>

      {/* Modal Pessoa */}
      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title={editingTeam ? "Editar Pessoa" : "Nova Pessoa"}>
        <div className="space-y-4">
          <Input label="Nome" value={teamForm.name} onChange={(v) => setTeamForm({...teamForm, name: v})} placeholder="Nome da pessoa" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Salário (R$)" type="number" value={teamForm.salary} onChange={(v) => setTeamForm({...teamForm, salary: parseFloat(v) || 0})} />
            <Input label="13º Mensal (R$)" type="number" value={teamForm.thirteenth} onChange={(v) => setTeamForm({...teamForm, thirteenth: parseFloat(v) || 0})} />
            <Input label="Encargos (R$)" type="number" value={teamForm.charges} onChange={(v) => setTeamForm({...teamForm, charges: parseFloat(v) || 0})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Horas por dia" type="number" value={teamForm.hoursPerDay} onChange={(v) => setTeamForm({...teamForm, hoursPerDay: parseFloat(v) || 0})} />
            <Input label="Dias por mês" type="number" value={teamForm.daysPerMonth} onChange={(v) => setTeamForm({...teamForm, daysPerMonth: parseFloat(v) || 0})} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsTeamModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveTeam}>{editingTeam ? "Salvar" : "Adicionar"}</Button>
        </div>
      </Modal>

      {/* Modal Novo/Editar Template */}
      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title={editingTemplate ? "Editar Modelo" : "Novo Modelo"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Nome do Modelo" value={templateForm.name} onChange={(v) => setTemplateForm({...templateForm, name: v})} placeholder="Ex: Identidade Visual Completa" />
          <Input label="Descrição" value={templateForm.description} onChange={(v) => setTemplateForm({...templateForm, description: v})} placeholder="Descrição breve do modelo" />
          
          {/* Itens do template */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-200">Itens de Trabalho Padrão</h4>
              <button onClick={addTemplateItem} className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1">
                <Plus size={14} /> Adicionar Item
              </button>
            </div>
            
            {templateForm.items.length > 0 ? (
              <div className="space-y-2">
                {templateForm.items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <input
                        placeholder="Tarefa"
                        value={item.task}
                        onChange={(e) => updateTemplateItem(item.id, 'task', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={item.person}
                        onChange={(e) => updateTemplateItem(item.id, 'person', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      >
                        {teamCosts.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Dias"
                        value={item.days}
                        onChange={(e) => updateTemplateItem(item.id, 'days', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="h/dia"
                        value={item.hoursPerDay}
                        onChange={(e) => updateTemplateItem(item.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-1 text-center text-cyan-400 text-sm font-medium">
                      {item.hours}h
                    </div>
                    <div className="col-span-1">
                      <button onClick={() => removeTemplateItem(item.id)} className="p-2 hover:bg-red-900/50 rounded-lg">
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Adicione itens de trabalho padrão</p>
            )}
          </div>
          
          {/* Custos Variáveis do Template */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-200">Custos Variáveis Padrão</h4>
              <button onClick={addTemplateVariableCost} className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1">
                <Plus size={14} /> Adicionar
              </button>
            </div>
            
            {templateForm.variableCosts.length > 0 ? (
              <div className="space-y-2">
                {templateForm.variableCosts.map((cost, idx) => (
                  <div key={cost.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-8">
                      <input
                        placeholder="Descrição"
                        value={cost.name}
                        onChange={(e) => setTemplateForm(prev => ({
                          ...prev,
                          variableCosts: prev.variableCosts.map((c, i) => i === idx ? { ...c, name: e.target.value } : c)
                        }))}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Valor"
                        value={cost.value}
                        onChange={(e) => setTemplateForm(prev => ({
                          ...prev,
                          variableCosts: prev.variableCosts.map((c, i) => i === idx ? { ...c, value: parseFloat(e.target.value) || 0 } : c)
                        }))}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <button onClick={() => setTemplateForm(prev => ({ ...prev, variableCosts: prev.variableCosts.filter((_, i) => i !== idx) }))} className="p-2 hover:bg-red-900/50 rounded-lg">
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">Nenhum custo variável padrão</p>
            )}
          </div>
          
          {/* Margens do Template */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <h4 className="font-medium text-gray-200 mb-3">Margens Padrão do Modelo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500">Comissão (%)</label>
                <input type="number" value={templateForm.margins?.commission || 0} onChange={(e) => setTemplateForm({...templateForm, margins: {...templateForm.margins, commission: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Negociação (%)</label>
                <input type="number" value={templateForm.margins?.negotiation || 0} onChange={(e) => setTemplateForm({...templateForm, margins: {...templateForm.margins, negotiation: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Lucro (%)</label>
                <input type="number" value={templateForm.margins?.profit || 0} onChange={(e) => setTemplateForm({...templateForm, margins: {...templateForm.margins, profit: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Imposto (%)</label>
                <input type="number" value={templateForm.margins?.tax || 0} onChange={(e) => setTemplateForm({...templateForm, margins: {...templateForm.margins, tax: parseFloat(e.target.value) || 0}})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-300">Parcelas Padrão</label>
            <input type="number" min="1" value={templateForm.installments} onChange={(e) => setTemplateForm({...templateForm, installments: parseInt(e.target.value) || 1})} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsTemplateModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveTemplate}>{editingTemplate ? "Salvar" : "Criar Modelo"}</Button>
        </div>
      </Modal>

      {/* Modal Selecionar Template */}
      <Modal isOpen={isSelectTemplateOpen} onClose={() => setIsSelectTemplateOpen(false)} title="Escolher Modelo">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {budgetTemplates.map(template => {
            const totalHours = template.items.reduce((acc, item) => acc + (item.hours || 0), 0);
            return (
              <button
                key={template.id}
                onClick={() => handleUseTemplate(template)}
                className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-lime-600 rounded-xl text-left transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-100">{template.name}</h3>
                    {template.description && <p className="text-xs text-gray-500 mt-1">{template.description}</p>}
                  </div>
                  <span className="text-cyan-400 font-medium">{totalHours}h</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>{template.items.length} itens</span>
                  <span>Margens: {(template.margins?.commission || 0) + (template.margins?.negotiation || 0) + (template.margins?.profit || 0) + (template.margins?.tax || 0)}%</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsSelectTemplateOpen(false)}>Cancelar</Button>
        </div>
      </Modal>

      {/* Modal Editor de Proposta */}
      <Modal isOpen={isProposalModalOpen} onClose={() => { setIsProposalModalOpen(false); setSelectedBudgetForProposal(null); }} title={`📄 Proposta #${proposalForm.code}`}>
        {selectedBudgetForProposal && (() => {
          const calc = calculateBudget(selectedBudgetForProposal);
          
          return (
            <div className="space-y-4">
              {/* Abas */}
              <div className="flex gap-1 p-1 bg-gray-800 rounded-xl">
                {[
                  { id: 'dados', label: 'Dados', icon: FileText },
                  { id: 'desafio', label: 'Desafio', icon: Target },
                  { id: 'metodo', label: 'Método', icon: Layers },
                  { id: 'entregaveis', label: 'Entregáveis', icon: Package },
                  { id: 'preview', label: 'Preview', icon: Eye }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setProposalTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      proposalTab === tab.id ? 'bg-lime-600 text-gray-900' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <tab.icon size={14} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto space-y-4">
                {/* Aba Dados */}
                {proposalTab === 'dados' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Código</label>
                        <p className="text-lg font-bold text-violet-400">#{proposalForm.code}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Data</label>
                        <input 
                          type="date" 
                          value={proposalForm.date} 
                          onChange={(e) => setProposalForm({...proposalForm, date: e.target.value})}
                          className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Título do Serviço</label>
                      <input 
                        type="text"
                        value={proposalForm.serviceName}
                        onChange={(e) => setProposalForm({...proposalForm, serviceName: e.target.value})}
                        placeholder="Ex: Proposta Rebranding"
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Nome do Cliente</label>
                      <input 
                        type="text"
                        value={proposalForm.clientName}
                        onChange={(e) => setProposalForm({...proposalForm, clientName: e.target.value})}
                        placeholder="Ex: Quintal 1385"
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Tagline (frase de impacto)</label>
                      <input 
                        type="text"
                        value={proposalForm.tagline}
                        onChange={(e) => setProposalForm({...proposalForm, tagline: e.target.value})}
                        placeholder="Ex: Marca tão autêntica quanto quem frequenta!"
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Subtítulo</label>
                      <input 
                        type="text"
                        value={proposalForm.subtitle}
                        onChange={(e) => setProposalForm({...proposalForm, subtitle: e.target.value})}
                        placeholder="Ex: Identidade pra quem ousou misturar bar com arte"
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Prazo Estimado (semanas)</label>
                        <input 
                          type="number"
                          value={proposalForm.estimatedWeeks}
                          onChange={(e) => setProposalForm({...proposalForm, estimatedWeeks: parseInt(e.target.value) || 0})}
                          className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Validade (dias úteis)</label>
                        <input 
                          type="number"
                          value={proposalForm.validityDays}
                          onChange={(e) => setProposalForm({...proposalForm, validityDays: parseInt(e.target.value) || 0})}
                          className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                        />
                      </div>
                    </div>
                    
                    {/* Parcelamento Direto */}
                    <div className="p-3 bg-gray-800/50 rounded-xl">
                      <label className="text-sm text-gray-400 mb-2 block">Parcelamento Direto (%)</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500">Início</label>
                          <input 
                            type="number"
                            value={proposalForm.directPayment?.start || 0}
                            onChange={(e) => setProposalForm({...proposalForm, directPayment: {...proposalForm.directPayment, start: parseInt(e.target.value) || 0}})}
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Aprovação</label>
                          <input 
                            type="number"
                            value={proposalForm.directPayment?.approval || 0}
                            onChange={(e) => setProposalForm({...proposalForm, directPayment: {...proposalForm.directPayment, approval: parseInt(e.target.value) || 0}})}
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Entrega</label>
                          <input 
                            type="number"
                            value={proposalForm.directPayment?.delivery || 0}
                            onChange={(e) => setProposalForm({...proposalForm, directPayment: {...proposalForm.directPayment, delivery: parseInt(e.target.value) || 0}})}
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Aba Desafio */}
                {proposalTab === 'desafio' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Cenário</label>
                      <textarea 
                        value={proposalForm.challenge?.scenario || ""}
                        onChange={(e) => setProposalForm({...proposalForm, challenge: {...proposalForm.challenge, scenario: e.target.value}})}
                        placeholder="Descreva o contexto do cliente..."
                        rows={3}
                        className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">A Dor</label>
                      <textarea 
                        value={proposalForm.challenge?.pain || ""}
                        onChange={(e) => setProposalForm({...proposalForm, challenge: {...proposalForm.challenge, pain: e.target.value}})}
                        placeholder="Qual problema o cliente enfrenta..."
                        rows={3}
                        className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Objetivo</label>
                      <textarea 
                        value={proposalForm.challenge?.objective || ""}
                        onChange={(e) => setProposalForm({...proposalForm, challenge: {...proposalForm.challenge, objective: e.target.value}})}
                        placeholder="O que será alcançado com o projeto..."
                        rows={3}
                        className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 resize-none"
                      />
                    </div>
                  </div>
                )}
                
                {/* Aba Método */}
                {proposalTab === 'metodo' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Edite as etapas do seu método de trabalho:</p>
                    {proposalForm.method?.map((step, idx) => (
                      <div key={idx} className="p-3 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center text-sm font-bold text-gray-900">
                            {step.step}
                          </span>
                          <input 
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const newMethod = [...proposalForm.method];
                              newMethod[idx] = {...step, title: e.target.value};
                              setProposalForm({...proposalForm, method: newMethod});
                            }}
                            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 font-medium"
                          />
                        </div>
                        <textarea 
                          value={step.description}
                          onChange={(e) => {
                            const newMethod = [...proposalForm.method];
                            newMethod[idx] = {...step, description: e.target.value};
                            setProposalForm({...proposalForm, method: newMethod});
                          }}
                          rows={2}
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm resize-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Aba Entregáveis */}
                {proposalTab === 'entregaveis' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                      <label className="text-sm text-gray-400">Modo de exibição:</label>
                      <button
                        onClick={() => setProposalForm({...proposalForm, deliveryMode: 'packages'})}
                        className={`px-3 py-1.5 rounded-lg text-sm ${proposalForm.deliveryMode === 'packages' ? 'bg-lime-600 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
                      >
                        Pacotes
                      </button>
                      <button
                        onClick={() => setProposalForm({...proposalForm, deliveryMode: 'list'})}
                        className={`px-3 py-1.5 rounded-lg text-sm ${proposalForm.deliveryMode === 'list' ? 'bg-lime-600 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
                      >
                        Lista Única
                      </button>
                    </div>
                    
                    {proposalForm.deliveryMode === 'packages' ? (
                      <div className="space-y-3">
                        {proposalForm.packages?.map((pkg) => (
                          <div key={pkg.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                              <input 
                                type="text"
                                value={pkg.name}
                                onChange={(e) => updateProposalPackage(pkg.id, 'name', e.target.value)}
                                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 font-medium"
                                placeholder="Nome do pacote"
                              />
                              <input 
                                type="number"
                                value={pkg.value}
                                onChange={(e) => updateProposalPackage(pkg.id, 'value', parseFloat(e.target.value) || 0)}
                                className="w-28 p-2 bg-gray-800 border border-gray-700 rounded-lg text-lime-400 font-bold text-right"
                                placeholder="Valor"
                              />
                              <button onClick={() => removeProposalPackage(pkg.id)} className="p-2 hover:bg-red-900/50 rounded-lg">
                                <Trash2 size={14} className="text-red-500" />
                              </button>
                            </div>
                            
                            <div className="space-y-1 ml-2">
                              {pkg.items?.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-center gap-2">
                                  <span className="text-gray-600">•</span>
                                  <input 
                                    type="text"
                                    value={item}
                                    onChange={(e) => updatePackageItem(pkg.id, itemIdx, e.target.value)}
                                    className="flex-1 p-1.5 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm"
                                    placeholder="Item do pacote"
                                  />
                                  <button onClick={() => removePackageItem(pkg.id, itemIdx)} className="p-1 hover:bg-red-900/50 rounded">
                                    <X size={12} className="text-red-500" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => addItemToPackage(pkg.id)}
                                className="text-xs text-lime-400 hover:text-lime-300 mt-1"
                              >
                                + Adicionar item
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button 
                          onClick={addProposalPackage}
                          className="w-full p-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-lime-400 hover:border-lime-600 transition-colors"
                        >
                          + Adicionar Pacote
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Lista de entregáveis:</p>
                        {proposalForm.listItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-gray-600">•</span>
                            <input 
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...proposalForm.listItems];
                                newItems[idx] = e.target.value;
                                setProposalForm({...proposalForm, listItems: newItems});
                              }}
                              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                            />
                            <button 
                              onClick={() => setProposalForm({...proposalForm, listItems: proposalForm.listItems.filter((_, i) => i !== idx)})}
                              className="p-1.5 hover:bg-red-900/50 rounded"
                            >
                              <X size={14} className="text-red-500" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => setProposalForm({...proposalForm, listItems: [...(proposalForm.listItems || []), ""]})}
                          className="text-sm text-lime-400 hover:text-lime-300"
                        >
                          + Adicionar item
                        </button>
                      </div>
                    )}
                    
                    {/* Resumo de valores */}
                    <div className="p-3 bg-emerald-900/20 border border-emerald-700 rounded-xl">
                      <p className="text-xs text-gray-500 mb-2">Valores do orçamento (automático):</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-bold text-emerald-400">{formatCurrency(calc.roundedValue)}</p>
                          <p className="text-xs text-gray-500">À Vista</p>
                        </div>
                        {installmentOptions.slice(0, 2).map(opt => {
                          const total = calc.roundedValue * (1 + opt.percentage / 100);
                          const parcela = total / opt.installments;
                          return (
                            <div key={opt.id}>
                              <p className="text-lg font-bold text-cyan-400">{opt.installments}x {formatCurrency(parcela)}</p>
                              <p className="text-xs text-gray-500">{opt.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Aba Preview */}
                {proposalTab === 'preview' && (
                  <div className="space-y-4">
                    {/* Controles do Preview */}
                    <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                      <span className="text-xs text-gray-400">Preview da proposta (A4)</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const el = document.getElementById('proposal-pdf');
                            if (el) {
                              const current = el.style.transform || 'scale(0.6)';
                              if (current.includes('0.6')) {
                                el.style.transform = 'scale(0.45)';
                              } else if (current.includes('0.45')) {
                                el.style.transform = 'scale(0.8)';
                              } else {
                                el.style.transform = 'scale(0.6)';
                              }
                            }
                          }}
                          className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                        >
                          🔍 Zoom
                        </button>
                      </div>
                    </div>
                    
                    {/* Container do PDF - Proporção A4 exata */}
                    <div className="overflow-auto max-h-[70vh] bg-gray-700 rounded-xl p-6 flex justify-center">
                      {/* Importar fonte Archivo */}
                      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');`}</style>
                      <div 
                        id="proposal-pdf"
                        style={{ 
                          width: '794px',
                          height: '1123px',
                          maxHeight: '1123px',
                          minHeight: '1123px',
                          backgroundColor: '#f5f0eb',
                          fontFamily: "'Archivo', 'Segoe UI', -apple-system, sans-serif",
                          color: '#1a1a1a',
                          transform: 'scale(0.6)',
                          transformOrigin: 'top center',
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                          overflow: 'hidden',
                          padding: '40px 50px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          flexShrink: 0
                        }}
                      >
                        {/* ===== HEADER - FUNDO BEGE ===== */}
                        <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h1 style={{ 
                                fontSize: '32px', 
                                fontWeight: '800', 
                                color: '#1a1a1a', 
                                margin: 0,
                                fontFamily: "'Archivo', sans-serif"
                              }}>
                                {proposalForm.serviceName || 'Proposta Comercial'}
                              </h1>
                              <p style={{ 
                                fontSize: '18px', 
                                color: '#888', 
                                marginTop: '6px',
                                fontWeight: '400',
                                fontFamily: "'Archivo', sans-serif"
                              }}>
                                {proposalForm.clientName}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {/* Logo SVG Hypefoco */}
                              <svg width="120" height="26" viewBox="0 0 544.15 115.52" style={{ marginBottom: '8px' }}>
                                <g fill="#1a1a1a">
                                  <path d="M164.28,35.08l-18.82,53.77c-2.02,5.75-3.98,10.44-5.88,14.06-1.9,3.62-4.59,6.63-8.07,9.02-3.47,2.39-7.94,3.59-13.39,3.59-3.66,0-7.73-.6-12.21-1.79l-.11-11.99c3.96,1.27,7.65,1.9,11.09,1.9,3.73,0,6.59-.93,8.57-2.8,1.98-1.87,3.79-5.12,5.43-9.75h-8.07l-14.23-44.14h-9.97v-11.88h20.17l14.34,44.92h1.57l15.57-44.92h14Z"/>
                                  <path d="M218.3,41.97c4.26,5.19,6.39,12.01,6.39,20.45,0,6.05-1.06,11.31-3.19,15.8-2.13,4.48-5.06,7.9-8.79,10.25-3.74,2.35-7.99,3.53-12.77,3.53-8.29,0-13.71-3.62-16.24-10.87h-.67l2.13,11.88v21.62h-13.22V35.08h7.95l3.92,9.41h.56c.97-3.43,2.84-6.01,5.6-7.73,2.76-1.72,6.39-2.58,10.87-2.58,7.39,0,13.22,2.6,17.48,7.79ZM207.82,75.47c2.43-3.1,3.64-7.41,3.64-12.94,0-5.08-1.25-9.09-3.75-12.04-2.5-2.95-6.03-4.43-10.59-4.43-5.45,0-9.45,2.32-11.99,6.95v19.49c1.42,2.76,3.21,4.72,5.38,5.88,2.17,1.16,4.67,1.74,7.51,1.74,4.11,0,7.37-1.55,9.8-4.65Z"/>
                                  <path d="M40.67,94.87l-11.38-3.77v-25.65c-9.12,7.01-19.35,12.59-29.29,12.59v-12.63c9.08,0,20.13-8.14,29.29-16.48v-16.81C29.29,7.05,42.24,1.63,46.21.57c7.16-1.92,14.46,1.12,18.17,7.55,2.03,3.51,7.32,16.29-9.67,33.28-.94.94-2.1,2.15-3.45,3.55-2.63,2.74-5.79,6.03-9.35,9.47v17.62l22.24-29.88c4.01-5.52,10.98-7.56,17.34-5.07,6.24,2.44,9.96,8.47,9.35,15.1l.07,38.9-12.63.02-.07-39.23.04-.76c.16-1.37-.65-1.99-1.36-2.27-.71-.28-1.73-.37-2.54.75l-.05.07-33.65,45.2ZM50.45,12.63c-.32,0-.65.04-.98.13-3.76,1.01-7.56,7.39-7.56,19.37v4.32c.08-.08.16-.16.24-.24,1.39-1.45,2.59-2.7,3.63-3.74,7.92-7.92,9.55-14.76,7.66-18.03-.67-1.16-1.77-1.8-2.99-1.8Z"/>
                                  <path d="M290.32,68.13h-43.13c.75,4.18,2.61,7.23,5.6,9.13,2.99,1.9,7.39,2.86,13.22,2.86,7.54,0,14.45-.97,20.73-2.91v11.76c-6.57,2.02-13.56,3.03-20.95,3.03-10.98,0-19.1-2.59-24.37-7.79-5.27-5.19-7.9-12.23-7.9-21.12,0-9.41,2.74-16.58,8.23-21.51,5.49-4.93,12.71-7.39,21.68-7.39,8.44,0,15.03,2.26,19.77,6.78,4.74,4.52,7.11,11.26,7.11,20.22v6.95ZM277.55,58.38c0-8.21-4.71-12.32-14.12-12.32-4.56,0-8.23.92-11.03,2.74-2.8,1.83-4.58,5.02-5.32,9.58h30.47Z"/>
                                  <path d="M359.22,46.95h-31.14c8.59,4.48,14.77,10.46,18.54,17.92,3.77,7.47,5.66,15.09,5.66,22.85s-1.81,14.24-5.43,18.77c-3.62,4.52-8.83,6.78-15.63,6.78-6.13,0-10.79-2.5-14-7.51-3.21-5-4.82-13.41-4.82-25.21,0-9.48.45-19.64,1.34-30.47-4.63-1.64-9.71-2.69-15.24-3.14v-11.88h16.8c1.27-11.58,2.84-22.59,4.71-33.05,4.71.37,7.95,1.4,9.75,3.08,1.79,1.68,2.69,3.86,2.69,6.55,0,4.11-1.98,11.8-5.94,23.08v.34h32.71v11.88ZM336.42,70.81c-2.13-5.53-5.66-10.27-10.59-14.23-.15,5.83-.22,13.82-.22,23.97,0,5.45.2,9.67.62,12.66.41,2.99,1.05,5.1,1.9,6.33.86,1.23,2.03,1.85,3.53,1.85,5.3,0,7.95-4.56,7.95-13.67,0-5.75-1.06-11.39-3.19-16.92Z"/>
                                  <path d="M379.14,88.35c-4.3-2.43-7.6-5.82-9.91-10.19-2.32-4.37-3.47-9.39-3.47-15.07s1.16-10.7,3.47-15.07c2.31-4.37,5.62-7.77,9.91-10.19,4.29-2.43,9.28-3.64,14.96-3.64s10.66,1.21,14.96,3.64c4.29,2.43,7.62,5.82,9.97,10.19,2.35,4.37,3.53,9.39,3.53,15.07s-1.18,10.7-3.53,15.07c-2.35,4.37-5.68,7.77-9.97,10.19-4.3,2.43-9.28,3.64-14.96,3.64s-10.66-1.21-14.96-3.64ZM405.58,75.46c2.5-3.1,3.75-7.23,3.75-12.38s-1.25-9.28-3.75-12.38c-2.5-3.1-6.33-4.65-11.48-4.65s-8.96,1.55-11.43,4.65c-2.46,3.1-3.7,7.23-3.7,12.38s1.23,9.28,3.7,12.38c2.46,3.1,6.27,4.65,11.43,4.65s8.98-1.55,11.48-4.65Z"/>
                                  <path d="M432.72,47.62c2.69-4.33,6.44-7.65,11.26-9.97,4.82-2.31,10.32-3.47,16.52-3.47,4.63,0,8.59.47,11.88,1.4,3.29.93,5.86,1.96,7.73,3.08v13.56c-5.68-4.11-12.17-6.16-19.49-6.16-5.53,0-10.03,1.38-13.5,4.14-3.47,2.76-5.21,7.06-5.21,12.88s1.72,9.84,5.15,12.71c3.43,2.88,8.22,4.31,14.34,4.31,4.33,0,8.4-.73,12.21-2.18,3.81-1.46,6.95-3.19,9.41-5.21v13.11c-1.79,1.42-4.65,2.8-8.57,4.14-3.92,1.34-8.42,2.02-13.5,2.02-7.1,0-13.05-1.29-17.87-3.86-4.82-2.58-8.42-6.05-10.81-10.42-2.39-4.37-3.59-9.24-3.59-14.62,0-5.97,1.34-11.13,4.03-15.46Z"/>
                                  <path d="M500.74,88.35c-4.3-2.43-7.6-5.82-9.91-10.19-2.32-4.37-3.47-9.39-3.47-15.07s1.16-10.7,3.47-15.07c2.31-4.37,5.62-7.77,9.91-10.19,4.29-2.43,9.28-3.64,14.96-3.64s10.66,1.21,14.96,3.64c4.29,2.43,7.62,5.82,9.97,10.19,2.35,4.37,3.53,9.39,3.53,15.07s-1.18,10.7-3.53,15.07c-2.35,4.37-5.68,7.77-9.97,10.19-4.3,2.43-9.28,3.64-14.96,3.64s-10.66-1.21-14.96-3.64ZM527.17,75.46c2.5-3.1,3.75-7.23,3.75-12.38s-1.25-9.28-3.75-12.38c-2.5-3.1-6.33-4.65-11.48-4.65s-8.96,1.55-11.43,4.65c-2.46,3.1-3.7,7.23-3.7,12.38s1.23,9.28,3.7,12.38c2.46,3.1,6.27,4.65,11.43,4.65s8.98-1.55,11.48-4.65Z"/>
                                </g>
                              </svg>
                              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {formatDateExtended(proposalForm.date)}
                              </p>
                              <p style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>
                                #{proposalForm.code}
                              </p>
                            </div>
                          </div>
                          
                          {/* Tagline */}
                          {proposalForm.tagline && (
                            <p style={{ 
                              fontSize: '16px', 
                              fontStyle: 'italic', 
                              color: '#555',
                              marginTop: '16px',
                              fontWeight: '500',
                              fontFamily: "'Archivo', sans-serif"
                            }}>
                              {proposalForm.tagline}
                            </p>
                          )}
                        </div>
                        
                        {/* ===== O DESAFIO + MÉTODO HYPE ===== */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', flex: '0 0 auto' }}>
                          {/* O Desafio - Caixa Branca */}
                          <div style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '12px', 
                            padding: '20px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            <h2 style={{ 
                              fontSize: '20px', 
                              fontWeight: '400', 
                              color: '#1a1a1a',
                              textAlign: 'center',
                              marginBottom: '12px',
                              paddingBottom: '12px',
                              borderBottom: '1px solid #ccc',
                              fontFamily: "'Archivo', sans-serif"
                            }}>
                              O Desafio
                            </h2>
                            
                            {proposalForm.challenge?.scenario && (
                              <div style={{ marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '11px', fontWeight: '400', color: '#1a1a1a', marginBottom: '3px', fontFamily: "'Archivo', sans-serif" }}>CENÁRIO</h3>
                                <p style={{ fontSize: '11px', lineHeight: '1.5', color: '#888', fontFamily: "'Archivo', sans-serif" }}>{proposalForm.challenge.scenario}</p>
                              </div>
                            )}
                            
                            {proposalForm.challenge?.pain && (
                              <div style={{ marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '11px', fontWeight: '400', color: '#1a1a1a', marginBottom: '3px', fontFamily: "'Archivo', sans-serif" }}>A DOR</h3>
                                <p style={{ fontSize: '11px', lineHeight: '1.5', color: '#888', fontFamily: "'Archivo', sans-serif" }}>{proposalForm.challenge.pain}</p>
                              </div>
                            )}
                            
                            {proposalForm.challenge?.objective && (
                              <div>
                                <h3 style={{ fontSize: '11px', fontWeight: '400', color: '#1a1a1a', marginBottom: '3px', fontFamily: "'Archivo', sans-serif" }}>OBJETIVO</h3>
                                <p style={{ fontSize: '11px', lineHeight: '1.5', color: '#888', fontFamily: "'Archivo', sans-serif" }}>{proposalForm.challenge.objective}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Método Hype - Caixa Preta */}
                          <div style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderRadius: '12px', 
                            padding: '20px 28px',
                            color: 'white'
                          }}>
                            <h2 style={{ 
                              fontSize: '20px', 
                              fontWeight: '400', 
                              color: 'white',
                              textAlign: 'center',
                              marginBottom: '12px',
                              paddingBottom: '12px',
                              borderBottom: '1px solid #c8ff00',
                              fontFamily: "'Archivo', sans-serif"
                            }}>
                              Método Hype
                            </h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {proposalForm.method?.map(step => (
                                <div key={step.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                  <span style={{ 
                                    fontSize: '28px', 
                                    fontWeight: '700', 
                                    color: '#c8ff00',
                                    lineHeight: '1',
                                    minWidth: '36px',
                                    fontFamily: "'Archivo', sans-serif"
                                  }}>
                                    {step.step}
                                  </span>
                                  <div>
                                    <p style={{ fontSize: '11px', fontWeight: '400', color: 'white', marginBottom: '2px', fontFamily: "'Archivo', sans-serif" }}>{step.title}</p>
                                    <p style={{ fontSize: '10px', color: '#888', lineHeight: '1.4', fontFamily: "'Archivo', sans-serif" }}>{step.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* ===== O QUE SERÁ REALIZADO - Caixa Branca ===== */}
                        <div style={{ 
                          backgroundColor: 'white', 
                          borderRadius: '12px', 
                          padding: '16px 20px',
                          marginBottom: '12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          flex: '0 0 auto'
                        }}>
                          <h2 style={{ 
                            fontSize: '18px', 
                            fontWeight: '400', 
                            color: '#1a1a1a',
                            textAlign: 'center',
                            marginBottom: '12px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid #ccc',
                            fontFamily: "'Archivo', sans-serif"
                          }}>
                            O que será realizado e entregue
                          </h2>
                          
                          {proposalForm.deliveryMode === 'packages' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(proposalForm.packages?.length || 1, 3)}, 1fr)`, gap: '10px' }}>
                              {proposalForm.packages?.map(pkg => (
                                <div key={pkg.id} style={{ 
                                  border: '2px solid #c8ff00', 
                                  borderRadius: '10px', 
                                  padding: '12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center'
                                }}>
                                  <h3 style={{ fontSize: '12px', fontWeight: '700', textAlign: 'center', marginBottom: '8px', color: '#1a1a1a', fontFamily: "'Archivo', sans-serif" }}>
                                    {pkg.name}
                                  </h3>
                                  <div style={{ flex: 1, textAlign: 'center' }}>
                                    {pkg.items?.map((item, i) => (
                                      <p key={i} style={{ fontSize: '10px', color: '#555', marginBottom: '3px', fontFamily: "'Archivo', sans-serif" }}>
                                        {item}
                                      </p>
                                    ))}
                                  </div>
                                  <p style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '700', 
                                    textAlign: 'center', 
                                    color: '#1a1a1a',
                                    borderTop: '1px solid #eee',
                                    paddingTop: '8px',
                                    marginTop: '8px',
                                    width: '100%'
                                  }}>
                                    R$ {formatCurrencyClean(pkg.value)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center' }}>
                              {proposalForm.listItems?.map((item, i) => (
                                <p key={i} style={{ fontSize: '12px', color: '#555', marginBottom: '4px', fontFamily: "'Archivo', sans-serif" }}>{item}</p>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* ===== INVESTIMENTO - Caixa Preta ===== */}
                        <div style={{ 
                          backgroundColor: '#1a1a1a', 
                          borderRadius: '12px', 
                          padding: '20px 28px',
                          color: 'white',
                          marginBottom: '16px',
                          flex: '0 0 auto'
                        }}>
                          <h2 style={{ 
                            fontSize: '20px', 
                            fontWeight: '400', 
                            textAlign: 'center',
                            marginBottom: '14px',
                            paddingBottom: '14px',
                            borderBottom: '1px solid #555',
                            color: 'white',
                            fontFamily: "'Archivo', sans-serif"
                          }}>
                            Investimento
                          </h2>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                            {/* PIX / À Vista */}
                            <div>
                              <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>PIX / À VISTA</p>
                              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c8ff00', margin: '4px 0' }}>
                                R$ {formatCurrencyClean(calc.roundedValue)}
                              </p>
                              <p style={{ fontSize: '10px', color: '#c8ff00' }}>Melhor valor</p>
                            </div>
                            
                            {/* Opções de Parcelamento */}
                            {installmentOptions.slice(0, 2).map(opt => {
                              const total = calc.roundedValue * (1 + opt.percentage / 100);
                              const parcela = total / opt.installments;
                              return (
                                <div key={opt.id}>
                                  <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {opt.name.toUpperCase()}
                                  </p>
                                  <p style={{ fontSize: '18px', fontWeight: '700', margin: '4px 0' }}>
                                    <span style={{ color: '#c8ff00' }}>{opt.installments}x</span>
                                    <span style={{ color: 'white' }}> R$ {formatCurrencyClean(parcela)}</span>
                                  </p>
                                  <p style={{ fontSize: '9px', color: '#666' }}>
                                    Total: R$ {formatCurrencyClean(total)} (+{opt.percentage}%)
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Parcelamento Direto */}
                          {proposalForm.directPayment && (
                            <p style={{ 
                              textAlign: 'center', 
                              fontSize: '8px', 
                              color: '#888', 
                              marginTop: '10px',
                              paddingTop: '8px',
                              borderTop: '1px solid #333'
                            }}>
                              PARCELAMENTO DIRETO: <span style={{ color: '#c8ff00', fontWeight: '600' }}>{proposalForm.directPayment.start}%</span> início • <span style={{ color: '#c8ff00', fontWeight: '600' }}>{proposalForm.directPayment.approval}%</span> aprovação • <span style={{ color: '#c8ff00', fontWeight: '600' }}>{proposalForm.directPayment.delivery}%</span> entrega (sobre valor à vista)
                            </p>
                          )}
                        </div>
                        
                        {/* ===== RODAPÉ ===== */}
                        <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                          <p style={{ fontSize: '10px', color: '#666' }}>
                            Prazo estimado: <span style={{ color: '#1a1a1a', fontWeight: '600' }}>{proposalForm.estimatedWeeks} semanas</span> • Proposta válida por <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{proposalForm.validityDays} dias úteis</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-700">
                <Button variant="secondary" onClick={() => { setIsProposalModalOpen(false); setSelectedBudgetForProposal(null); }}>Cancelar</Button>
                <div className="flex gap-2">
                  {proposalTab === 'preview' && (
                    <Button 
                      variant="secondary"
                      icon={Download}
                      onClick={async () => {
                        const element = document.getElementById('proposal-pdf');
                        if (!element) return;
                        
                        // Mostrar loading
                        const btn = document.activeElement;
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<span class="animate-spin">⏳</span> Gerando...';
                        btn.disabled = true;
                        
                        try {
                          // Carregar html2canvas se não existir
                          if (!window.html2canvas) {
                            await new Promise((resolve, reject) => {
                              const script = document.createElement('script');
                              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                              script.onload = resolve;
                              script.onerror = reject;
                              document.head.appendChild(script);
                            });
                          }
                          
                          // Carregar jsPDF se não existir
                          if (!window.jspdf) {
                            await new Promise((resolve, reject) => {
                              const script = document.createElement('script');
                              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                              script.onload = resolve;
                              script.onerror = reject;
                              document.head.appendChild(script);
                            });
                          }
                          
                          // Salvar e resetar transform para captura correta
                          const originalTransform = element.style.transform;
                          element.style.transform = 'none';
                          
                          // Forçar tamanho exato A4 para captura
                          const originalWidth = element.style.width;
                          const originalHeight = element.style.height;
                          element.style.width = '794px';
                          element.style.height = '1123px';
                          
                          // Criar canvas com alta qualidade
                          const canvas = await window.html2canvas(element, {
                            scale: 2,
                            useCORS: true,
                            logging: false,
                            backgroundColor: '#f5f0eb',
                            windowWidth: 794,
                            windowHeight: 1123
                          });
                          
                          // Restaurar estilos
                          element.style.transform = originalTransform;
                          element.style.width = originalWidth;
                          element.style.height = originalHeight;
                          
                          // Criar PDF A4 - 1 página única
                          const { jsPDF } = window.jspdf;
                          const pdf = new jsPDF({
                            orientation: 'portrait',
                            unit: 'mm',
                            format: 'a4'
                          });
                          
                          const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
                          const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
                          
                          // Calcular proporção para ocupar página inteira
                          const imgWidth = canvas.width;
                          const imgHeight = canvas.height;
                          const ratio = Math.min(pdfWidth / (imgWidth / 2), pdfHeight / (imgHeight / 2));
                          const finalWidth = (imgWidth / 2) * ratio;
                          const finalHeight = (imgHeight / 2) * ratio;
                          const xOffset = (pdfWidth - finalWidth) / 2;
                          const yOffset = (pdfHeight - finalHeight) / 2;
                          
                          // Adicionar imagem centralizada
                          const imgData = canvas.toDataURL('image/png', 1.0);
                          pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
                          
                          // Gerar nome do arquivo
                          const fileName = `Proposta_${proposalForm.code}_${(proposalForm.clientName || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                          pdf.save(fileName);
                          
                        } catch (error) {
                          console.error('Erro ao gerar PDF:', error);
                          alert('Erro ao gerar PDF. Tente novamente.');
                        } finally {
                          btn.innerHTML = originalText;
                          btn.disabled = false;
                        }
                      }}
                    >
                      Exportar PDF
                    </Button>
                  )}
                  <Button onClick={handleSaveProposal}>Salvar Proposta</Button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// Data Backup View
const DataView = ({ data, updateData }) => {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  // Exportar para JSON (backup completo)
  const exportToJSON = () => {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      leads: data.leads,
      clients: data.clients,
      lostLeads: data.lostLeads,
      trafficInvestment: data.trafficInvestment,
      activities: data.activities || [],
      projects: data.projects || { columns: [], cards: [] },
      financial: data.financial || {}
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypefoco-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setImportStatus({ type: 'success', message: 'Backup exportado com sucesso!' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Exportar para CSV (abre no Excel)
  const exportToCSV = () => {
    // Função para converter array para CSV
    const arrayToCSV = (arr, headers) => {
      if (arr.length === 0) return headers.join(';') + '\n';
      const rows = arr.map(obj => headers.map(h => {
        let val = obj[h.key] || '';
        if (typeof val === 'string' && (val.includes(';') || val.includes('\n'))) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(';'));
      return headers.map(h => h.label).join(';') + '\n' + rows.join('\n');
    };

    // Leads CSV
    const leadsHeaders = [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Telefone' },
      { key: 'source', label: 'Origem' },
      { key: 'segment', label: 'Segmento' },
      { key: 'status', label: 'Etapa ID' },
      { key: 'value', label: 'Valor' },
      { key: 'proposalType', label: 'Tipo Proposta' },
      { key: 'createdAt', label: 'Data Entrada' },
      { key: 'notes', label: 'Observações' }
    ];
    const leadsCSV = arrayToCSV(data.leads, leadsHeaders);

    // Clientes CSV
    const clientsHeaders = [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Telefone' },
      { key: 'source', label: 'Origem' },
      { key: 'segment', label: 'Segmento' },
      { key: 'value', label: 'Valor' },
      { key: 'proposalType', label: 'Tipo Proposta' },
      { key: 'createdAt', label: 'Data Entrada' },
      { key: 'closedAt', label: 'Data Fechamento' }
    ];
    const clientsCSV = arrayToCSV(data.clients, clientsHeaders);

    // Download
    const allCSV = `=== LEADS ===\n${leadsCSV}\n\n=== CLIENTES ===\n${clientsCSV}`;
    const blob = new Blob(['\ufeff' + allCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypefoco-crm-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setImportStatus({ type: 'success', message: 'CSV exportado! Abra no Excel.' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Importar do JSON
  const importFromJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Validar estrutura básica
        if (!importedData.leads && !importedData.clients) {
          throw new Error('Formato inválido');
        }

        const newLeads = (importedData.leads || []).map((l, i) => ({ ...l, id: Date.now() + i }));
        const newClients = (importedData.clients || []).map((c, i) => ({ ...c, id: Date.now() + 10000 + i }));
        const newLostLeads = (importedData.lostLeads || []).map((l, i) => ({ ...l, id: Date.now() + 20000 + i }));
        const newInvestments = (importedData.trafficInvestment || []).map((t, i) => ({ ...t, id: Date.now() + 30000 + i }));
        const newActivities = (importedData.activities || []).map((a, i) => ({ ...a, id: Date.now() + 40000 + i }));

        updateData(prev => ({
          ...prev,
          leads: [...prev.leads, ...newLeads],
          clients: [...prev.clients, ...newClients],
          lostLeads: [...prev.lostLeads, ...newLostLeads],
          trafficInvestment: [...prev.trafficInvestment, ...newInvestments],
          activities: [...(prev.activities || []), ...newActivities]
        }));

        setImportStatus({ 
          type: 'success', 
          message: `Importados: ${newLeads.length} leads, ${newClients.length} clientes, ${newLostLeads.length} perdidos, ${newActivities.length} atividades` 
        });

      } catch (error) {
        console.error('Erro ao importar:', error);
        setImportStatus({ type: 'error', message: 'Erro ao importar. Verifique se é um arquivo de backup válido.' });
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Limpar todos os dados
  const clearAllData = () => {
    if (confirm('⚠️ ATENÇÃO: Isso vai apagar TODOS os dados do CRM. Tem certeza?\n\nRecomendamos exportar um backup antes.')) {
      if (confirm('Última chance! Deseja realmente apagar tudo?')) {
        updateData({
          clients: [],
          leads: [],
          lostLeads: [],
          trafficInvestment: [],
          activities: [],
          lossReasons: data.lossReasons
        });
        setImportStatus({ type: 'success', message: 'Todos os dados foram apagados.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Backup & Dados</h1>
        <p className="text-gray-500 mt-1">Exporte e importe seus dados</p>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-xl ${importStatus.type === 'success' ? 'bg-emerald-900/50 border border-emerald-700 text-emerald-400' : 'bg-red-900/50 border border-red-700 text-red-400'}`}>
          {importStatus.message}
        </div>
      )}

      {/* Resumo dos dados */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-100 mb-4">Dados Atuais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Leads</p>
            <p className="text-2xl font-bold text-lime-400">{data.leads.length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Clientes</p>
            <p className="text-2xl font-bold text-emerald-400">{data.clients.length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Projetos</p>
            <p className="text-2xl font-bold text-violet-400">{(data.projects?.cards || []).length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Perdidos</p>
            <p className="text-2xl font-bold text-red-400">{data.lostLeads.length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Investimentos</p>
            <p className="text-2xl font-bold text-cyan-400">{data.trafficInvestment.length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Atividades</p>
            <p className="text-2xl font-bold text-orange-400">{(data.activities || []).length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Meses Financeiro</p>
            <p className="text-2xl font-bold text-amber-400">{Object.keys(data.financial?.months || {}).length}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-sm">Recorrentes</p>
            <p className="text-2xl font-bold text-pink-400">{(data.financial?.recurring || []).length}</p>
          </div>
        </div>
      </Card>

      {/* Exportar JSON */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-lime-500">
            <Download size={24} className="text-gray-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100">Exportar Backup (JSON)</h3>
            <p className="text-gray-500 text-sm mt-1">
              Baixe todos os seus dados em formato JSON. Use para fazer backup ou transferir dados.
            </p>
            <div className="flex gap-3 mt-4">
              <Button icon={Download} onClick={exportToJSON}>
                Backup Completo (JSON)
              </Button>
              <Button variant="secondary" icon={FileSpreadsheet} onClick={exportToCSV}>
                Exportar CSV (Excel)
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Importar */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500">
            <Upload size={24} className="text-gray-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100">Importar Backup (JSON)</h3>
            <p className="text-gray-500 text-sm mt-1">
              Restaure dados de um arquivo de backup JSON.
            </p>
            <p className="text-amber-400 text-sm mt-2">
              ⚠️ Os dados importados serão ADICIONADOS aos existentes.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importFromJSON}
              className="hidden"
            />
            <Button className="mt-4" variant="secondary" icon={Upload} onClick={() => fileInputRef.current?.click()}>
              Selecionar Arquivo JSON
            </Button>
          </div>
        </div>
      </Card>

      {/* Backups Automáticos */}
      <Card className="p-6 border-violet-900">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-violet-500">
            <RefreshCw size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100">Backups Automáticos</h3>
            <p className="text-gray-500 text-sm mt-1">
              O sistema salva automaticamente os últimos 3 backups. Use para recuperar dados perdidos.
            </p>
            
            {(() => {
              const backupKeys = Object.keys(localStorage)
                .filter(k => k.startsWith('hypefoco-crm_backup_'))
                .sort()
                .reverse();
              
              if (backupKeys.length === 0) {
                return <p className="text-gray-600 text-sm mt-4">Nenhum backup automático encontrado.</p>;
              }
              
              return (
                <div className="mt-4 space-y-2">
                  {backupKeys.map((key, index) => {
                    const timestamp = parseInt(key.split('_backup_')[1]);
                    const date = new Date(timestamp);
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                        <div>
                          <p className="text-gray-300 text-sm">
                            Backup {index + 1} - {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR')}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {(localStorage.getItem(key)?.length / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            if (confirm(`Restaurar backup de ${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR')}?\n\nIsso substituirá todos os dados atuais.`)) {
                              try {
                                const backupData = JSON.parse(localStorage.getItem(key));
                                localStorage.setItem('hypefoco-crm', JSON.stringify(backupData));
                                window.location.reload();
                              } catch (e) {
                                alert('Erro ao restaurar backup');
                              }
                            }
                          }}
                        >
                          Restaurar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </Card>

      {/* Limpar dados */}
      <Card className="p-6 border-red-900">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-500">
            <Trash2 size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100">Limpar Todos os Dados</h3>
            <p className="text-gray-500 text-sm mt-1">
              Remove permanentemente todos os dados. Esta ação não pode ser desfeita.
            </p>
            <Button className="mt-4" variant="danger" icon={Trash2} onClick={clearAllData}>
              Apagar Todos os Dados
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Settings View - Configurações do CRM
const SettingsView = ({ data, updateData, user }) => {
  const emptyForm = { name: "", email: "", photo: "", emoji: "😀", role: "designer", bio: "", goals: "", birthday: "", startDate: "" };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const teamMembers = data.teamMembers || [];

  const openAdd = () => { setEditingMember(null); setFormData(emptyForm); setShowEmojiPicker(false); setIsModalOpen(true); };
  const openEdit = (m) => { setEditingMember(m); setFormData({ ...emptyForm, ...m }); setShowEmojiPicker(false); setIsModalOpen(true); };

  const handleSave = async () => {
    if (!formData.name) return;
    const saved = editingMember
      ? { ...formData, id: editingMember.id }
      : { ...formData, id: Date.now() };

    updateData(prev => ({
      ...prev,
      teamMembers: editingMember
        ? (prev.teamMembers || []).map(m => m.id === editingMember.id ? saved : m)
        : [...(prev.teamMembers || []), saved],
    }));

    // Sync to studio_members table if email provided
    if (formData.email && user) {
      try {
        await supabase.from("studio_members").upsert({
          member_email: formData.email,
          owner_user_id: user.id,
          role: formData.role || "designer",
        }, { onConflict: "member_email" });
      } catch {}
    }

    setIsModalOpen(false);
    setEditingMember(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (id) => {
    if (confirm("Excluir este membro da equipe?")) {
      const member = teamMembers.find(m => m.id === id);
      updateData(prev => ({
        ...prev,
        teamMembers: (prev.teamMembers || []).filter(m => m.id !== id),
      }));
      // Remove acesso na tabela studio_members também
      if (member?.email) {
        try {
          await supabase.from("studio_members").delete().eq("member_email", member.email);
        } catch {}
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const getRoleInfo = (roleId) => ROLES.find(r => r.id === roleId) || ROLES[0];

  const ALL_TAB_LABELS = {
    home: "Dashboard", comercial: "Comercial", pipeline: "Pipeline", projects: "Projetos",
    pautas: "Pautas", budgets: "Orçamentos", activities: "Atividades", clients: "Clientes",
    lost: "Leads Perdidos", financial: "Financeiro", investment: "Investimento",
    data: "Backup / Dados", settings: "Configurações",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie a equipe geral e permissões de acesso</p>
      </div>

      {/* Equipe Geral */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-lime-500">
              <Users size={20} className="text-gray-900" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-100">Equipe Geral</h3>
              <p className="text-sm text-gray-500">{teamMembers.length} membro{teamMembers.length !== 1 ? "s" : ""} cadastrado{teamMembers.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button icon={UserPlus} onClick={openAdd}>Adicionar</Button>
        </div>

        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => {
              const roleInfo = getRoleInfo(member.role);
              return (
                <div key={member.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-lime-500 bg-gray-800 flex items-center justify-center">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : member.emoji ? (
                        <span className="text-3xl">{member.emoji}</span>
                      ) : (
                        <div className="w-full h-full bg-lime-600 flex items-center justify-center text-xl font-bold text-gray-900">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-200 truncate">{member.name}</p>
                      {member.email && <p className="text-xs text-gray-500 truncate">{member.email}</p>}
                      <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${roleInfo.color}`}>{roleInfo.label}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(member)} className="p-2 hover:bg-gray-700 rounded-lg">
                        <Edit2 size={15} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-900/50 rounded-lg">
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  {member.bio && <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{member.bio}</p>}
                  <div className="flex gap-3 text-xs text-gray-500">
                    {member.birthday && <span>🎂 {member.birthday}</span>}
                    {member.startDate && <span>📅 desde {member.startDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum membro cadastrado</p>
            <p className="text-sm mt-1">Adicione membros da equipe para gerenciar acessos e perfis</p>
          </div>
        )}
      </Card>

      {/* Permissões por Cargo */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Lock size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100">Permissões por Cargo</h3>
            <p className="text-sm text-gray-500">Abas acessíveis para cada função</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 pr-4 text-gray-400 font-medium">Aba</th>
                {ROLES.map(r => (
                  <th key={r.id} className="text-center py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.color}`}>{r.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(ALL_TAB_LABELS).map(([tabId, tabLabel]) => (
                <tr key={tabId} className="border-b border-gray-800/50">
                  <td className="py-2 pr-4 text-gray-300">{tabLabel}</td>
                  {ROLES.map(r => (
                    <td key={r.id} className="text-center py-2 px-3">
                      {(ROLE_TABS[r.id] || []).includes(tabId)
                        ? <span className="text-lime-400">✓</span>
                        : <span className="text-gray-700">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Convidar membro */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <UserPlus size={20} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100">Convidar Membro</h3>
            <p className="text-sm text-gray-500">Como dar acesso ao sistema para um novo membro</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <p>Cadastre o membro aqui em <strong className="text-gray-200">Equipe Geral</strong> com o e-mail e cargo corretos.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <p>No painel do Supabase, vá em <strong className="text-gray-200">Authentication → Users</strong> e convide o e-mail do membro (ele receberá um link para criar a senha).</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <p>Execute o SQL abaixo no <strong className="text-gray-200">SQL Editor do Supabase</strong> para criar a tabela de controle de acesso (apenas na primeira vez):</p>
          </div>
          <pre className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto border border-gray-700">{`-- Tabela de membros da equipe
CREATE TABLE IF NOT EXISTS studio_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_email TEXT NOT NULL UNIQUE,
  owner_user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'designer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE studio_members ENABLE ROW LEVEL SECURITY;
-- Membro pode ler seu próprio registro
CREATE POLICY "member_read_own" ON studio_members FOR SELECT
  USING (member_email = (auth.jwt()->>'email'));
-- Dono gerencia todos os membros do seu estúdio
CREATE POLICY "owner_manage" ON studio_members FOR ALL
  USING (owner_user_id = (auth.uid())::text);`}</pre>
          <div className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
            <p><strong className="text-orange-300">ESSENCIAL — execute também este SQL</strong> para liberar o acesso dos membros aos dados do estúdio (sem isso os dados não aparecem):</p>
          </div>
          <pre className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto border border-orange-700">{`-- Permite que membros da equipe acessem os dados do estúdio
CREATE POLICY "team_member_data_access" ON crm_data FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM studio_members
      WHERE studio_members.member_email = (auth.jwt()->>'email')
      AND studio_members.owner_user_id = crm_data.user_id::text
    )
  );`}</pre>
          <div className="flex gap-3 items-start">
            <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
            <p>Pronto! O membro faz login com a conta dele e enxerga os dados do estúdio apenas nas abas permitidas pelo cargo. Para alterar o cargo, edite o membro aqui e salve.</p>
          </div>
        </div>
      </Card>

      {/* Performance */}
      {teamMembers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Performance da Equipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => {
              const memberLeads = (data.leads || []).filter(l => l.responsibleId == member.id);
              const memberClients = (data.clients || []).filter(c => c.responsibleId == member.id);
              const memberRevenue = memberClients.reduce((acc, c) => acc + (c.value || 0), 0);
              const roleInfo = getRoleInfo(member.role);
              return (
                <div key={member.id} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600 bg-gray-800 flex items-center justify-center">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : member.emoji ? (
                        <span className="text-xl">{member.emoji}</span>
                      ) : (
                        <div className="w-full h-full bg-lime-600 flex items-center justify-center font-bold text-gray-900">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{member.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleInfo.color}`}>{roleInfo.label}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl font-bold text-lime-400">{memberLeads.length}</p>
                      <p className="text-xs text-gray-500">Leads</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-400">{memberClients.length}</p>
                      <p className="text-xs text-gray-500">Clientes</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-cyan-400">R${(memberRevenue/1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-500">Receita</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Modal Novo/Editar Membro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? "Editar Membro" : "Novo Membro"} size="md">
        <div className="space-y-4">
          {/* Avatar: emoji ou foto */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800 flex items-center justify-center cursor-pointer hover:border-lime-500 transition-colors"
                onClick={() => setShowEmojiPicker(v => !v)}
              >
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{formData.emoji || "😀"}</span>
                )}
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center"
                onClick={() => setShowEmojiPicker(v => !v)}
              >
                <Smile size={13} className="text-gray-900" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs text-gray-500">Clique no avatar para escolher emoji, ou:</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-xs hover:bg-gray-700 transition-colors">
                <Image size={13} />
                {formData.photo ? "Trocar foto" : "Upload de foto"}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {formData.photo && (
                <button onClick={() => setFormData(f => ({ ...f, photo: "" }))} className="ml-2 text-xs text-red-400 hover:text-red-300">Remover foto</button>
              )}
            </div>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {EMOJI_LIST.map((em, i) => (
                  <button
                    key={i}
                    className={`text-xl p-1 rounded hover:bg-gray-700 transition-colors ${formData.emoji === em ? "bg-lime-500/30 ring-1 ring-lime-500" : ""}`}
                    onClick={() => { setFormData(f => ({ ...f, emoji: em, photo: "" })); setShowEmojiPicker(false); }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome *" value={formData.name} onChange={v => setFormData(f => ({ ...f, name: v }))} placeholder="Nome completo" />
            <Input label="Email (login)" type="email" value={formData.email} onChange={v => setFormData(f => ({ ...f, email: v }))} placeholder="email@exemplo.com" />
          </div>

          {/* Cargo / Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cargo / Função</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setFormData(f => ({ ...f, role: r.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    formData.role === r.id
                      ? `${r.color} ring-2 ring-offset-1 ring-offset-gray-900 ring-lime-500`
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData(f => ({ ...f, bio: e.target.value }))}
              placeholder="Uma breve descrição sobre este membro..."
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Metas do Ano</label>
            <textarea
              value={formData.goals}
              onChange={e => setFormData(f => ({ ...f, goals: e.target.value }))}
              placeholder="Objetivos e metas para este ano..."
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Data de Aniversário</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={e => setFormData(f => ({ ...f, birthday: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Entrada na Empresa</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!formData.name}>{editingMember ? "Salvar" : "Adicionar"}</Button>
        </div>
      </Modal>
    </div>
  );
};

// Financial View - Gestão Financeira
const FinancialView = ({ data, updateData }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null); // null = visão geral
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [entryForm, setEntryForm] = useState({ description: "", categories: [], predicted: 0, received: 0, invoiced: false, date: "", clientId: "" });
  const [expenseForm, setExpenseForm] = useState({ 
    description: "", category: "Custos Fixos", predicted: 0, paid: 0, date: "", 
    isRecurring: false, recurringId: null,
    isInstallment: false, totalInstallments: 1, currentInstallment: 1, installmentGroupId: null
  });
  const [recurringForm, setRecurringForm] = useState({ description: "", category: "Custos Fixos", value: 0, startMonth: 0, startYear: currentYear, endMonth: 11, endYear: currentYear, active: true });
  const [newClientForm, setNewClientForm] = useState({ name: "", company: "", cnpj: "", city: "", email: "", phone: "" });

  const financial = data.financial || { months: {}, categories: { expense: [], income: [] }, recurring: [] };
  const clients = data.clients || [];
  const recurringExpenses = financial.recurring || [];
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  // Categorias fixas (não lê do localStorage para garantir que estão atualizadas)
  const expenseCategories = ["Custos Fixos", "Salários", "Freelancer", "Comissão", "Investimentos", "Parcelamentos", "Impostos", "Marketing", "Ferramentas", "Outros"];
  const incomeCategories = ["Identidade Visual", "Rebranding", "Projeto Gráfico", "Editorial", "Motion Design", "Embalagem", "Audiovisual", "Naming", "Outro"];

  // Função para criar cliente antigo (legacy)
  const handleCreateLegacyClient = () => {
    if (!newClientForm.name) return;
    
    const newClient = {
      id: Date.now(),
      name: newClientForm.name,
      company: newClientForm.company,
      cnpj: newClientForm.cnpj,
      city: newClientForm.city,
      email: newClientForm.email,
      phone: newClientForm.phone,
      value: 0,
      isLegacy: true, // Marca como cliente antigo - não conta nas estatísticas do CRM
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    updateData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
    
    // Vincula automaticamente à entrada
    setEntryForm(prev => ({ ...prev, clientId: newClient.id, description: prev.description || newClient.name }));
    setIsNewClientModalOpen(false);
    setNewClientForm({ name: "", company: "", cnpj: "", city: "", email: "", phone: "" });
  };

  const getMonthKey = (year, monthIndex) => `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  
  // Função simples para pegar dados do mês (sem auto-criar)
  const getMonthData = (year, monthIndex) => {
    const key = getMonthKey(year, monthIndex);
    return financial.months?.[key] || { goal: 0, entries: [], expenses: [] };
  };

  // Função para pegar despesas do mês incluindo recorrentes pendentes
  const getMonthExpenses = (year, monthIndex) => {
    const monthData = getMonthData(year, monthIndex);
    const existingExpenses = monthData.expenses || [];
    const existingRecurringIds = existingExpenses.filter(e => e.recurringId).map(e => e.recurringId);
    
    // Verificar recorrentes que deveriam estar neste mês
    const currentKey = getMonthKey(year, monthIndex);
    const pendingRecurring = recurringExpenses.filter(r => {
      if (!r.active) return false;
      if (existingRecurringIds.includes(r.id)) return false;
      const startKey = `${r.startYear}-${String(r.startMonth + 1).padStart(2, '0')}`;
      const endKey = r.endYear ? `${r.endYear}-${String(r.endMonth + 1).padStart(2, '0')}` : '9999-12';
      return currentKey >= startKey && currentKey <= endKey;
    });
    
    return { existingExpenses, pendingRecurring };
  };

  // Função para aplicar recorrentes pendentes ao mês
  const applyPendingRecurring = (year, monthIndex) => {
    const { existingExpenses, pendingRecurring } = getMonthExpenses(year, monthIndex);
    
    if (pendingRecurring.length === 0) return;
    
    const newExpenses = pendingRecurring.map((r, idx) => ({
      id: Date.now() + idx,
      description: r.description,
      category: r.category,
      predicted: r.value,
      paid: 0,
      date: "",
      recurringId: r.id,
      isRecurring: true
    }));
    
    updateMonthData(year, monthIndex, { expenses: [...existingExpenses, ...newExpenses] });
  };

  const updateMonthData = (year, monthIndex, newData) => {
    const key = getMonthKey(year, monthIndex);
    updateData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        months: {
          ...(prev.financial?.months || {}),
          [key]: { ...getMonthData(year, monthIndex), ...newData }
        }
      }
    }));
  };

  // Salvar/editar despesa recorrente
  const handleSaveRecurring = () => {
    if (!recurringForm.description || !recurringForm.value) return;
    
    updateData(prev => {
      const currentRecurring = prev.financial?.recurring || [];
      let newRecurring;
      
      if (editingItem) {
        newRecurring = currentRecurring.map(r => r.id === editingItem.id ? { ...recurringForm, id: r.id } : r);
      } else {
        newRecurring = [...currentRecurring, { ...recurringForm, id: Date.now() }];
      }
      
      return {
        ...prev,
        financial: {
          ...prev.financial,
          recurring: newRecurring
        }
      };
    });
    
    setIsRecurringModalOpen(false);
    setEditingItem(null);
    setRecurringForm({ description: "", category: "Custos Fixos", value: 0, startMonth: selectedMonth || 0, startYear: selectedYear, endMonth: 11, endYear: selectedYear + 1, active: true });
  };

  const handleEditRecurring = (recurring) => {
    setEditingItem(recurring);
    setRecurringForm(recurring);
    setIsRecurringModalOpen(true);
  };

  const handleDeleteRecurring = (id) => {
    if (!confirm("Excluir esta despesa recorrente?\n\nIsso removerá ela dos próximos meses, mas manterá os registros já pagos.")) return;
    
    updateData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        recurring: (prev.financial?.recurring || []).filter(r => r.id !== id)
      }
    }));
  };

  const handleToggleRecurringActive = (id) => {
    updateData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        recurring: (prev.financial?.recurring || []).map(r => 
          r.id === id ? { ...r, active: !r.active } : r
        )
      }
    }));
  };

  // Atualizar valor da recorrente para os próximos meses
  const handleUpdateRecurringValue = (id, newValue) => {
    updateData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        recurring: (prev.financial?.recurring || []).map(r => 
          r.id === id ? { ...r, value: newValue } : r
        )
      }
    }));
  };

  // Calcular saldo inicial (começa do saldo inicial do ano + resultados dos meses anteriores)
  // Se o mês tiver um override manual, usa ele
  const getInitialBalance = (year, monthIndex) => {
    const monthData = getMonthData(year, monthIndex);
    
    // Se o mês tem um saldo inicial manual, usa ele
    if (monthData.initialBalanceOverride !== undefined) {
      return monthData.initialBalanceOverride;
    }
    
    // Caso contrário, calcula automaticamente
    // Começa com o saldo inicial do ano
    let balance = financial.initialBalances?.[year] || 0;
    
    // Soma os resultados dos meses anteriores DESTE ano, respeitando overrides intermediários
    for (let m = 0; m < monthIndex; m++) {
      const key = getMonthKey(year, m);
      const prevMonthData = financial.months?.[key] || { entries: [], expenses: [] };

      // Se o mês anterior tem saldo inicial manual, reseta o saldo para esse valor
      if (prevMonthData.initialBalanceOverride !== undefined) {
        balance = prevMonthData.initialBalanceOverride;
      }

      const totalReceived = (prevMonthData.entries || []).reduce((acc, e) => acc + (e.received || 0), 0);
      const totalPaid = (prevMonthData.expenses || []).reduce((acc, e) => acc + (e.paid || 0), 0);
      balance += totalReceived - totalPaid;
    }
    
    return balance;
  };

  // Função para definir override do saldo inicial do mês
  const setMonthInitialBalance = (year, monthIndex, value) => {
    updateMonthData(year, monthIndex, { initialBalanceOverride: value === "" ? undefined : parseFloat(value) || 0 });
  };

  // Cálculos do mês
  const calculateMonthStats = (year, monthIndex) => {
    const monthData = getMonthData(year, monthIndex);
    const entries = monthData.entries || [];
    const expenses = monthData.expenses || [];
    
    const predictedIncome = entries.reduce((acc, e) => acc + (e.predicted || 0), 0);
    const receivedIncome = entries.reduce((acc, e) => acc + (e.received || 0), 0);
    const predictedExpenses = expenses.reduce((acc, e) => acc + (e.predicted || 0), 0);
    const paidExpenses = expenses.reduce((acc, e) => acc + (e.paid || 0), 0);
    
    const predictedResult = predictedIncome - predictedExpenses;
    const actualResult = receivedIncome - paidExpenses;
    const initialBalance = getInitialBalance(year, monthIndex);
    const hasInitialOverride = monthData.initialBalanceOverride !== undefined;
    const currentBalance = initialBalance + actualResult;
    
    const estimatedTax = receivedIncome * 0.06; // 6%
    const invoicedEntries = entries.filter(e => e.invoiced).length;
    const totalEntries = entries.length;
    
    const profit = actualResult > 0 ? actualResult : 0;
    const profitShare = profit * 0.20; // 20% do lucro
    
    const goal = monthData.goal || 0;
    const goalPercentage = goal > 0 ? (receivedIncome / goal * 100) : 0;
    
    // Gastos por categoria
    const expensesByCategory = {};
    expenses.forEach(exp => {
      const cat = exp.category || "Outros";
      if (!expensesByCategory[cat]) expensesByCategory[cat] = { predicted: 0, paid: 0 };
      expensesByCategory[cat].predicted += exp.predicted || 0;
      expensesByCategory[cat].paid += exp.paid || 0;
    });
    
    // Entradas por categoria (suporta múltiplas categorias por entrada)
    const incomeByCategory = {};
    entries.forEach(entry => {
      // Pega categories (array) ou category (string antiga) ou "Outro"
      const cats = entry.categories && entry.categories.length > 0 
        ? entry.categories 
        : (entry.category ? [entry.category] : ["Outro"]);
      
      // Divide o valor proporcionalmente entre as categorias
      const valuePerCategory = cats.length > 0 ? 1 / cats.length : 1;
      
      cats.forEach(cat => {
        if (!incomeByCategory[cat]) incomeByCategory[cat] = { predicted: 0, received: 0 };
        incomeByCategory[cat].predicted += (entry.predicted || 0) * valuePerCategory;
        incomeByCategory[cat].received += (entry.received || 0) * valuePerCategory;
      });
    });

    return {
      predictedIncome,
      receivedIncome,
      predictedExpenses,
      paidExpenses,
      predictedResult,
      actualResult,
      initialBalance,
      hasInitialOverride,
      currentBalance,
      estimatedTax,
      invoicedEntries,
      totalEntries,
      profit,
      profitShare,
      goal,
      goalPercentage,
      expensesByCategory,
      incomeByCategory,
      entries,
      expenses
    };
  };

  // Cálculos do ano
  const calculateYearStats = () => {
    let totalPredictedIncome = 0;
    let totalReceivedIncome = 0;
    let totalPredictedExpenses = 0;
    let totalPaidExpenses = 0;
    const yearExpensesByCategory = {};
    const yearIncomeByCategory = {};
    
    months.forEach((_, index) => {
      const stats = calculateMonthStats(selectedYear, index);
      totalPredictedIncome += stats.predictedIncome;
      totalReceivedIncome += stats.receivedIncome;
      totalPredictedExpenses += stats.predictedExpenses;
      totalPaidExpenses += stats.paidExpenses;
      
      // Gastos por categoria
      Object.entries(stats.expensesByCategory).forEach(([cat, values]) => {
        if (!yearExpensesByCategory[cat]) yearExpensesByCategory[cat] = { predicted: 0, paid: 0 };
        yearExpensesByCategory[cat].predicted += values.predicted;
        yearExpensesByCategory[cat].paid += values.paid;
      });
      
      // Entradas por categoria
      Object.entries(stats.incomeByCategory).forEach(([cat, values]) => {
        if (!yearIncomeByCategory[cat]) yearIncomeByCategory[cat] = { predicted: 0, received: 0 };
        yearIncomeByCategory[cat].predicted += values.predicted;
        yearIncomeByCategory[cat].received += values.received;
      });
    });

    return {
      totalPredictedIncome,
      totalReceivedIncome,
      totalPredictedExpenses,
      totalPaidExpenses,
      totalPredictedResult: totalPredictedIncome - totalPredictedExpenses,
      totalActualResult: totalReceivedIncome - totalPaidExpenses,
      yearExpensesByCategory,
      yearIncomeByCategory
    };
  };

  const yearStats = calculateYearStats();

  // Handlers
  const handleSaveEntry = () => {
    const monthData = getMonthData(selectedYear, selectedMonth);
    let newEntries;
    
    if (editingItem) {
      newEntries = monthData.entries.map(e => e.id === editingItem.id ? { ...entryForm, id: e.id } : e);
    } else {
      newEntries = [...(monthData.entries || []), { ...entryForm, id: Date.now() }];
    }
    
    updateMonthData(selectedYear, selectedMonth, { entries: newEntries });
    setIsEntryModalOpen(false);
    setEditingItem(null);
    setEntryForm({ description: "", categories: [], predicted: 0, received: 0, invoiced: false, date: "", clientId: "" });
  };

  const handleSaveExpense = () => {
    const monthData = getMonthData(selectedYear, selectedMonth);
    let newExpenses;
    
    if (editingItem) {
      // Editando - só atualiza a despesa atual
      newExpenses = monthData.expenses.map(e => e.id === editingItem.id ? { ...expenseForm, id: e.id } : e);
      updateMonthData(selectedYear, selectedMonth, { expenses: newExpenses });
    } else {
      // Criando nova despesa
      if (expenseForm.category === "Parcelamentos" && expenseForm.isInstallment && expenseForm.totalInstallments > 1) {
        // Criar parcelas em múltiplos meses
        const installmentGroupId = Date.now();
        const totalInstallments = parseInt(expenseForm.totalInstallments) || 1;
        
        for (let i = 0; i < totalInstallments; i++) {
          // Calcular mês/ano da parcela
          let targetMonth = selectedMonth + i;
          let targetYear = selectedYear;
          
          while (targetMonth > 11) {
            targetMonth -= 12;
            targetYear += 1;
          }
          
          const installmentExpense = {
            ...expenseForm,
            id: Date.now() + i,
            currentInstallment: i + 1,
            totalInstallments: totalInstallments,
            installmentGroupId: installmentGroupId,
            description: `${expenseForm.description}`,
            paid: 0 // Cada parcela começa sem pagar
          };
          
          // Pegar dados do mês alvo
          const targetMonthData = getMonthData(targetYear, targetMonth);
          const targetExpenses = [...(targetMonthData.expenses || []), installmentExpense];
          
          // Salvar no mês correspondente
          const key = getMonthKey(targetYear, targetMonth);
          updateData(prev => ({
            ...prev,
            financial: {
              ...prev.financial,
              months: {
                ...(prev.financial?.months || {}),
                [key]: { ...targetMonthData, expenses: targetExpenses }
              }
            }
          }));
        }
      } else {
        // Despesa normal (sem parcelamento)
        newExpenses = [...(monthData.expenses || []), { ...expenseForm, id: Date.now() }];
        updateMonthData(selectedYear, selectedMonth, { expenses: newExpenses });
      }
    }
    
    setIsExpenseModalOpen(false);
    setEditingItem(null);
    setExpenseForm({ 
      description: "", category: "Custos Fixos", predicted: 0, paid: 0, date: "",
      isInstallment: false, totalInstallments: 1, currentInstallment: 1, installmentGroupId: null
    });
  };

  const handleEditEntry = (entry) => {
    setEditingItem(entry);
    // Converter category antiga para categories (array)
    const categories = entry.categories || (entry.category ? [entry.category] : []);
    setEntryForm({ ...entry, categories, category: undefined });
    setIsEntryModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingItem(expense);
    setExpenseForm(expense);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteEntry = (id) => {
    if (!confirm("Excluir esta entrada?")) return;
    const monthData = getMonthData(selectedYear, selectedMonth);
    updateMonthData(selectedYear, selectedMonth, { 
      entries: monthData.entries.filter(e => e.id !== id) 
    });
  };

  const handleDeleteExpense = (id) => {
    if (!confirm("Excluir esta saída?")) return;
    const monthData = getMonthData(selectedYear, selectedMonth);
    updateMonthData(selectedYear, selectedMonth, { 
      expenses: monthData.expenses.filter(e => e.id !== id) 
    });
  };

  const toggleInvoiced = (entryId) => {
    const monthData = getMonthData(selectedYear, selectedMonth);
    const newEntries = monthData.entries.map(e => 
      e.id === entryId ? { ...e, invoiced: !e.invoiced } : e
    );
    updateMonthData(selectedYear, selectedMonth, { entries: newEntries });
  };

  const handleSetGoal = (value) => {
    updateMonthData(selectedYear, selectedMonth, { goal: parseFloat(value) || 0 });
  };

  const formatCurrency = (value) => `R$ ${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Função para exportar mês para contabilidade
  const exportMonthForAccounting = (year, monthIndex) => {
    const monthData = getMonthData(year, monthIndex);
    const entries = monthData.entries || [];
    
    // Gerar CSV - usa valor previsto (valor da nota) ao invés do recebido (que tem taxas)
    let csv = "Nome,Empresa,CNPJ,Cidade,Descrição,Valor,Nota Emitida\n";
    
    entries.forEach(entry => {
      const client = entry.clientId ? clients.find(c => c.id === entry.clientId) : null;
      const clientName = client?.name || entry.description || "";
      const company = client?.company || "";
      const cnpj = client?.cnpj || "";
      const city = client?.city || "";
      const invoiced = entry.invoiced ? "Sim" : "Não";
      
      // Usa predicted (valor da nota) ao invés de received (valor líquido)
      if (entry.predicted > 0 || entry.received > 0) {
        const valor = entry.predicted || entry.received || 0;
        csv += `"${clientName}","${company}","${cnpj}","${city}","${entry.description || ''}","${valor.toFixed(2).replace('.', ',')}","${invoiced}"\n`;
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financeiro_${months[monthIndex]}_${year}_contabilidade.csv`;
    link.click();
  };

  // Cores para o gráfico de pizza
  const CATEGORY_COLORS = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  // Visão Geral do Ano
  if (selectedMonth === null) {
    const yearGoal = financial.yearGoals?.[selectedYear] || 0;
    const initialYearBalance = financial.initialBalances?.[selectedYear] || 0;
    const currentMonth = new Date().getMonth();
    const todayYear = new Date().getFullYear();
    const remainingMonths = selectedYear === todayYear ? (12 - currentMonth - 1) : 0;
    const amountRemaining = yearGoal - yearStats.totalReceivedIncome;

    // Saldo atual calculado corretamente:
    // - Ano futuro: apenas o saldo inicial
    // - Ano atual: saldo até o mês atual (respeitando overrides)
    // - Ano passado: saldo final de dezembro (respeitando overrides)
    let currentCompanyBalance;
    if (selectedYear > todayYear) {
      currentCompanyBalance = initialYearBalance;
    } else if (selectedYear === todayYear) {
      currentCompanyBalance = calculateMonthStats(selectedYear, currentMonth).currentBalance;
    } else {
      currentCompanyBalance = calculateMonthStats(selectedYear, 11).currentBalance;
    }
    const monthlyNeeded = remainingMonths > 0 ? amountRemaining / remainingMonths : 0;
    
    // Dados para o gráfico de pizza de GASTOS
    const totalPaidExpenses = yearStats.totalPaidExpenses || 1;
    const pieDataExpenses = Object.entries(yearStats.yearExpensesByCategory)
      .filter(([_, values]) => values.paid > 0)
      .map(([category, values], index) => ({
        name: category,
        value: values.paid,
        percentage: ((values.paid / totalPaidExpenses) * 100).toFixed(1),
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
    
    // Cores para entradas (tons de verde/azul)
    const INCOME_COLORS = [
      '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', 
      '#f59e0b', '#84cc16', '#14b8a6'
    ];
    
    // Dados para o gráfico de pizza de ENTRADAS
    const totalReceivedIncome = yearStats.totalReceivedIncome || 1;
    const pieDataIncome = Object.entries(yearStats.yearIncomeByCategory)
      .filter(([_, values]) => values.received > 0)
      .map(([category, values], index) => ({
        name: category,
        value: values.received,
        percentage: ((values.received / totalReceivedIncome) * 100).toFixed(1),
        color: INCOME_COLORS[index % INCOME_COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Financeiro {selectedYear}</h1>
            <p className="text-gray-500 text-sm">Visão geral do ano</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedYear.toString()}
              onChange={(v) => setSelectedYear(parseInt(v))}
              options={[currentYear - 1, currentYear, currentYear + 1].map(y => ({ value: y.toString(), label: y.toString() }))}
            />
          </div>
        </div>

        {/* Saldo Atual em Destaque */}
        <Card className={`p-6 ${currentCompanyBalance >= 0 ? 'bg-gradient-to-r from-cyan-900/30 to-emerald-900/30 border-cyan-600' : 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-600'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${currentCompanyBalance >= 0 ? 'bg-cyan-500' : 'bg-red-500'}`}>
                <Wallet size={28} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Saldo Atual da Empresa</p>
                <p className={`text-4xl font-bold ${currentCompanyBalance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  {formatCurrency(currentCompanyBalance)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Saldo Inicial (Jan)</p>
              <input
                type="number"
                value={initialYearBalance || ""}
                onChange={(e) => {
                  updateData(prev => ({
                    ...prev,
                    financial: {
                      ...prev.financial,
                      initialBalances: {
                        ...(prev.financial?.initialBalances || {}),
                        [selectedYear]: parseFloat(e.target.value) || 0
                      }
                    }
                  }));
                }}
                placeholder="R$ 0,00"
                className="text-lg font-bold text-gray-300 bg-transparent border-none outline-none text-right w-32"
              />
            </div>
          </div>
        </Card>

        {/* Meta Anual Detalhada */}
        <Card className="p-4 border-lime-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-lime-600">
              <Target size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Meta Anual de Faturamento</p>
                <input
                  type="number"
                  value={yearGoal || ""}
                  onChange={(e) => {
                    updateData(prev => ({
                      ...prev,
                      financial: {
                        ...prev.financial,
                        yearGoals: {
                          ...(prev.financial?.yearGoals || {}),
                          [selectedYear]: parseFloat(e.target.value) || 0
                        }
                      }
                    }));
                  }}
                  placeholder="Definir meta..."
                  className="text-xl font-bold text-lime-400 bg-transparent border-none outline-none text-right w-40"
                />
              </div>
            </div>
          </div>
          
          {yearGoal > 0 && (
            <>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full transition-all ${(yearStats.totalReceivedIncome / yearGoal) >= 1 ? 'bg-lime-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min((yearStats.totalReceivedIncome / yearGoal) * 100, 100)}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-900/20 rounded-xl">
                  <p className="text-xs text-gray-500">Faturado</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(yearStats.totalReceivedIncome)}</p>
                  <p className="text-xs text-emerald-500">{((yearStats.totalReceivedIncome / yearGoal) * 100).toFixed(0)}% da meta</p>
                </div>
                <div className="p-3 bg-amber-900/20 rounded-xl">
                  <p className="text-xs text-gray-500">Falta</p>
                  <p className={`text-lg font-bold ${amountRemaining <= 0 ? 'text-lime-400' : 'text-amber-400'}`}>
                    {amountRemaining <= 0 ? 'Meta batida! 🎉' : formatCurrency(amountRemaining)}
                  </p>
                  {amountRemaining > 0 && <p className="text-xs text-amber-500">{((amountRemaining / yearGoal) * 100).toFixed(0)}% restante</p>}
                </div>
                <div className="p-3 bg-violet-900/20 rounded-xl">
                  <p className="text-xs text-gray-500">Necessário/mês</p>
                  <p className="text-lg font-bold text-violet-400">
                    {remainingMonths > 0 && amountRemaining > 0 ? formatCurrency(monthlyNeeded) : '-'}
                  </p>
                  {remainingMonths > 0 && amountRemaining > 0 && (
                    <p className="text-xs text-violet-500">{remainingMonths} meses restantes</p>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Resumo Entradas x Saídas lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Entradas */}
          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                <ArrowUpRight size={18} />
                Entradas do Ano
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Recebido</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(yearStats.totalReceivedIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Previsto</p>
                <p className="text-xl font-bold text-gray-400">{formatCurrency(yearStats.totalPredictedIncome)}</p>
              </div>
            </div>
          </Card>
          
          {/* Saídas */}
          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-red-400 flex items-center gap-2">
                <ArrowDownRight size={18} />
                Saídas do Ano
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Pago</p>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(yearStats.totalPaidExpenses)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Previsto</p>
                <p className="text-xl font-bold text-gray-400">{formatCurrency(yearStats.totalPredictedExpenses)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className={`p-3 ${yearStats.totalActualResult >= 0 ? 'bg-lime-900/20 border-lime-700' : 'bg-red-900/20 border-red-700'}`}>
            <p className="text-xs text-gray-500">Resultado do Ano</p>
            <p className={`text-xl font-bold ${yearStats.totalActualResult >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
              {formatCurrency(yearStats.totalActualResult)}
            </p>
          </Card>
          
          <Card className="p-3 border-violet-800">
            <p className="text-xs text-gray-500">Impostos (6%)</p>
            <p className="text-xl font-bold text-violet-400">{formatCurrency(yearStats.totalReceivedIncome * 0.06)}</p>
          </Card>
          
          <Card className="p-3 border-amber-800">
            <p className="text-xs text-gray-500">Lucros 20%</p>
            <p className="text-xl font-bold text-amber-400">{formatCurrency(yearStats.totalActualResult > 0 ? yearStats.totalActualResult * 0.2 : 0)}</p>
          </Card>
        </div>

        {/* Gráficos de Pizza lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Entradas por Categoria */}
          {pieDataIncome.length > 0 && (
            <Card className="p-4">
              <h3 className="font-bold text-gray-100 mb-4 flex items-center gap-2">
                <ArrowUpRight size={18} className="text-emerald-400" />
                Entradas por Tipo
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Total: {formatCurrency(yearStats.totalReceivedIncome)}
                </span>
              </h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieDataIncome}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieDataIncome.map((entry, index) => (
                          <Cell key={`cell-income-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#9ca3af' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-2">
                  {pieDataIncome.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-400 truncate">{item.name}</p>
                        <p className="text-sm font-semibold text-emerald-400">{item.percentage}%</p>
                      </div>
                      <p className="text-xs text-gray-500 hidden sm:block">{formatCurrency(item.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* Gastos por Categoria */}
          {pieDataExpenses.length > 0 && (
            <Card className="p-4">
              <h3 className="font-bold text-gray-100 mb-4 flex items-center gap-2">
                <PiggyBank size={18} className="text-red-400" />
                Gastos por Categoria
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Total: {formatCurrency(yearStats.totalPaidExpenses)}
                </span>
              </h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieDataExpenses}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieDataExpenses.map((entry, index) => (
                          <Cell key={`cell-expense-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#9ca3af' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-2">
                  {pieDataExpenses.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-400 truncate">{item.name}</p>
                        <p className="text-sm font-semibold text-red-400">{item.percentage}%</p>
                      </div>
                      <p className="text-xs text-gray-500 hidden sm:block">{formatCurrency(item.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Grid de Meses */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Mês a Mês</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((month, index) => {
              const stats = calculateMonthStats(selectedYear, index);
              const isCurrentMonth = new Date().getFullYear() === selectedYear && new Date().getMonth() === index;
              
              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`p-4 rounded-xl border text-left transition-all hover:border-lime-500/50 ${
                    isCurrentMonth ? 'bg-lime-900/20 border-lime-700' : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-200">{month}</span>
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Entradas:</span>
                      <span className="text-emerald-400">{formatCurrency(stats.receivedIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Saídas:</span>
                      <span className="text-red-400">{formatCurrency(stats.paidExpenses)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-700">
                      <span className="text-gray-400">Resultado:</span>
                      <span className={stats.actualResult >= 0 ? 'text-lime-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {formatCurrency(stats.actualResult)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Despesas Recorrentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-400" />
              Despesas Recorrentes
            </h3>
            <Button 
              icon={Plus} 
              size="sm"
              onClick={() => { 
                setEditingItem(null); 
                setRecurringForm({ description: "", category: "Custos Fixos", value: 0, startMonth: 0, startYear: selectedYear, endMonth: 11, endYear: selectedYear + 1, active: true }); 
                setIsRecurringModalOpen(true); 
              }}
            >
              Nova Recorrente
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Cadastre salários, assinaturas e custos fixos uma vez. Eles serão replicados automaticamente para os meses selecionados.
          </p>

          {recurringExpenses.length > 0 ? (
            <div className="space-y-2">
              {recurringExpenses.map(recurring => (
                <div key={recurring.id} className={`p-4 rounded-xl border flex items-center gap-4 ${recurring.active ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-900/50 border-gray-800 opacity-60'}`}>
                  <button
                    onClick={() => handleToggleRecurringActive(recurring.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      recurring.active ? 'bg-lime-600 text-white' : 'bg-gray-700 text-gray-500'
                    }`}
                    title={recurring.active ? "Ativa" : "Pausada"}
                  >
                    {recurring.active ? <Check size={18} /> : <Ban size={18} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-200">{recurring.description}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{recurring.category}</span>
                      <span>•</span>
                      <span>{months[recurring.startMonth]} {recurring.startYear} até {months[recurring.endMonth]} {recurring.endYear}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-400">{formatCurrency(recurring.value)}</p>
                    <p className="text-xs text-gray-500">/mês</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button onClick={() => handleEditRecurring(recurring)} className="p-2 hover:bg-gray-700 rounded-lg">
                      <Edit2 size={16} className="text-gray-500" />
                    </button>
                    <button onClick={() => handleDeleteRecurring(recurring.id)} className="p-2 hover:bg-red-900/50 rounded-lg">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-700/50">
                <p className="text-sm text-amber-400">
                  💡 Total mensal em recorrentes: <span className="font-bold">{formatCurrency(recurringExpenses.filter(r => r.active).reduce((acc, r) => acc + r.value, 0))}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma despesa recorrente</p>
              <p className="text-sm mt-1">Cadastre salários, Adobe, aluguel, etc.</p>
            </div>
          )}
        </Card>

        {/* Modal Despesa Recorrente */}
        <Modal isOpen={isRecurringModalOpen} onClose={() => setIsRecurringModalOpen(false)} title={editingItem ? "Editar Despesa Recorrente" : "Nova Despesa Recorrente"}>
          <div className="space-y-4">
            <Input 
              label="Descrição" 
              value={recurringForm.description} 
              onChange={(v) => setRecurringForm({...recurringForm, description: v})} 
              placeholder="Ex: Salário João, Adobe, Aluguel..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Categoria"
                value={recurringForm.category}
                onChange={(v) => setRecurringForm({...recurringForm, category: v})}
                options={expenseCategories.map(c => ({ value: c, label: c }))}
              />
              <Input 
                label="Valor Mensal (R$)" 
                type="number"
                value={recurringForm.value} 
                onChange={(v) => setRecurringForm({...recurringForm, value: parseFloat(v) || 0})} 
              />
            </div>
            
            <div className="p-4 bg-gray-800 rounded-xl space-y-3">
              <p className="text-sm font-medium text-gray-300">Período de vigência</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Início</label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={recurringForm.startMonth.toString()}
                      onChange={(v) => setRecurringForm({...recurringForm, startMonth: parseInt(v)})}
                      options={months.map((m, i) => ({ value: i.toString(), label: m }))}
                    />
                    <Select
                      value={recurringForm.startYear.toString()}
                      onChange={(v) => setRecurringForm({...recurringForm, startYear: parseInt(v)})}
                      options={[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => ({ value: y.toString(), label: y.toString() }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fim</label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={recurringForm.endMonth.toString()}
                      onChange={(v) => setRecurringForm({...recurringForm, endMonth: parseInt(v)})}
                      options={months.map((m, i) => ({ value: i.toString(), label: m }))}
                    />
                    <Select
                      value={recurringForm.endYear.toString()}
                      onChange={(v) => setRecurringForm({...recurringForm, endYear: parseInt(v)})}
                      options={[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => ({ value: y.toString(), label: y.toString() }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={recurringForm.active}
                onChange={(e) => setRecurringForm({...recurringForm, active: e.target.checked})}
                className="w-5 h-5 rounded border-gray-600 text-lime-500 focus:ring-lime-500"
              />
              <div>
                <span className="text-gray-300">Despesa ativa</span>
                <p className="text-xs text-gray-500">Desative para pausar sem excluir</p>
              </div>
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsRecurringModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveRecurring}>{editingItem ? "Salvar" : "Adicionar"}</Button>
          </div>
        </Modal>
      </div>
    );
  }

  // Visão do Mês Específico
  const monthStats = calculateMonthStats(selectedYear, selectedMonth);
  const monthData = getMonthData(selectedYear, selectedMonth);
  const { pendingRecurring } = getMonthExpenses(selectedYear, selectedMonth);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedMonth(null)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{months[selectedMonth]} {selectedYear}</h1>
            <p className="text-gray-500 text-sm">Gestão financeira do mês</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {pendingRecurring.length > 0 && (
            <Button variant="secondary" icon={CreditCard} onClick={() => applyPendingRecurring(selectedYear, selectedMonth)}>
              Aplicar {pendingRecurring.length} Recorrente{pendingRecurring.length > 1 ? 's' : ''}
            </Button>
          )}
          <Button variant="secondary" icon={Download} onClick={() => exportMonthForAccounting(selectedYear, selectedMonth)}>
            Exportar
          </Button>
          <Button variant="secondary" icon={Plus} onClick={() => { setEditingItem(null); setExpenseForm({ description: "", category: "Custos Fixos", predicted: 0, paid: 0, date: "" }); setIsExpenseModalOpen(true); }}>
            Saída
          </Button>
          <Button icon={Plus} onClick={() => { setEditingItem(null); setEntryForm({ description: "", categories: [], predicted: 0, received: 0, invoiced: false, date: "", clientId: "" }); setIsEntryModalOpen(true); }}>
            Entrada
          </Button>
        </div>
      </div>

      {/* Indicadores Simplificados */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Saldo Inicial */}
        <Card className={`p-4 ${monthStats.hasInitialOverride ? 'border-cyan-700' : ''}`}>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Saldo Inicial
            {monthStats.hasInitialOverride && <span className="text-cyan-400">✎</span>}
          </p>
          <input
            type="number"
            value={monthStats.hasInitialOverride ? monthStats.initialBalance : (monthStats.initialBalance || "")}
            onChange={(e) => setMonthInitialBalance(selectedYear, selectedMonth, e.target.value)}
            placeholder={formatCurrency(getInitialBalance(selectedYear, selectedMonth))}
            className={`w-full text-xl font-bold bg-transparent border-none outline-none ${monthStats.initialBalance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}
          />
          {monthStats.hasInitialOverride && (
            <button 
              onClick={() => setMonthInitialBalance(selectedYear, selectedMonth, "")}
              className="text-[10px] text-gray-500 hover:text-cyan-400"
            >
              usar automático
            </button>
          )}
        </Card>
        
        {/* Meta do Mês */}
        <Card className="p-4 border-lime-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Meta do Mês</p>
            {monthStats.goal > 0 && (
              <span className={`text-xs font-bold ${monthStats.goalPercentage >= 100 ? 'text-lime-400' : 'text-amber-400'}`}>
                {monthStats.goalPercentage.toFixed(0)}%
              </span>
            )}
          </div>
          <input
            type="number"
            value={monthStats.goal || ""}
            onChange={(e) => handleSetGoal(e.target.value)}
            placeholder="Definir..."
            className="w-full text-xl font-bold text-lime-400 bg-transparent border-none outline-none"
          />
          {monthStats.goal > 0 && (
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full ${monthStats.goalPercentage >= 100 ? 'bg-lime-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(monthStats.goalPercentage, 100)}%` }}
              />
            </div>
          )}
        </Card>
        
        {/* Entradas */}
        <Card className="p-4 bg-emerald-900/20 border-emerald-700">
          <p className="text-xs text-emerald-400">Entradas</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(monthStats.receivedIncome)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Previsto: {formatCurrency(monthStats.predictedIncome)}</p>
        </Card>
        
        {/* Saídas */}
        <Card className="p-4 bg-red-900/20 border-red-700">
          <p className="text-xs text-red-400">Saídas</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(monthStats.paidExpenses)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Previsto: {formatCurrency(monthStats.predictedExpenses)}</p>
        </Card>
        
        {/* Resultado do Mês */}
        <Card className={`p-4 ${monthStats.actualResult >= 0 ? 'bg-lime-900/20 border-lime-700' : 'bg-red-900/20 border-red-700'}`}>
          <p className="text-xs text-gray-400">Resultado do Mês</p>
          <p className={`text-xl font-bold ${monthStats.actualResult >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
            {formatCurrency(monthStats.actualResult)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Previsto: {formatCurrency(monthStats.predictedResult)}</p>
        </Card>
        
        {/* Saldo Atual da Empresa */}
        <Card className={`p-4 ${monthStats.currentBalance >= 0 ? 'bg-cyan-900/30 border-cyan-600' : 'bg-red-900/30 border-red-600'}`}>
          <p className="text-xs text-cyan-400">Saldo Atual</p>
          <p className={`text-xl font-bold ${monthStats.currentBalance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {formatCurrency(monthStats.currentBalance)}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Saldo da empresa</p>
        </Card>
      </div>

      {/* Entradas e Saídas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Entradas */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-emerald-400 flex items-center gap-2">
              <ArrowUpRight size={18} />
              Entradas ({monthStats.entries.length})
            </h3>
            <span className="text-sm text-gray-500">
              Notas: {monthStats.invoicedEntries}/{monthStats.totalEntries}
            </span>
          </div>
          
          {monthStats.entries.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {monthStats.entries.map(entry => {
                const linkedClient = entry.clientId ? clients.find(c => c.id === entry.clientId) : null;
                const displayCategories = entry.categories && entry.categories.length > 0 
                  ? entry.categories.join(', ') 
                  : (entry.category || 'Outro');
                return (
                <div key={entry.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center gap-3">
                  <button
                    onClick={() => toggleInvoiced(entry.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      entry.invoiced ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-500 hover:bg-gray-600'
                    }`}
                    title={entry.invoiced ? "Nota emitida" : "Nota pendente"}
                  >
                    {entry.invoiced ? <FileCheck size={16} /> : <Receipt size={16} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-200 text-sm truncate">{entry.description}</p>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="text-emerald-500">{displayCategories}</span>
                      {linkedClient && (
                        <span className="text-cyan-400">• {linkedClient.name}</span>
                      )}
                      {entry.date && <span className="text-gray-600">• {entry.date}</span>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">{formatCurrency(entry.received)}</p>
                    <p className="text-xs text-gray-600">de {formatCurrency(entry.predicted)}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button onClick={() => handleEditEntry(entry)} className="p-1.5 hover:bg-gray-700 rounded-lg">
                      <Edit2 size={14} className="text-gray-500" />
                    </button>
                    <button onClick={() => handleDeleteEntry(entry.id)} className="p-1.5 hover:bg-red-900/50 rounded-lg">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              );})}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <ArrowUpRight size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma entrada cadastrada</p>
            </div>
          )}
        </Card>

        {/* Saídas */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-4">
            <ArrowDownRight size={20} />
            Saídas ({monthStats.expenses.length})
          </h3>
          
          {monthStats.expenses.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {monthStats.expenses.map(expense => (
                <div key={expense.id} className={`p-3 rounded-xl border flex items-center gap-3 ${
                  expense.isRecurring ? 'bg-amber-900/10 border-amber-800/50' : 
                  expense.installmentGroupId ? 'bg-violet-900/10 border-violet-800/50' :
                  'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    expense.isRecurring ? 'bg-amber-900/50' : 
                    expense.installmentGroupId ? 'bg-violet-900/50' :
                    'bg-red-900/50'
                  }`}>
                    <CreditCard size={16} className={
                      expense.isRecurring ? 'text-amber-400' : 
                      expense.installmentGroupId ? 'text-violet-400' :
                      'text-red-400'
                    } />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-200 text-sm truncate">{expense.description}</p>
                      {expense.isRecurring && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-900/50 text-amber-400 rounded">recorrente</span>
                      )}
                      {expense.installmentGroupId && (
                        <span className="text-xs px-1.5 py-0.5 bg-violet-900/50 text-violet-400 rounded">
                          {expense.currentInstallment}/{expense.totalInstallments}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">{expense.category}</span>
                      {expense.date && <span className="text-gray-600">• {expense.date}</span>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-400">{formatCurrency(expense.paid)}</p>
                    <p className="text-xs text-gray-600">de {formatCurrency(expense.predicted)}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button onClick={() => handleEditExpense(expense)} className="p-1.5 hover:bg-gray-700 rounded-lg">
                      <Edit2 size={14} className="text-gray-500" />
                    </button>
                    {!expense.isRecurring && (
                      <button onClick={() => handleDeleteExpense(expense.id)} className="p-1.5 hover:bg-red-900/50 rounded-lg">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <ArrowDownRight size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma saída cadastrada</p>
            </div>
          )}
        </Card>
      </div>

      {/* Gastos por Categoria do Mês */}
      {Object.keys(monthStats.expensesByCategory).length > 0 && (
        <Card className="p-4">
          <h3 className="font-bold text-gray-100 mb-3 text-sm">Gastos por Categoria</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(monthStats.expensesByCategory).map(([category, values]) => (
              <div key={category} className="p-2 bg-gray-800/30 rounded-lg">
                <p className="text-xs text-gray-400 truncate">{category}</p>
                <p className="text-sm font-bold text-gray-200">{formatCurrency(values.paid)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal Nova Entrada */}
      <Modal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} title={editingItem ? "Editar Entrada" : "Nova Entrada"}>
        <div className="space-y-4">
          <Input 
            label="Descrição" 
            value={entryForm.description} 
            onChange={(v) => setEntryForm({...entryForm, description: v})} 
            placeholder="Ex: Projeto Site XYZ"
          />
          
          {/* Select de Cliente com botão para criar novo */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300">Vincular a Cliente</label>
              <button 
                type="button"
                onClick={() => setIsNewClientModalOpen(true)}
                className="text-xs text-lime-400 hover:text-lime-300"
              >
                + Criar cliente antigo
              </button>
            </div>
            <Select
              value={entryForm.clientId?.toString() || ""}
              onChange={(v) => {
                const client = clients.find(c => c.id.toString() === v);
                setEntryForm({
                  ...entryForm, 
                  clientId: v ? parseInt(v) : "",
                  description: client ? (entryForm.description || client.name) : entryForm.description
                });
              }}
              options={[
                { value: "", label: "Nenhum cliente" },
                ...clients.map(c => ({ 
                  value: c.id.toString(), 
                  label: `${c.name}${c.company ? ` - ${c.company}` : ''}${c.isLegacy ? ' (antigo)' : ''}` 
                }))
              ]}
            />
          </div>
          
          {/* Categorias - múltipla seleção */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Tipo de Serviço</label>
            <div className="grid grid-cols-3 gap-2">
              {incomeCategories.map(cat => {
                const isSelected = (entryForm.categories || []).includes(cat) || entryForm.category === cat;
                return (
                  <label 
                    key={cat}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-emerald-900/50 border border-emerald-600' 
                        : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const currentCats = entryForm.categories || (entryForm.category ? [entryForm.category] : []);
                        if (e.target.checked) {
                          setEntryForm({...entryForm, categories: [...currentCats.filter(c => c !== cat), cat], category: undefined});
                        } else {
                          setEntryForm({...entryForm, categories: currentCats.filter(c => c !== cat), category: undefined});
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className={`text-xs ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`}>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>
          
          <Input 
            label="Data" 
            type="date"
            value={entryForm.date} 
            onChange={(v) => setEntryForm({...entryForm, date: v})} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Valor Previsto (R$)" 
              type="number"
              value={entryForm.predicted} 
              onChange={(v) => setEntryForm({...entryForm, predicted: parseFloat(v) || 0})} 
            />
            <Input 
              label="Valor Recebido (R$)" 
              type="number"
              value={entryForm.received} 
              onChange={(v) => setEntryForm({...entryForm, received: parseFloat(v) || 0})} 
            />
          </div>
          <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={entryForm.invoiced}
              onChange={(e) => setEntryForm({...entryForm, invoiced: e.target.checked})}
              className="w-5 h-5 rounded border-gray-600 text-lime-500 focus:ring-lime-500"
            />
            <span className="text-gray-300">Nota fiscal emitida</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsEntryModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEntry}>{editingItem ? "Salvar" : "Adicionar"}</Button>
        </div>
      </Modal>

      {/* Modal Criar Cliente Antigo */}
      <Modal isOpen={isNewClientModalOpen} onClose={() => setIsNewClientModalOpen(false)} title="Criar Cliente Antigo">
        <div className="space-y-4">
          <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-xl">
            <p className="text-sm text-amber-400">
              ⚠️ Cliente antigo não afeta as estatísticas do CRM (dashboard, funil, etc). 
              Use para clientes que já existiam antes de usar o sistema.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Nome / Contato" 
              value={newClientForm.name} 
              onChange={(v) => setNewClientForm({...newClientForm, name: v})} 
              placeholder="Nome do contato"
            />
            <Input 
              label="Empresa" 
              value={newClientForm.company} 
              onChange={(v) => setNewClientForm({...newClientForm, company: v})} 
              placeholder="Nome da empresa"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="CNPJ" 
              value={newClientForm.cnpj} 
              onChange={(v) => setNewClientForm({...newClientForm, cnpj: v})} 
              placeholder="00.000.000/0000-00"
            />
            <Input 
              label="Cidade" 
              value={newClientForm.city} 
              onChange={(v) => setNewClientForm({...newClientForm, city: v})} 
              placeholder="Ex: São Paulo - SP"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email" 
              type="email"
              value={newClientForm.email} 
              onChange={(v) => setNewClientForm({...newClientForm, email: v})} 
            />
            <Input 
              label="Telefone" 
              value={newClientForm.phone} 
              onChange={(v) => setNewClientForm({...newClientForm, phone: v})} 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsNewClientModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateLegacyClient} disabled={!newClientForm.name}>Criar e Vincular</Button>
        </div>
      </Modal>

      {/* Modal Nova Saída */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title={editingItem ? "Editar Saída" : "Nova Saída"}>
        <div className="space-y-4">
          <Input 
            label="Descrição" 
            value={expenseForm.description} 
            onChange={(v) => setExpenseForm({...expenseForm, description: v})} 
            placeholder="Ex: Aluguel escritório"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categoria"
              value={expenseForm.category}
              onChange={(v) => {
                const isParcelamento = v === "Parcelamentos";
                setExpenseForm({
                  ...expenseForm, 
                  category: v,
                  isInstallment: isParcelamento ? true : expenseForm.isInstallment
                });
              }}
              options={expenseCategories.map(c => ({ value: c, label: c }))}
            />
            <Input 
              label="Data" 
              type="date"
              value={expenseForm.date} 
              onChange={(v) => setExpenseForm({...expenseForm, date: v})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Valor Previsto (R$)" 
              type="number"
              value={expenseForm.predicted} 
              onChange={(v) => setExpenseForm({...expenseForm, predicted: parseFloat(v) || 0})} 
            />
            <Input 
              label="Valor Pago (R$)" 
              type="number"
              value={expenseForm.paid} 
              onChange={(v) => setExpenseForm({...expenseForm, paid: parseFloat(v) || 0})} 
            />
          </div>
          
          {/* Parcelamento - aparece quando categoria é Parcelamentos ou se marcou checkbox */}
          {(expenseForm.category === "Parcelamentos" || expenseForm.isInstallment) && !editingItem && (
            <div className="p-4 bg-violet-900/20 border border-violet-700/50 rounded-xl space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expenseForm.isInstallment}
                  onChange={(e) => setExpenseForm({...expenseForm, isInstallment: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-600 text-violet-500 focus:ring-violet-500"
                />
                <div>
                  <span className="text-gray-300">Criar parcelas automaticamente</span>
                  <p className="text-xs text-gray-500">As parcelas serão criadas nos próximos meses</p>
                </div>
              </label>
              
              {expenseForm.isInstallment && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Input 
                    label="Total de Parcelas"
                    type="number"
                    min="2"
                    max="48"
                    value={expenseForm.totalInstallments}
                    onChange={(v) => setExpenseForm({...expenseForm, totalInstallments: Math.max(2, Math.min(48, parseInt(v) || 2))})}
                  />
                  <div className="flex items-end">
                    <p className="text-sm text-gray-400 pb-2">
                      {expenseForm.totalInstallments}x de {formatCurrency(expenseForm.predicted)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Mostrar info de parcela se estiver editando uma */}
          {editingItem && expenseForm.installmentGroupId && (
            <div className="p-3 bg-violet-900/20 border border-violet-700/50 rounded-xl">
              <p className="text-sm text-violet-400">
                📦 Parcela {expenseForm.currentInstallment} de {expenseForm.totalInstallments}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsExpenseModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveExpense}>
            {editingItem ? "Salvar" : (expenseForm.isInstallment && expenseForm.totalInstallments > 1 ? `Criar ${expenseForm.totalInstallments} Parcelas` : "Adicionar")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Loading
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-48 mx-auto mb-4 animate-pulse">
        <svg viewBox="0 0 544.15 115.52" className="w-full h-auto" fill="#f0e9e3">
          <g>
            <g>
              <path d="M164.28,35.08l-18.82,53.77c-2.02,5.75-3.98,10.44-5.88,14.06-1.9,3.62-4.59,6.63-8.07,9.02-3.47,2.39-7.94,3.59-13.39,3.59-3.66,0-7.73-.6-12.21-1.79l-.11-11.99c3.96,1.27,7.65,1.9,11.09,1.9,3.73,0,6.59-.93,8.57-2.8,1.98-1.87,3.79-5.12,5.43-9.75h-8.07l-14.23-44.14h-9.97v-11.88h20.17l14.34,44.92h1.57l15.57-44.92h14Z"/>
              <path d="M218.3,41.97c4.26,5.19,6.39,12.01,6.39,20.45,0,6.05-1.06,11.31-3.19,15.8-2.13,4.48-5.06,7.9-8.79,10.25-3.74,2.35-7.99,3.53-12.77,3.53-8.29,0-13.71-3.62-16.24-10.87h-.67l2.13,11.88v21.62h-13.22V35.08h7.95l3.92,9.41h.56c.97-3.43,2.84-6.01,5.6-7.73,2.76-1.72,6.39-2.58,10.87-2.58,7.39,0,13.22,2.6,17.48,7.79ZM207.82,75.47c2.43-3.1,3.64-7.41,3.64-12.94,0-5.08-1.25-9.09-3.75-12.04-2.5-2.95-6.03-4.43-10.59-4.43-5.45,0-9.45,2.32-11.99,6.95v19.49c1.42,2.76,3.21,4.72,5.38,5.88,2.17,1.16,4.67,1.74,7.51,1.74,4.11,0,7.37-1.55,9.8-4.65Z"/>
              <path d="M40.67,94.87l-11.38-3.77v-25.65c-9.12,7.01-19.35,12.59-29.29,12.59v-12.63c9.08,0,20.13-8.14,29.29-16.48v-16.81C29.29,7.05,42.24,1.63,46.21.57c7.16-1.92,14.46,1.12,18.17,7.55,2.03,3.51,7.32,16.29-9.67,33.28-.94.94-2.1,2.15-3.45,3.55-2.63,2.74-5.79,6.03-9.35,9.47v17.62l22.24-29.88c4.01-5.52,10.98-7.56,17.34-5.07,6.24,2.44,9.96,8.47,9.35,15.1l.07,38.9-12.63.02-.07-39.23.04-.76c.16-1.37-.65-1.99-1.36-2.27-.71-.28-1.73-.37-2.54.75l-.05.07-33.65,45.2ZM50.45,12.63c-.32,0-.65.04-.98.13-3.76,1.01-7.56,7.39-7.56,19.37v4.32c.08-.08.16-.16.24-.24,1.39-1.45,2.59-2.7,3.63-3.74,7.92-7.92,9.55-14.76,7.66-18.03-.67-1.16-1.77-1.8-2.99-1.8Z"/>
              <path d="M290.32,68.13h-43.13c.75,4.18,2.61,7.23,5.6,9.13,2.99,1.9,7.39,2.86,13.22,2.86,7.54,0,14.45-.97,20.73-2.91v11.76c-6.57,2.02-13.56,3.03-20.95,3.03-10.98,0-19.1-2.59-24.37-7.79-5.27-5.19-7.9-12.23-7.9-21.12,0-9.41,2.74-16.58,8.23-21.51,5.49-4.93,12.71-7.39,21.68-7.39,8.44,0,15.03,2.26,19.77,6.78,4.74,4.52,7.11,11.26,7.11,20.22v6.95ZM277.55,58.38c0-8.21-4.71-12.32-14.12-12.32-4.56,0-8.23.92-11.03,2.74-2.8,1.83-4.58,5.02-5.32,9.58h30.47Z"/>
            </g>
            <path d="M359.22,46.95h-31.14c8.59,4.48,14.77,10.46,18.54,17.92,3.77,7.47,5.66,15.09,5.66,22.85s-1.81,14.24-5.43,18.77c-3.62,4.52-8.83,6.78-15.63,6.78-6.13,0-10.79-2.5-14-7.51-3.21-5-4.82-13.41-4.82-25.21,0-9.48.45-19.64,1.34-30.47-4.63-1.64-9.71-2.69-15.24-3.14v-11.88h16.8c1.27-11.58,2.84-22.59,4.71-33.05,4.71.37,7.95,1.4,9.75,3.08,1.79,1.68,2.69,3.86,2.69,6.55,0,4.11-1.98,11.8-5.94,23.08v.34h32.71v11.88ZM336.42,70.81c-2.13-5.53-5.66-10.27-10.59-14.23-.15,5.83-.22,13.82-.22,23.97,0,5.45.2,9.67.62,12.66.41,2.99,1.05,5.1,1.9,6.33.86,1.23,2.03,1.85,3.53,1.85,5.3,0,7.95-4.56,7.95-13.67,0-5.75-1.06-11.39-3.19-16.92Z"/>
            <path d="M379.14,88.35c-4.3-2.43-7.6-5.82-9.91-10.19-2.32-4.37-3.47-9.39-3.47-15.07s1.16-10.7,3.47-15.07c2.31-4.37,5.62-7.77,9.91-10.19,4.29-2.43,9.28-3.64,14.96-3.64s10.66,1.21,14.96,3.64c4.29,2.43,7.62,5.82,9.97,10.19,2.35,4.37,3.53,9.39,3.53,15.07s-1.18,10.7-3.53,15.07c-2.35,4.37-5.68,7.77-9.97,10.19-4.3,2.43-9.28,3.64-14.96,3.64s-10.66-1.21-14.96-3.64ZM405.58,75.46c2.5-3.1,3.75-7.23,3.75-12.38s-1.25-9.28-3.75-12.38c-2.5-3.1-6.33-4.65-11.48-4.65s-8.96,1.55-11.43,4.65c-2.46,3.1-3.7,7.23-3.7,12.38s1.23,9.28,3.7,12.38c2.46,3.1,6.27,4.65,11.43,4.65s8.98-1.55,11.48-4.65Z"/>
            <path d="M432.72,47.62c2.69-4.33,6.44-7.65,11.26-9.97,4.82-2.31,10.32-3.47,16.52-3.47,4.63,0,8.59.47,11.88,1.4,3.29.93,5.86,1.96,7.73,3.08v13.56c-5.68-4.11-12.17-6.16-19.49-6.16-5.53,0-10.03,1.38-13.5,4.14-3.47,2.76-5.21,7.06-5.21,12.88s1.72,9.84,5.15,12.71c3.43,2.88,8.22,4.31,14.34,4.31,4.33,0,8.4-.73,12.21-2.18s6.95-3.19,9.41-5.21v13.11c-1.79,1.42-4.65,2.8-8.57,4.14-3.92,1.34-8.42,2.02-13.5,2.02-7.1,0-13.05-1.29-17.87-3.86-4.82-2.58-8.42-6.05-10.81-10.42-2.39-4.37-3.59-9.24-3.59-14.62,0-5.97,1.34-11.13,4.03-15.46Z"/>
            <path d="M500.74,88.35c-4.3-2.43-7.6-5.82-9.91-10.19-2.32-4.37-3.47-9.39-3.47-15.07s1.16-10.7,3.47-15.07c2.31-4.37,5.62-7.77,9.91-10.19,4.29-2.43,9.28-3.64,14.96-3.64s10.66,1.21,14.96,3.64c4.29,2.43,7.62,5.82,9.97,10.19,2.35,4.37,3.53,9.39,3.53,15.07s-1.18,10.7-3.53,15.07c-2.35,4.37-5.68,7.77-9.97,10.19-4.3,2.43-9.28,3.64-14.96,3.64s-10.66-1.21-14.96-3.64ZM527.17,75.46c2.5-3.1,3.75-7.23,3.75-12.38s-1.25-9.28-3.75-12.38c-2.5-3.1-6.33-4.65-11.48-4.65s-8.96,1.55-11.43,4.65c-2.46,3.1-3.7,7.23-3.7,12.38s1.23,9.28,3.7,12.38c2.46,3.1,6.27,4.65,11.43,4.65s8.98-1.55,11.48-4.65Z"/>
          </g>
        </svg>
      </div>
      <p className="text-gray-500">Carregando CRM...</p>
    </div>
  </div>
);

// ─── Gestão de Pautas ───────────────────────────────────────────────────────
const PautasView = ({ data, updateData }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [dragOverBacklog, setDragOverBacklog] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    workStart: "09:00", workEnd: "18:00",
    lunchStart: "12:00", lunchEnd: "13:00",
    workDays: [1, 2, 3, 4, 5],
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "", type: "meeting", date: "", startTime: "09:00", endTime: "10:00", memberId: "",
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const teamMembers = data.teamMembers || [];
  const cards = data.projects?.cards || [];
  const columns = data.projects?.columns || [];
  const pautas = data.pautas || { assignments: [], events: [], employeeSchedules: {} };

  // ── Date helpers ──────────────────────────────────────────────────────────
  const getMondayOf = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const addDays = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  };
  const toISODate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const timeDiffHours = (t1, t2) => {
    const [h1, m1] = t1.split(":").map(Number);
    const [h2, m2] = t2.split(":").map(Number);
    return Math.max(0, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
  };

  // ── Smart scheduling helpers ───────────────────────────────────────────────
  const timeToMins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const minsToTime = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

  // Returns free time slots on a day (work hours minus lunch minus events)
  const getAvailableSlots = (memberId, dateStr) => {
    const s = getMemberSchedule(memberId);
    let slots = [{ start: timeToMins(s.workStart), end: timeToMins(s.workEnd) }];
    const subtract = (slots, from, to) => {
      const r = [];
      for (const sl of slots) {
        if (to <= sl.start || from >= sl.end) { r.push(sl); continue; }
        if (from > sl.start) r.push({ start: sl.start, end: from });
        if (to < sl.end) r.push({ start: to, end: sl.end });
      }
      return r;
    };
    slots = subtract(slots, timeToMins(s.lunchStart), timeToMins(s.lunchEnd));
    for (const ev of (pautas.events || []).filter((e) => e.memberId === memberId && e.date === dateStr)) {
      slots = subtract(slots, timeToMins(ev.startTime), timeToMins(ev.endTime));
    }
    return slots.filter((sl) => sl.end > sl.start);
  };

  // Calculates which day-blocks a task occupies, respecting schedule, lunch and events
  const calculateTaskBlocks = (memberId, startDate, startTimeMins, totalHours) => {
    let remaining = Math.round(totalHours * 60);
    let d = new Date(startDate + "T12:00:00"); // noon avoids DST edge cases
    let curMins = startTimeMins;
    const blocks = [];
    let safety = 0;
    while (remaining > 0 && safety++ < 90) {
      const dateStr = toISODate(d);
      const schedule = getMemberSchedule(memberId);
      if (!schedule.workDays.includes(d.getDay())) {
        d = addDays(d, 1);
        curMins = timeToMins(schedule.workStart);
        continue;
      }
      const slots = getAvailableSlots(memberId, dateStr);
      let dayStart = null, dayEnd = null, dayMins = 0;
      for (const slot of slots) {
        if (slot.end <= curMins) continue;
        const from = Math.max(slot.start, curMins);
        const avail = slot.end - from;
        if (avail <= 0) continue;
        if (dayStart === null) dayStart = from;
        if (remaining <= avail) {
          dayEnd = from + remaining;
          dayMins += remaining;
          remaining = 0;
          break;
        } else {
          dayEnd = slot.end;
          dayMins += avail;
          remaining -= avail;
        }
      }
      if (dayStart !== null && dayMins > 0) {
        blocks.push({ date: dateStr, startTime: minsToTime(dayStart), endTime: minsToTime(dayEnd), hours: dayMins / 60 });
      }
      if (remaining > 0) {
        d = addDays(d, 1);
        curMins = timeToMins(getMemberSchedule(memberId).workStart);
      }
    }
    return blocks;
  };

  // ── Schedule helpers ──────────────────────────────────────────────────────
  const getMemberSchedule = (memberId) =>
    (pautas.employeeSchedules || {})[memberId] || {
      workStart: "09:00", workEnd: "18:00",
      lunchStart: "12:00", lunchEnd: "13:00",
      workDays: [1, 2, 3, 4, 5],
    };
  const getAvailableHours = (memberId) => {
    const s = getMemberSchedule(memberId);
    return timeDiffHours(s.workStart, s.workEnd) - timeDiffHours(s.lunchStart, s.lunchEnd);
  };

  // ── Week calculation ──────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = addDays(getMondayOf(today), weekOffset * 7);
  const weekDays = [0, 1, 2, 3, 4].map((i) => addDays(weekStart, i));
  const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const MONTH_LABELS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  // ── Slot data getters ─────────────────────────────────────────────────────
  // Returns assignments that have a work block on dateStr (supports multi-day tasks)
  const getAssignmentsForSlot = (memberId, dateStr) =>
    (pautas.assignments || [])
      .filter((a) => a.memberId === memberId)
      .map((a) => {
        const sd = a.startDate || a.date; // backward compat
        const st = timeToMins(a.startTime || getMemberSchedule(memberId).workStart);
        const blocks = calculateTaskBlocks(memberId, sd, st, a.estimatedHours || 4);
        const blockIdx = blocks.findIndex((b) => b.date === dateStr);
        if (blockIdx === -1) return null;
        return { ...a, block: blocks[blockIdx], dayIndex: blockIdx + 1, totalDays: blocks.length };
      })
      .filter(Boolean);

  const getEventsForSlot = (memberId, dateStr) =>
    (pautas.events || []).filter((e) => e.memberId === memberId && e.date === dateStr);

  const getCapacityForDay = (memberId, dateStr) => {
    const available = getAvailableHours(memberId);
    if (available <= 0) return { available: 0, used: 0, percentage: 0 };
    // Use block hours for this day (already excludes lunch/events via calculateTaskBlocks)
    const assignedH = getAssignmentsForSlot(memberId, dateStr).reduce((s, a) => s + (a.block?.hours || 0), 0);
    const eventH = getEventsForSlot(memberId, dateStr).reduce((s, e) => s + timeDiffHours(e.startTime, e.endTime), 0);
    const used = assignedH + eventH;
    return { available, used, percentage: (used / available) * 100 };
  };
  const getWeekCapacity = (memberId) => {
    let totalAvail = 0, totalUsed = 0;
    weekDays.forEach((d) => {
      const s = getMemberSchedule(memberId);
      if (s.workDays.includes(d.getDay())) {
        const cap = getCapacityForDay(memberId, toISODate(d));
        totalAvail += cap.available;
        totalUsed += cap.used;
      }
    });
    return { available: totalAvail, used: totalUsed, percentage: totalAvail > 0 ? (totalUsed / totalAvail) * 100 : 0 };
  };

  // ── Backlog ───────────────────────────────────────────────────────────────
  // Tasks are the units that get scheduled in pautas (linked to projects)
  const allProjectTasks = data.projects?.tasks || [];
  const assignedTaskIds = new Set((pautas.assignments || []).map((a) => a.taskId).filter(Boolean));
  // Backlog: only project tasks that aren't assigned yet (no legacy card backlog)
  const backlog = allProjectTasks
    .filter(t => !t.completed && !assignedTaskIds.has(t.id))
    .map(t => ({ ...t, _type: 'task', _project: cards.find(c => c.id === t.projectId) }));

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, memberId, dateStr) => {
    e.preventDefault();
    setDragOverSlot({ memberId, dateStr });
  };
  const handleDragLeave = () => setDragOverSlot(null);
  const handleDrop = (e, memberId, dateStr) => {
    e.preventDefault();
    if (!draggedItem) { setDragOverSlot(null); return; }
    const schedule = getMemberSchedule(memberId);
    if (draggedItem.type === "backlog") {
      const item = draggedItem.card; // card here is the backlog item (task or legacy card)
      const isTask = item._type === 'task';
      const newAssignment = {
        id: Date.now(),
        ...(isTask ? { taskId: item.id, cardId: item.projectId } : { cardId: item.id }),
        memberId,
        startDate: dateStr, startTime: schedule.workStart,
        estimatedHours: item.estimatedHours || 4,
        _itemName: item.name,
      };
      updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), assignments: [...(prev.pautas?.assignments || []), newAssignment] } }));
    } else if (draggedItem.type === "assignment") {
      const { assignment } = draggedItem;
      updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), assignments: (prev.pautas?.assignments || []).map((a) => a.id === assignment.id ? { ...a, memberId, startDate: dateStr, startTime: schedule.workStart } : a) } }));
    }
    setDraggedItem(null);
    setDragOverSlot(null);
  };
  const handleDeleteAssignment = (assignmentId) => {
    updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), assignments: (prev.pautas?.assignments || []).filter((a) => a.id !== assignmentId) } }));
  };

  const handleToggleTaskComplete = (task) => {
    updateData(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        tasks: (prev.projects?.tasks || []).map(t =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      }
    }));
  };

  const handleDropOnBacklog = (e) => {
    e.preventDefault();
    setDragOverBacklog(false);
    if (draggedItem?.type === "assignment") {
      handleDeleteAssignment(draggedItem.assignment.id);
    }
    setDraggedItem(null);
  };

  // ── Schedule modal ────────────────────────────────────────────────────────
  const openScheduleModal = (member) => {
    setSelectedMemberId(member.id);
    setScheduleForm(getMemberSchedule(member.id));
    setIsScheduleModalOpen(true);
  };
  const handleSaveSchedule = () => {
    updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), employeeSchedules: { ...(prev.pautas?.employeeSchedules || {}), [selectedMemberId]: scheduleForm } } }));
    setIsScheduleModalOpen(false);
  };

  // ── Event modal ───────────────────────────────────────────────────────────
  const openEventModal = (memberId, dateStr) => {
    setEditingEventId(null);
    setEventForm({ title: "", type: "meeting", date: dateStr, startTime: "09:00", endTime: "10:00", memberId });
    setIsEventModalOpen(true);
  };
  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) return;
    if (editingEventId) {
      updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), events: (prev.pautas?.events || []).map((ev) => ev.id === editingEventId ? { ...eventForm, id: editingEventId } : ev) } }));
    } else {
      updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), events: [...(prev.pautas?.events || []), { ...eventForm, id: Date.now() }] } }));
    }
    setIsEventModalOpen(false);
  };
  const handleDeleteEvent = (eventId) => {
    updateData((prev) => ({ ...prev, pautas: { ...(prev.pautas || {}), events: (prev.pautas?.events || []).filter((ev) => ev.id !== eventId) } }));
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (teamMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center max-w-sm">
          <Users size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-300 mb-2">Nenhum membro cadastrado</h2>
          <p className="text-gray-500 text-sm">Acesse <strong className="text-gray-300">Configurações → Membros</strong> para adicionar a equipe antes de usar a Gestão de Pautas.</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Gestão de Pautas</h1>
          <p className="text-gray-500 text-sm">Distribuição de tarefas da equipe</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-colors text-sm font-medium">
            Semana Atual
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-colors">
            <ChevronRight size={18} />
          </button>
          <span className="text-gray-500 text-sm ml-1">
            {weekDays[0].getDate()} {MONTH_LABELS[weekDays[0].getMonth()]} – {weekDays[4].getDate()} {MONTH_LABELS[weekDays[4].getMonth()]} {weekDays[4].getFullYear()}
          </span>
        </div>
      </div>

      {/* Capacity cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(teamMembers.length, 4)}, 1fr)` }}>
        {teamMembers.map((member) => {
          const cap = getWeekCapacity(member.id);
          const pct = cap.percentage;
          const colorText = pct > 100 ? "text-red-400" : pct > 80 ? "text-amber-400" : "text-emerald-400";
          const colorBar = pct > 100 ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500";
          return (
            <div key={member.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-9 h-9 rounded-full object-cover border border-gray-700" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <User size={18} className="text-gray-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{member.name}</p>
                  <p className={`text-xs font-bold ${colorText}`}>{Math.round(pct)}% ocupado na semana</p>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                <div className={`h-1.5 rounded-full transition-all ${colorBar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-600">{cap.used.toFixed(1)}h alocadas / {cap.available.toFixed(1)}h disponíveis</p>
            </div>
          );
        })}
      </div>

      {/* Backlog */}
      <div
        className={`border rounded-2xl p-4 transition-all ${
          dragOverBacklog && draggedItem?.type === "assignment"
            ? "bg-amber-900/10 border-amber-500"
            : "bg-gray-900 border-gray-800"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOverBacklog(true); }}
        onDragLeave={() => setDragOverBacklog(false)}
        onDrop={handleDropOnBacklog}
      >
        <div className="flex items-center gap-2 mb-3">
          <Package size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-300">Backlog — Tarefas não atribuídas</h2>
          <span className="ml-auto text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">{backlog.length}</span>
        </div>
        {dragOverBacklog && draggedItem?.type === "assignment" && (
          <p className="text-xs text-amber-400 text-center pb-2">Solte aqui para devolver ao backlog</p>
        )}
        {backlog.length === 0 && !(dragOverBacklog && draggedItem?.type === "assignment") ? (
          <p className="text-sm text-gray-600 text-center py-6">Todas as tarefas estão atribuídas ou não há projetos ativos.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {backlog.map((item) => {
              const isTask = item._type === 'task';
              const project = isTask ? item._project : null;
              const col = columns.find((c) => c.id === (project?.columnId || item.columnId));
              const isDragging = draggedItem?.type === "backlog" && draggedItem?.card?.id === item.id;
              const taskMember = isTask ? (data.teamMembers || []).find(m => m.id === item.responsibleId || m.id === parseInt(item.responsibleId)) : null;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type: "backlog", card: item })}
                  onDragEnd={() => setDraggedItem(null)}
                  onClick={() => { const proj = item._project; if (proj) setSelectedProject(proj); }}
                  className={`flex-shrink-0 w-52 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${isDragging ? "opacity-40 scale-95" : "hover:border-lime-700"} bg-gray-800 border-gray-700`}
                >
                  {/* Task badge or card indicator */}
                  {isTask && (
                    <p className="text-xs text-gray-600 mb-1 truncate">{project?.name || 'Projeto'}</p>
                  )}
                  <p className="text-sm font-semibold text-gray-200 truncate mb-2">{item.name}</p>
                  <div className="flex items-center justify-between gap-2">
                    {col && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium truncate" style={{ backgroundColor: col.color + "22", color: col.color }}>
                        {col.name}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      {taskMember && (
                        taskMember.photo
                          ? <img src={taskMember.photo} alt="" className="w-4 h-4 rounded-full object-cover" />
                          : <div className="w-4 h-4 rounded-full bg-lime-500/20 flex items-center justify-center"><span className="text-lime-400 text-xs">{taskMember.name?.[0]}</span></div>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                        <Clock size={10} />
                        {item.estimatedHours || "?"}h
                      </span>
                    </div>
                  </div>
                  {item.deadline && (
                    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                      <Calendar size={10} />
                      {item.deadline}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gantt Grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Day header row */}
        <div className="flex border-b border-gray-800 bg-gray-950">
          <div className="w-44 flex-shrink-0 border-r border-gray-800" />
          {weekDays.map((day, i) => {
            const isToday = toISODate(day) === toISODate(today);
            return (
              <div key={i} className={`flex-1 p-3 text-center border-r border-gray-800 last:border-r-0 ${isToday ? "bg-lime-950/40" : ""}`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-lime-400" : "text-gray-500"}`}>{DAY_LABELS[day.getDay()]}</p>
                <p className={`text-2xl font-bold leading-tight ${isToday ? "text-lime-300" : "text-gray-300"}`}>{day.getDate()}</p>
                <p className="text-xs text-gray-600">{MONTH_LABELS[day.getMonth()]}</p>
              </div>
            );
          })}
        </div>

        {/* Employee rows */}
        {teamMembers.map((member, mi) => {
          const schedule = getMemberSchedule(member.id);
          return (
            <div key={member.id} className={`flex border-b border-gray-800 last:border-b-0 ${mi % 2 === 1 ? "bg-gray-950/40" : ""}`}>
              {/* Member label */}
              <div className="w-44 flex-shrink-0 p-3 border-r border-gray-800 flex items-start gap-2.5">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-gray-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={14} className="text-gray-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-300 truncate">{member.name}</p>
                  <button
                    onClick={() => openScheduleModal(member)}
                    className="text-xs text-gray-600 hover:text-lime-400 transition-colors flex items-center gap-1 mt-0.5"
                    title="Configurar expediente"
                  >
                    <Clock size={10} />
                    {schedule.workStart}–{schedule.workEnd}
                  </button>
                </div>
              </div>

              {/* Day cells */}
              {weekDays.map((day, di) => {
                const dateStr = toISODate(day);
                const isWorkDay = schedule.workDays.includes(day.getDay());
                const isToday = dateStr === toISODate(today);
                const isOver = dragOverSlot?.memberId === member.id && dragOverSlot?.dateStr === dateStr;
                const slotAssignments = getAssignmentsForSlot(member.id, dateStr);
                const slotEvents = getEventsForSlot(member.id, dateStr);
                const cap = isWorkDay ? getCapacityForDay(member.id, dateStr) : null;
                const barColor = cap ? (cap.percentage > 100 ? "bg-red-500" : cap.percentage > 80 ? "bg-amber-500" : "bg-emerald-500") : "";
                return (
                  <div
                    key={di}
                    className={`flex-1 border-r border-gray-800 last:border-r-0 min-h-32 p-2 flex flex-col gap-1.5 transition-colors
                      ${!isWorkDay ? "bg-gray-950/60" : ""}
                      ${isToday ? "bg-lime-950/10" : ""}
                      ${isOver ? "bg-lime-900/25 ring-1 ring-inset ring-lime-700" : ""}
                    `}
                    onDragOver={isWorkDay ? (e) => handleDragOver(e, member.id, dateStr) : undefined}
                    onDragLeave={handleDragLeave}
                    onDrop={isWorkDay ? (e) => handleDrop(e, member.id, dateStr) : undefined}
                  >
                    {/* Capacity bar */}
                    {isWorkDay && cap && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-gray-800 rounded-full h-1">
                          <div className={`h-1 rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(cap.percentage, 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 tabular-nums">{cap.used.toFixed(0)}h</span>
                      </div>
                    )}
                    {!isWorkDay && (
                      <p className="text-xs text-gray-700 text-center mt-2">folga</p>
                    )}

                    {/* Event blocks */}
                    {slotEvents.map((ev) => (
                      <div key={ev.id} className="group relative bg-violet-900/40 border border-violet-800/60 rounded-lg p-1.5">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={10} className="text-violet-400 flex-shrink-0" />
                          <p className="text-xs text-violet-300 truncate font-medium">{ev.title}</p>
                        </div>
                        <p className="text-xs text-violet-500 mt-0.5">{ev.startTime}–{ev.endTime}</p>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} className="text-violet-500 hover:text-red-400" />
                        </button>
                      </div>
                    ))}

                    {/* Assignment blocks */}
                    {slotAssignments.map((assignment) => {
                      // Support both task-based and legacy card-based assignments
                      const assignedTask = assignment.taskId ? allProjectTasks.find(t => t.id === assignment.taskId) : null;
                      const card = cards.find((c) => c.id === assignment.cardId);
                      const displayName = assignedTask ? assignedTask.name : card?.name;
                      if (!displayName) return null;
                      const col = columns.find((c) => c.id === (card?.columnId));
                      const color = col?.color || "#6b7280";
                      const isDraggingThis = draggedItem?.type === "assignment" && draggedItem?.assignment?.id === assignment.id;
                      const block = assignment.block;
                      const isFirst = assignment.dayIndex === 1;
                      const isLast = assignment.dayIndex === assignment.totalDays;
                      const isMultiDay = assignment.totalDays > 1;
                      const isCompleted = assignedTask?.completed || false;
                      return (
                        <div
                          key={assignment.id}
                          draggable={!isCompleted}
                          onDragStart={(e) => !isCompleted && handleDragStart(e, { type: "assignment", assignment, card })}
                          onDragEnd={() => setDraggedItem(null)}
                          onClick={() => { if (card) setSelectedProject(card); }}
                          className={`group relative rounded-lg p-1.5 transition-all select-none ${isCompleted ? "cursor-pointer opacity-70" : "cursor-grab active:cursor-grabbing"} ${isDraggingThis ? "opacity-40 scale-95" : "hover:opacity-90"}`}
                          style={{
                            backgroundColor: isCompleted ? "#16a34a1a" : color + "1a",
                            borderLeft: `3px solid ${isCompleted ? "#16a34a" : color}`,
                            borderRight: isMultiDay && !isLast ? `2px dashed ${isCompleted ? "#16a34a" : color}` : undefined,
                            opacity: isDraggingThis ? 0.4 : 1,
                          }}
                        >
                          <div className="flex items-center gap-0.5">
                            {!isFirst && <ChevronLeft size={9} style={{ color: isCompleted ? "#16a34a" : color }} className="flex-shrink-0 opacity-70" />}
                            {isCompleted && <Check size={9} className="text-emerald-400 flex-shrink-0" />}
                            <p className={`text-xs font-semibold truncate leading-tight flex-1 pr-6 ${isCompleted ? "line-through text-emerald-600" : ""}`} style={{ color: isCompleted ? "#16a34a" : color }}>{displayName}</p>
                            {!isLast && <ChevronRight size={9} style={{ color: isCompleted ? "#16a34a" : color }} className="flex-shrink-0 opacity-70" />}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock size={9} className="text-gray-500" />
                            <span className="text-xs text-gray-500">{block?.hours.toFixed(1)}h</span>
                            {isMultiDay && (
                              <span className="text-xs ml-auto font-medium opacity-60" style={{ color: isCompleted ? "#16a34a" : color }}>
                                {assignment.dayIndex}/{assignment.totalDays}d
                              </span>
                            )}
                          </div>
                          {isFirst && (
                            <p className="text-xs text-gray-600 mt-0.5">
                              {block?.startTime}–{block?.endTime} • {assignment.estimatedHours}h total
                            </p>
                          )}
                          {/* Complete toggle */}
                          {assignedTask && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(assignedTask); }}
                              className="absolute top-1 right-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={isCompleted ? "Desmarcar concluída" : "Marcar como concluída"}
                            >
                              <Check size={10} className={isCompleted ? "text-emerald-400" : "text-gray-500 hover:text-emerald-400"} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(assignment.id); }}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remover atribuição"
                          >
                            <X size={10} className="text-gray-500 hover:text-red-400" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Add event button */}
                    {isWorkDay && (
                      <button
                        onClick={() => openEventModal(member.id, dateStr)}
                        className="mt-auto flex items-center justify-center gap-1 text-xs text-gray-700 hover:text-gray-400 transition-colors py-1 rounded-lg hover:bg-gray-800/60 w-full"
                      >
                        <Plus size={10} />
                        evento
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Modal: Configurar Expediente */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Configurar Expediente" size="sm">
        {selectedMemberId && (() => {
          const member = teamMembers.find((m) => m.id === selectedMemberId);
          return (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Expediente de <strong className="text-gray-200">{member?.name}</strong></p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Início</label>
                  <input type="time" value={scheduleForm.workStart} onChange={(e) => setScheduleForm((f) => ({ ...f, workStart: e.target.value }))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:border-lime-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fim</label>
                  <input type="time" value={scheduleForm.workEnd} onChange={(e) => setScheduleForm((f) => ({ ...f, workEnd: e.target.value }))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:border-lime-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Início almoço</label>
                  <input type="time" value={scheduleForm.lunchStart} onChange={(e) => setScheduleForm((f) => ({ ...f, lunchStart: e.target.value }))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:border-lime-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fim almoço</label>
                  <input type="time" value={scheduleForm.lunchEnd} onChange={(e) => setScheduleForm((f) => ({ ...f, lunchEnd: e.target.value }))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:border-lime-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Dias de trabalho</label>
                <div className="flex gap-1.5">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d, i) => (
                    <button key={i}
                      onClick={() => setScheduleForm((f) => ({ ...f, workDays: f.workDays.includes(i) ? f.workDays.filter((x) => x !== i) : [...f.workDays, i].sort() }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${scheduleForm.workDays.includes(i) ? "bg-lime-600 text-white" : "bg-gray-800 text-gray-500 hover:bg-gray-700"}`}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-400">
                  Horas úteis/dia: <strong className="text-gray-200">{(timeDiffHours(scheduleForm.workStart, scheduleForm.workEnd) - timeDiffHours(scheduleForm.lunchStart, scheduleForm.lunchEnd)).toFixed(1)}h</strong>
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsScheduleModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveSchedule}>Salvar</Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Modal: Adicionar Evento */}
      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Adicionar Evento" size="sm">
        <div className="space-y-4">
          <Input label="Título" value={eventForm.title} onChange={(v) => setEventForm((f) => ({ ...f, title: v }))} placeholder="Ex: Reunião de kickoff" />
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Tipo</label>
            <div className="flex gap-2">
              {[{ id: "meeting", label: "Reunião" }, { id: "absence", label: "Ausência" }, { id: "vacation", label: "Férias" }].map((t) => (
                <button key={t.id} onClick={() => setEventForm((f) => ({ ...f, type: t.id }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${eventForm.type === t.id ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >{t.label}</button>
              ))}
            </div>
          </div>
          <Input label="Data" type="date" value={eventForm.date} onChange={(v) => setEventForm((f) => ({ ...f, date: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Início</label>
              <input type="time" value={eventForm.startTime} onChange={(e) => setEventForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:border-lime-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Fim</label>
              <input type="time" value={eventForm.endTime} onChange={(e) => setEventForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:border-lime-500 focus:outline-none text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsEventModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEvent} disabled={!eventForm.title || !eventForm.date}>Adicionar</Button>
          </div>
        </div>
      </Modal>

      {selectedProject && (
        <ProjectDetailPanel
          project={cards.find(c => c.id === selectedProject.id) || selectedProject}
          data={data}
          updateData={updateData}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

// Main App
export default function HypefocoCRM() {
  const [user, setUser] = useState(null);
  const [memberInfo, setMemberInfo] = useState(null); // { owner_user_id, role } if team member
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Use the studio owner's user_id for data if this is a team member login
  const effectiveUser = memberInfo ? { ...user, id: memberInfo.owner_user_id } : user;
  const [data, updateData, isLoading, saveStatus] = usePersistedState(STORAGE_KEY, initialData, effectiveUser);

  // Verificar sessão ao carregar
  useEffect(() => {
    // Aguarda verificação de membro ANTES de liberar o app (evita race condition)
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const info = await checkTeamMember(u.email).catch(() => null);
        setMemberInfo(info);
      }
      setAuthLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const info = await checkTeamMember(u.email).catch(() => null);
        setMemberInfo(info);
      } else {
        setMemberInfo(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMemberInfo(null);
  };

  // Redirecionar para primeira aba permitida quando o cargo é carregado
  useEffect(() => {
    if (memberInfo?.role) {
      const allowed = ROLE_TABS[memberInfo.role] || [];
      if (allowed.length > 0 && !allowed.includes(activeView)) {
        setActiveView(allowed[0]);
      }
    }
  }, [memberInfo?.role]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen onLogin={setUser} />;
  if (isLoading) return <LoadingScreen />;

  const renderView = () => {
    switch (activeView) {
      case "home": return <HomeView data={data} updateData={updateData} />;
      case "comercial": return <ComercialView data={data} />;
      case "pipeline": return <PipelineView data={data} updateData={updateData} />;
      case "projects": return <ProjectsView data={data} updateData={updateData} />;
      case "pautas": return <PautasView data={data} updateData={updateData} />;
      case "budgets": return <BudgetsView data={data} updateData={updateData} />;
      case "activities": return <ActivitiesView data={data} updateData={updateData} />;
      case "clients": return <ClientsView data={data} updateData={updateData} />;
      case "lost": return <LostLeadsView data={data} updateData={updateData} />;
      case "financial": return <FinancialView data={data} updateData={updateData} />;
      case "investment": return <InvestmentView data={data} updateData={updateData} />;
      case "data": return <DataView data={data} updateData={updateData} />;
      case "settings": return <SettingsView data={data} updateData={updateData} user={user} />;
      default: return <HomeView data={data} updateData={updateData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} onLogout={handleLogout} saveStatus={saveStatus} memberRole={memberInfo?.role ?? null} />
      <main className="flex-1 p-4 md:p-8 overflow-auto">{renderView()}</main>
    </div>
  );
}

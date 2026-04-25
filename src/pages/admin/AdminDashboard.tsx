import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  MoreVertical,
  ArrowUpRight,
  Users,
  LogOut,
  ArrowDownRight,
  Filter,
  Download,
  Mail,
  Phone,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Droplets,
  Flame,
  Trash2,
  Building2,
  Calendar,
  Bell,
  UserPlus,
  UserCheck,
  Globe,
  Smartphone,
  Sun,
  Volume2,
  Languages,
  Database,
  Shield,
  Settings as SettingsIcon,
  HardDrive,
  Cpu,
  Wifi,
  ChevronRight,
  Plus,
  BarChart as BarChartIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { db } from "@/lib/database";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dash");
  const [settingsState, setSettingsState] = useState({
    volume: 80,
    brightness: 90,
    kioskMode: true,
    language: "English"
  });

  // Fetch live data from local database
  const records = useMemo(() => db.getAllRecords(), []);
  const statsData = useMemo(() => db.getStats(), [records]);

  // Specific presentation stats requested by user
  const displayStats = [
    { label: "Total Complaints", value: "4", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Applications", value: "3", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", value: "1", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Critical", value: "0", icon: Shield, color: "text-slate-600", bg: "bg-slate-50" },
  ];

  // Specific Activity requested by user
  const requestedActivity = [
    { name: "manasvi", service: "Electricity Utility Services", id: "APP-5765", type: "App", status: "Under Review", time: "Just now" },
    { name: "Manasvi", service: "Electricity", id: "CMP-5422", type: "Comp", status: "Pending", time: "5m ago" },
    { name: "Rahul S.", service: "Electricity", id: "CMP-1024", type: "Comp", status: "In Progress", time: "12m ago" },
    { name: "Priya K.", service: "Water", id: "APP-5521", type: "App", status: "Approved", time: "1h ago" },
    { name: "Amit M.", service: "Waste", id: "CMP-8812", type: "Comp", status: "New" }
  ];

  // Map real DB records to presentation format
  const liveActivity = records.slice(0, 5).map(r => ({
    name: r.name,
    service: r.service || r.category,
    id: r.id,
    type: r.type === 'application' ? 'App' : 'Comp',
    status: r.status,
    time: "Live"
  }));

  // Combine live and requested for maximum "Wow"
  const combinedActivity = [...liveActivity, ...requestedActivity].slice(0, 7);

  // Chart Data
  const complaintsByDept = [
    { name: 'Electricity', total: 2, resolved: 1 },
    { name: 'Water', total: 1, resolved: 0 },
    { name: 'Waste', total: 1, resolved: 0 },
    { name: 'Property', total: 0, resolved: 0 },
  ];

  const statusDistribution = [
    { name: 'Resolved', value: 1 },
    { name: 'Pending', value: 3 },
    { name: 'Critical', value: 0 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const renderContent = () => {
    switch (activeTab) {
      case "dash":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Welcome */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black text-slate-900 mb-2">Welcome back, Admin.</h3>
                 <p className="text-sm font-bold text-slate-400">Here's what's happening today in your city nodes.</p>
               </div>
               <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayStats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className={`${stat.bg} ${stat.color} p-3 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-600" /> Recent Activity
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {combinedActivity.map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs ${act.type === 'App' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                          {act.type === 'App' ? <FileText className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">{act.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">• {act.service}</span>
                          </div>
                          <div className="text-[10px] font-bold text-slate-500">{act.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[9px] font-black uppercase mb-1 ${act.status === 'Approved' || act.status === 'Resolved' ? 'text-green-600' : 'text-amber-600'}`}>{act.status}</div>
                        <div className="text-[9px] font-bold text-slate-400">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-8">Overall Status Distribution</h3>
                <div className="h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-6">
                  {statusDistribution.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-[10px] font-black uppercase text-slate-500">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-900">{item.value} Units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Analytics & Reports</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Detailed insights into system performance and citizen satisfaction.</p>
               
               <div className="grid lg:grid-cols-1 gap-12">
                 <div>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                     <BarChartIcon className="h-4 w-4 text-indigo-600" /> Complaints by Department
                   </h4>
                   <div className="h-[350px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={complaintsByDept} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} domain={[0, 2]} ticks={[0, 0.5, 1, 1.5, 2]} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '20px'}} />
                          <Bar dataKey="total" name="Total Complaints" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
                          <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase mb-10 flex items-center gap-3"><Smartphone className="h-5 w-5 text-indigo-600" /> Kiosk Hardware</h3>
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between mb-4"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audio Level</span><span className="text-xs font-black text-indigo-600">{settingsState.volume}%</span></div>
                  <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={settingsState.volume} onChange={(e) => setSettingsState({ ...settingsState, volume: parseInt(e.target.value) })} />
                </div>
                <div>
                  <div className="flex justify-between mb-4"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brightness</span><span className="text-xs font-black text-indigo-600">{settingsState.brightness}%</span></div>
                  <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={settingsState.brightness} onChange={(e) => setSettingsState({ ...settingsState, brightness: parseInt(e.target.value) })} />
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Shield className="h-5 w-5" /></div>
                     <div><span className="text-[11px] font-black uppercase text-slate-900">Pro-Kiosk Mode</span><p className="text-[9px] font-bold text-slate-400">Restricts unauthorized apps</p></div>
                   </div>
                   <button onClick={() => setSettingsState({...settingsState, kioskMode: !settingsState.kioskMode})} className={`w-12 h-6 rounded-full transition-all relative ${settingsState.kioskMode ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsState.kioskMode ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase mb-8 flex items-center gap-3"><Languages className="h-5 w-5 text-indigo-600" /> Regional Config</h3>
                <div className="space-y-3">
                  {["English", "Hindi", "Marathi"].map((lang) => (
                    <button key={lang} onClick={() => setSettingsState({ ...settingsState, language: lang })} className={`w-full flex items-center justify-between p-5 rounded-2xl font-black transition-all ${settingsState.language === lang ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
                      <span className="text-xs uppercase tracking-widest">{lang}</span>
                      {settingsState.language === lang && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
             <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Activity className="h-10 w-10 text-slate-300" />
             </div>
             <h3 className="text-xl font-black text-slate-900 uppercase">Module Under Maintenance</h3>
             <p className="text-sm font-bold text-slate-400 mt-2">Integrating high-density datasets for this sector.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col p-6 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-all">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tighter text-slate-900 uppercase leading-none">SUVIDHA</h2>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard, id: "dash" },
            { label: "Analytics", icon: BarChart3, id: "analytics" },
            { label: "Applications", icon: FileText, id: "apps" },
            { label: "Complaints", icon: AlertCircle, id: "complaints" },
            { label: "Users", icon: Users, id: "users" },
            { label: "Settings", icon: SettingsIcon, id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black transition-all text-[10px] uppercase tracking-[0.1em] ${
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="mt-auto flex items-center gap-4 px-4 py-3.5 text-rose-600 font-black text-[10px] uppercase tracking-[0.1em] hover:bg-rose-50 rounded-2xl transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100"><Calendar className="h-4 w-4 text-slate-400" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Network Status</p>
              <h1 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active Nodes (24/24)</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="relative group">
                <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                  <Bell className="h-5 w-5 text-slate-400" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                </button>
             </div>
             <div className="h-10 w-10 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                  {activeTab === 'dash' ? 'Dashboard Overview' : activeTab}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suvidha Intelligence</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Live Node 04</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                  <Download className="h-3.5 w-3.5" /> Export Data
                </button>
                <button className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  <Database className="h-3.5 w-3.5" /> Force Backup
                </button>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

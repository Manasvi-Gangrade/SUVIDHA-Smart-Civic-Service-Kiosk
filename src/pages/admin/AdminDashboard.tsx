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
  
  const resolvedCount = useMemo(() => 
    records.filter(r => r.status === 'Resolved' || r.status === 'Approved').length, 
    [records]
  );

  const stats = [
    { label: "Total Complaints", value: statsData.complaints.toString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Total Applications", value: statsData.applications.toString(), icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Resolved Services", value: resolvedCount.toString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Kiosks", value: "24", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const liveActivity = records.slice(0, 5).map(r => ({
    name: r.name,
    service: r.service || r.category || "General Service",
    id: r.id,
    type: r.type === 'application' ? 'App' : 'Comp',
    status: r.status,
    time: "Live"
  }));

  const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444'];

  const renderContent = () => {
    switch (activeTab) {
      case "dash":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> +12%
                    </span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Activity Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900">Service Activity Trends</h3>
                  <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Mon', apps: 40, comps: 24 },
                      { name: 'Tue', apps: 30, comps: 13 },
                      { name: 'Wed', apps: 20, comps: 98 },
                      { name: 'Thu', apps: 27, comps: 39 },
                      { name: 'Fri', apps: 18, comps: 48 },
                      { name: 'Sat', apps: 23, comps: 38 },
                      { name: 'Sun', apps: 34, comps: 43 },
                    ]}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="apps" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Status Breakdown</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Approved', value: 400 },
                          { name: 'Pending', value: 300 },
                          { name: 'In Progress', value: 300 },
                          { name: 'Rejected', value: 200 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {[
                    { label: 'Approved', color: 'bg-indigo-600' },
                    { label: 'Pending', color: 'bg-amber-500' },
                    { label: 'In Progress', color: 'bg-emerald-500' },
                    { label: 'Rejected', color: 'bg-rose-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-slate-600">{item.label}</span>
                      </div>
                      <span className="font-bold text-slate-900">{25 * (i+1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                <button className="text-xs font-semibold text-indigo-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveActivity.map((act, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {act.name[0]}
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{act.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{act.service}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${act.type === 'App' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            {act.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${act.status === 'Approved' || act.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {act.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <h3 className="font-bold text-slate-900 mb-8">Department Performance</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Electricity', total: 120, resolved: 85 },
                  { name: 'Water', total: 80, resolved: 70 },
                  { name: 'Gas', total: 60, resolved: 55 },
                  { name: 'Municipal', total: 200, resolved: 110 },
                  { name: 'Waste', total: 45, resolved: 40 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="total" name="Total Requests" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="resolved" name="Resolved" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-indigo-600" /> Kiosk Configuration
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Volume Level</span>
                    <span className="text-sm font-bold text-indigo-600">{settingsState.volume}%</span>
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                    value={settingsState.volume} 
                    onChange={(e) => setSettingsState({ ...settingsState, volume: parseInt(e.target.value) })} 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Screen Brightness</span>
                    <span className="text-sm font-bold text-indigo-600">{settingsState.brightness}%</span>
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                    value={settingsState.brightness} 
                    onChange={(e) => setSettingsState({ ...settingsState, brightness: parseInt(e.target.value) })} 
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-sm font-bold text-slate-900">Enterprise Kiosk Mode</span>
                    <p className="text-xs text-slate-500">Restricts system access to app only</p>
                  </div>
                  <button 
                    onClick={() => setSettingsState({...settingsState, kioskMode: !settingsState.kioskMode})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settingsState.kioskMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settingsState.kioskMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Languages className="h-5 w-5 text-indigo-600" /> Language Protocol
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["English", "Hindi", "Marathi", "Gujarati", "Bengali", "Tamil"].map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => setSettingsState({ ...settingsState, language: lang })}
                    className={`p-4 rounded-xl font-bold transition-all text-sm ${
                      settingsState.language === lang 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <Database className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 uppercase">Module Under Construction</h3>
            <p className="text-sm text-slate-500 mt-1">We are currently migrating this section to the new database.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 flex flex-col h-full z-50 flex-shrink-0">
        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-none">SUVIDHA</h2>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { label: "Dashboard", icon: LayoutDashboard, id: "dash" },
            { label: "Analytics", icon: BarChart3, id: "analytics" },
            { label: "Applications", icon: FileText, id: "apps" },
            { label: "Complaints", icon: AlertCircle, id: "complaints" },
            { label: "Kiosk Status", icon: Globe, id: "users" },
            { label: "Settings", icon: SettingsIcon, id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 font-bold text-sm rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'dash' ? 'Overview' : activeTab}
            </h1>
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500" /> System Online
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-xs w-64 focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] font-medium text-slate-500">Super Admin</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome back, Admin!
                </h2>
                <p className="text-sm text-slate-500">Monitor and manage city services in real-time.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                  <Download className="h-4 w-4" /> Export Data
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                  <Plus className="h-4 w-4" /> New Service
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

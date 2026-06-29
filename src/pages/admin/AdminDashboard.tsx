import { useState, useMemo, useEffect } from "react";
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
  X,
  Loader2,
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
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dash");
  const [settingsState, setSettingsState] = useState({
    volume: 80,
    brightness: 90,
    kioskMode: true,
    language: "English"
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [newServiceType, setNewServiceType] = useState<"complaint" | "application">("complaint");
  const [newServiceData, setNewServiceData] = useState({
    name: "",
    phone: "",
    category: "Electricity",
    service: "New Meter Connection",
    description: "",
    location: "Guwahati City",
    aadhaar: "",
    city: "Guwahati",
    pincode: "781001"
  });

  // Fetch live data as state from local database to support real-time reactivity
  const [recordsList, setRecordsList] = useState(() => db.getAllRecords());
  
  // Cryptographic audit log states
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; tamperedIndex: number | null }>({ isValid: true, tamperedIndex: null });
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setRecordsList(db.getAllRecords());
    };
    window.addEventListener("suvidha_db_sync", handleSync);
    return () => window.removeEventListener("suvidha_db_sync", handleSync);
  }, []);

  useEffect(() => {
    // Dynamically load and verify cryptographic audit log on mount
    const initAudit = async () => {
      const mod = await import("@/lib/audit");
      await mod.seedAuditLogsIfEmpty();
      const logs = mod.getAuditLogs();
      setAuditLogs(logs);
      const res = await mod.verifyAuditLogs();
      setVerificationResult(res);
    };
    initAudit();

    const handleAuditSync = async () => {
      const mod = await import("@/lib/audit");
      const logs = mod.getAuditLogs();
      setAuditLogs(logs);
      const res = await mod.verifyAuditLogs();
      setVerificationResult(res);
    };
    window.addEventListener("suvidha_audit_sync", handleAuditSync);
    return () => window.removeEventListener("suvidha_audit_sync", handleAuditSync);
  }, []);
  
  const statsData = useMemo(() => db.getStats(), [recordsList]);
  
  const resolvedCount = useMemo(() => 
    recordsList.filter(r => r.status === 'Resolved' || r.status === 'Approved').length, 
    [recordsList]
  );

  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const aggregated = days.map(name => ({ name, apps: 0, comps: 0 }));

    recordsList.forEach(r => {
      if (!r.timestamp) return;
      const dayIndex = new Date(r.timestamp).getDay();
      if (r.type === 'application') {
        aggregated[dayIndex].apps += 1;
      } else if (r.type === 'complaint') {
        aggregated[dayIndex].comps += 1;
      }
    });

    const monIndex = 1;
    const reordered = [
      ...aggregated.slice(monIndex),
      ...aggregated.slice(0, monIndex)
    ];
    
    if (recordsList.length === 0) {
      return [
        { name: 'Mon', apps: 0, comps: 0 },
        { name: 'Tue', apps: 0, comps: 0 },
        { name: 'Wed', apps: 0, comps: 0 },
        { name: 'Thu', apps: 0, comps: 0 },
        { name: 'Fri', apps: 0, comps: 0 },
        { name: 'Sat', apps: 0, comps: 0 },
        { name: 'Sun', apps: 0, comps: 0 },
      ];
    }
    return reordered;
  }, [recordsList]);

  const handleStatusChange = (id: string, newStatus: string) => {
    db.updateStatus(id, newStatus as any);
    setRecordsList(db.getAllRecords());
    toast.success(`Ticket ${id} successfully updated to ${newStatus}!`);
  };

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    const mod = await import("@/lib/audit");
    const res = await mod.verifyAuditLogs();
    setVerificationResult(res);
    setTimeout(() => {
      setIsVerifying(false);
      if (res.isValid) {
        toast.success("Cryptographic Hash Chain Verified: 100% Intact!");
      } else {
        toast.error(`TAMPER DETECTED at Block #${res.tamperedIndex !== null ? res.tamperedIndex + 1 : "?"}!`);
      }
    }, 800);
  };

  const handleSimulateTamper = async (index: number) => {
    const mod = await import("@/lib/audit");
    mod.simulateTampering(index, "ATTACKER_INJECTION::Modified log parameters. Unauthorized entry.");
    toast.warning("Tampered simulation injected successfully!");
  };

  const handleHealChain = async () => {
    localStorage.removeItem("suvidha_audit_logs");
    const mod = await import("@/lib/audit");
    await mod.seedAuditLogsIfEmpty();
    const logs = mod.getAuditLogs();
    setAuditLogs(logs);
    const res = await mod.verifyAuditLogs();
    setVerificationResult(res);
    toast.success("Cryptographic chain re-synchronized and healed!");
  };


  const handleExportData = () => {
    if (recordsList.length === 0) {
      toast.error("No records found to export.");
      return;
    }
    const headers = ["ID", "Type", "Category", "Service", "Name", "Phone", "Status", "Timestamp"];
    const rows = recordsList.map(r => [
      r.id,
      r.type,
      r.category,
      r.service || "",
      r.name,
      r.phone,
      r.status,
      new Date(r.timestamp).toISOString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `suvidha_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Data exported successfully!");
  };

  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceData.name.trim() || !newServiceData.phone.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    let id = "";
    if (newServiceType === "complaint") {
      id = db.addComplaint({
        category: newServiceData.category,
        service: newServiceData.service,
        name: newServiceData.name,
        phone: newServiceData.phone,
        description: newServiceData.description || "Manual Entry by Admin",
        location: newServiceData.location,
      });
    } else {
      id = db.addApplication({
        category: newServiceData.category,
        service: newServiceData.service,
        name: newServiceData.name,
        aadhaar: newServiceData.aadhaar || "XXXX-XXXX-0000",
        phone: newServiceData.phone,
        city: newServiceData.city,
        pincode: newServiceData.pincode,
      });
    }

    setRecordsList(db.getAllRecords());
    setIsNewServiceOpen(false);
    toast.success(`Successfully registered! Ticket ID: ${id}`);
    setNewServiceData({
      name: "",
      phone: "",
      category: "Electricity",
      service: "New Meter Connection",
      description: "",
      location: "Guwahati City",
      aadhaar: "",
      city: "Guwahati",
      pincode: "781001"
    });
  };

  const stats = [
    { label: "Total Complaints", value: statsData.complaints.toString(), icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Applications", value: statsData.applications.toString(), icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Resolved Services", value: resolvedCount.toString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Kiosks", value: "24", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const liveActivity = recordsList.slice(0, 5).map(r => ({
    name: r.name,
    service: r.service || r.category || "General Service",
    id: r.id,
    type: r.type === 'application' ? 'App' : 'Comp',
    status: r.status,
    time: "Live"
  }));

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];

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
                    <AreaChart data={chartData}>
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
                          { name: 'Approved', value: statsData.applications },
                          { name: 'Pending', value: statsData.complaints },
                          { name: 'In Progress', value: recordsList.filter(r => r.status === 'In Progress' || r.status === 'Under Review').length },
                          { name: 'Resolved', value: resolvedCount },
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
                    { label: 'Approved/Review', count: recordsList.filter(r => r.status === 'Approved' || r.status === 'Under Review').length, color: 'bg-indigo-600' },
                    { label: 'Pending', count: recordsList.filter(r => r.status === 'Pending').length, color: 'bg-amber-500' },
                    { label: 'In Progress', count: recordsList.filter(r => r.status === 'In Progress').length, color: 'bg-emerald-500' },
                    { label: 'Resolved', count: recordsList.filter(r => r.status === 'Resolved').length, color: 'bg-rose-500' },
                  ].map((item, i) => {
                    const total = recordsList.length || 1;
                    const pct = Math.round((item.count / total) * 100);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-slate-600">{item.label}</span>
                        </div>
                        <span className="font-bold text-slate-900">{pct}%</span>
                      </div>
                    );
                  })}
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
      case "apps": {
        const apps = recordsList.filter(r => 
          r.type === "application" && 
          (!searchQuery || 
           r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.phone.includes(searchQuery))
        );
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Submitted Applications</h3>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">Total: {apps.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category & Service</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhaar</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">No Applications Registered</td>
                    </tr>
                  ) : (
                    apps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold font-mono">
                              {app.name[0]}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-slate-900 block">{app.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">{app.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700 block">{app.service}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{app.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{app.aadhaar}</td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{app.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                            ${app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                              app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                              'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {app.status === "Under Review" ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStatusChange(app.id, "Approved")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app.id, "Rejected")}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">Archived</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case "complaints": {
        const comps = recordsList.filter(r => 
          r.type === "complaint" &&
          (!searchQuery || 
           r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.phone.includes(searchQuery) ||
           (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Grievance & Utility Complaints</h3>
              <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-bold">Total: {comps.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">No Complaints Registered</td>
                    </tr>
                  ) : (
                    comps.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold font-mono">
                              {comp.name[0]}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-slate-900 block">{comp.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">{comp.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700 block">{comp.service}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{comp.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{comp.description}</td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{comp.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                            ${comp.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                              comp.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                              'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            {comp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {comp.status === "Pending" ? (
                            <button 
                              onClick={() => handleStatusChange(comp.id, "In Progress")}
                              className="px-3 py-1.5 bg-[#FD8008] hover:bg-[#e67300] text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                            >
                              Assign Tech
                            </button>
                          ) : comp.status === "In Progress" ? (
                            <button 
                              onClick={() => handleStatusChange(comp.id, "Resolved")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">Archived</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
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
      case "audit":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Security Integrity Header Status */}
            <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300
              ${verificationResult.isValid 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-800"}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${verificationResult.isValid ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider leading-none mb-1">
                    {verificationResult.isValid ? "Cryptographic Chain Intact" : "Tamper Alert: Integrity Broken!"}
                  </h3>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
                    {verificationResult.isValid 
                      ? "✓ All SHA-256 block linkages verified. 0 modifications detected." 
                      : `⚠️ Chain broken at Block #${verificationResult.tamperedIndex !== null ? verificationResult.tamperedIndex + 1 : "?"}!`
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleVerifyChain}
                  disabled={isVerifying}
                  className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 text-white
                    ${verificationResult.isValid ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
                >
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{isVerifying ? "Verifying..." : "Verify Integrity"}</span>
                </button>

                {!verificationResult.isValid && (
                  <button
                    onClick={handleHealChain}
                    className="px-5 py-3 bg-[#192e59] hover:bg-[#112040] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Heal & Sync Chain</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-[#192e59] uppercase tracking-wider">Immutable Audit Logs</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Blockchain-inspired SHA-256 event chaining</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Block #</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4 font-mono">Current Hash / Link</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {auditLogs.map((log, idx) => {
                      const isBroken = verificationResult.tamperedIndex !== null && idx >= verificationResult.tamperedIndex;
                      return (
                        <tr 
                          key={log.id} 
                          className={`transition-colors 
                            ${isBroken ? "bg-rose-500/5 hover:bg-rose-500/10 text-rose-800 animate-pulse" : "hover:bg-slate-50"}`}
                        >
                          <td className="px-6 py-4 font-mono font-black text-[#192e59]">
                            #{idx + 1}
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-bold">
                            {new Date(log.timestamp).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider
                              ${log.action.includes("BOOT") || log.action.includes("INIT") 
                                ? "bg-slate-100 text-slate-600" 
                                : log.action.includes("CREATED") 
                                ? "bg-blue-50 text-blue-700" 
                                : "bg-amber-50 text-amber-700"}`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium max-w-xs truncate">
                            {log.details}
                          </td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                            <div className="flex flex-col gap-0.5">
                              <span className="truncate w-40 block" title={log.hash}>
                                Curr: {log.hash}
                              </span>
                              <span className="truncate w-40 block text-[9px] opacity-75" title={log.prevHash}>
                                Prev: {log.prevHash}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {verificationResult.isValid && (
                              <button
                                onClick={() => handleSimulateTamper(idx)}
                                className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                              >
                                Simulate Tamper
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
      <aside className="w-64 bg-[#192e59] flex flex-col h-full z-50 flex-shrink-0 border-r border-white/5">
        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-white/10">
            <img
              src="/images/logo.png"
              alt="Suvidha Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-none">SUVIDHA</h2>
            <p className="text-[10px] font-bold text-[#FD8008] uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { label: "Dashboard", icon: LayoutDashboard, id: "dash" },
            { label: "Analytics", icon: BarChart3, id: "analytics" },
            { label: "Applications", icon: FileText, id: "apps" },
            { label: "Complaints", icon: AlertCircle, id: "complaints" },
            { label: "Kiosk Status", icon: Globe, id: "users" },
            { label: "Audit Logs", icon: ShieldCheck, id: "audit" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                activeTab === item.id 
                  ? "bg-[#FD8008] text-white shadow-lg shadow-[#FD8008]/20" 
                  : "text-blue-100/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-200/70 font-bold text-sm rounded-xl hover:bg-rose-500/20 hover:text-rose-400 transition-all"
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
                placeholder="Global Search (Name, Phone, ID)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <Download className="h-4 w-4" /> Export Data
                </button>
                <button 
                  onClick={() => setIsNewServiceOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#192e59] text-white rounded-xl text-xs font-bold hover:bg-[#11203e] transition-all shadow-lg shadow-[#192e59]/20"
                >
                  <Plus className="h-4 w-4" /> New Service
                </button>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>

      {/* NEW SERVICE MODAL */}
      {isNewServiceOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="bg-[#192e59] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Create New Ticket</h3>
                <p className="text-[9px] font-bold text-[#FD8008] uppercase tracking-wider mt-1">Manual Service Registry</p>
              </div>
              <button 
                onClick={() => setIsNewServiceOpen(false)}
                className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <form onSubmit={handleAddNewService} className="p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewServiceType("complaint")}
                  className={`py-3 rounded-lg font-bold text-xs uppercase transition-all ${newServiceType === "complaint" ? "bg-[#192e59] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Register Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setNewServiceType("application")}
                  className={`py-3 rounded-lg font-bold text-xs uppercase transition-all ${newServiceType === "application" ? "bg-[#192e59] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Submit Application
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Citizen Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newServiceData.name}
                    onChange={e => setNewServiceData({ ...newServiceData, name: e.target.value })}
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newServiceData.phone}
                    onChange={e => setNewServiceData({ ...newServiceData, phone: e.target.value })}
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select
                      value={newServiceData.category}
                      onChange={e => setNewServiceData({ ...newServiceData, category: e.target.value })}
                      className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                    >
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Waste">Waste</option>
                      <option value="Municipal">Municipal</option>
                      <option value="Property">Property</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Item</label>
                    <input
                      type="text"
                      value={newServiceData.service}
                      onChange={e => setNewServiceData({ ...newServiceData, service: e.target.value })}
                      className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                      placeholder="e.g. Meter Connection"
                    />
                  </div>
                </div>

                {newServiceType === "complaint" ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Ward</label>
                      <input
                        type="text"
                        value={newServiceData.location}
                        onChange={e => setNewServiceData({ ...newServiceData, location: e.target.value })}
                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                        placeholder="e.g. Ward No. 5, Sector 4"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea
                        value={newServiceData.description}
                        onChange={e => setNewServiceData({ ...newServiceData, description: e.target.value })}
                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all h-20 resize-none"
                        placeholder="Describe the complaint in detail..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Number</label>
                      <input
                        type="text"
                        value={newServiceData.aadhaar}
                        onChange={e => setNewServiceData({ ...newServiceData, aadhaar: e.target.value })}
                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                        placeholder="Enter 12-digit Aadhaar"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                        <input
                          type="text"
                          value={newServiceData.city}
                          onChange={e => setNewServiceData({ ...newServiceData, city: e.target.value })}
                          className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pincode</label>
                        <input
                          type="text"
                          value={newServiceData.pincode}
                          onChange={e => setNewServiceData({ ...newServiceData, pincode: e.target.value })}
                          className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-[#192e59] focus:border-[#192e59] focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewServiceOpen(false)}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-xl font-bold text-xs uppercase hover:bg-slate-50 text-slate-500 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#FD8008] text-white rounded-xl font-bold text-xs uppercase hover:bg-[#e67300] transition-all shadow-lg shadow-[#FD8008]/20 active:scale-95"
                >
                  Register Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

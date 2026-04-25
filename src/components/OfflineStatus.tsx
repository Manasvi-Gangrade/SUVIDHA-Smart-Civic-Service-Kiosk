import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Kiosk is back online. Syncing data...");
      // Simulate syncing
      setTimeout(() => {
        const offlineData = localStorage.getItem("offline_grievances");
        if (offlineData) {
          localStorage.removeItem("offline_grievances");
          setPendingSync(0);
          toast.success("All pending data synced successfully!");
        }
      }, 2000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Kiosk is offline. Data will be saved locally.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check for pending data
    const offlineData = localStorage.getItem("offline_grievances");
    if (offlineData) {
      try {
        const parsed = JSON.parse(offlineData);
        setPendingSync(Array.isArray(parsed) ? parsed.length : 0);
      } catch (e) {
        setPendingSync(0);
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg transition-all ${
        isOnline 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
          : "bg-amber-500/10 border-amber-500/20 text-amber-600 animate-pulse"
      }`}>
        {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {isOnline ? "System Online" : "Relay Mode (Offline)"}
        </span>
      </div>

      {pendingSync > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 shadow-md animate-in slide-in-from-left duration-300">
          <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {pendingSync} Pending Sync
          </span>
        </div>
      )}
    </div>
  );
};

export default OfflineStatus;

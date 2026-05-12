import { useEffect, useMemo, useState } from 'react';
import DriverDashboard from '../DriverDashboard';

// Wrap existing dashboard UI inside driver layout.
export default function DriverDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const node = useMemo(() => {
    return (
      <div className="w-full">
        {/* DriverDashboard already includes dark UI; keep it for now */}
        {mounted ? <DriverDashboard /> : null}
      </div>
    );
  }, [mounted]);

  return node;
}


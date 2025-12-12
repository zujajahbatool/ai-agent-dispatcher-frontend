'use client';

import { useEffect, useState } from 'react';
import RealConnectionStatus from '@/components/RealConnectionStatus';
import { getFlows, getExecutions, type KestraFlow, type KestraExecution } from '@/lib/kestra';

export default function DashboardPage() {
  const [flows, setFlows] = useState<KestraFlow[]>([]);
  const [executions, setExecutions] = useState<KestraExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    success: 0,
    failed: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from your backend
        const [flowsData, execResponse] = await Promise.all([
          getFlows('dev'),
          getExecutions('dev', undefined, 20)
        ]);
        
        setFlows(flowsData);
        setExecutions(execResponse.data);
        
        // Calculate stats
        const execs = execResponse.data;
        setStats({
          total: execs.length,
          running: execs.filter(e => e.state.current === 'RUNNING').length,
          success: execs.filter(e => e.state.current === 'SUCCESS').length,
          failed: execs.filter(e => e.state.current === 'FAILED').length
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agent Dispatcher Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RealConnectionStatus />
        
        <div className="border rounded-lg p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-4">Execution Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Running</span>
              <span className="font-bold">{stats.running}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Success</span>
              <span className="font-bold">{stats.success}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Failed</span>
              <span className="font-bold">{stats.failed}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-4">Available Flows</h3>
          <div className="space-y-2">
            {flows.map(flow => (
              <div key={flow.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="font-medium">{flow.id}</span>
                {flow.disabled ? (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Disabled</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Active</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center pt-4 border-t">
        <p>Connected to: <code className="ml-1 px-2 py-1 bg-gray-100 rounded">http://localhost:8080</code></p>
      </div>
    </div>
  );
}

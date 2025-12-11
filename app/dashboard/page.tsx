// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import RealConnectionStatus from '@/component/RealConnectionStatus';
import { getFlows, getExecutions } from '@/lib/kestra';

export default function DashboardPage() {
  const [flows, setFlows] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealData();
    const interval = setInterval(loadRealData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadRealData = async () => {
    try {
      const [flowsData, execsData] = await Promise.all([
        getFlows(),
        getExecutions()
      ]);
      setFlows(flowsData);
      setExecutions(execsData);
    } catch (error) {
      console.error('Failed to load real data:', error);
      // NO MOCK DATA - arrays stay empty
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'RUNNING': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">AI Agent Dispatcher Dashboard</h1>
      <p className="text-gray-600 mb-6">Real-time PR automation monitoring</p>
      
      {/* Connection Status */}
      <RealConnectionStatus />
      
      {/* REAL DATA ONLY SECTION */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading real Kestra data...</p>
        </div>
      ) : flows.length === 0 && executions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 mb-2">📡</div>
          <p className="text-gray-500">Waiting for Kestra connection...</p>
          <p className="text-sm text-gray-400 mt-1">
            Real data will appear here once ngrok port is fixed (8080 instead of 80)
          </p>
        </div>
      ) : (
        <>
          {/* Real Flows Display */}
          {flows.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {flows.map(flow => (
                  <div key={flow.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium">{flow.id}</h3>
                    <p className="text-sm text-gray-600">Namespace: {flow.namespace}</p>
                    {flow.disabled !== undefined && (
                      <p className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                        flow.disabled ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {flow.disabled ? 'Disabled' : 'Active'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Executions Display */}
          {executions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Executions</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flow ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {executions.slice(0, 10).map((exec: any) => (
                      <tr key={exec.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{exec.flowId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(exec.state?.current || 'UNKNOWN')
                          }`}>
                            {exec.state?.current || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {exec.state?.startDate ? 
                            new Date(exec.state.startDate).toLocaleTimeString() : 
                            'N/A'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {exec.state?.duration ? 
                            `${(exec.state.duration / 1000).toFixed(1)}s` : 
                            'Running...'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
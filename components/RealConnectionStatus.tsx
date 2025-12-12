'use client';

import { useState, useEffect } from 'react';

interface ConnectionStatus {
  isConnected: boolean;
  lastUpdate: string;
  executions: number;
  activeAgents: number;
}

export default function RealConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastUpdate: 'Never',
    executions: 0,
    activeAgents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Connect to your real backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/v1/executions?namespace=dev&size=1`);
        const data = await response.json();
        
        setStatus({
          isConnected: true,
          lastUpdate: new Date().toLocaleTimeString(),
          executions: data.total || 0,
          activeAgents: Math.min(data.total || 0, 5) // Mock active agents count
        });
      } catch (error) {
        console.error('Connection error:', error);
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          lastUpdate: new Date().toLocaleTimeString()
        }));
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchStatus();

    // Set up polling every 5 seconds for real-time updates
    const intervalId = setInterval(fetchStatus, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Real Connection Status</h3>
        <div className={`flex items-center ${status.isConnected ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${status.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {status.isConnected ? 'LIVE' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Backend Status</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${status.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Executions</span>
          <span className="font-semibold">{status.executions}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Active Agents</span>
          <span className="font-semibold">{status.activeAgents}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Last Update</span>
          <span className="text-sm text-gray-500">{status.lastUpdate}</span>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500">
            Connected to: <code className="ml-1 px-1 py-0.5 bg-gray-100 rounded">localhost:8080</code>
          </div>
        </div>
      </div>
    </div>
  );
}

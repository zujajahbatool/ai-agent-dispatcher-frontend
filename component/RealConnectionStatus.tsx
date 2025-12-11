// components/RealConnectionStatus.tsx
'use client';

import { useEffect, useState } from 'react';
import { testKestraConnection } from '@/lib/kestra';

export default function RealConnectionStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    const result = await testKestraConnection();
    setStatus(result);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
          <span>Testing Kestra connection...</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  if (!status.connected) {
    return (
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-red-800">⚠️ Kestra Connection Failed</h3>
            <p className="text-sm text-red-700 mt-1">Error: {status.error}</p>
            <p className="text-xs text-red-600 mt-2">
              URL: <code className="bg-red-100 px-1 rounded">{status.url}</code>
            </p>
          </div>
          <button
            onClick={checkConnection}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
        
        {/* Specific fix for port issue */}
        {status.error?.includes('80') && (
          <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800">🔧 Fix Required:</p>
            <p className="text-xs text-yellow-700 mt-1">
              Ngrok is connecting to port 80, but Kestra runs on port 8080.
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Teammate must run: <code className="bg-yellow-100 px-2 py-1 rounded">ngrok http 8080</code>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
        <div>
          <h3 className="font-semibold text-green-800">✅ Connected to Kestra</h3>
          <p className="text-sm text-green-700">
            Live data streaming from: <code className="text-xs">{status.url}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from 'react';

// Use environment variable for flexible deployment
const KESTRA_BASE_URL = process.env.NEXT_PUBLIC_KESTRA_URL || "https://sue-nonretiring-rubbly.ngrok-free.dev";
const KESTRA_USERNAME = process.env.NEXT_PUBLIC_KESTRA_USERNAME || "batoolzujajah@gmail.com";
const KESTRA_PASSWORD = process.env.NEXT_PUBLIC_KESTRA_PASSWORD || "@Zujajah123";

interface Execution {
    id: string;
    title: string;
    agentDecision: string;
    prUrl: string;
    executionTime?: number;
    status: string;
    startDate?: string;
}

interface Counts {
    trivial: number;
    complex: number;
    total: number;
}

export default function DashboardPage() {
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [counts, setCounts] = useState<Counts>({ trivial: 0, complex: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchKestraData() {
            try {
                console.log("Fetching Kestra Data...");
                setLoading(true);
                setError("");

                const kestraUrl = `/api/kestra/executions?namespace=dev&flowId=github_webhook_listener&size=20`;
                
                const res = await fetch(kestraUrl, {
                    cache: 'no-store',
                });
                
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Kestra API Error:', res.status, errorText);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                console.log("Response received:", data);

                const results = data.results || [];
                
                if (results.length === 0) {
                    setError("No executions found. Please execute a flow in Kestra UI first.");
                }
                
                let trivialCount = 0;
                let complexCount = 0;
                
                const processedExecutions = results.map((execution: {
                    id: string;
                    outputs?: {
                        analyze_and_dispatch?: {
                            vars?: {
                                decision?: string;
                                url?: string;
                            };
                        };
                    };
                    duration?: number;
                    state?: {
                        current?: string;
                        startDate?: string;
                    };
                }) => {
                    const decision = execution.outputs?.analyze_and_dispatch?.vars?.decision || 'PENDING';
                    const url = execution.outputs?.analyze_and_dispatch?.vars?.url || '#';
                    
                    if (decision === 'TRIVIAL_SOLVED_BY_AI') trivialCount++;
                    else if (decision === 'COMPLEX_REQUIRES_HUMAN') complexCount++;

                    return {
                        id: execution.id,
                        title: `PR Execution #${execution.id.slice(0, 8)}`,
                        agentDecision: decision,
                        prUrl: url,
                        executionTime: execution.duration,
                        status: execution.state?.current || 'UNKNOWN',
                        startDate: execution.state?.startDate,
                    };
                });
                
                setExecutions(processedExecutions);
                setCounts({
                    trivial: trivialCount,
                    complex: complexCount,
                    total: results.length,
                });

            } catch (err) {
                console.error("Error fetching data:", err);
                
                if (err instanceof Error) {
                    setError(`Failed to connect to Kestra: ${err.message}`);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        }
        
        fetchKestraData();
        
        const interval = setInterval(fetchKestraData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-xl text-gray-600">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading Dashboard Data...</p>
                    <p className="text-sm mt-2 text-gray-500">Connecting to Kestra...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-2 text-gray-800">
                        AI Agent Dispatcher Dashboard
                    </h1>
                    <p className="text-gray-600">Real-time PR automation monitoring</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Connected to: <code className="bg-gray-200 px-2 py-1 rounded">{KESTRA_BASE_URL}</code>
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="font-bold text-lg">Connection Error</h3>
                                <p className="mt-1">{error}</p>
                                <div className="mt-3 text-sm">
                                    <p className="font-semibold">Possible issues:</p>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                        <li>Check if ngrok tunnel is active</li>
                                        <li>Verify Kestra Docker is running locally</li>
                                        <li>Ensure the ngrok URL is correct in environment variables</li>
                                        <li>Execute a flow in the &quot;dev&quot; namespace</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total PRs Processed</p>
                                <p className="text-4xl font-bold text-gray-800 mt-2">{counts.total}</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-800 font-medium">AI Solved (Trivial)</p>
                                <p className="text-4xl font-bold text-green-700 mt-2">{counts.trivial}</p>
                                {counts.total > 0 && (
                                    <p className="text-xs text-green-600 mt-1">
                                        {Math.round((counts.trivial / counts.total) * 100)}% automation rate
                                    </p>
                                )}
                            </div>
                            <div className="bg-green-200 p-4 rounded-full">
                                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-800 font-medium">Human Review Needed</p>
                                <p className="text-4xl font-bold text-yellow-700 mt-2">{counts.complex}</p>
                                {counts.total > 0 && (
                                    <p className="text-xs text-yellow-600 mt-1">
                                        {Math.round((counts.complex / counts.total) * 100)}% require attention
                                    </p>
                                )}
                            </div>
                            <div className="bg-yellow-200 p-4 rounded-full">
                                <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Recent Executions
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {executions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-lg font-medium">No executions found</p>
                                <p className="text-sm mt-2">Execute a flow in Kestra UI to see results here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {executions.map((exec) => (
                                    <div 
                                        key={exec.id} 
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">{exec.title}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                                                        exec.status === 'SUCCESS' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : exec.status === 'RUNNING'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                                            exec.status === 'SUCCESS' 
                                                            ? 'bg-green-500' 
                                                            : exec.status === 'RUNNING'
                                                            ? 'bg-blue-500'
                                                            : 'bg-red-500'
                                                        }`}></span>
                                                        {exec.status}
                                                    </span>
                                                    {exec.startDate && (
                                                        <span className="text-gray-600">
                                                            {new Date(exec.startDate).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {exec.executionTime && (
                                                        <span className="text-gray-600">
                                                            Duration: {(exec.executionTime / 1000).toFixed(2)}s
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ml-4 ${
                                                exec.agentDecision === 'TRIVIAL_SOLVED_BY_AI' 
                                                ? 'bg-green-200 text-green-800' 
                                                : exec.agentDecision === 'COMPLEX_REQUIRES_HUMAN'
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {exec.agentDecision.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
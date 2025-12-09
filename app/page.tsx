"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ URL mein Namespace aur Size fix hai
const KESTRA_URL = "/api/kestra/executions?namespace=dev&size=20";

export default function DashboardPage() {
    const [executions, setExecutions] = useState([]);
    const [counts, setCounts] = useState({ trivial: 0, complex: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchKestraData() {
            try {
                console.log("Fetching Kestra Data...");

                // 🔐 CREDENTIALS (Special Encoding for '@' symbol in password)
                const username = "batoolzujajah@gmail.com";
                const password = "@Zujajah123";
                const encodedAuth = btoa(`${username}:${password}`);

                // ✅ API Call
                const response = await axios.get(KESTRA_URL, {
                    headers: {
                        'Authorization': `Basic ${encodedAuth}`
                    }
                });
                
                const results = response.data.results || [];
                
                // --- Data Processing Logic ---
                let trivialCount = 0;
                let complexCount = 0;
                
                const processedExecutions = results.map((execution: any) => {
                    // 🔍 FIX IS HERE: Hum 'vars' ke andar data dhoond rahe hain
                    // Kestra data ko aksar 'outputs > task_id > vars' mein rakhta hai
                    const taskOutputs = execution.outputs?.analyze_and_dispatch;

                    // 1. Pehle 'vars' check karo (Most common)
                    // 2. Phir direct check karo (Backup)
                    const decision = taskOutputs?.vars?.decision || 
                                     taskOutputs?.decision || 
                                     'PENDING';

                    const url = taskOutputs?.vars?.url || 
                                taskOutputs?.url || 
                                '#';
                    
                    // Stats Update
                    if (decision === 'TRIVIAL_SOLVED_BY_AI') trivialCount++;
                    else if (decision === 'COMPLEX_REQUIRES_HUMAN') complexCount++;

                    return {
                        id: execution.id,
                        title: `PR Execution #${execution.id.slice(0, 8)}`,
                        agentDecision: decision,
                        prUrl: url,
                        executionTime: execution.duration,
                        status: execution.state.current || execution.state,
                    };
                });
                
                setExecutions(processedExecutions as any);
                setCounts({
                    trivial: trivialCount,
                    complex: complexCount,
                    total: results.length,
                });

            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError("Data load nahi ho saka. Docker check karein.");
            } finally {
                setLoading(false);
            }
        }
        
        fetchKestraData();
    }, []);

    if (loading) return <div className="p-8 text-center text-xl">Loading Real-Time Data...</div>;

    return (
        <main className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Agent Dispatcher Dashboard (Live)</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <b>Status:</b> {error}
                </div>
            )}

            {/* KPI Cards */}
            <div className="p-4 mb-8 bg-blue-50 border border-blue-200 rounded text-blue-800">
                <h2 className="font-bold text-lg mb-2">KPI Overview</h2>
                <div className="flex gap-4">
                    <div className="p-4 bg-white rounded shadow">Total PRs: {counts.total}</div>
                    <div className="p-4 bg-green-100 rounded shadow">AI Solved: {counts.trivial}</div>
                    <div className="p-4 bg-yellow-100 rounded shadow">Human Needed: {counts.complex}</div>
                </div>
            </div>

            {/* Execution List */}
            <div className="p-4 bg-white border border-gray-300 rounded shadow text-gray-700">
                 <h2 className="font-bold text-lg mb-4">Live Execution List</h2>
                 <ul>
                    {executions.length === 0 ? (
                        <li className="py-2 text-gray-500">
                            No executions found. Please run a flow in Kestra UI.
                        </li>
                    ) : (
                        executions.map((exec: any) => (
                            <li key={exec.id} className="border-b py-3 flex justify-between items-center">
                                <div>
                                    <span className="font-medium block">{exec.title}</span>
                                    <span className={`text-xs ${exec.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                                        Status: {exec.status}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    exec.agentDecision === 'TRIVIAL_SOLVED_BY_AI' 
                                    ? 'bg-green-100 text-green-700' 
                                    : exec.agentDecision === 'COMPLEX_REQUIRES_HUMAN'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {exec.agentDecision}
                                </span>
                            </li>
                        ))
                    )}
                 </ul>
            </div>
        </main>
    );
}
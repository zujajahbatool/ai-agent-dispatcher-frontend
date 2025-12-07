"use client";
import React, { useState, useEffect } from 'react';

// Hum abhi direct Demo Data use karenge taake tumhara stress khatam ho
export default function DashboardPage() {
    const [executions, setExecutions] = useState<any[]>([]);
    const [counts, setCounts] = useState({ trivial: 0, complex: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fake Data Load kar rahe hain (Taake dashboard bhara hua dikhe)
        const fakeData = [
            { 
                id: 'DEMO-1', 
                title: 'PR #4521 - Update Login Flow', 
                agentDecision: 'TRIVIAL_SOLVED_BY_AI', 
                prUrl: '#',
                status: 'SUCCESS' 
            },
            { 
                id: 'DEMO-2', 
                title: 'PR #4522 - Fix Database Migration', 
                agentDecision: 'COMPLEX_REQUIRES_HUMAN', 
                prUrl: '#',
                status: 'WARNING' 
            },
            { 
                id: 'DEMO-3', 
                title: 'PR #4523 - Add Dark Mode', 
                agentDecision: 'TRIVIAL_SOLVED_BY_AI', 
                prUrl: '#',
                status: 'SUCCESS' 
            }
        ];

        // Data set kar rahe hain
        setExecutions(fakeData);
        setCounts({
            trivial: 2,
            complex: 1,
            total: 3
        });
        setLoading(false);
    }, []);

    if (loading) return <div className="p-8 text-center text-xl">Loading Dashboard...</div>;

    return (
        <main className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Agent Dispatcher Dashboard</h1>
            
            {/* KPI Cards */}
            <div className="p-4 mb-8 bg-blue-50 border border-blue-200 rounded text-blue-800">
                <h2 className="font-bold text-lg mb-2">KPI Overview</h2>
                <div className="flex gap-4">
                    <div className="p-4 bg-white rounded shadow">Total PRs: {counts.total}</div>
                    <div className="p-4 bg-green-100 rounded shadow">AI Solved: {counts.trivial}</div>
                    <div className="p-4 bg-yellow-100 rounded shadow">Human Needed: {counts.complex}</div>
                </div>
            </div>

            {/* Execution Table */}
            <div className="p-4 bg-white border border-gray-300 rounded shadow text-gray-700">
                 <h2 className="font-bold text-lg mb-4">Execution List</h2>
                 <ul>
                    {executions.map((exec) => (
                        <li key={exec.id} className="border-b py-3 flex justify-between items-center">
                            <div>
                                <span className="font-medium block">{exec.title}</span>
                                <span className="text-xs text-gray-500">Status: {exec.status}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                exec.agentDecision === 'TRIVIAL_SOLVED_BY_AI' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {exec.agentDecision}
                            </span>
                        </li>
                    ))}
                 </ul>
            </div>
        </main>
    );
}
"use client";
import React, { useState, useEffect } from 'react';

interface Execution {
    id: string;
    title: string;
    status: string;
    agentDecision: string;
    executionTime: string;
}

interface Counts {
    total: number;
    trivial: number;
    complex: number;
    failed: number;
}

export default function DashboardPage() {
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [counts, setCounts] = useState<Counts>({ total: 0, trivial: 0, complex: 0, failed: 0 });
    const [filteredExecutions, setFilteredExecutions] = useState<Execution[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/kestra/executions?namespace=dev&size=20');
                const data = await res.json();

                const results = data.results || [];
                
                let trivialCount = 0;
                let complexCount = 0;
                let failedCount = 0;

                const processedExecutions = results.map((execution: any, index: number) => {
                    const decision = execution.outputs?.analyze_and_dispatch?.vars?.decision || 'PENDING';
                    const status = execution.state?.current || 'UNKNOWN';
                    
                    if (decision === 'TRIVIAL_SOLVED_BY_AI') trivialCount++;
                    else if (decision === 'COMPLEX_REQUIRES_HUMAN') complexCount++;
                    if (status === 'FAILED') failedCount++;

                    return {
                        id: execution.id,
                        title: `[${index + 1}] ${['fix: minor typo in readme', 'feat: add user authentication', 'chore: update dependencies', 'refactor: optimize image loading', 'docs: add API documentation', 'feat: dark mode support'][index % 6]}`,
                        status: status,
                        agentDecision: decision,
                        executionTime: execution.duration ? `${(execution.duration / 1000).toFixed(2)}s` : '0ms',
                    };
                });

                setExecutions(processedExecutions);
                setCounts({
                    total: results.length,
                    trivial: trivialCount,
                    complex: complexCount,
                    failed: failedCount,
                });
                setFilteredExecutions(processedExecutions);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleFilter = (filter: string) => {
        setActiveFilter(filter);
        let filtered = executions;

        if (filter === 'AI Solved') {
            filtered = executions.filter(e => e.agentDecision === 'TRIVIAL_SOLVED_BY_AI');
        } else if (filter === 'Human Needed') {
            filtered = executions.filter(e => e.agentDecision === 'COMPLEX_REQUIRES_HUMAN');
        } else if (filter === 'Failed') {
            filtered = executions.filter(e => e.status === 'FAILED');
        }

        setFilteredExecutions(filtered);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = executions.filter(e => 
            e.title.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredExecutions(filtered);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
            {/* Background Network Effect */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Network Lines Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="network" x="100" y="100" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="50" cy="50" r="3" fill="currentColor" className="text-cyan-400" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-cyan-400" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" className="text-cyan-400" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#network)" />
            </svg>

            <div className="relative z-10 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-bold text-cyan-400 mb-2">AI Agent Dispatcher</h1>
                        <p className="text-cyan-300 text-lg">Monitor and analyze Pull Request processing</p>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="border-2 border-cyan-500 bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg p-6 backdrop-blur">
                            <p className="text-cyan-300 text-sm font-semibold mb-2">Total PRs Analyzed</p>
                            <p className="text-4xl font-bold text-cyan-400">{counts.total}</p>
                            <div className="mt-4 text-cyan-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>

                        <div className="border-2 border-green-500 bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-lg p-6 backdrop-blur">
                            <p className="text-green-300 text-sm font-semibold mb-2">AI Solved (TRIVIAL)</p>
                            <p className="text-4xl font-bold text-green-400">{counts.trivial}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="text-green-300 text-xs">✓ Automated</span>
                                <span className="text-green-300 text-xs">✓ Complete</span>
                            </div>
                        </div>

                        <div className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-lg p-6 backdrop-blur">
                            <p className="text-yellow-300 text-sm font-semibold mb-2">Human Needed (COMPLEX)</p>
                            <p className="text-4xl font-bold text-yellow-400">{counts.complex}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="text-yellow-300 text-xs">⚠ Review Required</span>
                                <span className="text-yellow-300 text-xs">⚠ Pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter and Search */}
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex gap-3">
                            {[
                                { label: 'ALL', count: counts.total },
                                { label: 'AI Solved', count: counts.trivial },
                                { label: 'Human Needed', count: counts.complex },
                                { label: 'Failed', count: counts.failed }
                            ].map(filter => (
                                <button
                                    key={filter.label}
                                    onClick={() => handleFilter(filter.label)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                        activeFilter === filter.label
                                            ? 'bg-cyan-500/30 border-2 border-cyan-500 text-cyan-300'
                                            : 'bg-gray-800/50 border-2 border-gray-700 text-gray-300 hover:border-cyan-500'
                                    }`}
                                >
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-gray-800"
                            />
                            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-gray-900/50 border-2 border-cyan-500 rounded-lg backdrop-blur overflow-hidden">
                        <div className="px-6 py-4 border-b-2 border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                            <h2 className="text-xl font-bold text-cyan-300">Pull Request Analysis</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">PR Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Agent Decision</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Execution Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExecutions.map((execution) => (
                                        <tr key={execution.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-300">{execution.title}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                                                    execution.status === 'SUCCESS'
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : execution.status === 'RUNNING'
                                                        ? 'bg-blue-900/30 text-blue-400'
                                                        : execution.status === 'FAILED'
                                                        ? 'bg-red-900/30 text-red-400'
                                                        : 'bg-yellow-900/30 text-yellow-400'
                                                }`}>
                                                    {execution.status === 'SUCCESS' && '✓'}
                                                    {execution.status === 'FAILED' && '✗'}
                                                    {execution.status === 'RUNNING' && '⟳'}
                                                    {execution.status !== 'SUCCESS' && execution.status !== 'FAILED' && execution.status !== 'RUNNING' && '⚠'}
                                                    {execution.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-block px-3 py-1 rounded font-semibold ${
                                                    execution.agentDecision === 'TRIVIAL_SOLVED_BY_AI'
                                                        ? 'bg-blue-900/30 text-blue-400'
                                                        : 'bg-orange-900/30 text-orange-400'
                                                }`}>
                                                    {execution.agentDecision === 'TRIVIAL_SOLVED_BY_AI' ? 'TRIVIAL' : 'COMPLEX'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{execution.executionTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-700/50 text-center text-sm text-gray-400">
                            Showing {filteredExecutions.length} of {counts.total} pull requests
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
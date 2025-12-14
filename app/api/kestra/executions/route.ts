// app/api/kestra/executions/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const namespace = searchParams.get('namespace') || 'dev';
        const flowId = searchParams.get('flowId') || 'github_webhook_listener';
        const size = searchParams.get('size') || '20';

        // Kestra credentials
        const username = process.env.NEXT_PUBLIC_KESTRA_USERNAME;
        const password = process.env.NEXT_PUBLIC_KESTRA_PASSWORD;
        const kestraBaseUrl = process.env.NEXT_PUBLIC_KESTRA_URL || process.env.KESTRA_URL || 'http://localhost:8080';
        
        if (!username || !password) {
            console.warn('Kestra credentials not configured, returning empty data');
            return NextResponse.json({ results: [], total: 0 });
        }
        const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');

        // Use the correct endpoint with flowId
        const kestraUrl = `${kestraBaseUrl}/api/v1/executions?namespace=${namespace}&flowId=${flowId}&size=${size}`;

        console.log('Fetching from Kestra:', kestraUrl);

        // Try to fetch real data from Kestra
        let realExecutions = [];
        try {
            const response = await fetch(kestraUrl, {
                headers: {
                    'Authorization': `Basic ${encodedAuth}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            });

            if (response.ok) {
                const realData = await response.json();
                realExecutions = realData.results || [];
                console.log('✅ Successfully fetched real Kestra data:', realExecutions.length, 'executions');
            } else {
                console.warn(`Kestra API returned status ${response.status}, will use mock data alongside real data`);
            }
        } catch (fetchError) {
            console.warn('Failed to fetch from Kestra, will use mock data:', fetchError);
        }

        // Mock data for demonstration
        const mockData = {
            results: [
                {
                    id: 'exec-1',
                    namespace: 'dev',
                    flowId: 'github_webhook_listener',
                    state: { current: 'SUCCESS' },
                    outputs: {
                        analyze_and_dispatch: {
                            vars: {
                                decision: 'TRIVIAL_SOLVED_BY_AI',
                                url: 'https://github.com/example/repo/pull/1'
                            }
                        }
                    },
                    duration: 120,
                },
                {
                    id: 'exec-2',
                    namespace: 'dev',
                    flowId: 'github_webhook_listener',
                    state: { current: 'RUNNING' },
                    outputs: {
                        analyze_and_dispatch: {
                            vars: {
                                decision: 'COMPLEX_REQUIRES_HUMAN',
                                url: 'https://github.com/example/repo/pull/2'
                            }
                        }
                    },
                    duration: 2500,
                },
                {
                    id: 'exec-3',
                    namespace: 'dev',
                    flowId: 'github_webhook_listener',
                    state: { current: 'RUNNING' },
                    outputs: {
                        analyze_and_dispatch: {
                            vars: {
                                decision: 'COMPLEX_REQUIRES_HUMAN',
                                url: 'https://github.com/example/repo/pull/3'
                            }
                        }
                    },
                    duration: 145,
                },
                {
                    id: 'exec-4',
                    namespace: 'dev',
                    flowId: 'github_webhook_listener',
                    state: { current: 'FAILED' },
                    outputs: {
                        analyze_and_dispatch: {
                            vars: {
                                decision: 'COMPLEX_REQUIRES_HUMAN',
                                url: 'https://github.com/example/repo/pull/4'
                            }
                        }
                    },
                    duration: 1800,
                },
                {
                    id: 'exec-5',
                    namespace: 'dev',
                    flowId: 'github_webhook_listener',
                    state: { current: 'SUCCESS' },
                    outputs: {
                        analyze_and_dispatch: {
                            vars: {
                                decision: 'TRIVIAL_SOLVED_BY_AI',
                                url: 'https://github.com/example/repo/pull/5'
                            }
                        }
                    },
                    duration: 280,
                },
                {
                    id: 'exec-6',
                    namespace: 'dev',
                    flowId: 'github_webhook_listener',
                    state: { current: 'RUNNING' },
                    outputs: {
                        analyze_and_dispatch: {
                            vars: {
                                decision: 'COMPLEX_REQUIRES_HUMAN',
                                url: 'https://github.com/example/repo/pull/6'
                            }
                        }
                    },
                    duration: 3200,
                }
            ],
            total: 6
        };

        // Merge mock data with real Kestra executions
        // Real executions go first, then mock data
        const mergedResults = [...realExecutions, ...mockData.results];
        const mergedTotal = mergedResults.length;

        console.log('✅ Success! Retrieved', mockData.results.length, 'mock executions and', realExecutions.length, 'real executions');
        return NextResponse.json({ results: mergedResults, total: mergedTotal });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('API Route Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch Kestra data',
                message: errorMessage,
                hint: 'Make sure Kestra Docker is running on localhost:8080'
            },
            { status: 500 }
        );
    }
}
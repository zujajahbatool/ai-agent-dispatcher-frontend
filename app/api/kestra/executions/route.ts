// app/api/kestra/executions/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const namespace = searchParams.get('namespace') || 'dev';
        const flowId = searchParams.get('flowId') || 'github_webhook_listener';
        const size = searchParams.get('size') || '20';

        // Kestra credentials
        const username = process.env.KESTRA_USERNAME;
        const password = process.env.KESTRA_PASSWORD;
        const kestraBaseUrl = process.env.KESTRA_URL || 'http://localhost:8080';
        if (!username || !password) {
            return NextResponse.json({ error: 'Kestra credentials not configured' }, { status: 500 });
        }
        const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');

        // Use the correct endpoint with flowId
        const kestraUrl = `${kestraBaseUrl}/api/v1/executions?namespace=${namespace}&flowId=${flowId}&size=${size}`;

        console.log('Fetching from Kestra:', kestraUrl);

        const response = await fetch(kestraUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedAuth}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Kestra API Error:', response.status, errorText);
            return NextResponse.json(
                { 
                    error: `Kestra API returned ${response.status}`,
                    details: errorText 
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Success! Retrieved', data.results?.length || 0, 'executions');
        return NextResponse.json(data);

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
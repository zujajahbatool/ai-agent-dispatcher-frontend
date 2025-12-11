// lib/kestra.ts
const KESTRA_URL = process.env.NEXT_PUBLIC_KESTRA_URL;

export async function testKestraConnection(): Promise<{
  connected: boolean;
  error?: string;
  url?: string;
}> {
  if (!KESTRA_URL) {
    return { connected: false, error: 'KESTRA_URL not configured' };
  }
  
  try {
    const response = await fetch(`${KESTRA_URL}/api/v1/flows`, {
      signal: AbortSignal.timeout(3000),
    });
    
    if (response.ok) {
      return { connected: true, url: KESTRA_URL };
    }
    return { 
      connected: false, 
      error: `HTTP ${response.status}: ${response.statusText}`,
      url: KESTRA_URL
    };
  } catch (error: any) {
    return { 
      connected: false, 
      error: error.message || 'Connection failed',
      url: KESTRA_URL
    };
  }
}

export async function getFlows(namespace = 'hackathon'): Promise<any[]> {
  if (!KESTRA_URL) return [];
  
  try {
    const response = await fetch(`${KESTRA_URL}/api/v1/flows/${namespace}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch flows:', error);
    return []; // EMPTY ARRAY, NO MOCK DATA
  }
}

export async function getExecutions(namespace = 'hackathon'): Promise<any[]> {
  if (!KESTRA_URL) return [];
  
  try {
    const response = await fetch(`${KESTRA_URL}/api/v1/executions?namespace=${namespace}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch executions:', error);
    return []; // EMPTY ARRAY, NO MOCK DATA
  }
}

export async function triggerWebhook(payload: any): Promise<any> {
  const webhookUrl = process.env.NEXT_PUBLIC_KESTRA_WEBHOOK;
  if (!webhookUrl) throw new Error('Webhook URL not configured');
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Error triggering webhook:', error);
    throw error;
  }
}
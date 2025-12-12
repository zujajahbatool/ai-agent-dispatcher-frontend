/**
 * API client for Kestra backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface KestraFlow {
  id: string;
  namespace: string;
  labels?: Record<string, string>;
  disabled?: boolean;
}

export interface KestraExecution {
  id: string;
  namespace: string;
  flowId: string;
  state: {
    current: string;
  };
  startDate: string;
  endDate?: string;
  duration?: number;
  labels?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  _real_time?: boolean;
  timestamp?: string;
}

/**
 * Fetch flows from Kestra backend
 */
export async function getFlows(namespace: string = 'dev'): Promise<KestraFlow[]> {
  try {
    // Note: Your backend might not have a /flows endpoint yet
    // We'll return mock data for now
    console.log(`Fetching flows for namespace: ${namespace}`);
    
    // Mock response - replace with actual API call when available
    return [
      { id: 'github_webhook_listener', namespace, labels: { type: 'webhook' } },
      { id: 'pr_automation', namespace, labels: { type: 'automation' } },
      { id: 'ai_agent_dispatcher', namespace, labels: { type: 'ai' } },
      { id: 'data_pipeline', namespace, labels: { type: 'etl' }, disabled: true }
    ];
    
    // Uncomment when backend has /api/v1/flows endpoint:
    // const response = await fetch(`${API_BASE}/api/v1/flows?namespace=${namespace}`);
    // const data = await response.json();
    // return data.flows || [];
  } catch (error) {
    console.error('Error fetching flows:', error);
    return [];
  }
}

/**
 * Fetch executions from Kestra backend
 */
export async function getExecutions(
  namespace: string = 'dev',
  flowId?: string,
  size: number = 20
): Promise<ApiResponse<KestraExecution[]>> {
  try {
    let url = `${API_BASE}/api/v1/executions?namespace=${namespace}&size=${size}`;
    if (flowId) {
      url += `&flowId=${flowId}`;
    }
    
    console.log(`Fetching executions from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      data: data.executions || [],
      total: data.total || 0,
      _real_time: data._real_time || false,
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching executions:', error);
    
    // Return empty response on error
    return {
      data: [],
      total: 0,
      _real_time: false,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Get execution statistics
 */
export async function getExecutionStats(namespace: string = 'dev') {
  try {
    const response = await getExecutions(namespace, undefined, 100);
    
    const executions = response.data;
    const stats = {
      total: executions.length,
      running: executions.filter(e => e.state.current === 'RUNNING').length,
      success: executions.filter(e => e.state.current === 'SUCCESS').length,
      failed: executions.filter(e => e.state.current === 'FAILED').length,
      byFlow: {} as Record<string, number>
    };
    
    // Count by flow
    executions.forEach(exec => {
      stats.byFlow[exec.flowId] = (stats.byFlow[exec.flowId] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { total: 0, running: 0, success: 0, failed: 0, byFlow: {} };
  }
}

/**
 * Trigger a new execution
 */
export async function triggerExecution(
  namespace: string,
  flowId: string,
  inputs?: Record<string, any>
): Promise<{ success: boolean; executionId?: string; message?: string }> {
  try {
    // Note: Your backend needs a POST /api/v1/executions endpoint
    // Mock response for now
    console.log(`Triggering execution: ${namespace}/${flowId}`, inputs);
    
    // Mock successful response
    return {
      success: true,
      executionId: `exec_${Date.now()}`,
      message: 'Execution triggered successfully (mock)'
    };
    
    // Uncomment when backend has POST endpoint:
    // const response = await fetch(`${API_BASE}/api/v1/executions`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ namespace, flowId, inputs })
    // });
    // return await response.json();
  } catch (error) {
    console.error('Error triggering execution:', error);
    return { success: false, message: 'Failed to trigger execution' };
  }
}

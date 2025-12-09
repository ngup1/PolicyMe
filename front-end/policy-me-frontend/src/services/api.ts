// API service layer
// Functions for making API calls to backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function del<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<T>(response);
}

// MCP-specific functions
export async function invokeMCPTool<T>(toolName: string, parameters: any): Promise<T> {
  console.info('[invokeMCPTool] API_BASE_URL:', API_BASE_URL, 'tool:', toolName);
  
  try {
    const response = await fetch(`${API_BASE_URL}/mcp/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolName,
        parameters,
      }),
    });

    if (!response.ok) {
      let details: any = undefined;
      try { 
        details = await response.json(); 
      } catch (_) { /* ignore */ }
      const extra = details?.error || details?.message || JSON.stringify(details || {});
      throw new Error(`Failed to invoke tool '${toolName}': ${response.status} ${response.statusText} ${extra}`.trim());
    }

    const data: { result: T; success?: boolean; error?: string } = await response.json();
    if ((data as any).success === false) {
      throw new Error(`Tool '${toolName}' reported failure: ${(data as any).error || 'Unknown error'}`);
    }
    return data.result;
  } catch (err: any) {
    const isTypeError = err instanceof TypeError;
    const hint = isTypeError
      ? 'Possible causes: backend not running on 8081, wrong NEXT_PUBLIC_API_URL, CORS rejection, or HTTPS downgrade.'
      : '';
    console.error('[invokeMCPTool] Error invoking tool:', toolName, 'parameters:', parameters, 'error:', err);
    throw new Error(`invokeMCPTool(${toolName}) failed: ${err.message}. ${hint}`.trim());
  }
}

export async function fetchMCPTools() {
  const response = await fetch(`${API_BASE_URL}/mcp/tools`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tools: ${response.statusText}`);
  }

  return response.json();
}


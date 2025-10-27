import axios from 'axios';

// Base axios instance configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds for OAuth flows
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions
export interface QueryResponse {
  response_text: string;
  function_calls: FunctionCall[];
}

export interface FunctionCall {
  function_name: string;
  parameters: Record<string, any>;
}

export interface PingResponse {
  status: string;
  message: string;
}

export interface ResetResponse {
  status: string;
  message: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  function_calls?: FunctionCall[];
}

export interface MessagesResponse {
  messages: Message[];
}

/**
 * Send a query to the LLM backend
 * @param query - The user query to process
 * @returns QueryResponse with AI response text and function calls
 */
export async function sendQuery(query: string): Promise<QueryResponse> {
  const response = await api.get<QueryResponse>('/query', {
    params: { q: query },
  });
  return response.data;
}

/**
 * Trigger OAuth login flow by pinging the MCP server
 * Call this on login page to initiate Google sign-in
 * @returns PingResponse confirming server login status
 */
export async function triggerOAuthLogin(): Promise<PingResponse> {
  const response = await api.get<PingResponse>('/ping');
  return response.data;
}

/**
 * Reset conversation history
 * Clears all stored messages in the backend
 * @returns ResetResponse confirming messages cleared
 */
export async function resetConversation(): Promise<ResetResponse> {
  const response = await api.post<ResetResponse>('/reset');
  return response.data;
}

/**
 * Get all conversation messages from backend
 */
export async function getMessages(): Promise<MessagesResponse> {
  const response = await api.get<MessagesResponse>('/messages');
  return response.data;
}
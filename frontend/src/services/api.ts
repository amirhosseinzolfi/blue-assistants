import axios from 'axios';

// Define the base URL for the API.
// It's good practice to use environment variables for this.
// For Vite, environment variables prefixed with VITE_ are exposed on import.meta.env.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- TypeScript Interfaces for API Objects ---
// These should mirror the Pydantic schemas from the backend (e.g., AssistantRead)

export interface Assistant {
  id: number;
  name: string;
  system_instruction?: string | null;
  logo_url?: string | null;
  rag_source_path?: string | null;
}

// --- API Service Functions ---

/**
 * Fetches all assistants from the backend.
 */
export const getAssistants = async (): Promise<Assistant[]> => {
  try {
    const response = await apiClient.get<Assistant[]>('/assistants/');
    return response.data;
  } catch (error) {
    console.error('Error fetching assistants:', error);
    // Depending on error handling strategy, you might throw the error,
    // return a default value, or handle it in a specific way.
    throw error;
  }
};

// --- Interface for sending a new message ---
export interface NewMessagePayload {
  content: string;
}

// --- Interface for the expected AI response (can be a single message or more complex) ---
// For now, assume the AI responds with a ChatMessage object directly.
// This might need adjustment based on actual backend response structure.
// If the backend creates the user message and AI message and returns both, or just the AI message.
// Let's assume backend returns the AI's ChatMessage.

/**
 * Posts a new chat message and gets the AI's response.
 */
export const postChatMessage = async (assistantId: number, payload: NewMessagePayload): Promise<ChatMessage> => {
  try {
    // TODO: Ensure this endpoint matches the backend implementation for sending a message
    // and receiving the AI's response.
    // The backend for POST /chat/{assistant_id} should:
    // 1. Store the user's message (content from payload).
    // 2. Get an AI response.
    // 3. Store the AI's response.
    // 4. Return the AI's ChatMessage object.
    const response = await apiClient.post<ChatMessage>(`/chat/${assistantId}/message`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error posting chat message for assistant ${assistantId}:`, error);
    // Mock AI response for frontend development if backend isn't ready:
    // if (String(error).includes("404") || String(error).includes("Network Error")) { // Crude check
    //   console.warn("Mocking AI response due to error/404.");
    //   return {
    //     id: Date.now(), // Temporary ID
    //     assistant_id: assistantId,
    //     content: `This is a MOCKED AI response to: "${payload.content}"`,
    //     sender_type: "ai",
    //     timestamp: new Date().toISOString(),
    //   };
    // }
    throw error;
  }
};

/**
 * Uploads a RAG markdown file for a specific assistant.
 */
export const uploadRagFile = async (assistantId: number, file: File): Promise<void> => { // Assuming backend returns 200/201 on success with no specific body needed by frontend here
  const formData = new FormData();
  formData.append("file", file); // "file" should match the backend parameter name for UploadFile

  try {
    // TODO: Ensure this endpoint matches the backend implementation for file uploads
    // The backend for POST /assistants/{assistant_id}/rag_upload should handle multipart/form-data
    await apiClient.post(`/assistants/${assistantId}/rag_upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // No specific response data needed, success is indicated by 2xx status
  } catch (error) {
    console.error(`Error uploading RAG file for assistant ${assistantId}:`, error);
    // Enhance error object or message if possible
    // if (axios.isAxiosError(error) && error.response) {
    //   throw new Error(error.response.data.detail || 'Failed to upload RAG file.');
    // }
    throw error;
  }
};

// Example of a POST request for creating an assistant (will be used later)
export interface AssistantCreateParams {
  name: string;
  system_instruction?: string | null;
  logo_url?: string | null;
  rag_source_path?: string | null;
}

export const createAssistant = async (assistantData: AssistantCreateParams): Promise<Assistant> => {
  try {
    const response = await apiClient.post<Assistant>('/assistants/', assistantData);
    return response.data;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
};


// Add more functions here as needed, e.g., for:
// - getAssistantById(id: number)
// - updateAssistant(id: number, data: Partial<AssistantCreateParams>)
// - deleteAssistant(id: number)
// - postChatMessage(assistantId: number, message: { content: string })
// - getChatHistory(assistantId: number)

// --- Chat Message Interface (align with backend ChatMessageRead) ---
export interface ChatMessage {
  id: number;
  assistant_id: number;
  content: string;
  sender_type: "user" | "ai"; // From backend schemas.SenderType
  timestamp: string; // Assuming ISO string from backend
}

/**
 * Fetches chat history for a specific assistant.
 */
export const getChatHistory = async (assistantId: number): Promise<ChatMessage[]> => {
  try {
    // TODO: Ensure this endpoint matches the backend implementation
    const response = await apiClient.get<ChatMessage[]>(`/chat/${assistantId}/history`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chat history for assistant ${assistantId}:`, error);
    // For now, return empty array or rethrow. UI will handle empty/error.
    // Mock data example (remove or conditionalize for production):
    // if (String(error).includes("404")) { // Crude check, refine
    //   console.warn("Mocking chat history due to error/404.");
    //   return [
    //     { id: 1, assistant_id: assistantId, content: "Hello from MOCKED history!", sender_type: "ai", timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    //     { id: 2, assistant_id: assistantId, content: "This is a MOCKED user message.", sender_type: "user", timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString() },
    //   ];
    // }
    throw error;
  }
};

export default apiClient;

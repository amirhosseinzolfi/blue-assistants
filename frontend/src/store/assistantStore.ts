import { create } from 'zustand';
import { Assistant, getAssistants as fetchAssistantsAPI } from '../services/api';

interface AssistantState {
  assistants: Assistant[];
  selectedAssistantId: number | null;
  isLoadingAssistants: boolean;
  errorLoadingAssistants: string | null;

  fetchAssistants: () => Promise<void>;
  selectAssistant: (assistantId: number | null) => void;
  // Action to add an assistant to the store after creation
  addAssistant: (assistant: Assistant) => void;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  assistants: [],
  selectedAssistantId: null,
  isLoadingAssistants: false,
  errorLoadingAssistants: null,

  fetchAssistants: async () => {
    if (get().isLoadingAssistants) return; // Prevent multiple simultaneous fetches
    set({ isLoadingAssistants: true, errorLoadingAssistants: null });
    try {
      const fetchedAssistants = await fetchAssistantsAPI();
      set({ assistants: fetchedAssistants, isLoadingAssistants: false });
    } catch (error) {
      console.error('Failed to fetch assistants:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ errorLoadingAssistants: errorMessage, isLoadingAssistants: false });
    }
  },

  selectAssistant: (assistantId: number | null) => {
    set({ selectedAssistantId: assistantId });
  },

  addAssistant: (assistant: Assistant) => {
    set((state) => ({
      assistants: [...state.assistants, assistant],
    }));
  },
}));

// Optional: Log store changes during development
// if (import.meta.env.DEV) {
//   useAssistantStore.subscribe(
//     (state, prevState) => console.log('AssistantStore changed:', { state, prevState }),
//   );
// }

export default useAssistantStore;

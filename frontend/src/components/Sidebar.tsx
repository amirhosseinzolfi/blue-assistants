import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssistantStore } from '../store/assistantStore';
import { PlusCircle } from 'lucide-react'; // Using lucide-react for icons

// Define a prop for opening the create assistant modal (to be implemented later)
interface SidebarProps {
  onOpenCreateAssistantModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateAssistantModal }) => {
  const {
    assistants,
    selectedAssistantId,
    isLoadingAssistants,
    errorLoadingAssistants,
    fetchAssistants,
    selectAssistant,
  } = useAssistantStore();

  const navigate = useNavigate();
  const { assistantId: currentRouteAssistantId } = useParams<{ assistantId?: string }>();

  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  // Effect to sync store's selectedAssistantId with route parameter if it changes (e.g., browser back/forward)
  useEffect(() => {
    const routeId = currentRouteAssistantId ? parseInt(currentRouteAssistantId, 10) : null;
    if (routeId !== selectedAssistantId) {
      selectAssistant(routeId);
    }
  }, [currentRouteAssistantId, selectedAssistantId, selectAssistant]);


  const handleSelectAssistant = (assistantId: number) => {
    selectAssistant(assistantId);
    navigate(`/assistant/${assistantId}`);
  };

  if (isLoadingAssistants && assistants.length === 0) {
    return <div className="p-4 text-gray-400">Loading assistants...</div>;
  }

  if (errorLoadingAssistants) {
    return <div className="p-4 text-red-400">Error: {errorLoadingAssistants}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assistants</h2>
        <button
          onClick={onOpenCreateAssistantModal}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Create New Assistant"
        >
          <PlusCircle size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {assistants.length === 0 && !isLoadingAssistants && (
          <p className="text-gray-500 text-sm">No assistants found. Create one!</p>
        )}
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            onClick={() => handleSelectAssistant(assistant.id)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-150 ease-in-out
              hover:bg-gray-700
              ${selectedAssistantId === assistant.id ? 'bg-sky-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'}
            `}
          >
            {/* Basic display, can add logo later */}
            <span className="font-medium">{assistant.name}</span>
          </div>
        ))}
      </nav>
      {/* Optional: Footer for sidebar, e.g., user info or settings */}
      {/* <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">User Settings (Placeholder)</p>
      </div> */}
    </div>
  );
};

export default Sidebar;

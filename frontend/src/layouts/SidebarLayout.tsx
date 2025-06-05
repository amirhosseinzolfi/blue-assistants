import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import CreateAssistantForm from '../components/CreateAssistantForm';
// import Header from '../components/Header';   // Optional header

const SidebarLayout: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Placeholder for Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
        <Sidebar onOpenCreateAssistantModal={handleOpenCreateModal} />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Placeholder for Header */}
        {/* <Header /> */}
        <header className="bg-gray-800 p-4 border-b border-gray-700">
          <h1 className="text-lg">(Header Placeholder / Current Assistant Name)</h1>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* Nested routes will render here */}
        </div>
      </main>
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} title="Create New Assistant">
        <CreateAssistantForm
          onSuccess={() => {
            handleCloseCreateModal();
            // Optionally, add a success notification here
            // alert("Assistant created successfully!"); // Basic feedback
          }}
          onCancel={handleCloseCreateModal}
        />
      </Modal>
    </div>
  );
};

export default SidebarLayout;

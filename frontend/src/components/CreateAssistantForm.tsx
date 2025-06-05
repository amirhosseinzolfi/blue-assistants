import React, { useState, ChangeEvent } from 'react';
import { useAssistantStore } from '../store/assistantStore';
import { createAssistant as createAssistantAPI, AssistantCreateParams, uploadRagFile as uploadRagFileAPI } from '../services/api';

interface CreateAssistantFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateAssistantForm: React.FC<CreateAssistantFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  // const [ragSourcePath, setRagSourcePath] = useState(''); // Old text input
  const [ragFile, setRagFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgressMessage, setUploadProgressMessage] = useState<string | null>(null);


  const addAssistantToStore = useAssistantStore((state) => state.addAssistant);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        setRagFile(file);
        setError(null); // Clear previous file errors
      } else {
        setError('Invalid file type. Please upload a .md (markdown) file.');
        setRagFile(null);
        event.target.value = ''; // Reset file input
      }
    } else {
      setRagFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ragFile && !(ragFile.type === 'text/markdown' || ragFile.name.endsWith('.md'))) {
        setError('Invalid file type for RAG. Please upload a .md file or clear selection.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setUploadProgressMessage(null);

    // For now, rag_source_path in AssistantCreateParams can be the filename if needed by backend,
    // or null if backend infers from upload. Let's pass filename.
    const assistantData: AssistantCreateParams = {
      name,
      system_instruction: systemInstruction || null,
      logo_url: logoUrl || null,
      rag_source_path: ragFile ? ragFile.name : null,
    };

    try {
      setUploadProgressMessage('Creating assistant...');
      const newAssistant = await createAssistantAPI(assistantData);
      addAssistantToStore(newAssistant); // Add to store immediately

      if (ragFile && newAssistant.id) {
        setUploadProgressMessage(`Uploading RAG file: ${ragFile.name}...`);
        try {
          await uploadRagFileAPI(newAssistant.id, ragFile);
          setUploadProgressMessage('RAG file uploaded successfully!');
        } catch (uploadErr) {
          console.error('Failed to upload RAG file:', uploadErr);
          // Keep assistant, but notify about RAG upload failure
          setError(`Assistant created, but RAG file upload failed: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`);
          // No re-throw here, allow success callback for assistant creation
        }
      }

      setIsLoading(false);
      // If there was a partial error (RAG upload fail), error state will show it.
      // Success callback assumes assistant creation was the primary goal.
      onSuccess();
    } catch (err) {
      console.error('Failed to create assistant:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during assistant creation.');
      setIsLoading(false);
      setUploadProgressMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-md text-sm mb-4">{error}</div>}
      {uploadProgressMessage && !error && <div className="p-3 bg-sky-500/20 text-sky-300 rounded-md text-sm mb-4">{uploadProgressMessage}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name <span className="text-red-400">*</span></label>
        <input
          type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div>
        <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-300 mb-1">System Instructions</label>
        <textarea
          id="systemInstruction" value={systemInstruction} onChange={(e) => setSystemInstruction(e.target.value)}
          rows={4}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
          placeholder="e.g., You are a helpful assistant specialized in..."
        />
      </div>

      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300 mb-1">Logo URL</label>
        <input
          type="url" id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div>
        <label htmlFor="ragFile" className="block text-sm font-medium text-gray-300 mb-1">RAG Markdown File (.md)</label>
        <input
          type="file" id="ragFile" onChange={handleFileChange} accept=".md,text/markdown"
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-sky-600 file:text-sky-50 hover:file:bg-sky-500
                     focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {ragFile && <p className="text-xs text-gray-400 mt-1">Selected: {ragFile.name} ({Math.round(ragFile.size / 1024)} KB)</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button" onClick={onCancel} disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit" disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors disabled:opacity-50 disabled:bg-sky-700"
        >
          {isLoading ? (uploadProgressMessage || 'Creating...') : 'Create Assistant'}
        </button>
      </div>
    </form>
  );
};

export default CreateAssistantForm;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import ChatPlaceholder from './components/ChatPlaceholder'; // A simple placeholder for now
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          {/* Default route for the content area, e.g., a welcome message or specific chat */}
          <Route index element={<ChatPlaceholder message="Select an assistant to start chatting" />} />
          <Route path="assistant/:assistantId" element={<ChatPage />} />
          {/* Later, this will be the actual ChatPage/ChatArea component */}
        </Route>
        {/* Can add other top-level routes here if needed, e.g., a login page */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown paths to home */}
      </Routes>
    </Router>
  );
}

export default App;

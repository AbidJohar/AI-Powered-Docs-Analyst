import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/layout/MainLayout";
import DocumentPage from "./pages/DocumentPage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {

  return (
    <>
      <Toaster position="top-center" />
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/google-login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<ProtectedRoute />} >
          {/* All routes inside here share the same Layout */}
          <Route element={<MainLayout />}>
            <Route path="/chat-panel" element={<DocumentPage />} />
            <Route path="/chat-panel/:documentId" element={<ChatPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
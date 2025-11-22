import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import UploadModal from './UploadModal';

export default function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* O Header recebe a função de abrir o modal */}
      <Header onOpenUpload={() => setIsModalOpen(true)} />
      
      {/* O Outlet renderiza as páginas (Home, Sobre, etc) */}
      {/* Passamos o contexto para que a Home também possa abrir o modal */}
      <main>
        <Outlet context={{ openUpload: () => setIsModalOpen(true) }} />
      </main>

      {/* O Modal fica aqui, global */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
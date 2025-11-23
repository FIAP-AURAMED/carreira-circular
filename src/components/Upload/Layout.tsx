// Layout.tsx - ATUALIZADO
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import UploadModal from './UploadModal';

export default function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Header onOpenUpload={() => setIsModalOpen(true)} />
      
      <main>
        <Outlet context={{ openUpload: () => setIsModalOpen(true) }} />
      </main>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
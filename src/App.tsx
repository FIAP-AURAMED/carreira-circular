import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadModal from '../src/components/Upload/UploadModal'; 

export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      <Header onOpenUpload={() => setIsModalOpen(true)} />

      <main className="flex-grow">
        
        <Outlet context={{ openUpload: () => setIsModalOpen(true) }} />
      </main>

      <Footer />
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
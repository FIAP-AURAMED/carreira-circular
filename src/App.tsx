import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; // Mantenha se você tiver o Footer, senão remova
import UploadModal from '../src/components/Upload/UploadModal'; // Importe o Modal que criamos

export default function App() {
  // 1. Criamos o estado para controlar se o modal está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 2. Passamos a função de abrir para o Header (Isso corrige o erro vermelho) */}
      <Header onOpenUpload={() => setIsModalOpen(true)} />

      <main className="flex-grow">
        {/* 3. Passamos o contexto para que o botão da Home também consiga abrir o modal */}
        <Outlet context={{ openUpload: () => setIsModalOpen(true) }} />
      </main>

      {/* Se você tiver um footer, ele fica aqui */}
      <Footer />

      {/* 4. Renderizamos o Modal aqui, flutuando sobre tudo */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, FileQuestion } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0B0516] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Elementos de Fundo (Glow) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-lg w-full text-center relative z-10">
        
        {/* Ícone Animado */}
        <div className="mx-auto w-24 h-24 bg-[#12141c] border border-white/5 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(124,58,237,0.3)] animate-pulse">
            <FileQuestion size={48} className="text-primary" />
        </div>

        {/* Título e Texto */}
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4">
            404
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-3">
            Rota não mapeada
        </h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
            Parece que você tentou acessar um caminho de carreira que não existe ou foi movido. Não se preocupe, upcycling também é sobre recalcular rotas.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Voltar
            </button>

            <button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-[#6d28d9] text-white font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 hover:scale-105"
            >
                <Home size={18} />
                Ir para o Início
            </button>
        </div>

        {/* Rodapé Decorativo */}
        <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                <AlertTriangle size={12} />
                Erro: PAGE_NOT_FOUND_EXCEPTION
            </p>
        </div>

      </div>
    </div>
  );
}
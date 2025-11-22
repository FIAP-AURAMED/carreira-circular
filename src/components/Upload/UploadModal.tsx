import { X, Upload, FileText, Brain, Sparkles, Lock } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Passos do processamento visual (da sua imagem)
const STEPS = [
  { icon: FileText, text: "Lendo PDF...", color: "text-blue-400", bg: "bg-blue-500/20" },
  { icon: Brain, text: "Processando Skills...", color: "text-purple-400", bg: "bg-purple-500/20" },
  { icon: Sparkles, text: "Agente IA analisando...", color: "text-emerald-400", bg: "bg-emerald-500/20" }
];

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Estados da Tela
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'partial'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Inicia o visual de processamento
    setStatus('processing');
    
    // Simula a animação dos passos (visual apenas)
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 1500); // Troca de passo a cada 1.5s

    try {
      // 2. Verifica se está logado
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        // --- CENÁRIO NÃO LOGADO ---
        // Simula o tempo de processamento e cai no estado "Parcial"
        setTimeout(() => {
          clearInterval(stepInterval);
          setStatus('partial'); 
        }, 4000);
        return;
      }

      // --- CENÁRIO LOGADO (Back-end Real) ---
      const formData = new FormData();
      formData.append('arquivo', file);

      const response = await fetch('http://localhost:8080/api/curriculos/analisar', { // URL do seu backend
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Bearer Token conforme manual
        },
        body: formData
      });

      if (!response.ok) throw new Error('Erro na análise');

      const data = await response.json();
      
      // Sucesso total
      clearInterval(stepInterval);
      setAnalysisResult(data);
      setStatus('completed');
      
      // Aqui você pode salvar no contexto ou redirecionar para uma página de resultados
      // Ex: navigate(`/analise/${data.analiseId}`);

    } catch (error) {
      console.error(error);
      clearInterval(stepInterval);
      setStatus('idle'); // Volta pro inicio em caso de erro (ou mostre msg de erro)
      alert("Erro ao conectar com o servidor de IA.");
    }
  };

  // Renderiza a tela de Processamento (Igual sua imagem)
  if (status === 'processing') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-lg p-8 text-center">
            
            {/* Botão Fechar */}
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                <X size={24} />
            </button>

            <h2 className="text-xl font-semibold text-white mb-2">
                Processando {fileInputRef.current?.files?.[0]?.name || "Currículo"}
            </h2>
            <p className="text-gray-400 mb-10">Nossa IA está analisando seu currículo...</p>

            <div className="flex flex-col gap-6 items-start max-w-xs mx-auto">
                {STEPS.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                        <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${index > currentStep ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                            <div className={`p-3 rounded-full ${isActive || isCompleted ? step.bg : 'bg-gray-800'}`}>
                                <step.icon size={24} className={isActive || isCompleted ? step.color : 'text-gray-500'} />
                            </div>
                            <span className={`text-lg font-medium ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                {step.text}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    );
  }

  // Renderiza a tela de "Bloqueio Parcial" (Usuário não logado)
  if (status === 'partial') {
     return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-md p-8 bg-[#0f111a] border border-purple-500/30 rounded-2xl shadow-2xl text-center overflow-hidden">
                
                {/* Efeito de fundo */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="bg-green-500/10 text-green-400 p-3 rounded-lg inline-flex items-center gap-2 mb-6">
                    <Sparkles size={18} />
                    <span className="font-semibold">Análise Concluída com Sucesso!</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">Resultado Pronto</h2>
                <p className="text-gray-400 mb-8">
                    Identificamos <strong>12 competências</strong> e <strong>3 rotas de carreira</strong> circular para o seu perfil.
                </p>

                {/* Área "Blurrada" simulando o conteúdo */}
                <div className="relative bg-gray-900/50 p-4 rounded-xl mb-8 border border-white/5 select-none">
                    <div className="filter blur-sm opacity-50 flex flex-col gap-3">
                         <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                         <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                         <div className="h-4 bg-gray-700 rounded w-full"></div>
                    </div>
                    
                    {/* Cadeado por cima */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="bg-black/60 p-3 rounded-full backdrop-blur-sm mb-2">
                            <Lock size={24} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-white">Conteúdo Bloqueado</span>
                    </div>
                </div>

                <button 
                    onClick={() => { onClose(); navigate('/login'); }}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/25"
                >
                    Fazer Login para Ver Resultado
                </button>
                
                <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-300">
                    Cancelar
                </button>
            </div>
        </div>
     )
  }

  // Tela Inicial (Upload)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md p-6 mx-4 bg-[#0B0516] border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center pt-4 pb-2">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)]">
            <Upload size={32} className="text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Anexar Currículo</h2>
          <p className="text-gray-400 mb-8 max-w-[80%]">
            Faça upload do seu CV em PDF para iniciar a análise de carreira circular
          </p>

          <input 
            type="file" 
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />

          <button 
            onClick={handleFileSelect}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:brightness-110 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/25 mb-4"
          >
            <FileText size={18} />
            Selecionar Arquivo PDF
          </button>

          <span className="text-xs text-gray-500 font-medium">
            Apenas arquivos PDF • Máximo 10MB
          </span>
        </div>
      </div>
    </div>
  );
}
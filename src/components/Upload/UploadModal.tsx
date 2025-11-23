// UploadModal.tsx - CORRIGIDO
import { X, Upload, FileText, Brain, Sparkles, Lock } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { icon: FileText, text: "Lendo PDF...", color: "text-blue-400", bg: "bg-blue-500/20" },
  { icon: Brain, text: "Processando Skills...", color: "text-purple-400", bg: "bg-purple-500/20" },
  { icon: Sparkles, text: "Agente IA analisando...", color: "text-emerald-400", bg: "bg-emerald-500/20" }
];

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'processing' | 'partial' | 'completed'>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

  if (!isOpen) return null;

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('processing');
    setCurrentStep(0);
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 1500); 

    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      // Se usuário NÃO está logado, salva análise no localStorage
      if (!token || !userId) {
        // Simula análise (em produção, isso viria do backend)
        const analiseSimulada = {
          analiseId: Date.now(),
          usuarioId: null,
          scoreLongevidade: 8.5,
          habilidadesEmRisco: 4,
          habilidadesEstaveis: 15,
          criadoEm: new Date().toISOString(),
          mensagem: "✨ Analisamos seu currículo e identificamos um perfil com grande potencial! 💫",
          habilidades: [
            {
              nomeHabilidade: "Java (Backend)",
              longevidade: "Média Longevidade",
              anosRestantes: 5,
              riscoObsolescencia: 0.3,
              categoria: "Tecnologia"
            },
            {
              nomeHabilidade: "React",
              longevidade: "Alta Longevidade", 
              anosRestantes: 8,
              riscoObsolescencia: 0.1,
              categoria: "Frontend"
            }
          ],
          rotasUpcycling: [
            {
              habilidadeOrigem: "Java",
              microHabilidade: "Microsserviços com Spring Boot",
              horasEstimadas: 40,
              novaCompetencia: "Arquitetura de Microsserviços",
              ganhoLongevidade: 3,
              tipoRota: "Upcycling - Reaproveitamento"
            }
          ]
        };

        setTimeout(() => {
          clearInterval(stepInterval);
          
          // SALVA NO LOCALSTORAGE PARA USAR DEPOIS DO LOGIN
          localStorage.setItem('analiseCurriculoPendente', JSON.stringify(analiseSimulada));
          localStorage.setItem('curriculoFile', file.name);
          
          setStatus('partial');
        }, 4000);
        return;
      }

      // Se usuário ESTÁ logado, envia para o backend
      const formData = new FormData();
      formData.append('arquivo', file);

      const response = await fetch(`${API_BASE_URL}/api/curriculos/analisar`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Erro na análise');
      const data = await response.json();
      
      clearInterval(stepInterval);
      setStatus('completed');
      
      // Salva no histórico de análises
      salvarNoHistorico(data);
      
      alert("Análise completa! Atualizando seu perfil...");
      onClose();
      window.location.reload(); // Recarrega para mostrar novos dados

    } catch (error) {
      console.error(error);
      clearInterval(stepInterval);
      setStatus('idle');
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Função para salvar análise no histórico
  const salvarNoHistorico = (analise: any) => {
    const historico = JSON.parse(localStorage.getItem('historicoAnalises') || '[]');
    historico.push({
      ...analise,
      tipo: 'curriculo',
      data: new Date().toISOString()
    });
    localStorage.setItem('historicoAnalises', JSON.stringify(historico));
  };

  // 1. TELA DE PROCESSAMENTO
  if (status === 'processing') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <div className="w-full max-w-lg p-6 sm:p-8 text-center relative">
            <h2 className="text-xl font-semibold text-white mb-2">Analisando Currículo...</h2>
            <div className="flex flex-col gap-4 mt-8">
                {STEPS.map((step, index) => (
                    <div key={index} className={`flex items-center gap-4 transition-opacity ${index > currentStep ? 'opacity-30' : 'opacity-100'}`}>
                        <step.icon className={step.color} />
                        <span className="text-white">{step.text}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  // 2. TELA PARCIAL (BLOQUEIO)
  if (status === 'partial') {
     return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="relative w-full max-w-md bg-[#0f111a] border border-purple-500/30 rounded-2xl p-6 shadow-2xl text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl" />
                
                <h2 className="text-2xl font-bold text-white mt-4 mb-2">Análise Pronta!</h2>
                <p className="text-gray-400 text-sm mb-6">Faça login para ver o resultado completo.</p>

                <div className="bg-gray-800/50 p-4 rounded-lg mb-6 relative overflow-hidden">
                    <div className="blur-sm opacity-50 space-y-3">
                        <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-600 rounded w-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Lock className="text-white" />
                    </div>
                </div>

                <button 
                    onClick={() => { onClose(); navigate('/login'); }}
                    className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110"
                >
                    Fazer Login
                </button>
                <button onClick={onClose} className="mt-4 text-sm text-gray-500">Cancelar</button>
            </div>
        </div>
     )
  }

  // 3. TELA INICIAL (UPLOAD) - CORRIGIDA
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md bg-[#0B0516] border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/20">
            <Upload size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Anexar Currículo</h2>
          <p className="text-gray-400 text-sm mb-6">PDF até 10MB</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          
          <button 
            onClick={handleFileSelect} 
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:brightness-110 flex items-center justify-center gap-2"
          >
            <FileText size={18} /> Selecionar Arquivo
          </button>
        </div>
      </div>
    </div>
  );
}
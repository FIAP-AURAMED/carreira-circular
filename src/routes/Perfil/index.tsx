// Perfil/index.tsx - ATUALIZADO
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, LogOut, TrendingUp, Target, Zap, 
  FileText, BrainCircuit, Clock, Edit2, Lightbulb, X,
  Upload, History, AlertCircle, CheckCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import UploadModal from "../../components/Upload/UploadModal";

// --- TIPAGEM COMPLETA ---
interface UserData {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
}

interface Skill {
  nomeHabilidade: string;
  longevidade: string;
  anosRestantes?: number;
  riscoObsolescencia: number;
  categoria: string;
}

interface RotaUpcycling {
  habilidadeOrigem?: string;
  microHabilidade?: string;
  novaCompetencia?: string;
  horasEstimadas: number;
  tipoRota: string;
  ganhoLongevidade?: number;
}

interface AnaliseCurriculo {
  analiseId: number;
  usuarioId: number | null;
  scoreLongevidade: number;
  habilidadesEmRisco: number;
  habilidadesEstaveis: number;
  criadoEm: string;
  mensagem: string;
  habilidades: Skill[];
  rotasUpcycling: RotaUpcycling[];
  tipo?: string;
  data?: string;
}

interface DashboardData {
  analiseAtual: AnaliseCurriculo | null;
  historicoAnalises: AnaliseCurriculo[];
  usuario: UserData | null;
}

// Componente para exibir habilidades
const HabilidadeCard = ({ habilidade }: { habilidade: Skill }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-white text-sm">{habilidade.nomeHabilidade}</h4>
      <span className={`text-xs px-2 py-1 rounded-full ${
        habilidade.riscoObsolescencia > 0.7 ? 'bg-red-500/20 text-red-400' :
        habilidade.riscoObsolescencia > 0.4 ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-green-500/20 text-green-400'
      }`}>
        {habilidade.longevidade}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
      <div>Anos Restantes: <span className="text-white">{habilidade.anosRestantes || 'N/A'}</span></div>
      <div>Risco: <span className="text-white">{(habilidade.riscoObsolescencia * 100).toFixed(0)}%</span></div>
      <div className="col-span-2">Categoria: <span className="text-white">{habilidade.categoria}</span></div>
    </div>
  </div>
);

// Componente para exibir rotas de upcycling
const RotaUpcyclingCard = ({ rota }: { rota: RotaUpcycling }) => (
  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-white text-sm">{rota.novaCompetencia}</h4>
      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
        {rota.tipoRota}
      </span>
    </div>
    <div className="text-xs text-gray-400 space-y-1">
      <div>Origem: <span className="text-white">{rota.habilidadeOrigem}</span></div>
      <div>Horas: <span className="text-white">{rota.horasEstimadas}h</span></div>
      {rota.ganhoLongevidade && (
        <div>Ganho: <span className="text-green-400">+{rota.ganhoLongevidade} anos</span></div>
      )}
    </div>
  </div>
);

export default function Perfil() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    analiseAtual: null,
    historicoAnalises: [],
    usuario: null
  });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'habilidades' | 'historico'>('overview');

  const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";
  const loggedUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  
  const targetUserId = id || loggedUserId;

  useEffect(() => {
    if (!loggedUserId && !token) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);

        // 1. Buscar dados do usuário
        let userData = { nome: "Usuário", id: Number(targetUserId) } as UserData;
        try {
          const userRes = await fetch(`${API_BASE_URL}/usuarios/${targetUserId}`);
          if (userRes.ok) userData = await userRes.json();
        } catch (e) { 
          console.warn("Erro ao buscar user info"); 
        }

        // 2. Verificar se há análise pendente do localStorage
        const analisePendente = localStorage.getItem('analiseCurriculoPendente');
        let analiseAtual = null;
        let historico = [];

        if (analisePendente) {
          analiseAtual = JSON.parse(analisePendente);
          // Limpa análise pendente após usar
          localStorage.removeItem('analiseCurriculoPendente');
        } else {
          // 3. Buscar análises do backend
          try {
            const historicoRes = await fetch(`${API_BASE_URL}/api/analises/usuario/${targetUserId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (historicoRes.ok) {
              const historicoData = await historicoRes.json();
              historico = Array.isArray(historicoData) ? historicoData : [];
              
              // A análise mais recente é a atual
              if (historico.length > 0) {
                analiseAtual = historico[0];
                historico = historico.slice(1); // Restante é histórico
              }
            }
          } catch (error) {
            console.warn("Erro ao buscar histórico do backend:", error);
          }
        }

        // 4. Se não encontrou no backend, busca do localStorage
        if (!analiseAtual) {
          const localHistorico = JSON.parse(localStorage.getItem('historicoAnalises') || '[]');
          if (localHistorico.length > 0) {
            analiseAtual = localHistorico[0];
            historico = localHistorico.slice(1);
          }
        }

        setDashboardData({
          analiseAtual,
          historicoAnalises: historico,
          usuario: userData
        });

      } catch (error) {
        console.error("Erro fatal no dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if(targetUserId) loadDashboard();
  }, [targetUserId, loggedUserId, navigate, API_BASE_URL, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    window.location.reload(); // Recarrega para mostrar nova análise
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0516] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-gray-400 animate-pulse">Sincronizando dados...</p>
        </div>
      </div>
    );
  }

  const { analiseAtual, historicoAnalises, usuario } = dashboardData;
  const temAnalise = !!analiseAtual;

  return (
    <div className="min-h-screen bg-[#0B0516] text-white p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Olá, {usuario?.nome?.split(" ")[0] || "Candidato"}!
            </h1>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Clock size={14} /> 
                {temAnalise ? `Última análise: ${new Date(analiseAtual.criadoEm).toLocaleDateString()}` : 'Nenhuma análise ainda'}
              </span>
              {temAnalise && (
                <span className="bg-green-500/10 text-green-300 border border-green-500/20 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                  <CheckCircle size={12} /> Currículo Analisado
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!temAnalise && (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Upload size={16} /> Analisar Currículo
              </button>
            )}
            <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Edit2 size={16} /> Editar
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>

        {/* ABAS DE NAVEGAÇÃO */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('habilidades')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'habilidades' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Habilidades
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'historico' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Histórico
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ESQUERDA: Métricas Principais */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CARDS DE MÉTRICAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {temAnalise ? analiseAtual.scoreLongevidade.toFixed(1) : '0.0'}/10
                  </div>
                  <div className="text-gray-400 text-sm">Score Longevidade</div>
                </div>
                
                <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {temAnalise ? analiseAtual.habilidadesEstaveis : 0}
                  </div>
                  <div className="text-gray-400 text-sm">Habilidades Estáveis</div>
                </div>
                
                <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {temAnalise ? analiseAtual.habilidadesEmRisco : 0}
                  </div>
                  <div className="text-gray-400 text-sm">Habilidades em Risco</div>
                </div>
              </div>

              {/* MENSAGEM DA ANÁLISE */}
              {temAnalise && (
                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20 text-primary shrink-0">
                      <Lightbulb size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Insights da IA</h3>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {analiseAtual.mensagem}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ROTAS DE UPCYCLING */}
              {temAnalise && analiseAtual.rotasUpcycling && analiseAtual.rotasUpcycling.length > 0 && (
                <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-400"/> Rotas de Upcycling
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analiseAtual.rotasUpcycling.map((rota, index) => (
                      <RotaUpcyclingCard key={index} rota={rota} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DIREITA: Ações Rápidas */}
            <div className="space-y-6">
              <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Ações</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    {temAnalise ? 'Nova Análise' : 'Analisar Currículo'}
                  </button>
                  
                  {temAnalise && (
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <FileText size={18} />
                      Exportar Relatório
                    </button>
                  )}
                </div>
              </div>

              {/* STATUS DO CURRÍCULO */}
              <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Status do Currículo</h3>
                {temAnalise ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-green-400">
                      <CheckCircle size={20} />
                      <span className="text-sm">Currículo analisado com sucesso</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Última atualização: {new Date(analiseAtual.criadoEm).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-yellow-400">
                      <AlertCircle size={20} />
                      <span className="text-sm">Nenhum currículo analisado</span>
                    </div>
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded text-sm font-medium transition-colors"
                    >
                      Fazer Primeira Análise
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA HABILIDADES */}
        {activeTab === 'habilidades' && (
          <div className="space-y-6">
            {temAnalise ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analiseAtual.habilidades.map((habilidade, index) => (
                    <HabilidadeCard key={index} habilidade={habilidade} />
                  ))}
                </div>
                
                <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Resumo das Habilidades</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{analiseAtual.habilidadesEstaveis}</div>
                      <div className="text-gray-400">Estáveis</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{analiseAtual.habilidadesEmRisco}</div>
                      <div className="text-gray-400">Em Risco</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{analiseAtual.habilidades.length}</div>
                      <div className="text-gray-400">Total</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">Nenhuma habilidade analisada</h3>
                <p className="text-gray-500 text-sm mb-4">Faça upload do seu currículo para ver suas habilidades</p>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
                >
                  Analisar Currículo
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA HISTÓRICO */}
        {activeTab === 'historico' && (
          <div className="space-y-6">
            {historicoAnalises.length > 0 ? (
              <div className="space-y-4">
                {historicoAnalises.map((analise, index) => (
                  <div key={index} className="bg-[#12141c] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-white">
                          Análise de {new Date(analise.criadoEm).toLocaleDateString()}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Score: {analise.scoreLongevidade.toFixed(1)}/10 • 
                          Estáveis: {analise.habilidadesEstaveis} • 
                          Risco: {analise.habilidadesEmRisco}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(analise.criadoEm).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{analise.mensagem}</p>
                    <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                      Ver detalhes completos →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <History size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">Nenhum histórico de análises</h3>
                <p className="text-gray-500 text-sm">Suas análises anteriores aparecerão aqui</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DE UPLOAD */}
      {showUploadModal && (
        <UploadModal 
          isOpen={showUploadModal}
          onClose={handleUploadComplete}
        />
      )}

      {/* MODAL DE EDIÇÃO (manter igual) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12141c] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20}/>
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
            <EditProfileForm 
              user={usuario} 
              onClose={() => setShowEditModal(false)} 
              API_BASE_URL={API_BASE_URL} 
              userId={targetUserId} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de edição (manter igual)
function EditProfileForm({ user, onClose, API_BASE_URL, userId }: any) {
  const { register, handleSubmit } = useForm({ defaultValues: user });
  const onSubmit = async (data: any) => {
    await fetch(`${API_BASE_URL}/usuarios`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: Number(userId) }),
    }).catch(() => null);
    window.location.reload();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("nome")} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" placeholder="Nome" />
      <input {...register("email")} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" placeholder="Email" />
      <button className="w-full py-3 bg-primary text-white rounded-lg font-bold">Salvar</button>
    </form>
  );
}
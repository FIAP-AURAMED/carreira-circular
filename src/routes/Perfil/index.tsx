import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    User, LogOut, TrendingUp, Target, Zap,
    FileText, BrainCircuit, Clock, Edit2, Lightbulb, X,
    Upload, History, AlertCircle, CheckCircle,
    AlertTriangle, // ← ADICIONAR
    Download,
    Star,
    MapPin,
    Briefcase,
    Cpu,
    Edit3,
    RefreshCw
} from "lucide-react";
import { useForm } from "react-hook-form";
import HabilidadeMap from "../../components/HabilidadeMap";
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
    ganhoLongevidade: number;
    tipoRota: string;
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


interface SugestaoCarreira {
    nomeCarreira: string;
    descricao?: string;
    compatibilidade: number;
    nivelExperiencia: string;
}

interface AnaliseMBTI {
    perfilMbti: string;
    clusterCarreira: number;
    confianca: number;
    sugestoesCarreira: SugestaoCarreira[];
    analisadoEm: string;
    mensagem: string;
}

interface DashboardData {
    analiseCurriculo: AnaliseCurriculo | null;
    analiseMBTI: AnaliseMBTI | null;
    historicoAnalises: any[];
    usuario: UserData | null;
}


// Componente para exibir habilidades
export default function Perfil() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        analiseCurriculo: null,
        analiseMBTI: null,
        historicoAnalises: [],
        usuario: null
    });
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'habilidades' | 'historico'>('overview');
    const [error, setError] = useState<string | null>(null); // ← NOVO ESTADO PARA ERROS

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
                setError(null);

                // 1. Buscar dados do usuário
                let userData = null;
                try {
                    const userRes = await fetch(`/usuarios/${targetUserId}`);
                    if (userRes.status === 404) {
                        setError("Usuário não encontrado.");
                        setLoading(false);
                        return;
                    }
                    if (!userRes.ok) throw new Error('Erro ao buscar usuário');
                    userData = await userRes.json();
                } catch (e: any) {
                    setError(e.message);
                    setLoading(false);
                    return;
                }

                // 2. Buscar análise MBTI do usuário
                let analiseMBTI = null;
                try {
                    const mbtiRes = await fetch(`/api/perfil/usuario/${targetUserId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (mbtiRes.ok) {
                        const mbtiData = await mbtiRes.json();
                        // Pega a análise mais recente
                        analiseMBTI = Array.isArray(mbtiData) ? mbtiData[0] : mbtiData;
                    }
                } catch (error) {
                    console.warn("Erro ao buscar MBTI:", error);
                }

                // 3. Buscar análises de currículo
                let analiseCurriculo = null;
                let historico = [];

                // Primeiro verifica localStorage
                const analisePendente = localStorage.getItem('analiseCurriculoPendente');
                if (analisePendente) {
                    analiseCurriculo = JSON.parse(analisePendente);
                    localStorage.removeItem('analiseCurriculoPendente');
                } else {
                    // Busca do backend
                    try {
                        const historicoRes = await fetch(`/api/analises/usuario/${targetUserId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (historicoRes.ok) {
                            const historicoData = await historicoRes.json();
                            if (Array.isArray(historicoData) && historicoData.length > 0) {
                                analiseCurriculo = historicoData[0];
                                historico = historicoData.slice(1);
                            }
                        }
                    } catch (error) {
                        console.warn("Erro ao buscar histórico:", error);
                    }
                }

                // Fallback para localStorage
                if (!analiseCurriculo) {
                    const localHistorico = JSON.parse(localStorage.getItem('historicoAnalises') || '[]');
                    if (localHistorico.length > 0) {
                        analiseCurriculo = localHistorico[0];
                        historico = localHistorico.slice(1);
                    }
                }

                setDashboardData({
                    analiseCurriculo,
                    analiseMBTI,
                    historicoAnalises: historico,
                    usuario: userData
                });

            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (targetUserId) loadDashboard();
    }, [targetUserId, loggedUserId, navigate, token]);

    // Função para exportar relatório
    const exportarRelatorio = () => {
        const { analiseCurriculo, analiseMBTI, usuario } = dashboardData;

        const relatorio = {
            usuario: {
                nome: usuario?.nome,
                email: usuario?.email,
                dataGeracao: new Date().toLocaleDateString('pt-BR')
            },
            analiseCurriculo: analiseCurriculo ? {
                scoreLongevidade: analiseCurriculo.scoreLongevidade,
                habilidadesEstaveis: analiseCurriculo.habilidadesEstaveis,
                habilidadesEmRisco: analiseCurriculo.habilidadesEmRisco,
                totalHabilidades: analiseCurriculo.habilidades?.length || 0,
                mensagem: analiseCurriculo.mensagem
            } : null,
            analiseMBTI: analiseMBTI ? {
                perfil: analiseMBTI.perfilMbti,
                confianca: analiseMBTI.confianca,
                sugestoesCarreira: analiseMBTI.sugestoesCarreira?.length || 0
            } : null
        };

        // Criar e baixar arquivo JSON
        const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-carreira-${usuario?.nome || 'usuario'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };




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

    // 👇 NOVO: TELA DE ERRO QUANDO USUÁRIO NÃO EXISTE
    if (error) {
        return (
            <div className="min-h-screen bg-[#0B0516] text-white p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <div className="bg-[#12141c] border border-red-500/20 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Usuário Não Encontrado</h2>
                        <p className="text-gray-400 mb-6">{error}</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
                            >
                                Fazer Login
                            </button>
                            <button
                                onClick={() => navigate('/cadastro')}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors"
                            >
                                Criar Nova Conta
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { analiseCurriculo, analiseMBTI, historicoAnalises, usuario } = dashboardData;
    const temAnaliseCurriculo = !!analiseCurriculo;
    const temAnaliseMBTI = !!analiseMBTI;

    // 👇 ADICIONAR BANNER DE AVISO QUANDO O PERFIL NÃO É DO USUÁRIO LOGADO
    const isOwnProfile = targetUserId === loggedUserId;

    // Componente para cards de Upcycling
    const RotaUpcyclingCard = ({ rota, index }: { rota: RotaUpcycling; index: number }) => (
        <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <RefreshCw size={16} className="text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                            {rota.novaCompetencia}
                        </h4>
                        <p className="text-xs text-muted-foreground">De: {rota.habilidadeOrigem}</p>
                    </div>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    +{rota.ganhoLongevidade} anos
                </span>
            </div>

            <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Micro-habilidade:</span>
                    <span className="text-foreground font-medium">{rota.microHabilidade}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo estimado:</span>
                    <span className="text-foreground font-medium">{rota.horasEstimadas}h</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="text-foreground font-medium">{rota.tipoRota}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Potencial de crescimento</span>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < Math.min(rota.ganhoLongevidade, 5)
                                    ? 'bg-green-500'
                                    : 'bg-border'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* CABEÇALHO */}
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                                Olá, {usuario?.nome?.split(" ")[0] || "Candidato"}
                            </h1>
                            <div className="flex flex-wrap gap-3 mt-2">
                                <span className="text-muted-foreground text-sm flex items-center gap-1">
                                    <Clock size={14} />
                                    {temAnaliseCurriculo ? `Última análise: ${new Date(analiseCurriculo.criadoEm).toLocaleDateString()}` : 'Nenhuma análise ainda'}
                                </span>

                                {temAnaliseMBTI && (
                                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium">
                                        {analiseMBTI.perfilMbti}
                                    </span>
                                )}

                                {temAnaliseCurriculo && (
                                    <span className="bg-green-500/20 text-green-600 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                                        <CheckCircle size={12} /> Currículo Analisado
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {(temAnaliseCurriculo || temAnaliseMBTI) && (
                                <button
                                    onClick={exportarRelatorio}
                                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Download size={16} /> Exportar
                                </button>
                            )}

                            {!temAnaliseCurriculo && isOwnProfile && (
                                <button onClick={() => setShowUploadModal(true)} className="px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <Upload size={16} /> Analisar Currículo
                                </button>
                            )}

                            {isOwnProfile && (
                                <button onClick={() => setShowEditModal(true)} className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <Edit3 size={16} /> Editar
                                </button>
                            )}

                            <button onClick={handleLogout} className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <LogOut size={16} /> Sair
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO MBTI */}
                {temAnaliseMBTI && (
                    <div className="bg-card rounded-xl border border-border p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <Cpu size={20} className="text-primary" />
                                    Perfil Profissional
                                </h2>
                                <div className="flex flex-wrap gap-6">
                                    <div>
                                        <div className="text-2xl font-bold text-foreground">{analiseMBTI.perfilMbti}</div>
                                        <div className="text-muted-foreground text-sm">Perfil</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{(analiseMBTI.confianca * 100).toFixed(0)}%</div>
                                        <div className="text-muted-foreground text-sm">Confiança</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-primary">{analiseMBTI.sugestoesCarreira?.length || 0}</div>
                                        <div className="text-muted-foreground text-sm">Sugestões</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-muted-foreground text-sm border-t border-border pt-4">
                            {analiseMBTI.mensagem}
                        </p>

                        {/* Sugestões de Carreira */}
                        {analiseMBTI.sugestoesCarreira && analiseMBTI.sugestoesCarreira.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Briefcase size={16} className="text-muted-foreground" />
                                    Sugestões de Carreira
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {analiseMBTI.sugestoesCarreira.slice(0, 6).map((sugestao, index) => (
                                        <div key={index} className="bg-secondary/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium text-foreground text-sm">{sugestao.nomeCarreira}</h5>
                                                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                                    {(sugestao.compatibilidade * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Nível: {sugestao.nivelExperiencia}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* CARDS DE MÉTRICAS */}
                {temAnaliseCurriculo && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-foreground mb-1">
                                {analiseCurriculo.scoreLongevidade.toFixed(1)}/10
                            </div>
                            <div className="text-muted-foreground text-sm">Score Longevidade</div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {analiseCurriculo.habilidadesEstaveis}
                            </div>
                            <div className="text-muted-foreground text-sm">Habilidades Estáveis</div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-amber-600 mb-1">
                                {analiseCurriculo.habilidadesEmRisco}
                            </div>
                            <div className="text-muted-foreground text-sm">Habilidades em Risco</div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-primary mb-1">
                                {analiseCurriculo.habilidades?.length || 0}
                            </div>
                            <div className="text-muted-foreground text-sm">Total de Habilidades</div>
                        </div>
                    </div>
                )}

                {/* SEÇÃO ROTAS DE UPCYCLING */}
                {temAnaliseCurriculo && analiseCurriculo.rotasUpcycling && analiseCurriculo.rotasUpcycling.length > 0 && (
                    <div className="bg-card rounded-xl border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                    <RefreshCw size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Rotas de Upcycling</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Transforme suas habilidades atuais em novas competências
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{analiseCurriculo.rotasUpcycling.length}</div>
                                <div className="text-muted-foreground text-sm">Oportunidades</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analiseCurriculo.rotasUpcycling.map((rota, index) => (
                                <RotaUpcyclingCard key={index} rota={rota} index={index} />
                            ))}
                        </div>

                        {/* Resumo do Upcycling */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-secondary/30 p-3 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        +{analiseCurriculo.rotasUpcycling.reduce((acc, rota) => acc + rota.ganhoLongevidade, 0)} anos
                                    </div>
                                    <div className="text-muted-foreground text-sm">Ganho total de longevidade</div>
                                </div>

                                <div className="bg-secondary/30 p-3 rounded-lg">
                                    <div className="text-lg font-bold text-primary">
                                        {Math.round(analiseCurriculo.rotasUpcycling.reduce((acc, rota) => acc + rota.horasEstimadas, 0) / analiseCurriculo.rotasUpcycling.length)}h
                                    </div>
                                    <div className="text-muted-foreground text-sm">Média de horas por rota</div>
                                </div>

                                <div className="bg-secondary/30 p-3 rounded-lg">
                                    <div className="text-lg font-bold text-amber-600">
                                        {new Set(analiseCurriculo.rotasUpcycling.map(r => r.tipoRota)).size}
                                    </div>
                                    <div className="text-muted-foreground text-sm">Tipos de transformação</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAPA DE HABILIDADES */}
                {temAnaliseCurriculo && analiseCurriculo.habilidades && (
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                            <MapPin size={20} className="text-muted-foreground" />
                            Mapa de Habilidades
                        </h3>
                        {temAnaliseCurriculo && analiseCurriculo.habilidades && (
                            <HabilidadeMap
                                habilidades={analiseCurriculo.habilidades}
                               
                                sugestoesCarreira={analiseMBTI?.sugestoesCarreira || []}
                            />
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Lista de Habilidades */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {analiseCurriculo.habilidades.map((habilidade, index) => (
                                        <div key={index} className="bg-secondary/30 p-3 rounded-lg border border-border">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-foreground text-sm">{habilidade.nomeHabilidade}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${habilidade.riscoObsolescencia < 0.3 ? 'bg-green-500/20 text-green-600' :
                                                    habilidade.riscoObsolescencia < 0.7 ? 'bg-amber-500/20 text-amber-600' :
                                                        'bg-red-500/20 text-red-600'
                                                    }`}>
                                                    {habilidade.longevidade}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{habilidade.categoria}</span>
                                                <span>{(habilidade.riscoObsolescencia * 100).toFixed(0)}% risco</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumo */}
                            <div className="space-y-4">
                                <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                                    <h4 className="font-semibold text-foreground mb-3 text-sm">Resumo</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Estáveis</span>
                                            <span className="font-semibold text-green-600">
                                                {analiseCurriculo.habilidades.filter(h => h.riscoObsolescencia < 0.3).length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Médio Risco</span>
                                            <span className="font-semibold text-amber-600">
                                                {analiseCurriculo.habilidades.filter(h => h.riscoObsolescencia >= 0.3 && h.riscoObsolescencia < 0.7).length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Alto Risco</span>
                                            <span className="font-semibold text-red-600">
                                                {analiseCurriculo.habilidades.filter(h => h.riscoObsolescencia >= 0.7).length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Habilidades em Destaque */}
                                <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                                    <h4 className="font-semibold text-foreground mb-3 text-sm">Habilidades em Destaque</h4>
                                    <div className="space-y-2">
                                        {analiseCurriculo.habilidades
                                            .sort((a, b) => a.riscoObsolescencia - b.riscoObsolescencia)
                                            .slice(0, 3)
                                            .map((habilidade, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span className="text-foreground">{habilidade.nomeHabilidade}</span>
                                                    <span className="text-green-600 font-medium">
                                                        {(habilidade.riscoObsolescencia * 100).toFixed(0)}% risco
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MENSAGEM QUANDO NÃO TEM ANÁLISE */}
                {!temAnaliseCurriculo && isOwnProfile && (
                    <div className="bg-card rounded-xl border border-border p-8 text-center">
                        <FileText className="text-muted-foreground mx-auto mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma análise de currículo</h3>
                        <p className="text-muted-foreground mb-6">Faça upload do seu currículo para ver suas habilidades e oportunidades</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                        >
                            Analisar Currículo
                        </button>
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

            {/* MODAL DE EDIÇÃO */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6 relative">
                        <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold text-foreground mb-4">Editar Perfil</h2>
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

// Componente de edição com suas cores
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
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nome</label>
                <input
                    {...register("nome")}
                    className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Seu nome completo"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                    {...register("email")}
                    className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="seu@email.com"
                />
            </div>
            <button className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium">
                Salvar Alterações
            </button>
        </form>
    );
}
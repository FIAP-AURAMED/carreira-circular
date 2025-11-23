import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, ArrowRight, ArrowLeft, BrainCircuit, Calendar, XCircle } from "lucide-react";
import { useState } from "react";

// --- DADOS ESTÁTICOS ---
const GENEROS = [
  { valor: "M", label: "Masculino" },
  { valor: "F", label: "Feminino" },
  { valor: "O", label: "Outro" },
  { valor: "PNI", label: "Prefiro não informar" }
];

const ETNIAS = [
  { valor: "B", label: "Branca" },
  { valor: "P", label: "Preta" },
  { valor: "PA", label: "Parda" },
  { valor: "A", label: "Amarela" },
  { valor: "I", label: "Indígena" },
  { valor: "Q", label: "Quilombola" },
  { valor: "C", label: "Cigana/Roma" },
  { valor: "M", label: "Mestiça" },
  { valor: "OE", label: "Outro" },
  { valor: "PNI", label: "Prefiro não informar" }
];

const PERGUNTAS_MBTI = [
  "1. Prefiro trabalhar com fatos concretos do que com ideias abstratas",
  "2. Gosto de seguir planos e estruturas definidas",
  "3. Tomar decisões baseadas em lógica é mais importante do que considerar sentimentos",
  "4. Prefiro atividades rotineiras do que mudanças constantes",
  "5. Sou mais analítico do que criativo na resolução de problemas",
  "6. Valorizo mais a eficiência do que a originalidade",
  "7. Prefiro trabalhar sozinho do que em equipe",
  "8. Gosto mais de implementar ideias do que de gerar novas ideias",
  "9. Considero-me mais prático do que visionário",
  "10. Prefiro ambientes organizados e previsíveis"
];

export default function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<{ title: string, msg: string } | null>(null);
  
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(3));

  const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
        nome: "",
        email: "",
        senha: "",
        dataNascimento: "",
        genero: "M",
        etnia: "B"
    }
  });

  const onNextStep = (data: any) => {
    setPersonalData(data);
    setStep(2);
    setApiError(null);
  };

  const onPrevStep = () => setStep(1);

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const onFinalSubmit = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const dataNasc = personalData.dataNascimento || "2000-01-01";

      const payload = {
        ...personalData,
        dataNascimento: dataNasc, 
        respostas: answers
      };

      console.log(`Enviando payload:`, payload);

      const response = await fetch(`${API_BASE_URL}/api/mbti/cadastro-e-analise`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch((err) => { 
        console.error("Erro de rede:", err);
        throw new Error("NETWORK_ERROR"); 
      });

      // 1. Ler o corpo como texto primeiro para garantir que pegamos qualquer coisa
      const responseText = await response.text();
      let dataResponse;

      try {
        dataResponse = JSON.parse(responseText);
      } catch (e) {
        // Se falhar o parse, significa que o servidor devolveu texto puro ou HTML
        console.warn("API não retornou JSON. Corpo bruto:", responseText);
      }

      // 2. Tratamento de Erro Robusto
      if (!response.ok) {
        console.error("Erro da API Detalhado:", dataResponse || responseText);

        if (response.status === 409) throw new Error("Este e-mail já está em uso.");
        
        // Tenta extrair a mensagem mais específica possível enviada pelo Java
        const rawMessage = 
            dataResponse?.message ||   // Padrão Spring Boot
            dataResponse?.mensagem ||  // Seu padrão customizado
            dataResponse?.error ||     // Padrão OAuth/Outros
            (typeof responseText === 'string' && responseText.length < 200 ? responseText : `Erro Interno (${response.status})`);

        throw new Error(rawMessage);
      }

      // 3. Sucesso - Tenta pegar o ID
      const idUsuario = dataResponse?.usuarioId || dataResponse?.id || dataResponse?.userId;

      if (idUsuario) {
          localStorage.setItem('userId', String(idUsuario));
          localStorage.setItem('authToken', dataResponse?.token || `auth-token-${idUsuario}`);
          navigate(`/perfil/${idUsuario}`);
      } else {
          throw new Error("Cadastro feito, mas ID não retornado.");
      }

    } catch (error: any) {
      console.error("Catch no Frontend:", error);
      
      let titulo = "Erro ao Cadastrar";
      let mensagem = error.message;

      // Personaliza mensagens técnicas para algo legível, se necessário
      if (error.message === "NETWORK_ERROR") {
          titulo = "Sem Conexão";
          mensagem = "Não foi possível conectar ao servidor.";
      } else if (mensagem.includes("Internal Server Error")) {
          mensagem = "O servidor encontrou um erro inesperado. Tente novamente mais tarde.";
      }

      setApiError({ title: titulo, msg: mensagem });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0516] flex items-center justify-center p-4 overflow-y-auto">
      <div className={`w-full bg-[#12141c] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ${step === 2 ? 'max-w-3xl' : 'max-w-md'}`}>
        
        <div className="flex items-center justify-between mb-8 px-2">
           <div className={`flex-1 h-2 rounded-full mr-2 transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-700'}`} />
           <div className={`flex-1 h-2 rounded-full ml-2 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`} />
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="flex bg-black/40 p-1 rounded-lg mb-8">
                <Link to="/login" className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-white transition-all text-center">
                    Entrar
                </Link>
                <button className="flex-1 py-2 text-sm font-medium text-white bg-white/10 rounded-md shadow-sm transition-all">
                    Cadastrar
                </button>
            </div>

            <form onSubmit={handleSubmit(onNextStep)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white ml-1">Nome Completo</label>
                <input 
                  {...register("nome", { required: "Nome é obrigatório" })}
                  defaultValue={personalData?.nome}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 outline-none"
                  placeholder="Seu nome"
                />
                {errors.nome && <span className="text-xs text-red-400">{String(errors.nome.message)}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white ml-1">Email</label>
                <input 
                  {...register("email", { required: "Email é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })}
                  defaultValue={personalData?.email}
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 outline-none"
                  placeholder="seu@email.com"
                />
                {errors.email && <span className="text-xs text-red-400">{String(errors.email.message)}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white ml-1">Senha</label>
                <input 
                  {...register("senha", { required: "Senha é obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres"} })}
                  defaultValue={personalData?.senha}
                  type="password"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.senha && <span className="text-xs text-red-400">{String(errors.senha.message)}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white ml-1 flex items-center gap-2">
                    <Calendar size={14} /> Data de Nascimento
                </label>
                <input 
                  {...register("dataNascimento", { required: "Data é obrigatória" })}
                  defaultValue={personalData?.dataNascimento}
                  type="date"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 outline-none [color-scheme:dark]"
                />
                {errors.dataNascimento && <span className="text-xs text-red-400">{String(errors.dataNascimento.message)}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white ml-1">Gênero</label>
                  <select 
                    {...register("genero")}
                    defaultValue={personalData?.genero || "M"}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none cursor-pointer"
                  >
                    {GENEROS.map((gen) => <option key={gen.valor} value={gen.valor} className="bg-[#12141c]">{gen.label}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white ml-1">Raça/Etnia</label>
                  <select 
                    {...register("etnia")}
                    defaultValue={personalData?.etnia || "B"}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none cursor-pointer"
                  >
                    {ETNIAS.map((etnia) => <option key={etnia.valor} value={etnia.valor} className="bg-[#12141c]">{etnia.label}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:brightness-110 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 mt-4"
              >
                Continuar para o Teste <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                    <BrainCircuit className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Análise de Perfil Profissional</h2>
                <p className="text-gray-400 mt-2 text-sm">
                    Responda o quanto você concorda com cada afirmação para calibrarmos sua IA de carreira.
                </p>
            </div>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {PERGUNTAS_MBTI.map((pergunta, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                        <p className="text-white font-medium mb-4 text-sm sm:text-base">{pergunta}</p>
                        
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">Discordo</span>
                            
                            <div className="flex gap-2 sm:gap-3 flex-1 justify-center">
                                {[1, 2, 3, 4, 5].map((valor) => (
                                    <button
                                        key={valor}
                                        onClick={() => handleAnswerChange(index, valor)}
                                        className={`
                                            w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                                            ${answers[index] === valor 
                                                ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/50' 
                                                : 'bg-black/40 text-gray-500 hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                        title={`Opção ${valor}`}
                                    >
                                        {valor}
                                    </button>
                                ))}
                            </div>
                            
                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold text-right">Concordo</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* EXIBIÇÃO DO ERRO LIMPA */}
            {apiError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm mb-4">
                    <div className="flex items-start gap-3">
                        <XCircle size={20} className="mt-0.5 shrink-0" /> 
                        <div>
                            <p className="font-bold mb-1">{apiError.title}</p>
                            <p className="opacity-90">{apiError.msg}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <button 
                    onClick={onPrevStep}
                    className="px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                
                <button 
                    onClick={onFinalSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <> <UserPlus size={18} /> Finalizar Cadastro </>}
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
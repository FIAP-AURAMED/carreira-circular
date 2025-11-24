import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  Loader2 
} from "lucide-react";

// --- TIPAGEM DO FORMULÁRIO ---
interface ContactFormData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

// --- DADOS DO FAQ ---
const FAQ_ITEMS = [
  {
    pergunta: "Como a IA analisa meu currículo?",
    resposta: "Nossa IA utiliza Processamento de Linguagem Natural (NLP) para decompor sua experiência em vetores de competência, comparando-os com milhares de descrições de vagas para identificar padrões e oportunidades de transição."
  },
  {
    pergunta: "Meus dados estão seguros?",
    resposta: "Sim. Seguimos rigorosamente a LGPD. Seu currículo é processado apenas para gerar a análise e não compartilhamos seus dados pessoais com terceiros sem sua autorização explícita."
  },
  {
    pergunta: "O que é uma 'Rota de Upcycling'?",
    resposta: "É um caminho de aprendizado personalizado. Identificamos uma habilidade que você já tem e sugerimos uma 'micro-habilidade' complementar que te permite acessar uma nova função com o menor esforço possível."
  },
  {
    pergunta: "Posso refazer a análise?",
    resposta: "Sim! Você pode enviar novas versões do seu currículo a qualquer momento para ver como suas novas experiências alteram seu score de longevidade."
  }
];

export default function CentralAjuda() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Configuração do React Hook Form
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<ContactFormData>();

  // Função de Envio (Simulação)
  const onSubmit = async (data: ContactFormData) => {
    // Simula delay de rede (aqui entraria seu fetch para o backend)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Formulário enviado:", data);
    setIsSuccess(true);
    reset();

    // Remove mensagem de sucesso após 5 segundos
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle size={14} /> Suporte & FAQ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Como podemos ajudar?</h1>
          <p className="text-gray-400 text-lg">
            Tire suas dúvidas sobre o Carreira Circular ou entre em contato direto com nosso time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLUNA ESQUERDA: FAQ (Accordion) --- */}
          <div className="space-y-6 animate-fade-in-up delay-100">
             <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-foreground">
                <MessageSquare className="text-primary" /> Perguntas Frequentes
             </h2>
             
             <div className="space-y-4">
                {FAQ_ITEMS.map((item, idx) => (
                    <div 
                        key={idx}
                        className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                            openFaqIndex === idx 
                            ? "bg-card border-primary/50 shadow-[0_0_20px_rgba(124,58,237,0.1)]" 
                            : "bg-card/50 border-border hover:border-white/20"
                        }`}
                    >
                        <button 
                            onClick={() => toggleFaq(idx)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className={`font-medium text-lg ${openFaqIndex === idx ? "text-foreground" : "text-gray-300"}`}>
                                {item.pergunta}
                            </span>
                            <ChevronDown 
                                className={`transition-transform duration-300 text-gray-500 ${openFaqIndex === idx ? "rotate-180 text-primary" : ""}`} 
                            />
                        </button>
                        
                        <div 
                            className={`px-6 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ${
                                openFaqIndex === idx ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            {item.resposta}
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* --- COLUNA DIREITA: FORMULÁRIO COMPLETO --- */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl animate-fade-in-up delay-200 relative">
             
             <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-foreground">
                <Mail className="text-primary" /> Fale Conosco
             </h2>
             <p className="text-gray-400 text-sm mb-8">Preencha o formulário abaixo e responderemos em até 24h.</p>

             {isSuccess ? (
                 <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                     <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-500">
                         <CheckCircle size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-foreground mb-2">Mensagem Enviada!</h3>
                     <p className="text-gray-400">Obrigado pelo contato. Em breve retornaremos.</p>
                     <button 
                        onClick={() => setIsSuccess(false)}
                        className="mt-6 text-sm text-primary hover:underline"
                     >
                        Enviar nova mensagem
                     </button>
                 </div>
             ) : (
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* 1. CAMPO NOME */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
                        <input 
                            {...register("nome", { required: "O nome é obrigatório" })}
                            className={`w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                                errors.nome ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary focus:ring-primary"
                            }`}
                            placeholder="Seu nome"
                        />
                        {errors.nome && <span className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10}/> {errors.nome.message}</span>}
                    </div>

                    {/* 2. CAMPO EMAIL */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">E-mail Profissional</label>
                        <input 
                            {...register("email", { 
                                required: "O e-mail é obrigatório",
                                pattern: { value: /^\S+@\S+$/i, message: "Insira um e-mail válido" }
                            })}
                            className={`w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                                errors.email ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary focus:ring-primary"
                            }`}
                            placeholder="seu@email.com"
                        />
                        {errors.email && <span className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10}/> {errors.email.message}</span>}
                    </div>

                    {/* 3. CAMPO ASSUNTO (SELECT) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Assunto</label>
                        <select 
                            {...register("assunto", { required: "Selecione um assunto" })}
                            className={`w-full bg-background border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
                                errors.assunto ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary focus:ring-primary"
                            }`}
                        >
                            <option value="" className="bg-card">Selecione...</option>
                            <option value="suporte" className="bg-card">Suporte Técnico</option>
                            <option value="parceria" className="bg-card">Parcerias Comerciais</option>
                            <option value="duvida" className="bg-card">Dúvidas Gerais</option>
                            <option value="feedback" className="bg-card">Feedback / Sugestão</option>
                        </select>
                        {errors.assunto && <span className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10}/> {errors.assunto.message}</span>}
                    </div>

                    {/* 4. CAMPO MENSAGEM (TEXTAREA) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Mensagem</label>
                        <textarea 
                            {...register("mensagem", { 
                                required: "A mensagem não pode estar vazia",
                                minLength: { value: 10, message: "Mínimo de 10 caracteres" } 
                            })}
                            rows={4}
                            className={`w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                                errors.mensagem ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary focus:ring-primary"
                            }`}
                            placeholder="Como podemos te ajudar?"
                        />
                        {errors.mensagem && <span className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10}/> {errors.mensagem.message}</span>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:brightness-110 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <> <Send size={18} /> Enviar Mensagem </>}
                    </button>
                 </form>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
import { 
  Upload, 
  BrainCircuit, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

interface LayoutContextType {
  openUpload: () => void;
}

// Card usando bg-card e border-border
const BentoCard = ({ icon: Icon, title, description, className = "" }: any) => (
  <div className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 ${className}`}>
    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">
      <Icon size={40} />
    </div>
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default function Home() {
    const { openUpload } = useOutletContext<LayoutContextType>(); 

    return (
        // Usando bg-background e text-foreground definidos no seu CSS
        <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
            
            {/* HERO SECTION */}
            <div className="relative overflow-hidden pt-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
                
                <section className="container mx-auto px-4 pt-20 pb-20 flex flex-col items-center text-center">


                    <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 max-w-5xl leading-tight">
                        O Futuro do Trabalho <br className="hidden md:block" />
                        não é Linear. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">É Circular.</span>
                    </h1>

                    <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
                        O mercado mudou. O Carreira Circular usa inteligência artificial para transformar suas habilidades atuais na profissão que o futuro precisa.
                    </p>

                    <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <button 
                            onClick={openUpload}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-95"
                        >
                            <Upload size={20} />
                            Anexar Meu Currículo
                        </button>

                        <Link 
                            to="/sobre"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card hover:bg-white/5 text-foreground font-medium transition-colors backdrop-blur-sm"
                        >
                            Como funciona
                        </Link>
                    </div>
                </section>
            </div>

            {/* STATS STRIP */}
            <div className="border-y border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {/* Exemplo de Stat */}
                    {[
                        { val: "+15k", label: "Habilidades Mapeadas" },
                        { val: "98%", label: "Precisão da IA" },
                        { val: "24/7", label: "Análise em Tempo Real" },
                        { val: "Zero", label: "Custo para começar" }
                    ].map((stat, i) => (
                        <div key={i}>
                            <h4 className="text-3xl font-bold text-foreground mb-1">{stat.val}</h4>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURES */}
            <section className="container mx-auto px-4 py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Sua carreira à prova de obsolescência</h2>
                    <p className="text-gray-400">
                        Não descartamos sua experiência. Nós a atualizamos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BentoCard 
                        className="md:col-span-2"
                        icon={BrainCircuit}
                        title="Análise de Competências com IA"
                        description="Nossa inteligência artificial entende micro-habilidades, contexto e potencial de transferência."
                    />
                    <BentoCard icon={TrendingUp} title="Previsão de Mercado" description="Dados em tempo real sobre habilidades em alta." />
                    <BentoCard icon={Layers} title="Upcycling Profissional" description="Reaproveite o que você já sabe com trilhas curtas." />
                    <BentoCard className="md:col-span-2" icon={ShieldCheck} title="Blindagem de Carreira" description="Alertas sobre risco de automação e planos de contingência." />
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-gradient-to-b from-card to-background border border-border rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Pronto para o próximo nível?</h2>
                        
                        <button 
                            onClick={openUpload}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-bold hover:bg-gray-200 transition-all shadow-xl hover:scale-105"
                        >
                            Começar Análise Gratuita <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
import { Upload, Zap } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom'; // <--- Importe o useOutletContext

// Interface do Contexto
interface LayoutContextType {
  openUpload: () => void;
}

export default function Home() {
    // Pegamos a função openUpload que vem do Layout
    const { openUpload } = useOutletContext<LayoutContextType>(); 

    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

            <section className="container mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">

                <h1 className="animate-fade-in-up delay-100 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl">
                    O Futuro do Trabalho <br className="hidden md:block" />
                    não é Linear. <span className="text-primary">É Circular.</span>
                </h1>

                <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-muted-foreground/80 max-w-2xl mb-10 leading-relaxed">
                    O mercado mudou, mas você não precisa começar do zero. O Carreira Circular usa IA para transformar o que você já sabe na profissão que o futuro precisa.
                </p>

                <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    
                    {/* Botão Atualizado com onClick */}
                    <button 
                        onClick={openUpload} // <--- Adicione isso aqui
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                    >
                        <Upload size={20} />
                        Anexar Meu Currículo
                    </button>

                    <Link 
                        to="/sobre"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 text-foreground font-medium transition-colors"
                    >
                        Saiba Mais
                    </Link>
                </div>
            </section>
        </div>
    )
}
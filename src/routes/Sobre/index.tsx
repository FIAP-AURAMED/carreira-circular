import { Github, Linkedin, Users, Target, Rocket, ExternalLink } from "lucide-react";
import fotoGrazi from '../../assets/image-grazi.png'
import fotoDiego from '../../assets/image-diego.png'
import fotoIsa from '../../assets/img-isa.png'

// --- DADOS DOS INTEGRANTES (Preencha aqui) ---
const TEAM = [
  {
    nome: "Grazielle Alencar",
    turma: "1TDSPO - FIAP", // Exemplo de turma
    foto: fotoGrazi, // Coloque a URL da foto real aqui
    linkedin: "https://www.linkedin.com/in/grazielle-alencar/",
    github: "https://github.com/grazialencar"

  },
  {
    nome: "Diego Andrade",
    turma: "1TDSPO - FIAP",
    foto: fotoDiego, // Coloque a URL da foto real aqui
    linkedin: "https://www.linkedin.com/in/andradedossantosdiego/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/diandrade"
  },
{
    nome: "Isabela Yamauchi",
    turma: "1TDSPO - FIAP",
    foto: fotoIsa, // Coloque a URL da foto real aqui
    linkedin: "https://www.linkedin.com/in/isabelayamauchi/",
    github: "https://github.com/IsabelaYamauchi"
}];

export default function Sobre() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        
        {/* SEÇÃO DO PROJETO */}
        <div className="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                Sobre Nós
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Reinventando Trajetórias com <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Inteligência</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-10">
                O <strong>Carreira Circular</strong> combate a obsolescência profissional utilizando IA para sugerir rotas de <em>upcycling</em>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[
                    { icon: Target, title: "Missão", desc: "Empoderar profissionais em um mercado dinâmico.", color: "text-primary" },
                    { icon: Users, title: "Para Quem", desc: "Profissionais em transição e empresas.", color: "text-blue-400" },
                    { icon: Rocket, title: "Tecnologia", desc: "Java, React, Python e IA Generativa.", color: "text-green-400" }
                ].map((item, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                        <item.icon className={`${item.color} mb-4`} size={32} />
                        <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* SEÇÃO DO TIME */}
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3 text-foreground">
                <Users className="text-primary" /> Nosso Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TEAM.map((member, index) => (
                    <div 
                        key={index} 
                        className="group relative bg-card border border-border rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]"
                    >
                        <div className="aspect-square w-full rounded-2xl overflow-hidden mb-6 relative bg-background">
                            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60 z-10" />
                            <img src={member.foto} alt={member.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        <div className="text-center relative z-20">
                            <h3 className="text-2xl font-bold text-foreground mb-1">{member.nome}</h3>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{member.turma}</p>
                            
                            <div className="flex justify-center gap-4">
                                <a href={member.linkedin} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-[#0077b5] hover:text-white transition-all text-gray-400"><Linkedin size={20} /></a>
                                <a href={member.github} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all text-gray-400"><Github size={20} /></a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { 
  BrainCircuit, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  ArrowRight, 
  Heart 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0516] border-t border-white/5 text-gray-400 font-sans relative overflow-hidden p-4">
      

        {/* --- SEÇÃO DO MEIO: LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-white/5">
          
          {/* Coluna 1 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-2">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Análise de Currículo</Link></li>
              <li><Link to="/perfil/demo" className="hover:text-primary transition-colors">Rotas de Upcycling</Link></li>
            </ul>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-2">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Nosso Time</Link></li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-2">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/central-ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/central-ajuda" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

        </div>

        {/* --- RODAPÉ INFERIOR: COPYRIGHT & SOCIAL --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-sm">
            © 2025 Carreira Circular. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span>Feito pelo 1TDSPO - FIAP</span>
          </div>

        </div>

    </footer>
  );
}
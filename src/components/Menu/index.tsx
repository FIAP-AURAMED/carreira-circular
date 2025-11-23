import { Menu as MenuIcon, X, Home, Info, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileMenu() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    const isActive = (path: string) => location.pathname === path;
    const closeMenu = () => setIsOpen(false);

    // Classes utilitárias para Mobile First
    const linkStyle = "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all active:scale-95";
    const activeStyle = "bg-primary/10 text-primary border border-primary/20";
    const idleStyle = "text-foreground/70 hover:bg-secondary hover:text-foreground";

    return (
        <div className="md:hidden">
            {/* Botão de Hambúrguer */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -mr-2 text-foreground active:bg-secondary rounded-md"
                aria-label="Abrir menu"
            >
                <MenuIcon size={28} />
            </button>

            {/* Overlay Escuro (Cobre a tela toda) */}
            <div 
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeMenu}
            />

            {/* Gaveta Lateral (Drawer) */}
            <div
                className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#0f111a] border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col p-6 h-full">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <span className="font-bold text-lg text-white">Menu</span>
                        <button onClick={closeMenu} className="p-2 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <Link to="/" onClick={closeMenu} className={`${linkStyle} ${isActive('/') ? activeStyle : idleStyle}`}>
                            <Home size={20} /> Início
                        </Link>
                        <Link to="/sobre" onClick={closeMenu} className={`${linkStyle} ${isActive('/sobre') ? activeStyle : idleStyle}`}>
                            <Info size={20} /> Sobre o Projeto
                        </Link>
                        <Link to="/central-ajuda" onClick={closeMenu} className={`${linkStyle} ${isActive('/central-ajuda') ? activeStyle : idleStyle}`}>
                            <HelpCircle size={20} /> Central de Ajuda
                        </Link>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <Link to="/login" onClick={closeMenu} className="block w-full py-3 text-center rounded-lg bg-secondary text-foreground font-semibold mb-3">
                            Fazer Login
                        </Link>
                        <Link to="/cadastro" onClick={closeMenu} className="block w-full py-3 text-center rounded-lg bg-primary text-white font-semibold">
                            Criar Conta
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileMenu() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = (path: string) => location.pathname === path;
    const closeMenu = () => setIsOpen(false);

    // Estilos dos Links Mobile
    const linkStyle = "block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors";
    const activeStyle = "bg-primary text-primary-foreground shadow-md shadow-primary/20";
    const idleStyle = "text-foreground/80 hover:bg-secondary hover:text-secondary-foreground";

    return (
        // Renderiza apenas no Mobile (md:hidden)
        <div className="md:hidden">
            {/* Botão de Abrir */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-md text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Abrir menu"
            >
                <MenuIcon className="h-7 w-7" />
            </button>

            {/* Overlay (Fundo escuro) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={closeMenu}
                />
            )}

            {/* Gaveta Lateral */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col p-6 space-y-6">
                    {/* Cabeçalho do Menu */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-card-foreground">Menu</h2>
                        <button
                            onClick={closeMenu}
                            className="p-2 -mr-2 rounded-md text-foreground/60 hover:bg-secondary hover:text-foreground transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Links Mobile */}
                    <nav className="flex flex-col space-y-2">
                        <Link to="/" onClick={closeMenu} className={`${linkStyle} ${isActive('/') ? activeStyle : idleStyle}`}>Início</Link>
                        <Link to="/sobre" onClick={closeMenu} className={`${linkStyle} ${isActive('/sobre') ? activeStyle : idleStyle}`}>Sobre o Projeto</Link>
                        <Link to="/central-ajuda" onClick={closeMenu} className={`${linkStyle} ${isActive('/central-ajuda') ? activeStyle : idleStyle}`}>Central de Ajuda</Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
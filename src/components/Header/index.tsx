import { Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from '../Menu'; // Importamos o novo Menu Mobile
import logo from '../../assets/logocarreira.svg';

interface HeaderProps {
  onOpenUpload: () => void;
}

export default function Header({ onOpenUpload }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    // Estilos dos Links Desktop
    const navLinkBase = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200";
    const navActive = "bg-primary text-primary-foreground shadow-md shadow-primary/20";
    const navIdle = "text-foreground/80 hover:bg-secondary hover:text-secondary-foreground";

    return (
        <header className='relative flex justify-between items-center px-4 h-16 shadow-md bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50'>
            
            {/* 1. ESQUERDA: Logo */}
            <div className="flex items-center z-20">
                <img src={logo} alt="Logo" className="h-10 w-auto m-2"/>
                <span className="font-bold text-lg hidden sm:block ml-2 text-foreground">Carreira Circular</span>
            </div>

            {/* 2. CENTRO: Navegação Desktop (Posição Absoluta) */}
            <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-2">
                <Link to="/" className={`${navLinkBase} ${isActive('/') ? navActive : navIdle}`}>Início</Link>
                <Link to="/sobre" className={`${navLinkBase} ${isActive('/sobre') ? navActive : navIdle}`}>Sobre o Projeto</Link>
                <Link to="/central-ajuda" className={`${navLinkBase} ${isActive('/central-ajuda') ? navActive : navIdle}`}>Central de Ajuda</Link>
            </nav>

            {/* 3. DIREITA: Ações + Menu Mobile */}
            <div className="flex items-center gap-2 md:gap-3 z-20">
                
                {/* Botão Upload (Responsivo) */}
                <button 
                    onClick={onOpenUpload}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-md shadow-primary/20"
                >
                    <Upload size={18} />
                    <span className="hidden sm:inline">Anexar CV</span>
                </button>

                {/* Botão Tema */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-secondary text-foreground transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Botão Menu Hamburguer (Só aparece no Mobile, vindo do componente) */}
                <MobileMenu />
            </div>
        </header>
    );
}
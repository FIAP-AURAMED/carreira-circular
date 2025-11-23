import { Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from '../Menu'; // Importa o menu que criamos acima
import logo from '../../assets/logocarreira.svg';

interface HeaderProps {
  onOpenUpload: () => void;
}

export default function Header({ onOpenUpload }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navLinkBase = "px-4 py-2 rounded-md text-sm font-medium transition-all hover:bg-white/5";
    const navActive = "text-primary bg-primary/10";
    const navIdle = "text-muted-foreground";

    return (
        <header className='flex items-center justify-between px-4 h-16 bg-background/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 w-full'>
            
            {/* Esquerda: Logo */}
            <Link to="/" className="flex items-center gap-2 z-50">
                <img src={logo} alt="Logo" className="h-8 w-auto"/>
                <span className="font-bold text-lg hidden sm:block text-foreground">Carreira Circular</span>
            </Link>

            {/* Centro: Nav Desktop (Some no mobile) */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                <Link to="/" className={`${navLinkBase} ${isActive('/') ? navActive : navIdle}`}>Início</Link>
                <Link to="/sobre" className={`${navLinkBase} ${isActive('/sobre') ? navActive : navIdle}`}>Sobre</Link>
                <Link to="/central-ajuda" className={`${navLinkBase} ${isActive('/central-ajuda') ? navActive : navIdle}`}>Ajuda</Link>
            </nav>

            {/* Direita: Ações + Menu Mobile */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={onOpenUpload}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <Upload size={16} />
                    <span className="hidden sm:inline">Anexar CV</span>
                </button>

                <button onClick={toggleTheme} className="p-2 text-foreground/70 hover:text-foreground">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Componente do Menu Mobile (Só aparece em telas pequenas) */}
                <MobileMenu />
            </div>
        </header>
    );
}
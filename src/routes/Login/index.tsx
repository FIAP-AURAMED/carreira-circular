import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, AlertCircle, Loader2, WifiOff, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<{ message: string; type: 'auth' | 'server' | 'network' } | null>(null);

    const [showPassword, setShowPassword] = useState(false);

    // Safe Access
    const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setApiError(null);

        try {
            console.log("🔒 Enviando credenciais para validação no Backend...");

            const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    senha: data.senha
                })
            });

            if (response.status === 401) {
                setApiError({ message: "E-mail ou senha incorretos.", type: "auth" });
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Erro no login");
            }

            const dataResponse = await response.json();
            console.log("🔍 Resposta login:", dataResponse);

            // Extrair ID do token
            const token = dataResponse.token;
            const partes = token.split("-");
            const userId = partes[1];

            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", userId);

            navigate(`/perfil/${userId}`);

        } catch (error) {
            console.error("❌ Erro no login:", error);
            setApiError({
                message: "Erro ao conectar com o servidor.",
                type: "network",
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen w-full bg-[#0B0516] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#12141c] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

                {/* Efeito de Glow no topo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-50" />

                <div className="flex bg-black/40 p-1 rounded-lg mb-8">
                    <button className="flex-1 py-2 text-sm font-medium text-white bg-white/10 rounded-md shadow-sm transition-all">
                        Entrar
                    </button>
                    <Link to="/cadastro" className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-white transition-all text-center">
                        Cadastrar
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white ml-1">Email</label>
                        <input
                            {...register("email", {
                                required: "Email é obrigatório",
                                pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido" }
                            })}
                            type="email"
                            placeholder="seu@email.com"
                            className={`w-full bg-black/40 border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary focus:ring-primary'}`}
                        />
                        {errors.email && <span className="text-xs text-red-400 pl-1">{String(errors.email.message)}</span>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-white ml-1">Senha</label>
                            <span className="text-xs text-primary cursor-pointer hover:underline">Esqueceu a senha?</span>
                        </div>

                        <div className="relative">
                            <input
                                {...register("senha", { required: "Senha é obrigatória" })}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full bg-black/40 border rounded-lg px-4 py-3 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${errors.senha ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary focus:ring-primary"
                                    }`}
                            />

                            {/* BOTÃO DO OLHO */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {errors.senha && (
                            <span className="text-xs text-red-400 pl-1">
                                {String(errors.senha.message)}
                            </span>
                        )}
                    </div>


                    {/* Componente de Erro Detalhado */}
                    {apiError && (
                        <div className={`p-4 rounded-lg text-sm flex items-start gap-3 border ${apiError.type === 'network' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                            'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {apiError.type === 'network' ? <WifiOff size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                            <div>
                                <p className="font-semibold">{apiError.type === 'network' ? "Erro de Conexão" : "Erro de Autenticação"}</p>
                                <p className="opacity-90">{apiError.message}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <> <LogIn size={18} /> Entrar </>}
                    </button>
                </form>
            </div>
        </div>
    );
}
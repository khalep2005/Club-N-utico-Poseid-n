import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Anchor } from "lucide-react";
import { useRole, Role } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";

// ── Variantes de animación ──────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── Roles de acceso rápido ──────────────────────────────────────────────────
const quickRoles: { label: string; role: Role }[] = [
  { label: "Secretaria", role: "Secretaria" },
  { label: "Jefe",       role: "Jefe"       },
  { label: "Naviero",    role: "Naviero"    },
  { label: "Finanzas",   role: "Finanzas"   },
];

export default function LoginPage() {
  const { setCurrentRole } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({
      title: "Credenciales inválidas",
      description: "Usa el acceso rápido de prueba para ingresar al sistema.",
      variant: "destructive",
    });
  }

  function handleQuickAccess(role: Role) {
    setCurrentRole(role);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Lado Izquierdo — Branding ─────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 bg-blue-950 flex-col items-center justify-center px-12 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-900 border border-blue-700">
            <Anchor className="h-10 w-10 text-amber-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Club Náutico Poseidón
          </h1>
          <p className="text-blue-300 text-lg">Gestión Administrativa Premium</p>
          <div className="mt-10 w-12 border-t border-blue-700" />
          <p className="mt-6 text-blue-400 text-sm max-w-xs leading-relaxed">
            Plataforma exclusiva para la administración interna del club. Acceso restringido a personal autorizado.
          </p>
        </motion.div>
      </div>

      {/* ── Lado Derecho — Formulario ─────────────────────────────────────── */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-8 py-16">
        <motion.div
          className="w-full max-w-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Título */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido a Bordo</h2>
            <p className="text-slate-500">Ingresa tus credenciales</p>
          </motion.div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@cnposeidon.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </motion.div>

            {/* Contraseña */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Botón submit */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-950 text-white text-sm font-semibold hover:bg-blue-900 active:scale-[0.98] transition-all"
              >
                Ingresar
              </button>
            </motion.div>
          </form>

          {/* ── Divisor acceso rápido ──────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 my-7">
            <hr className="flex-1 border-slate-200" />
            <span className="text-xs text-slate-400 whitespace-nowrap">Acceso Rápido de Prueba</span>
            <hr className="flex-1 border-slate-200" />
          </motion.div>

          {/* ── Grid de roles ─────────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            {quickRoles.map(({ label, role }) => (
              <button
                key={role}
                onClick={() => handleQuickAccess(role)}
                className="py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] transition-all"
              >
                {label}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

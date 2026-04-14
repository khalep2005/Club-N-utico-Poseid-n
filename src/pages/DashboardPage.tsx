import { Users, Ship, Navigation, DollarSign, ClipboardCheck, AlertTriangle, CreditCard, BarChart3, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { socios, embarcaciones, zarpes, solicitudes, cuentas } from "@/data/mockData";
import { useRole, type Role } from "@/contexts/RoleContext";

interface KPI {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const kpisByRole: Record<Role, KPI[]> = {
  Secretaria: [
    {
      title: "Socios Activos",
      value: socios.filter((s) => s.estado === "Al día").length,
      subtitle: `/ ${socios.length} total`,
      icon: Users,
      color: "text-secondary",
      bg: "bg-accent",
    },
    {
      title: "Solicitudes Pendientes",
      value: solicitudes.filter((s) => s.estado === "Pendiente").length,
      icon: ClipboardCheck,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ],
  Jefe: [
    {
      title: "Aprobaciones Pendientes",
      value: solicitudes.filter((s) => s.estado === "Pendiente").length,
      icon: ClipboardCheck,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Socios Activos",
      value: socios.filter((s) => s.estado === "Al día").length,
      subtitle: `/ ${socios.length}`,
      icon: Users,
      color: "text-secondary",
      bg: "bg-accent",
    },
    {
      title: "Métricas de Crecimiento",
      value: "+12%",
      icon: BarChart3,
      color: "text-success",
      bg: "bg-success/10",
    },
  ],
  Naviero: [
    {
      title: "Embarcaciones",
      value: embarcaciones.length,
      icon: Ship,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Zarpes Hoy",
      value: zarpes.length,
      icon: Navigation,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Validaciones Pendientes",
      value: embarcaciones.filter((e) => e.validacion === "Pendiente").length,
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ],
  Finanzas: [
    {
      title: "Deuda por Cobrar",
      value: `S/ ${cuentas.filter((c) => c.estado === "Moroso").reduce((a, c) => a + c.total, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Socios Morosos",
      value: socios.filter((s) => s.estado === "Moroso").length,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Pagos Recibidos",
      value: `S/ ${cuentas.filter((c) => c.estado === "Al día").reduce((a, c) => a + c.total, 0).toLocaleString()}`,
      icon: CreditCard,
      color: "text-success",
      bg: "bg-success/10",
    },
  ],
};

function estadoBadge(estado: string) {
  switch (estado) {
    case "Aprobado":
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">Aprobado</Badge>;
    case "Rechazado":
      return <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Rechazado</Badge>;
    default:
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Pendiente</Badge>;
  }
}

export default function DashboardPage() {
  const { currentRole } = useRole();
  const kpis = kpisByRole[currentRole];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bienvenido, {currentRole}</h1>
        <p className="text-muted-foreground text-sm">Resumen general del Club Náutico Poseidón</p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${kpis.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-4`}>
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {kpi.value}
                    {kpi.subtitle && <span className="text-sm font-normal text-muted-foreground"> {kpi.subtitle}</span>}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Últimas Solicitudes de Inscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell>{s.dni}</TableCell>
                  <TableCell>{s.fecha}</TableCell>
                  <TableCell>{estadoBadge(s.estado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

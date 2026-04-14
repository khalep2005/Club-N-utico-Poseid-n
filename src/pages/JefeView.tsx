import { useState } from "react";
import {
  CheckCircle, XCircle, FileText, Lock, UserMinus, ClipboardCheck, LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Solicitud {
  id: number;
  nombre: string;
  dni: string;
  fecha: string;
  clasificacion: string;
  estado: "Pendiente" | "Aprobado" | "Rechazado";
  motivoRechazo?: string;
}

interface SolicitudRetiro {
  id: number;
  nombre: string;
  fechaSolicitud: string;
  deudaPendiente: number;
  estado: "Pendiente" | "Procesado";
}

const solicitudesIniciales: Solicitud[] = [
  { id: 1, nombre: "Carlos Mendoza Ríos", dni: "45678912", fecha: "2024-03-15", clasificacion: "Pagador", estado: "Pendiente" },
  { id: 2, nombre: "María Elena Gutiérrez", dni: "32145698", fecha: "2024-03-14", clasificacion: "Pagador", estado: "Pendiente" },
  { id: 3, nombre: "Jorge Paredes Soto", dni: "78965412", fecha: "2024-03-13", clasificacion: "Pagador", estado: "Pendiente" },
];

const retirosIniciales: SolicitudRetiro[] = [
  { id: 1, nombre: "Roberto Sánchez Vargas", fechaSolicitud: "2024-02-28", deudaPendiente: 0, estado: "Pendiente" },
  { id: 2, nombre: "Ana Lucía Romero Díaz", fechaSolicitud: "2024-03-01", deudaPendiente: 450, estado: "Pendiente" },
];

export default function JefeView() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(solicitudesIniciales);
  const [retiros, setRetiros] = useState<SolicitudRetiro[]>(retirosIniciales);
  const [rechazoDialog, setRechazoDialog] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<number | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  const handleAprobar = (id: number) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: "Aprobado" as const } : s))
    );
    toast.success("Solicitud aprobada exitosamente");
  };

  const abrirRechazo = (id: number) => {
    setSolicitudSeleccionada(id);
    setMotivoRechazo("");
    setRechazoDialog(true);
  };

  const confirmarRechazo = () => {
    if (!motivoRechazo.trim()) return;
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === solicitudSeleccionada
          ? { ...s, estado: "Rechazado" as const, motivoRechazo: motivoRechazo.trim() }
          : s
      )
    );
    setRechazoDialog(false);
    toast.error("Solicitud rechazada");
  };

  const handleDarDeBaja = (id: number) => {
    setRetiros((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "Procesado" as const } : r))
    );
    toast.success("Socio dado de baja exitosamente");
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel del Jefe</h1>
        <p className="text-sm text-muted-foreground">Gestión de aprobaciones, liquidaciones y retiros</p>
      </div>

      {/* Bandeja de Aprobaciones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            Bandeja de Aprobaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell>{s.dni}</TableCell>
                  <TableCell>{s.fecha}</TableCell>
                  <TableCell>
                    <Badge className="bg-success text-success-foreground hover:bg-success/90">
                      {s.clasificacion}
                    </Badge>
                  </TableCell>
                  <TableCell>{estadoBadge(s.estado)}</TableCell>
                  <TableCell className="text-right">
                    {s.estado === "Pendiente" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => handleAprobar(s.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => abrirRechazo(s.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        {s.estado === "Rechazado" && s.motivoRechazo
                          ? `Motivo: ${s.motivoRechazo}`
                          : "Procesado"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Liquidaciones y Retiros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <LogOut className="h-4 w-4 text-muted-foreground" />
            Solicitudes de Retiro Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Socio</TableHead>
                <TableHead>Fecha de Solicitud</TableHead>
                <TableHead>Deuda Pendiente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retiros.map((r) => {
                const tieneDeuda = r.deudaPendiente > 0;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.nombre}</TableCell>
                    <TableCell>{r.fechaSolicitud}</TableCell>
                    <TableCell>
                      <span className={tieneDeuda ? "text-destructive font-semibold" : "text-success font-semibold"}>
                        S/ {r.deudaPendiente.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tieneDeuda ? (
                        <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Con Deuda</Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground hover:bg-success/90">Sin Deuda</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.estado === "Procesado" ? (
                        <span className="text-xs text-muted-foreground italic">Procesado</span>
                      ) : tieneDeuda ? (
                        <Button size="sm" variant="outline" disabled className="gap-1.5">
                          <Lock className="h-3.5 w-3.5" />
                          Dar de Baja
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDarDeBaja(r.id)}
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                          Dar de Baja
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Rechazo */}
      <Dialog open={rechazoDialog} onOpenChange={setRechazoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-destructive" />
              Motivo de Rechazo
            </DialogTitle>
            <DialogDescription>
              Ingrese el motivo de rechazo. Este documento es obligatorio según el reglamento del club.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Describa el motivo de rechazo de la solicitud..."
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRechazoDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarRechazo}
              disabled={!motivoRechazo.trim()}
            >
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

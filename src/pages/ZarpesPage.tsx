import { useState } from "react";
import { Plus, AlertTriangle, Navigation, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppData } from "@/contexts/AppDataContext";
import { zarpeEsPermitido } from "@/lib/businessRules";
import { useToast } from "@/hooks/use-toast";

function EstadoBadge({ estado }: { estado: string }) {
  switch (estado) {
    case "Aprobado":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>;
    case "Rechazado":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rechazado</Badge>;
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
  }
}

export default function ZarpesPage() {
  const { state, dispatch } = useAppData();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState("");
  const [selectedEmb, setSelectedEmb] = useState("");
  const [fecha, setFecha] = useState("");
  const [destino, setDestino] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [horaRetorno, setHoraRetorno] = useState("");

  const socioData = state.socios.find((s) => s.id === selectedSocio);
  const embsDelSocio = state.embarcaciones.filter((e) => !selectedSocio || e.socioId === selectedSocio);

  // Validación de zarpe usando businessRules
  const validacion = selectedSocio && selectedEmb
    ? zarpeEsPermitido(selectedSocio, selectedEmb, state.socios, state.embarcaciones)
    : null;

  const puedeZarpar = validacion?.permitido === true;

  function resetForm() {
    setSelectedSocio("");
    setSelectedEmb("");
    setFecha("");
    setDestino("");
    setHoraSalida("");
    setHoraRetorno("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!puedeZarpar || !socioData) return;
    const emb = state.embarcaciones.find((em) => em.id === selectedEmb);
    if (!emb) return;

    dispatch({
      type: "CREAR_ZARPE",
      payload: {
        embarcacion: emb.nombre,
        socio: socioData.nombre,
        socioId: selectedSocio,
        fechaSalida: fecha,
        horaSalida,
        horaRetorno,
        destino,
      },
    });
    toast({ title: "Zarpe registrado", description: "El permiso de salida ha sido creado." });
    setOpen(false);
    resetForm();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Zarpes</h1>
          <p className="text-muted-foreground text-sm">Control de permisos de salida</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nuevo Zarpe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Permiso de Salida</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Selector de socio */}
              <div className="space-y-1.5">
                <Label>Socio</Label>
                <Select value={selectedSocio} onValueChange={(v) => { setSelectedSocio(v); setSelectedEmb(""); }}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar socio" /></SelectTrigger>
                  <SelectContent>
                    {state.socios.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nombre} {s.estado === "Moroso" ? "⚠️" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alert de estado financiero */}
              {selectedSocio && socioData?.estado === "Moroso" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Zarpe Bloqueado</AlertTitle>
                  <AlertDescription>
                    {socioData.nombre} mantiene deuda pendiente. No se puede autorizar el zarpe hasta regularizar su situación financiera.
                  </AlertDescription>
                </Alert>
              )}

              {selectedSocio && socioData?.estado === "Al día" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Socio habilitado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {socioData.nombre} está al día y puede zarpar.
                  </AlertDescription>
                </Alert>
              )}

              {/* Selector de embarcación — filtrado por socio */}
              <div className="space-y-1.5">
                <Label>Embarcación</Label>
                <Select value={selectedEmb} onValueChange={setSelectedEmb} disabled={!selectedSocio}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar embarcación" /></SelectTrigger>
                  <SelectContent>
                    {embsDelSocio.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nombre} {e.validacion === "Pendiente" ? "⚠️ Sin validar" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alert si la embarcación no está validada */}
              {selectedEmb && validacion && !validacion.permitido && socioData?.estado !== "Moroso" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Embarcación no habilitada</AlertTitle>
                  <AlertDescription>{validacion.razon}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Fecha de Salida</Label>
                  <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Destino</Label>
                  <Input placeholder="Ej: Islas Palomino" value={destino} onChange={(e) => setDestino(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Hora Salida</Label>
                  <Input type="time" value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Hora Retorno Estimada</Label>
                  <Input type="time" value={horaRetorno} onChange={(e) => setHoraRetorno(e.target.value)} required />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!puedeZarpar}>
                  {!selectedSocio || !selectedEmb ? "Completar datos" : puedeZarpar ? "Registrar Zarpe" : "Bloqueado"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de zarpes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            Zarpes Programados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Embarcación</TableHead>
                <TableHead>Socio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Retorno</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.zarpes.map((z) => (
                <TableRow key={z.id}>
                  <TableCell className="font-medium">{z.embarcacion}</TableCell>
                  <TableCell>{z.socio}</TableCell>
                  <TableCell className="text-muted-foreground">{z.fechaSalida}</TableCell>
                  <TableCell className="text-muted-foreground">{z.horaSalida}</TableCell>
                  <TableCell className="text-muted-foreground">{z.horaRetorno}</TableCell>
                  <TableCell>{z.destino}</TableCell>
                  <TableCell><EstadoBadge estado={z.estado} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

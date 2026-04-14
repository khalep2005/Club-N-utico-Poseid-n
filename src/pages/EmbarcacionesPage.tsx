import { useState } from "react";
import { Ship, Anchor, Plus, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import FormularioTripulante from "@/components/FormularioTripulante";
import { socios } from "@/data/mockData";

// ── Helpers visuales ────────────────────────────────────────────────────────

function ValidacionBadge({ v }: { v: string }) {
  return v === "Validado" ? (
    <Badge className="bg-green-100 text-green-800 border-green-200">Validado</Badge>
  ) : (
    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
  );
}

function radaClasses(estado: string) {
  switch (estado) {
    case "Ocupado":      return "bg-blue-900 border-blue-700 text-white cursor-pointer hover:bg-blue-800 transition-colors";
    case "Disponible":   return "bg-teal-50 border-teal-300 text-teal-800 cursor-pointer hover:bg-teal-100 transition-colors";
    default:             return "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed opacity-60";
  }
}

// ── Componente principal ────────────────────────────────────────────────────

export default function EmbarcacionesPage() {
  const { state, dispatch } = useAppData();
  const { toast } = useToast();

  // Dialog nueva embarcación
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({ nombre: "", tipo: "", eslora: "", socioId: "" });

  // Dialog asignar rada
  const [radaDialog, setRadaDialog] = useState<{ radaId: string; modo: "asignar" | "liberar" } | null>(null);
  const [embSeleccionada, setEmbSeleccionada] = useState("");

  // Embarcaciones sin rada asignada (para asignar)
  const embSinRada = state.embarcaciones.filter((e) => {
    const radaOcupada = state.radas.find((r) => r.embarcacion === e.nombre && r.estado === "Ocupado");
    return !radaOcupada;
  });

  function handleRegistrar(e: React.FormEvent) {
    e.preventDefault();
    const socio = socios.find((s) => s.id === form.socioId);
    if (!socio) return;
    dispatch({
      type: "REGISTRAR_EMBARCACION",
      payload: { nombre: form.nombre, tipo: form.tipo, eslora: form.eslora, socioId: form.socioId, propietario: socio.nombre },
    });
    toast({ title: "Embarcación registrada", description: `${form.nombre} agregada con validación pendiente.` });
    setForm({ nombre: "", tipo: "", eslora: "", socioId: "" });
    setOpenNew(false);
  }

  function handleRadaClick(radaId: string, estado: string) {
    if (estado === "Mantenimiento") return;
    setEmbSeleccionada("");
    setRadaDialog({ radaId, modo: estado === "Disponible" ? "asignar" : "liberar" });
  }

  function handleAsignar() {
    if (!embSeleccionada || !radaDialog) return;
    dispatch({ type: "ASIGNAR_RADA", payload: { radaId: radaDialog.radaId, embarcacionId: embSeleccionada } });
    toast({ title: "Rada asignada", description: "La embarcación ha sido asignada al espacio." });
    setRadaDialog(null);
  }

  function handleLiberar() {
    if (!radaDialog) return;
    dispatch({ type: "DESASIGNAR_RADA", payload: { radaId: radaDialog.radaId } });
    toast({ title: "Rada liberada", description: "El espacio de amarre está disponible." });
    setRadaDialog(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Embarcaciones y Radas</h1>
        <p className="text-muted-foreground text-sm">Control de naves, espacios de amarre y tripulación</p>
      </div>

      <Tabs defaultValue="embarcaciones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="embarcaciones" className="gap-2">
            <Ship className="h-4 w-4" /> Flota
          </TabsTrigger>
          <TabsTrigger value="radas" className="gap-2">
            <Anchor className="h-4 w-4" /> Radas
          </TabsTrigger>
          <TabsTrigger value="tripulantes" className="gap-2">
            Tripulantes
          </TabsTrigger>
        </TabsList>

        {/* ── TAB: FLOTA ─────────────────────────────────────────────────── */}
        <TabsContent value="embarcaciones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Gestión de Flota</CardTitle>
              <Dialog open={openNew} onOpenChange={setOpenNew}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Nueva Embarcación
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Embarcación</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRegistrar} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Nombre</Label>
                      <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required placeholder="Ej: Neptuno II" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Tipo</Label>
                        <Input value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} required placeholder="Velero, Yate..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Eslora</Label>
                        <Input value={form.eslora} onChange={(e) => setForm({ ...form, eslora: e.target.value })} required placeholder="Ej: 12m" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Socio Propietario</Label>
                      <Select value={form.socioId} onValueChange={(v) => setForm({ ...form, socioId: v })}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar socio" /></SelectTrigger>
                        <SelectContent>
                          {socios.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setOpenNew(false)}>Cancelar</Button>
                      <Button type="submit">Registrar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Eslora</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Capitanía</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.embarcaciones.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{e.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{e.eslora}</TableCell>
                      <TableCell>{e.propietario}</TableCell>
                      <TableCell><ValidacionBadge v={e.validacion} /></TableCell>
                      <TableCell>
                        {e.validacion === "Pendiente" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => {
                              dispatch({ type: "VALIDAR_CAPITANIA", payload: { embarcacionId: e.id } });
                              toast({ title: "Capitanía validada", description: `${e.nombre} ha sido validada.` });
                            }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Validar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB: RADAS ─────────────────────────────────────────────────── */}
        <TabsContent value="radas">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mapa de Espacios de Amarre</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Haz clic en una rada disponible para asignar una nave, o en una ocupada para liberarla.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {state.radas.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-lg border p-4 text-center space-y-1 ${radaClasses(r.estado)}`}
                    onClick={() => handleRadaClick(r.id, r.estado)}
                  >
                    <p className="font-bold text-sm">{r.codigo}</p>
                    <p className="text-xs font-medium">{r.estado}</p>
                    {r.embarcacion && <p className="text-xs opacity-80">{r.embarcacion}</p>}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal-200 border border-teal-300" /> Disponible</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-900" /> Ocupado</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300" /> Mantenimiento</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB: TRIPULANTES ───────────────────────────────────────────── */}
        <TabsContent value="tripulantes">
          <FormularioTripulante />
        </TabsContent>
      </Tabs>

      {/* ── Dialog asignar / liberar rada ──────────────────────────────── */}
      <Dialog open={!!radaDialog} onOpenChange={(v) => { if (!v) setRadaDialog(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {radaDialog?.modo === "asignar" ? "Asignar Embarcación" : "Liberar Rada"}
            </DialogTitle>
          </DialogHeader>
          {radaDialog?.modo === "asignar" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Embarcación sin rada</Label>
                <Select value={embSeleccionada} onValueChange={setEmbSeleccionada}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar nave" /></SelectTrigger>
                  <SelectContent>
                    {embSinRada.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRadaDialog(null)}>Cancelar</Button>
                <Button onClick={handleAsignar} disabled={!embSeleccionada}>Asignar</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">¿Confirmas liberar este espacio de amarre?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRadaDialog(null)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleLiberar}>Liberar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";

export default function FormularioTripulante() {
  const { state, dispatch } = useAppData();
  const { toast } = useToast();
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [embarcacionId, setEmbarcacionId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !especialidad.trim() || !embarcacionId) return;
    dispatch({ type: "REGISTRAR_TRIPULANTE", payload: { nombre, especialidad, embarcacionId } });
    toast({ title: "Tripulante registrado", description: `${nombre} agregado como ${especialidad}` });
    setNombre("");
    setEspecialidad("");
    setEmbarcacionId("");
  }

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            Registrar Tripulante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Especialidad</Label>
              <Input
                placeholder="Ej: Capitán, Marinero"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Embarcación</Label>
              <Select value={embarcacionId} onValueChange={setEmbarcacionId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar nave" /></SelectTrigger>
                <SelectContent>
                  {state.embarcaciones.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="gap-2">
              <UserPlus className="h-4 w-4" /> Registrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de tripulantes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tripulantes Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {state.tripulantes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No hay tripulantes registrados aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Embarcación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.tripulantes.map((t) => {
                  const emb = state.embarcaciones.find((e) => e.id === t.embarcacionId);
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{t.especialidad}</TableCell>
                      <TableCell className="text-muted-foreground">{emb?.nombre ?? "—"}</TableCell>
                      <TableCell>
                        {t.estado === "Autorizado" ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Autorizado</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {t.estado === "Pendiente" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => {
                              dispatch({ type: "AUTORIZAR_TRIPULANTE", payload: { tripulanteId: t.id } });
                              toast({ title: "Tripulante autorizado", description: `${t.nombre} ha sido autorizado.` });
                            }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Autorizar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

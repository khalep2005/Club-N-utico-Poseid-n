import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SolicitudLocal {
  id: string;
  dni: string;
  nombre: string;
  clasificacion: string;
  estado: string;
  fecha: string;
}

const solicitudesIniciales: SolicitudLocal[] = [
  { id: "1", dni: "45678912", nombre: "María López Torres", clasificacion: "Pagador", estado: "En Evaluación", fecha: "2024-06-10" },
  { id: "2", dni: "32165498", nombre: "José Ramírez Cruz", clasificacion: "Esporádico", estado: "En Evaluación", fecha: "2024-06-09" },
  { id: "3", dni: "78945612", nombre: "Ana Castillo Vega", clasificacion: "Pagador", estado: "En Evaluación", fecha: "2024-06-08" },
];

export default function SecretariaView() {
  const [open, setOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState<SolicitudLocal[]>(solicitudesIniciales);
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [clasificacion, setClasificacion] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || !nombre || !clasificacion) return;

    const nueva: SolicitudLocal = {
      id: crypto.randomUUID(),
      dni,
      nombre,
      clasificacion,
      estado: "En Evaluación",
      fecha: new Date().toISOString().split("T")[0],
    };
    setSolicitudes([nueva, ...solicitudes]);
    setDni("");
    setNombre("");
    setClasificacion("");
    setOpen(false);
    toast({ title: "Solicitud registrada", description: `Se registró la solicitud de ${nombre}.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Secretaría</h1>
        <p className="text-muted-foreground text-sm">Gestión de inscripciones y solicitudes de nuevos socios</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 text-base px-6 py-5">
            <Plus className="h-5 w-5" /> Nueva Solicitud de Socio
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Solicitud de Socio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                placeholder="Ej: 45678912"
                maxLength={8}
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clasificacion">Clasificación de Antecedentes</Label>
              <Select value={clasificacion} onValueChange={setClasificacion}>
                <SelectTrigger id="clasificacion">
                  <SelectValue placeholder="Seleccionar clasificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pagador">Pagador</SelectItem>
                  <SelectItem value="Esporádico">Esporádico</SelectItem>
                  <SelectItem value="Renuente">Renuente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Registrar Solicitud</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Últimas Solicitudes Ingresadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DNI</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.dni}</TableCell>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-muted-foreground">
                      {s.clasificacion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
                      {s.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { socios } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

function categoriaBadge(cat: string) {
  switch (cat) {
    case "Pagador":
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">Pagador</Badge>;
    case "Renuente":
      return <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Renuente</Badge>;
    default:
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Esporádico</Badge>;
  }
}

function estadoBadge(estado: string) {
  return estado === "Al día"
    ? <Badge className="bg-success text-success-foreground hover:bg-success/90">Al día</Badge>
    : <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Moroso</Badge>;
}

export default function SociosPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = socios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.dni.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast({ title: "Solicitud enviada", description: "La solicitud de inscripción ha sido registrada." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Socios</h1>
          <p className="text-muted-foreground text-sm">Gestión de socios del club</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Inscripción</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres</Label>
                  <Input placeholder="Nombres completos" required />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos</Label>
                  <Input placeholder="Apellidos completos" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>DNI</Label>
                  <Input placeholder="12345678" maxLength={8} required />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="987654321" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Categoría Solicitada</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagador">Pagador</SelectItem>
                    <SelectItem value="esporadico">Esporádico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Antecedentes en otros clubes</Label>
                <Textarea placeholder="Indique clubes anteriores, motivos de retiro, etc." />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">Enviar Solicitud</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ingreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell>{s.dni}</TableCell>
                  <TableCell>{categoriaBadge(s.categoria)}</TableCell>
                  <TableCell>{estadoBadge(s.estado)}</TableCell>
                  <TableCell className="text-muted-foreground">{s.fechaIngreso}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
export function ReportsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Rapports</h1>
      <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-4 w-fit">
            <BarChart3 className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Module de Rapports en Construction</CardTitle>
          <CardDescription>
            Cette section est en cours de développement et sera bientôt disponible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Vous pourrez bientôt générer des rapports détaillés et exporter des données.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
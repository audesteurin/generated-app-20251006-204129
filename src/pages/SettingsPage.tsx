import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
export function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-4 w-fit">
            <Settings className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Module de Paramètres en Construction</CardTitle>
          <CardDescription>
            Cette section est en cours de développement et sera bientôt disponible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La gestion des utilisateurs, des rôles et des configurations sera disponible ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
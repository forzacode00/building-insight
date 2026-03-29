import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/prosjekt": "Prosjekt",
  "/datainput": "Datainput",
  "/simulering": "Simulering",
  "/sammenligning": "Sammenligning",
  "/nettverkskart": "Nettverkskart",
  "/sd-live": "SD Live & What-If",
  
};

export default function StubPage() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "Side";

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground">Kommer i neste fase</p>
      </div>
    </div>
  );
}

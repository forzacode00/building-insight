import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "./components/AppLayout";
import Driftsmorgen from "./pages/Driftsmorgen";
import Datainput from "./pages/Datainput";
import Simulering from "./pages/Simulering";
import StubPage from "./pages/StubPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Driftsmorgen />} />
            <Route path="/prosjekt" element={<StubPage />} />
            <Route path="/datainput" element={<Datainput />} />
            <Route path="/simulering" element={<Simulering />} />
            <Route path="/sammenligning" element={<StubPage />} />
            <Route path="/nettverkskart" element={<StubPage />} />
            <Route path="/sd-live" element={<StubPage />} />
            <Route path="/priser" element={<StubPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

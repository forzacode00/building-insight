import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimProvider } from "@/lib/SimContext";
import { AppLayout } from "./components/AppLayout";
import Story from "./pages/Story";
import Driftsmorgen from "./pages/Driftsmorgen";
import Datainput from "./pages/Datainput";
import Simulering from "./pages/Simulering";
import Sammenligning from "./pages/Sammenligning";
import Nettverkskart from "./pages/Nettverkskart";
import SDLive from "./pages/SDLive";

import Prosjekt from "./pages/Prosjekt";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Story />} />
            <Route path="/simulator" element={<AppLayout />}>
              <Route index element={<Driftsmorgen />} />
              <Route path="prosjekt" element={<Prosjekt />} />
              <Route path="datainput" element={<Datainput />} />
              <Route path="simulering" element={<Simulering />} />
              <Route path="sammenligning" element={<Sammenligning />} />
              <Route path="nettverkskart" element={<Nettverkskart />} />
              <Route path="sd-live" element={<SDLive />} />
              
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SimProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

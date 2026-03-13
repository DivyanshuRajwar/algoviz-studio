import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index.tsx";
import SortingPage from "./pages/SortingPage.tsx";
import SearchingPage from "./pages/SearchingPage.tsx";
import DataStructuresPage from "./pages/DataStructuresPage.tsx";
import TowerOfHanoiPage from "./pages/TowerOfHanoiPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/searching" element={<SearchingPage />} />
          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/tower-of-hanoi" element={<TowerOfHanoiPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { TableProvider, useTable } from "@/contexts/TableContext";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTableById } from "@/services/tableService";

// Helper component to handle URL params
const TableRouteHandler = () => {
  const { tableId } = useParams();
  const { setTableSession } = useTable();
  const navigate = useNavigate();

  useEffect(() => {
    const validateTable = async () => {
      if (tableId) {
        const table = await getTableById(tableId);
        if (table) {
          setTableSession(table.id, table.codigo);
        }
        // Always navigate to home to clean URL, or stay? User asked for /:id link.
        // Let's keep the parameter or redirect to home with state set.
        // Redirecting to clear URL might be cleaner but user might want to see the ID.
        // Let's keep it simple: Just set session.
      }
    };
    validateTable();
  }, [tableId, setTableSession]);

  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TableProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:tableId" element={<TableRouteHandler />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TableProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

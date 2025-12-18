import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/AuthPage";
import MeusPedidos from "@/pages/MeusPedidos";
import About from "@/pages/About";
import Returns from "@/pages/Returns";
import Privacy from "@/pages/Privacy";
import Care from "@/pages/Care";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/produto/:id" component={ProductDetail} />
      <Route path="/carrinho" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/sucesso" component={Success} />
      <Route path="/conta" component={AuthPage} />
      <ProtectedRoute path="/meus-pedidos" component={MeusPedidos} />
      <Route path="/painel-elatho-2025" component={Admin} />
      <Route path="/sobre" component={About} />
      <Route path="/trocas" component={Returns} />
      <Route path="/privacidade" component={Privacy} />
      <Route path="/cuidados" component={Care} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contato" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

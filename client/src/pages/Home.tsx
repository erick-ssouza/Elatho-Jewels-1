import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { Product } from "@shared/schema";
export default function Home() {
  <div
  style={{
    background: "red",
    color: "white",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
  }}
>
  🚨 TESTE DEPLOY VERCEL — SE VOCÊ ESTÁ VENDO ISSO, O DEPLOY FUNCIONOU
</div>
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <Hero />
        <ProductGrid products={products} isLoading={isLoading} />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

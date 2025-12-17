import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const categories = ["Todos", "Colares", "Brincos", "Anéis", "Pulseiras"] as const;

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const categoria = params.get("categoria");
    if (categoria && categories.includes(categoria as any)) {
      setActiveCategory(categoria);
    } else {
      setActiveCategory("Todos");
    }
  }, [location]);

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (isLoading) {
    return (
      <section id="produtos" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nossa Coleção
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Peças únicas criadas com amor e dedicação para realçar sua beleza natural
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Skeleton key={cat} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/5] w-full rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Nossa Coleção
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Peças únicas criadas com amor e dedicação para realçar sua beleza natural
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-full px-6"
            onClick={() => setActiveCategory(cat)}
            data-testid={`button-category-${cat.toLowerCase()}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

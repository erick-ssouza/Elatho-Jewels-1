// 🛍️ PRODUCT GRID - 6 PRODUTOS POR LINHA
// Arquivo: client/src/components/ProductGrid.tsx

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
      <section id="produtos" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
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

        {/* GRID 6 COLUNAS EM DESKTOP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Nossa Coleção
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Peças únicas criadas com amor e dedicação para realçar sua beleza natural
        </p>
      </div>

      {/* Filtros de Categoria */}
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

      {/* Grid de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      ) : (
        <div>
          {/* GRID RESPONSIVO: 2 cols mobile → 6 cols desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Contador de produtos */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
              {activeCategory !== "Todos" && ` em ${activeCategory}`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
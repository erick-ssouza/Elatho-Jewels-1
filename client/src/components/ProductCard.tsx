import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Card
      className="group overflow-visible border-0 shadow-none bg-transparent"
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link href={`/produto/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button
                className="w-full bg-white text-foreground hover:bg-white/90 shadow-lg text-sm py-2"
                data-testid={`button-view-product-${product.id}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.category}
          </span>
          <h3 
            className="font-medium text-foreground line-clamp-2 text-sm min-h-[2.5rem]" 
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <p 
            className="text-lg font-semibold text-primary" 
            data-testid={`text-product-price-${product.id}`}
          >
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            12x de {formatPrice(product.price / 12)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

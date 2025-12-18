import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Store } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + itemsPerPage >= testimonials.length ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [itemsPerPage, testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
            <div className="flex gap-6 justify-center mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 max-w-sm h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-serif mb-2">
          O que nossos clientes estão dizendo
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Veja as avaliações de quem já comprou
        </p>

        <div className="relative">
          <div className="flex gap-6 justify-center">
            {visibleTestimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="flex-1 max-w-sm hover:shadow-lg transition-shadow"
                data-testid={`testimonial-${testimonial.id}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    "{testimonial.text}"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(testimonial.date)}
                  </p>
                  
                  {testimonial.adminResponse && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-medium text-pink-600">Resposta da Elatho</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{testimonial.adminResponse}"
                      </p>
                      {testimonial.adminResponseDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(testimonial.adminResponseDate)}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex"
            onClick={goToPrev}
            data-testid="button-testimonial-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex"
            onClick={goToNext}
            data-testid="button-testimonial-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {[...Array(Math.ceil(testimonials.length / itemsPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * itemsPerPage)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerPage) === i
                  ? "bg-pink-500"
                  : "bg-gray-300"
              }`}
              data-testid={`dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    text: "Apaixonada pelas semijoias! Qualidade impecável e entrega rápida. Já sou cliente fiel!",
    date: "2024-12-10",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Ana Paula",
    rating: 5,
    text: "Colar Lua Crescente é perfeito! Recebo elogios toda vez que uso. Vale cada centavo!",
    date: "2024-12-08",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 3,
    name: "Juliana Costa",
    rating: 5,
    text: "Primeira compra e já quero mais! Embalagem linda e produto exatamente como nas fotos.",
    date: "2024-12-05",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: 4,
    name: "Carla Mendes",
    rating: 4,
    text: "Muito bonito, brilho incrível! Apenas a entrega demorou um pouco mais que o esperado.",
    date: "2024-12-03",
    avatar: "https://i.pravatar.cc/150?img=20"
  },
  {
    id: 5,
    name: "Fernanda Lima",
    rating: 5,
    text: "Atendimento nota 10! Tiraram todas minhas dúvidas pelo WhatsApp. Super recomendo!",
    date: "2024-12-01",
    avatar: "https://i.pravatar.cc/150?img=25"
  },
  {
    id: 6,
    name: "Patricia Santos",
    rating: 5,
    text: "Brincos lindos e delicados! Qualidade surpreendente pelo preço. Já indiquei para amigas!",
    date: "2024-11-28",
    avatar: "https://i.pravatar.cc/150?img=32"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

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
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + itemsPerPage >= testimonials.length ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [itemsPerPage]);

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const formatDate = (dateStr: string) => {
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
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
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

import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import type { Product } from "@shared/schema";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getItemCount } = useCart();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const itemCount = getItemCount();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const searchResults = searchTerm.length > 2
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/?categoria=Colares", label: "Colares" },
    { href: "/?categoria=Brincos", label: "Brincos" },
    { href: "/?categoria=Anéis", label: "Anéis" },
    { href: "/?categoria=Pulseiras", label: "Pulseiras" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <Link href="/" data-testid="link-home">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-serif cursor-pointer">
              Elatho Semijoias
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                <span
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="pl-9 w-48 lg:w-64"
                  data-testid="input-search"
                />
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                      onClick={() => {
                        setLocation(`/produto/${product.id}`);
                        setSearchTerm("");
                        setShowSearchResults(false);
                      }}
                      data-testid={`search-result-${product.id}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-sm text-pink-600 font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="https://wa.me/5519998229202"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button variant="ghost" size="icon" data-testid="button-whatsapp">
                <SiWhatsapp className="h-5 w-5 text-green-500" />
              </Button>
            </a>

            <a
              href="https://instagram.com/elathosemijoias"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <SiInstagram className="h-5 w-5 text-pink-500" />
              </Button>
            </a>

            <Link href="/contato" className="hidden sm:block" data-testid="link-contato">
              <Button variant="ghost" size="sm">
                Contato
              </Button>
            </Link>

            <Link href={user ? "/meus-pedidos" : "/conta"} data-testid="link-account">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/carrinho" data-testid="link-cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    data-testid="text-cart-count"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-2">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
                data-testid="input-search-mobile"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
              >
                <div
                  className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <Link
              href="/contato"
              onClick={() => setIsMenuOpen(false)}
              data-testid="link-mobile-nav-contato"
            >
              <div className="block py-3 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground">
                Contato
              </div>
            </Link>
            <Link
              href={user ? "/meus-pedidos" : "/conta"}
              onClick={() => setIsMenuOpen(false)}
              data-testid="link-mobile-nav-conta"
            >
              <div className="block py-3 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground">
                {user ? "Meus Pedidos" : "Minha Conta"}
              </div>
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <a
                href="https://wa.me/5519998229202"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <SiWhatsapp className="h-5 w-5 text-green-500" />
                </Button>
              </a>
              <a
                href="https://instagram.com/elathosemijoias"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <SiInstagram className="h-5 w-5 text-pink-500" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

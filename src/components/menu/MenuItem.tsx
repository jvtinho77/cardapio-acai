import { useState } from "react";
import { Heart, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isPopular?: boolean;
  onClick?: () => void;
  onAddToCart?: () => void;
  compact?: boolean;
}

const MenuItem = ({ name, description, price, image, rating, isNew, isPopular, onClick, onAddToCart, compact = false }: MenuItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  if (compact) {
    return (
      <article
        onClick={onClick}
        className="group relative bg-card rounded-2xl overflow-hidden shadow-sm border border-border/40 cursor-pointer h-full flex flex-col active:scale-[0.98] transition-transform duration-200"
      >
        {/* Compact Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Subtle gradient overlay for better text contrast if we had overlay text, keeping it clean for now */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

          {/* Minimal Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {isNew && (
              <div className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-white/90 text-primary backdrop-blur-sm shadow-sm">
                NOVO
              </div>
            )}
            {isPopular && (
              <div className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-orange-500 text-white shadow-sm">
                TOP
              </div>
            )}
          </div>

          {/* Floating Add Button - iOS style circle */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "absolute bottom-2 right-2 p-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 z-10 flex items-center justify-center",
              isAdded
                ? "bg-green-500 text-white"
                : "bg-white/90 text-foreground hover:bg-white hover:scale-110"
            )}
          >
            {isAdded ? (
              <div className="text-[10px] font-bold">✓</div>
            ) : (
              <Plus className="w-5 h-5 text-primary" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Compact Content */}
        <div className="p-3 flex flex-col gap-1 flex-grow">
          <div className="flex justify-between items-start gap-1">
            <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
              {name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="font-bold text-sm text-primary">
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // STANDARD LIST LAYOUT (Unchanged mostly, just cleaner code structure)
  return (
    <article
      onClick={onClick}
      className="group relative bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out border border-border/50 hover:border-primary/20 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges - Glassmorphic */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-primary/90 text-primary-foreground backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-left-2">
              Novo
            </div>
          )}
          {isPopular && (
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-orange-500/90 text-white backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-left-2 delay-100">
              Popular
            </div>
          )}
        </div>

        {/* Like button - Floating Glass */}
        <button
          onClick={handleLike}
          className={cn(
            "absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg",
            isLiked
              ? "bg-red-500 text-white scale-110"
              : "bg-white/20 text-white hover:bg-white/40"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </button>

        {/* Rating - Floating Glass Bubble */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white shadow-lg">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap bg-primary/5 px-2 py-0.5 rounded-md">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Add to cart button - Modern & Fluid */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "mt-2 w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden",
            isAdded
              ? "bg-green-500 text-white shadow-green-500/25 shadow-lg scale-[0.98]"
              : "bg-primary text-primary-foreground shadow-primary/25 shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
          )}
        >
          <div className={cn("flex items-center gap-2 transition-all duration-300", isAdded ? "translate-y-[-150%] opacity-0 absolute" : "opacity-100")}>
            <Plus className="w-5 h-5" />
            ADICIONAR
          </div>

          <div className={cn("flex items-center gap-2 absolute transition-all duration-300", isAdded ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0")}>
            <span className="text-lg">✓</span>
            ADICIONADO
          </div>
        </button>
      </div>
    </article>
  );
};

export default MenuItem;

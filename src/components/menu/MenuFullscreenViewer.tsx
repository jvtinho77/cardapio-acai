import { useState, useRef, useEffect } from "react";
import { Heart, Minus, Plus, Star, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItemData } from "@/data/menuData";

interface MenuFullscreenViewerProps {
  items: MenuItemData[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const MenuFullscreenViewer = ({ items, initialIndex, isOpen, onClose }: MenuFullscreenViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const itemHeight = window.innerHeight;
      containerRef.current.scrollTo({
        top: initialIndex * itemHeight,
        behavior: "instant",
      });
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const itemHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button - Minimalist & Glass */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all duration-300"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Progress indicator - Minimalist Pill */}
      <div className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
        <span className="text-xs font-bold tracking-wider text-white">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <MenuItemSlide key={item.id} item={item} isActive={index === currentIndex} />
        ))}
      </div>
    </div>
  );
};

interface MenuItemSlideProps {
  item: MenuItemData;
  isActive: boolean;
}

const MenuItemSlide = ({ item, isActive }: MenuItemSlideProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const totalPrice = item.price * quantity;

  return (
    <div
      className="h-[100dvh] w-full snap-start snap-always relative flex flex-col justify-end select-none cursor-pointer"
      onDoubleClick={toggleInfo}
    >
      {/* Full screen image with better gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 transition-opacity duration-500",
            isInfoVisible ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {/* Like button - Floating Glass */}
      <div className={cn("transition-opacity duration-500", isInfoVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className={cn(
            "absolute right-6 top-[50%] z-10 p-3.5 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg border border-white/10",
            isLiked ? "bg-red-500 text-white border-red-500" : "bg-black/30 text-white hover:bg-black/50"
          )}
        >
          <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
        </button>
      </div>

      {/* Bottom content - Minimalist Typography */}
      <div className={cn(
        "relative z-10 p-6 pb-24 flex flex-col gap-4 transition-all duration-500 transform",
        isInfoVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}>
        {/* Badges */}
        <div className="flex gap-2">
          {item.isNew && (
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/20">
              Novo
            </div>
          )}
          {item.isPopular && (
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
              Popular
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title and description */}
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight tracking-tight">{item.name}</h2>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-2 font-light">
            {item.description}
          </p>
        </div>

        {/* Price and quantity */}
        <div className="flex items-end justify-between gap-4 mt-2">
          <div>
            <p className="text-sm text-white/60 mb-1 font-medium">Preço Total</p>
            <p className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.max(1, q - 1)); }}
              className="p-3 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-white text-lg">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity((q) => q + 1); }}
              className="p-3 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to cart button - Matching the new MenuItem style */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "mt-2 w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden shadow-lg shadow-orange-500/20",
            isAdded
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-[0.98]"
              : "bg-gradient-to-r from-primary to-orange-600 text-primary-foreground hover:shadow-orange-500/40 hover:-translate-y-0.5"
          )}
        >
          <div className={cn("flex items-center gap-2 transition-all duration-300", isAdded ? "translate-y-[-150%] opacity-0 absolute" : "opacity-100")}>
            <ShoppingCart className="w-5 h-5" />
            ADICIONAR AO PEDIDO
          </div>

          <div className={cn("flex items-center gap-2 absolute transition-all duration-300", isAdded ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0")}>
            <span className="text-lg">✓</span>
            ADICIONADO
          </div>
        </button>
      </div>
    </div>
  );
};

export default MenuFullscreenViewer;

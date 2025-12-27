import { ShoppingBag, LayoutGrid, List, Search, X } from "lucide-react";
import { useTable } from "@/contexts/TableContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MenuHeaderProps {
  onCartClick: () => void;
  cartItemCount: number;
  viewMode: 'list' | 'grid';
  onToggleViewMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MenuHeader = ({
  onCartClick,
  cartItemCount,
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange
}: MenuHeaderProps) => {
  const { tableCode } = useTable();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleClearSearch = () => {
    onSearchChange("");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm px-4 py-3 animate-fade-in shadow-sm">
      <div className="relative flex items-center justify-between h-8">

        {isSearchOpen ? (
          <div className="flex-1 flex items-center bg-secondary/50 rounded-full px-3 py-1 mr-2 animate-in fade-in slide-in-from-left-4 duration-300">
            <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar no cardápio..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button
              onClick={handleClearSearch}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleViewMode}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
                aria-label={viewMode === 'list' ? "Mudar para grade" : "Mudar para lista"}
              >
                {viewMode === 'list' ? (
                  <LayoutGrid className="w-6 h-6" />
                ) : (
                  <List className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
                aria-label="Pesquisar"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>

            {tableCode && (
              <div className="absolute left-1/2 -translate-x-1/2 text-xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent animate-in zoom-in tracking-tight whitespace-nowrap">
                Mesa {tableCode}
              </div>
            )}
          </>
        )}

        <button
          onClick={onCartClick}
          className="relative p-2 text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default MenuHeader;

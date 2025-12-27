import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <nav className="sticky top-[56px] z-40 bg-background/95 backdrop-blur-sm">
      <div className="flex overflow-x-auto pb-0 px-4 gap-6 scrollbar-none items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "py-3 text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300 relative flex-shrink-0",
              activeCategory === category
                ? "text-foreground"
                : "text-muted-foreground/60 hover:text-foreground/80"
            )}
          >
            {category}
            {activeCategory === category && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryTabs;

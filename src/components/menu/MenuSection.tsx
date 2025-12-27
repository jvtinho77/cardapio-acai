import { useState } from "react";
import MenuItem from "./MenuItem";
import MenuFullscreenViewer from "./MenuFullscreenViewer";
import { MenuItemData } from "@/data/menuData";

interface MenuSectionProps {
  title: string;
  items: MenuItemData[];
  onAddToCart: (item: MenuItemData) => void;
  viewMode?: 'list' | 'grid';
}

const MenuSection = ({ title, items, onAddToCart, viewMode = 'list' }: MenuSectionProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    setIsViewerOpen(true);
  };

  if (items.length === 0) return null;

  return (
    <>
      <section className="py-6 px-4">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </span>
        </h2>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-4'}`}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MenuItem
                {...item}
                onClick={() => handleItemClick(index)}
                onAddToCart={() => onAddToCart(item)}
                compact={viewMode === 'grid'}
              />
            </div>
          ))}
        </div>
      </section>

      <MenuFullscreenViewer
        items={items}
        initialIndex={selectedIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};

export default MenuSection;

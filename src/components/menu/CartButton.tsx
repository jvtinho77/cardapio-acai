import { ShoppingBag } from "lucide-react";

interface CartButtonProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

const CartButton = ({ itemCount, total, onClick }: CartButtonProps) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-4 right-4 z-50 bg-primary text-primary-foreground py-4 px-6 rounded-2xl shadow-xl flex items-center justify-between animate-slide-up hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </div>
        <span className="font-semibold">Ver carrinho</span>
      </div>
      <span className="font-bold text-lg">
        R$ {total.toFixed(2).replace('.', ',')}
      </span>
    </button>
  );
};

export default CartButton;

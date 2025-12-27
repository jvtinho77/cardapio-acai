import { X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartSheetProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    onRemoveItem: (id: number) => void;
    onFinishOrder: () => void;
}

const CartSheet = ({ isOpen, onClose, items, total, onRemoveItem, onFinishOrder }: CartSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background/95 backdrop-blur-xl border-l border-border/50">
                <SheetHeader className="text-left space-y-1 pb-4 border-b border-border/50">
                    <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Seu Carrinho
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                        {items.reduce((acc, item) => acc + item.quantity, 0)} itens adicionados
                    </p>
                </SheetHeader>

                <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                                <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
                                    <span className="text-4xl">🛒</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">Carrinho vazio</h3>
                                    <p className="text-muted-foreground text-sm">Adicione alguns itens deliciosos!</p>
                                </div>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="group relative flex gap-4 p-4 bg-card/50 hover:bg-card border border-border/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                                    {/* Item Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-foreground line-clamp-1 text-lg">{item.name}</h4>
                                            <p className="text-sm font-medium text-muted-foreground mt-1">
                                                {item.quantity}x {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-primary text-base">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors self-center"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <div className="space-y-4 pt-6 pb-6 border-t border-border/50 bg-gradient-to-t from-background via-background to-transparent">
                    <div className="flex justify-between items-center text-xl font-bold pt-2 text-foreground">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                    </div>

                    <Button
                        className="w-full py-7 text-lg font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-none"
                        size="lg"
                        onClick={onFinishOrder}
                        disabled={items.length === 0}
                    >
                        Finalizar Pedido
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartSheet;

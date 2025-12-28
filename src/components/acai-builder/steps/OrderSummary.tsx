import { ShoppingBag } from "lucide-react";
import { CupOrder } from "../types";

interface OrderSummaryProps {
    cups?: CupOrder[];
}

export function OrderSummary({ cups }: OrderSummaryProps) {
    // Calculate total
    const calculateTotal = () => {
        if (!cups) return 0;
        return cups.reduce((acc, cup) => {
            const basePrice = cup.size?.price || 0;
            const extraComplementsCount = Math.max(0, cup.complements.length - 3);
            const extraPrice = extraComplementsCount * 2.50;
            return acc + basePrice + extraPrice;
        }, 0);
    };

    const totalPrice = calculateTotal();

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary font-heading">Resumo do Pedido</h2>
                <p className="text-muted-foreground">Confira seus açaís antes de pedir</p>
            </div>

            <div className="space-y-4">
                {cups?.map((cup, index) => {
                    const extraComplementsCount = Math.max(0, cup.complements.length - 3);
                    const extraPrice = extraComplementsCount * 2.50;
                    const cupTotal = (cup.size?.price || 0) + extraPrice;

                    return (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 space-y-4">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Copo {index + 1}</h3>
                                    <p className="text-sm text-purple-600 font-medium">{cup.size?.label} - R$ {cup.size?.price},00</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Base</span>
                                    <span className="font-medium text-gray-800">{cup.base?.label}</span>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-sm text-gray-500 block">Complementos ({cup.complements?.length || 0})</span>
                                    <div className="flex flex-wrap gap-2">
                                        {cup.complements?.length > 0 ? (
                                            cup.complements.map((comp) => (
                                                <span
                                                    key={comp.id}
                                                    className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100"
                                                >
                                                    {comp.label}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Sem complementos</span>
                                        )}
                                    </div>
                                    {/* Simple Price Breakdown per cup */}
                                    {extraComplementsCount > 0 && (
                                        <div className="text-xs text-orange-600 bg-orange-50 p-1.5 rounded-lg mt-1 inline-block">
                                            +{extraComplementsCount}x Adicionais (R$ 2,50 un)
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {cup.notes && (
                                        <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded-lg border border-yellow-100 mt-2">
                                            <span className="font-bold mr-1">Obs:</span>
                                            {cup.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total Footer */}
            <div className="bg-purple-50 p-6 rounded-2xl flex items-center justify-between border border-purple-100 shadow-sm">
                <span className="text-lg font-medium text-purple-900">Total do Pedido</span>
                <span className="text-3xl font-bold text-purple-700 font-heading">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
            </div>

            <p className="text-xs text-center text-gray-400 px-6">
                Ao finalizar, enviaremos seu pedido para a cozinha preparar com todo carinho! 💜
            </p>
        </div>
    );
}


import { useState, useEffect } from 'react';
import { AcaiBase } from '../types';
import { cn } from '@/lib/utils';
import { CircleDot, Circle, Loader2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBasesFromSettings } from '@/services/settingsService';

interface StepBaseProps {
    selected: AcaiBase | null;
    onSelect: (base: AcaiBase) => void;
}

export function StepBase({ selected, onSelect }: StepBaseProps) {
    const [bases, setBases] = useState<AcaiBase[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBases() {
            setIsLoading(true);
            try {
                const data = await getBasesFromSettings();
                setBases(data);
            } catch (error) {
                console.error("Error fetching bases:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBases();
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary font-heading">Escolha o Tipo da Massa</h2>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-muted-foreground">Qual sabor de açaí você quer como base?</p>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        Incluso no valor do copo (Sem custo extra)
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3 text-purple-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-sm font-medium">Carregando bases...</p>
                    </div>
                ) : bases.length > 0 ? (
                    bases.map((base) => (
                        <div
                            key={base.id}
                            onClick={() => onSelect(base)}
                            className={cn(
                                "relative cursor-pointer rounded-xl border p-4 transition-all duration-200",
                                selected?.label === base.label
                                    ? "border-primary bg-purple-50 shadow-md ring-1 ring-primary/20"
                                    : base.label === 'Açaí Puro'
                                        ? "border-purple-300 bg-white hover:border-primary hover:bg-purple-50/30"
                                        : "border-gray-100 bg-white hover:border-purple-100 hover:bg-gray-50"
                            )}
                        >
                            {base.label === 'Açaí Puro' && (
                                <div className="absolute -top-2.5 right-4">
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-none shadow-md py-0.5 px-2 flex items-center gap-1">
                                        <Star size={10} className="fill-white" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Mais Popular</span>
                                    </Badge>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "mt-1",
                                    selected?.label === base.label ? "text-primary" : "text-gray-300"
                                )}>
                                    {selected?.label === base.label ? <CircleDot size={20} /> : <Circle size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{base.label}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-snug">{base.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground italic">Nenhuma base encontrada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


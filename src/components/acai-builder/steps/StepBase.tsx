
import { AcaiBase } from '../types';
import { cn } from '@/lib/utils';
import { CircleDot, Circle } from 'lucide-react';

const BASES: AcaiBase[] = [
    { id: 'pure', label: 'Açaí Puro', description: 'Massa tradicional, pura e cremosa.' },
    { id: 'banana', label: 'Açaí com Banana', description: 'Massa batida com banana (mais doce).' },
    { id: 'strawberry', label: 'Açaí com Morango', description: 'Massa batida com morango.' },
    { id: 'mixed', label: 'Misto (Açaí + Cupuaçu)', description: 'Metade Açaí, metade Cupuaçu.' },
    { id: 'zero', label: 'Açaí Zero', description: 'Zero açúcar, adoçado com Stevia.' },
];

interface StepBaseProps {
    selected: AcaiBase | null;
    onSelect: (base: AcaiBase) => void;
}

export function StepBase({ selected, onSelect }: StepBaseProps) {
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
                {BASES.map((base) => (
                    <div
                        key={base.id}
                        onClick={() => onSelect(base)}
                        className={cn(
                            "cursor-pointer rounded-xl border p-4 transition-all duration-200",
                            selected?.id === base.id
                                ? "border-primary bg-purple-50 shadow-md"
                                : "border-gray-100 bg-white hover:border-purple-100 hover:bg-gray-50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "mt-1",
                                selected?.id === base.id ? "text-primary" : "text-gray-300"
                            )}>
                                {selected?.id === base.id ? <CircleDot size={20} /> : <Circle size={20} />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{base.label}</h3>
                                <p className="text-sm text-gray-500 leading-snug">{base.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

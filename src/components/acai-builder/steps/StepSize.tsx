
import { cn } from '@/lib/utils';
import { CupIcon } from '../icons/CupIcon';

export interface AcaiSize {
    id: string;
    label: string;
    price: number;
}

const SIZES: AcaiSize[] = [
    { id: '300', label: '300ml', price: 15.00 },
    { id: '500', label: '500ml', price: 20.00 },
    { id: '700', label: '700ml', price: 25.00 },
];

interface StepSizeProps {
    selected: AcaiSize | null;
    onSelect: (size: AcaiSize) => void;
}

export function StepSize({ selected, onSelect }: StepSizeProps) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary font-heading">Qual o tamanho da sua fome?</h2>
                <p className="text-muted-foreground">Escolha o tamanho do seu copo</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {SIZES.map((size) => (
                    <div
                        key={size.id}
                        onClick={() => onSelect(size)}
                        className={cn(
                            "relative overflow-hidden cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300",
                            selected?.id === size.id
                                ? "border-primary bg-purple-50 shadow-xl shadow-purple-100 scale-[1.02]"
                                : "border-transparent bg-white shadow-sm hover:border-purple-100 hover:shadow-md"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "flex items-end justify-center transition-all duration-500",
                                    size.id === '300' ? "w-16 h-16" :
                                        size.id === '500' ? "w-20 h-20" :
                                            "w-24 h-24"
                                )}>
                                    <CupIcon
                                        className="w-full h-full text-primary"
                                        fillColor={selected?.id === size.id ? "#F3E8FF" : "#FFFFFF"}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{size.label}</h3>
                                    <p className="text-primary font-medium">R$ {size.price.toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>

                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                selected?.id === size.id ? "border-primary bg-primary" : "border-gray-300"
                            )}>
                                {selected?.id === size.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

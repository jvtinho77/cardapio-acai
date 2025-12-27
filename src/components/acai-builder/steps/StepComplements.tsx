import { Complement } from '../AcaiWizard';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const COMPLEMENTS_DATA: Complement[] = [
    // Fruits
    { id: 'banana', label: 'Banana', category: 'fruit' },
    { id: 'morango', label: 'Morango', category: 'fruit' },
    { id: 'uva', label: 'Uva', category: 'fruit' },
    { id: 'kiwi', label: 'Kiwi', category: 'fruit' },
    { id: 'manga', label: 'Manga', category: 'fruit' },

    // Mousses
    { id: 'leite-po', label: 'Leite em Pó', category: 'mousse' },
    { id: 'leite-cond', label: 'Leite Condensado', category: 'mousse' },
    { id: 'nutella', label: 'Creme de Avelã', category: 'mousse' },
    { id: 'pacoca', label: 'Paçoca', category: 'mousse' },
    { id: 'ovomaltine', label: 'Ovomaltine', category: 'mousse' },

    // Crunch & Others
    { id: 'granola', label: 'Granola', category: 'crunch' },
    { id: 'choco-ball', label: 'Choco Ball', category: 'crunch' },
    { id: 'sukrilhos', label: 'Sucrilhos', category: 'crunch' },
    { id: 'jujuba', label: 'Jujuba', category: 'other' },
    { id: 'bis', label: 'Bis', category: 'other' },
];

interface StepComplementsProps {
    selected: Complement[];
    onUpdate: (complements: Complement[]) => void;
    notes?: string;
    onNotesChange?: (notes: string) => void;
}

export function StepComplements({ selected, onUpdate, notes, onNotesChange }: StepComplementsProps) {
    const toggleComplement = (complement: Complement) => {
        const exists = selected.find(c => c.id === complement.id);
        if (exists) {
            onUpdate(selected.filter(c => c.id !== complement.id));
        } else {
            onUpdate([...selected, complement]);
        }
    };

    const isSelected = (id: string) => !!selected.find(c => c.id === id);

    const renderComplementList = (category: string | string[]) => {
        const items = COMPLEMENTS_DATA.filter(c =>
            Array.isArray(category) ? category.includes(c.category) : c.category === category
        );

        return (
            <div className="grid grid-cols-1 gap-3 mt-4">
                {items.map(item => {
                    const selected = isSelected(item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleComplement(item)}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.98]",
                                selected
                                    ? "border-primary bg-purple-50 shadow-sm ring-1 ring-primary"
                                    : "border-gray-100 bg-white hover:border-purple-100 hover:bg-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                    selected ? "bg-primary text-white" : "bg-gray-100 text-gray-300"
                                )}>
                                    {selected ? <Check size={20} /> : <Plus size={20} />}
                                </div>
                                <span className={cn(
                                    "font-medium flex-1",
                                    selected ? "text-primary font-bold" : "text-gray-700"
                                )}>
                                    {item.label}
                                </span>
                                {selected && (
                                    <span className="text-xs text-primary font-medium px-2 py-1 bg-white/50 rounded-lg">
                                        Selecionado
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const paidCount = Math.max(0, selected.length - 3);

    return (
        <div className="space-y-4 pb-8">
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-primary font-heading">Complementos</h2>
                <p className="text-muted-foreground text-sm">Escolha até 3 opções grátis</p>

                {selected.length > 0 && (
                    <div className="flex justify-center gap-2 mt-2">
                        <Badge variant="outline" className={cn(
                            "transition-colors",
                            selected.length <= 3 ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50"
                        )}>
                            {selected.length} selecionados
                        </Badge>
                        {paidCount > 0 && (
                            <Badge variant="destructive">
                                +{paidCount} pagos (+R$ {(paidCount * 2.5).toFixed(2)})
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            <Tabs defaultValue="fruits" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-purple-50/50 p-1 rounded-xl">
                    <TabsTrigger value="fruits" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Frutas</TabsTrigger>
                    <TabsTrigger value="mousses" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Mousses</TabsTrigger>
                    <TabsTrigger value="crunch" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Crocantes</TabsTrigger>
                </TabsList>
                <TabsContent value="fruits" className="animate-fade-in">
                    {renderComplementList('fruit')}
                </TabsContent>
                <TabsContent value="mousses" className="animate-fade-in">
                    {renderComplementList('mousse')}
                </TabsContent>
                <TabsContent value="crunch" className="animate-fade-in">
                    {renderComplementList(['crunch', 'other'])}
                </TabsContent>
            </Tabs>

            {/* Warning if over limit */}
            {selected.length > 3 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2 animate-fade-in">
                    <span className="font-bold shrink-0">BÔNUS:</span>
                    <span>Adicionais custam R$ 2,50 cada.</span>
                </div>
            )}

            {/* Observation Field */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
                <label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                    Observações (Opcional)
                </label>
                <Textarea
                    id="notes"
                    placeholder="Ex: Sem leite em pó, capricha na nutella..."
                    value={notes}
                    onChange={(e) => onNotesChange?.(e.target.value)}
                    className="min-h-[80px] text-sm bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                />
            </div>
        </div>
    );
}

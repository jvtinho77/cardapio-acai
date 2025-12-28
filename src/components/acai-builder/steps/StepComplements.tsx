import { useState, useEffect } from 'react';
import { Complement } from '../types';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getComplementsFromSettings } from '@/services/settingsService';


interface StepComplementsProps {
    selected: Complement[];
    onUpdate: (complements: Complement[]) => void;
    notes?: string;
    onNotesChange?: (notes: string) => void;
}

export function StepComplements({ selected, onUpdate, notes, onNotesChange }: StepComplementsProps) {
    const [complements, setComplements] = useState<Complement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchComplements() {
            setIsLoading(true);
            try {
                const data = await getComplementsFromSettings();
                setComplements(data);
            } catch (error) {
                console.error("Error fetching complements:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchComplements();
    }, []);

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
        const items = complements.filter(c =>
            Array.isArray(category) ? category.includes(c.category) : c.category === category
        );

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-10 space-y-3 text-purple-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-sm font-medium">Carregando...</p>
                </div>
            );
        }

        if (items.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground italic text-sm">Nenhum item disponível nesta categoria.</p>
                </div>
            );
        }



        return (
            <div className="grid grid-cols-2 gap-2 mt-4">
                {items.map(item => {
                    const selected = isSelected(item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleComplement(item)}
                            className={cn(
                                "flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer select-none active:scale-[0.98] min-h-[44px]",
                                selected
                                    ? "border-primary bg-purple-50 shadow-sm ring-1 ring-primary"
                                    : "border-gray-100 bg-white hover:border-purple-100 hover:bg-gray-50"
                            )}
                        >
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0",
                                selected ? "bg-primary text-white" : "bg-gray-100 text-gray-300"
                            )}>
                                {selected ? <Check size={14} /> : <Plus size={14} />}
                            </div>
                            <span className={cn(
                                "text-xs font-medium leading-tight",
                                selected ? "text-primary font-bold" : "text-gray-700"
                            )}>
                                {item.label}
                            </span>
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
        </div>
    );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AcaiSize, AcaiBase, Complement, Location, CupOrder } from './types';
import { StepSize } from './steps/StepSize';
import { StepBase } from './steps/StepBase';
import { StepComplements } from './steps/StepComplements';
import { StepLocation } from './steps/StepLocation';
import { OrderSummary } from './steps/OrderSummary';
import { StepQuantity } from './steps/StepQuantity';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { salvarPedido } from '@/services/orderService';
import { getStoreStatus } from '@/services/settingsService';
import { useSearchParams } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircle, Coins, Wallet } from "lucide-react";

// Steps definition
// 0: Quantity/Name, 1: Size, 2: Base, 3: Complements, 4: Location, 5: Summary
const STEPS_LABELS = ['Início', 'Tamanho', 'Base', 'Complementos', 'Localização', 'Resumo'];

export function AcaiWizard() {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get('tableCode');
    const { toast } = useToast();

    // Wizard State
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isStoreOpen, setIsStoreOpen] = useState<boolean | null>(null);

    // Order State
    const [whatsapp, setWhatsapp] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Multi-cup management
    const [completedCups, setCompletedCups] = useState<CupOrder[]>([]);

    // Current cup being built
    const [currentCup, setCurrentCup] = useState<CupOrder>({
        size: null,
        base: null,
        complements: []
    });

    const [location, setLocation] = useState<Location | undefined>(undefined);

    // Troco State
    const [showTrocoDialog, setShowTrocoDialog] = useState(false);
    const [needsTroco, setNeedsTroco] = useState<boolean | null>(null);
    const [valorTroco, setValorTroco] = useState<string>('');

    // Check store status on mount
    useEffect(() => {
        async function checkStoreStatus() {
            const status = await getStoreStatus();
            setIsStoreOpen(status);
        }
        checkStoreStatus();
    }, []);

    // Helpers
    const currentCupIndex = completedCups.length + 1;
    const isBuildingCup = currentStep >= 1 && currentStep <= 3; // Size, Base, Complements

    const handleNext = async () => {
        // Validation logic
        if (currentStep === 0 && quantity < 1) return;
        if (currentStep === 1 && !currentCup.size) return;
        if (currentStep === 2 && !currentCup.base) return;

        // Loop Logic
        if (currentStep === 3) { // Finishing current cup
            const newCompletedCups = [...completedCups, currentCup];
            setCompletedCups(newCompletedCups);

            if (newCompletedCups.length < quantity) {
                // Start next cup
                setCurrentCup({ size: null, base: null, complements: [] });
                setCurrentStep(1); // Go back to Size
                toast({
                    title: `Copo ${newCompletedCups.length} pronto!`,
                    description: `Vamos montar o copo ${newCompletedCups.length + 1}.`,
                    className: "bg-purple-50 border-purple-200 text-purple-900"
                });
                return;
            } else {
                // All cups finished, go to Location
                setCurrentStep(4);
                return;
            }
        }

        // Location Step
        if (currentStep === 4) {
            if (!location) {
                toast({
                    title: "Localização necessária",
                    description: "Por favor, selecione sua localização no mapa.",
                    variant: "destructive"
                });
                return;
            }
            setCurrentStep(5); // Go to Summary
            return;
        }

        // Summary Step (Final Submit)
        if (currentStep === 5) {
            setShowTrocoDialog(true);
            return;
        }

        // Normal progression
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep <= 0) return;

        // Simplification: "Back" just goes back in the linear flow, essentially undoing the last action.
        // If we are at Step 1 (Size) of a new Cup, back should allow editing previous cup?
        // For simplicity, we just decrement step. If user wants to edit previous cup, they'd have to restart or we add complex nav.
        // Let's stick to simple decrement for now.
        if (currentStep === 1 && completedCups.length > 0) {
            // Logic to edit previous cup would be here.
            // For now, let's just warn or allow going back to Quantity (reset all).
            // Better UX: Allow restart.
            if (window.confirm("Deseja voltar ao início e reiniciar o pedido?")) {
                setCompletedCups([]);
                setCurrentCup({ size: null, base: null, complements: [] });
                setCurrentStep(0);
            }
            return;
        }

        setCurrentStep(prev => prev - 1);
    };

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            // Clean WhatsApp Number
            let cleanedWhatsapp = whatsapp.replace(/\D/g, '');
            if (cleanedWhatsapp && !cleanedWhatsapp.startsWith('55')) {
                cleanedWhatsapp = '55' + cleanedWhatsapp;
            }
            // Calculate Total
            const total = completedCups.reduce((acc, cup) => {
                const basePrice = cup.size?.price || 0;
                const extraComplementsCount = Math.max(0, cup.complements.length - 3);
                const extraPrice = extraComplementsCount * 2.50;
                return acc + basePrice + extraPrice;
            }, 0);

            // Construct Aggregate Data as Arrays (Backward Compatibility)
            const sizes = completedCups.map(c => c.size);
            const bases = completedCups.map(c => c.base);
            const complementsList = completedCups.map(c => c.complements);

            // Construct Consolidated Data (New CRM friendly)
            const itensConsolidados = completedCups.map((cup, idx) => ({
                item: `Copo ${idx + 1}`,
                tamanho: cup.size?.label,
                base: cup.base?.label,
                complementos: cup.complements.map(c => c.label), // Save as array
                observacao: cup.notes || "",
                preco: (cup.size?.price || 0) + (Math.max(0, cup.complements.length - 3) * 2.50)
            }));

            // Construct Readable Summary
            let resumoParts = [];

            // 1. Add Location Info
            if (location?.isManual && location.address) {
                resumoParts.push(`📍 ENDEREÇO: ${location.address}`);
            } else if (location?.lat) {
                resumoParts.push(`📍 LOCALIZAÇÃO: Via GPS/Mapa`);
            }

            // 2. Add Cups Info
            const cupsSummary = completedCups.map((cup, idx) => {
                const comps = cup.complements.map(c => c.label).join(", ");
                return `Copo ${idx + 1}: ${cup.size?.label}, ${cup.base?.label}${comps ? ` (${comps})` : ""}${cup.notes ? ` [Obs: ${cup.notes}]` : ""}`;
            }).join(" | ");
            resumoParts.push(cupsSummary);

            // 3. Add Payment Info
            if (needsTroco && valorTroco) {
                resumoParts.push(`💵 TROCO PARA: R$ ${valorTroco}`);
            }

            const resumoText = resumoParts.join(" | ");

            await salvarPedido({
                cliente_nome: whatsapp, // Keep as name for now for backward compatibility or metrics
                mesa: "Delivery",
                total: total,

                // Old structure
                tamanho: sizes,
                base: bases,
                complementos: complementsList,
                localizacao: location,

                // New structure
                itens_json: itensConsolidados,
                resumo: resumoText,
                troco_para: needsTroco ? parseFloat(valorTroco) : undefined,
                whatsapp_cliente: cleanedWhatsapp,

                itens: [], // Legacy field from interface
                tableId: tableId || undefined
            });

            setIsSuccess(true);
        } catch (error) {
            toast({
                title: "Erro ao enviar pedido",
                description: "Tente novamente.",
                variant: "destructive"
            });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state while checking store status
    if (isStoreOpen === null) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-purple-400 text-center">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-medium">Carregando...</p>
                </div>
            </div>
        );
    }

    // Store closed message
    if (!isStoreOpen) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500 p-6">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center shadow-lg shadow-amber-50">
                    <AlertCircle className="text-amber-600 w-12 h-12" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-800">Ops! Estamos Fechados</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">No momento não estamos aceitando pedidos.</p>
                    <p className="text-purple-600 font-medium mt-1 text-lg">Abriremos em breve!</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-purple-200 text-purple-700 hover:bg-purple-50">
                    Tentar novamente
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500 p-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-50">
                    <Check className="text-green-600 w-12 h-12" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Pedido Realizado!</h2>
                    <p className="text-gray-500 mt-2">A cozinha já vai começar o preparo.</p>
                    <p className="text-purple-600 font-medium mt-1 text-lg">Muito obrigado!</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-purple-200 text-purple-700 hover:bg-purple-50">
                    Fazer novo pedido
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto h-[100dvh] flex flex-col bg-white">
            {/* Header / Progress */}
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-6">
                    {currentStep > 0 && (
                        <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-3 hover:bg-purple-50 text-purple-700">
                            <ArrowLeft size={24} />
                        </Button>
                    )}
                    <div className="flex-1 text-center">
                        <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                            {isBuildingCup ? `Copo ${currentCupIndex} de ${quantity}` : STEPS_LABELS[currentStep]}
                        </span>
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep) / (STEPS_LABELS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep + '-' + currentCupIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {currentStep === 0 && (
                            <StepQuantity
                                whatsapp={whatsapp}
                                quantity={quantity}
                                onUpdate={(w, q) => { setWhatsapp(w); setQuantity(q); }}
                                onNext={handleNext}
                            />
                        )}
                        {currentStep === 1 && (
                            <StepSize
                                selected={currentCup.size}
                                onSelect={(size) => {
                                    setCurrentCup(prev => ({ ...prev, size }));
                                    // Auto-advance is optional, but let's wait for user to click Next or we can auto-advance. 
                                    // For consistency with Base, let's auto advance after a tiny delay?
                                    // Let's stick to manual Next button for clarity unless specifically requested.
                                    // Ah, StepSize UI implies cards. Let's make it auto-select = state update. 
                                    // Navigation is via footer button.
                                }}
                            />
                        )}
                        {currentStep === 2 && (
                            <StepBase
                                selected={currentCup.base}
                                onSelect={(base) => setCurrentCup(prev => ({ ...prev, base }))}
                            />
                        )}
                        {currentStep === 3 && (
                            <StepComplements
                                selected={currentCup.complements}
                                onUpdate={(complements) => setCurrentCup(prev => ({ ...prev, complements }))}
                                notes={currentCup.notes || ''}
                                onNotesChange={(notes) => setCurrentCup(prev => ({ ...prev, notes }))}
                            />
                        )}
                        {currentStep === 4 && (
                            <StepLocation
                                currentLocation={location}
                                onSelect={(loc) => setLocation(loc)}
                            />
                        )}
                        {currentStep === 5 && (
                            <OrderSummary
                                cups={completedCups}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-2 bg-white border-t border-purple-50">
                {/* Size(1) & Base(2) Navigation */}
                {(currentStep === 1 || currentStep === 2) && (
                    <Button
                        onClick={handleNext}
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-purple-200 bg-primary hover:bg-primary/90"
                        disabled={currentStep === 1 ? !currentCup.size : !currentCup.base}
                    >
                        Próximo
                    </Button>
                )}

                {/* Complements(3): Logic for Next Cup or Finish */}
                {currentStep === 3 && (
                    <Button
                        onClick={handleNext}
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-purple-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        {completedCups.length + 1 < quantity ? 'Próximo Açaí →' : 'Finalizar Montagem'}
                    </Button>
                )}

                {/* Location(4) */}
                {currentStep === 4 && (
                    <Button
                        onClick={handleNext}
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-purple-200"
                        disabled={!location || (location.isManual && !location.address?.trim()) || (!location.isManual && !location.lat)}
                    >
                        Ver Resumo
                    </Button>
                )}

                {/* Summary(5) */}
                {currentStep === 5 && (
                    <Button
                        onClick={handleNext}
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-green-200 bg-green-500 hover:bg-green-600"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : `Finalizar Pedido`}
                    </Button>
                )}
            </div>

            {/* Change (Troco) Dialog */}
            <Dialog open={showTrocoDialog} onOpenChange={setShowTrocoDialog}>
                <DialogContent className="sm:max-w-md rounded-3xl border-none">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
                            <Coins className="text-amber-500" />
                            Precisa de Troco?
                        </DialogTitle>
                        <DialogDescription className="text-center text-base">
                            Como será a forma de pagamento em dinheiro?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setNeedsTroco(false)}
                                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${needsTroco === false ? 'border-primary bg-purple-50' : 'border-gray-100 hover:border-purple-100'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${needsTroco === false ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Wallet size={24} />
                                </div>
                                <span className={`font-bold ${needsTroco === false ? 'text-primary' : 'text-gray-600'}`}>Não Preciso</span>
                            </button>

                            <button
                                onClick={() => setNeedsTroco(true)}
                                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${needsTroco === true ? 'border-primary bg-purple-50' : 'border-gray-100 hover:border-purple-100'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${needsTroco === true ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Coins size={24} />
                                </div>
                                <span className={`font-bold ${needsTroco === true ? 'text-amber-600 border-amber-600' : 'text-gray-600'}`}>Preciso</span>
                            </button>
                        </div>

                        <AnimatePresence>
                            {needsTroco && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3 overflow-hidden"
                                >
                                    <label className="text-sm font-bold text-gray-700 block ml-1">
                                        Troco para quanto? (Ex: 100)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                        <Input
                                            type="number"
                                            placeholder="0,00"
                                            value={valorTroco}
                                            onChange={(e) => setValorTroco(e.target.value)}
                                            className="pl-12 h-14 text-xl font-bold bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                                        />
                                    </div>
                                    <div className="flex gap-2 items-start bg-amber-50 p-3 rounded-xl border border-amber-100">
                                        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-800">
                                            O entregador levará o troco calculado com base no valor total do pedido.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <Button
                            onClick={async () => {
                                setShowTrocoDialog(false);
                                await handleSubmitOrder();
                            }}
                            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-green-200 bg-green-500 hover:bg-green-600"
                            disabled={needsTroco === null || (needsTroco && !valorTroco) || isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

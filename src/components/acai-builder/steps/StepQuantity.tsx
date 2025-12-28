import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StepQuantityProps {
    whatsapp: string;
    quantity: number;
    onUpdate: (whatsapp: string, quantity: number) => void;
    onNext: () => void;
}

export function StepQuantity({ whatsapp, quantity, onUpdate, onNext }: StepQuantityProps) {
    const [localWhatsapp, setLocalWhatsapp] = useState(whatsapp);
    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [isFocused, setIsFocused] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setLocalWhatsapp(whatsapp);
        setLocalQuantity(quantity);
    }, [whatsapp, quantity]);

    const handleIncrement = () => {
        if (localQuantity < 10) {
            const newQ = localQuantity + 1;
            setLocalQuantity(newQ);
            onUpdate(localWhatsapp, newQ);
        }
    };

    const handleDecrement = () => {
        if (localQuantity > 1) {
            const newQ = localQuantity - 1;
            setLocalQuantity(newQ);
            onUpdate(localWhatsapp, newQ);
        }
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalWhatsapp(val);
        onUpdate(val, localQuantity);
    };

    const handleStart = () => {
        if (!localWhatsapp.trim()) {
            setShowConfirm(true);
        } else {
            onNext();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-3">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-heading tracking-tight">
                    Vamos começar!
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Para iniciarmos seu pedido, informe seu contato.
                </p>
            </div>

            <div className="space-y-8 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-xl shadow-purple-500/5">
                {/* Input WhatsApp */}
                <div className="space-y-2 group">
                    <label className="text-sm font-semibold text-gray-600 ml-1 group-focus-within:text-purple-600 transition-colors">
                        WhatsApp para contato
                    </label>
                    <div className={`relative transition-all duration-300 transform ${isFocused ? 'scale-[1.02]' : ''}`}>
                        <div className={`absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl blur opacity-20 transition-opacity ${isFocused ? 'opacity-100' : ''}`} />
                        <div className="relative">
                            <Phone
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-purple-600' : 'text-gray-400'}`}
                                size={22}
                            />
                            <Input
                                value={localWhatsapp}
                                onChange={handleWhatsappChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="(00) 00000-0000"
                                className="pl-12 h-14 text-lg bg-white/80 border-gray-100 rounded-2xl shadow-sm focus:border-purple-200 focus:ring-4 focus:ring-purple-50/50 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Counter Quantidade */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-600 ml-1 text-center block">
                        Quantos açaís vamos preparar?
                    </label>

                    <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleDecrement}
                            disabled={localQuantity <= 1}
                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Minus size={24} />
                        </motion.button>

                        <div className="flex flex-col items-center">
                            <motion.span
                                key={localQuantity}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-bold text-gray-800 font-heading"
                            >
                                {localQuantity}
                            </motion.span>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                {localQuantity === 1 ? 'Unidade' : 'Unidades'}
                            </span>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleIncrement}
                            disabled={localQuantity >= 10}
                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus size={24} />
                        </motion.button>
                    </div>
                </div>
            </div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    onClick={handleStart}
                    className="w-full h-16 text-xl font-bold rounded-2xl shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all border-0 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-2">
                        Começar
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </motion.div>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="rounded-3xl border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-center text-primary">
                            Prosseguir sem o número?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            Sem o WhatsApp, não poderemos entrar em contato caso haja algum imprevisto com seu pedido.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
                        <AlertDialogAction
                            onClick={() => {
                                setShowConfirm(false);
                                onNext();
                            }}
                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
                        >
                            Continuar
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full h-12 border-none bg-gray-100 hover:bg-gray-200 rounded-xl font-bold">
                            Voltar
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

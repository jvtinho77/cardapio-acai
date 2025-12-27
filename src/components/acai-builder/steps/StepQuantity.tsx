import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StepQuantityProps {
    name: string;
    quantity: number;
    onUpdate: (name: string, quantity: number) => void;
    onNext: () => void;
}

export function StepQuantity({ name, quantity, onUpdate, onNext }: StepQuantityProps) {
    const [localName, setLocalName] = useState(name);
    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setLocalName(name);
        setLocalQuantity(quantity);
    }, [name, quantity]);

    const handleIncrement = () => {
        if (localQuantity < 10) {
            const newQ = localQuantity + 1;
            setLocalQuantity(newQ);
            onUpdate(localName, newQ);
        }
    };

    const handleDecrement = () => {
        if (localQuantity > 1) {
            const newQ = localQuantity - 1;
            setLocalQuantity(newQ);
            onUpdate(localName, newQ);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalName(val);
        onUpdate(val, localQuantity);
    };

    const isValid = localName.trim().length > 0 && localQuantity >= 1;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-3">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-heading tracking-tight">
                    Vamos começar!
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Para iniciarmos, como você gostaria de ser chamado?
                </p>
            </div>

            <div className="space-y-8 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-xl shadow-purple-500/5">
                {/* Input Nome */}
                <div className="space-y-2 group">
                    <label className="text-sm font-semibold text-gray-600 ml-1 group-focus-within:text-purple-600 transition-colors">
                        Seu Primeiro Nome
                    </label>
                    <div className={`relative transition-all duration-300 transform ${isFocused ? 'scale-[1.02]' : ''}`}>
                        <div className={`absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl blur opacity-20 transition-opacity ${isFocused ? 'opacity-100' : ''}`} />
                        <div className="relative">
                            <User
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-purple-600' : 'text-gray-400'}`}
                                size={22}
                            />
                            <Input
                                value={localName}
                                onChange={handleNameChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Ex: João, Maria..."
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
                    onClick={onNext}
                    disabled={!isValid}
                    className="w-full h-16 text-xl font-bold rounded-2xl shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all border-0 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-2">
                        Começar
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </motion.div>
        </div>
    );
}

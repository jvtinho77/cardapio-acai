import { supabase } from "@/integrations/supabase/client";
import { AcaiBase, Complement } from "../components/acai-builder/types";

const BASE_DESCRIPTIONS: Record<string, string> = {
    'Açaí Puro': 'Massa tradicional, pura e cremosa.',
    'Açaí com Banana': 'Massa batida com banana (mais doce).',
    'Açaí com Morango': 'Massa batida com morango.',
    'Misto (Açaí + Cupuaçu)': 'Metade Açaí, metade Cupuaçu.',
    'Açaí Zero': 'Zero açúcar, adoçado com Stevia.'
};

export const getBasesFromSettings = async (): Promise<AcaiBase[]> => {
    try {
        const { data, error } = await supabase
            .from('Configurações')
            .select('Base')
            .maybeSingle();

        if (error) {
            console.error('Erro ao buscar bases da tabela Configurações:', error);
            return [];
        }

        if (data && data.Base) {
            const basesString = data.Base as string;
            const rawBases = basesString.split(',').map(base => base.trim()).filter(base => base.length > 0);
            const uniqueBases = Array.from(new Set(rawBases));

            return uniqueBases.map((baseLabel, index) => ({
                id: `db-base-${index}`,
                label: baseLabel,
                description: BASE_DESCRIPTIONS[baseLabel] || 'Massa especial da casa.'
            }));
        }
    } catch (e) {
        console.error('Erro inesperado ao buscar bases:', e);
    }

    return [];
};

export const getComplementsFromSettings = async (): Promise<Complement[]> => {
    try {
        const { data, error } = await supabase
            .from('Configurações')
            .select('Frutas, "Cremes/musse", Outros')
            .maybeSingle();

        if (error) {
            console.error('Erro ao buscar complementos da tabela Configurações:', error);
            return [];
        }

        if (!data) return [];

        const complements: Complement[] = [];
        let idCounter = 0;

        // Process Frutas (fruits)
        if (data.Frutas) {
            const frutas = (data.Frutas as string)
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const uniqueFrutas = Array.from(new Set(frutas));
            uniqueFrutas.forEach(fruta => {
                complements.push({
                    id: `fruit-${idCounter++}`,
                    label: fruta,
                    category: 'fruit'
                });
            });
        }

        // Process Cremes/musse (mousses)
        if (data['Cremes/musse']) {
            const mousses = (data['Cremes/musse'] as string)
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const uniqueMousses = Array.from(new Set(mousses));
            uniqueMousses.forEach(mousse => {
                complements.push({
                    id: `mousse-${idCounter++}`,
                    label: mousse,
                    category: 'mousse'
                });
            });
        }

        // Process Outros (crunch and other)
        if (data.Outros) {
            const outros = (data.Outros as string)
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const uniqueOutros = Array.from(new Set(outros));
            uniqueOutros.forEach(outro => {
                complements.push({
                    id: `other-${idCounter++}`,
                    label: outro,
                    category: 'crunch' // Default to crunch, could be 'other' based on specific items
                });
            });
        }

        return complements;
    } catch (e) {
        console.error('Erro inesperado ao buscar complementos:', e);
    }

    return [];
};

export const getStoreStatus = async (): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('Configurações')
            .select('Ligado')
            .maybeSingle();

        if (error) {
            console.error('Erro ao buscar status da loja:', error);
            return true; // Default to open if error
        }

        return data?.Ligado ?? true; // Default to open if no data
    } catch (e) {
        console.error('Erro inesperado ao buscar status da loja:', e);
        return true; // Default to open if error
    }
};

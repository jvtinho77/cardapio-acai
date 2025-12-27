import { supabase } from "@/integrations/supabase/client";

export const getTableById = async (id: string) => {
    const { data, error } = await supabase
        .from('mesas_disponiveis')
        .select('id, codigo, status')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching table:', error);
        return null;
    }

    return data;
};

export const updateTableStatus = async (tableId: string, newStatus: 'disponivel' | 'ocupada') => {
    const { error } = await supabase
        .from('mesas_disponiveis')
        .update({ status: newStatus })
        .eq('id', tableId);

    if (error) {
        console.error('Error updating table status:', error);
        throw error;
    }
};

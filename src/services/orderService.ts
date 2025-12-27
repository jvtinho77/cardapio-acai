import { supabase } from "@/integrations/supabase/client";

export interface ItemPedido {
    item_nome: string;
    quantidade: number;
    preco: number;
}

export interface NovoPedido {
    cliente_nome?: string;
    mesa?: string;
    total: number;
    // Structured Data
    tamanho?: any;
    base?: any;
    complementos?: any[];
    localizacao?: any;

    // Legacy/CRM support (sending a summary item)
    itens: ItemPedido[];

    tableId?: string;
}

export const salvarPedido = async (pedido: NovoPedido) => {
    // 1. Se tiver tableId, verificar e atualizar status da mesa
    if (pedido.tableId) {
        const { getTableById, updateTableStatus } = await import("./tableService");
        const table = await getTableById(pedido.tableId);

        if (table && table.status === 'disponivel') {
            await updateTableStatus(pedido.tableId, 'ocupada');
        }
    }

    // 2. Criar o pedido na tabela dedicada: pedidosdo_cardapio
    const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidosdo_cardapio")
        .insert({
            cliente_nome: pedido.cliente_nome,
            mesa: pedido.mesa,
            total: pedido.total,
            status: "pendente",

            // Novos Campos Estruturados
            tamanho: pedido.tamanho,
            base: pedido.base,
            complementos: pedido.complementos,
            localizacao: pedido.localizacao

            // REMOVED 'itens' as per user request
        })
        .select()
        .single();

    if (pedidoError) {
        console.error("Erro ao criar pedido:", pedidoError);
        throw pedidoError;
    }

    return pedidoData;
};

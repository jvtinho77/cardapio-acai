-- Create the table (if not exists)
CREATE TABLE IF NOT EXISTS public.itens_cardapio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    categoria TEXT NOT NULL,
    imagem_url TEXT,
    rating DECIMAL(2, 1) DEFAULT 0,
    disponivel BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.itens_cardapio ENABLE ROW LEVEL SECURITY;

-- Create policy for reading (public access)
DROP POLICY IF EXISTS "Public items are viewable by everyone" ON public.itens_cardapio;
CREATE POLICY "Public items are viewable by everyone" ON public.itens_cardapio
    FOR SELECT USING (true);

-- Clear existing data to avoid duplicates/confusion for this demo fill
TRUNCATE TABLE public.itens_cardapio;

-- Insert full data
INSERT INTO public.itens_cardapio (nome, descricao, preco, categoria, imagem_url, rating, is_popular, is_new)
VALUES
    -- LANCHES
    (
        'X-Bacon Supremo',
        'Pão brioche, hambúrguer 180g, muito bacon, queijo cheddar e maionese defumada.',
        34.90,
        'Lanches',
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop',
        4.9,
        true,
        false
    ),
    (
        'X-Salada Clássico',
        'Pão, hambúrguer 150g, queijo prato, alface americana, tomate e maionese verde.',
        28.90,
        'Lanches',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
        4.7,
        false,
        false
    ),
    (
        'Chicken Crispy',
        'Pão australiano, frango empanado crocante, alface, tomate e molho honey mustard.',
        32.90,
        'Lanches',
        'https://images.unsplash.com/photo-1626082927389-9b5a198de7e6?w=800&auto=format&fit=crop',
        4.8,
        true,
        false
    ),
    (
        'Smash Burger Duplo',
        'Dois burgers de 90g amassados na chapa, queijo cheddar duplo e cebola caramelizada.',
        36.90,
        'Lanches',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop',
        5.0,
        true,
        true
    ),

    -- BEBIDAS
    (
        'Coca-Cola Original 350ml',
        'Lata gelada.',
        6.90,
        'Bebidas',
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop',
        4.8,
        true,
        false
    ),
    (
        'Suco de Laranja Natural',
        '500ml de suco feito na hora. Sem açúcar.',
        12.90,
        'Bebidas',
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop',
        4.9,
        true,
        false
    ),
    (
        'Limonada Suíça',
        'Refrescante limonada batida com leite condensado. 500ml.',
        14.90,
        'Bebidas',
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop',
        4.7,
        false,
        true
    ),
    (
        'Água com Gás',
        'Garrafa 500ml.',
        5.00,
        'Bebidas',
        'https://images.unsplash.com/photo-1560617544-b4f287789e24?w=800&auto=format&fit=crop',
        4.5,
        false,
        false
    ),

    -- PASTEL
    (
        'Pastel de Carne',
        'Carne moída temperada com azeitonas. Frito na hora.',
        12.90,
        'Pastel',
        'https://images.unsplash.com/photo-1653567705353-0c4a923577d6?w=800&auto=format&fit=crop',
        4.7,
        true,
        false
    ),
    (
        'Pastel de Queijo',
        'Muito queijo mozzarella derretido.',
        11.90,
        'Pastel',
        'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop',
        4.8,
        true,
        false
    ),
    (
        'Pastel de Pizza',
        'Queijo, presunto, tomate e orégano.',
        13.90,
        'Pastel',
        'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=800&auto=format&fit=crop',
        4.6,
        false,
        false
    ),
    (
        'Pastel Especial de Camarão',
        'Camarão cremoso com catupiry.',
        18.90,
        'Pastel',
        'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop',
        4.9,
        false,
        true
    ),

    -- MINI PIZZAS
    (
        'Mini Pizza Calabresa',
        'Molho, mozzarella, calabresa fatiada e cebola.',
        22.90,
        'Mini Pizzas',
        'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop',
        4.7,
        true,
        false
    ),
    (
        'Mini Pizza 4 Queijos',
        'Mozzarella, provolone, parmesão e catupiry.',
        24.90,
        'Mini Pizzas',
        'https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=800&auto=format&fit=crop',
        4.8,
        false,
        false
    ),
    (
        'Mini Pizza Portuguesa',
        'Mozzarella, presunto, ovo, ervilha e cebola.',
        23.90,
        'Mini Pizzas',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
        4.6,
        false,
        false
    ),

    -- PORÇÕES
    (
        'Batata Frita com Cheddar e Bacon',
        'Porção generosa de fritas com muito cheddar e bacon em cubos.',
        28.90,
        'Porções',
        'https://images.unsplash.com/photo-1585109649139-3668018951a7?w=800&auto=format&fit=crop',
        4.9,
        true,
        false
    ),
    (
        'Frango a Passarinho',
        '1kg de frango frito com alho torrado e salsinha.',
        42.90,
        'Porções',
        'https://images.unsplash.com/photo-1626082927389-9b5a198de7e6?w=800&auto=format&fit=crop',
        4.8,
        false,
        false
    ),
    (
        'Anéis de Cebola',
        'Onion rings crocantes, acompanha molho barbecue.',
        24.90,
        'Porções',
        'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&auto=format&fit=crop',
        4.7,
        false,
        true
    ),
    (
        'Calabresa Acebolada',
        'Porção de calabresa fatiada com cebola e pães de acompanhamento.',
        32.90,
        'Porções',
        'https://images.unsplash.com/photo-1519708227418-e8d316e8e129?w=800&auto=format&fit=crop',
        4.6,
        false,
        false
    ),

    -- SOBREMESAS
    (
        'Brownie com Sorvete',
        'Brownie quente de chocolate com bola de sorvete de creme.',
        22.90,
        'Sobremesas',
        'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&auto=format&fit=crop',
        4.9,
        true,
        false
    ),
    (
        'Petit Gateau',
        'Bolo de chocolate com recheio cremoso e sorvete.',
        26.90,
        'Sobremesas',
        'https://images.unsplash.com/photo-1617305855685-6bb047b97a24?w=800&auto=format&fit=crop',
        4.9,
        false,
        true
    ),
    (
        'Pudim de Leite',
        'Pudim tradicional de leite condensado sem furinhos.',
        12.90,
        'Sobremesas',
        'https://images.unsplash.com/photo-1517093750849-c1e95c1a7987?w=800&auto=format&fit=crop',
        4.8,
        false,
        false
    ),
    (
        'Açaí na Tigela 300ml',
        'Acompanha granola, banana e morango.',
        18.90,
        'Sobremesas',
        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop',
        4.8,
        true,
        false
    );

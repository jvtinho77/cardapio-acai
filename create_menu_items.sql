-- Create the table
CREATE TABLE public.itens_cardapio (
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
CREATE POLICY "Public items are viewable by everyone" ON public.itens_cardapio
    FOR SELECT USING (true);

-- Insert data
INSERT INTO public.itens_cardapio (nome, descricao, preco, categoria, imagem_url, rating, is_popular, is_new)
VALUES
    (
        'Burger Artesanal',
        'Hambúrguer 180g, queijo cheddar derretido, bacon crocante, alface fresca e molho especial da casa',
        38.90,
        'Lanches',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop', -- Placeholder for local burgerImg
        4.8,
        true,
        false
    ),
    (
        'Pizza Margherita',
        'Massa artesanal, molho de tomate italiano, mozzarella de búfala e manjericão fresco',
        54.90,
        'Mini Pizzas',
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop', -- Placeholder for local pizzaImg
        4.9,
        false,
        true
    ),
    (
        'Batata Frita Especial',
        'Batatas fritas crocantes com tempero secreto, acompanha maionese caseira',
        18.90,
        'Porções',
        'https://images.unsplash.com/photo-1573080496987-8198cb04cd81?w=800&auto=format&fit=crop', -- Placeholder for local friesImg
        4.6,
        false,
        false
    ),
    (
        'Suco de Laranja Natural',
        'Suco de laranja 100% natural, feito na hora com laranjas selecionadas',
        12.90,
        'Bebidas',
        'https://images.unsplash.com/photo-1620882672778-5a7ecb7b419b?w=800&auto=format&fit=crop', -- Placeholder for local juiceImg
        4.7,
        false,
        false
    ),
    (
        'Brownie com Calda',
        'Brownie de chocolate belga com calda quente e sorvete de baunilha',
        24.90,
        'Sobremesas',
        'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&auto=format&fit=crop', -- Placeholder for local brownieImg
        4.9,
        true,
        false
    ),
    (
        'Salada Caesar',
        'Mix de folhas, frango grelhado, croutons, parmesão e molho caesar cremoso',
        32.90,
        'Porções',
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop', -- Placeholder for local saladImg
        4.5,
        false,
        true
    );

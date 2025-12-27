import burgerImg from "@/assets/burger.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import friesImg from "@/assets/fries.jpg";
import juiceImg from "@/assets/juice.jpg";
import brownieImg from "@/assets/brownie.jpg";
import saladImg from "@/assets/salad.jpg";

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const menuItems: MenuItemData[] = [
  {
    id: "1",
    name: "Burger Artesanal",
    description: "Hambúrguer 180g, queijo cheddar derretido, bacon crocante, alface fresca e molho especial da casa",
    price: 38.90,
    image: burgerImg,
    rating: 4.8,
    category: "Lanches",
    isPopular: true,
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Massa artesanal, molho de tomate italiano, mozzarella de búfala e manjericão fresco",
    price: 54.90,
    image: pizzaImg,
    rating: 4.9,
    category: "Mini Pizzas",
    isNew: true,
  },
  {
    id: "3",
    name: "Batata Frita Especial",
    description: "Batatas fritas crocantes com tempero secreto, acompanha maionese caseira",
    price: 18.90,
    image: friesImg,
    rating: 4.6,
    category: "Porções",
  },
  {
    id: "4",
    name: "Suco de Laranja Natural",
    description: "Suco de laranja 100% natural, feito na hora com laranjas selecionadas",
    price: 12.90,
    image: juiceImg,
    rating: 4.7,
    category: "Bebidas",
  },
  {
    id: "5",
    name: "Brownie com Calda",
    description: "Brownie de chocolate belga com calda quente e sorvete de baunilha",
    price: 24.90,
    image: brownieImg,
    rating: 4.9,
    category: "Sobremesas",
    isPopular: true,
  },
  {
    id: "6",
    name: "Salada Caesar",
    description: "Mix de folhas, frango grelhado, croutons, parmesão e molho caesar cremoso",
    price: 32.90,
    image: saladImg,
    rating: 4.5,
    category: "Porções",
    isNew: true,
  },
];

export const categories = ["Todos", "Lanches", "Bebidas", "Pastel", "Mini Pizzas", "Porções", "Sobremesas"];

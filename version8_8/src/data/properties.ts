
export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  category: string;
  is_available: boolean;
  adults_capacity?: number;
  children_capacity?: number;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Casa rural en Sierra Nevada",
    location: "Granada, España",
    price: 120,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    category: "Montaña",
    is_available: true,
    adults_capacity: 4,
    children_capacity: 3
  },
  {
    id: 2,
    title: "Apartamento frente al mar",
    location: "Málaga, España",
    price: 95,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Playa",
    is_available: true,
    adults_capacity: 2,
    children_capacity: 2
  },
  {
    id: 3,
    title: "Chalet en Valle del Jerte",
    location: "Cáceres, España",
    price: 150,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Rural",
    is_available: false,
    adults_capacity: 6,
    children_capacity: 4
  },
  {
    id: 4,
    title: "Casa de campo en La Rioja",
    location: "La Rioja, España",
    price: 0,
    image: "https://images.unsplash.com/photo-1600607687644-c7e43bd09c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Rural",
    is_available: true,
    adults_capacity: 3,
    children_capacity: 2
  },
  {
    id: 5,
    title: "Cabaña en los Pirineos",
    location: "Huesca, España",
    price: 110,
    image: "https://images.unsplash.com/photo-1543491799-78212ce6f527?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Montaña",
    is_available: true,
    adults_capacity: 2,
    children_capacity: 1
  }
];

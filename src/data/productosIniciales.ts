// Datos hardcoded
export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string;       
  disponible: boolean;  
};

export const productosIniciales: Producto[] = [
  {
    id: '1',
    nombre: 'iPhone 15 Pro',
    precio: 1199,
    categoria: 'Smartphones',
    stock: 12,
    imagen: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400',
    disponible: true,
  },
  {
    id: '2',
    nombre: 'MacBook Air M3',
    precio: 1299,
    categoria: 'Laptops',
    stock: 8,
    imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    disponible: true,
  },
  {
    id: '3',
    nombre: 'AirPods Pro 2',
    precio: 249,
    categoria: 'Audio',
    stock: 25,
    imagen: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
    disponible: true,
  },
  {
    id: '4',
    nombre: 'iPad Air',
    precio: 599,
    categoria: 'Tablets',
    stock: 0,
    imagen: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    disponible: false,
  },
  {
    id: '5',
    nombre: 'Apple Watch Series 9',
    precio: 399,
    categoria: 'Wearables',
    stock: 15,
    imagen: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    disponible: true,
  },
];
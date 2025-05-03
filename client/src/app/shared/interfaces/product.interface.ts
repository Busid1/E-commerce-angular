export interface Product {
  _id: string;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
}

export interface ProductItemCart {
  product: Product; // Producto anidado
  quantity: number; // Cantidad en el carrito
}



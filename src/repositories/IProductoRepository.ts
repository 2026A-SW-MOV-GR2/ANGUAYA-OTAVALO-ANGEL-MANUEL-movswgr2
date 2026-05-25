import { Producto } from '../data/productosIniciales';

export interface IProductoRepository {
  inicializar(): Promise<void>;
  obtenerTodos(): Promise<Producto[]>;
  guardar(producto: Producto): Promise<void>;
  eliminar(id: string): Promise<void>;
}

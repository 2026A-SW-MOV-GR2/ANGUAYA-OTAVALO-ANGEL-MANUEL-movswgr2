import { createMMKV } from 'react-native-mmkv';
import { Producto } from '../data/productosIniciales';
import { IProductoRepository } from './IProductoRepository';

// Instancia propia para el repositorio de productos (independiente de secretos)
const storage = createMMKV({ id: 'tiendatecno-productos' });

const KEY = 'productos_list';

export class MMKVProductoRepository implements IProductoRepository {

  async inicializar(): Promise<void> {
    console.log('[INFO] [MMKV] Repositorio listo (sin inicializacion async).');
  }

  async obtenerTodos(): Promise<Producto[]> {
    console.log('[DEBUG] [MMKV] Leyendo productos...');
    const raw = storage.getString(KEY);
    if (!raw) {
      console.log('[INFO] [MMKV] Sin datos previos, retornando [].');
      return [];
    }
    const lista = JSON.parse(raw) as Producto[];
    console.log(`[INFO] [MMKV] ${lista.length} productos cargados.`);
    return lista;
  }

  async guardar(producto: Producto): Promise<void> {
    console.log(`[INFO] [MMKV] Guardando: ${producto.id} - ${producto.nombre}`);
    const actuales = await this.obtenerTodos();
    const existe = actuales.findIndex(p => p.id === producto.id);
    if (existe >= 0) {
      actuales[existe] = producto;
    } else {
      actuales.push(producto);
    }
    storage.set(KEY, JSON.stringify(actuales));
  }

  async eliminar(id: string): Promise<void> {
    console.log(`[INFO] [MMKV] Eliminando id: ${id}`);
    const actuales = await this.obtenerTodos();
    const filtrados = actuales.filter(p => p.id !== id);
    storage.set(KEY, JSON.stringify(filtrados));
  }
}
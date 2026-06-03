import SQLite from 'react-native-sqlite-storage';
import { Producto } from '../data/productosIniciales';
import { IProductoRepository } from './IProductoRepository';

SQLite.enablePromise(true);

export class SQLiteProductoRepository implements IProductoRepository {
  private db: SQLite.SQLiteDatabase | null = null;

  async inicializar(): Promise<void> {
    console.log('[INFO] [SQLite] Inicializando base de datos...');
    this.db = await SQLite.openDatabase({
      name: 'tiendatecno.db',
      location: 'default',
    });
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS productos (
        id TEXT PRIMARY KEY,
        nombre TEXT,
        precio REAL,
        categoria TEXT,
        stock INTEGER,
        imagen TEXT,
        disponible INTEGER
      )`
    );
    console.log('[INFO] [SQLite] Tabla productos lista.');
  }

  async obtenerTodos(): Promise<Producto[]> {
    console.log('[DEBUG] [SQLite] Consultando todos los productos...');
    if (!this.db) return [];
    const [result] = await this.db.executeSql('SELECT * FROM productos');
    const productos: Producto[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      productos.push({ ...row, disponible: row.disponible === 1 });
    }
    console.log(`[INFO] [SQLite] ${productos.length} productos encontrados.`);
    return productos;
  }

  async guardar(p: Producto): Promise<void> {
    if (!this.db) return;
    console.log(`[INFO] [SQLite] Guardando: ${p.id} - ${p.nombre}`);
    await this.db.executeSql(
      `INSERT OR REPLACE INTO productos
       (id, nombre, precio, categoria, stock, imagen, disponible)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.nombre, p.precio, p.categoria, p.stock, p.imagen, p.disponible ? 1 : 0]
    );
  }

  async eliminar(id: string): Promise<void> {
    if (!this.db) return;
    console.log(`[INFO] [SQLite] Eliminando id: ${id}`);
    await this.db.executeSql('DELETE FROM productos WHERE id = ?', [id]);
  }
}

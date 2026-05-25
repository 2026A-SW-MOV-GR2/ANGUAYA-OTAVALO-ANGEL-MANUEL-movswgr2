import { MMKVProductoRepository } from '../repositories/MMKVProductoRepository';
import { createMMKV } from 'react-native-mmkv';

// Limpiar el store antes de cada test para que sean independientes
beforeEach(() => {
  const s = createMMKV({ id: 'test' }) as any;
  if (s._clear) s._clear();
});

//Datos de prueba 
const productoTest = {
  id:         'test-1',
  nombre:     'Producto Test',
  precio:     99,
  categoria:  'Test',
  stock:      5,
  imagen:     'https://via.placeholder.com/150',
  disponible: true,
};

const productoTest2 = {
  id:         'test-2',
  nombre:     'Segundo Producto',
  precio:     199,
  categoria:  'Test',
  stock:      3,
  imagen:     'https://via.placeholder.com/150',
  disponible: false,
};

// PRUEBA 1: Guardar y recuperar 
test('MMKV: guardar un producto y recuperarlo correctamente', async () => {
  const repo = new MMKVProductoRepository();
  await repo.guardar(productoTest);

  const lista = await repo.obtenerTodos();

  expect(lista).toHaveLength(1);
  expect(lista[0].id).toBe('test-1');
  expect(lista[0].nombre).toBe('Producto Test');
  expect(lista[0].precio).toBe(99);
});

// PRUEBA 2: Eliminar, esto reduce la lista 
test('MMKV: eliminar un producto reduce la lista correctamente', async () => {
  const repo = new MMKVProductoRepository();
  await repo.guardar(productoTest);
  await repo.guardar(productoTest2);

  const antes = await repo.obtenerTodos();
  expect(antes).toHaveLength(2);

  await repo.eliminar('test-1');

  const despues = await repo.obtenerTodos();
  expect(despues).toHaveLength(1);
  expect(despues[0].id).toBe('test-2');
});

// PRUEBA 3: Lista vacía al iniciar 
test('MMKV: obtenerTodos retorna lista vacia si no hay datos', async () => {
  const repo = new MMKVProductoRepository();

  const lista = await repo.obtenerTodos();

  expect(lista).toBeDefined();
  expect(Array.isArray(lista)).toBe(true);
  expect(lista).toHaveLength(0);
});

// PRUEBA 4: Actualizar no duplica 
test('MMKV: actualizar un producto existente no duplica la lista', async () => {
  const repo = new MMKVProductoRepository();
  await repo.guardar(productoTest);

  const actualizado = { ...productoTest, nombre: 'Producto Actualizado', precio: 149 };
  await repo.guardar(actualizado);

  const lista = await repo.obtenerTodos();
  expect(lista).toHaveLength(1);
  expect(lista[0].nombre).toBe('Producto Actualizado');
  expect(lista[0].precio).toBe(149);
});

// PRUEBA 5: Independencia SQL/NoSQL 
test('MMKV: el repositorio parte limpio independiente de otras instancias', async () => {
  const repo1 = new MMKVProductoRepository();
  const repo2 = new MMKVProductoRepository();

  await repo1.guardar(productoTest);

  const listaRepo2 = await repo2.obtenerTodos();
  expect(listaRepo2).toHaveLength(1);

  await repo2.eliminar('test-1');
  const listaRepo1 = await repo1.obtenerTodos();
  expect(listaRepo1).toHaveLength(0);
});
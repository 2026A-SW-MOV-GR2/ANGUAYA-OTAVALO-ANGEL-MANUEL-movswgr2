import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import ListadoScreen from './src/screens/ListadoScreen';
import FormularioScreen from './src/screens/FormularioScreen';
import { Producto, productosIniciales } from './src/data/productosIniciales';
import { theme } from './src/styles/theme';

// Tipo que define las pantallas posibles.
type Pantalla = 'listado' | 'formulario';

export default function App() {
  // Qué pantalla está activa
  const [pantalla, setPantalla] = useState<Pantalla>('listado');

  // Array de productos (el CRUD funciona sobre este array)
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);

  // Producto seleccionado para editar (null = modo CREATE)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  // Navegar al formulario en modo CREATE
  const handleCrear = () => {
    setProductoEditar(null);
    setPantalla('formulario');
  };

  // Navegar al formulario en modo UPDATE
  const handleEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setPantalla('formulario');
  };

  // Eliminar un producto del array
  const handleEliminar = (id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  // Guardar
  const handleGuardar = (producto: Producto) => {
    setProductos((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        // UPDATE: reemplazar el producto existente
        return prev.map((p) => (p.id === producto.id ? producto : p));
      } else {
        // CREATE: agregar al inicio del array
        return [producto, ...prev];
      }
    });
    setPantalla('listado');
  };

  // Cancelar y volver al listado
  const handleCancelar = () => {
    setPantalla('listado');
  };

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      {/* Renderizado condicional: mostramos una pantalla u otra
          según el estado "pantalla". Esto reemplaza una librería
          de navegación para este caso simple. */}
      {pantalla === 'listado' ? (
        <ListadoScreen
          productos={productos}
          onCrear={handleCrear}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      ) : (
        <FormularioScreen
          productoEditar={productoEditar}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}
    </>
  );
}
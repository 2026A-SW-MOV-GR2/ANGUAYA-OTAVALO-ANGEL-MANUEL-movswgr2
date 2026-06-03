import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  ToastAndroid,
} from 'react-native';
import { Producto } from '../data/productosIniciales';
import { IProductoRepository } from '../repositories/IProductoRepository';
import { theme } from '../styles/theme';

type Props = {
  repo: IProductoRepository;
  productoEditar: Producto | null;
  onGuardar: (producto: Producto) => void;
  onCancelar: () => void;
};

export default function FormularioScreen({
  repo,
  productoEditar,
  onGuardar,
  onCancelar,
}: Props) {
  const [nombre,    setNombre]    = useState(productoEditar?.nombre    ?? '');
  const [precio,    setPrecio]    = useState(productoEditar?.precio?.toString()  ?? '');
  const [categoria, setCategoria] = useState(productoEditar?.categoria ?? '');
  const [stock,     setStock]     = useState(productoEditar?.stock?.toString()   ?? '');
  const [imagen,    setImagen]    = useState(productoEditar?.imagen    ?? '');
  const [disponible,setDisponible]= useState(productoEditar?.disponible ?? true);

  const esEdicion = productoEditar !== null;

  const handleGuardar = async () => {
    if (!nombre.trim() || !precio.trim() || !categoria.trim()) {
      ToastAndroid.show('Completa los campos obligatorios', ToastAndroid.SHORT);
      return;
    }

    const producto: Producto = {
      id:         productoEditar?.id ?? Date.now().toString(),
      nombre:     nombre.trim(),
      precio:     parseFloat(precio) || 0,
      categoria:  categoria.trim(),
      stock:      parseInt(stock, 10) || 0,
      imagen:     imagen.trim() || 'https://via.placeholder.com/150',
      disponible,
    };

    console.log(`[INFO] Guardando "${producto.nombre}" en ${repo.constructor.name}`);
    await repo.guardar(producto);

    onGuardar(producto);
    ToastAndroid.show(
      esEdicion ? 'Producto actualizado' : 'Producto creado',
      ToastAndroid.SHORT,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>
          {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: iPhone 15 Pro"
          placeholderTextColor={theme.colors.outline}
        />

        <Text style={styles.label}>Precio (USD) *</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="999"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.outline}
        />

        <Text style={styles.label}>Categoría *</Text>
        <TextInput
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ej: Smartphones"
          placeholderTextColor={theme.colors.outline}
        />

        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.outline}
        />

        <Text style={styles.label}>URL de Imagen</Text>
        <TextInput
          style={styles.input}
          value={imagen}
          onChangeText={setImagen}
          placeholder="https://..."
          placeholderTextColor={theme.colors.outline}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Disponible para venta</Text>
          <Switch
            value={disponible}
            onValueChange={setDisponible}
            trackColor={{ false: '#CCC', true: theme.colors.primaryContainer }}
            thumbColor={disponible ? theme.colors.primary : '#999'}
          />
        </View>

        <View style={styles.botonera}>
          <TouchableOpacity
            style={[styles.boton, styles.botonCancelar]}
            onPress={onCancelar}
          >
            <Text style={styles.botonCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonGuardar]}
            onPress={handleGuardar}
          >
            <Text style={styles.botonGuardarTexto}>
              {esEdicion ? 'Actualizar' : 'Crear'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: theme.elevation.level2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.small,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.onSurface,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  botonera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.large,
    alignItems: 'center',
    elevation: theme.elevation.level1,
  },
  botonCancelar: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  botonCancelarTexto: {
    color: theme.colors.onSurface,
    fontSize: 15,
    fontWeight: '600',
  },
  botonGuardar: {
    backgroundColor: theme.colors.primary,
  },
  botonGuardarTexto: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

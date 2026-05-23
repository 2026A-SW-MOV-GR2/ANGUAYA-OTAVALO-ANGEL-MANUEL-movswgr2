import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import { Producto } from '../data/productosIniciales';
import { theme } from '../styles/theme';

// Props que recibe la pantalla desde App.tsx
type Props = {
  productos: Producto[];
  onCrear: () => void;                    // Navegar a formulario en modo CREATE
  onEditar: (producto: Producto) => void; // Navegar a formulario en modo UPDATE
  onEliminar: (id: string) => void;       // Eliminar del array
};

export default function ListadoScreen({
  productos,
  onCrear,
  onEditar,
  onEliminar,
}: Props) {

  // Función que dispara el FLUJO DE ELIMINACIÓN del taller.
  // Cumple: "Long press o botón rojo -> Dispara confirmación de borrado"
  const confirmarEliminar = (producto: Producto) => {
    // Alert.alert es el Dialog/Modal NATIVO de Android.
    // En el Layout Inspector se ve como android.app.AlertDialog.
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de eliminar "${producto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onEliminar(producto.id);
            // ToastAndroid se mapea a android.widget.Toast nativo.
            // Cumple: "tras la acción, mostrar un Toast de éxito"
            ToastAndroid.show(
              `"${producto.nombre}" eliminado correctamente`,
              ToastAndroid.SHORT,
            );
          },
        },
      ],
    );
  };

  // Renderizado de cada item de la lista (cada tarjeta de producto).
  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onEditar(item)}              // Click corto: editar (UPDATE)
      onLongPress={() => confirmarEliminar(item)} // Click largo: eliminar (DELETE)
      activeOpacity={0.7}
    >
      {/* Image se mapea a android.widget.ImageView */}
      <Image source={{ uri: item.imagen }} style={styles.imagen} />

      {/* Información del producto */}
      <View style={styles.info}>
        {/* Cada Text se mapea a android.widget.TextView */}
        <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
        <Text style={styles.precio}>${item.precio}</Text>
        <Text style={[
          styles.stock,
          { color: item.stock === 0 ? theme.colors.error : theme.colors.success }
        ]}>
          {item.stock === 0 ? 'Sin stock' : `Stock: ${item.stock}`}
        </Text>
      </View>

      {/* Botón rojo de eliminar (también dispara confirmación) */}
      <TouchableOpacity
        style={styles.botonEliminar}
        onPress={() => confirmarEliminar(item)}
      >
        <Text style={styles.botonEliminarTexto}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header de la pantalla */}
      <View style={styles.header}>
        <Text style={styles.titulo}>TiendaTecno</Text>
        <Text style={styles.subtitulo}>{productos.length} productos disponibles</Text>
      </View>

      {/* FlatList: componente nativo de listas eficientes.
          Internamente usa RecyclerView de Android.
          Cumple: "Una lista (RecyclerView o equivalente)" */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay productos. Toca + para agregar.</Text>
        }
      />

      {/* FAB (Floating Action Button) - botón flotante de Material Design 3.
          Cumple: "Click en botón flotante -> Navega a Formulario (Create)" */}
      <TouchableOpacity style={styles.fab} onPress={onCrear} activeOpacity={0.8}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  subtitulo: {
    fontSize: 14,
    color: theme.colors.onPrimary,
    opacity: 0.9,
    marginTop: 4,
  },
  lista: {
    padding: 16,
  },
  // Tarjeta con bordes redondeados y elevación: Material 3
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.medium,
    padding: 12,
    marginBottom: 12,
    elevation: theme.elevation.level1,
    alignItems: 'center',
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.small,
    backgroundColor: '#E0E0E0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  categoria: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 2,
  },
  precio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 4,
  },
  stock: {
    fontSize: 12,
    marginTop: 2,
  },
  botonEliminar: {
    padding: 8,
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.small,
  },
  botonEliminarTexto: {
    fontSize: 20,
    color: theme.colors.onPrimary,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 50,
    color: theme.colors.outline,
    fontSize: 16,
  },
  // FAB: botón flotante circular Material Design 3
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: theme.elevation.level3,
  },
  fabTexto: {
    fontSize: 32,
    color: theme.colors.onPrimary,
    fontWeight: '300',
  },
});
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Producto } from '../data/productosIniciales';
import { IProductoRepository } from '../repositories/IProductoRepository';
import { theme } from '../styles/theme';

type Props = {
  repo: IProductoRepository;
  usaSQL: boolean;
  onToggleMotor: () => void;
  onCrear: () => void;
  onEditar: (producto: Producto) => void;
};

export default function ListadoScreen({
  repo,
  usaSQL,
  onToggleMotor,
  onCrear,
  onEditar,
}: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);

  // useFocusEffect se ejecuta al montar Y cada vez que se vuelve a esta pantalla
  // (incluye volver desde FormularioScreen con goBack)
  // También se re-ejecuta cuando cambia repo o usaSQL (cambio de motor)
  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        console.log(`[INFO] Cargando productos desde ${usaSQL ? 'SQLite' : 'MMKV'}...`);
        await repo.inicializar();
        const datos = await repo.obtenerTodos();
        setProductos(datos);
        console.log(`[INFO] ${datos.length} productos cargados en UI.`);
      };
      cargar();
    }, [repo, usaSQL])
  );

  // Eliminar usando el repositorio activo
  const confirmarEliminar = (producto: Producto) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de eliminar "${producto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            console.log(`[INFO] Eliminando "${producto.nombre}" de ${usaSQL ? 'SQLite' : 'MMKV'}`);
            await repo.eliminar(producto.id);
            setProductos(prev => prev.filter(p => p.id !== producto.id));
            ToastAndroid.show(
              `"${producto.nombre}" eliminado`,
              ToastAndroid.SHORT,
            );
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onEditar(item)}
      onLongPress={() => confirmarEliminar(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imagen }} style={styles.imagen} />

      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
        <Text style={styles.precio}>${item.precio}</Text>
        <Text style={[
          styles.stock,
          { color: item.stock === 0 ? theme.colors.error : theme.colors.success },
        ]}>
          {item.stock === 0 ? 'Sin stock' : `Stock: ${item.stock}`}
        </Text>
      </View>

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
      {/* ── Header con Switch y Chip ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.titulo}>TiendaTecno</Text>

          <View style={styles.switchContainer}>
            {/* Chip de color: verde = SQL, naranja = NoSQL */}
            <View style={[
              styles.chip,
              { backgroundColor: usaSQL ? '#22C55E' : '#F97316' },
            ]}>
              <Text style={styles.chipTexto}>
                {usaSQL ? 'SQL' : 'NoSQL'}
              </Text>
            </View>

            {/* Switch: izquierda = SQL, derecha = NoSQL */}
            <Switch
              value={!usaSQL}
              onValueChange={onToggleMotor}
              trackColor={{ false: '#22C55E', true: '#F97316' }}
              thumbColor="white"
            />
          </View>
        </View>

        <Text style={styles.subtitulo}>
          {productos.length} productos · {usaSQL ? 'SQLite (Relacional)' : 'MMKV Store (NoSQL)'}
        </Text>
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            No hay productos en {usaSQL ? 'SQLite' : 'MMKV'}.{'\n'}Toca + para agregar.
          </Text>
        }
      />

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
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: theme.elevation.level2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipTexto: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 13,
    color: theme.colors.onPrimary,
    opacity: 0.9,
    marginTop: 6,
  },
  lista: {
    padding: 16,
  },
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
    lineHeight: 26,
  },
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

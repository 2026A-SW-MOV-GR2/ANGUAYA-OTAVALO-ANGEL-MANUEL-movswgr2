import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
  useWindowDimensions,
} from 'react-native';

// Se extrae el módulo nativo del objeto NativeModules.
// El nombre "ResourcesModule" debe coincidir EXACTAMENTE con
// el getName() que pusiste en ResourcesModule.kt
const { ResourcesModule } = NativeModules;

// Tipos de TypeScript para mejor autocompletado y seguridad
type Strings = { saludo: string; orientacion: string };
type Colors = { texto: string; fondo: string };

export default function App() {
  // Estados donde guardamos lo que el módulo nativo nos devuelve
  const [strings, setStrings] = useState<Strings | null>(null);
  const [colors, setColors] = useState<Colors | null>(null);

  // Hook que se actualiza automáticamente al rotar el dispositivo.
  // Se usa solo para mostrar las dimensiones en pantalla.
  const { width, height } = useWindowDimensions();

  // Función que cruza el puente JS → Nativo → JS para pedir los recursos.
  // useCallback evita que se recree en cada render.
  const cargarRecursos = useCallback(async () => {
    try {
      // Estas dos llamadas son asíncronas porque el puente RN lo es.
      // Android resuelve internamente cuál archivo de values/ usar
      // según el idioma y orientación actuales del sistema.
      const nuevasStrings = await ResourcesModule.getStrings();
      const nuevosColores = await ResourcesModule.getColors();

      setStrings(nuevasStrings);
      setColors(nuevosColores);
    } catch (error) {
      console.error('Error al cargar recursos nativos:', error);
    }
  }, []);

  // Carga inicial al montar el componente por primera vez
  useEffect(() => {
    cargarRecursos();
  }, [cargarRecursos]);

  // Es para escuchar el evento que MainActivity.kt emite desde el método nativo
  // onConfigurationChanged() cada vez que Android detecta un cambio de
  // configuración (idioma u orientación) y cumplir con reaccionar a onConfigurationChanged sin perder el estado.
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'onConfigurationChanged',
      () => {
        cargarRecursos();
      }
    );
    return () => subscription.remove();
  }, [cargarRecursos]);

  // Pantalla de carga mientras el puente responde por primera vez
  if (!strings || !colors) {
    return (
      <View style={styles.loading}>
        <Text>Cargando recursos nativos...</Text>
      </View>
    );
  }

  // Aqui se aplican los textos y colores que vinieron
  // del módulo nativo. Como Android ya resolvió el calificador correcto,
  // aquí solo se pinta lo que recibimos. NO hay condicionales de
  // idioma ni orientación
  return (
    <View style={[styles.container, { backgroundColor: colors.fondo }]}>
      <Text style={[styles.titulo, { color: colors.texto }]}>
        {strings.saludo}
      </Text>
      <Text style={[styles.subtitulo, { color: colors.texto }]}>
        {strings.orientacion}
      </Text>
      <Text style={[styles.info, { color: colors.texto }]}>
        Dimensiones: {Math.round(width)} x {Math.round(height)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 20,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
  },
});
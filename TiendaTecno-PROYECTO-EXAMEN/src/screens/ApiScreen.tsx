import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { obtenerPost, actualizarPost } from '../services/apiService';
import { theme } from '../styles/theme';

export default function ApiScreen() {
  // Estado para el ID que el usuario ingresa
  const [id, setId] = useState('1');

  // Estado para el post obtenido (title y body editables)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Estados de carga: true mientras la petición está en tránsito
  const [cargando, setCargando] = useState(false);
  const [actualizando, setActualizando] = useState(false);

  // Estado para mostrar mensaje de éxito tras PUT
  const [exitoso, setExitoso] = useState(false);

  // Handler del botón GET
  const handleObtener = async () => {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId < 1 || numId > 100) {
      ToastAndroid.show('ID debe ser entre 1 y 100', ToastAndroid.SHORT);
      return;
    }

    setCargando(true);
    setExitoso(false);

    try {
      const post = await obtenerPost(numId);
      setTitle(post.title);
      setBody(post.body);
      ToastAndroid.show('Post obtenido correctamente', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Error al obtener el post', ToastAndroid.LONG);
    } finally {
      setCargando(false);
    }
  };

  // Handler del botón PUT
  const handleActualizar = async () => {
    if (!title.trim() || !body.trim()) {
      ToastAndroid.show('Title y body no pueden estar vacíos', ToastAndroid.SHORT);
      return;
    }

    setActualizando(true);

    try {
      await actualizarPost(parseInt(id, 10), title, body);
      setExitoso(true);
      ToastAndroid.show('Post actualizado (200 OK)', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Error al actualizar', ToastAndroid.LONG);
    } finally {
      setActualizando(false);
    }
  };

  // Indica si algún input/botón debe estar deshabilitado
  const enCarga = cargando || actualizando;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>API REST</Text>
        <Text style={styles.subtitulo}>JSONPlaceholder</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {/* Sección 1: Consulta GET */}
        <Text style={styles.label}>ID del post (1-100)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={id}
            onChangeText={setId}
            keyboardType="numeric"
            editable={!enCarga}
            placeholder="1"
          />
          <TouchableOpacity
            style={[
              styles.boton,
              styles.botonObtener,
              enCarga && styles.botonDeshabilitado,
            ]}
            onPress={handleObtener}
            disabled={enCarga}
          >
            {cargando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.botonTexto}>Obtener</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sección 2: Formulario editable */}
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          editable={!enCarga}
          placeholder="Título del post"
          multiline
        />

        <Text style={styles.label}>Cuerpo</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinea]}
          value={body}
          onChangeText={setBody}
          editable={!enCarga}
          placeholder="Cuerpo del post"
          multiline
          numberOfLines={5}
        />

        {/* Sección 3: Botón PUT y confirmación */}
        <TouchableOpacity
          style={[
            styles.boton,
            styles.botonActualizar,
            enCarga && styles.botonDeshabilitado,
          ]}
          onPress={handleActualizar}
          disabled={enCarga}
        >
          {actualizando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.botonTexto}>Actualizar (PUT)</Text>
          )}
        </TouchableOpacity>

        {exitoso && (
          <View style={styles.exito}>
            <Text style={styles.exitoTexto}>
              ✓ Actualizado correctamente (200 OK)
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  subtitulo: { fontSize: 14, color: 'white', opacity: 0.9 },
  form: { padding: 20 },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  row: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  inputMultilinea: { minHeight: 100, textAlignVertical: 'top' },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  botonObtener: { backgroundColor: theme.colors.secondary },
  botonActualizar: {
    backgroundColor: theme.colors.primary,
    marginTop: 24,
  },
  botonDeshabilitado: { opacity: 0.5 },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  exito: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#C8E6C9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  exitoTexto: { color: theme.colors.success, fontWeight: 'bold' },
});

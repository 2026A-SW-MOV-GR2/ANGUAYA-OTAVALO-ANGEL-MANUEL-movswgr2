import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {
  guardarSecreto,
  recuperarSecreto,
  MecanismoAlmacenamiento,
} from '../services/secretosService';
import { theme } from '../styles/theme';

const MECANISMOS: { id: MecanismoAlmacenamiento; label: string }[] = [
  { id: 'SharedPreferences', label: 'SharedPreferences (Texto Plano)' },
  { id: 'DataStore', label: 'DataStore (Reactiva)' },
  { id: 'EncryptedSharedPreferences', label: 'Encrypted (Cifrado AES-256)' },
];

export default function SecretosScreen() {
  const [llave, setLlave] = useState('');
  const [valor, setValor] = useState('');
  const [mecanismo, setMecanismo] = useState<MecanismoAlmacenamiento>(
    'SharedPreferences'
  );

  // Resultado de la recuperación
  const [resultado, setResultado] = useState<string | null>(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Handler: Guardar
  const handleGuardar = async () => {
    if (!llave.trim() || !valor.trim()) {
      ToastAndroid.show('Llave y Valor son obligatorios', ToastAndroid.SHORT);
      return;
    }

    try {
      await guardarSecreto(mecanismo, llave.trim(), valor.trim());
      ToastAndroid.show(
        `Guardado en ${mecanismo}`,
        ToastAndroid.SHORT
      );
      setValor('');
    } catch (error) {
      ToastAndroid.show('Error al guardar', ToastAndroid.LONG);
      console.error('[ERROR]', error);
    }
  };

  // Handler: Recuperar
  const handleRecuperar = async () => {
    if (!llave.trim()) {
      ToastAndroid.show('Ingresa una llave para buscar', ToastAndroid.SHORT);
      return;
    }

    try {
      const valorRecuperado = await recuperarSecreto(mecanismo, llave.trim());
      setResultado(valorRecuperado);
      setBusquedaRealizada(true);
    } catch (error) {
      ToastAndroid.show('Error al recuperar', ToastAndroid.LONG);
      console.error('[ERROR]', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Gestión de Secretos</Text>
        <Text style={styles.subtitulo}>Almacenamiento Nativo Android</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {/* Selector de mecanismo (Radio buttons) */}
        <Text style={styles.label}>Mecanismo de Almacenamiento</Text>
        {MECANISMOS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.radio,
              mecanismo === m.id && styles.radioSeleccionado,
            ]}
            onPress={() => {
              setMecanismo(m.id);
              setResultado(null);
              setBusquedaRealizada(false);
            }}
          >
            <View style={styles.radioCirculo}>
              {mecanismo === m.id && <View style={styles.radioPunto} />}
            </View>
            <Text style={styles.radioLabel}>{m.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Inputs */}
        <Text style={styles.label}>Llave (Key)</Text>
        <TextInput
          style={styles.input}
          value={llave}
          onChangeText={(t) => {
            setLlave(t);
            setBusquedaRealizada(false);
          }}
          placeholder="Ej: token_sesion"
        />

        <Text style={styles.label}>Valor (Value)</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={setValor}
          placeholder="Ej: abc123xyz"
          secureTextEntry={mecanismo === 'EncryptedSharedPreferences'}
        />

        {/* Botones */}
        <View style={styles.botonera}>
          <TouchableOpacity
            style={[styles.boton, styles.botonGuardar]}
            onPress={handleGuardar}
          >
            <Text style={styles.botonTexto}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonRecuperar]}
            onPress={handleRecuperar}
          >
            <Text style={styles.botonTexto}>Recuperar</Text>
          </TouchableOpacity>
        </View>

        {/* Resultado de la búsqueda */}
        {busquedaRealizada && (
          <View
            style={[
              styles.resultado,
              resultado ? styles.resultadoExito : styles.resultadoError,
            ]}
          >
            <Text style={styles.resultadoTitulo}>
              {resultado ? '✓ Secreto encontrado' : '✗ Secreto no encontrado'}
            </Text>
            {resultado && (
              <Text style={styles.resultadoValor}>{resultado}</Text>
            )}
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
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  radioSeleccionado: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EADDFF',
  },
  radioCirculo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioPunto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  radioLabel: { fontSize: 14, flex: 1 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  botonera: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    elevation: 2,
  },
  botonGuardar: { backgroundColor: theme.colors.primary },
  botonRecuperar: { backgroundColor: theme.colors.secondary },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  resultado: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  resultadoExito: {
    backgroundColor: '#C8E6C9',
    borderLeftColor: theme.colors.success,
  },
  resultadoError: {
    backgroundColor: '#FFCDD2',
    borderLeftColor: theme.colors.error,
  },
  resultadoTitulo: { fontWeight: 'bold', marginBottom: 4 },
  resultadoValor: { fontFamily: 'Courier', fontSize: 13 },
});

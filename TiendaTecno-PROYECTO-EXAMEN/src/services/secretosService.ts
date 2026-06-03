import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import EncryptedStorage from 'react-native-encrypted-storage';

// MMKV v4 - Usando createMMKV() según la documentación oficial
export const storage = createMMKV({ id: 'tiendatecno-datastore' });

// Tipo: los 3 mecanismos disponibles
export type MecanismoAlmacenamiento =
  | 'SharedPreferences'
  | 'DataStore'
  | 'EncryptedSharedPreferences';

// =================================================
// SharedPreferences (AsyncStorage)
// =================================================
const guardarSharedPreferences = async (
  llave: string,
  valor: string
): Promise<void> => {
  console.log(`[INFO] [SharedPreferences] Guardando: ${llave}`);
  await AsyncStorage.setItem(llave, valor);
};

const obtenerSharedPreferences = async (
  llave: string
): Promise<string | null> => {
  console.log(`[INFO] [SharedPreferences] Buscando: ${llave}`);
  return await AsyncStorage.getItem(llave);
};

// =================================================
// DataStore (MMKV v4)
// =================================================
const guardarDataStore = (llave: string, valor: string): void => {
  console.log(`[INFO] [DataStore/MMKV] Guardando: ${llave}`);
  storage.set(llave, valor);
};

const obtenerDataStore = (llave: string): string | undefined => {
  console.log(`[INFO] [DataStore/MMKV] Buscando: ${llave}`);
  return storage.getString(llave);
};

// =================================================
// EncryptedSharedPreferences
// =================================================
const guardarEncrypted = async (
  llave: string,
  valor: string
): Promise<void> => {
  console.log(`[INFO] [Encrypted] Guardando (cifrado AES-256): ${llave}`);
  await EncryptedStorage.setItem(llave, valor);
};

const obtenerEncrypted = async (
  llave: string
): Promise<string | null> => {
  console.log(`[INFO] [Encrypted] Buscando: ${llave}`);
  try {
    return await EncryptedStorage.getItem(llave);
  } catch {
    return null;
  }
};

// =================================================
// API pública: una sola función para guardar
// =================================================
export const guardarSecreto = async (
  mecanismo: MecanismoAlmacenamiento,
  llave: string,
  valor: string
): Promise<void> => {
  switch (mecanismo) {
    case 'SharedPreferences':
      await guardarSharedPreferences(llave, valor);
      break;
    case 'DataStore':
      guardarDataStore(llave, valor);
      break;
    case 'EncryptedSharedPreferences':
      await guardarEncrypted(llave, valor);
      break;
  }
};

// =================================================
// API pública: una sola función para recuperar
// =================================================
export const recuperarSecreto = async (
  mecanismo: MecanismoAlmacenamiento,
  llave: string
): Promise<string | null> => {
  switch (mecanismo) {
    case 'SharedPreferences':
      return await obtenerSharedPreferences(llave);
    case 'DataStore': {
      const valor = obtenerDataStore(llave);
      return valor ?? null;
    }
    case 'EncryptedSharedPreferences':
      return await obtenerEncrypted(llave);
    default:
      return null;
  }
};

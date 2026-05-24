# TiendaTecno 🛒

Aplicación móvil desarrollada en **React Native** para la materia de Aplicaciones Móviles

Implementar conectividad REST con JSONPlaceholder y almacenamiento seguro usando las APIs nativas de Android.

---

## Módulos implementados

| Módulo | Descripción |
|--------|-------------|
| **Tienda (CRUD)** | Listado, creación, edición y eliminación de productos con estado reactivo |
| **API REST** | Consulta (GET) y actualización (PUT) de posts desde JSONPlaceholder con manejo de loading states |
| **Almacenamiento Seguro** | Guardado y recuperación de secretos en SharedPreferences, DataStore y EncryptedSharedPreferences |

---

## Estructura del proyecto

```
src/
├── data/
│   └── productosIniciales.ts       # Datos iniciales hardcoded
├── navigation/
│   └── AppNavigator.tsx            # Pestañas + Stack CRUD
├── screens/
│   ├── ListadoScreen.tsx           # Lista de productos (CRUD)
│   ├── FormularioScreen.tsx        # Crear / Editar producto
│   ├── ApiScreen.tsx               # Módulo 1 — API REST
│   └── SecretosScreen.tsx          # Módulo 3 — Almacenamiento Seguro
├── services/
│   ├── apiService.ts               # Lógica HTTP (fetch nativo)
│   └── secretosService.ts          # Lógica de almacenamiento
└── styles/
    └── theme.ts                    # Colores y tokens Material Design 3
```

---

## Requisitos previos

- Node.js v20+
- JDK 17
- Android Studio con SDK configurado
- Variable de entorno `ANDROID_HOME` activa
- Emulador Android corriendo (minSdkVersion 23)

---

## Instalación

### 1. Clonar e instalar dependencias

```sh
npm install
```

### 2. Librerías utilizadas

**Navegación:**
```sh
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

**Almacenamiento:**
```sh
npm install @react-native-async-storage/async-storage
npm install react-native-mmkv
npm install react-native-nitro-modules
npm install react-native-encrypted-storage
```

> **Importante:** después de instalar `react-native-mmkv` y `react-native-encrypted-storage` es obligatorio recompilar con `npm run android` porque tienen código nativo.

---

## Ejecutar la app

### 1. Iniciar Metro

```sh
npm start
```

### 2. Compilar y correr en Android

```sh
# En otra terminal
npm run android
```

La primera compilación tarda 5–10 minutos. Espera el mensaje `BUILD SUCCESSFUL`.

Si necesitas limpiar la caché de Metro:

```sh
npm start -- --reset-cache
```

Si necesitas limpiar Gradle:

```sh
cd android && gradlew clean && cd .. && npm run android
```

---

## Mapeo a APIs nativas de Android

| Librería React Native | API nativa Android equivalente |
|-----------------------|-------------------------------|
| `AsyncStorage` | SharedPreferences |
| `react-native-mmkv` | DataStore (Jetpack) |
| `react-native-encrypted-storage` | EncryptedSharedPreferences (AES-256) |

---

## Solución de errores comunes

**`Cannot find module 'react-native-mmkv'`**
→ Recompilar: `cd android && gradlew clean && cd .. && npm run android`

**`react-native-encrypted-storage` no funciona**
→ Verificar que `minSdkVersion = 23` en `android/build.gradle`

**`Network request failed` al hacer GET/PUT**
→ Asegurarse de tener `android:usesCleartextTraffic="true"` en `AndroidManifest.xml`

**App en blanco / pantalla negra**
→ Verificar que Metro esté corriendo (`npm start`) y que `App.tsx` use `AppNavigator`

---

## Recursos

- [React Native — Documentación oficial](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [react-native-encrypted-storage](https://github.com/emeraldsanto/react-native-encrypted-storage)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

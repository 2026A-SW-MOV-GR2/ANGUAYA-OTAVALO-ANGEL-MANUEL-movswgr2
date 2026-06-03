# TiendaTecno 🛒

Aplicación móvil desarrollada en **React Native** para la materia de Aplicaciones Móviles.

El proyecto implementa conectividad REST con JSONPlaceholder y almacenamiento seguro usando las APIs nativas de Android. Sobre esta base se desarrolló el examen, que extiende el CRUD con una **arquitectura de Persistencia Dual** (SQL + NoSQL).

---

## Módulos implementados

| Módulo | Descripción |
|--------|-------------|
| **Tienda (CRUD)** | Listado, creación, edición y eliminación de productos con estado reactivo |
| **API REST** | Consulta (GET) y actualización (PUT) de posts desde JSONPlaceholder con manejo de loading states |
| **Almacenamiento Seguro** | Guardado y recuperación de secretos en SharedPreferences, DataStore y EncryptedSharedPreferences |
| **Persistencia Dual** *(Examen)* | Conmutación en tiempo real entre SQLite (relacional) y MMKV Store (NoSQL) mediante el Patrón Repositorio |

---

## Estructura del proyecto

```
src/
├── data/
│   └── productosIniciales.ts           # Datos iniciales hardcoded
├── navigation/
│   └── AppNavigator.tsx                # Pestañas + Stack CRUD
├── repositories/                       # ← Examen: Patrón Repositorio
│   ├── IProductoRepository.ts          # Interfaz común
│   ├── SQLiteProductoRepository.ts     # Motor SQL (Posición A)
│   └── MMKVProductoRepository.ts       # Motor NoSQL (Posición B)
├── screens/
│   ├── ListadoScreen.tsx               # Lista de productos (CRUD + switch dual)
│   ├── FormularioScreen.tsx            # Crear / Editar producto
│   ├── ApiScreen.tsx                   # Módulo — API REST
│   └── SecretosScreen.tsx              # Módulo — Almacenamiento Seguro
├── services/
│   ├── apiService.ts                   # Lógica HTTP (fetch nativo)
│   └── secretosService.ts             # Lógica de almacenamiento
├── styles/
│   └── theme.ts                        # Colores y tokens Material Design 3
├── __tests__/
│   └── repositorios.test.ts            # 5 pruebas unitarias (Examen)
└── __mocks__/                          # Simuladores para las pruebas
    ├── async-storage.ts
    ├── encrypted-storage.ts
    ├── react-native-mmkv.ts
    └── sqlite-storage.ts
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

### 1. Clonar e instalar dependencias base

```sh
npm install
```

### 2. Librerías del proyecto

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

### 3. Librerías del examen (Persistencia Dual)

```sh
npm install react-native-sqlite-storage
npm install @types/react-native-sqlite-storage
```

> **Importante:** `react-native-mmkv`, `react-native-encrypted-storage` y `react-native-sqlite-storage` tienen código nativo. Después de instalarlas es **obligatorio** recompilar con `npm run android`.

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

**Limpiar caché de Metro:**
```sh
npm start -- --reset-cache
```

**Limpiar Gradle:**
```sh
cd android && gradlew clean && cd .. && npm run android
```

---

## Persistencia Dual — Examen 🗄️

### ¿Cómo funciona la conmutación?

El switch en el header de `ListadoScreen` conmuta entre los dos motores en tiempo real:

| Chip | Motor | Tecnología | Almacenamiento |
|------|-------|------------|----------------|
| 🟢 Verde → SQL | SQLite | `react-native-sqlite-storage` | `tiendatecno.db` |
| 🟠 Naranja → NoSQL | MMKV Store | `react-native-mmkv` | `productos_list` |

Cada motor tiene su propio espacio de almacenamiento — los datos son **completamente independientes**.

### Patrón Repositorio

`IProductoRepository` define el contrato común que usan `ListadoScreen` y `FormularioScreen`, sin conocer los detalles de SQLite o MMKV directamente:

```ts
export interface IProductoRepository {
  inicializar(): Promise<void>;
  obtenerTodos(): Promise<Producto[]>;
  guardar(producto: Producto): Promise<void>;
  eliminar(id: string): Promise<void>;
}
```

### Logs estructurados

Cada operación imprime trazas en consola:

```
[DEBUG] [SQLite] Consultando todos los productos...
[INFO]  [SQLite] 3 productos encontrados.
[INFO]  [MMKV]  Guardando: 1748123456 - MacBook Pro
[ERROR] [SQLite] Fallo al ejecutar consulta: ...
```

---

## Pruebas unitarias

Configurar Jest en `package.json`:

```json
"jest": {
  "preset": "react-native",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json"],
  "transformIgnorePatterns": [
    "node_modules/(?!(react-native|@react-native|@react-navigation|react-native-mmkv|@react-native-async-storage|react-native-encrypted-storage|react-native-sqlite-storage)/)"
  ],
  "moduleNameMapper": {
    "@react-native-async-storage/async-storage": "<rootDir>/src/__mocks__/async-storage.ts",
    "react-native-encrypted-storage": "<rootDir>/src/__mocks__/encrypted-storage.ts",
    "react-native-sqlite-storage": "<rootDir>/src/__mocks__/sqlite-storage.ts",
    "react-native-mmkv": "<rootDir>/src/__mocks__/react-native-mmkv.ts"
  }
}
```

Ejecutar las pruebas:

```sh
npm test
```

Las 5 pruebas validan la capa lógica del repositorio MMKV:

| # | Prueba | Qué valida |
|---|--------|------------|
| 1 | Guardar y recuperar | Escritura y lectura básica |
| 2 | Eliminar reduce la lista | Integridad al borrar |
| 3 | Lista vacía sin datos | Estado inicial limpio |
| 4 | Actualizar no duplica | INSERT OR REPLACE en NoSQL |
| 5 | Independencia SQL/NoSQL | Los motores son independientes entre sí |

> SQLite se valida funcionalmente en el emulador: crear un producto en SQL, cambiar a NoSQL y verificar que no aparece.

---

## Mapeo a APIs nativas de Android

| Librería React Native | API nativa Android | Paradigma |
|-----------------------|--------------------|-----------|
| `AsyncStorage` | SharedPreferences | Clave-valor simple |
| `react-native-mmkv` | DataStore (Jetpack) | NoSQL — sin esquema |
| `react-native-encrypted-storage` | EncryptedSharedPreferences (AES-256) | Clave-valor cifrado |
| `react-native-sqlite-storage` | SQLite (archivo `.db`) | Relacional — esquema fijo |

---

## Recursos

- [React Native — Documentación oficial](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [react-native-encrypted-storage](https://github.com/emeraldsanto/react-native-encrypted-storage)
- [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage)
- [useFocusEffect — React Navigation](https://reactnavigation.org/docs/use-focus-effect)
- [Jest — Getting Started](https://jestjs.io/docs/getting-started)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
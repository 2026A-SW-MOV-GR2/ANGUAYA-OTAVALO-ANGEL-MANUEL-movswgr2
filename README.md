# TiendaTecno — Examen: Persistencia Dual 🗄️

Arquitectura híbrida con conmutación relacional y no relacional en tiempo real para almacenamiento móvil local.

---

## ¿Qué implementa este examen?

El CRUD de productos existente se transformó en un sistema capaz de cambiar su motor de datos en tiempo de ejecución sin alterar la interfaz de usuario, cumpliendo el Patrón Repositorio.

| Posición | Motor | Tecnología |
|----------|-------|------------|
| A — Relacional (SQL) | SQLite | `react-native-sqlite-storage` |
| B — No Relacional (NoSQL) | MMKV Store | `react-native-mmkv` |

---

## Estructura nueva creada para el examen

```
src/
├── repositories/
│   ├── IProductoRepository.ts        ← Interfaz común (Patrón Repositorio)
│   ├── SQLiteProductoRepository.ts   ← Motor SQL (Posición A)
│   └── MMKVProductoRepository.ts     ← Motor NoSQL (Posición B)
├──  __tests__/
│   └── repositorios.test.ts          ← 4 pruebas unitarias
└── __mocks__/                        ← Simuladores de las bases de datos para las pruebas unitarias
    ├── async-storage.ts        
    ├── encrypted-storage.ts   
    ├── react-native-mmkv.ts
    └── sqlite-storage.ts
```

Archivos modificados: `AppNavigator.tsx`, `ListadoScreen.tsx`, `FormularioScreen.tsx`

---

## Requisitos previos

- Node.js v20+
- JDK 17
- Android Studio con SDK configurado
- Emulador Android corriendo 

---

## Instalación

```sh
npm install react-native-sqlite-storage
npm install @types/react-native-sqlite-storage
npm install react-native-mmkv
npm install react-native-nitro-modules
```


Recompilar para registrar SQLite nativamente:

```sh
cd android && gradlew clean && cd ..
npm run android
```

> La primera compilación tarda 5–10 minutos. Esperar `BUILD SUCCESSFUL`.


---

## Ejecutar la app

```sh
# Terminal 1
npm start

# Terminal 2
npm run android
```

---

## Cómo funciona la conmutación

El switch en el header de `ListadoScreen` conmuta entre los dos motores en tiempo real:

- **Chip verde → SQL:** los datos se leen y escriben en SQLite (`tiendatecno.db`)
- **Chip naranja → NoSQL:** los datos se leen y escriben en MMKV Store (`productos_list`)

Cada motor tiene su propio espacio de almacenamiento — los datos son completamente independientes.

---

## Patrón Repositorio

`IProductoRepository` define el contrato común:

```ts
export interface IProductoRepository {
  inicializar(): Promise<void>;
  obtenerTodos(): Promise<Producto[]>;
  guardar(producto: Producto): Promise<void>;
  eliminar(id: string): Promise<void>;
}
```

`ListadoScreen` y `FormularioScreen` solo conocen esta interfaz, nunca los detalles de SQLite o MMKV directamente.

---

## Logs estructurados

Cada operación imprime trazas en consola con su tipo:

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

Las 4 pruebas validan la capa lógica del repositorio MMKV:

| # | Prueba | Qué valida |
|---|--------|------------|
| 1 | Guardar y recuperar | Escritura y lectura básica |
| 2 | Eliminar reduce la lista | Integridad al borrar |
| 3 | Lista vacía sin datos | Estado inicial limpio |
| 4 | Actualizar no duplica | INSERT OR REPLACE en NoSQL |
| 5 | Independencia SQL/NoSQL | Los motores sean independientes entre si|

> SQLite se valida funcionalmente en el emulador: crear un producto en SQL, cambiar a NoSQL y verificar que no aparece — los almacenes son independientes.

---

## Mapeo a APIs nativas de Android

| Librería React Native | API nativa Android | Paradigma |
|-----------------------|--------------------|-----------|
| `react-native-sqlite-storage` | SQLite (archivo .db) | Relacional — esquema fijo |
| `react-native-mmkv` | DataStore (Jetpack) | NoSQL — sin esquema, orientado a documentos |


## Recursos

- [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [useFocusEffect — React Navigation](https://reactnavigation.org/docs/use-focus-effect)
- [Jest — Getting Started](https://jestjs.io/docs/getting-started)
import React, { useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListadoScreen from '../screens/ListadoScreen';
import FormularioScreen from '../screens/FormularioScreen';
import ApiScreen from '../screens/ApiScreen';
import SecretosScreen from '../screens/SecretosScreen';
import { Producto, productosIniciales } from '../data/productosIniciales';
import { theme } from '../styles/theme';

// Repositorios
import { IProductoRepository } from '../repositories/IProductoRepository';
import { SQLiteProductoRepository } from '../repositories/SQLiteProductoRepository';
import { MMKVProductoRepository } from '../repositories/MMKVProductoRepository';

// Singletons: se instancian una sola vez fuera del componente
const sqliteRepo = new SQLiteProductoRepository();
const mmkvRepo   = new MMKVProductoRepository();

// Tipos para el stack del CRUD
type CrudStackParamList = {
  Listado: undefined;
  Formulario: { productoEditar: Producto | null };
};

const Tab  = createBottomTabNavigator();
const Stack = createNativeStackNavigator<CrudStackParamList>();

// ── Stack interno del CRUD ────────────────────────────────────────────────────
function CrudStack({
  repo,
  usaSQL,
  onToggleMotor,
}: {
  repo: IProductoRepository;
  usaSQL: boolean;
  onToggleMotor: () => void;
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Listado">
        {(props) => (
          <ListadoScreen
            {...props}
            repo={repo}
            usaSQL={usaSQL}
            onToggleMotor={onToggleMotor}
            onCrear={() =>
              props.navigation.navigate('Formulario', { productoEditar: null })
            }
            onEditar={(producto) =>
              props.navigation.navigate('Formulario', { productoEditar: producto })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Formulario">
        {(props) => (
          <FormularioScreen
            {...props}
            repo={repo}
            productoEditar={props.route.params.productoEditar}
            onGuardar={() => props.navigation.goBack()}
            onCancelar={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// ── Navegador principal ───────────────────────────────────────────────────────
export default function AppNavigator() {
  // true = SQLite (Posición A), false = MMKV (Posición B)
  const [usaSQL, setUsaSQL] = useState(true);
  const repo: IProductoRepository = usaSQL ? sqliteRepo : mmkvRepo;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.outline,
          tabBarStyle: { paddingBottom: 4, paddingTop: 4, height: 60 },
        }}
      >
        <Tab.Screen
          name="Tienda"
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🛒</Text>
            ),
          }}
        >
          {() => (
            <CrudStack
              repo={repo}
              usaSQL={usaSQL}
              onToggleMotor={() => setUsaSQL(prev => !prev)}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="API"
          component={ApiScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🌐</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Secretos"
          component={SecretosScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🔒</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

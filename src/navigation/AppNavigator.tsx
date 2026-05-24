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

// Tipos para el stack del CRUD
type CrudStackParamList = {
  Listado: undefined;
  Formulario: { productoEditar: Producto | null };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<CrudStackParamList>();

// Stack que agrupa Listado y Formulario (el CRUD)
function CrudStack({
  productos,
  setProductos,
}: {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Listado">
        {(props) => (
          <ListadoScreen
            {...props}
            productos={productos}
            onCrear={() =>
              props.navigation.navigate('Formulario', { productoEditar: null })
            }
            onEditar={(producto) =>
              props.navigation.navigate('Formulario', { productoEditar: producto })
            }
            onEliminar={(id) =>
              setProductos((prev) => prev.filter((p) => p.id !== id))
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Formulario">
        {(props) => (
          <FormularioScreen
            {...props}
            productoEditar={props.route.params.productoEditar}
            onGuardar={(producto) => {
              setProductos((prev) => {
                const existe = prev.find((p) => p.id === producto.id);
                if (existe) {
                  return prev.map((p) => (p.id === producto.id ? producto : p));
                }
                return [producto, ...prev];
              });
              props.navigation.goBack();
            }}
            onCancelar={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Navegador principal con 3 pestañas inferiores
export default function AppNavigator() {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);

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
          {() => <CrudStack productos={productos} setProductos={setProductos} />}
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

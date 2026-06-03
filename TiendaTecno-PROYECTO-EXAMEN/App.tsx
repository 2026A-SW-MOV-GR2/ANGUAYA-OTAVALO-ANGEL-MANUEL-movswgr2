import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

// App.tsx ahora solo monta el navegador.
// Toda la lógica de pantallas está en AppNavigator.tsx
export default function App() {
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <AppNavigator />
    </>
  );
}

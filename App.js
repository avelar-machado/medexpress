import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/Login';
import HomeClient from './pages/HomeClient';
import Register from './pages/Register';
import HomeMed from './pages/HomeMed';
import Products from './pages/ProductMed';
import HomeScreen from './pages/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Principal" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registo" component={Register} />
        <Stack.Screen name="Cliente" component={HomeClient} />
        <Stack.Screen name="Farmacia" component={HomeMed} />
        <Stack.Screen name="Produtos" component={Products} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



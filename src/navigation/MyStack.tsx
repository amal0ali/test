import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CartScreen from '../screens/CartScreen';
import TabNavigator from './TabNavigator';
import TabFournisseurNavigator from './TabFournisseurNavigator';
import DetailsCommandeFourScreen from '../screens/DetailsCommandeFourScreen';
import MenuFourScreen from '../screens/MenuFourScreen';  // Assurez-vous d'importer vos nouveaux écrans
import AddPlatScreen from '../screens/AddPlatScreen';
import EditPlatScreen from '../screens/EditPlatScreen';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignUpScreen} />
      <Stack.Screen name="Welcome" component={TabNavigator} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="cart" component={CartScreen} />
      <Stack.Screen name="DashFournisseur" component={TabFournisseurNavigator} />
      <Stack.Screen name="DetailsCommandeFour" component={DetailsCommandeFourScreen} />
      <Stack.Screen name="MenuFour" component={MenuFourScreen} />
      <Stack.Screen name="AddPlat" component={AddPlatScreen} />
      <Stack.Screen name="EditPlat" component={EditPlatScreen} />
    </Stack.Navigator>
  );
}

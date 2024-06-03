import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid; // Récupérer l'ID utilisateur

      // Stocker l'ID du fournisseur
      await AsyncStorage.setItem('fournisseurId', userId);
      console.log('Fournisseur ID stocké:', userId); // Log pour vérifier

      // Si la connexion réussit, effacez l'erreur et définissez le succès de la connexion
      setError('');
      setLoginSuccess(true);
      console.log('Logged in successfully!');
    } catch (e) {
      // Si la connexion échoue, définissez le message d'erreur et réinitialisez le succès de la connexion
      setError(e.message);
      setLoginSuccess(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
      {loginSuccess ? <Text style={{ color: 'green', marginBottom: 10 }}>Login successful!</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

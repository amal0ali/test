import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur notre application !</Text>
      {/* Ajoutez d'autres éléments de votre page Welcome ici */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFDEDA',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
    marginBottom: 20,
    color: '#FF4B3A',
  },
  // Ajoutez d'autres styles selon vos besoins
});

export default WelcomeScreen;
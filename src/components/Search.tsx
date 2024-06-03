import React from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import search from './../../assets/images/search.png';

function Search() {
  return (
    // Vue contenant le champ de texte pour la recherche
    <View style={styles.container}>
      {/* Champ de texte pour la recherche */}
      <Image source={search} style={styles.icon} />
      <TextInput style={styles.textInput} placeholder="Rechercher un plat" placeholderTextColor="gray" />
    </View>
  );
}

// Styles pour le composant Search
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0', // Changer la couleur de fond de la barre de recherche en gris clair
    width: '88%', // Largeur de la vue
    height: 40,
    alignSelf: 'center', // Alignement au centre
    borderRadius: 20, // Bord arrondi
    justifyContent: 'center', // Centrage vertical
    alignItems: 'center', // Centrage horizontal
    paddingLeft: 30, // Marge à gauche
    marginBottom: 30, // Marge en bas
  },
  icon: {
    width: 35, // Icon width
    height: 35, // Icon height
    marginRight: 10, // Space between icon and text input
    marginBottom: 0,
  },
  textInput: {
    flex: 1, // Prendre tout l'espace restant
    width: '100%',
  },
});

export default Search; // Export du composant Search
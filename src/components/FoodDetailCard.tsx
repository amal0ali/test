import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '@react-native-firebase/database'; // Importer firebase depuis @react-native-firebase/database

// Importation des images
import favorieImage from './../../assets/images/favorie.png';
import favoriteSelectedImage from './../../assets/images/favorite-selected.jpg';

function FoodDetailCard({ image, title, price, description, itemId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Récupérer la quantité initiale depuis Firebase
    const quantityRef = firebase.database().ref(`/items/${itemId}/quantity`);
    quantityRef.once('value', snapshot => {
      if (snapshot.exists()) {
        setQuantity(snapshot.val());
      }
    });
  }, [itemId]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const updateQuantityInFirebase = newQuantity => {
    firebase.database().ref(`/items/${itemId}`).update({ quantity: newQuantity });
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantityInFirebase(newQuantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantityInFirebase(newQuantity);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price} MAD</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <Image
            source={isFavorite ? favoriteSelectedImage : favorieImage}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '95%',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
    fontFamily: 'Raleway-Bold',
  },
  price: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Raleway-Bold',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  descriptionContainer: {
    width: '100%',
  },
  description: {
    fontSize: 15,
    color: 'gray',
    fontFamily: 'Raleway-Bold',
  },
  favoriteButton: {
    marginLeft: 'auto',
  },
  favoriteIcon: {
    width: 30,
    height: 30,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4B3A',
    borderRadius: 15,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 10,
    color:'black',
  },
});

export default FoodDetailCard;

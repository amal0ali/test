import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MyText from '../components/MyText';

function CartScreen() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('cart')
      .onSnapshot(querySnapshot => {
        const cartItems = [];
        querySnapshot.forEach(documentSnapshot => {
          cartItems.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setCartItems(cartItems);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <MyText style={styles.title}>Votre Panier</MyText>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imageURL }} style={styles.image} />
            <View style={styles.itemInfo}>
              <MyText style={styles.itemTitle}>{item.title}</MyText>
              <MyText style={styles.itemPrice}>{item.price.toFixed(2)} €</MyText>
            </View>
          </View>
        )}
        keyExtractor={item => item.key}
      />
      <View style={styles.totalContainer}>
        <MyText style={styles.totalText}>Total: {calculateTotal()} €</MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f6ff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;

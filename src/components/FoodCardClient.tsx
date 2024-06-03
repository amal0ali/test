import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MyText from './MyText';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function FoodCardClient({ image, title, price, onPress, itemKey }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <View style={styles.textContainer}>
        <MyText numberOfLines={1} style={styles.title}>
          {title}
        </MyText>
        <MyText style={styles.price}>{price} dh</MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FF4B3A',
    marginHorizontal: 22,
    marginTop: 5,
    height: 200,
    width: 350,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    height: '20%',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: 'white',
  },
  price: {
    color: 'white',
    fontSize: 23,
    marginVertical: 1.5,
  },
});

export default FoodCardClient;
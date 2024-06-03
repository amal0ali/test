import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

function ModifierPlatScreen({ route }) {
  const { platId } = route.params;
  const [plat, setPlat] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlat = async () => {
      try {
        const platRef = await firestore().collection('plats').doc(platId).get();
        if (platRef.exists) {
          const platData = platRef.data();
          platData.document_id = platRef.id;
          setPlat(platData);
          setSelectedCategory(platData.categoryId);
        } else {
          setError('Aucun plat trouvé avec cet ID');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du plat :', error);
        setError('Erreur lors de la récupération du plat');
      } finally {
        setLoading(false);
      }
    };

    fetchPlat();

    return () => {
      setPlat(null);
    };
  }, [platId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = [];
        const querySnapshot = await firestore().collection('categories').get();
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          if (data && data.title) {
            categoriesList.push({
              label: data.title,
              value: documentSnapshot.id,
            });
          } else {
            console.error('Document data or title field is undefined:', documentSnapshot.id);
          }
        });
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSaveChanges = async () => {
    try {
      await axios.put('http://192.168.1.138:8080/plats/update', plat);
      console.log('Plat mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plat : ', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Formulaire de modification du plat avec l'ID : {platId}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du plat"
        value={plat.title}
        onChangeText={(text) => setPlat({ ...plat, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={plat.description}
        onChangeText={(text) => setPlat({ ...plat, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix"
        value={plat.price.toString()}
        onChangeText={(text) => setPlat({ ...plat, price: parseFloat(text) })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="URL de l'image"
        value={plat.imageURL}
        onChangeText={(text) => setPlat({ ...plat, imageURL: text })}
      />
      <DropDownPicker
        open={open}
        value={selectedCategory}
        items={categories}
        setOpen={setOpen}
        setValue={(value) => {
          setSelectedCategory(value);
          setPlat({ ...plat, categoryId: value });
        }}
        placeholder="Sélectionner une catégorie"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <TextInput
        style={styles.input}
        placeholder="Document ID"
        value={plat.document_id}
        onChangeText={(text) => setPlat({ ...plat, document_id: text })}
      />

      <Button title="Enregistrer les modifications" onPress={handleSaveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: 'black',
  },
  dropdown: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default ModifierPlatScreen;

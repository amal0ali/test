import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, TouchableOpacity,Modal, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import FoodCard from '../components/FoodCard';
import axios from 'axios';
import firestore  from '@react-native-firebase/firestore';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';
import DashboardScreen from './DashboardScreen';

const windowHeight = Dimensions.get('window').height;

function HomeScreenFournisseur({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [plats, setPlats] = useState([]);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [username, setUsername] = useState(null);

    const getUserData = async (userId) => {
                  try {
                    const snapshot = await firebase.database().ref('users/' + userId).once('value');
                    return snapshot.val();
                  } catch (error) {
                    console.error('Error fetching user data:', error);
                  }
                };

              useEffect(() => {
                      const unsubscribe = auth().onAuthStateChanged(async (user) => {
                          if (user) {
                              const userData = await getUserData(user.uid);
                              if (userData) {
                                  setUsername(userData.fullName);
                              }
                          } else {
                              setUsername(null);
                          }
                          setLoading(false);
                      });

                      return () => unsubscribe();
                  }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const querySnapshot = await firestore().collection('categories').get();
            const categoriesData = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setCategories(categoriesData);
            setLoading(false);
        };

        const fetchPromotions = async () => {
            const querySnapshot = await firestore().collection('promotions').get();
            const promotionsData = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setPromotions(promotionsData);
        };

        const fetchFoods = async () => {
            const querySnapshot = await firestore().collection('foods').get();
            const foodsData = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setFoods(foodsData);
        };

        fetchCategories();
        fetchPromotions();
        fetchFoods();
    }, []);

    useEffect(() => {
        const fetchPlatsByCategory = async (categoryId) => {
            try {
                const querySnapshot = await firestore()
                    .collection('plats')
                    .where('categoryId', '==', categoryId)
                    .get();
                const platsData = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
                setPlats(platsData);
            } catch (error) {
                console.error('Error fetching plats by category:', error);
            }
        };

        if (selectedCategory) {
            fetchPlatsByCategory(selectedCategory);
        }
    }, [selectedCategory]);



    const toggleDashboard = () => {
        setIsDashboardOpen(!isDashboardOpen);
      };

    const navigateToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    const navigateToCart = () => {
        navigation.navigate('cart');
    };

    const navigateToAddPlat = () => {
        navigation.navigate('AddPlat');
    };

    const handleCategorySelect = (key) => {
        setSelectedCategory(key);
    };

    const deletePlat = async (itemId) => {
        try {
            await axios.delete(`http://192.168.1.138:8080/plats/delete?document_id=${itemId}`);
            setPlats(prevPlats => prevPlats.filter(plat => plat.key !== itemId));
        } catch (error) {
            console.error("Error deleting plat: ", error);
        }
    };

    const updatePlat = (itemId) => {
        navigation.navigate('ModifierPlat', { platId: itemId });
    };

    const navigateToAddCategory = () => {
        navigation.navigate('AddCategory');
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <MyView style={styles.container}>
                <View style={styles.header}>
                    {/* Open Dashboard button */}
                                            <TouchableOpacity onPress={toggleDashboard} style={styles.dashboardButton}>
                                              <Image source={DashboardIcon} style={styles.icon} />
                                            </TouchableOpacity>

                                            {/* Dashboard modal */}
                                          <Modal visible={isDashboardOpen} transparent={true} animationType="none">
                                                                   <View style={styles.modalContainer}>
                                                                     <View style={styles.modal}>
                                                                       <DashboardScreen onClose={toggleDashboard} navigation={navigation} username={username} />
                                                                     </View>
                                                                   </View>
                                          </Modal>
                    <View style={styles.space}></View>
                    <TouchableOpacity onPress={navigateToCart}>
                        <Image source={CartIcon} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <MyText style={styles.headerText}>Salam fournisseur</MyText>
                <Search />
                <View style={{ height: 50 }}>
                    <FlatList
                        horizontal
                        data={categories}
                        renderItem={({ item }) => (
                            <Category
                                title={item.title}
                                itemKey={item.key}
                                isSelected={item.key === selectedCategory}
                                onSelect={handleCategorySelect}
                            />
                        )}
                        keyExtractor={item => item.key}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <TouchableOpacity onPress={navigateToAddPlat}>
                    <View style={styles.addPlatButton}>
                        <MyText style={styles.addPlatButtonText}>Ajouter des plats</MyText>
                    </View>
                </TouchableOpacity>
                <FlatList
                    vertical
                    data={plats}
                    renderItem={({ item }) => (
                        <FoodCard
                            image={item.imageURL}
                            title={item.title}
                            price={item.price}
                            itemKey={item.key}
                            onDelete={() => deletePlat(item.key)}
                            onUpdate={() => updatePlat(item.key)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
                <View style={styles.alo}>
                    <MyText style={styles.text}>Les plus populaires</MyText>
                    <FlatList
                        horizontal
                        data={foods}
                        renderItem={({ item }) => (
                            <FoodCard
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                rate={item.rate}
                                itemKey={item.key}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                    <MyText style={styles.text}>Nos promotions</MyText>
                    <FlatList
                        horizontal
                        data={promotions}
                        renderItem={({ item }) => (
                            <FoodCard
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                rate={item.rate}
                                itemKey={item.key}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </MyView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F2F2F2',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f7f6ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    space: {
        marginLeft: 'auto',
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    addPlatButton: {
        backgroundColor: '#FF4B3A',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        marginHorizontal: 15,
    },
    addPlatButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerText: {
        marginLeft: 21,
        fontSize: 22,
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Raleway-Bold',
    },
    alo: {
        marginTop: -20,
    },
    text: {
        marginLeft: 21,
        fontSize: 20,
        marginBottom: 3,
        marginTop: 30,
        fontFamily: 'Raleway-Bold',
    },
    modalContainer: {
                   flex: 1,
                   justifyContent: 'flex-start',
                   alignItems: 'flex-start', // Align modal to the left side

    },
    modal: {
                   backgroundColor: '#FFFFFF',
                   width: Dimensions.get('window').width / 2, // Half of the screen width
                   height: '100%', // Take up entire height of the screen
                   width: 300,
                   borderTopRightRadius: 20, // Rounded corner on top-right
                   borderBottomRightRadius: 20, // Rounded corner on bottom-right
                   padding: 20,
    },
});

export default HomeScreenFournisseur;

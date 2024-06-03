import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { firebase } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import FoodCardClient from '../components/FoodCardClient';
import DashboardIcon from './../../assets/images/dashbord.png';
import CartIcon from './../../assets/images/panier.png';
import DashboardScreen from './DashboardScreen';


 const windowHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
        const subscriber = firestore()
            .collection('categories')
            .onSnapshot(querySnapshot => {
                const categories = [];
                querySnapshot.forEach(documentSnapshot => {
                    categories.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setCategories(categories);
                setLoading(false);
            });
        return () => subscriber();
    }, []);

    useEffect(() => {
        const subscriber = firestore().collection("foods").onSnapshot((res) => {
            const foods = [];
            res.forEach(documentSnapshot => {
                foods.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setFoods(foods);
        });
        return () => subscriber();
    }, []);

    useEffect(() => {
        const subscriber = firestore()
            .collection('promotions')
            .onSnapshot(querySnapshot => {
                const promotions = [];
                querySnapshot.forEach(documentSnapshot => {
                    promotions.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setPromotions(promotions);
                setLoading(false);
            });
        return () => subscriber();
    }, []);

    const navigateToDashboard = () => {
        navigation.navigate('Dashboard');
    };



    const toggleDashboard = () => {
        setIsDashboardOpen(!isDashboardOpen);
      };

    const navigateToCart = () => {
        navigation.navigate('cart'); // Make sure the route name is 'Cart'
    };

    const getPlatsByCategory = async (categoryId) => {
        try {
            console.log("Fetching plats for category:", categoryId);
            const querySnapshot = await firestore()
                .collection('plats')
                .where('categoryId', '==', categoryId)
                .get();

            const plats = [];
            querySnapshot.forEach(documentSnapshot => {
                plats.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            console.log("Plats fetched for category:", categoryId, plats);
            setPlats(plats);
        } catch (error) {
            console.error('Error fetching plats by category:', error);
        }
    };

    const handleCategorySelect = (key: string) => {
        console.log("Selected category:", key);
        setSelectedCategory(key);
        getPlatsByCategory(key);
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (

            <MyView style={styles.con}>
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
                   <ScrollView style={styles.scrollView}>
                <View>
                    <MyText style={styles.headerText}>Plat fait maison...{'\n'}Relevé d'une touche marocaine</MyText>
                </View>
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
                <View style={{ marginTop: -68 }}>
                    <MyText style={styles.text}> </MyText>
                    <FlatList
                        vertical
                        data={plats}
                        renderItem={({ item }) => (
                            <FoodCardClient
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                itemKey={item.key}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={styles.alo}>
                    <MyText style={styles.text}>Les plus populaires </MyText>
                    <FlatList
                        horizontal
                        data={foods}
                        renderItem={({ item }) => (
                            <FoodCardClient
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
                            <FoodCardClient
                                image={item.imageURL}
                                title={item.title}
                                price={item.price}
                                rate={item.rate}
                                itemKey={item.key}
                            />
                        )}
                    />
                </View>
                </ScrollView>
            </MyView>

    );
}

const styles = StyleSheet.create({
    alo: {
        marginTop: -20,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    con: {
        backgroundColor: '#E0E0E0',
    },
    text: {
        marginLeft: 21,
        fontSize: 20,
        marginBottom: 3,
        marginTop: 30,
        fontFamily: 'Raleway-Bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor:'#E0E0E0',
    },
    space: {
        marginLeft: 'auto',
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    headerText: {
        flex: 1,
        marginLeft: 21,
        fontSize: 22,
        marginTop: 20,
        marginBottom: 20,
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

export default HomeScreen;
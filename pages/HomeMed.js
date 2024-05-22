import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import RegisterProduct from './RegisterProduct';
import Products from './ProductMed';

function HomeMed() {
  const route = useRoute();
  const { userData } = route.params;
  const navigation = useNavigation();
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [showRegisterProduct, setShowRegisterProduct] = useState(false);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.siteNavbar}>
        <View style={styles.logo}>
          <Image source={require('../images/logo.jpeg')} style={styles.logoImage} />
        </View>
        <Text style={styles.userNameText}>{userData.nome}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuItem, selectedMenu === 'Home' && styles.menuItemSelected]}
          onPress={() => {
            setSelectedMenu('Home');
            setShowRegisterProduct(false);
          }}
        >
          <Icon name="home-outline" size={20} color={selectedMenu === 'Home' ? "#fff" : "#000"} />
          <Text style={[styles.menuText, selectedMenu === 'Home' && styles.menuTextSelected]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, selectedMenu === 'Produtos' && styles.menuItemSelected]}
          onPress={() => {
            setSelectedMenu('Produtos');
            setShowRegisterProduct(true);
          }}
        >
          <Icon name="cart-outline" size={20} color={selectedMenu === 'Produtos' ? "#fff" : "#000"} />
          <Text style={[styles.menuText, selectedMenu === 'Produtos' && styles.menuTextSelected]}>Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#000" />
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!showRegisterProduct ? (
          <RegisterProduct userData={userData} onRegister={() => setShowRegisterProduct(false)} />
        ) : (
          <Products userData={userData} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  siteNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 40,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6e6e6e',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  menuItemSelected: {
    backgroundColor: '#3498db',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#3498db',
  },
  menuTextSelected: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default HomeMed;

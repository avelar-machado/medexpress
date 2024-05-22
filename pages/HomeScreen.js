import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated, Easing, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Register from './Register';
import AboutUs from './AboutUs';

function HomeScreen({ navigation }) {
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [showHome, setShowHome] = useState(true);
  const [showAbout, setShowAbout] = useState(true);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.siteNavbar}>
        <View style={styles.logo}>
          <Image source={require('../images/logo.jpeg')} style={styles.logoImage} />
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuItem, selectedMenu === 'Home' && styles.menuItemSelected]}
            onPress={() => {
              setSelectedMenu('Home');
              setShowHome(true);
              setShowAbout(true);
            }}
          >
            <Icon name="home-outline" size={20} color={selectedMenu === 'Home' ? "#fff" : "#000"} />
            <Text style={[styles.menuText, selectedMenu === 'Home' && styles.menuTextSelected]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedMenu === 'Registar-se' && styles.menuItemSelected]}
            onPress={() => {
              setSelectedMenu('Registar-se');
              setShowHome(false);
              setShowAbout(true);
            }}
          >
            <Icon name="person-add-outline" size={20} color={selectedMenu === 'Registar-se' ? "#fff" : "#000"} />
            <Text style={[styles.menuText, selectedMenu === 'Registar-se' && styles.menuTextSelected]}>Registar-se</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, selectedMenu === 'Sobre Nós' && styles.menuItemSelected]}
            onPress={() => {
              setSelectedMenu('Sobre Nós');
              setShowHome(false);
              setShowAbout(false);
            }}
          >
            <Icon name="information-circle-outline" size={20} color={selectedMenu === 'Sobre Nós' ? "#fff" : "#000"} />
            <Text style={[styles.menuText, selectedMenu === 'Sobre Nós' && styles.menuTextSelected]}>Sobre Nós</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
      
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        {showHome ? (
          <ImageBackground
            source={require('../images/hero_1.jpg')}
            style={styles.backgroundImage}>
            <View style={styles.siteBlocksCover}>
              <Text style={styles.subTitle}>Procura e rápida aquisição de medicamentos.</Text>
              <Text style={styles.mainTitle}>Bem-vindo a MEDEXPRESS!</Text>
              <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.shopNowButtonText}>Entrar agora</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground> 
        ) : ( showAbout ? (
          <Register />
        ) : (
          <AboutUs />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  siteNavbar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    marginTop: 20,
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
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
    width: '100%',
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
  line: {
    borderBottomColor: '#3498db',
    borderBottomWidth: 1,
    marginVertical: 5,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  siteBlocksCover: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#333333',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
  },
  shopNowButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  shopNowButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;

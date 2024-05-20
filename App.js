import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/Login';
import HomeClient from './pages/HomeClient';
import Register from './pages/Register';
import HomeFarmacia from './pages/HomeFarmacia';
import ProdutosFarmacia from './pages/ProdutosFarmacia';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Principal" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Cliente" component={HomeClient} />
        <Stack.Screen name="Farmacia" component={HomeFarmacia} />
        <Stack.Screen name="ProdutosFarmacia" component={ProdutosFarmacia} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.siteNavbar}>
        <View style={styles.logo}>
          <Icon name="medkit" size={30} color="#000" style={styles.logoIcon} />
          <Text style={styles.logoText}>MEDEXPRESS</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="home" size={20} color="#000" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Register')}>
            <Icon name="user-plus" size={20} color="#000" />
            <Text style={styles.menuText}>Registrar-se</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}>
            <Icon name="info-circle" size={20} color="#000" />
            <Text style={styles.menuText}>Sobre Nós</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Linha abaixo do menu */}
      <View style={styles.line} />

      {/* Seção com imagem de fundo */}
      <ImageBackground
        source={require('./images/hero_1.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.siteBlocksCover}>
          <Text style={styles.subTitle}>Procura e rápida aquisição de medicamentos.</Text>
          <Text style={styles.mainTitle}>Bem-vindo ao MEDEXPRESS!</Text>
          <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.shopNowButtonText}>Entrar agora</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
  logoIcon: {
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  menuItem: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginLeft: 5,
  },
  // Linha abaixo do menu
  line: {
    borderBottomColor: '#3498db',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  // Seção com imagem de fundo
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // ou 'stretch' dependendo da preferência
    justifyContent: 'center',
    alignItems: 'center',
  },
  siteBlocksCover: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
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
  siteSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  bannerWrap: {
    backgroundColor: '#3498db',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bannerDescription: {
    color: '#ffffff',
  },
  strongText: {
    fontWeight: 'bold',
  },
  // Adicione estilos para o Carousel e outras seções conforme necessário
});

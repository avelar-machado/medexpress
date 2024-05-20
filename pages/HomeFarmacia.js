import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function HomeFarmacia() {
  const route = useRoute();
  const { userData } = route.params;
  const navigation = useNavigation();
  const [productName, setProductName] = useState('');
  const [productOrigem, setProductOrigem] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const handleProductRegistration = async () => {
    
    try {
      const response = await fetch('http://192.168.1.108:3002/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: productName,
          origem: productOrigem,
          descricao: productDescription,
          preco: parseFloat(productPrice),
          quantidade_em_estoque: parseInt(productQuantity, 10),
          email_farmacia: userData.email,
        }),
      });

      if (response.ok) {
        setProductName('');
        setProductOrigem('');
        setProductDescription('');
        setProductPrice('');
        setProductQuantity('');
        Alert.alert('Produto registrado com sucesso!');
      } else {       
        Alert.alert('Erro ao registrar produto. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registrar produto:', error);
      Alert.alert('Erro ao registrar produto. Tente novamente.');
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.siteNavbar}>
        <View style={styles.logo}>
          <Icon name="medkit" size={30} color="#000" style={styles.logoIcon} />
          <Text style={styles.logoText}>MEDEXPRESS</Text>
        </View>
        <Text style={styles.userNameText}>{userData.nome}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HomeFarmacia')}>
          <Icon name="home" size={20} color="#000" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProdutosFarmacia', { userData })}>
          <Icon name="shopping-cart" size={20} color="#000" />
          <Text style={styles.menuText}>Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#000" />
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.titleText}>Registrar Produto</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do Produto"
          value={productName}
          onChangeText={(text) => setProductName(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Origem do Produto"
          value={productOrigem}
          onChangeText={(text) => setProductOrigem(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição do Produto"
          value={productDescription}
          onChangeText={(text) => setProductDescription(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Preço do Produto"
          value={productPrice}
          onChangeText={(text) => setProductPrice(text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade em Estoque"
          value={productQuantity}
          onChangeText={(text) => setProductQuantity(text)}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleProductRegistration}>
          <Text style={styles.registerButtonText}>Registrar Produto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  siteNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6e6e6e',
  },
  line: {
    borderBottomColor: '#3498db',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginLeft: 5,
  },
  formContainer: {
    padding: 20,
    width: '100%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterProduct = ({ userData, onRegister }) => {
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
        onRegister(); // Atualiza a lista de produtos após o registro
      } else {
        Alert.alert('Erro ao registrar produto. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registrar produto:', error);
      Alert.alert('Erro ao registrar produto. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Registar Produto</Text>

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
        <Text style={styles.registerButtonText}>Registar Produto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default RegisterProduct;

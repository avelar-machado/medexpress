import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';

const ProdutosFarmacia = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const route = useRoute();
  const { userData } = route.params;

  const handleProductRegistration = async () => {
    try {
      // Realize a chamada à API para cadastrar o produto
      const response = await fetch('http://192.168.1.108:3002/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: productName,
          descricao: productDescription,
          preco: parseFloat(productPrice),
          quantidade_em_estoque: 0, // Defina a quantidade inicial conforme necessário
          email_farmacia: userData.email,
        }),
      });

      if (response.ok) {
        // Limpar os campos após o registro
        setProductName('');
        setProductDescription('');
        setProductPrice('');

        // Exibir mensagem de sucesso
        Alert.alert('Produto registrado com sucesso!');
      } else {
        // Exibir mensagem de erro se a resposta não estiver OK
        Alert.alert('Erro ao registrar produto. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registrar produto:', error);
      // Exibir mensagem de erro
      Alert.alert('Erro ao registrar produto. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Registrar Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={productName}
        onChangeText={(text) => setProductName(text)}
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

      <TouchableOpacity style={styles.registerButton} onPress={handleProductRegistration}>
        <Text style={styles.registerButtonText}>Registrar Produto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProdutosFarmacia;

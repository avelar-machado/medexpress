// ProdutosFarmacia.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProdutosFarmacia() {
  const route = useRoute();
  const { userData } = route.params;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://192.168.1.108:3002/produtosPorFarmacia/${userData.email}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductClick(item)}>
      <Text style={styles.productName}>{item.nome}</Text>
      <Text style={styles.productDescription}>{item.descricao}</Text>
      <Text style={styles.productPrice}>{item.preco.toFixed(2)} Kz</Text>
    </TouchableOpacity>
  );

  const handleProductClick = (product) => {
    // Implemente a lógica para navegar para a tela de detalhes do produto ou realizar outra ação conforme necessário
    console.log('Produto clicado:', product);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.codigo_produto.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  productList: {
    paddingTop: 10,
  },
  productItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductTable = ({ products }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableHeader}>Lista de Produtos</Text>
      {products.map((product) => (
        <View key={product.id} style={styles.productRow}>
          <Text style={styles.productName}>{product.nome}</Text>
          <Text style={styles.productDescription}>{product.descricao}</Text>
          <Text style={styles.productPrice}>R$ {product.preco.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    flex: 1,
    marginLeft: 10,
    color: '#6e6e6e',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default ProductTable;

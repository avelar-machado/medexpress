import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function Reservation({ userData }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://192.168.1.108:3002/reservations/${userData.email}`);
      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        items: JSON.parse(item.items) // Convertendo a string JSON de items para objeto JavaScript
      }));
      setReservations(formattedData);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.reservationItem}>
      <Text style={styles.pharmacyName}>Farmácia: {item.pharmacyEmail}</Text>
      <Text style={styles.totalPrice}>Preço Total: {item.total.toFixed(2)} Kz</Text>
      <View style={styles.itemsList}>
        <Text style={styles.itemTitle}>Produtos:</Text>
        {item.items.map((product, index) => (
          <View key={index}>
            <Text style={styles.item}>
              Nome: {product.name}
            </Text>
            <Text style={styles.item}>
              Quantidade: {product.quantity}
            </Text>
            <Text style={styles.item}>
              Preço Unitário: {product.price.toFixed(2)} Kz
            </Text>
            <Text style={styles.item}>
              Subtotal: {product.subtotal.toFixed(2)} Kz
            </Text>
            <Text style={styles.separator}></Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.reservationList}
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
  reservationList: {
    paddingTop: 10,
  },
  reservationItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  itemsList: {
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  item: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
});

export default Reservation;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importe os ícones desejados

function Reservation({ userData }) {
  const [reservations, setReservations] = useState([]);
  const [fadeIn] = useState(new Animated.Value(0)); // Configuração de animação fade-in

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
      // Inicia a animação fade-in após os dados serem carregados
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.reservationItem, { opacity: fadeIn }]}>
      <TouchableOpacity>
        <View style={styles.iconContainer}>
          <Ionicons name="storefront-outline" size={24} color="#007bff" />
          <Text style={styles.iconText}><Text style={{fontWeight: 'bold'}}>Email da Farmácia:</Text> {item.pharmacyEmail}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={24} color="#007bff" />
          <Text style={styles.iconText}><Text style={{fontWeight: 'bold'}}>Preço Total:</Text> {item.total.toFixed(2)} Kz</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={24} color="#007bff" />
          <Text style={styles.iconText}><Text style={{fontWeight: 'bold'}}>Data da Reserva:</Text> {formatDate(item.date)}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.itemsList}>
        <Text style={styles.itemTitle}>Produtos:</Text>
        {item.items.map((product, index) => (
          <View key={index}>
            <Text style={styles.item}>
              <Ionicons name="medkit-outline" size={16} color="#555" /> Nome: {product.name}
            </Text>
            <Text style={styles.item}>
              <Ionicons name="cube-outline" size={16} color="#555" /> Quantidade: {product.quantity}
            </Text>
            <Text style={styles.item}>
              <Ionicons name="pricetag-outline" size={16} color="#555" /> Preço Unitário: {product.price.toFixed(2)} Kz
            </Text>
            <Text style={styles.item}>
              <Ionicons name="cash-outline" size={16} color="#555" /> Subtotal: {product.subtotal.toFixed(2)} Kz
            </Text>
            <Text style={styles.separator}></Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formato da data depende do idioma do dispositivo
  };

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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconText: {
    fontSize: 16,
    marginLeft: 10,
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
    marginLeft: 10,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default Reservation;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, FlatList, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Email from 'expo-mail-composer';
import { debounce } from 'lodash';
import Reservation from './Reservation';

function HomeClient() {
  const route = useRoute();
  const { userData } = route.params;
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [userName, setUserName] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [quantity, setQuantity] = useState({});
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [showHome, setShowHome] = useState(true);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const fetchProducts = async (text) => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`http://192.168.1.108:3002/produtosPorNome/${text}`);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.log('Erro na resposta.');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 300), []);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedFetchProducts(text);
  };

  const handleAddToCart = (product) => {
    const updatedCart = { ...cart };
    updatedCart[product.codigo_produto] = (updatedCart[product.codigo_produto] || 0) + (quantity[product.codigo_produto] || 0);
    setCart(updatedCart);
  };

  const handleChangeQuantity = (productCode, value) => {
    setQuantity({ ...quantity, [productCode]: parseInt(value) });
  };

  const handleFinishReservation = async () => {
    const invoicesByPharmacy = createInvoicesByPharmacy();

    if (loadingProducts) {
      return null;
    }

    try {
      for (const pharmacyEmail in invoicesByPharmacy) {
        const invoice = invoicesByPharmacy[pharmacyEmail];
        // Enviar e-mail com a fatura
        await Email.composeAsync({
          recipients: [pharmacyEmail],
          subject: 'Reserva de Medicamentos',
          body: formatItemsForEmail(invoice.items, invoice.total),
        });
         // Enviar fatura para o servidor
         await saveReservationOnServer(pharmacyEmail, invoice.items, invoice.total, userData.email);
      }

      showInvoices(invoicesByPharmacy);
      setCart({});
      Alert.alert('Sucesso', 'Reserva finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mails:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao finalizar a reserva. Por favor, tente novamente.');
    }
  };

  const saveReservationOnServer = async (pharmacyEmail, items, total, clientEmail) => {
    try {
      const response = await fetch('http://192.168.1.108:3002/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacyEmail,
          items,
          total,
          clientEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar reserva no servidor.');
      }
    } catch (error) {
      console.error('Erro ao salvar reserva no servidor:', error);
      throw error;
    }
  };

  const createInvoicesByPharmacy = () => {
    const invoicesByPharmacy = {};

    if (loadingProducts) {
      return invoicesByPharmacy;
    }

    Object.keys(cart).forEach((productId) => {
      const product = products.find((p) => p.codigo_produto == productId);
      if (!product) {
        return;
      }

      const quantity = cart[productId];
      const subtotal = product.preco * quantity;
      const pharmacyEmail = product.email_farmacia;

      if (!invoicesByPharmacy[pharmacyEmail]) {
        invoicesByPharmacy[pharmacyEmail] = {
          items: [],
          total: 0,
        };
      }

      invoicesByPharmacy[pharmacyEmail].items.push({
        name: product.nome,
        quantity,
        price: product.preco,
        subtotal,
        pharmacyName: product.utilizador,
      });

      invoicesByPharmacy[pharmacyEmail].total += subtotal;
    });

    return invoicesByPharmacy;
  };

  const handleDownloadInvoice = async (invoice, pharmacyEmail) => {
    try {
      const invoiceString = formatInvoiceToString(invoice, pharmacyEmail);
      const documentsDir = `${FileSystem.documentDirectory}`;
      const filePath = `${documentsDir}invoice_${pharmacyEmail}_${new Date().getTime()}.txt`;
      await FileSystem.writeAsStringAsync(filePath, invoiceString, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Download Concluído', `A fatura foi baixada em: ${filePath}`);
    } catch (error) {
      console.error('Erro ao fazer download da fatura:', error);
    }
  };

  const formatInvoiceToString = (invoice, pharmacyEmail) => {
    const itemsString = invoice.items.map(
      (item) =>
        `${item.name} - qtd: ${item.quantity} - preço: ${item.price.toFixed(2)} Kz (Subtotal: ${item.subtotal.toFixed(2)} Kz)`
    ).join('\n');

    return `Fatura\n\nFarmácia: ${pharmacyEmail}\nItens:\n${itemsString}\n\nTotal: ${invoice.total.toFixed(2)} Kz\n\nCliente: ${userData.email}`;
  };

  const showInvoices = (invoicesByPharmacy) => {
    Object.keys(invoicesByPharmacy).forEach((pharmacyEmail) => {
      const invoice = invoicesByPharmacy[pharmacyEmail];
      Alert.alert(
        `Fatura - ${pharmacyEmail}`,
        `Itens:\n${formatItems(invoice.items)}\n\nTotal: ${invoice.total.toFixed(2)} Kz\n\nCliente: ${userData.email}`,
        [
          { text: 'OK' },
          {
            text: 'Download',
            onPress: () => handleDownloadInvoice(invoice, pharmacyEmail),
          },
        ]
      );
    });
  };

  const formatItems = (items) => {
    return items
      .map(
        (item) =>
          `${item.name} - qtd: ${item.quantity} - preço: ${item.price.toFixed(2)} Kz (Subtotal: ${item.subtotal.toFixed(2)} Kz)`
      )
      .join('\n');
  };

  const formatItemsForEmail = (items, total) => {
    const itemsString = items
      .map(
        (item) =>
          `${item.name} - qtd: ${item.quantity} - preço: ${item.price.toFixed(2)} Kz (Subtotal: ${item.subtotal.toFixed(2)} Kz)`
      )
      .join('\n');

    return `Itens:\n${itemsString}\n\nTotal: ${total.toFixed(2)} Kz\n\nCliente: ${userData.email}`;
  };

  useEffect(() => {
    setUserName(userData.nome);
  }, []);

  useEffect(() => {
    createInvoicesByPharmacy();
  }, [cart]);

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.nome}</Text>
      <Text style={styles.productDescription}>{item.descricao}</Text>
      <Text style={styles.productPrice}>{item.preco.toFixed(2)} Kz</Text>
  
      {item.utilizador && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>Farmácia: <Text style={styles.userInfo}>{item.utilizador.nome}</Text></Text>
          <Text style={styles.userInfoLabel}>Endereço: <Text style={styles.userInfo}>{item.utilizador.endereco}</Text></Text>
        </View>
      )}

      <View style={styles.addToCartContainer}>
        <TextInput
          style={styles.quantityInput}
          placeholder="Quantidade"
          keyboardType="numeric"
          onChangeText={(text) => handleChangeQuantity(item.codigo_produto, parseInt(text))}
        />
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Icon name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addToCartButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>

      {cart[item.codigo_produto] > 0 && (
        <Text style={styles.cartQuantity}>Quantidade no Carrinho: {cart[item.codigo_produto]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.siteNavbar}>
        <View style={styles.logo}>
          <Image source={require('../images/logo.jpeg')} style={styles.logoImage} />
        </View>
        <Text style={styles.userNameText}>{userName}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            selectedMenu === 'Home' && styles.menuItemSelected
          ]}
          onPress={() => {
            setSelectedMenu('Home');
            setShowHome(true);
          }}
        >
          <Icon name="home-outline" size={20} color={selectedMenu === 'Home' ? "#fff" : "#000"} />
          <Text style={[styles.menuText, selectedMenu === 'Home' && styles.menuTextSelected]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            selectedMenu === 'Reservas' && styles.menuItemSelected
          ]}
          onPress={() => {
            setSelectedMenu('Reservas');
            setShowHome(false);
          }}
        >
          <Icon name="cart-outline" size={20} color={selectedMenu === 'Reservas' ? "#fff" : "#000"} />
          <Text style={[styles.menuText, selectedMenu === 'Reservas' && styles.menuTextSelected]}>Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={20} color="#000" />
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

        {showHome ? (
          <Animated.View style={[styles.siteBlocksCover, { flex: 1 }]}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Procurar medicamento(s)"
                value={searchText}
                onChangeText={handleSearchTextChange}
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => fetchProducts(searchText)}>
                <Icon name="search-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={products}
              keyExtractor={(item) => item.codigo_produto}
              renderItem={renderProductItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            {(Object.keys(cart).length > 0 && (Object.keys(quantity).length > 0 )) && (
              <TouchableOpacity style={styles.finishReservationButton} onPress={handleFinishReservation}>
                <Text style={styles.finishReservationButtonText}>Finalizar Reserva</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

        ) : (
          <Reservation userData = {userData} />
        )}
        
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  line: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  siteBlocksCover: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityInput: {
    flex: 1,
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
addToCartButtonText: {
    marginLeft: 5,
    color: '#fff',
  },
  cartQuantity: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  finishReservationButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  finishReservationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    marginTop: 10,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#555',
  },
  userInfo: {
    fontWeight: 'bold',
    color: '#000',
  },
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: '#555',
  },
});

export default HomeClient;

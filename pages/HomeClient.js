import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Email from 'expo-mail-composer';
import { debounce } from 'lodash';

export default function HomeClient() {
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

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const fetchProducts = async (text) => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`http://192.168.1.108:3002/produtosPorNome/${text}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Debounced version of fetchProducts
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
    setQuantity({ ...quantity, [productCode]: value });
  };

  const handleFinishReservation = async () => {
    const invoice = createInvoice();
  
    if (loadingProducts) {
      // Aguarde até que os produtos sejam carregados
      return null;
    }
  
    // Enviar um e-mail para cada farmácia no carrinho
    try {
      for (const productId of Object.keys(cart)) {
        const product = products.find((p) => p.codigo_produto == productId);
  
        if (product && product.utilizador && product.email_farmacia) {
          const userEmail = product.email_farmacia;
  
          // Envie o e-mail usando o Expo Mail Composer
          await Email.composeAsync({
            recipients: [userEmail],
            subject: 'Reserva de Medicamentos',
            body: formatItemsForEmail(invoice.items, invoice.total),
          });
        }
      }
  
      // Exiba a fatura
      showInvoice(invoice);
  
      // Limpe o carrinho após finalizar a reserva
      setCart({});
  
      // Exiba uma mensagem de sucesso para o usuário
      console.log('Sucesso', 'Reserva finalizada com sucesso!');
  
    } catch (error) {
      console.error('Erro ao enviar e-mails:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao finalizar a reserva. Por favor, tente novamente.');
    }
  };

  const createInvoice = () => {
    if (loadingProducts) {
      // Aguarde até que os produtos sejam carregados
      return null;
    }
  
    const items = Object.keys(cart).map((productId) => {
      const product = products.find((p) => p.codigo_produto == productId);
      if (!product) {
        return {
          name: 'Produto não encontrado',
          quantity: cart[productId],
          price: 0,
          subtotal: 0,
        };
      }
  
      const quantity = cart[productId];
      const subtotal = product.preco * quantity;
  
      return {
        name: product.nome,
        quantity,
        price: product.preco,
        subtotal,
      };
    });
  
    const total = items.reduce((acc, item) => acc + item.subtotal, 0);
  
    return {
      items,
      total,
    };
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      // Converte a fatura em formato de string
      const invoiceString = formatInvoiceToString(invoice);

      // Obtém o diretório de documentos do dispositivo usando expo-file-system
      const documentsDir = `${FileSystem.documentDirectory}`;

      // Cria o caminho do arquivo com um nome único (pode ser ajustado conforme necessário)
      const filePath = `${documentsDir}invoice_${new Date().getTime()}.txt`;

      // Escreve a fatura no arquivo usando expo-file-system
      await FileSystem.writeAsStringAsync(filePath, invoiceString, { encoding: FileSystem.EncodingType.UTF8 });

      // Exibe uma mensagem indicando que o download foi concluído
      Alert.alert('Download Concluído', `A fatura foi baixada em: ${filePath}`);
    } catch (error) {
      console.error('Erro ao fazer download da fatura:', error);
    }
  };

  const formatInvoiceToString = (invoice) => {
    // Formata a fatura como uma string
    const itemsString = invoice.items.map(
      (item) =>
        `${item.name} - qtd: ${item.quantity} - preço: ${item.price.toFixed(2)} Kz (Subtotal: ${item.subtotal.toFixed(2)} Kz)`
    ).join('\n');

    return `Fatura\n\nItens:\n${itemsString}\n\nTotal: ${invoice.total.toFixed(2)} Kz\n\nCliente: ${userData.email}`;
  };

  const showInvoice = (invoice) => {
    Alert.alert(
      'Fatura',
      `Itens:\n${formatItems(invoice.items)}\n\nTotal: ${invoice.total.toFixed(2)} Kz\n\nCliente: ${userData.email}`,
      [
        { text: 'OK' },
        {
          text: 'Download',
          onPress: () => handleDownloadInvoice(invoice),
        },
      ]
    );
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
    createInvoice();
  }, [products, cart]);

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
          <Icon name="cart-plus" size={20} color="#fff" />
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
          <Icon name="medkit" size={30} color="#000" style={styles.logoIcon} />
          <Text style={styles.logoText}>MEDEXPRESS</Text>
        </View>
        <Text style={styles.userNameText}>{userName}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="home" size={20} color="#000" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="shopping-cart" size={20} color="#000" />
          <Text style={styles.menuText}>Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#000" />
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <Animated.View style={[styles.siteBlocksCover, { minHeight: 300 }]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar medicamento(s)"
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => fetchProducts(searchText)}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.codigo_produto}
            renderItem={renderProductItem}
            contentContainerStyle={{ marginTop: 10 }}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}></Text>
          </View>
        )}

        {Object.keys(cart).length > 0 && (
          <TouchableOpacity style={styles.finishReservationButton} onPress={handleFinishReservation}>
            <Text style={styles.finishReservationButtonText}>Finalizar Reserva</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
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
  logoIcon: {
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    marginTop: 5,
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
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
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
  userInfoContainer: {
    marginTop: 10,
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  userInfo: {
    fontWeight: 'normal',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  cartQuantity: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#555',
  },
  finishReservationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Adicione o marginTop conforme necessário para ajustar o espaçamento
  },
  quantityInput: {
    flex: 1,
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10, // Adicione o marginRight para separar o input do botão
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#ffffff',
  },   
  finishReservationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

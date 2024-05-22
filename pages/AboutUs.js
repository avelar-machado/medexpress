import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const AboutUs = () => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        <Text style={styles.title}>Somos a MEDEXPRESS</Text>
        <Text style={styles.description}>
          A MedExpress é uma plataforma que conecta farmácias e clientes, facilitando a compra e reserva de medicamentos.
          Nosso objetivo é fornecer um serviço conveniente e eficiente para garantir que os clientes tenham acesso aos medicamentos
          de que necessitam, enquanto ajudamos as farmácias a alcançar um público mais amplo e gerenciar seus estoques de forma eficaz.
        </Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Localização: </Text>
          Angola, Luanda-Talatona
        </Text>
        <Text style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Contactos: </Text>
          935063573 - 934818736 - 928863487
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
    textAlign: 'center',
    marginTop: 40,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'justify',
    marginBottom: 20,
    color: '#555',
    marginHorizontal: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  contactLabel: {
    fontWeight: 'bold',
  },
});

export default AboutUs;

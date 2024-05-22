import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

function Register() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [endereco, setEndereco] = useState('');
  const [tipo, setTipo] = useState('');

  const handleRegister = async () => {
    try {
      // Realize a chamada à API para cadastrar o Utilizador
      const response = await fetch('http://192.168.1.108:3002/utilizadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          password,
          endereco,
          tipo,
        }),
      });

      // Verifique se a resposta foi bem-sucedida (código 2xx)
      if (response.ok) {
        // Faça o que for necessário após o Registo bem-sucedido

        // Navegue para a página de login após o Registo bem-sucedido
        navigation.navigate('Login');
      } else {
        // Se houver um erro, trate de acordo
        console.log('Erro ao Registar:', response.status);
      }
    } catch (error) {
      console.error('Erro ao tentar Registar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="user-plus" size={50} color="#3498db" style={styles.icon} />
        <Text style={styles.title}>Registar-se no MEDEXPRESS</Text>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#3498db" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={(text) => setNome(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#3498db" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#3498db" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="map-marker" size={20} color="#3498db" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={endereco}
          onChangeText={(text) => setEndereco(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#3498db" style={styles.icon} />
        <RNPickerSelect
          placeholder={{ label: 'Selecione o tipo', value: null }}
          items={[
            { label: 'Cliente', value: 'Cliente' },
            { label: 'Farmácia', value: 'Farmacia' },
          ]}
          onValueChange={(value) => setTipo(value)}
          style={pickerSelectStyles}
        />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem uma conta? Faça login aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    borderColor: '#3498db',
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 5,
    height: 40,
  },
  registerButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  backToLogin: {
    marginTop: 10,
  },
  linkText: {
    color: '#3498db',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Register;

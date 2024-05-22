import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // Novo estado para mensagem de erro

  const handleLogin = async () => {
    
    try {
      // Limpa a mensagem de erro ao tentar autenticar novamente
      setErrorMessage(null);

      // Realize a chamada à API para autenticar o usuário
      const response = await fetch('http://192.168.1.108:3002/utilizadores/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // valor do estado do email
          password, // valor do estado da senha
        }),
      });

      // Verifique se a resposta foi bem-sucedida (código 2xx)
      if (response.ok) {
        const userData = await response.json();
        // Verifique o tipo de usuário e navegue para a página apropriada
        if (userData.tipo === 'Cliente') {
          navigation.navigate('Cliente', { userData });
        } else if (userData.tipo === 'Farmacia') {
          navigation.navigate('Farmacia', { userData });
        } else {
          // Tipo de usuário desconhecido
          console.log('Tipo de usuário desconhecido:', userData.tipo);
        }
      } else {
        // Se houver um erro, trate de acordo e exiba a mensagem de erro
        setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha.');
        console.log('Erro ao autenticar:', response.status);
      }
    } catch (error) {
      console.error('Erro ao tentar autenticar:', error);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password pressed');
  };

  const handleRegister = () => {
    navigation.navigate('Registo');
    console.log('Register pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="lock" size={50} color="#3498db" style={styles.icon} />
        <Text style={styles.title}>Bem-vindo ao MEDEXPRESS</Text>
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

      {/* Exibição da mensagem de erro */}
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={styles.linkText}>Esqueceu a sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.register} onPress={handleRegister}>
        <Text style={styles.linkText}>Não tem uma conta? Registe-se já!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
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
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  register: {
    marginTop: 10,
  },
  linkText: {
    color: '#3498db',
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  // Estilos para a mensagem de erro
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  errorMessage: {
    color: '#721c24',
  },
});

export default Login;
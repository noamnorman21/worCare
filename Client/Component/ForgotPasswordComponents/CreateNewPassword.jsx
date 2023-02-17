import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OrLine, ReturnToLogin } from '../SignUpComponents/FooterLine'
import * as Font from 'expo-font'
Font.loadAsync({
  'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
});

export default function CreateNewPassword({ navigation }) {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);//for password visibility

  const CreatePassword = () => {
    if (password === repeatPassword) {
      Alert.alert('Password Created');
      NavigateToLogIn();
    } else {
      Alert.alert('Passwords do not match');
    }
  };

  const NavigateToLogIn = () => {
    navigation.navigate('LogIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text>Create New Password</Text>
        <Text>Enter your new password to log-in</Text>
      </View>

      <View style={styles.inputContainer}>
        {/*new password input */}
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!showPassword}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='ascii-capable'
          onChangeText={(text) => setPassword(text)}
        />
        {/* password visibility button */}
        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          {/* Icon button For changing password input visibility */}
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color='#979797'
          />
        </TouchableOpacity>

        {/* repeat password input */}
        <TextInput
          style={styles.input}
          placeholder="Repeat Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!showPassword}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='ascii-capable'
          onChangeText={(text) => setRepeatPassword(text)}
        />

        {/* password visibility button */}
        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          {/* Icon button For changing password input visibility */}
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color='#979797'
          />
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={CreatePassword}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>

      <OrLine />
      <ReturnToLogin NavigateToLogIn={NavigateToLogIn} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2.5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  smallHeader: {
    fontSize: 18,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    marginHorizontal: 5,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    width: 54,
    fontFamily: 'Urbanist',
    fontSize: 14,
    padding: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#548DFF',
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  passwordButton: {
    position: 'absolute',
    right: Dimensions.get('window').width * 0.1,
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
});
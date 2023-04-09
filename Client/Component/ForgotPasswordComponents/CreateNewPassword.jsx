import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, TextInput } from 'react-native'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OrLine, ReturnToLogin } from '../SignUpComponents/FooterLine'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CreateNewPassword({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);//for password visibility
  const email = route.params.email;

  const CreatePassword = () => {
    if (password === repeatPassword) {
      const newData = {
        Email: email,
        Password: password,
      };
      console.log(newData);
      // here we will send the new password to the server
      fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/User/UpdateUserPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(newData),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View >
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Create New Password</Text>
              <Text style={styles.smallHeader}>Enter your new password to Log-in</Text>
            </View>

            <View style={styles.inputContainer}>
              <View>
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
              </View>

              <View>
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

              {/* Finish button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => CreatePassword()}
              >
                <Text style={styles.buttonText}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
            <OrLine />
            <ReturnToLogin NavigateToLogIn={NavigateToLogIn} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Urbanist-Bold',
  },
  smallHeader: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Urbanist',
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4,
  },
  input: {
    width: SCREEN_WIDTH * 0.9,
    padding: 10,
    margin: 10,
    alignItems: 'flex-left',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist',
    fontSize: 16,
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 15,
    height: 54,
  },
  passwordButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.08,
    top: SCREEN_HEIGHT * 0.03,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
  },
});
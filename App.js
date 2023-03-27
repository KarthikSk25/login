//import liraries
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  View,
  Keyboard,
  Image,
  Alert,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

import List from './Src/List';
// create a component
const App = () => {
  const [token, setToken] = useState('');

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Keyboard.dismiss();
      },
    );

    onload();
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const onload = async () => {
    let user = await AsyncStorage.getItem('userName');
    let isLoggedIn = await AsyncStorage.getItem('token');
    console.log('here', user ?? '');
    setUserName(user ?? '');
    setToken(isLoggedIn ?? '');
  };

  const onRegister = async () => {
    if (!userName) {
      Alert.alert('Please Enter the user Name');
      return;
    }
    if (userName.length <= 4 || !userName.trim()) {
      Alert.alert('Username must be contain with 5 letters');
      return;
    }
    if (!password) {
      Alert.alert('Please Enter password');
      return;
    }
    if (password.length <= 7 || !password.trim()) {
      Alert.alert('Password must be contain with 8 characters');
      return;
    }

    setLoading(true);
    if (isSelected) {
      AsyncStorage.setItem('userName', userName);
    }
    Keyboard.dismiss();

    const body = {
      login: userName,
      password: password,
      db: 'srkh_test',
    };
    setPassword('');
    setUserName('');
    try {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: body,
        url: `https://srkh14.pptssolutions.com/api/user/get_token`,
      };
      axios(requestOptions).then(res => {
        const result = res?.data?.result[0];
        const result2 = res?.data?.result;
        console.log('res', result);
        console.log('res2', result2);
        setLoading(false);

        if (result?.success === false || !result2?.success) {
          return (
            result?.status === 400 &&
            ToastAndroid.show(
              'Username or Password Invalid',
              ToastAndroid.SHORT,
            )
          );
        }
        if (result2?.success) {
          ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
          AsyncStorage.setItem('token', result2?.access_token);
          setToken(result2?.access_token);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log('error', JSON.stringify('invalid'));
    }
  };

  if (token) {
    return <List setToken={setToken} />;
  }
  return (
    <SafeAreaView style={styles.safecontainer}>
      <View style={styles.container}>
        <View
          style={{
            flex: 2,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.tinyLogo}>Sign In </Text>
          <View style={{width: '70%', marginTop: 20}}>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                User Name
              </Text>
              <View style={styles.input}>
                <Feather
                  name={'user'}
                  size={18}
                  color={'#fff'}
                  style={{marginTop: 10, padding: 5}}
                />

                <TextInput
                  style={{color: '#fff'}}
                  value={userName}
                  placeholder={'Enter the user name'}
                  autoCapitalize={'none'}
                  placeholderTextColor={'#fff'}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => pwdTextInput.current.focus()}
                  onChangeText={email => setUserName(email)}
                />
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                Password
              </Text>
              <View style={styles.input}>
                <FontAwesome
                  name={'key'}
                  size={18}
                  color={'#fff'}
                  style={{marginTop: 10, padding: 5}}
                />

                <TextInput
                  style={{color: '#fff'}}
                  value={password}
                  placeholder={'Enter the Password'}
                  placeholderTextColor={'#fff'}
                  blurOnSubmit={false}
                  autoCapitalize={'none'}
                  secureTextEntry={hide}
                  onSubmitEditing={onRegister}
                  onChangeText={psw => setPassword(psw)}
                />

                {password && !hide ? (
                  <TouchableWithoutFeedback onPress={() => setHide(true)}>
                    <FontAwesome
                      size={16}
                      name={'eye'}
                      color={'#fff'}
                      style={{marginTop: 10, padding: 5, marginLeft: 'auto'}}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  password &&
                  hide && (
                    <TouchableWithoutFeedback onPress={() => setHide(false)}>
                      <FontAwesome
                        size={15}
                        name={'eye-slash'}
                        color={'#fff'}
                        style={{marginTop: 10, padding: 5, marginLeft: 'auto'}}
                      />
                    </TouchableWithoutFeedback>
                  )
                )}
              </View>

              <TouchableOpacity disabled>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isSelected}
                  onValueChange={() => {
                    setSelection(!isSelected);
                  }}
                  style={styles.checkbox}
                />
                <Text style={styles.label}>Remember me</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onRegister}>
            {loading ? (
              <ActivityIndicator color={'skyblue'} size={'small'} />
            ) : (
              <Text style={{color: '#68a8f2', fontWeight: 'bold'}}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
    backgroundColor: '#68a8f2',
  },
  label: {
    marginTop: 5,
    marginLeft: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  tinyLogo: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },

  input: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 7,
    padding: 5,
    fontFamily: 'Avenir',
    borderColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#6ca8f1',
    placeholderTextColor: '#cae9f9',
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    width: '65%',
    borderColor: 'transparent',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
});

//make this component available to the app
export default App;

// import { View, Text } from 'react-native'
// import React,{useEffect} from 'react'

// import { setProducts } from './redux/actions/actions';
// import { useDispatch, useSelector } from "react-redux";
// import axios from 'axios'

// export default function App() {

//   const dispatch = useDispatch();

//   // const fetchProducts = async () => {
//   //   const response = await axios
//   //     .get("https://fakestoreapi.com/products")
//   //     .catch((err) => {
//   //       console.log("Err: ", err);
//   //     });
//   //     // console.log(response.data);
//   //   dispatch(setProducts(response.data));
//   // };

//   useEffect(() => {
//     // fetchProducts();
//      dispatch(setProducts());
//   }, []);

//   return (
//     <View>
//       <Text>App</Text>
//     </View>
//   )
// }
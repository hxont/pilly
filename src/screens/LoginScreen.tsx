import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.imageBox}>
          <Image
            source={require('../assets/logo.png')} // ✅ 이미지 경로 수정
            style={{width: 200, height: 200}}
          />
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>PILLY</Text>
        </View>
        <View style={styles.loginBox}>
          <TouchableOpacity onPress={() => setIsLoggedIn(true)}> {/* ✅ 로그인 버튼 클릭 시 상태 변경 */}
            <Image
              source={require('../assets/loginkakao.png')} // ✅ 이미지 경로 수정
              style={{width: 220, height: 50}}
            />
          </TouchableOpacity>
          <Text style={styles.text}>3초 안에 쉽고 간편하게</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBox: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '5%',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0169CD',
  },
  loginBox: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    marginTop: '2%',
    color: '#A3A3A3',
  },
});

export default LoginScreen;

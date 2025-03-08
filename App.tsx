import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';



function App(): React.JSX.Element {
  return (
    <SafeAreaView style ={styles.safeArea}>
      <View style={styles.container}>
        <Text style={{color: 'pink'}}>main</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default App;

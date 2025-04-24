import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import AnaEkran from './app/index';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AnaEkran />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 
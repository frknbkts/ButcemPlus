import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const getIkon = (kategori) => {
  switch (kategori) {
    case 'kira':
      return { name: 'home', color: '#2196F3' };
    case 'ulasim':
      return { name: 'directions-car', color: '#FF9800' };
    case 'market':
      return { name: 'shopping-basket', color: '#4CAF50' };
    case 'yemeicme':
      return { name: 'restaurant', color: '#E91E63' };
    case 'egitim':
      return { name: 'school', color: '#9C27B0' };
    case 'alisveris':
      return { name: 'shopping-cart', color: '#FF5722' };
    case 'eglence':
      return { name: 'sports-esports', color: '#00BCD4' };
    case 'saglik':
      return { name: 'local-hospital', color: '#F44336' };
    case 'faturalar':
      return { name: 'receipt', color: '#607D8B' };
    case 'evcil':
      return { name: 'pets', color: '#795548' };
    case 'borc':
      return { name: 'credit-card', color: '#9E9E9E' };
    case 'abonelik':
      return { name: 'subscriptions', color: '#673AB7' };
    case 'gelir':
      return { name: 'account-balance', color: '#4CAF50' };
    default:
      return { name: 'shopping-bag', color: '#9E9E9E' };
  }
};

const HarcamaKarti = ({ harcama }) => {
  const isGelir = harcama.tip === 'gelir';
  const tutarRengi = isGelir ? '#4CAF50' : '#F44336';
  const tutarIsareti = isGelir ? '+' : '-';
  const ikon = getIkon(harcama.kategori);

  return (
    <View style={styles.kart}>
      <View style={styles.solKisim}>
        <View style={[styles.ikonContainer, { backgroundColor: `${ikon.color}20` }]}>
          <MaterialIcons name={ikon.name} size={24} color={ikon.color} />
        </View>
        <View style={styles.bilgiContainer}>
          <Text style={styles.baslik}>{harcama.baslik}</Text>
          <Text style={styles.zaman}>{harcama.zaman}</Text>
        </View>
      </View>
      <View style={styles.sagKisim}>
        <Text style={[styles.tutar, { color: tutarRengi }]}>
          {tutarIsareti}₺{Math.abs(harcama.tutar).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  solKisim: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ikonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bilgiContainer: {
    justifyContent: 'center',
  },
  baslik: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  zaman: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sagKisim: {},
  tutar: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HarcamaKarti; 
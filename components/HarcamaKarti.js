import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HarcamaKarti = ({ harcama, onSil, onDuzenle }) => {
  const getKategoriIcon = () => {
    switch (harcama.kategori) {
      case 'market':
        return 'shopping-cart';
      case 'yemeicme':
        return 'restaurant';
      case 'ulasim':
        return 'directions-car';
      case 'kira':
        return 'home';
      case 'egitim':
        return 'school';
      case 'alisveris':
        return 'shopping-bag';
      case 'eglence':
        return 'local-movies';
      case 'saglik':
        return 'local-hospital';
      case 'faturalar':
        return 'receipt';
      case 'evcil':
        return 'pets';
      case 'borc':
        return 'money-off';
      case 'abonelik':
        return 'subscriptions';
      case 'gelir':
        return 'attach-money';
      default:
        return 'payment';
    }
  };

  const getKategoriRenk = () => {
    switch (harcama.kategori) {
      case 'market':
        return '#FF9800';
      case 'yemeicme':
        return '#E91E63';
      case 'ulasim':
        return '#2196F3';
      case 'kira':
        return '#9C27B0';
      case 'egitim':
        return '#009688';
      case 'alisveris':
        return '#FF5722';
      case 'eglence':
        return '#673AB7';
      case 'saglik':
        return '#F44336';
      case 'faturalar':
        return '#607D8B';
      case 'evcil':
        return '#795548';
      case 'borc':
        return '#FFC107';
      case 'abonelik':
        return '#00BCD4';
      case 'gelir':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.kart}>
      <View style={styles.kartSol}>
        <View style={[styles.iconContainer, { backgroundColor: getKategoriRenk() }]}>
          <MaterialIcons name={getKategoriIcon()} size={24} color="#fff" />
        </View>
        <View style={styles.bilgiContainer}>
          <Text style={styles.baslik}>{harcama.baslik}</Text>
          <Text style={styles.zaman}>{harcama.zaman}</Text>
        </View>
      </View>
      <View style={styles.kartSag}>
        <Text style={[styles.tutar, harcama.tip === 'gelir' && styles.gelirTutar]}>
          {harcama.tip === 'gelir' ? '+' : '-'}₺{harcama.tutar.toFixed(2)}
        </Text>
        <View style={styles.islemButonlari}>
          <TouchableOpacity
            style={styles.duzenleButton}
            onPress={() => onDuzenle(harcama)}
          >
            <MaterialIcons name="edit" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.silButton}
            onPress={() => onSil(harcama.id)}
          >
            <MaterialIcons name="delete" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  kartSol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bilgiContainer: {
    flex: 1,
  },
  baslik: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  zaman: {
    fontSize: 12,
    color: '#666',
  },
  kartSag: {
    alignItems: 'flex-end',
  },
  tutar: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
  },
  gelirTutar: {
    color: '#4CAF50',
  },
  islemButonlari: {
    flexDirection: 'row',
    marginTop: 8,
  },
  duzenleButton: {
    padding: 4,
    marginRight: 8,
  },
  silButton: {
    padding: 4,
  },
});

export default HarcamaKarti; 
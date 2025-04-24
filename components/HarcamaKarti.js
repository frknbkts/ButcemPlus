import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HarcamaKarti = ({ harcama }) => {
  return (
    <View style={styles.kart}>
      <View style={styles.solKisim}>
        <View style={styles.ikonContainer}>
          {/* İkon buraya gelecek */}
        </View>
        <View style={styles.bilgiContainer}>
          <Text style={styles.baslik}>{harcama.baslik}</Text>
          <Text style={styles.zaman}>{harcama.zaman}</Text>
        </View>
      </View>
      <View style={styles.sagKisim}>
        <Text style={styles.tutar}>₺{harcama.tutar.toFixed(2)}</Text>
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
    backgroundColor: '#F0F0F0',
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
    color: '#1A1A1A',
  },
});

export default HarcamaKarti; 
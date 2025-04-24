import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HarcamaKarti from '../components/HarcamaKarti';

const AnaEkran = () => {
  const [toplamHarcama, setToplamHarcama] = useState(292.50);
  const [harcamalar, setHarcamalar] = useState([
    {
      id: 1,
      baslik: 'Evcil Hayvan',
      tutar: 3.35,
      zaman: '9:35 AM',
      tip: 'hayvan'
    },
    {
      id: 2,
      baslik: 'Atıştırmalık',
      tutar: 1.70,
      zaman: '8:24 AM',
      tip: 'yiyecek'
    },
    {
      id: 3,
      baslik: 'Kahve',
      tutar: 2.19,
      zaman: '7:45 AM',
      tip: 'icecek'
    },
    {
      id: 4,
      baslik: 'Maaş',
      tutar: 2300.00,
      zaman: '7:44 AM',
      tip: 'gelir'
    }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ustKisim}>
        <Text style={styles.baslik}>Bu hafta harcanan</Text>
        <Text style={styles.toplamTutar}>₺{toplamHarcama.toFixed(2)}</Text>
      </View>
      
      <View style={styles.bugunBaslik}>
        <Text style={styles.bugunText}>Bugün</Text>
      </View>

      <ScrollView style={styles.harcamaListesi}>
        {harcamalar.map((harcama) => (
          <HarcamaKarti key={harcama.id} harcama={harcama} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  ustKisim: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  baslik: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  toplamTutar: {
    fontSize: 34,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  bugunBaslik: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bugunText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  harcamaListesi: {
    flex: 1,
  },
});

export default AnaEkran; 
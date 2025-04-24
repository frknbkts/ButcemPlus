import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import HarcamaKarti from '../components/HarcamaKarti';
import HarcamaFormu from '../components/HarcamaFormu';

const AnaEkran = () => {
  const [toplamHarcama, setToplamHarcama] = useState(292.50);
  const [harcamalar, setHarcamalar] = useState([
    {
      id: 1,
      baslik: 'Evcil Hayvan',
      tutar: 3.35,
      zaman: '9:35 AM',
      tip: 'harcama',
      tarih: '2024-04-24'
    },
    {
      id: 2,
      baslik: 'Atıştırmalık',
      tutar: 1.70,
      zaman: '8:24 AM',
      tip: 'harcama',
      tarih: '2024-04-24'
    },
    {
      id: 3,
      baslik: 'Kahve',
      tutar: 2.19,
      zaman: '7:45 AM',
      tip: 'harcama',
      tarih: '2024-04-24'
    },
    {
      id: 4,
      baslik: 'Maaş',
      tutar: 2300.00,
      zaman: '7:44 AM',
      tip: 'gelir',
      tarih: '2024-04-24'
    }
  ]);
  const [formVisible, setFormVisible] = useState(false);
  const [aktifGorunum, setAktifGorunum] = useState('gunluk');

  const handleHarcamaEkle = (yeniHarcama) => {
    const tamHarcama = {
      ...yeniHarcama,
      tarih: new Date().toISOString().split('T')[0]
    };
    setHarcamalar([tamHarcama, ...harcamalar]);
    if (yeniHarcama.tip === 'harcama') {
      setToplamHarcama(toplamHarcama + yeniHarcama.tutar);
    }
  };

  const filtreleHarcamalar = () => {
    const bugun = new Date().toISOString().split('T')[0];
    const haftaBaslangic = new Date();
    haftaBaslangic.setDate(haftaBaslangic.getDate() - 7);
    const ayBaslangic = new Date();
    ayBaslangic.setMonth(ayBaslangic.getMonth() - 1);

    return harcamalar.filter(harcama => {
      const harcamaTarihi = new Date(harcama.tarih);
      switch (aktifGorunum) {
        case 'gunluk':
          return harcama.tarih === bugun;
        case 'haftalik':
          return harcamaTarihi >= haftaBaslangic;
        case 'aylik':
          return harcamaTarihi >= ayBaslangic;
        default:
          return true;
      }
    });
  };

  const hesaplaToplam = () => {
    const filtrelenmisHarcamalar = filtreleHarcamalar();
    return filtrelenmisHarcamalar.reduce((toplam, harcama) => {
      if (harcama.tip === 'harcama') {
        return toplam + harcama.tutar;
      }
      return toplam;
    }, 0);
  };

  const getBaslik = () => {
    switch (aktifGorunum) {
      case 'gunluk':
        return 'Bugün';
      case 'haftalik':
        return 'Bu Hafta';
      case 'aylik':
        return 'Bu Ay';
      default:
        return 'Bugün';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ustKisim}>
        <Text style={styles.baslik}>Toplam Harcama</Text>
        <Text style={styles.toplamTutar}>₺{hesaplaToplam().toFixed(2)}</Text>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, aktifGorunum === 'gunluk' && styles.aktifTab]}
          onPress={() => setAktifGorunum('gunluk')}
        >
          <Text style={[styles.tabText, aktifGorunum === 'gunluk' && styles.aktifTabText]}>
            Günlük
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, aktifGorunum === 'haftalik' && styles.aktifTab]}
          onPress={() => setAktifGorunum('haftalik')}
        >
          <Text style={[styles.tabText, aktifGorunum === 'haftalik' && styles.aktifTabText]}>
            Haftalık
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, aktifGorunum === 'aylik' && styles.aktifTab]}
          onPress={() => setAktifGorunum('aylik')}
        >
          <Text style={[styles.tabText, aktifGorunum === 'aylik' && styles.aktifTabText]}>
            Aylık
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bugunBaslik}>
        <Text style={styles.bugunText}>{getBaslik()}</Text>
      </View>

      <ScrollView style={styles.harcamaListesi}>
        {filtreleHarcamalar().map((harcama) => (
          <HarcamaKarti key={harcama.id} harcama={harcama} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.ekleButton}
        onPress={() => setFormVisible(true)}
      >
        <Text style={styles.ekleButtonText}>+</Text>
      </TouchableOpacity>

      <HarcamaFormu
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onHarcamaEkle={handleHarcamaEkle}
      />
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  aktifTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  aktifTabText: {
    color: '#4CAF50',
    fontWeight: '600',
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
  ekleButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  ekleButtonText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 48,
  },
});

export default AnaEkran; 
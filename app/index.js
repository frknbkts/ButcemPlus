import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HarcamaKarti from '../components/HarcamaKarti';
import HarcamaFormu from '../components/HarcamaFormu';
import Notlar from '../components/Notlar';

const AnaEkran = () => {
  const [toplamHarcama, setToplamHarcama] = useState(292.50);
  const [harcamalar, setHarcamalar] = useState([
    {
      id: 1,
      baslik: 'Evcil Hayvan',
      tutar: 3.35,
      zaman: '9:35 AM',
      tip: 'harcama',
      tarih: '2024-04-24',
      kategori: 'evcil'
    },
    {
      id: 2,
      baslik: 'Atıştırmalık',
      tutar: 1.70,
      zaman: '8:24 AM',
      tip: 'harcama',
      tarih: '2024-04-24',
      kategori: 'yemeicme'
    },
    {
      id: 3,
      baslik: 'Kahve',
      tutar: 2.19,
      zaman: '7:45 AM',
      tip: 'harcama',
      tarih: '2024-04-24',
      kategori: 'yemeicme'
    },
    {
      id: 4,
      baslik: 'Maaş',
      tutar: 2300.00,
      zaman: '7:44 AM',
      tip: 'gelir',
      tarih: '2024-04-24',
      kategori: 'gelir'
    }
  ]);
  const [formVisible, setFormVisible] = useState(false);
  const [aktifGorunum, setAktifGorunum] = useState('gunluk');
  const [filtreModalVisible, setFiltreModalVisible] = useState(false);
  const [seciliKategoriler, setSeciliKategoriler] = useState([]);
  const [siralama, setSiralama] = useState('tarih');
  const [aktifSekme, setAktifSekme] = useState('harcamalar');
  const [duzenlenecekHarcama, setDuzenlenecekHarcama] = useState(null);

  const handleHarcamaEkle = (yeniHarcama) => {
    const tamHarcama = {
      ...yeniHarcama,
      id: Date.now(),
      tarih: new Date().toISOString().split('T')[0]
    };
    setHarcamalar([tamHarcama, ...harcamalar]);
    if (yeniHarcama.tip === 'harcama') {
      setToplamHarcama(toplamHarcama + yeniHarcama.tutar);
    }
    setFormVisible(false);
  };

  const handleHarcamaDuzenle = (harcama) => {
    setDuzenlenecekHarcama(harcama);
    setFormVisible(true);
  };

  const handleHarcamaGuncelle = (guncelHarcama) => {
    setHarcamalar(harcamalar.map(h => 
      h.id === guncelHarcama.id ? guncelHarcama : h
    ));
    setDuzenlenecekHarcama(null);
    setFormVisible(false);
  };

  const handleHarcamaSil = (id) => {
    Alert.alert(
      'Harcamayı Sil',
      'Bu harcamayı silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sil',
          onPress: () => {
            const silinecekHarcama = harcamalar.find(h => h.id === id);
            if (silinecekHarcama.tip === 'harcama') {
              setToplamHarcama(toplamHarcama - silinecekHarcama.tutar);
            }
            setHarcamalar(harcamalar.filter(h => h.id !== id));
          }
        }
      ]
    );
  };

  const filtreleHarcamalar = () => {
    const bugun = new Date().toISOString().split('T')[0];
    const haftaBaslangic = new Date();
    haftaBaslangic.setDate(haftaBaslangic.getDate() - 7);
    const ayBaslangic = new Date();
    ayBaslangic.setMonth(ayBaslangic.getMonth() - 1);

    let filtrelenmisHarcamalar = harcamalar.filter(harcama => {
      const harcamaTarihi = new Date(harcama.tarih);
      let tarihFiltresi = true;
      
      switch (aktifGorunum) {
        case 'gunluk':
          tarihFiltresi = harcama.tarih === bugun;
          break;
        case 'haftalik':
          tarihFiltresi = harcamaTarihi >= haftaBaslangic;
          break;
        case 'aylik':
          tarihFiltresi = harcamaTarihi >= ayBaslangic;
          break;
      }

      const kategoriFiltresi = seciliKategoriler.length === 0 || 
        seciliKategoriler.includes(harcama.kategori);

      return tarihFiltresi && kategoriFiltresi;
    });

    // Sıralama
    filtrelenmisHarcamalar.sort((a, b) => {
      switch (siralama) {
        case 'tarih':
          return new Date(b.tarih + 'T' + b.zaman) - new Date(a.tarih + 'T' + a.zaman);
        case 'tutar_azalan':
          return b.tutar - a.tutar;
        case 'tutar_artan':
          return a.tutar - b.tutar;
        default:
          return 0;
      }
    });

    return filtrelenmisHarcamalar;
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

  const toggleKategori = (kategori) => {
    if (seciliKategoriler.includes(kategori)) {
      setSeciliKategoriler(seciliKategoriler.filter(k => k !== kategori));
    } else {
      setSeciliKategoriler([...seciliKategoriler, kategori]);
    }
  };

  const FiltreModal = () => (
    <Modal
      visible={filtreModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFiltreModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.filtreContainer}>
          <Text style={styles.filtreBaslik}>Filtrele ve Sırala</Text>
          
          <View style={styles.siralamaContainer}>
            <Text style={styles.siralamaBaslik}>Sıralama</Text>
            <View style={styles.siralamaButonlar}>
              <TouchableOpacity
                style={[styles.siralamaButton, siralama === 'tarih' && styles.aktifSiralama]}
                onPress={() => setSiralama('tarih')}
              >
                <Text style={[styles.siralamaText, siralama === 'tarih' && styles.aktifSiralamaText]}>
                  Tarih
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.siralamaButton, siralama === 'tutar_azalan' && styles.aktifSiralama]}
                onPress={() => setSiralama('tutar_azalan')}
              >
                <Text style={[styles.siralamaText, siralama === 'tutar_azalan' && styles.aktifSiralamaText]}>
                  Tutar (Azalan)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.siralamaButton, siralama === 'tutar_artan' && styles.aktifSiralama]}
                onPress={() => setSiralama('tutar_artan')}
              >
                <Text style={[styles.siralamaText, siralama === 'tutar_artan' && styles.aktifSiralamaText]}>
                  Tutar (Artan)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.kategoriFiltreContainer}>
            <Text style={styles.kategoriFiltreBaslik}>Kategoriler</Text>
            <ScrollView style={styles.kategoriListe}>
              {['market', 'yemeicme', 'ulasim', 'kira', 'egitim', 'alisveris', 
                'eglence', 'saglik', 'faturalar', 'evcil', 'borc', 'abonelik'].map((kategori) => (
                <TouchableOpacity
                  key={kategori}
                  style={[
                    styles.kategoriFiltreButton,
                    seciliKategoriler.includes(kategori) && styles.seciliKategori
                  ]}
                  onPress={() => toggleKategori(kategori)}
                >
                  <Text style={[
                    styles.kategoriFiltreText,
                    seciliKategoriler.includes(kategori) && styles.seciliKategoriText
                  ]}>
                    {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.filtreKapatButton}
            onPress={() => setFiltreModalVisible(false)}
          >
            <Text style={styles.filtreKapatText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderIcerik = () => {
    if (aktifSekme === 'harcamalar') {
      return (
        <>
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
            <TouchableOpacity
              style={styles.filtreButton}
              onPress={() => setFiltreModalVisible(true)}
            >
              <MaterialIcons name="filter-list" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.harcamaListesi}>
            {filtreleHarcamalar().map((harcama) => (
              <HarcamaKarti 
                key={harcama.id} 
                harcama={harcama} 
                onSil={handleHarcamaSil}
                onDuzenle={handleHarcamaDuzenle}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.ekleButton}
            onPress={() => {
              setDuzenlenecekHarcama(null);
              setFormVisible(true);
            }}
          >
            <Text style={styles.ekleButtonText}>+</Text>
          </TouchableOpacity>

          <HarcamaFormu
            visible={formVisible}
            onClose={() => {
              setFormVisible(false);
              setDuzenlenecekHarcama(null);
            }}
            onHarcamaEkle={handleHarcamaEkle}
            onHarcamaGuncelle={handleHarcamaGuncelle}
            duzenlenecekHarcama={duzenlenecekHarcama}
          />

          <FiltreModal />
        </>
      );
    } else {
      return <Notlar />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ustKisim}>
        <Text style={styles.baslik}>Toplam Harcama</Text>
        <Text style={styles.toplamTutar}>₺{hesaplaToplam().toFixed(2)}</Text>
      </View>

      <View style={styles.sekmeBar}>
        <TouchableOpacity
          style={[styles.sekmeButton, aktifSekme === 'harcamalar' && styles.aktifSekme]}
          onPress={() => setAktifSekme('harcamalar')}
        >
          <MaterialIcons 
            name="account-balance-wallet" 
            size={24} 
            color={aktifSekme === 'harcamalar' ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.sekmeText, aktifSekme === 'harcamalar' && styles.aktifSekmeText]}>
            Harcamalar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sekmeButton, aktifSekme === 'notlar' && styles.aktifSekme]}
          onPress={() => setAktifSekme('notlar')}
        >
          <MaterialIcons 
            name="note" 
            size={24} 
            color={aktifSekme === 'notlar' ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.sekmeText, aktifSekme === 'notlar' && styles.aktifSekmeText]}>
            Notlar
          </Text>
        </TouchableOpacity>
      </View>

      {renderIcerik()}
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
  sekmeBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sekmeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  aktifSekme: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  sekmeText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  aktifSekmeText: {
    color: '#4CAF50',
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bugunText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  filtreButton: {
    padding: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filtreContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    maxHeight: '80%',
  },
  filtreBaslik: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  siralamaContainer: {
    marginBottom: 20,
  },
  siralamaBaslik: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  siralamaButonlar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  siralamaButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  aktifSiralama: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  siralamaText: {
    color: '#666',
  },
  aktifSiralamaText: {
    color: '#fff',
  },
  kategoriFiltreContainer: {
    marginBottom: 20,
  },
  kategoriFiltreBaslik: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  kategoriListe: {
    maxHeight: 200,
  },
  kategoriFiltreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  seciliKategori: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  kategoriFiltreText: {
    color: '#666',
  },
  seciliKategoriText: {
    color: '#fff',
  },
  filtreKapatButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filtreKapatText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AnaEkran; 
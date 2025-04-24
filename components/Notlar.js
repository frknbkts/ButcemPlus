import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_NOTLAR = '@notlar';
const STORAGE_KEY_AKTIF_TAB = '@notlar_aktif_tab';

const Notlar = () => {
  const [notlar, setNotlar] = useState({
    borclar: [],
    alacaklar: [],
    alinacaklar: []
  });

  const [aktifTab, setAktifTab] = useState('borclar');
  const [modalVisible, setModalVisible] = useState(false);
  const [duzenlenecekNot, setDuzenlenecekNot] = useState(null);
  const [notMetni, setNotMetni] = useState('');

  // Uygulama açıldığında verileri yükle
  useEffect(() => {
    verileriYukle();
  }, []);

  // Verileri AsyncStorage'dan yükle
  const verileriYukle = async () => {
    try {
      const notlarJson = await AsyncStorage.getItem(STORAGE_KEY_NOTLAR);
      const aktifTabJson = await AsyncStorage.getItem(STORAGE_KEY_AKTIF_TAB);
      
      if (notlarJson) {
        setNotlar(JSON.parse(notlarJson));
      }
      if (aktifTabJson) {
        setAktifTab(JSON.parse(aktifTabJson));
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    }
  };

  // Notları AsyncStorage'a kaydet
  const notlariKaydet = async (yeniNotlar) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_NOTLAR, JSON.stringify(yeniNotlar));
    } catch (error) {
      console.error('Notlar kaydedilirken hata oluştu:', error);
    }
  };

  // Aktif tabı AsyncStorage'a kaydet
  const aktifTabiKaydet = async (yeniTab) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_AKTIF_TAB, JSON.stringify(yeniTab));
    } catch (error) {
      console.error('Aktif tab kaydedilirken hata oluştu:', error);
    }
  };

  const handleNotEkle = () => {
    if (!notMetni.trim()) return;

    const yeniNot = {
      id: Date.now(),
      icerik: notMetni.trim(),
      tarih: new Date().toISOString().split('T')[0]
    };

    const yeniNotlar = {
      ...notlar,
      [aktifTab]: [yeniNot, ...notlar[aktifTab]]
    };

    setNotlar(yeniNotlar);
    notlariKaydet(yeniNotlar);
    setNotMetni('');
    setModalVisible(false);
  };

  const handleNotGuncelle = () => {
    if (!notMetni.trim() || !duzenlenecekNot) return;

    const yeniNotlar = {
      ...notlar,
      [aktifTab]: notlar[aktifTab].map(not => 
        not.id === duzenlenecekNot.id 
          ? { ...not, icerik: notMetni.trim() }
          : not
      )
    };

    setNotlar(yeniNotlar);
    notlariKaydet(yeniNotlar);
    setNotMetni('');
    setDuzenlenecekNot(null);
    setModalVisible(false);
  };

  const handleNotSil = (id) => {
    const yeniNotlar = {
      ...notlar,
      [aktifTab]: notlar[aktifTab].filter(not => not.id !== id)
    };

    setNotlar(yeniNotlar);
    notlariKaydet(yeniNotlar);
  };

  const handleNotDuzenle = (not) => {
    setDuzenlenecekNot(not);
    setNotMetni(not.icerik);
    setModalVisible(true);
  };

  const handleTabDegistir = (yeniTab) => {
    setAktifTab(yeniTab);
    aktifTabiKaydet(yeniTab);
  };

  const getTabBaslik = () => {
    switch (aktifTab) {
      case 'borclar': return 'Borçlarım';
      case 'alacaklar': return 'Alacaklarım';
      case 'alinacaklar': return 'Alınacaklar';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'borclar' && styles.aktifTab]}
          onPress={() => handleTabDegistir('borclar')}
        >
          <Text style={[styles.tabText, aktifTab === 'borclar' && styles.aktifTabText]}>
            Borçlarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'alacaklar' && styles.aktifTab]}
          onPress={() => handleTabDegistir('alacaklar')}
        >
          <Text style={[styles.tabText, aktifTab === 'alacaklar' && styles.aktifTabText]}>
            Alacaklarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'alinacaklar' && styles.aktifTab]}
          onPress={() => handleTabDegistir('alinacaklar')}
        >
          <Text style={[styles.tabText, aktifTab === 'alinacaklar' && styles.aktifTabText]}>
            Alınacaklar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.baslikContainer}>
        <Text style={styles.baslik}>{getTabBaslik()}</Text>
        <TouchableOpacity
          style={styles.ekleButton}
          onPress={() => {
            setDuzenlenecekNot(null);
            setNotMetni('');
            setModalVisible(true);
          }}
        >
          <MaterialIcons name="add" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notlarListesi}>
        {notlar[aktifTab].map((not) => (
          <View key={not.id} style={styles.notKarti}>
            <Text style={styles.notIcerik}>{not.icerik}</Text>
            <View style={styles.notAlt}>
              <Text style={styles.notTarih}>{not.tarih}</Text>
              <View style={styles.islemButonlari}>
                <TouchableOpacity
                  style={styles.duzenleButton}
                  onPress={() => handleNotDuzenle(not)}
                >
                  <MaterialIcons name="edit" size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.silButton}
                  onPress={() => handleNotSil(not.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalBaslik}>
                {duzenlenecekNot ? 'Notu Düzenle' : 'Yeni Not Ekle'}
              </Text>
              <TouchableOpacity
                style={styles.modalKapatButton}
                onPress={() => {
                  setModalVisible(false);
                  setDuzenlenecekNot(null);
                  setNotMetni('');
                }}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.notInput}
              placeholder="Notunuzu yazın..."
              value={notMetni}
              onChangeText={setNotMetni}
              multiline
            />

            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButton, styles.kaydetButton]}
                onPress={duzenlenecekNot ? handleNotGuncelle : handleNotEkle}
              >
                <Text style={styles.kaydetButtonText}>
                  {duzenlenecekNot ? 'Güncelle' : 'Kaydet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  baslikContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  baslik: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  ekleButton: {
    padding: 8,
  },
  notlarListesi: {
    flex: 1,
    padding: 16,
  },
  notKarti: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  notIcerik: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  notAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notTarih: {
    fontSize: 12,
    color: '#666',
  },
  islemButonlari: {
    flexDirection: 'row',
  },
  duzenleButton: {
    padding: 4,
    marginRight: 8,
  },
  silButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalBaslik: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalKapatButton: {
    padding: 8,
  },
  notInput: {
    padding: 16,
    minHeight: 150,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  modalButonlar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  kaydetButton: {
    backgroundColor: '#4CAF50',
  },
  kaydetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Notlar; 
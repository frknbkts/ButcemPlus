import React, { useState } from 'react';
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

const Notlar = () => {
  const [notlar, setNotlar] = useState({
    borclar: [
      { id: 1, icerik: 'Ahmet\'e 250 TL borcum var', tarih: '2024-04-24' },
      { id: 2, icerik: 'Ayşe\'ye 100 TL borcum var', tarih: '2024-04-23' }
    ],
    alacaklar: [
      { id: 1, icerik: 'Mehmet\'ten 500 TL alacağım var', tarih: '2024-04-22' }
    ],
    alinacaklar: [
      { id: 1, icerik: 'Market alışverişi yapılacak', tarih: '2024-04-24' }
    ]
  });

  const [aktifTab, setAktifTab] = useState('borclar');
  const [modalVisible, setModalVisible] = useState(false);
  const [duzenlenecekNot, setDuzenlenecekNot] = useState(null);
  const [notMetni, setNotMetni] = useState('');

  const handleNotEkle = () => {
    if (!notMetni.trim()) return;

    const yeniNot = {
      id: Date.now(),
      icerik: notMetni.trim(),
      tarih: new Date().toISOString().split('T')[0]
    };

    setNotlar(oncekiNotlar => ({
      ...oncekiNotlar,
      [aktifTab]: [yeniNot, ...oncekiNotlar[aktifTab]]
    }));

    setNotMetni('');
    setModalVisible(false);
  };

  const handleNotGuncelle = () => {
    if (!notMetni.trim() || !duzenlenecekNot) return;

    setNotlar(oncekiNotlar => ({
      ...oncekiNotlar,
      [aktifTab]: oncekiNotlar[aktifTab].map(not => 
        not.id === duzenlenecekNot.id 
          ? { ...not, icerik: notMetni.trim() }
          : not
      )
    }));

    setNotMetni('');
    setDuzenlenecekNot(null);
    setModalVisible(false);
  };

  const handleNotSil = (id) => {
    setNotlar(oncekiNotlar => ({
      ...oncekiNotlar,
      [aktifTab]: oncekiNotlar[aktifTab].filter(not => not.id !== id)
    }));
  };

  const handleNotDuzenle = (not) => {
    setDuzenlenecekNot(not);
    setNotMetni(not.icerik);
    setModalVisible(true);
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
          onPress={() => setAktifTab('borclar')}
        >
          <Text style={[styles.tabText, aktifTab === 'borclar' && styles.aktifTabText]}>
            Borçlarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'alacaklar' && styles.aktifTab]}
          onPress={() => setAktifTab('alacaklar')}
        >
          <Text style={[styles.tabText, aktifTab === 'alacaklar' && styles.aktifTabText]}>
            Alacaklarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'alinacaklar' && styles.aktifTab]}
          onPress={() => setAktifTab('alinacaklar')}
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
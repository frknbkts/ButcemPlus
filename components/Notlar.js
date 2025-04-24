import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
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
  const [yeniNot, setYeniNot] = useState('');
  const [duzenlenecekNot, setDuzenlenecekNot] = useState(null);

  const handleNotEkle = () => {
    if (yeniNot.trim() === '') return;

    const yeniNotObj = {
      id: Date.now(),
      icerik: yeniNot,
      tarih: new Date().toISOString().split('T')[0]
    };

    setNotlar({
      ...notlar,
      [aktifTab]: [...notlar[aktifTab], yeniNotObj]
    });

    setYeniNot('');
    setModalVisible(false);
  };

  const handleNotGuncelle = () => {
    if (yeniNot.trim() === '' || !duzenlenecekNot) return;

    setNotlar({
      ...notlar,
      [aktifTab]: notlar[aktifTab].map(not => 
        not.id === duzenlenecekNot.id 
          ? { ...not, icerik: yeniNot }
          : not
      )
    });

    setYeniNot('');
    setDuzenlenecekNot(null);
    setModalVisible(false);
  };

  const handleNotSil = (id) => {
    setNotlar({
      ...notlar,
      [aktifTab]: notlar[aktifTab].filter(not => not.id !== id)
    });
  };

  const handleNotDuzenle = (not) => {
    setDuzenlenecekNot(not);
    setYeniNot(not.icerik);
    setModalVisible(true);
  };

  const NotModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(false);
        setDuzenlenecekNot(null);
        setYeniNot('');
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalBaslik}>
            {duzenlenecekNot ? 'Notu Düzenle' : 'Yeni Not Ekle'}
          </Text>
          <TextInput
            style={styles.notInput}
            placeholder="Notunuzu yazın..."
            value={yeniNot}
            onChangeText={setYeniNot}
            multiline
          />
          <View style={styles.modalButonlar}>
            <TouchableOpacity
              style={[styles.modalButton, styles.iptalButton]}
              onPress={() => {
                setModalVisible(false);
                setDuzenlenecekNot(null);
                setYeniNot('');
              }}
            >
              <Text style={styles.iptalButtonText}>İptal</Text>
            </TouchableOpacity>
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
  );

  const getTabBaslik = () => {
    switch (aktifTab) {
      case 'borclar':
        return 'Borçlarım';
      case 'alacaklar':
        return 'Alacaklarım';
      case 'alinacaklar':
        return 'Alınacaklar';
      default:
        return '';
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
            setYeniNot('');
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

      <NotModal />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalBaslik: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  notInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButonlar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  iptalButton: {
    backgroundColor: '#FF5252',
  },
  kaydetButton: {
    backgroundColor: '#4CAF50',
  },
  iptalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  kaydetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Notlar; 
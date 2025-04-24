import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const KATEGORI_GENISLIK = (width * 0.8 - 40) / 3; // Modal genişliğinin 3'te 1'i

const kategoriler = [
  { id: 'kira', ad: 'Kira', ikon: 'home', renk: '#2196F3' },
  { id: 'ulasim', ad: 'Ulaşım', ikon: 'directions-car', renk: '#FF9800' },
  { id: 'market', ad: 'Market / Gıda', ikon: 'shopping-basket', renk: '#4CAF50' },
  { id: 'yemeicme', ad: 'Yeme-İçme', ikon: 'restaurant', renk: '#E91E63' },
  { id: 'egitim', ad: 'Eğitim', ikon: 'school', renk: '#9C27B0' },
  { id: 'alisveris', ad: 'Alışveriş', ikon: 'shopping-cart', renk: '#FF5722' },
  { id: 'eglence', ad: 'Eğlence', ikon: 'sports-esports', renk: '#00BCD4' },
  { id: 'saglik', ad: 'Sağlık', ikon: 'local-hospital', renk: '#F44336' },
  { id: 'faturalar', ad: 'Faturalar', ikon: 'receipt', renk: '#607D8B' },
  { id: 'evcil', ad: 'Evcil Hayvan', ikon: 'pets', renk: '#795548' },
  { id: 'borc', ad: 'Borç / Kredi', ikon: 'credit-card', renk: '#9E9E9E' },
  { id: 'abonelik', ad: 'Abonelikler', ikon: 'subscriptions', renk: '#673AB7' },
];

const HarcamaFormu = ({ visible, onClose, onHarcamaEkle }) => {
  const [baslik, setBaslik] = useState('');
  const [tutar, setTutar] = useState('');
  const [tip, setTip] = useState('harcama');
  const [kategori, setKategori] = useState('market');

  const handleSubmit = () => {
    if (!baslik || !tutar) return;

    const yeniHarcama = {
      id: Date.now(),
      baslik,
      tutar: parseFloat(tutar),
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      tip,
      kategori: tip === 'harcama' ? kategori : 'gelir'
    };

    onHarcamaEkle(yeniHarcama);
    setBaslik('');
    setTutar('');
    setTip('harcama');
    setKategori('market');
    onClose();
  };

  const renderKategoriGrid = () => {
    return (
      <View style={styles.kategoriGrid}>
        {kategoriler.map((kategoriItem) => (
          <TouchableOpacity
            key={kategoriItem.id}
            style={[
              styles.kategoriButton,
              { width: KATEGORI_GENISLIK },
              kategori === kategoriItem.id && {
                backgroundColor: `${kategoriItem.renk}20`,
                borderColor: kategoriItem.renk,
              }
            ]}
            onPress={() => setKategori(kategoriItem.id)}
          >
            <MaterialIcons
              name={kategoriItem.ikon}
              size={24}
              color={kategoriItem.renk}
            />
            <Text style={styles.kategoriText} numberOfLines={2}>
              {kategoriItem.ad}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.baslik}>Yeni Harcama Ekle</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Başlık"
            value={baslik}
            onChangeText={setBaslik}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Tutar"
            value={tutar}
            onChangeText={setTutar}
            keyboardType="numeric"
          />

          <View style={styles.tipContainer}>
            <TouchableOpacity
              style={[
                styles.tipButton,
                tip === 'harcama' ? styles.harcamaButtonActive : styles.harcamaButton
              ]}
              onPress={() => setTip('harcama')}
            >
              <Text style={[
                styles.tipButtonText,
                tip === 'harcama' && styles.tipButtonTextActive
              ]}>
                Harcama
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tipButton,
                tip === 'gelir' ? styles.gelirButtonActive : styles.gelirButton
              ]}
              onPress={() => setTip('gelir')}
            >
              <Text style={[
                styles.tipButtonText,
                tip === 'gelir' && styles.tipButtonTextActive
              ]}>
                Gelir
              </Text>
            </TouchableOpacity>
          </View>

          {tip === 'harcama' && (
            <View style={styles.kategoriContainer}>
              <Text style={styles.kategoriBaslik}>Kategori Seçin</Text>
              <ScrollView style={styles.kategoriScroll}>
                {renderKategoriGrid()}
              </ScrollView>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.iptalButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.kaydetButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    maxHeight: '80%',
  },
  baslik: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tipButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  harcamaButton: {
    borderColor: '#F44336',
    backgroundColor: '#fff',
  },
  harcamaButtonActive: {
    borderColor: '#F44336',
    backgroundColor: '#F44336',
  },
  gelirButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  gelirButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  tipButtonText: {
    textAlign: 'center',
    color: '#666',
  },
  tipButtonTextActive: {
    color: '#fff',
  },
  kategoriContainer: {
    marginBottom: 20,
  },
  kategoriBaslik: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  kategoriScroll: {
    maxHeight: 200,
  },
  kategoriGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  kategoriButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 80,
  },
  kategoriText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  iptalButton: {
    backgroundColor: '#F44336',
  },
  kaydetButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default HarcamaFormu; 
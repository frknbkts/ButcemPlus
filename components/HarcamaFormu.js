import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HarcamaFormu = ({ visible, onClose, onHarcamaEkle, onHarcamaGuncelle, duzenlenecekHarcama }) => {
  const [baslik, setBaslik] = useState('');
  const [tutar, setTutar] = useState('');
  const [tip, setTip] = useState('harcama');
  const [kategori, setKategori] = useState('');

  const kategoriler = [
    { id: 'market', icon: 'shopping-cart', label: 'Market', color: '#FF9800' },
    { id: 'ulasim', icon: 'directions-car', label: 'Ulaşım', color: '#2196F3' },
    { id: 'kira', icon: 'home', label: 'Kira', color: '#9C27B0' },
    { id: 'yemeicme', icon: 'restaurant', label: 'Yeme-İçme', color: '#E91E63' },
    { id: 'alisveris', icon: 'shopping-bag', label: 'Alışveriş', color: '#FF5722' },
    { id: 'egitim', icon: 'school', label: 'Eğitim', color: '#009688' },
    { id: 'eglence', icon: 'local-movies', label: 'Eğlence', color: '#673AB7' },
    { id: 'saglik', icon: 'local-hospital', label: 'Sağlık', color: '#F44336' },
    { id: 'faturalar', icon: 'receipt', label: 'Faturalar', color: '#607D8B' },
    { id: 'evcil', icon: 'pets', label: 'Evcil Hayvan', color: '#795548' },
    { id: 'borc', icon: 'money-off', label: 'Borç', color: '#FFC107' },
    { id: 'abonelik', icon: 'subscriptions', label: 'Abonelik', color: '#00BCD4' },
    { id: 'gelir', icon: 'attach-money', label: 'Gelir', color: '#4CAF50' }
  ];

  useEffect(() => {
    if (duzenlenecekHarcama) {
      setBaslik(duzenlenecekHarcama.baslik);
      setTutar(duzenlenecekHarcama.tutar.toString());
      setTip(duzenlenecekHarcama.tip);
      setKategori(duzenlenecekHarcama.kategori);
    } else {
      setBaslik('');
      setTutar('');
      setTip('harcama');
      setKategori('');
    }
  }, [duzenlenecekHarcama]);

  const handleKaydet = () => {
    if (!baslik.trim() || !tutar || !kategori) return;

    const harcamaVerisi = {
      id: duzenlenecekHarcama?.id || Date.now(),
      baslik: baslik.trim(),
      tutar: parseFloat(tutar),
      tip,
      kategori,
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      tarih: new Date().toISOString().split('T')[0]
    };

    if (duzenlenecekHarcama) {
      onHarcamaGuncelle(harcamaVerisi);
    } else {
      onHarcamaEkle(harcamaVerisi);
    }

    handleKapat();
  };

  const handleKapat = () => {
    setBaslik('');
    setTutar('');
    setTip('harcama');
    setKategori('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleKapat}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalBaslik}>
                {duzenlenecekHarcama ? 'Harcama Düzenle' : 'Yeni Harcama Ekle'}
              </Text>

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
                    tip === 'harcama' && styles.aktifTipButton
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setTip('harcama');
                  }}
                >
                  <Text style={[
                    styles.tipButtonText,
                    tip === 'harcama' && styles.aktifTipButtonText
                  ]}>Harcama</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tipButton,
                    tip === 'gelir' && styles.aktifTipButton
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setTip('gelir');
                  }}
                >
                  <Text style={[
                    styles.tipButtonText,
                    tip === 'gelir' && styles.aktifTipButtonText
                  ]}>Gelir</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.kategoriBaslik}>Kategori Seçin</Text>
              
              <ScrollView 
                style={styles.kategorilerContainer}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.kategorilerGrid}>
                  {kategoriler.map((kat) => (
                    <TouchableOpacity
                      key={kat.id}
                      style={[
                        styles.kategoriButton,
                        kategori === kat.id && { backgroundColor: kat.color + '20' }
                      ]}
                      onPress={() => {
                        Keyboard.dismiss();
                        setKategori(kat.id);
                      }}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: kat.color }]}>
                        <MaterialIcons name={kat.icon} size={24} color="#fff" />
                      </View>
                      <Text style={styles.kategoriLabel}>{kat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.butonContainer}>
                <TouchableOpacity
                  style={[styles.buton, styles.iptalButon]}
                  onPress={() => {
                    Keyboard.dismiss();
                    handleKapat();
                  }}
                >
                  <Text style={styles.iptalButonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buton, styles.kaydetButon]}
                  onPress={() => {
                    Keyboard.dismiss();
                    handleKaydet();
                  }}
                >
                  <Text style={styles.kaydetButonText}>
                    {duzenlenecekHarcama ? 'Güncelle' : 'Kaydet'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalBaslik: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A1A1A',
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
    marginBottom: 20,
    gap: 12,
  },
  tipButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  aktifTipButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  aktifTipButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  kategoriBaslik: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  kategorilerContainer: {
    maxHeight: 320,
    marginBottom: 20,
  },
  kategorilerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  kategoriButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    margin: '1.65%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  kategoriLabel: {
    fontSize: 12,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  butonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  iptalButon: {
    backgroundColor: '#FF5252',
  },
  kaydetButon: {
    backgroundColor: '#4CAF50',
  },
  iptalButonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  kaydetButonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HarcamaFormu; 
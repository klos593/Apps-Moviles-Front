import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageUploaded: (url: string) => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({ 
  visible, 
  onClose, 
  onImageUploaded 
}) => {
  const [uploading, setUploading] = useState<boolean>(false);

  // Replace with your Cloudinary credentials
  const CLOUDINARY_CLOUD_NAME = 'dvdw8zjel';
  const CLOUDINARY_UPLOAD_PRESET = 'profilePic';

  const uploadToCloudinary = async (imageUri: string) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      } as any);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setUploading(false);
        onImageUploaded(data.secure_url);
        onClose();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      console.error('Cloudinary upload error:', error);
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need gallery permissions to select a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
      console.error('Gallery picker error:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
      console.error('Camera error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Cargar Imagen</Text>
          
          {uploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : (
            <>
              <Pressable
                style={styles.option}
                onPress={pickFromGallery}
              >
                <Text style={styles.optionText}>Desde la Galeria</Text>
              </Pressable>

              <Pressable
                style={styles.option}
                onPress={takePhoto}
              >
                <Text style={styles.optionText}>Tomar Foto</Text>
              </Pressable>

              <Pressable
                style={[styles.option, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#5b8266',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelText: {
    color: '#333',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default ImagePickerModal;
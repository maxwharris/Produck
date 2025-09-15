import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Category } from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function AddProductScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [rating, setRating] = useState('');
  const [blurb, setBlurb] = useState('');
  const [timeUsed, setTimeUsed] = useState('');
  const [scannedUpc, setScannedUpc] = useState<string>('');

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUpcModal, setShowUpcModal] = useState(false);
  const [manualUpc, setManualUpc] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#F59E0B');

  const colorOptions = [
    '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280'
  ];

  useEffect(() => {
    if (user) {
      loadUserCategories();
    }
  }, [user]);

  const loadUserCategories = async () => {
    if (!user) return;

    try {
      const categories = await apiService.getCategories({ userId: user.id });
      setUserCategories(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const createNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    try {
      const newCategory = await apiService.createCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      }, user.id);

      setUserCategories(prev => [...prev, newCategory]);
      setCategory(newCategory.name);
      setShowCategoryModal(false);
      setNewCategoryName('');
      setNewCategoryColor('#F59E0B');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create category');
    }
  };

  const parseDateInput = (dateString: string): string => {
    const today = new Date();
    const lowerInput = dateString.toLowerCase().trim();

    // Handle common date inputs
    if (lowerInput === 'today' || lowerInput === 'now') {
      return today.toISOString().split('T')[0];
    } else if (lowerInput === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }

    // Handle relative time expressions
    const relativeMatch = lowerInput.match(/^(\d+)\s+(year|month|week|day)s?\s+ago$/);
    if (relativeMatch) {
      const amount = parseInt(relativeMatch[1]);
      const unit = relativeMatch[2];
      const date = new Date(today);

      switch (unit) {
        case 'year':
          date.setFullYear(today.getFullYear() - amount);
          break;
        case 'month':
          date.setMonth(today.getMonth() - amount);
          break;
        case 'week':
          date.setDate(today.getDate() - (amount * 7));
          break;
        case 'day':
          date.setDate(today.getDate() - amount);
          break;
      }
      return date.toISOString().split('T')[0];
    }

    // Handle "a year ago", "a month ago", etc.
    const aRelativeMatch = lowerInput.match(/^a\s+(year|month|week|day)\s+ago$/);
    if (aRelativeMatch) {
      const unit = aRelativeMatch[1];
      const date = new Date(today);

      switch (unit) {
        case 'year':
          date.setFullYear(today.getFullYear() - 1);
          break;
        case 'month':
          date.setMonth(today.getMonth() - 1);
          break;
        case 'week':
          date.setDate(today.getDate() - 7);
          break;
        case 'day':
          date.setDate(today.getDate() - 1);
          break;
      }
      return date.toISOString().split('T')[0];
    }

    // Check if it's already a valid date format
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }

    // If it's a partial date like "2024-01", add current day
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return `${dateString}-01`;
    }

    // If it's just a year, add current month and day
    if (/^\d{4}$/.test(dateString)) {
      return `${dateString}-01-01`;
    }

    // Return as-is if we can't parse it (let backend handle validation)
    return dateString;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPurchaseDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name || !category || !cost || !description || !purchaseDate || !rating || !blurb || !timeUsed) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(cost)) || parseFloat(cost) <= 0) {
      Alert.alert('Error', 'Please enter a valid cost');
      return;
    }

    if (isNaN(parseInt(rating)) || parseInt(rating) < 1 || parseInt(rating) > 5) {
      Alert.alert('Error', 'Rating must be between 1 and 5');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a product');
      return;
    }

    setLoading(true);
    try {
      // Convert Date to ISO string for API
      const purchaseDateString = purchaseDate.toISOString().split('T')[0];

      // Upload images if any were selected
      let uploadedPhotoUrls: string[] = [];
      if (images.length > 0) {
        try {
          uploadedPhotoUrls = await apiService.uploadImages(images);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          Alert.alert('Warning', 'Images failed to upload, but product will be created without them.');
        }
      }

      const productData = {
        name,
        category,
        cost: parseFloat(cost),
        description,
        purchaseDate: purchaseDateString,
        rating: parseInt(rating),
        blurb,
        timeUsed,
        photos: uploadedPhotoUrls,
        upc: scannedUpc || undefined,
        userId: user.id,
      };

      await apiService.createProduct(productData);

      Alert.alert('Success', 'Product added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to My Products
            (navigation as any).navigate('MyProducts');
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star.toString())}
            style={styles.starButton}
          >
            <Text style={[
              styles.star,
              parseInt(rating) >= star ? styles.starSelected : styles.starUnselected
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Manual UPC lookup function
  const handleManualUpcLookup = async () => {
    if (!manualUpc.trim()) {
      Alert.alert('Error', 'Please enter a UPC code');
      return;
    }

    try {
      // Show loading while fetching product info
      Alert.alert('Looking up...', 'Searching for product information...');

      // Call go-upc.com API to get product name and image
      const productInfo = await apiService.lookupUPC(manualUpc.trim());

      // Update the product name field and store UPC
      setName(productInfo.name);
      setScannedUpc(manualUpc.trim());

      // Add product image to images array if available
      if (productInfo.imageUrl) {
        setImages(prev => [productInfo.imageUrl!, ...prev]);
      }

      Alert.alert('Success', `Found: ${productInfo.name}${productInfo.imageUrl ? ' (with image)' : ''}`, [
        { text: 'OK' }
      ]);

      // Close the modal and clear input
      setShowUpcModal(false);
      setManualUpc('');
    } catch (error) {
      console.error('UPC lookup error:', error);
      Alert.alert('Product Not Found', 'Could not find product information for this UPC code. You can still enter the product name manually.', [
        { text: 'OK' }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Add Produck</Text>
              <Text style={styles.subtitle}>Share your product experience</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          {/* Image Upload Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Photos</Text>
            <View style={styles.imageContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <View style={styles.imageButtons}>
                  <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <Text style={styles.imageButtonText}>📁 Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <Text style={styles.imageButtonText}>📷 Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Product Name *</Text>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setShowUpcModal(true)}
              >
                <Ionicons name="barcode-outline" size={20} color="#F59E0B" />
                <Text style={styles.scanButtonText}>UPC</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter product name or scan barcode"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {userCategories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: category === cat.name ? cat.color : '#f3f4f6' }
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    category === cat.name && styles.categoryButtonTextSelected
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.categoryButton, styles.createCategoryButton]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.createCategoryText}>➕ New</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cost ($) *</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Purchase Date *</Text>
            <TextInput
              style={styles.input}
              value={purchaseDate.toISOString().split('T')[0]}
              onChangeText={(text) => setPurchaseDate(new Date(text))}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rating *</Text>
            {renderStars()}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time Used *</Text>
            <TextInput
              style={styles.input}
              value={timeUsed}
              onChangeText={setTimeUsed}
              placeholder="e.g., 2 weeks, 3 months"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the product..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Review *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={blurb}
              onChangeText={setBlurb}
              placeholder="Share your experience..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Produck</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Create Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Category</Text>

            <TextInput
              style={styles.modalInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Category name"
              autoCorrect={false}
            />

            <Text style={styles.colorLabel}>Choose Color:</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    newCategoryColor === color && styles.colorOptionSelected
                  ]}
                  onPress={() => setNewCategoryColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createNewCategory}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Manual UPC Input Modal */}
      <Modal
        visible={showUpcModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUpcModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter UPC Code</Text>

            <TextInput
              style={styles.modalInput}
              value={manualUpc}
              onChangeText={setManualUpc}
              placeholder="Enter UPC/barcode number"
              keyboardType="numeric"
              autoCorrect={false}
            />

            <Text style={styles.upcHint}>
              Enter the barcode number found on the product packaging
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setShowUpcModal(false);
                  setManualUpc('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleManualUpcLookup}
              >
                <Text style={styles.createButtonText}>Lookup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#F2C335',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 16,
    padding: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    fontWeight: 'bold',
    color: '#402A1D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
    color: '#374151',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  scanButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#374151',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#374151',
  },
  categoryScroll: {
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  createCategoryButton: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  createCategoryText: {
    color: '#F59E0B',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
  },
  starSelected: {
    color: '#F59E0B',
  },
  starUnselected: {
    color: '#d1d5db',
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#111827',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#F59E0B',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
  upcHint: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  closeScannerButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  scannerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  scannerFrame: {
    width: 250,
    height: 150,
    alignSelf: 'center',
    position: 'relative',
  },
  scannerCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderTopLeftRadius: 10,
  },
  scannerCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderTopRightRadius: 10,
  },
  scannerCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
  },
  scannerCornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderBottomRightRadius: 10,
  },
  scannerInstructions: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
});

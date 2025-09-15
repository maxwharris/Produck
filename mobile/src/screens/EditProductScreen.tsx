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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Category, Product, getFullImageUrl } from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProductScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { product } = route.params as { product: Product };

  const [loading, setLoading] = useState(false);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // Form state - pre-populate with existing product data
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [cost, setCost] = useState(product.cost.toString());
  const [description, setDescription] = useState(product.description || '');
  const [purchaseDate, setPurchaseDate] = useState(new Date(product.purchaseDate));
  const [rating, setRating] = useState('');
  const [blurb, setBlurb] = useState('');
  const [timeUsed, setTimeUsed] = useState('');

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#F59E0B');

  const colorOptions = [
    '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280'
  ];

  useEffect(() => {
    if (user) {
      loadUserCategories();
      loadExistingReview();
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

  const loadExistingReview = async () => {
    try {
      const reviews = await apiService.getReviews({ productId: product._id });
      if (reviews.length > 0) {
        const review = reviews[0];
        setRating(review.rating.toString());
        setBlurb(review.blurb);
        setTimeUsed(review.timeUsed);
        // Load existing images if any
        if (review.photos && review.photos.length > 0) {
          setImages(review.photos);
        }
      }
    } catch (error) {
      console.error('Error loading review:', error);
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
      Alert.alert('Error', 'You must be logged in to edit a product');
      return;
    }

    setLoading(true);
    try {
      // Convert Date to ISO string for API
      const purchaseDateString = purchaseDate.toISOString().split('T')[0];

      // Upload new images if any were added (existing images are already URLs)
      let allPhotoUrls: string[] = [];
      const newImages = images.filter(img => img.startsWith('file://') || (!img.startsWith('http') && !img.startsWith('/')));

      if (newImages.length > 0) {
        try {
          const uploadedUrls = await apiService.uploadImages(newImages);
          allPhotoUrls = [...images.filter(img => img.startsWith('http') || img.startsWith('/')), ...uploadedUrls];
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          Alert.alert('Warning', 'Images failed to upload, but product will be updated without them.');
          allPhotoUrls = images.filter(img => img.startsWith('http') || img.startsWith('/'));
        }
      } else {
        allPhotoUrls = images.filter(img => img.startsWith('http') || img.startsWith('/'));
      }

      const productData = {
        name,
        category,
        cost: parseFloat(cost),
        description,
        purchaseDate: purchaseDateString,
      };

      await apiService.updateProduct(product._id, productData, user.id);

      // Update the review as well
      // Note: In a full implementation, you'd want to update the review separately
      // For now, we'll just update the product data

      Alert.alert('Success', 'Product updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to My Products
            (navigation as any).navigate('MyProducts');
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
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
              <Text style={styles.title}>Edit Product</Text>
              <Text style={styles.subtitle}>Update your product information</Text>
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
                  <Image source={{ uri: uri.startsWith('http') || uri.startsWith('/') ? getFullImageUrl(uri) : uri }} style={styles.image} />
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
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter product name"
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
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {purchaseDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={purchaseDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
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
              <Text style={styles.submitButtonText}>Update Product</Text>
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
    backgroundColor: '#F59E0B',
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
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#92400E',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#F59E0B',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

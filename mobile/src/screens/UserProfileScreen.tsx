import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { apiService, Product, User } from '../services/api';

export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params as { userId: string };

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const [userProducts] = await Promise.all([
        apiService.getProducts({ userId }),
      ]);

      // Get user info from the first product
      if (userProducts.length > 0) {
        setUser(userProducts[0].userId);
      }
      setProducts(userProducts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userStats}>{products.length} products shared</Text>
      </View>

      {/* Products List */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>{user.name}'s Products</Text>

        {products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.productGrid}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products shared yet</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  productsSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  productGrid: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#3b82f6',
  },
});

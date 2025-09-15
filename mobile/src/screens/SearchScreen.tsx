import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { apiService, Product, User } from '../services/api';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'users'>('all');

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const [productResults, userResults] = await Promise.all([
        apiService.getProducts({ search: query }),
        apiService.searchUsers(query),
      ]);

      setProducts(productResults);
      setUsers(userResults);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        (navigation as any).navigate('UserProfile', { userId: item._id });
      }}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <Text style={styles.viewProfileText}>View Profile →</Text>
    </TouchableOpacity>
  );

  const hasResults = products.length > 0 || users.length > 0;

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find products and users</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, users..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9ca3af"
        />
        {loading && (
          <ActivityIndicator size="small" color="#3b82f6" style={styles.loadingIndicator} />
        )}
      </View>

      {/* Results Tabs */}
      {hasResults && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All ({products.length + users.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
              Products ({products.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.activeTab]}
            onPress={() => setActiveTab('users')}
          >
            <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
              Users ({users.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {searchQuery.trim() ? (
        hasResults ? (
          <View style={styles.resultsContainer}>
            {/* Products Section */}
            {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
              <View style={styles.section}>
                {activeTab === 'all' && <Text style={styles.sectionTitle}>Products</Text>}
                <FlatList
                  data={products}
                  renderItem={renderProduct}
                  keyExtractor={(item) => item._id}
                  numColumns={2}
                  contentContainerStyle={styles.productGrid}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {/* Users Section */}
            {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
              <View style={styles.section}>
                {activeTab === 'all' && <Text style={styles.sectionTitle}>Users</Text>}
                <FlatList
                  data={users}
                  renderItem={renderUser}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={styles.userList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        ) : !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search terms or check your spelling
            </Text>
          </View>
        ) : null
      ) : (
        <View style={styles.initialContainer}>
          <Text style={styles.initialTitle}>Search for Products & Users</Text>
          <Text style={styles.initialText}>
            Enter keywords to find products by name or description, or search for users by name
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#F2C335',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 30,
    top: 35,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    padding: 20,
    paddingBottom: 12,
  },
  productGrid: {
    padding: 8,
  },
  userList: {
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2C335',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  viewProfileText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  initialText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

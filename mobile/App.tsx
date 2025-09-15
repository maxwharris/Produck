import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import CustomTabBar from './src/components/CustomTabBar';
import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MyProductsScreen from './src/screens/MyProductsScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2C335', // Golden yellow theme
        },
        headerTintColor: '#402A1D',
        headerTitleStyle: {
          fontFamily: 'Poppins_700Bold',
          fontWeight: 'bold',
        },
        headerTitleContainerStyle: {
          paddingTop: 20,
          paddingBottom: 10,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In to Produck' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Join Produck' }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2C335', // Golden yellow theme
        },
        headerTintColor: '#402A1D',
        headerTitleStyle: {
          fontFamily: 'Poppins_700Bold',
          fontWeight: 'bold',
        },
        headerTitleContainerStyle: {
          paddingTop: 20,
          paddingBottom: 10,
        },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 120, height: 36, resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain'}}
            />
          ),
        }}
  
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          title: 'Edit Produck',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'User Profile',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function DiscoverStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2C335', // Golden yellow theme
        },
        headerTintColor: '#402A1D',
        headerTitleStyle: {
          fontFamily: 'Poppins_700Bold',
          fontWeight: 'bold',
        },
        headerTitleContainerStyle: {
          paddingTop: 20,
          paddingBottom: 10,
        },
      }}
    >
      <Stack.Screen
        name="DiscoverMain"
        component={DiscoverScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 120, height: 36, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          title: 'Edit Produck',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'User Profile',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2C335', // Golden yellow theme
        },
        headerTintColor: '#402A1D',
        headerTitleStyle: {
          fontFamily: 'Poppins_700Bold',
          fontWeight: 'bold',
        },
        headerTitleContainerStyle: {
          paddingTop: 20,
          paddingBottom: 10,
        },
      }}
    >
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 120, height: 36, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          title: 'Edit Produck',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'User Profile',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2C335', // Golden yellow theme
        },
        headerTintColor: '#402A1D',
        headerTitleStyle: {
          fontFamily: 'Poppins_700Bold',
          fontWeight: 'bold',
        },
        headerTitleContainerStyle: {
          paddingTop: 20,
          paddingBottom: 10,
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 120, height: 36, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{
          title: 'My Producks',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: 'Add Produck',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          title: 'Edit Produck',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Produck Details',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'User Profile',
          headerLeft: () => (
            <Image
              source={require('./assets/produck-logo-transparent.png')}
              style={{ width: 80, height: 24, marginLeft: 10, resizeMode: 'contain' }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false, // Hide headers since we have stack headers
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverStack}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🦆</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2ECD8' }}>
        <ActivityIndicator size="large" color="#F2C335" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {user ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2ECD8' }}>
        <ActivityIndicator size="large" color="#F2C335" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

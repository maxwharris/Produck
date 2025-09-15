# Produck

A modern social platform for discovering, reviewing, and sharing products with your community. Built with Next.js, React Native, MongoDB, and featuring a beautiful golden yellow theme.

**Available on Web & Mobile** 📱💻

## 🚀 Features

### 🌟 Core Features
- **Product Discovery**: Explore trending products shared by the community
- **Social Reviews**: Create detailed reviews with ratings (1-5 stars), photos, and personal experiences
- **Category Organization**: Browse products by categories with smart filtering
- **User Profiles**: View user profiles and their product collections
- **Search Functionality**: Find products and users across the platform

### 📱 Mobile App
- **Native Mobile Experience**: Full-featured React Native app with Expo
- **Cross-Platform**: iOS and Android support with unified codebase
- **Offline Support**: Core functionality works without internet connection
- **Push Notifications**: Stay updated with new reviews and products

### 🛠️ Product Management
- **Add Products**: Share your favorite products with the community
- **Edit & Delete**: Full CRUD operations for your product listings
- **Photo Upload**: Multiple photo support for rich product showcases
- **Cost Tracking**: Track purchase costs and value assessments

### 🎨 User Experience
- **Modern UI**: Beautiful golden yellow theme (#F2C335) with Poppins typography
- **Responsive Design**: Seamless experience across all devices
- **Intuitive Navigation**: Bottom tab navigation with custom styling
- **Dark/Light Mode Ready**: Extensible theming system

## 🛠️ Tech Stack

### 🌐 Web Application
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js for authentication
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Local file system (configurable for cloud storage)
- **Styling**: Tailwind CSS with custom golden theme (#F2C335)

### 📱 Mobile Application
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Stack & Tab navigators)
- **State Management**: React Context API
- **UI Components**: React Native built-in components
- **Typography**: Google Fonts (Poppins)
- **Platform Support**: iOS & Android

### 🔧 Development Tools
- **Language**: TypeScript for type safety
- **Linting**: ESLint for code quality
- **Build Tools**: Next.js & Expo CLI
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/maxwharris/produck.git
cd product-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/product-tracker
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/product-tracker
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB Community Server
- Start MongoDB service
- Database will be created automatically

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://mongodb.com/atlas
- Create a cluster
- Get connection string and update `.env.local`

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile App Setup

### Prerequisites for Mobile Development
- Node.js (v18 or higher)
- Expo CLI: `npm install -g @expo/cli`
- For iOS development: macOS with Xcode
- For Android development: Android Studio or Expo Go app

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Mobile Dependencies
```bash
npm install
```

### 3. Start the Expo Development Server
```bash
npm start
# or
npx expo start
```

### 4. Run on Device/Emulator

**Using Expo Go App (Recommended for testing):**
- Install Expo Go on your iOS/Android device
- Scan the QR code shown in terminal or Expo DevTools

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

### Mobile App Features
- **Home Tab**: View trending products from the community
- **Discover Tab**: Browse all products with category filtering
- **Search Tab**: Find specific products and users
- **Profile Tab**: Manage your account, products, and settings

### Mobile Development Notes
- The mobile app shares the same backend API as the web app
- Authentication is handled via the same API endpoints
- File uploads work through the same `/api/upload` endpoint
- All product and review data is synchronized between web and mobile

## 📖 Usage

### Adding Products
1. Navigate to the Products page
2. Click "Add Product"
3. Fill in product details (name, category, purchase date, cost, description)
4. Click "Add Product"

### Creating Reviews
1. Go to Products page
2. Click "View Details" on any product
3. Click "Add Review"
4. Fill in review details:
   - Rating (1-5 stars)
   - Review text
   - Cost
   - Time used
   - Upload photos (optional)
5. Click "Add Review"

## 🏗️ Project Structure

### 🌐 Web Application (`src/`)
```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication (NextAuth.js)
│   │   ├── products/       # Product CRUD operations
│   │   ├── reviews/        # Review CRUD operations
│   │   ├── categories/     # Category management
│   │   ├── users/          # User management
│   │   └── upload/         # File upload handling
│   ├── products/           # Product pages
│   │   ├── [id]/          # Product detail page
│   │   └── [id]/review/   # Add review page
│   ├── categories/         # Category browsing
│   ├── search/             # Search functionality
│   ├── users/              # User profiles
│   ├── auth/               # Authentication pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/              # Reusable React components
│   ├── ProductCard.tsx     # Product display card
│   ├── AddProductForm.tsx  # Product creation form
│   ├── Navigation.tsx      # Navigation component
│   └── Providers.tsx       # Context providers
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   └── mongodb.ts         # Database connection
└── models/                 # MongoDB schemas
    ├── Product.ts         # Product model
    ├── Review.ts          # Review model
    ├── Category.ts        # Category model
    └── User.ts            # User model
```

### 📱 Mobile Application (`mobile/`)
```
mobile/
├── src/
│   ├── components/         # Reusable components
│   │   ├── ProductCard.tsx # Product display card
│   │   └── CustomTabBar.tsx # Custom bottom tab bar
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication context
│   ├── screens/            # App screens
│   │   ├── HomeScreen.tsx  # Home/trending products
│   │   ├── DiscoverScreen.tsx # Product discovery
│   │   ├── SearchScreen.tsx # Search functionality
│   │   ├── ProfileScreen.tsx # User profile
│   │   ├── ProductDetailScreen.tsx # Product details
│   │   ├── AddProductScreen.tsx # Add new product
│   │   ├── EditProductScreen.tsx # Edit product
│   │   ├── LoginScreen.tsx # User login
│   │   ├── RegisterScreen.tsx # User registration
│   │   ├── CategoriesScreen.tsx # Category management
│   │   ├── SettingsScreen.tsx # App settings
│   │   ├── MyProductsScreen.tsx # User's products
│   │   └── UserProfileScreen.tsx # Other user profiles
│   └── services/           # API services
│       └── api.ts          # API client
├── assets/                 # Static assets
│   ├── produck-logo.png    # App logo
│   ├── icon.png            # App icon
│   └── splash-icon.png     # Splash screen icon
├── App.tsx                 # Main app component
└── app.json                # Expo configuration
```

## 🔧 Available Scripts

### 🌐 Web Application Scripts
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### 📱 Mobile Application Scripts
- `cd mobile && npm start` - Start Expo development server
- `cd mobile && npm run ios` - Run on iOS simulator
- `cd mobile && npm run android` - Run on Android emulator
- `cd mobile && npm run web` - Run in web browser

## 📊 API Endpoints

### 🔐 Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication handler
- `POST /api/auth/register` - User registration

### 🛍️ Products
- `GET /api/products` - Get all products (with optional category filtering)
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### ⭐ Reviews
- `GET /api/reviews` - Get all reviews (with optional productId filter)
- `POST /api/reviews` - Create new review
- `GET /api/reviews/[id]` - Get review by ID
- `PUT /api/reviews/[id]` - Update review
- `DELETE /api/reviews/[id]` - Delete review

### 📂 Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/[categoryId]` - Get category by ID
- `PUT /api/categories/[categoryId]` - Update category
- `DELETE /api/categories/[categoryId]` - Delete category

### 👥 Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### 📤 File Upload
- `POST /api/upload` - Upload files (images for products/reviews)

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/product-tracker` |

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js, React Native, and MongoDB

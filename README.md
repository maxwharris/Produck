# Product Tracker

A modern web application for tracking purchased products and managing detailed reviews. Built with Next.js, MongoDB, and Tailwind CSS.

## 🚀 Features

- **Product Management**: Add, view, and organize your purchased products
- **Detailed Reviews**: Create comprehensive reviews with ratings (1-5 stars), text blurbs, photos, cost, and time used
- **Photo Upload**: Upload multiple photos for each review
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **File Storage**: Local file system (easily configurable for cloud storage)

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

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── products/        # Product CRUD operations
│   │   ├── reviews/         # Review CRUD operations
│   │   └── upload/          # File upload handling
│   ├── products/            # Product pages
│   │   ├── [id]/           # Product detail page
│   │   └── [id]/review/    # Add review page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/              # Reusable React components
│   ├── ProductCard.tsx     # Product display card
│   └── AddProductForm.tsx  # Product creation form
├── lib/
│   └── mongodb.ts          # Database connection
└── models/                 # MongoDB schemas
    ├── Product.ts          # Product model
    └── Review.ts           # Review model
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Reviews
- `GET /api/reviews` - Get all reviews (with optional productId filter)
- `POST /api/reviews` - Create new review
- `GET /api/reviews/[id]` - Get review by ID
- `PUT /api/reviews/[id]` - Update review
- `DELETE /api/reviews/[id]` - Delete review

### File Upload
- `POST /api/upload` - Upload files

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

Built with ❤️ using Next.js and MongoDB

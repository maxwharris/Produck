import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: string
  purchaseDate: Date
  cost: number
  description?: string
  upc?: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  description: { type: String },
  upc: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

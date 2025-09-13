import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: string
  purchaseDate: Date
  cost: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  description: { type: String },
}, {
  timestamps: true,
})

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId
  rating: number
  blurb: string
  photos: string[]
  cost: number
  timeUsed: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  blurb: { type: String, required: true },
  photos: [{ type: String }],
  cost: { type: Number, required: true },
  timeUsed: { type: String, required: true },
}, {
  timestamps: true,
})

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

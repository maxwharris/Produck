import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  color: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})

// Compound index to ensure unique category names per user
CategorySchema.index({ name: 1, userId: 1 }, { unique: true })

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)

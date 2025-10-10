import mongoose, { Schema, type Document } from "mongoose"

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId
  content: string
  images: string[]
  likes: mongoose.Types.ObjectId[]
  comments: {
    userId: mongoose.Types.ObjectId
    content: string
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)

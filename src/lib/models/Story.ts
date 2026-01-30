import mongoose, { Schema, type Document } from "mongoose"

export interface IStory extends Document {
  userId: mongoose.Types.ObjectId
  imageUrl: string
  expiresAt: Date
  views: mongoose.Types.ObjectId[]
  createdAt: Date
}

const StorySchema = new Schema<IStory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

export default mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema)

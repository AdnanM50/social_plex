import mongoose, { Schema, type Document } from "mongoose"

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  content: string
  type: "text" | "image" | "file"
  fileUrl?: string
  readBy: mongoose.Types.ObjectId[]
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
    fileUrl: { type: String },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)

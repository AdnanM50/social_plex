import mongoose, { Schema, type Document } from "mongoose"

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  lastMessage?: {
    senderId: mongoose.Types.ObjectId
    content: string
    createdAt: Date
  }
  unreadCount: Map<string, number>
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: {
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      createdAt: { type: Date },
    },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  { timestamps: true },
)

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema)

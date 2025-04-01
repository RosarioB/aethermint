import mongoose, { Schema, Document, Model } from "mongoose";

export interface Nft extends Document {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  jsonIpfsUrl: string;
  owner: string;
  createdAt: Date;
}

const nftSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    jsonIpfsUrl: { type: String, required: true },
    owner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const NftModel: Model<Nft> = mongoose.model<Nft>("Nft", nftSchema);

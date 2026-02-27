import mongoose, { type Document, type Model } from "mongoose";

export interface ISecret {
  provider: string;
  patternName: string;
  description: string;
  value: string;
  maskedValue: string;
  entropy: number;
  repoFullName: string;
  repoUrl: string;
  repoOwner: string;
  repoOwnerAvatar: string;
  filePath: string;
  fileUrl: string;
  lineNumber: number | null;
  fragment: string | null;
  stars: number;
  discoveredAt: Date;
  isValid: boolean;
}

export interface ISecretDocument extends ISecret, Document {}

const secretSchema = new mongoose.Schema<ISecretDocument>(
  {
    provider: { type: String, required: true, index: true },
    patternName: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: String, required: true },
    maskedValue: { type: String, required: true },
    entropy: { type: Number, required: true },
    repoFullName: { type: String, required: true, index: true },
    repoUrl: { type: String, required: true },
    repoOwner: { type: String, required: true },
    repoOwnerAvatar: { type: String, required: true },
    filePath: { type: String, required: true },
    fileUrl: { type: String, required: true },
    lineNumber: { type: Number, default: null },
    fragment: { type: String, default: null },
    stars: { type: Number, default: 0 },
    discoveredAt: { type: Date, default: Date.now, index: true },
    isValid: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

secretSchema.index({ provider: 1, discoveredAt: -1 });
secretSchema.index({ provider: 1, entropy: -1 });
secretSchema.index({ provider: 1, stars: -1 });
secretSchema.index({ repoFullName: 1, filePath: 1 });
secretSchema.index({ discoveredAt: -1 });
secretSchema.index({ entropy: -1 });
secretSchema.index({ stars: -1 });
secretSchema.index(
  { repoFullName: "text", filePath: "text", description: "text" },
  { name: "secrets_text_search" },
);

export const maskSecret = (value: string): string => {
  if (value.length <= 8) return "*".repeat(value.length);
  const prefix = value.slice(0, 6);
  const suffix = value.slice(-4);
  const middle = "*".repeat(Math.max(4, value.length - 10));
  return `${prefix}${middle}${suffix}`;
};

export const SecretModel: Model<ISecretDocument> =
  mongoose.model<ISecretDocument>("Secret", secretSchema);

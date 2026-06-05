import mongoose, { Schema, model, models } from "mongoose";

// ============================================================
// User model. Passwords are NEVER stored in plaintext — we store a bcrypt
// hash in `passwordHash`. `email` is unique and lowercased so logins are
// case-insensitive.
// ============================================================

export interface UserDoc extends mongoose.Document {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

// In dev / serverless the module can be evaluated more than once; reuse the
// already-compiled model to avoid "OverwriteModelError".
export const User =
  (models.User as mongoose.Model<UserDoc>) || model<UserDoc>("User", UserSchema);

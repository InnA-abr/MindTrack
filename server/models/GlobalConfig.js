import mongoose from "mongoose";

const { Schema } = mongoose;

const GlobalConfigSchema = new Schema(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    development: {
      database: {
        uri: { type: String },
      },
      email: {
        mailUser: { type: String },
        mailPassword: { type: String },
        mailService: { type: String },
      },
      auth: {
        secretOrKey: { type: String },
      },
      infinitScrollEnabled: { type: Boolean },
      paginationEnabled: { type: Boolean },
      showProductsPerPage: {
        mobile: { type: Number },
        tablet: { type: Number },
        desktop: { type: Number },
      },
      minOrderValue: { type: Number },
    },
    production: {
      database: {
        uri: { type: String },
      },
      email: {
        mailUser: { type: String },
        mailPassword: { type: String },
        mailService: { type: String },
      },
      auth: {
        secretOrKey: { type: String },
      },
      infinitScrollEnabled: { type: Boolean },
      paginationEnabled: { type: Boolean },
      showProductsPerPage: {
        mobile: { type: Number },
        tablet: { type: Number },
        desktop: { type: Number },
      },
      minOrderValue: { type: Number },
    },
  },
  {
    strict: false,
    timestamps: true,
    versionKey: false,
  }
);

// Optional index for text search
GlobalConfigSchema.index({ customId: "text" });

const GlobalConfig = mongoose.model("global-configs", GlobalConfigSchema);

export default GlobalConfig;

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " Ingrese su nombre"],
    },
    email: {
      type: String,
      required: [true, "Ingrese su correo electronico"],
      unique: [true, "este email realmente existe"],
      lowercase: true,
      validate: [validator.isEmail, "Por favor ingrese un correo valido"],
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png",
    },
    status: {
      type: String,
      default: "Estoy Usando WhatsApp",
    },
    password: {
      type: String,
      required: [true, "Por favor, ingrese su password"],
      minLength: [6, "Crea tu password con mas de 6 caracteres"],
      maxLength: [128, "Crea tu password con menos de 128 caracteres"],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;

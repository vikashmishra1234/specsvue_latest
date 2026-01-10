import { Schema, models, model, InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
   email:{type:String,required:true},
   isVerified:{type:Boolean,default:false},
   name:{type:String},
   picture:{type:String},
   token:{type:String},
   userId:{type:String,required:true,unique:true},
   otp:{type:String},
   otpExpiry:{type:Date}
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema>;

if (models.User) {
    delete models.User
}

const User = models.User || model<IUser>('User', UserSchema);

export default User;

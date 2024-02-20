import mongoose, { Schema } from 'mongoose';

const AuthenticationData = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true, select: false },
        sessionToken: { type: String, select: false },
        salt: { type: String, select: false },
        userName: { type: String, required: true },
        fileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
    }
);

const ProfileData = new mongoose.Schema(
    {
        role: { type: String, required: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        contactEmail: { type: String },
        bloodGroup: { type: String },
        phoneNumber: { type: String },
        gender: { type: String },
        address: { type: String },
        treatment: { type: String },
        pesel: { type: String },
        appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomCalendarEvent' }]
    }
);

const UserSchema = new mongoose.Schema(
    {
        id: Number,
        authentication: AuthenticationData,
        profile: ProfileData,
        files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
    }
);

export const UserModel = mongoose.model('User', UserSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByAuthenticationEmail = (email: string) => UserModel.findOne({ 'authentication.email': email }).select('+authentication.password +authentication.salt +userName');
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: number) => UserModel.findOne({ id: id });
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findOneAndUpdate({ id: id }, values);

import mongoose, { Schema } from 'mongoose';

const AuthenticationData = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
    salt: { type: String, select: false },
    userName: { type: String, required: true },
    fileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});

const UserSpecializationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

const UserAdressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
});

const ProfileData = new mongoose.Schema({
    role: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    specialization: { type: UserSpecializationSchema, required: false, default: undefined },
    address: { type: UserAdressSchema },
    contactEmail: { type: String },
    bloodGroup: { type: String },
    phoneNumber: { type: String },
    gender: { type: String },
    treatment: { type: String },
    pesel: { type: String },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomCalendarEvent' }],
    weeklySchedule: {
        monday: { start: String, end: String },
        tuesday: { start: String, end: String },
        wednesday: { start: String, end: String },
        thursday: { start: String, end: String },
        friday: { start: String, end: String },
        saturday: { start: String, end: String },
        sunday: { start: String, end: String }
    }
});

const UserSchema = new mongoose.Schema({
    authentication: AuthenticationData,
    profile: ProfileData,
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});

export const UserModel = mongoose.model('User', UserSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByAuthenticationEmail = (email: string) => UserModel.findOne({ 'authentication.email': email }).select('+authentication.password +authentication.salt +userName');
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

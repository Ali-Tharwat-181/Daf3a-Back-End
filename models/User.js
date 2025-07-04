import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
  password: {
    type: String,
    required: true
},
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    default: 'student'
},
phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
},
preferredLanguage: {
    type: [String],
    enum: ['arabic', 'english', 'french', 'german', 'italian'],
    default: ['english']
}
},
{
  timestamps: true
});

export default mongoose.model('User', userSchema);

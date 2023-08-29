import mongoose, { model } from "mongoose";

// creating a schema(table called as collection in mongoDB)
// to store the registration details
const userSchema = new mongoose.Schema({
    username: { type: String, required: true,unique:true},
    password: { type: String, required: true }
}, { timestamp: true });

// creating a model from schema
const User = mongoose.model('User', userSchema);

export default User;

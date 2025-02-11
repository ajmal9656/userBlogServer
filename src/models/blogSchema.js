import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Blog schema
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
        
      url: { type: String, default: "" }, // Optional 
      type: { type: String, default: "" } // Optional type
  
  
},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User collection
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    categories: {
      type: [String],
      required: true,
      enum: [
        'Technology', 'Health', 'Science', 'Travel', 'Lifestyle', 'Business', 'Art', 'Sports',
        'Food', 'Education', 'Music', 'Movies', 'Books', 'Fitness', 'Nature', 'Photography',
        'Gaming', 'Politics', 'Finance', 'Culture', 'History', 'News', 'Fashion', 'Beauty',
        'Environment', 'Design', 'Innovation', 'Society', 'Economy', 'Marketing', 'Spirituality', 'Psychology', 'Travel', 'Parenting'
      ] // Example categories
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

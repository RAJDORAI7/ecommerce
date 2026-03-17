import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`.green.underline);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    // Try connecting to the provided local MongoDB URI
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/helpdesk';
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err: any) {
      console.log('Local MongoDB not found. Starting In-Memory MongoDB fallback...');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
      
      // Auto-seed data for the user if using in-memory so they have something to see
      const User = require('../models/User');
      const Ticket = require('../models/Ticket');
      const Comment = require('../models/Comment');
      
      const adminCount = await User.countDocuments();
      if (adminCount === 0) {
        const users = await User.create([
          { name: 'Admin User', email: 'admin@corp.com', password: 'password123', role: 'Admin' },
          { name: 'Agent Smith', email: 'agent@corp.com', password: 'password123', role: 'Agent' },
          { name: 'John Employee', email: 'john@corp.com', password: 'password123', role: 'Employee' }
        ]);
        const tickets = await Ticket.insertMany([
          { title: 'Laptop won\'t turn on', description: 'Screen remains black', priority: 'High', status: 'Open', createdBy: users[2]._id },
          { title: 'Need access to AWS', description: 'Please grant me S3 access', priority: 'Medium', status: 'In Progress', createdBy: users[2]._id, assignedTo: users[1]._id }
        ]);
        await Comment.create({ ticketId: tickets[1]._id, user: users[1]._id, text: 'Looking into this right now.' });
        console.log('In-Memory Database Seeded Automatically!');
      }
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
export {};

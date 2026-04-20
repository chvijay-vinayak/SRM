require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Ticket.deleteMany();
    await Comment.deleteMany();

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@corp.com', password: 'password123', role: 'Admin' },
      { name: 'Agent Smith', email: 'agent@corp.com', password: 'password123', role: 'Agent' },
      { name: 'John Employee', email: 'john@corp.com', password: 'password123', role: 'Employee' }
    ]);

    const tickets = await Ticket.insertMany([
      { title: 'Laptop won\'t turn on', description: 'Screen remains black', priority: 'High', status: 'Open', createdBy: users[2]._id },
      { title: 'Need access to AWS', description: 'Please grant me S3 access', priority: 'Medium', status: 'In Progress', createdBy: users[2]._id, assignedTo: users[1]._id }
    ]);

    await Comment.create({
      ticketId: tickets[1]._id,
      user: users[1]._id,
      text: 'Looking into this right now.'
    });

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

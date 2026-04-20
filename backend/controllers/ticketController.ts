const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

// Create a new ticket
const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets (Employee sees theirs, Admin/Agent sees all)
const getTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'Admin' || req.user.role === 'Agent') {
      tickets = await Ticket.find({}).populate('createdBy', 'name email').populate('assignedTo', 'name email').sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: req.user._id }).populate('createdBy', 'name email').populate('assignedTo', 'name email').sort({ createdAt: -1 });
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (ticket) {
      // Check permissions: if employee, must be creator
      if (req.user.role === 'Employee' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view this ticket' });
      }
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket (Status/Assignment)
const updateTicket = async (req, res) => {
  const { status, assignedTo, priority } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'Employee') {
      // Employees can only close their own tickets or change their priority (if allowed)
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      if (status === 'Closed') {
         ticket.status = status;
      }
    } else {
      // Admin / Agent updates
      if (req.user.role === 'Agent' && status === 'Closed') {
        return res.status(403).json({ message: 'Agents are not authorized to close tickets' });
      }
      if (status) ticket.status = status;
      if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;
      if (priority) ticket.priority = priority;
    }

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const comment = await Comment.create({
      ticketId: req.params.id,
      user: req.user._id,
      text,
    });
    
    const populatedComment = await Comment.findById(comment._id).populate('user', 'name role');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a ticket
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.id }).populate('user', 'name role').sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateTicket, addComment, getComments };

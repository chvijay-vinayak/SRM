const express = require('express');
const { createTicket, getTickets, getTicketById, updateTicket, addComment, getComments } = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createTicket)
  .get(protect, getTickets);

router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket);

router.route('/:id/comments')
  .post(protect, addComment)
  .get(protect, getComments);

module.exports = router;

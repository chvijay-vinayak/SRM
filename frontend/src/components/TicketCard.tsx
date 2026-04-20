import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Clock } from 'lucide-react';
import './TicketCard.css';

const TicketCard = ({ ticket, onClose }: { ticket: any, onClose?: (e: React.MouseEvent) => void }) => {
  return (
    <Link to={`/ticket/${ticket._id}`} className="card ticket-card">
      <div className="ticket-card-header">
        <h3 className="ticket-title">{ticket.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusBadge status={ticket.status} />
          {ticket.status !== 'Closed' && onClose && (
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose(e);
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
      
      <p className="ticket-desc">{ticket.description.substring(0, 100)}{ticket.description.length > 100 ? '...' : ''}</p>
      
      <div className="ticket-card-footer">
        <div className="ticket-meta">
          <span className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority} Priority</span>
          {ticket.createdBy && <span className="assigned-to">Raised by: {ticket.createdBy.name}</span>}
          {ticket.assignedTo && <span className="assigned-to">Assigned to: {ticket.assignedTo.name}</span>}
        </div>
        <div className="ticket-date">
          <Clock size={14} />
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;

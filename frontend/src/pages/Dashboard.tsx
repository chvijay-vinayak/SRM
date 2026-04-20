import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import TicketCard from '../components/TicketCard';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleCloseTicket = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.put(`/tickets/${id}`, { status: 'Closed' });
      setTickets(tickets.map(t => t._id === id ? { ...t, status: 'Closed' } : t));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'All' || t.status === filter);

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          >
            <option value="All">All Tickets</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No tickets found.</p>
        </div>
      ) : (
        <div className="tickets-grid" style={{ display: 'grid', gap: '1rem' }}>
          {filteredTickets.map(ticket => (
            <TicketCard 
              key={ticket._id} 
              ticket={ticket} 
              onClose={user?.role !== 'Agent' ? (e) => handleCloseTicket(e, ticket._id) : undefined} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

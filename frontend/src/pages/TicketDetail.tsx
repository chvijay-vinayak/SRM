import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { Clock, User } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]); // For assignment
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isStaff = user?.role === 'Admin' || user?.role === 'Agent';

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const [ticketRes, commentsRes] = await Promise.all([
          api.get(`/tickets/${id}`),
          api.get(`/tickets/${id}/comments`)
        ]);
        setTicket(ticketRes.data);
        setComments(commentsRes.data);

        if (isStaff) {
          const usersRes = await api.get('/users');
          setUsers(usersRes.data);
        }
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [id, navigate, isStaff]);

  const handleUpdateStatus = async (status) => {
    try {
      const res = await api.put(`/tickets/${id}`, { status });
      setTicket(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssign = async (assignedTo) => {
    try {
      const res = await api.put(`/tickets/${id}`, { assignedTo });
      setTicket(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/tickets/${id}/comments`, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div>
      <div className="header-actions">
        <h1>{ticket.title}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <StatusBadge status={ticket.status} />
          {user.role === 'Employee' && ticket.status !== 'Closed' && (
            <button className="btn btn-outline" onClick={() => handleUpdateStatus('Closed')}>Close Ticket</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{ticket.description}</p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Comments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {comments.map((comment) => (
                <div key={comment._id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {comment.user.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600' }}>{comment.user.name} <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>({comment.user.role})</span></span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No comments yet.</p>}
            </div>

            <form onSubmit={handleAddComment}>
              <div className="input-group">
                <textarea 
                  rows={3} 
                  placeholder="Type your comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Comment</button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Ticket Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Reported By</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} />
                  <span>{ticket.createdBy.name}</span>
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Created On</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} />
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Priority</span>
                <span className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
              </div>

              {isStaff ? (
                <>
                  <div className="input-group">
                    <label>Update Status</label>
                    <select value={ticket.status} onChange={(e) => handleUpdateStatus(e.target.value)}>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      {user?.role === 'Admin' && <option value="Closed">Closed</option>}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Assigned To</label>
                    <select 
                      value={ticket.assignedTo?._id || ''} 
                      onChange={(e) => handleAssign(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Assigned To</span>
                  <span>{ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

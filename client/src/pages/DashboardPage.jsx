import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import AppLayout from '../components/AppLayout.jsx';
import Modal from '../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const defaultStats = {
  totalLeads: 0,
  newLeads: 0,
  contactedLeads: 0,
  convertedLeads: 0
};

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));

const leadSources = ['Website', 'LinkedIn', 'Referral', 'Other'];
const statusOptions = ['', 'new', 'contacted', 'converted'];
const statusLabels = {
  '': 'All statuses',
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted'
};

const DashboardPage = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalLeads: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [detailLead, setDetailLead] = useState(null);
  const [notesLead, setNotesLead] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [deleteLead, setDeleteLead] = useState(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(page === 1 && !refreshing);
        const response = await api.get('/leads', {
          params: {
            search: searchQuery,
            status: statusFilter,
            sortBy,
            order: sortOrder,
            page,
            limit: 10
          }
        });

        setLeads(response.data.leads);
        setStats(response.data.stats || defaultStats);
        setPagination(response.data.pagination || { page: 1, totalPages: 1, totalLeads: 0, limit: 10 });
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load leads');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadLeads();
  }, [page, searchQuery, statusFilter, sortBy, sortOrder, refreshing]);

  const refreshLeads = () => {
    setRefreshing(true);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleFilterChange = (value) => {
    setPage(1);
    setStatusFilter(value);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder((currentOrder) => (currentOrder === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(field);
    setSortOrder(field === 'createdAt' ? 'desc' : 'asc');
  };

  const updateLead = async (leadId, payload, successMessage) => {
    try {
      await api.put(`/leads/${leadId}`, payload);
      toast.success(successMessage);
      refreshLeads();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update lead');
    }
  };

  const handleStatusUpdate = (leadId, status) => {
    updateLead(leadId, { status }, 'Lead status updated');
  };

  const openNotesModal = (lead) => {
    setNotesLead(lead);
    setNotesDraft(lead.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!notesLead) {
      return;
    }

    try {
      await api.put(`/leads/${notesLead._id}`, { notes: notesDraft });
      toast.success('Notes saved');
      setNotesLead(null);
      setNotesDraft('');
      refreshLeads();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save notes');
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteLead) {
      return;
    }

    try {
      await api.delete(`/leads/${deleteLead._id}`);
      toast.success('Lead deleted');
      setDeleteLead(null);
      refreshLeads();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete lead');
    }
  };

  return (
    <AppLayout
      title="Lead Dashboard"
      subtitle="Review incoming leads, update status, and keep every follow-up organized."
      actions={
        <div className="toolbar__badge">
          <span className="toolbar__badge-dot" />
          Live CRM workspace
        </div>
      }
    >
      <section className="stats-grid">
        <StatCard label="Total Leads" value={stats.totalLeads} tone="primary" description="All leads in the system" />
        <StatCard label="New Leads" value={stats.newLeads} tone="accent" description="Waiting for first contact" />
        <StatCard label="Contacted" value={stats.contactedLeads} tone="warning" description="Follow-up underway" />
        <StatCard label="Converted" value={stats.convertedLeads} tone="success" description="Won opportunities" />
      </section>

      <section className="glass-card panel-card">
        <div className="panel-card__header">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h2>Leads</h2>
          </div>
          <form className="toolbar" onSubmit={handleSearchSubmit}>
            <input
              className="input input--search"
              type="search"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <select className="input" value={statusFilter} onChange={(event) => handleFilterChange(event.target.value)}>
              {statusOptions.map((status) => (
                <option key={status || 'all'} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
            <button className="button button--secondary" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <button className="sort-button" type="button" onClick={() => handleSort('name')}>
                    Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  <button className="sort-button" type="button" onClick={() => handleSort('email')}>
                    Contact {sortBy === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  <button className="sort-button" type="button" onClick={() => handleSort('source')}>
                    Source {sortBy === 'source' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  <button className="sort-button" type="button" onClick={() => handleSort('status')}>
                    Status {sortBy === 'status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  <button className="sort-button" type="button" onClick={() => handleSort('createdAt')}>
                    Created {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="table-loading">
                      <Spinner label="Loading leads" />
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <h3>No leads yet</h3>
                      <p>When contact forms start sending data, the leads list will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <div className="lead-primary">
                        <strong>{lead.name}</strong>
                        <span>{lead.notes ? lead.notes.slice(0, 48) : 'No notes yet'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="lead-contact">
                        <span>{lead.email}</span>
                        <small>{lead.phone || 'No phone'}</small>
                      </div>
                    </td>
                    <td>{lead.source}</td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <select
                          className="input input--compact"
                          value={lead.status}
                          onChange={(event) => handleStatusUpdate(lead._id, event.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                        </select>
                        <button className="button button--ghost button--small" type="button" onClick={() => setDetailLead(lead)}>
                          View
                        </button>
                        <button className="button button--ghost button--small" type="button" onClick={() => openNotesModal(lead)}>
                          Notes
                        </button>
                        <button className="button button--danger button--small" type="button" onClick={() => setDeleteLead(lead)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {leads.length} of {pagination.totalLeads} leads
          </span>
          <div className="pagination__controls">
            <button className="button button--ghost button--small" type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span className="pagination__page">Page {pagination.page} of {pagination.totalPages}</span>
            <button
              className="button button--ghost button--small"
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {detailLead ? (
        <Modal
          title="Lead details"
          onClose={() => setDetailLead(null)}
          footer={
            <button className="button button--secondary" type="button" onClick={() => openNotesModal(detailLead)}>
              Add / edit notes
            </button>
          }
        >
          <div className="detail-grid">
            <div>
              <span className="detail-label">Name</span>
              <strong>{detailLead.name}</strong>
            </div>
            <div>
              <span className="detail-label">Email</span>
              <strong>{detailLead.email}</strong>
            </div>
            <div>
              <span className="detail-label">Phone</span>
              <strong>{detailLead.phone || 'Not provided'}</strong>
            </div>
            <div>
              <span className="detail-label">Source</span>
              <strong>{leadSources.includes(detailLead.source) ? detailLead.source : 'Other'}</strong>
            </div>
            <div>
              <span className="detail-label">Status</span>
              <StatusBadge status={detailLead.status} />
            </div>
            <div>
              <span className="detail-label">Created</span>
              <strong>{formatDate(detailLead.createdAt)}</strong>
            </div>
            <div className="detail-notes">
              <span className="detail-label">Notes</span>
              <p>{detailLead.notes || 'No notes added yet.'}</p>
            </div>
          </div>
        </Modal>
      ) : null}

      {notesLead ? (
        <Modal
          title="Edit notes"
          onClose={() => setNotesLead(null)}
          footer={
            <>
              <button className="button button--ghost" type="button" onClick={() => setNotesLead(null)}>
                Cancel
              </button>
              <button className="button button--primary" type="button" onClick={handleSaveNotes}>
                Save notes
              </button>
            </>
          }
        >
          <label className="modal-form-label">
            <span>Notes for {notesLead.name}</span>
            <textarea
              className="textarea"
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              placeholder="Add follow-up notes, call outcomes, reminders..."
              rows="6"
            />
          </label>
        </Modal>
      ) : null}

      {deleteLead ? (
        <Modal
          title="Confirm delete"
          onClose={() => setDeleteLead(null)}
          footer={
            <>
              <button className="button button--ghost" type="button" onClick={() => setDeleteLead(null)}>
                Cancel
              </button>
              <button className="button button--danger" type="button" onClick={handleDeleteLead}>
                Delete lead
              </button>
            </>
          }
        >
          <p>
            This will permanently delete <strong>{deleteLead.name}</strong> and cannot be undone.
          </p>
        </Modal>
      ) : null}
    </AppLayout>
  );
};

export default DashboardPage;

const Lead = require('../models/Lead');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildLeadFilter = (query) => {
  const filter = {};

  if (query.status && ['new', 'contacted', 'converted'].includes(query.status)) {
    filter.status = query.status;
  }

  if (query.search) {
    const safeSearch = escapeRegex(query.search.trim());
    filter.$or = [
      { name: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  return filter;
};

const normalizeLeadPayload = (body) => ({
  name: body.name?.trim(),
  email: body.email?.trim().toLowerCase(),
  phone: body.phone?.trim() || '',
  source: body.source || 'Website',
  status: body.status || 'new',
  notes: body.notes?.trim() || ''
});

const createLead = async (req, res) => {
  const payload = normalizeLeadPayload(req.body);
  const lead = await Lead.create(payload);
  res.status(201).json({ message: 'Lead created successfully', lead });
};

const getLeads = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const sortBy = ['name', 'email', 'source', 'status', 'createdAt'].includes(req.query.sortBy)
    ? req.query.sortBy
    : 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;
  const filter = buildLeadFilter(req.query);

  const [totalLeads, newLeads, contactedLeads, convertedLeads, leads] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Lead.countDocuments({ status: 'contacted' }),
    Lead.countDocuments({ status: 'converted' }),
    Lead.find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
  ]);

  res.json({
    leads,
    stats: {
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads
    },
    pagination: {
      page,
      limit,
      totalLeads,
      totalPages: Math.max(Math.ceil(totalLeads / limit), 1)
    }
  });
};

const updateLead = async (req, res) => {
  const payload = {};
  const fields = ['name', 'email', 'phone', 'source', 'status', 'notes'];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      payload[field] = field === 'email' ? req.body[field].trim().toLowerCase() : req.body[field].trim?.() ?? req.body[field];
    }
  });

  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!updatedLead) {
    return res.status(404).json({ message: 'Lead not found' });
  }

  res.json({ message: 'Lead updated successfully', lead: updatedLead });
};

const deleteLead = async (req, res) => {
  const deletedLead = await Lead.findByIdAndDelete(req.params.id);

  if (!deletedLead) {
    return res.status(404).json({ message: 'Lead not found' });
  }

  res.json({ message: 'Lead deleted successfully' });
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead
};

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchLeadById, updateLead } from "../../store/slices/leadsSlice";
import {
  fetchActivities,
  createActivity,
} from "../../store/slices/activitiesSlice";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import ActivityTimeline from "../../components/Activities/ActivityTimeline";
import { format } from "date-fns";

const LeadDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentLead, loading } = useSelector((state) => state.leads);
  const { activities } = useSelector((state) => state.activities);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activityForm, setActivityForm] = useState({
    type: "note",
    title: "",
    description: "",
    scheduledDate: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
      dispatch(fetchActivities(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentLead) {
      setFormData({
        name: currentLead.name || "",
        email: currentLead.email || "",
        phone: currentLead.phone || "",
        company: currentLead.company || "",
        source: currentLead.source || "website",
        status: currentLead.status || "new",
        value: currentLead.value || "",
        notes: currentLead.notes || "",
      });
    }
  }, [currentLead]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateLead({ id, data: formData })).unwrap();
      toast.success("Lead updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update lead");
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        createActivity({
          lead: id,
          ...activityForm,
        })
      ).unwrap();
      toast.success("Activity added successfully!");
      setActivityForm({
        type: "note",
        title: "",
        description: "",
        scheduledDate: "",
      });
      dispatch(fetchActivities(id));
    } catch (error) {
      toast.error(error || "Failed to create activity");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: "New", class: "badge-info" },
      contacted: { label: "Contacted", class: "badge-warning" },
      qualified: { label: "Qualified", class: "badge-info" },
      proposal: { label: "Proposal", class: "badge-warning" },
      negotiation: { label: "Negotiation", class: "badge-warning" },
      won: { label: "Won", class: "badge-success" },
      lost: { label: "Lost", class: "badge-danger" },
    };

    const config = statusConfig[status] || {
      label: status,
      class: "badge-info",
    };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentLead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
        <Link
          to="/leads"
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
        >
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/leads" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Lead" : currentLead.name}
          </h1>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiEdit />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="card">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="input"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="input"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      className="input"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select
                      name="source"
                      className="input"
                      value={formData.source}
                      onChange={handleChange}
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social_media">Social Media</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      className="input"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value ($)
                    </label>
                    <input
                      type="number"
                      name="value"
                      className="input"
                      value={formData.value}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="4"
                    className="input"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Lead Information</h2>
                  {getStatusBadge(currentLead.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{currentLead.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {currentLead.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiBriefcase className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="text-gray-900">
                        {currentLead.company || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiDollarSign className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="text-gray-900">
                        $
                        {currentLead.value
                          ? parseFloat(currentLead.value).toLocaleString()
                          : "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {currentLead.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </p>
                    <p className="text-gray-600">{currentLead.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {currentLead.createdAt
                      ? format(new Date(currentLead.createdAt), "PPpp")
                      : "N/A"}
                  </p>
                  {currentLead.owner && (
                    <p className="text-sm text-gray-500 mt-1">
                      Owner: {currentLead.owner.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <ActivityTimeline activities={activities} leadId={id} />
        </div>

        {/* Add Activity Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add Activity</h2>
            <form onSubmit={handleActivitySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="input"
                  value={activityForm.type}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, type: e.target.value })
                  }
                >
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="email">Email</option>
                  <option value="task">Task</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="input"
                  value={activityForm.title}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="input"
                  value={activityForm.description}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {(activityForm.type === "meeting" ||
                activityForm.type === "task") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={activityForm.scheduledDate}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                Add Activity
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;

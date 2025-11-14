import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createLead } from "../../store/slices/leadsSlice";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const CreateLead = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.leads);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website",
    status: "new",
    value: "",
    notes: "",
    owner: user?._id || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createLead(formData)).unwrap();
      toast.success("Lead created successfully!");
      navigate("/leads");
    } catch (error) {
      toast.error(error || "Failed to create lead");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/leads" className="text-gray-600 hover:text-gray-900">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Lead</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="input"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Source
              </label>
              <select
                id="source"
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
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
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
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Value ($)
              </label>
              <input
                type="number"
                id="value"
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
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              className="input"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Link to="/leads" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLead;



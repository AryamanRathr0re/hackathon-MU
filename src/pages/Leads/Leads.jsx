import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchLeads, deleteLead } from "../../store/slices/leadsSlice";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { format } from "date-fns";

const Leads = () => {
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.leads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await dispatch(deleteLead(id)).unwrap();
        toast.success("Lead deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete lead");
      }
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

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <Link
          to="/leads/new"
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Create Lead</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lead.owner?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.createdAt
                      ? format(new Date(lead.createdAt), "MMM dd, yyyy")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/leads/${lead._id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="View"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/leads/${lead._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;



import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../store/slices/dashboardSlice";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    stats,
    leadStatusDistribution,
    leadSourceDistribution,
    monthlyTrends,
    loading,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: FiUsers,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Active Leads",
      value: stats.activeLeads,
      icon: FiActivity,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Converted",
      value: stats.convertedLeads,
      icon: FiCheckCircle,
      color: "bg-purple-500",
      change: "+5%",
    },
    {
      title: "Activities",
      value: stats.totalActivities,
      icon: FiTrendingUp,
      color: "bg-orange-500",
      change: "+15%",
    },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/leads/new"
          className="btn btn-primary flex items-center space-x-2"
        >
          <span>Create Lead</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Lead Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadStatusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadStatusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Source Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Lead Source Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadSourceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Leads"
            />
            <Line
              type="monotone"
              dataKey="converted"
              stroke="#10b981"
              strokeWidth={2}
              name="Converted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;



import { Link, useLocation } from "react-router-dom";
import { FiLayout, FiUsers, FiPlusCircle, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import clsx from "clsx";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiLayout,
      roles: ["admin", "manager", "sales_executive"],
    },
    {
      name: "Leads",
      path: "/leads",
      icon: FiUsers,
      roles: ["admin", "manager", "sales_executive"],
    },
    {
      name: "Create Lead",
      path: "/leads/new",
      icon: FiPlusCircle,
      roles: ["admin", "manager", "sales_executive"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: FiSettings,
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

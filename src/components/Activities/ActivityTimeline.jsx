import {
  FiFileText,
  FiPhone,
  FiCalendar,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import { format } from "date-fns";
import clsx from "clsx";

const ActivityTimeline = ({ activities, leadId }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "note":
        return FiFileText;
      case "call":
        return FiPhone;
      case "meeting":
        return FiCalendar;
      case "email":
        return FiMail;
      case "task":
        return FiCheckCircle;
      default:
        return FiFileText;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "note":
        return "bg-blue-100 text-blue-600";
      case "call":
        return "bg-green-100 text-green-600";
      case "meeting":
        return "bg-purple-100 text-purple-600";
      case "email":
        return "bg-yellow-100 text-yellow-600";
      case "task":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case "note":
        return "Note";
      case "call":
        return "Call";
      case "meeting":
        return "Meeting";
      case "email":
        return "Email";
      case "task":
        return "Task";
      default:
        return type;
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activities yet. Add an activity to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const isLast = index === activities.length - 1;

            return (
              <div
                key={activity._id || index}
                className="relative flex space-x-4"
              >
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                )}

                {/* Icon */}
                <div
                  className={clsx(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    getActivityColor(activity.type)
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </span>
                      <span
                        className={clsx(
                          "badge text-xs",
                          getActivityColor(activity.type)
                        )}
                      >
                        {getActivityLabel(activity.type)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {activity.createdAt
                        ? format(
                            new Date(activity.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )
                        : "N/A"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>

                  {activity.scheduledDate && (
                    <p className="text-xs text-gray-500">
                      Scheduled:{" "}
                      {format(new Date(activity.scheduledDate), "PPpp")}
                    </p>
                  )}

                  {activity.createdBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      By: {activity.createdBy.name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;

const ApplicationStatus = {
  Apply: "apply",
  Assigned: "assigned",
  Started: "started",
  Submitted: "submitted",
  WorkDone: "workDone",
  Cancelled: "cancelled",
};

const ChildBountyStatus = {
  Open: "open",
  Apply: "apply",
  Assigned: "assigned",
  Started: "started",
  Submitted: "submitted",
  WorkDone: "workDone",
  Awarded: "awarded",
};

const NotificationType = {
  Applied: "applied",
  Assigned: "assigned",
  Unassigned: "unassigned",
  Cancelled: "cancelled",
  Accepted: "accepted",
  Submitted: "submitted",
  Reply: "reply",
  Mention: "mention",
};

module.exports = {
  ApplicationStatus,
  ChildBountyStatus,
  NotificationType,
};

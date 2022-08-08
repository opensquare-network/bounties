const ApplicationStatus = {
  Apply: "apply",
  Assigned: "assigned",
  Started: "started",
  Submitted: "submitted",
  Canceled: "canceled",
};

const ChildBountyStatus = {
  Open: "open",
  Assigned: "assigned",
  Awarded: "awarded",
  Closed: "closed",
};

const BountyStatus = {
  Open: "open",
  Closed: "closed",
};

const NotificationType = {
  Applied: "applied",
  Assigned: "assigned",
  Unassigned: "unassigned",
  Canceled: "canceled",
  Accepted: "accepted",
  Submitted: "submitted",
  Reply: "reply",
  Mention: "mention",
};

module.exports = {
  ApplicationStatus,
  ChildBountyStatus,
  BountyStatus,
  NotificationType,
};

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
  ChildBountyResolved: "childBountyResolved",
  ChildBountyClosed: "childBountyClosed",
  ChildBountyReopen: "childBountyReopen",
};

const ApplicationActions = {
  ApplyChildBounty: "applyChildBounty",
  CancelApplication: "cancelApplication",
  AssignApplication: "assignApplication",
  UnassignApplication: "unassignApplication",
  AcceptAssignment: "acceptAssignment",
  SubmitWork: "submitWork",
};

const ChildBountyActions = {
  ImportChildBounty: "importChildBounty",
  CloseChildBounty: "closeChildBounty",
  ReopenChildBounty: "reopenChildBounty",
  ResolveChildBounty: "resolveChildBounty",
  EditChildBounty: "editChildBounty",
};

const BountyActions = {
  ImportBounty: "importBounty",
  CloseBounty: "closeBounty",
  ReopenBounty: "reopenBounty",
  EditBounty: "editBounty",
};

module.exports = {
  ApplicationStatus,
  ChildBountyStatus,
  BountyStatus,
  NotificationType,
  ApplicationActions,
  ChildBountyActions,
  BountyActions,
};

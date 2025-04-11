import { host } from "../globalRoutes";

export const fetchProjectsRoute = `${host}/research_procedures/api/get-projects/`;
export const fetchUsernameRoute = `${host}/research_procedures/api/get-user/`;
export const projectFormSubmissionRoute = `${host}/research_procedures/api/add-project/`;
export const projectRegisterCommencementRoute = `${host}/research_procedures/api/register-commence-project/`;
export const staffDocumentUploadRoute = `${host}/research_procedures/api/staff-document-upload/`;
export const staffSelectionReportRoute = `${host}/research_procedures/api/staff-selection-report/`;
export const expenditureFormSubmissionRoute = (
  role,
  rspc_admin,
  rspc_admin_designation,
) =>
  `${host}/research_procedures/api/create-expenditure/?u_d=${role}&r=${rspc_admin}&r_d=${rspc_admin_designation}`;
export const advertisementAndCommitteeApprovalFormSubmissionRoute = `${host}/research_procedures/api/add-ad-committee/`;
export const staffFormSubmissionRoute = (
  role,
  rspc_admin,
  rspc_admin_designation,
) =>
  `${host}/research_procedures/api/create-staff/?u_d=${role}&r=${rspc_admin}&r_d=${rspc_admin_designation}`;
export const fetchPIDsRoute = (role) =>
  `${host}/research_procedures/api/get-PIDs/?role=${role}`;
export const fetchProfIDsRoute = `${host}/research_procedures/api/get-profIDs/`;
export const fetchExpenditureRequestsRoute = (pid) =>
  `${host}/research_procedures/api/get-expenditure/?pid=${pid}`;
// export const fetchCoPIsRoute = (pid) =>
// `${host}/research_procedures/api/get-copis/?pid=${pid}`;
export const fetchBudgetRoute = (pid) =>
  `${host}/research_procedures/api/get-budget/?pid=${pid}`;
export const fetchStaffPositionsRoute = (pid) =>
  `${host}/research_procedures/api/get-staff-positions/?pid=${pid}`;
export const fetchStaffRoute = `${host}/research_procedures/api/get-staff/`;
export const committeeActionRoute = `${host}/research_procedures/api/committee-action/`;
export const staffDecisionRoute = `${host}/research_procedures/api/staff-decision/`;
export const projectDecisionRoute = `${host}/research_procedures/api/project-decision/`;
export const fetchInboxRoute = (username, designation) =>
  `${host}/research_procedures/api/get-inbox/?username=${username}&designation=${designation}`;
export const fetchProcessedRoute = (username, designation) =>
  `${host}/research_procedures/api/get-processed/?username=${username}&designation=${designation}`;
export const fetchFileRoute = (fileID) =>
  `${host}/research_procedures/api/get-file/?file_id=${fileID}`;
export const forwardFileRoute = `${host}/research_procedures/api/forward-file/`;
export const fetchFileTrackingHistoryRoute = (fileID) =>
  `${host}/research_procedures/api/get-history/?file_id=${fileID}`;
export const rejectFileRoute = (fileID) =>
  `${host}/research_procedures/api/reject-file/?file_id=${fileID}`;
export const approveFileRoute = (fileID) =>
  `${host}/research_procedures/api/approve-file/?file_id=${fileID}`;
export const projectClosureRoute = `${host}/research_procedures/api/project-closure/`;
export const acceptProjectCompletionRoute = (pid) =>
  `${host}/research_procedures/api/accept-completion/?pid=${pid}`;

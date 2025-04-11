import CreateRequest from "../components/CreateRequestForm";
import FinalBillRequest from "../components/FinalBillRequest";
import ManageBudget from "../components/ManageBudget";
import ViewBudget from "../components/ViewBudget";
import RequestsStatus from "../components/RequestsStatus";

const RoleBasedFilter = ({ setActiveTab }) => {
  const tabItems = [
    { title: "Requests", component: <RequestsStatus /> },
    {
      title: "Create Request",
      component: <CreateRequest setActiveTab={setActiveTab} />,
    },
    { title: "Generate Final Bill", component: <FinalBillRequest /> },
    { title: "Manage Budget", component: <ManageBudget /> },
    { title: "View Budget", component: <ViewBudget /> },
  ];
  const roleBasedTabs = {
    Director: tabItems.filter((tab) =>
      ["Requests", "Create Request", "View Budget"].includes(tab.title),
    ),
    "Dean (P&D)": tabItems.filter((tab) =>
      ["Requests", "Create Request"].includes(tab.title),
    ),
    Auditor: tabItems.filter((tab) =>
      ["Requests", "View Budget"].includes(tab.title),
    ),
    SectionHead_IWD: tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    Professor: tabItems.filter((tab) =>
      ["Requests", "Create Request"].includes(tab.title),
    ),
    EE: tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    "Executive Engineer (Civil)": tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    Civil_AE: tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    Civil_JE: tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    Electrical_JE: tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    Electrical_AE: tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    "Junior Engineer": tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
    "Admin IWD": tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget"].includes(tab.title),
    ),
    "Accounts Admin": tabItems.filter((tab) =>
      ["Requests", "Create Request", "Manage Budget", "View Budget"].includes(
        tab.title,
      ),
    ),
  };
  return { roleBasedTabs, tabItems };
};

export default RoleBasedFilter;

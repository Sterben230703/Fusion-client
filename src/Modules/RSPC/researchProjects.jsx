import axios from "axios";
import {
  SortAscending,
  CaretCircleLeft,
  CaretCircleRight,
} from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import { Tabs, Button, Flex, Select, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import classes from "./styles/researchProjectsStyle.module.css";
import CustomBreadcrumbs from "../../components/Breadcrumbs.jsx";
import ProjectTable from "./components/tables/projectTable.jsx";
// import RequestTable from "./components/tables/requestTable.jsx";
// import InboxTable from "./components/tables/inboxTable.jsx";
// import ProcessedTable from "./components/tables/processedTable.jsx";
import ProjectAdditionForm from "./components/forms/projectAdditionForm.jsx";
import Notifications from "./components/notifications.jsx";
import {
  fetchProjectsRoute,
  fetchPIDsRoute,
} from "../../routes/RSPCRoutes/index.jsx";
import StaffTable from "./components/tables/staffTable.jsx";
import Appendix from "./components/forms/appendix.jsx";

const categories = ["Most Recent", "Ongoing", "Completed", "Terminated"];

function ResearchProjects() {
  const role = useSelector((state) => state.user.role);
  const [PIDs, setPIDs] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const tabsListRef = useRef(null);

  useEffect(() => {
    const fetchPIDs = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(fetchPIDsRoute(role), {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log("Fetched PIDs:", response.data);
        setPIDs(response.data);
      } catch (error) {
        console.error("Error during Axios GET:", error);
      }
    };
    fetchPIDs();
  }, [role]);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      if (PIDs.length === 0) return;

      try {
        const response = await axios.get(fetchProjectsRoute, {
          params: { "pids[]": PIDs },
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials if necessary
        });
        console.log("Fetched Projects:", response.data);
        setProjectsData(response.data); // Store the fetched projects data
      } catch (error) {
        console.error("Error during Axios GET:", error);
      }
    };
    fetchProjects();
  }, [PIDs]);

  const tabItems = [
    { title: "Notifications", component: <Notifications /> },
    {
      title: "Projects",
      component: (
        <ProjectTable setActiveTab={setActiveTab} projectsData={projectsData} />
      ),
    },
    {
      title: "Personnel",
      component: <StaffTable setActiveTab={setActiveTab} />,
    },
  ];
  if (role.includes("Professor")) {
    tabItems.push({
      title: "Add Project",
      component: <ProjectAdditionForm setActiveTab={setActiveTab} />,
    });
    // tabItems.push({
    //   title: "Requests",
    //   component: <RequestTable username={username} />,
    // });
  }
  tabItems.push({
    title: "Form Appendix",
    component: <Appendix />,
  });
  // else {
  //   tabItems.push({
  //     title: "Inbox",
  //     component: <InboxTable username={username} setActiveTab={setActiveTab} />,
  //   });
  // }
  // if (!role.includes("Professor")) {
  //   tabItems.push({
  //     title: "Processed Requests",
  //     component: <ProcessedTable username={username} />,
  //   });
  // }

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  // const notificationsToDisplay =
  //   activeTab === "1" ? announcementsList : notificationsList;

  return (
    <>
      <CustomBreadcrumbs />
      <Flex justify="space-between" align="center" mt="lg">
        <Flex
          justify="flex-start"
          align="center"
          gap={{ base: "0.5rem", md: "1rem" }}
          mt={{ base: "1rem", md: "1.5rem" }}
          ml={{ md: "lg" }}
        >
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>

          <div className={classes.fusionTabsContainer} ref={tabsListRef}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    value={`${index}`}
                    key={index}
                    className={
                      activeTab === `${index}`
                        ? classes.fusionActiveRecentTab
                        : ""
                    }
                  >
                    <Flex gap="4px">
                      <Text>{item.title}</Text>
                    </Flex>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          <Button
            onClick={() => handleTabChange("next")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex>
        <Flex align="center" mt="md" rowGap="1rem" columnGap="4rem" wrap="wrap">
          <Select
            classNames={{
              option: classes.selectoptions,
              input: classes.selectinputs,
            }}
            variant="filled"
            leftSection={<SortAscending />}
            data={categories}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Sort By"
          />
        </Flex>
      </Flex>

      {tabItems[parseInt(activeTab, 10)]?.component}
    </>
  );
}

export default ResearchProjects;

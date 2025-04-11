import {
  SortAscending,
  CaretCircleLeft,
  CaretCircleRight,
} from "@phosphor-icons/react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Tabs, Button, Flex, Select, Text } from "@mantine/core";
import { useLocation } from "react-router-dom";
import classes from "./styles/researchProjectsStyle.module.css";
import CustomRSPCBreadcrumbs from "./components/RSPCBreadcrumbs.jsx";
import JoiningReportAndIDCardForm from "./components/forms/joiningReportAndIDCardForm.jsx";
import AdvertisementAndCommitteeApprovalForm from "./components/forms/advertisementAndCommitteeApprovalForm.jsx";
// import ExpenditureForm from "./components/forms/expenditureForm.jsx";
import SelectionCommitteeReportForm from "./components/forms/selectionCommitteeReportForm.jsx";
import ProjectClosureForm from "./components/forms/projectClosureForm.jsx";
import ProjectRegisterForm from "./components/forms/projectRegisterForm.jsx";
import Notifications from "./components/notifications.jsx";
import Appendix from "./components/forms/appendix.jsx";
import ProjectCommencementForm from "./components/forms/projectCommencementForm.jsx";

const categories = ["Most Recent", "Ongoing", "Completed", "Terminated"];

function RequestForms() {
  const role = useSelector((state) => state.user.role);
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const tabsListRef = useRef(null);
  const location = useLocation();
  const { data, initialTab } = location.state || {};
  const [activeTab, setActiveTab] = useState(initialTab || "1");

  const tabItems = [{ title: "Notifications", component: <Notifications /> }];
  if (role.includes("Professor")) {
    tabItems.push(
      {
        title: "Project Registration",
        component: <ProjectRegisterForm projectData={data} />,
      },
      {
        title: "Advertisement And Committee Approval",
        component: <AdvertisementAndCommitteeApprovalForm projectData={data} />,
      },
      {
        title: "Selection Committee Report",
        component: <SelectionCommitteeReportForm staffData={data} />,
      },
      {
        title: "Joining Report And ID Card",
        component: <JoiningReportAndIDCardForm staffData={data} />,
      },
      // {
      //   title: "Expenditure",
      //   component: <ExpenditureForm projectData={data} />,
      // },
      {
        title: "UC/SE And Project Closure",
        component: <ProjectClosureForm projectData={data} />,
      },
    );
  } else if (role.includes("SectionHead_RSPC")) {
    tabItems.push({
      title: "Project Commencement And First Funding",
      component: <ProjectCommencementForm projectData={data} />,
    });
  }
  tabItems.push({
    title: "Form Appendix",
    component: <Appendix />,
  });

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
      <CustomRSPCBreadcrumbs />
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
      {tabItems[parseInt(activeTab, 10)].component}
    </>
  );
}

export default RequestForms;

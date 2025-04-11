import React, { useState, useRef } from "react";
import { Text, Button, Flex, Tabs } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

// Import your section components
import InventoryDashboard from "./inventoryDashboard";
import HostelInventory from "./HostelInventory";
import Reports from "./Reports";
import Department from "./Bdes";
import InventoryRequests from "./InventoryRequests";

const sectionComponents = {
  "Overall Inventory": InventoryDashboard,
  Section: HostelInventory,
  Reports,
  Department,
  Requests: InventoryRequests,
};

export default function SectionNavigation() {
  const [activeSection, setActiveSection] = useState("Overall Inventory");
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null); // Reference for scrollable tabs
  const role = useSelector((state) => state.user.role);

  // Define sections based on role
  const sections =
    role === "ps_admin"
      ? ["Overall Inventory", "Section", "Department", "Requests", "Reports"]
      : role === "deptadmin_ece" || role === "Junior Technician"
        ? ["Department"]
        : role === "deptadmin_cse"
          ? ["Department"]
          : role === "deptadmin_me"
            ? ["Department"]
            : role === "deptadmin_sm"
              ? ["Department"]
              : role === "deptadmin_design"
                ? ["Department"]
                : role === "Hostel_admin" || role === "hall1caretaker"
                  ? ["Section"] // Role "hall1caretaker" shows "h1"
                  : role === "hall3caretaker"
                    ? ["Section"] // Role "hall3caretaker" shows "h3"
                    : role === "hall4caretaker"
                      ? ["Section"] // Role "hall4caretaker" shows "h4"
                      : role === "phcaretaker"
                        ? ["Section"] // Role "phcaretaker" shows "panini"
                        : role === "nhcaretaker"
                          ? ["Section"] // Role "nhcaretaker" shows "nagarjuna"
                          : role === "mshcaretaker"
                            ? ["Section"] // Role "mshcaretaker" shows "maa saraswati"
                            : role === "rspc_admin"
                              ? ["Section"] // Role "rspc_admin" shows "rspc"
                              : role === "SectionHead_IWD"
                                ? ["Section"] // Role "SectionHead_IWD" shows "iwd"
                                : role === "acadadmin"
                                  ? ["Section"] // Role "acadadmin" shows "academic"
                                  : role === "VhCaretaker"
                                    ? ["Section"] // Role "VhCaretaker" shows "vh"
                                    : [];

  const tabItems = sections.map((section) => ({ title: section }));

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
    setActiveSection(sections[+tabIndex]); // Ensure the active section is correctly updated
  };

  const handleArrowClick = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    setActiveSection(sections[newIndex]); // Update active section for arrow navigation

    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: direction === "next" ? 50 : -50,
        behavior: "smooth",
      });
    }
  };

  const navi = (sec, id) => {
    setActiveTab(String(id));
    setActiveSection(sec);
  };

  const ActiveComponent = sectionComponents[activeSection];

  if (role === "unauthorized") {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text color="red" size="lg">
          Unauthorized Access
        </Text>
      </Flex>
    );
  }

  if (sections.length === 0) {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text color="red" size="lg">
          You do not have permission to access this page.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center" mt="lg">
        <Flex justify="flex-start" align="center" gap="1rem" mt="1rem" ml="lg">
          <Button
            onClick={() => handleArrowClick("prev")}
            variant="default"
            style={{ border: "none", padding: 0 }}
          >
            <CaretCircleLeft size={20} />
          </Button>

          <div
            ref={tabsListRef}
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            <Tabs value={activeTab} onTabChange={handleTabChange}>
              <Tabs.List>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    key={index}
                    value={`${index}`}
                    onClick={() => navi(item.title, index)}
                    style={{
                      color: activeTab === `${index}` ? "#4299E1" : "",
                      backgroundColor:
                        activeTab === `${index}` ? "#15abff13" : "",
                    }}
                  >
                    <Text>{item.title}</Text>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          <Button
            onClick={() => handleArrowClick("next")}
            variant="default"
            style={{ border: "none", padding: 0 }}
          >
            <CaretCircleRight size={20} />
          </Button>
        </Flex>
      </Flex>

      <div style={{ marginTop: "2rem" }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </>
  );
}

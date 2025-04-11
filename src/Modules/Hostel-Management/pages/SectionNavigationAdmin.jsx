import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Group, Text, Box, Container, ScrollArea } from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { setActiveTab_, setCurrentModule } from "../../../redux/moduleslice";
import NoticeBoard from "./all-actors/NoticeBoard";
import ViewHostel from "./hostel-admin/ViewHostel";
import AddHostel from "./hostel-admin/AddHostel";
import AssignWarden from "./hostel-admin/AssignWarden";
import AssignBatch from "./hostel-admin/AssignBatch";
import AssignCaretaker from "./hostel-admin/AssignCaretaker";

const sections = [
  "Notice Board",
  "View Hostel",
  "Manage Caretakers",
  "Manage Warden",
  "Manage Hostel",
  "Add Hostel",
];

const components = {
  "Notice Board": NoticeBoard,
  "View Hostel": ViewHostel,
  "Manage Hostel": AssignBatch,
  "Manage Warden": AssignWarden,
  "Manage Caretakers": AssignCaretaker,
  "Add Hostel": AddHostel,
};

export default function SectionNavigationAdmin() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.module.active_tab);

  useEffect(() => {
    dispatch(setCurrentModule("Hostel"));
    dispatch(setActiveTab_("Notice Board"));
  }, [dispatch]);

  const handleSectionClick = (section) => {
    dispatch(setActiveTab_(section));
  };

  const ActiveComponent = components[activeTab] || NoticeBoard;

  return (
    <Container size="xl" p="xs" className="mx-0" style={{ maxWidth: "100%" }}>
      <ScrollArea>
        <Group spacing="xs" style={{ padding: "8px 0" }}>
          <CaretLeft size={20} weight="bold" color="#718096" />
          {sections.map((section, index) => (
            <React.Fragment key={section}>
              <Text
                size="lg"
                color={activeTab === section ? "#4299E1" : "#718096"}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  textDecoration: activeTab === section ? "underline" : "none",
                  textDecorationColor:
                    activeTab === section ? "#4299E1" : "transparent",
                  textDecorationThickness: "4px",
                  textUnderlineOffset: "10px",
                }}
                onClick={() => handleSectionClick(section)}
              >
                {section}
              </Text>
              {index < sections.length - 1 && (
                <Text color="#CBD5E0" size="sm">
                  |
                </Text>
              )}
            </React.Fragment>
          ))}
          <CaretRight size={20} weight="bold" color="#718096" />
        </Group>
      </ScrollArea>
      <Box
        mt="md"
        style={{
          width: "100%",
          height: "calc(85vh - 56px)",
          overflowY: "auto",
        }}
      >
        <ActiveComponent />
      </Box>
    </Container>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Group, Text, Box, Container, ScrollArea } from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { setActiveTab_, setCurrentModule } from "../../../redux/moduleslice";
import ManageLeaveRequest from "./caretaker/ManageLeaverequest";
import ManageGuestRoomRequest from "./caretaker/ManageGuestRoom";
import NoticeBoardWardenCaretaker from "./all-actors/NoticeBoardWardenCaretaker";
import ImposeFine from "./caretaker/ImposeFine";
import ManageFine from "./caretaker/ManageFine";
import StudentInfo from "./caretaker/StudentInfo";
import UploadAttendance from "./caretaker/UploadAttendance";

const sections = [
  "Notice Board",
  "Manage Leave Request",
  "Fine",
  "Student Allotment",
  "Upload Attendance",
];
const subSections = {
  Fine: ["Impose Fines", "Manage Imposed Fines"],
};

const components = {
  "Notice Board": NoticeBoardWardenCaretaker,
  "Manage Leave Request": ManageLeaveRequest,
  "Manage Guest Room Request": ManageGuestRoomRequest,
  "Fine_Impose Fines": ImposeFine,
  "Fine_Manage Imposed Fines": ManageFine,
  "Student Allotment": StudentInfo,
  "Upload Attendance": UploadAttendance,
};

export default function SectionNavigationCaretaker() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.module.active_tab);
  const [activeSubSection, setActiveSubSection] = useState(null);

  useEffect(() => {
    dispatch(setCurrentModule("Hostel"));
    dispatch(setActiveTab_("Notice Board"));
  }, [dispatch]);

  useEffect(() => {
    if (subSections[activeTab]) {
      setActiveSubSection(subSections[activeTab][0]);
    } else {
      setActiveSubSection(null);
    }
  }, [activeTab]);

  const getComponentKey = () => {
    if (activeSubSection) {
      return `${activeTab}_${activeSubSection}`;
    }
    return activeTab;
  };

  const ActiveComponent =
    components[getComponentKey()] || NoticeBoardWardenCaretaker;

  const handleSectionClick = (section) => {
    dispatch(setActiveTab_(section));
  };

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
      {subSections[activeTab] && (
        <ScrollArea>
          <Group spacing="xs" mt="xs">
            {subSections[activeTab].map((subSection, index) => (
              <React.Fragment key={subSection}>
                <Text
                  size="sm"
                  color={
                    activeSubSection === subSection ? "#4299E1" : "#718096"
                  }
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  onClick={() => setActiveSubSection(subSection)}
                >
                  {subSection}
                </Text>
                {index < subSections[activeTab].length - 1 && (
                  <Text color="#CBD5E0" size="sm">
                    |
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Group>
        </ScrollArea>
      )}
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

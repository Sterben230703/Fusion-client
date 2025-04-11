import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Group, Text, Box, Container, ScrollArea } from "@mantine/core";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { setActiveTab_, setCurrentModule } from "../../../redux/moduleslice";
import NoticeBoard from "./all-actors/NoticeBoard";
import Complaints from "./students/Complaints";
import GuestRoomBooking from "./students/GuestRoomBooking";
import GuestRoomStatus from "./students/GuestRoomStatus";
import LeaveForm from "./students/LeaveForm";
import LeaveStatus from "./students/LeaveStatus";
import Fine from "./students/Fine";
import AllotedRooms from "./students/AllotedRooms";
import ViewAttendance from "./students/ViewAttendance";

const sections = [
  "Notice Board",
  "My Fine",
  "Leave",
  "Alloted rooms",
  "My Attendance",
];

const subSections = {
  Leave: ["Leave Form", "Leave Status"],
  "Guest Room": ["Book Guest Room", "Booking Status"],
};

const components = {
  "Notice Board": NoticeBoard,
  Complaint: Complaints,
  "Guest Room_Book Guest Room": GuestRoomBooking,
  "Guest Room_Booking Status": GuestRoomStatus,
  "Leave_Leave Form": LeaveForm,
  "Leave_Leave Status": LeaveStatus,
  "My Fine": Fine,
  "Alloted rooms": AllotedRooms,
  "My Attendance": ViewAttendance,
};

export default function SectionNavigationStudent() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.module.active_tab);
  const [activeSubSection, setActiveSubSection] = useState(null);
  const scrollRef = useRef(null);

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

  const ActiveComponent = components[getComponentKey()] || NoticeBoard;

  const handleSectionClick = (section) => {
    dispatch(setActiveTab_(section));
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200; // Adjust this value to control scroll distance
      scrollRef.current.scrollTo({
        left:
          scrollRef.current.scrollLeft +
          (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
    }
  };

  return (
    <Container size="xl" p="xs" className="mx-0" style={{ maxWidth: "100%" }}>
      <ScrollArea viewportRef={scrollRef}>
        <Group spacing="xs" style={{ padding: "8px 0" }}>
          <CaretLeft
            size={20}
            weight="bold"
            color="#718096"
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={() => handleScroll("left")}
          />
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
          <CaretRight
            size={20}
            weight="bold"
            color="#718096"
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={() => handleScroll("right")}
          />
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

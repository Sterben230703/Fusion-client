import React, { useState, useEffect } from "react";
import {
  Text,
  Paper,
  Group,
  Avatar,
  Button,
  Stack,
  Flex,
  ScrollArea,
  Badge,
  Box,
  Container,
  Loader,
} from "@mantine/core";
import { CalendarBlank } from "@phosphor-icons/react";
import axios from "axios";
import {
  show_leave_request,
  update_leave_status,
} from "../../../../routes/hostelManagementRoutes";

export default function ManageLeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const fetchLeaveRequests = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(show_leave_request, {
        headers: { Authorization: `Token ${token}` },
      });
      setLeaveRequests(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Failed to fetch leave requests. Please try again later.",
      );
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id, status, remark = "") => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        update_leave_status,
        {
          leave_id: id,
          status,
          remark,
        },
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (response.data.status === "success") {
        setLeaveRequests(
          leaveRequests.map((request) =>
            request.id === id ? { ...request, status, remark } : request,
          ),
        );
        if (status === "approved" || status === "rejected") {
          setActiveTab("past");
        }
      }
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Failed to update leave status. Please try again later.",
      );
    }
  };

  const activeRequests = leaveRequests.filter(
    (request) => request.status === "pending",
  );

  const pastRequests = leaveRequests.filter(
    (request) => request.status === "approved" || request.status === "rejected",
  );

  const renderLeaveRequests = (requests) => {
    if (loading) {
      return (
        <Container
          py="xl"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Loader size="lg" />
        </Container>
      );
    }

    if (error) {
      return (
        <Text align="center" color="red" size="lg">
          {error}
        </Text>
      );
    }

    if (requests.length > 0) {
      return (
        <Stack spacing="md" pb="md">
          {requests.map((request) => (
            <Paper key={request.id} p="md" withBorder shadow="xs">
              <Flex
                align="stretch"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Group spacing="md">
                  <Avatar color="cyan" radius="xl" size="lg">
                    {request.student_name[0]}
                  </Avatar>
                  <div>
                    <Text weight={500} size="sm" lineClamp={1}>
                      {request.student_name}
                    </Text>
                    <Badge size="sm" variant="outline" color="blue">
                      {request.roll_num}
                    </Badge>
                  </div>
                </Group>

                <Box
                  sx={{
                    flex: 1,
                    padding: "8px",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  <Text size="sm" weight={500}>
                    {request.reason}
                  </Text>
                </Box>

                <Flex direction="column" style={{ minWidth: "200px" }}>
                  <Group spacing="xs">
                    <CalendarBlank size={16} />
                    <Text size="xs">From: {request.start_date}</Text>
                  </Group>
                  <Group spacing="xs">
                    <CalendarBlank size={16} />
                    <Text size="xs">To: {request.end_date}</Text>
                  </Group>
                  <Group spacing="xs" mt="auto">
                    {request.status === "pending" ? (
                      <>
                        <Button
                          color="green"
                          size="xs"
                          onClick={() =>
                            handleStatusUpdate(request.id, "approved")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          color="red"
                          size="xs"
                          onClick={() =>
                            handleStatusUpdate(request.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Badge
                        color={request.status === "approved" ? "green" : "red"}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>
                    )}
                  </Group>
                </Flex>
              </Flex>
            </Paper>
          ))}
        </Stack>
      );
    }
    return (
      <Text align="center" size="lg">
        No leave requests found.
      </Text>
    );
  };

  return (
    <Paper shadow="md" p="md" withBorder>
      <Text size="24px" weight={700} mb="md">
        Manage Leave Request
      </Text>
      <Flex gap="md" mb="md">
        <Button
          variant={activeTab === "active" ? "filled" : "outline"}
          onClick={() => setActiveTab("active")}
        >
          Pending Requests ({activeRequests.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "filled" : "outline"}
          onClick={() => setActiveTab("past")}
        >
          Past Requests ({pastRequests.length})
        </Button>
      </Flex>
      <ScrollArea style={{ maxHeight: "66vh" }}>
        {activeTab === "active"
          ? renderLeaveRequests(activeRequests)
          : renderLeaveRequests(pastRequests)}
      </ScrollArea>
    </Paper>
  );
}

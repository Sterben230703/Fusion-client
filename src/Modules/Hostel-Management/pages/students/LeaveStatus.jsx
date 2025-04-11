import React, { useState, useEffect } from "react";
import {
  Paper,
  Group,
  Text,
  Stack,
  Select,
  ScrollArea,
  Loader,
  Container,
} from "@mantine/core";
import axios from "axios";
import LeaveApplicationCard from "../../components/students/LeaveApplicationCard";
import { my_leaves } from "../../../../routes/hostelManagementRoutes";

export default function LeaveStatus() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(my_leaves, {
        headers: { Authorization: `Token ${token}` },
      });

      setLeaves(response.data.leaves);
      setError(null);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch leaves. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const activeLeaves = leaves.filter(
    (leave) => leave.status.toLowerCase() === "pending",
  );
  const pastLeaves = leaves.filter(
    (leave) => leave.status.toLowerCase() !== "pending",
  );

  return (
    <Paper
      shadow="md"
      p="md"
      withBorder
      sx={(theme) => ({
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.white,
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.md,
      })}
    >
      <Text
        align="left"
        mb="xl"
        size="24px"
        style={{ color: "#757575", fontWeight: "bold" }}
      >
        Leave Status
      </Text>

      <ScrollArea style={{ flex: 1 }}>
        {loading ? (
          <Container
            py="xl"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Loader size="lg" />
          </Container>
        ) : error ? (
          <Text align="center" color="red" size="lg">
            {error}
          </Text>
        ) : (
          <Stack spacing="xl">
            <Stack spacing="md">
              <Group position="apart" align="center">
                <Text weight={500} size="xl" color="dimmed">
                  Active Leave Requests
                </Text>
                <Group spacing="xs">
                  <Text size="sm" color="dimmed">
                    Sort By:
                  </Text>
                  <Select
                    placeholder="Date"
                    data={[{ value: "date", label: "Date" }]}
                    style={{ width: "100px" }}
                    variant="unstyled"
                    size="sm"
                  />
                </Group>
              </Group>
              {activeLeaves.map((leave) => (
                <LeaveApplicationCard
                  key={leave.roll_num + leave.start_date}
                  student_name={leave.student_name}
                  roll_num={leave.roll_num}
                  reason={leave.reason}
                  phone_number={leave.phone_number}
                  start_date={leave.start_date}
                  end_date={leave.end_date}
                  status={leave.status}
                  remark={leave.remark}
                />
              ))}
            </Stack>

            <Stack spacing="md">
              <Group position="apart" align="center">
                <Text weight={500} size="xl" color="dimmed">
                  Past Leave Requests
                </Text>
                <Group spacing="xs">
                  <Text size="sm" color="dimmed">
                    Sort By:
                  </Text>
                  <Select
                    placeholder="Date"
                    data={[{ value: "date", label: "Date" }]}
                    style={{ width: "100px" }}
                    variant="unstyled"
                    size="sm"
                  />
                </Group>
              </Group>
              {pastLeaves.map((leave) => (
                <LeaveApplicationCard
                  key={leave.roll_num + leave.start_date}
                  student_name={leave.student_name}
                  roll_num={leave.roll_num}
                  reason={leave.reason}
                  phone_number={leave.phone_number}
                  start_date={leave.start_date}
                  end_date={leave.end_date}
                  status={leave.status}
                  remark={leave.remark}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </ScrollArea>
    </Paper>
  );
}

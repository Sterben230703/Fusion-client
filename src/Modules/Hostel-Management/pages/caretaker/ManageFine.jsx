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
  Container,
  Loader,
} from "@mantine/core";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import axios from "axios";
import {
  fetch_fines_url,
  update_fine_status_url,
} from "../../../../routes/hostelManagementRoutes";

export default function ManageFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFines = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(fetch_fines_url, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log(response);
      console.log(response.data.fines);
      setFines(Array.isArray(response.data?.fines) ? response.data.fines : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching fines:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch fines. Please try again later.",
      );
      setFines([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFines();
  }, []);
  const handleStatusUpdate = async (id, status) => {
    if (!id) {
      console.error("Invalid fine ID:", id); // Debug log for undefined IDs
      setError("Invalid fine ID. Unable to update fine status.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        update_fine_status_url(id), // Build dynamic URL
        { status },
        { headers: { Authorization: `Token ${token}` } },
      );

      if (response.status === 200) {
        setFines((prevFines) =>
          prevFines.map((fine) =>
            fine.fine_id === id ? { ...fine, status } : fine,
          ),
        );
        setError(null); // Clear errors
      }
    } catch (err) {
      console.error("Error updating fine status:", err);
      setError(
        err.response?.data?.error ||
          "Failed to update fine status. Please try again later.",
      );
    }
  };

  const handleMarkPaid = (id) => {
    console.log("Marking fine as paid with ID:", id); // Debug log
    handleStatusUpdate(id, "Paid");
  };

  const handleMarkPending = (id) => {
    // Fixed to mark as Pending
    console.log("Marking fine as pending with ID:", id); // Debug log
    handleStatusUpdate(id, "Pending");
  };

  console.log(fines); // Add this before the return statement

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
        Manage Fines
      </Text>

      <ScrollArea style={{ flex: 1, height: "calc(66vh)" }}>
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
          <Stack spacing="md" pb="md">
            {fines.length > 0 ? (
              fines.map((fine) => (
                <Paper
                  key={fine.fine_id}
                  p="md"
                  withBorder
                  shadow="xs"
                  sx={(theme) => ({
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[3],
                  })}
                >
                  <Flex
                    align="center"
                    justify="space-between"
                    style={{ width: "100%" }}
                  >
                    <Group spacing="md">
                      <Avatar color="cyan" radius="xl">
                        {fine.student_id[0]}
                      </Avatar>
                      <div>
                        <Text weight={500} size="sm" lineClamp={1}>
                          {fine.student_id}
                        </Text>
                      </div>
                    </Group>
                    <Group spacing="md">
                      <Badge
                        size="sm"
                        variant="filled"
                        color={fine.status === "Paid" ? "green" : "red"}
                      >
                        {fine.status}
                      </Badge>
                      {fine.status === "Pending" ? (
                        <Button
                          leftIcon={<CheckCircle size={16} />}
                          color="green"
                          variant="outline"
                          size="xs"
                          onClick={() => handleMarkPaid(fine.fine_id)}
                        >
                          Mark as Paid
                        </Button>
                      ) : (
                        <Button
                          leftIcon={<XCircle size={16} />}
                          color="red"
                          variant="outline"
                          size="xs"
                          onClick={() => handleMarkPending(fine.fine_id)} // Fixed action
                        >
                          Mark as Pending
                        </Button>
                      )}
                    </Group>
                  </Flex>
                </Paper>
              ))
            ) : (
              <Text align="center" color="dimmed" size="lg">
                No fines available.
              </Text>
            )}
          </Stack>
        )}
      </ScrollArea>
    </Paper>
  );
}

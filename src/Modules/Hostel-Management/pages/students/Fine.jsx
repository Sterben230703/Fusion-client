import React, { useState, useEffect } from "react";
import {
  Paper,
  Text,
  Stack,
  ScrollArea,
  Loader,
  Group,
  Alert,
} from "@mantine/core";
import axios from "axios";
import FineCard from "../../components/students/FineCard";
import { fine_show } from "../../../../routes/hostelManagementRoutes"; // Adjust this import path if necessary

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken"); // Get the auth token from local storage

  const fetchFines = async () => {
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch fines from the backend
      const response = await axios.get(fine_show, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.data.student_fines) {
        setFines(response.data.student_fines);
      }
      // ✅ Handle case when no fines are imposed
      else if (response.data.message === "There is no fine imposed on you.") {
        setFines([]); // No fines to display
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch fines. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines(); // Fetch fines on component mount
  }, []);

  if (loading) {
    return (
      <Group position="center" style={{ height: "100%" }}>
        <Loader size="md" />
      </Group>
    );
  }

  if (error) {
    return (
      <Alert title="Error" color="red">
        {error}
      </Alert>
    );
  }

  const activeFines = fines.filter((fine) => fine.status === "Pending");
  const pastFines = fines.filter((fine) => fine.status === "Paid");

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
      <Group position="apart" style={{ width: "100%" }} mb="xl">
        <Text
          align="left"
          size="24px"
          style={{ color: "#757575", fontWeight: "bold" }}
        >
          My Fines
        </Text>
      </Group>

      <ScrollArea style={{ flex: 1 }}>
        <Stack spacing="lg">
          {/* Active Fines */}
          <Group position="apart" align="center">
            <Text weight={500} size="xl">
              Active Fines
            </Text>
          </Group>
          {activeFines.length > 0 ? (
            activeFines.map((fine) => (
              <FineCard
                key={fine.fine_id}
                fine_id={fine.fine_id}
                student_name={fine.student_name}
                hall={fine.hall}
                amount={fine.amount}
                status={fine.status}
                reason={fine.reason}
                isPastFine={fine.isPastFine}
              />
            ))
          ) : (
            <Text color="dimmed" align="center">
              No active fines
            </Text>
          )}

          {/* Past Fines */}
          <Group position="apart" align="center" mt="xl">
            <Text weight={500} size="xl">
              Past Fines History
            </Text>
          </Group>
          {pastFines.length > 0 ? (
            pastFines.map((fine) => (
              <FineCard
                key={fine.fine_id}
                fine_id={fine.fine_id}
                student_name={fine.student_name}
                hall={fine.hall}
                amount={fine.amount}
                status={fine.status}
                reason={fine.reason}
                isPastFine={fine.isPastFine}
              />
            ))
          ) : (
            <Text color="dimmed" align="center">
              No past fines found.
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}

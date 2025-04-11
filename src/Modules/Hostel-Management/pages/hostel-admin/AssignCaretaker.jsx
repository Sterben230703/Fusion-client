import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Select,
  Text,
  Button,
  Paper,
  Stack,
  Notification,
} from "@mantine/core";

import {
  getCaretakers,
  assignCaretakers,
} from "../../../../routes/hostelManagementRoutes"; // API routes for fetching halls and caretakers, and assigning caretakers

axios.defaults.withXSRFToken = true;

export default function AssignCaretaker() {
  const [allHalls, setHalls] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    opened: false,
    message: "",
    color: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setNotification({
        opened: true,
        message: "Authentication token not found. Please login again.",
        color: "red",
      });
      return;
    }

    axios
      .get(getCaretakers, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        const { halls, caretaker_usernames } = response.data;
        setHalls(
          halls.map((hallData) => ({
            value: hallData.hall_id,
            label: hallData.hall_name,
          })),
        );
        setCaretakers(
          caretaker_usernames.map((user) => ({
            value: user.id_id,
            label: user.id_id,
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setNotification({
          opened: true,
          message: "Failed to fetch data. Please try again.",
          color: "red",
        });
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      setNotification({
        opened: true,
        message: "Authentication token not found. Please login again.",
        color: "red",
      });
      return;
    }

    if (!selectedHall || !selectedCaretaker) {
      setNotification({
        opened: true,
        message: "Please select both a hall and a caretaker.",
        color: "red",
      });
      return;
    }

    setLoading(true);

    axios
      .post(
        assignCaretakers,
        {
          hall_id: selectedHall,
          caretaker_username: selectedCaretaker,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      )
      .then((response) => {
        console.log(response);
        setNotification({
          opened: true,
          message: "Caretaker assigned successfully!",
          color: "green",
        });
      })
      .catch((error) => {
        console.error("Error assigning caretaker", error);
        setNotification({
          opened: true,
          message: "Failed to assign caretaker. Please try again.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      <Stack spacing="lg">
        <Text
          align="left"
          mb="xl"
          size="24px"
          style={{ color: "#757575", fontWeight: "bold" }}
        >
          Assign Caretaker
        </Text>

        <Box>
          <Text component="label" size="lg" fw={500}>
            Hall Id:
          </Text>
          <Select
            placeholder="Select Hall"
            data={allHalls}
            value={selectedHall}
            onChange={setSelectedHall}
            w="100%"
            styles={{ root: { marginTop: 5 } }}
          />
        </Box>

        <Box>
          <Text component="label" size="lg" fw={500}>
            Caretaker Username:
          </Text>
          <Select
            placeholder="Select Caretaker"
            data={caretakers}
            value={selectedCaretaker}
            onChange={setSelectedCaretaker}
            w="100%"
            styles={{ root: { marginTop: 5 } }}
          />
        </Box>
        <Button variant="filled" onClick={handleSubmit} loading={loading}>
          Assign
        </Button>
        {notification.opened && (
          <Notification
            title="Notification"
            color={notification.color}
            onClose={() => setNotification({ ...notification, opened: false })}
            style={{ marginTop: "10px" }}
          >
            {notification.message}
          </Notification>
        )}
      </Stack>
    </Paper>
  );
}

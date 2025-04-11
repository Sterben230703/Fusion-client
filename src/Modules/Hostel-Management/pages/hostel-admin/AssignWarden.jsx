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
  getWardens,
  assignWarden,
} from "../../../../routes/hostelManagementRoutes"; // API routes for fetching halls and wardens, and assigning wardens

axios.defaults.withXSRFToken = true;

export default function AssignWarden() {
  const [allHalls, setHalls] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedWarden, setSelectedWarden] = useState(null);
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
      .get(getWardens, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        const { halls, warden_usernames } = response.data;
        setHalls(
          halls.map((hallData) => ({
            value: hallData.hall_id,
            label: hallData.hall_name,
          })),
        );
        setWardens(
          warden_usernames.map((user) => ({
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

    if (!selectedHall || !selectedWarden) {
      setNotification({
        opened: true,
        message: "Please select both a hall and a warden.",
        color: "red",
      });
      return;
    }

    setLoading(true);

    axios
      .post(
        assignWarden,
        {
          hall_id: selectedHall,
          warden_username: selectedWarden,
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
          message: "Warden assigned successfully!",
          color: "green",
        });
      })
      .catch((error) => {
        console.error("Error assigning warden", error);
        setNotification({
          opened: true,
          message: "Failed to assign warden. Please try again.",
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
          Assign Warden
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
            Warden Username:
          </Text>
          <Select
            placeholder="Select Warden"
            data={wardens}
            value={selectedWarden}
            onChange={setSelectedWarden}
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

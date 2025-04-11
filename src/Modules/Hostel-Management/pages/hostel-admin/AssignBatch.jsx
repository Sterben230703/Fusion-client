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
  TextInput,
  Group,
} from "@mantine/core";
import { Upload } from "@phosphor-icons/react";

import {
  getBatches,
  assign_batch,
} from "../../../../routes/hostelManagementRoutes"; // API routes for fetching halls and batches, and assigning batches

axios.defaults.withXSRFToken = true;

export default function AssignBatch() {
  const [allHall, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [batchInput, setBatchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [academicSession, setAcademicSession] = useState(
    "August 2024 - July 2025",
  );
  const [notification, setNotification] = useState({
    opened: false,
    message: "",
    color: "",
  });

  // Generate array of academic sessions starting from 2024-2025
  const generateAcademicSessions = () => {
    const sessions = [];
    for (let i = 0; i < 10; i += 1) {
      const startYear = 2024 + i;
      const endYear = startYear + 1;
      sessions.push(`August ${startYear} - July ${endYear}`);
    }
    return sessions;
  };

  const academicSessions = generateAcademicSessions();

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
      .get(getBatches, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const { halls } = response.data;
        setHalls(
          halls.map((hallData) => ({
            value: hallData.hall_id,
            label: hallData.hall_name,
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

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
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

    if (!selectedHall || !batchInput || !file || !academicSession) {
      setNotification({
        opened: true,
        message: "Please fill in all fields and select a file to upload.",
        color: "red",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("academicSession", academicSession);
    formData.append("selectedHall", selectedHall);
    formData.append("selectedBatch", batchInput);
    formData.append("file", file);

    try {
      const response = await fetch(assign_batch, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Clear file after successful upload
      setFile(null);

      setNotification({
        opened: true,
        message: "File uploaded successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setNotification({
        opened: true,
        message: "Failed to upload file. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
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
          Assign Batch
        </Text>

        <Box>
          <Text component="label" size="lg" fw={500}>
            Hall Id:
          </Text>
          <Select
            placeholder="Select Hall"
            data={allHall}
            value={selectedHall}
            onChange={setSelectedHall}
            w="100%"
            styles={{ root: { marginTop: 5 } }}
          />
        </Box>

        <Box>
          <Text component="label" size="lg" fw={500}>
            Assigned Batch:
          </Text>
          <TextInput
            placeholder="Enter Batch"
            value={batchInput}
            onChange={(event) => setBatchInput(event.currentTarget.value)}
            w="100%"
            styles={{ root: { marginTop: 5 } }}
          />
        </Box>

        <Box>
          <Text component="label" size="lg" fw={500}>
            Academic Session:
          </Text>
          <Select
            placeholder="Select Academic Session"
            data={academicSessions}
            value={academicSession}
            onChange={setAcademicSession}
            w="100%"
            styles={{ root: { marginTop: 5 } }}
          />
        </Box>

        <Box>
          <Text component="label" size="lg" fw={500}>
            Upload Document:
          </Text>
          <Group position="center" mt={5}>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".xls,.xlsx,.csv"
            />
            <Button
              component="label"
              htmlFor="file"
              variant="outline"
              color="blue"
              leftIcon={<Upload size={20} />}
              fullWidth
            >
              {file ? file.name : "Attach Document"}
            </Button>
          </Group>
        </Box>

        <Group position="apart">
          <Button
            variant="filled"
            color="green"
            onClick={handleUpload}
            loading={loading}
            disabled={!file}
          >
            Upload Document
          </Button>
        </Group>

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

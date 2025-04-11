import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Text,
  Input,
  Group,
  Card,
  ScrollArea,
  Modal,
  Container,
  Stack,
  Button,
  Textarea,
  Loader,
} from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";
import {
  getStudentsInfo2,
  imposeFineRoute,
} from "../../../../routes/hostelManagementRoutes"; // Adjust the path as needed

export default function ImposeFine() {
  const [opened, setOpened] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fineAmount, setFineAmount] = useState("");
  const [fineReason, setFineReason] = useState("");

  // Fetch students data
  const fetchStudents = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(getStudentsInfo2, {
        headers: { Authorization: `Token ${token}` },
      });
      setStudents(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch student information. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.id__user__username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.room_no.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleImposeFine = async () => {
    if (!fineAmount || !fineReason || !selectedStudent) {
      alert("Please fill in all fields before imposing a fine.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      // Make the API call to impose the fine
      const response = await axios.post(
        imposeFineRoute, // Use the predefined route
        {
          studentId: selectedStudent.id__user__username, // Use selected student's ID
          fineAmount,
          fineReason,
        },
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      alert("Fine imposed successfully!");
      console.log(response);
      setOpened(false);
      setFineAmount(""); // Reset fine amount input
      setFineReason(""); // Reset fine reason input
    } catch (err) {
      console.error("Error imposing fine:", err);
      alert(
        err.response?.data?.message ||
          "Failed to impose fine. Please try again later.",
      );
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
      <Text
        align="left"
        mb="xl"
        size="24px"
        style={{ color: "#757575", fontWeight: "bold" }}
      >
        Impose Fine
      </Text>

      <Group mb="md">
        <Input
          placeholder="Search"
          icon={<MagnifyingGlass size={16} />}
          style={{ flex: 1 }}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
      </Group>

      <ScrollArea style={{ flex: 1, height: "calc(60vh)" }}>
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
          <Stack spacing="sm">
            {filteredStudents.map((student, index) => (
              <Card
                key={index}
                padding="sm"
                withBorder
                onClick={() => {
                  setSelectedStudent(student);
                  setOpened(true);
                }}
                sx={(theme) => ({
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.colors.gray[0],
                  },
                })}
              >
                <Group align="center" spacing="xs">
                  <Text style={{ flex: 1 }}>{student.id__user__username}</Text>
                  <Text style={{ flex: 1 }}>{student.programme}</Text>
                  <Text
                    size="sm"
                    style={{
                      textAlign: "right",
                      backgroundColor: "#f1f3f5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    Room {student.room_no}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </ScrollArea>

      <Modal opened={opened} onClose={() => setOpened(false)} size="md">
        {selectedStudent && (
          <Container>
            <Stack spacing="md">
              <Paper p="md" radius="md" withBorder>
                <Group position="apart">
                  <Text size="lg" weight={500} color="blue">
                    Name:
                  </Text>
                  <Text size="lg">{selectedStudent.id__user__username}</Text>
                </Group>
              </Paper>

              <Textarea
                placeholder="Reason for fine"
                value={fineReason}
                onChange={(e) => setFineReason(e.currentTarget.value)}
                label="Fine Reason"
              />
              <Input
                placeholder="Fine Amount"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.currentTarget.value)}
                label="Fine Amount"
              />
              <Group position="right" mt="xl">
                <Button variant="filled" onClick={handleImposeFine}>
                  Impose Fine
                </Button>
              </Group>
            </Stack>
          </Container>
        )}
      </Modal>
    </Paper>
  );
}

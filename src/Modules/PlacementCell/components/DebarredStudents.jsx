import React, { useState, useEffect, useMemo } from "react";
import {
  TextInput,
  Button,
  Group,
  Textarea,
  Card,
  Title,
  Grid,
  Modal,
  Text,
  Container,
} from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import {
  fetchDebaredlistRoute,
  sendNotificationRoute,
  debarredStatusRoute,
} from "../../../routes/placementCellRoutes";

function DebarredStudents() {
  const [debarredStudents, setDebarredStudents] = useState([]);
  const [rollNo, setRollNo] = useState("");
  const [reason, setReason] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDebaredlist = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(fetchDebaredlistRoute, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          setDebarredStudents(response.data);
        } else if (response.status === 404) {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        } else {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Failed to fetch data",
          message: "Failed to fetch debared students list",
          color: "red",
        });
      }
    };
    fetchDebaredlist();
  }, []);

  const handleDebar = async () => {
    setLoading(true);
    try {
      const newDebarredStudent = {
        rollNo,
        name: studentDetails.name,
        reason,
      };
      const notificationData = {
        sendTo: "Student",
        recipient: rollNo,
        date: new Date(),
        time: "",
        type: "You are debared",
        description: "",
      };
      const token = localStorage.getItem("authToken");
      await axios.post(`${debarredStatusRoute}${rollNo}/`, newDebarredStudent, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      await axios.post(sendNotificationRoute, notificationData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDebarredStudents((prev) => [...prev, newDebarredStudent]);
      notifications.show({
        title: "Success",
        message: "Student debarred successfully!",
        color: "green",
        position: "top-center",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error debarring student:", error);
      notifications.show({
        title: "Error",
        message: "An error occurred while debarring the student.",
        color: "red",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStudentDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${debarredStatusRoute}${rollNo}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 200) {
        setStudentDetails(response.data);
        setIsModalOpen(true);
      } else if (response.status === 404) {
        notifications.show({
          title: "Error fetching data",
          message: `no user found with that roll no: ${rollNo}`,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Error fetching data",
          message: `Error fetching data: ${response.status}`,
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch student details.",
        color: "red",
        position: "top-center",
      });
    }
  };

  const handleDebarDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.delete(`${debarredStatusRoute}${rollNo}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        notifications.show({
          title: "Success",
          message: "Student deleted from debarred successfully!",
          color: "green",
          position: "top-center",
        });
      } else {
        notifications.show({
          title: "Failed",
          message: `Student not found with roll no : ${rollNo}`,
          color: "red",
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete student details.",
        color: "red",
        position: "top-center",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "roll_no",
        header: "Roll No",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Reason",
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: debarredStudents,
  });

  return (
    <Container>
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <Title order={3} align="center" style={{ marginBottom: "20px" }}>
          Debarred Students
        </Title>
        <MantineReactTable table={table} />
      </Card>

      <Card
        shadow="sm"
        padding="lg"
        radius="lg"
        withBorder
        style={{ marginTop: "20px" }}
      >
        <Title order={3} align="center" style={{ marginBottom: "20px" }}>
          Debar a Student
        </Title>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Roll No"
              placeholder="Enter roll number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Button
              variant="light"
              color="blue"
              style={{ marginTop: "30px" }}
              onClick={handleFetchStudentDetails}
            >
              Fetch Student Details
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Debar Student"
        size="lg"
      >
        {studentDetails && (
          <Card shadow="sm" padding="lg" radius="lg" withBorder>
            <Title order={4} align="center" style={{ marginBottom: "20px" }}>
              Student Details
            </Title>
            <Text>
              <strong>Roll No:</strong> {studentDetails.roll_no}
            </Text>
            <Text>
              <strong>Name:</strong> {studentDetails.name}
            </Text>
            <Text>
              <strong>Email:</strong> {studentDetails.email}
            </Text>
            <Text>
              <strong>Department:</strong> {studentDetails.department}
            </Text>
            <Text>
              <strong>Year:</strong> {studentDetails.year}
            </Text>
            <Text>
              <strong>Programme:</strong> {studentDetails.programme}
            </Text>

            <Textarea
              label="Reason for Debarring"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minRows={3}
              style={{ marginTop: "20px" }}
            />
            <Group position="right" style={{ marginTop: "20px" }}>
              {studentDetails.debar_status === true ? (
                <Button
                  onClick={handleDebarDelete}
                  color="red"
                  variant="light"
                  style={{ marginRight: "10px" }}
                >
                  Delete Debarred Student
                </Button>
              ) : (
                <Button onClick={handleDebar} loading={loading}>
                  Debar Student
                </Button>
              )}
            </Group>
          </Card>
        )}
      </Modal>
    </Container>
  );
}

export default DebarredStudents;

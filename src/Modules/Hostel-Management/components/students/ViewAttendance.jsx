import {
  Paper,
  Title,
  Container,
  Stack,
  Select,
  Loader,
  Button,
  Image,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { view_attendance } from "../../../../routes/hostelManagementRoutes";

export default function ViewAttendanceComponent() {
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceFile, setAttendanceFile] = useState(null);

  const years = Array.from({ length: 20 }, (_, i) => 2025 - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleFetchAttendance = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${view_attendance}?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Token ${token}` },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileUrl = URL.createObjectURL(blob);

      setAttendanceFile({
        url: fileUrl,
        type: blob.type,
        name: `Attendance_${year}_${month}${blob.type.includes("pdf") ? ".pdf" : ".png"}`,
      });
    } catch (error) {
      let errorMessage = "Error fetching attendance";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Attendance record not found";
        }

        if (error.response.data instanceof Blob) {
          try {
            const text = await error.response.data.text();
            errorMessage = text || errorMessage;
          } catch (e) {
            console.error("Error reading error message:", e);
          }
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" px="xs">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={1} size="h2" mb="xl">
          View Attendance
        </Title>

        <Stack spacing="md">
          <Select
            label="Year"
            placeholder="Select year"
            data={years.map((yr) => yr.toString())}
            value={year}
            onChange={setYear}
          />

          {year && (
            <Select
              label="Month"
              placeholder="Select month"
              data={months}
              value={month}
              onChange={setMonth}
            />
          )}
        </Stack>

        <Button
          mt="lg"
          onClick={handleFetchAttendance}
          disabled={!year || !month}
        >
          Fetch Attendance
        </Button>

        {loading && <Loader mt="md" />}

        {attendanceFile && (
          <Paper mt="lg" p="md" shadow="sm" withBorder>
            {attendanceFile.type.includes("image") ? (
              <Image
                src={attendanceFile.url}
                alt="Attendance Record"
                withPlaceholder
              />
            ) : (
              <Stack>
                <iframe
                  src={attendanceFile.url}
                  style={{ width: "100%", height: "500px", border: "none" }}
                  title="Attendance PDF Viewer"
                />
                <Button
                  component="a"
                  href={attendanceFile.url}
                  download={attendanceFile.name}
                  mt="md"
                >
                  Download PDF
                </Button>
              </Stack>
            )}
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

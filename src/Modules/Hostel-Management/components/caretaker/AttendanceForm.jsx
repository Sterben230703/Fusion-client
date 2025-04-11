import {
  Paper,
  Button,
  Title,
  Container,
  Stack,
  Select,
  Text,
} from "@mantine/core";
import { Upload } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import {
  viewHostel,
  upload_attendance,
} from "../../../../routes/hostelManagementRoutes";

export default function UploadAttendanceComponent() {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [hostelsData, setHostelsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch(viewHostel, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setHostelsData(data.hostel_details);
        if (data.hostel_details.length > 0) {
          setSelectedHall(data.hostel_details[0].hall_id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hostel data:", error);
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Get data of the selected hall
  const selectedHallData = hostelsData.find((h) => h.hall_id === selectedHall);

  // Reset batch when hall changes
  useEffect(() => {
    setSelectedBatch("");
  }, [selectedHall]);

  if (loading) {
    return (
      <Text align="center" mt="xl">
        Loading...
      </Text>
    );
  }

  const years = Array.from({ length: 10 }, (_, i) => 2025 + i);
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

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
  };

  const handleHallChange = (newHallId) => {
    setSelectedHall(newHallId);
  };

  const handleBatchChange = (newBatch) => {
    setSelectedBatch(newBatch);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("year", year);
    formData.append("month", month);
    formData.append("selectedHall", selectedHall);
    formData.append("selectedBatch", selectedBatch);
    formData.append("file", file);

    try {
      const response = await fetch(upload_attendance, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Clear form after successful upload
      setFile(null);
      setYear(null);
      setMonth(null);
      setSelectedBatch("");

      alert("Attendance uploaded successfully!");
    } catch (error) {
      console.error("Error uploading attendance:", error);
      alert("Failed to upload attendance. Please try again.");
    }
  };

  return (
    <Container size="sm" px="xs">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={1} size="h2" mb="xl">
          Upload Attendance
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <Select
              label="Year"
              placeholder="Select year"
              data={years.map((yr) => yr.toString())}
              required
              value={year}
              onChange={handleYearChange}
              styles={{
                label: { fontSize: "1rem", fontWeight: 500 },
              }}
            />

            {year && (
              <Select
                label="Month"
                placeholder="Select month"
                data={months}
                required
                value={month}
                onChange={(selectedMonth) => setMonth(selectedMonth)}
                styles={{
                  label: { fontSize: "1rem", fontWeight: 500 },
                }}
              />
            )}

            {month && (
              <Select
                label="Hall"
                data={hostelsData.map((hostelData) => ({
                  value: hostelData.hall_id,
                  label: hostelData.hall_name,
                }))}
                placeholder="Select Hall"
                required
                value={selectedHall}
                onChange={handleHallChange}
                styles={{
                  label: { fontSize: "1rem", fontWeight: 500 },
                }}
              />
            )}

            {selectedHallData && selectedHallData.assigned_batch && (
              <Select
                label="Batch"
                placeholder="Select Batch"
                data={selectedHallData.assigned_batch.map((batch) => ({
                  value: batch,
                  label: batch,
                }))}
                required
                value={selectedBatch}
                onChange={handleBatchChange}
                styles={{
                  label: { fontSize: "1rem", fontWeight: 500 },
                }}
              />
            )}

            <Title order={3} size="h4" mt="md">
              Upload Attendance Document
            </Title>

            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />

            <Button
              component="label"
              htmlFor="file"
              variant="filled"
              color="blue"
              leftIcon={<Upload size={20} />}
              fullWidth
            >
              {file ? file.name : "Attach Document"}
            </Button>

            <Button
              type="submit"
              variant="filled"
              color="blue"
              fullWidth
              mt="xl"
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

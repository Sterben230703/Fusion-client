import "@mantine/dates/styles.css";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  TextInput,
  Button,
  Select,
  Group,
  Container,
  Modal,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { fetchPlacementStatsRoute } from "../../../routes/placementCellRoutes";

function AddPlacementRecordForm({ opened, onClose }) {
  const [companyName, setCompanyName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [ctc, setCtc] = useState("");
  const [year, setYear] = useState("");
  const [placementType, setPlacementType] = useState("");
  const [testType, setTestType] = useState("");
  const [testScore, setTestScore] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("placement_type", placementType);
    formData.append("company_name", companyName);
    formData.append("roll_no", rollNo);
    formData.append("ctc", ctc);
    formData.append("year", year);
    formData.append("test_type", testType);
    formData.append("test_score", testScore);

    const token = localStorage.getItem("authToken");

    if (!token) {
      notifications.show({
        title: "Unauthorized",
        message: "Authentication token is missing. Please log in.",
        color: "red",
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch(fetchPlacementStatsRoute, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error || "An error occurred");
        notifications.show({
          title: "Error Adding Record",
          message: errorData.error || "An error occurred",
          color: "red",
          position: "top-center",
          autoClose: 3000,
        });
        throw new Error(errorData.error || "An error occurred");
      }

      notifications.show({
        title: "Record Added",
        message: "Placement record has been added successfully.",
        color: "green",
        position: "top-center",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      notifications.show({
        title: "Error Adding Record",
        message: error.message,
        color: "red",
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <Container>
      <Modal opened={opened} onClose={onClose} size="lg" centered>
        {/* Grouping input fields */}

        <Title order={3} mb={32}>
          Add Placement Record
        </Title>
        <Group
          grow
          spacing="md"
          direction="column"
          breakpoints={{ sm: { direction: "row" } }}
        >
          <TextInput
            label="Company Name"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <TextInput
            label="Roll No."
            placeholder="Enter roll number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />
        </Group>

        <Group
          grow
          spacing="md"
          direction="column"
          breakpoints={{ sm: { direction: "row" } }}
          style={{ marginTop: "20px" }}
        >
          <TextInput
            label="CTC in LPA"
            placeholder="Enter CTC"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            required
          />
          <TextInput
            label="Year"
            placeholder="Enter year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </Group>

        <Select
          label="Placement Type"
          placeholder="Select placement type"
          data={["PBI", "Placement"]}
          value={placementType}
          onChange={setPlacementType}
          style={{ marginTop: "20px" }}
          required
        />

        <TextInput
          label="Test Type"
          placeholder="Enter test type"
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
          style={{ marginTop: "20px" }}
          required
        />

        <TextInput
          label="Test Score"
          placeholder="Enter test score"
          value={testScore}
          onChange={(e) => setTestScore(e.target.value)}
          style={{ marginTop: "20px" }}
          required
        />

        <Group position="right" style={{ marginTop: "20px" }}>
          <Button onClick={handleSubmit}>Add Record</Button>
        </Group>
      </Modal>
    </Container>
  );
}

AddPlacementRecordForm.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPlacementRecordForm;

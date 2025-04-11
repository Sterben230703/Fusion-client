import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import axios from "axios";
import { requestLeave } from "../../../../routes/hostelManagementRoutes";

export default function LeaveForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    phoneNumber: "",
    reason: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrors({
        general: "Authentication token not found. Please log in again.",
      });
      setIsSubmitting(false);
      return;
    }

    const data = {
      student_name: formData.studentName,
      roll_num: formData.rollNumber,
      phone_number: formData.phoneNumber,
      reason: formData.reason,
      start_date: formData.startDate,
      end_date: formData.endDate,
    };

    try {
      const response = await axios.post(requestLeave, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response contains a message
      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setErrors({}); // Reset errors
        setFormData({
          studentName: "",
          rollNumber: "",
          phoneNumber: "",
          reason: "",
          startDate: "",
          endDate: "",
        });
      } else {
        // Handle unexpected response format
        setErrors({ general: "Unexpected server response." });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.error) {
          setErrors({ general: error.response.data.error });
        } else {
          setErrors({ general: "Unexpected server error occurred." });
        }
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper shadow="md" p="md" withBorder>
      <Stack spacing="lg">
        <Text
          align="left"
          mb="xl"
          size="24px"
          style={{ color: "#757575", fontWeight: "bold" }}
        >
          Leave Form
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <Box>
              <Text component="label" size="lg" fw={500}>
                Student Name:
              </Text>
              <TextInput
                placeholder="Enter your full name"
                value={formData.studentName}
                onChange={(event) =>
                  handleChange("studentName", event.currentTarget.value)
                }
                required
              />
              {errors.student_name && (
                <Text color="red">{errors.student_name}</Text>
              )}
            </Box>

            <Box>
              <Text component="label" size="lg" fw={500}>
                Roll Number:
              </Text>
              <TextInput
                placeholder="Enter your roll number"
                value={formData.rollNumber}
                onChange={(event) =>
                  handleChange("rollNumber", event.currentTarget.value)
                }
                required
              />
              {errors.roll_num && <Text color="red">{errors.roll_num}</Text>}
            </Box>

            <Box>
              <Text component="label" size="lg" fw={500}>
                Phone Number:
              </Text>
              <TextInput
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(event) =>
                  handleChange("phoneNumber", event.currentTarget.value)
                }
                required
              />
              {errors.phone_number && (
                <Text color="red">{errors.phone_number}</Text>
              )}
            </Box>

            <Box>
              <Text component="label" size="lg" fw={500}>
                Reason:
              </Text>
              <Textarea
                placeholder="Please provide a detailed reason for your leave"
                value={formData.reason}
                onChange={(event) =>
                  handleChange("reason", event.currentTarget.value)
                }
                minRows={5}
                required
              />
              {errors.reason && <Text color="red">{errors.reason}</Text>}
            </Box>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Start Date:
                </Text>
                <TextInput
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleChange("startDate", e.currentTarget.value)
                  }
                  required
                />
                {errors.start_date && (
                  <Text color="red">{errors.start_date}</Text>
                )}
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  End Date:
                </Text>
                <TextInput
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    handleChange("endDate", e.currentTarget.value)
                  }
                  required
                />
                {errors.end_date && <Text color="red">{errors.end_date}</Text>}
              </Grid.Col>
            </Grid>

            <Group position="right" spacing="sm" mt="xl">
              <Button type="submit" variant="filled" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Group>
          </Stack>
        </form>

        {successMessage && (
          <Text color="green" size="lg" fw="bold">
            {successMessage}
          </Text>
        )}
        {errors.general && (
          <Text color="red" size="lg" fw="bold">
            {errors.general}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}

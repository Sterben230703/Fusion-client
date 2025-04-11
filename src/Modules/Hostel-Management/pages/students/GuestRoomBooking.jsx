import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import axios from "axios";
import { request_guest_room } from "../../../../routes/hostelManagementRoutes";

export default function GuestRoomBooking() {
  const [formData, setFormData] = useState({
    hall: "",
    arrivalDate: null,
    arrivalTime: "",
    departureDate: null,
    departureTime: "",
    numberOfGuests: 1,
    nationality: "",
    numberOfRooms: 1,
    roomType: "",
    guestName: "",
    guestAddress: "",
    guestEmail: "",
    guestPhone: "",
    purpose: "",
  });

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      hall: formData.hall,
      guest_name: formData.guestName,
      guest_phone: formData.guestPhone,
      guest_email: formData.guestEmail,
      guest_address: formData.guestAddress,
      rooms_required: formData.numberOfRooms,
      total_guest: formData.numberOfGuests,
      purpose: formData.purpose,
      arrival_date: formData.arrivalDate,
      arrival_time: formData.arrivalTime,
      departure_date: formData.departureDate,
      departure_time: formData.departureTime,
      nationality: formData.nationality,
      room_type: formData.roomType,
    };

    try {
      const response = await axios.post(request_guest_room, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 201) {
        alert("Room request submitted successfully!");
      } else {
        alert(response.data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting room request:", error); // Log error for debugging
      if (error.response) {
        // If the error comes from the backend
        alert(
          error.response.data.error ||
            "An error occurred while processing your request.",
        );
      } else {
        // If no response from server
        alert("Failed to submit room request. Please try again later.");
      }
    }
  };

  return (
    <Paper
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
          Book a Guest Room
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <Box>
              <Text component="label" size="lg" fw={500}>
                Select Hall:
              </Text>
              <Select
                placeholder="Choose a Hall"
                data={[
                  { value: "1", label: "Hall1" },
                  { value: "4", label: "Hall4" },
                  { value: "3", label: "Hall3" },
                ]}
                value={formData.hall}
                onChange={(value) => handleChange("hall", value)}
                styles={{ root: { marginTop: 5 } }}
              />
            </Box>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Arrival Date:
                </Text>
                <DatePickerInput
                  placeholder="Pick date"
                  value={formData.arrivalDate}
                  onChange={(value) => handleChange("arrivalDate", value)}
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Departure Date:
                </Text>
                <DatePickerInput
                  placeholder="Pick date"
                  value={formData.departureDate}
                  onChange={(value) => handleChange("departureDate", value)}
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Arrival Time:
                </Text>
                <TextInput
                  value={formData.arrivalTime}
                  onChange={(event) =>
                    handleChange("arrivalTime", event.currentTarget.value)
                  }
                  placeholder="Enter time (HH:mm)"
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Departure Time:
                </Text>
                <TextInput
                  value={formData.departureTime}
                  onChange={(event) =>
                    handleChange("departureTime", event.currentTarget.value)
                  }
                  placeholder="Enter time (HH:mm)"
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Number of Guests:
                </Text>
                <NumberInput
                  value={formData.numberOfGuests}
                  onChange={(value) => handleChange("numberOfGuests", value)}
                  min={1}
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Nationality:
                </Text>
                <TextInput
                  value={formData.nationality}
                  onChange={(event) =>
                    handleChange("nationality", event.currentTarget.value)
                  }
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Number of Rooms:
                </Text>
                <NumberInput
                  value={formData.numberOfRooms}
                  onChange={(value) => handleChange("numberOfRooms", value)}
                  min={1}
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Room Type:
                </Text>
                <Select
                  placeholder="Select Room Type"
                  data={[
                    { value: "single", label: "Single" },
                    { value: "double", label: "Double" },
                    { value: "triple", label: "Triple" },
                  ]}
                  value={formData.roomType}
                  onChange={(value) => handleChange("roomType", value)}
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
            </Grid>

            <Box>
              <Text size="lg" fw={500} mb={4}>
                Available Rooms
              </Text>
              <Paper p="sm" withBorder>
                <Text align="center" color="dimmed">
                  Room availability will be displayed here
                </Text>
              </Paper>
            </Box>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Guest Name:
                </Text>
                <TextInput
                  placeholder="Full Name"
                  value={formData.guestName}
                  onChange={(event) =>
                    handleChange("guestName", event.currentTarget.value)
                  }
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Guest Address:
                </Text>
                <TextInput
                  placeholder="Street Address"
                  value={formData.guestAddress}
                  onChange={(event) =>
                    handleChange("guestAddress", event.currentTarget.value)
                  }
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Guest Email:
                </Text>
                <TextInput
                  placeholder="email@example.com"
                  value={formData.guestEmail}
                  onChange={(event) =>
                    handleChange("guestEmail", event.currentTarget.value)
                  }
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Text component="label" size="lg" fw={500}>
                  Guest Phone Number:
                </Text>
                <TextInput
                  placeholder="Phone Number"
                  value={formData.guestPhone}
                  onChange={(event) =>
                    handleChange("guestPhone", event.currentTarget.value)
                  }
                  styles={{ root: { marginTop: 5 } }}
                />
              </Grid.Col>
            </Grid>

            <Box>
              <Text component="label" size="lg" fw={500}>
                Purpose of Stay:
              </Text>
              <Textarea
                placeholder="Purpose of stay"
                value={formData.purpose}
                onChange={(event) =>
                  handleChange("purpose", event.currentTarget.value)
                }
                minRows={4}
                styles={{ root: { marginTop: 5 } }}
              />
            </Box>

            <Group position="right" spacing="sm" mt="xl">
              <Button type="submit" variant="filled">
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}

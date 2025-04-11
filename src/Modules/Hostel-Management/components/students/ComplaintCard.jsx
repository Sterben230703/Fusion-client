import React from "react";
import {
  Box,
  Text,
  TextInput,
  Textarea,
  Badge,
  Group,
  Stack,
} from "@mantine/core";

// Default properties for the ComplaintCard component
const defaultProps = {
  hall_name: "Unknown Hall",
  student_name: "Unknown Name",
  roll_number: "Unknown Roll Number",
  description: "No description provided",
  contact_number: "Not Available",
  status: "Pending",
};

export default function ComplaintCard(props) {
  // Determine badge color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "green";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };
  const {
    hall_name,
    student_name,
    roll_number,
    description,
    contact_number,
    status,
  } = {
    ...defaultProps,
    ...props,
  };

  return (
    <Box
      sx={(theme) => ({
        border: `2px solid ${theme.colors.dark[9]}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        backgroundColor: theme.white,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "600px",
      })}
    >
      <Stack spacing="md">
        {/* Top section: Student name and status */}
        <Group position="apart" align="center">
          <Text weight={700} size="lg">
            {student_name}
          </Text>
          <Badge
            color={getStatusColor(status)}
            variant="filled"
            size="lg"
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {status}
          </Badge>
        </Group>

        {/* Middle section: Hall name, Roll number, and Contact */}
        <Group grow>
          <TextInput label="Hall Name" value={hall_name} size="md" readOnly />
          <TextInput
            label="Roll Number"
            value={roll_number}
            size="md"
            readOnly
          />
        </Group>

        <TextInput
          label="Contact Number"
          value={contact_number}
          size="md"
          readOnly
        />

        {/* Bottom section: Description */}
        <Textarea
          label="Description"
          value={description}
          size="md"
          minRows={3}
          readOnly
        />
      </Stack>
    </Box>
  );
}

// Set default props for the component
ComplaintCard.defaultProps = defaultProps;

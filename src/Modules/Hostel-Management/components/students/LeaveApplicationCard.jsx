import React from "react";
import { Box, Text, TextInput, Group, Stack, Badge } from "@mantine/core";

const defaultProps = {
  student_name: "",
  roll_num: "",
  reason: "",
  phone_number: "",
  start_date: "",
  end_date: "",
  status: "pending",
  remark: "",
};

export default function LeaveApplicationCard(props = defaultProps) {
  const {
    student_name,
    roll_num,
    reason,
    phone_number,
    start_date,
    end_date,
    status,
    remark,
  } = {
    ...defaultProps,
    ...props,
  };

  const getStatusColor = (currStatus) => {
    switch (currStatus.toLowerCase()) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "yellow";
    }
  };

  const getDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        backgroundColor: theme.white,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "100%",
        borderWidth: "2px",
      })}
    >
      <Stack spacing="md">
        <Group position="apart" align="center">
          <Text weight={600} size="lg">
            {student_name} ({roll_num})
          </Text>
          <Badge
            color={getStatusColor(status)}
            variant="filled"
            size="lg"
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {status.toUpperCase()}
          </Badge>
        </Group>

        <Group grow align="flex-start" spacing="md">
          <TextInput label="Start Date" value={start_date} size="sm" readOnly />
          <TextInput label="End Date" value={end_date} size="sm" readOnly />
          <TextInput
            label="Duration"
            value={getDuration(start_date, end_date)}
            size="sm"
            readOnly
          />
        </Group>

        <TextInput label="Reason" value={reason} size="sm" readOnly />

        <TextInput
          label="Phone Number"
          value={phone_number}
          size="sm"
          readOnly
        />

        {remark && (
          <TextInput label="Remark" value={remark} size="sm" readOnly />
        )}
      </Stack>
    </Box>
  );
}

LeaveApplicationCard.defaultProps = defaultProps;

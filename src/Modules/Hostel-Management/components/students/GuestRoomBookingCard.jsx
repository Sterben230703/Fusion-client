import React from "react";
import { Box, Group, Text, Badge, Stack, TextInput } from "@mantine/core";

const defaultProps = {
  roomType: "",
  roomSize: "",
  checkInDate: "",
  checkOutDate: "",
  bookingDate: "",
  paymentStatus: "Pending",
  totalAmount: "",
  guestName: "",
  status: "pending",
};

export default function GuestRoomBookingCard(props = defaultProps) {
  const {
    roomType,
    roomSize,
    checkInDate,
    checkOutDate,
    bookingDate,
    paymentStatus,
    totalAmount,
    guestName,
    leaveStatus,
  } = {
    ...defaultProps,
    ...props,
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
        return "green";
      case "cancelled":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      })}
    >
      <Stack spacing="md">
        <Group position="apart" align="center">
          <Text weight={600} size="lg">
            {roomType}
          </Text>
          <Badge
            color={getStatusColor(leaveStatus)}
            variant="filled"
            size="lg"
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {leaveStatus.toUpperCase()}
          </Badge>
        </Group>

        <Group grow align="flex-start" spacing="md">
          <TextInput label="Guest Name" value={guestName} size="sm" />
          <TextInput label="Room Size" value={roomSize} size="sm" />
          <TextInput
            label="Total Amount"
            value={totalAmount}
            size="sm"
            rightSection={
              <Badge
                color={getStatusColor(paymentStatus)}
                variant="light"
                size="sm"
              >
                {paymentStatus}
              </Badge>
            }
          />
        </Group>

        <Group grow align="flex-start" spacing="md">
          <TextInput
            label="Check-in Date"
            value={formatDate(checkInDate)}
            size="sm"
          />
          <TextInput
            label="Check-out Date"
            value={formatDate(checkOutDate)}
            size="sm"
          />
          <TextInput
            label="Booking Date"
            value={formatDate(bookingDate)}
            size="sm"
          />
        </Group>
      </Stack>
    </Box>
  );
}

GuestRoomBookingCard.defaultProps = defaultProps;

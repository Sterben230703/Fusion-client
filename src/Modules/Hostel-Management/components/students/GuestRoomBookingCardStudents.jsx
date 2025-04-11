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
  guestAddress: "",
  guestPhone: "",
  nationality: "",
  purpose: "",
  roomsRequired: "",
  status: "pending",
};

export default function GuestRoomBookingCardStudents(props = defaultProps) {
  const {
    roomType,
    checkInDate,
    checkOutDate,
    bookingDate,
    guestName,
    guestAddress,
    guestPhone,
    nationality,
    purpose,
    roomsRequired,
    status,
  } = {
    ...defaultProps,
    ...props,
  };

  console.log(props);

  const getStatusColor = () => {
    if (!status) return "gray";
    switch (status.toLowerCase()) {
      case "accepted":
        return "green";
      case "rejected":
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
            color={getStatusColor(status)}
            variant="filled"
            size="lg"
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {status.toUpperCase()}
          </Badge>
        </Group>

        <Group grow align="flex-start" spacing="md">
          <TextInput label="Guest Name" value={guestName} size="sm" readOnly />
          <TextInput label="Phone" value={guestPhone} size="sm" readOnly />
          <TextInput label="Address" value={guestAddress} size="sm" readOnly />
        </Group>

        <Group grow align="flex-start" spacing="md">
          <TextInput
            label="Nationality"
            value={nationality}
            size="sm"
            readOnly
          />
          <TextInput label="Purpose" value={purpose} size="sm" readOnly />
          <TextInput
            label="Rooms Required"
            value={roomsRequired}
            size="sm"
            readOnly
          />
        </Group>

        <Group grow align="flex-start" spacing="md">
          <TextInput
            label="Check-in Date"
            value={formatDate(checkInDate)}
            size="sm"
            readOnly
          />
          <TextInput
            label="Check-out Date"
            value={formatDate(checkOutDate)}
            size="sm"
            readOnly
          />
          <TextInput
            label="Booking Date"
            value={formatDate(bookingDate)}
            size="sm"
            readOnly
          />
        </Group>

        {/* <Group grow align="flex-start" spacing="md">
          <TextInput
            label="Total Amount"
            value={`₹${totalAmount}`}
            size="sm"
            readOnly
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
        </Group> */}
      </Stack>
    </Box>
  );
}

GuestRoomBookingCardStudents.defaultProps = defaultProps;

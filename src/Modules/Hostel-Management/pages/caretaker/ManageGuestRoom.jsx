import React, { useState, useEffect } from "react";
import {
  Paper,
  Group,
  Text,
  Stack,
  Select,
  ScrollArea,
  Loader,
  Container,
} from "@mantine/core";
import axios from "axios";
import GuestRoomBookingCard from "../../components/students/GuestRoomBookingCard";
import { show_guestroom_booking_request } from "../../../../routes/hostelManagementRoutes";

export default function GuestRoomBookingStatus() {
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuestBookings = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(show_guestroom_booking_request, {
        headers: { Authorization: `Token ${token}` },
      });
      setGuestBookings(Array.isArray(response.data) ? response.data : []);
      console.log(guestBookings);
      setError(null);
    } catch (e) {
      console.error("Error fetching guest room bookings:", e);
      setError(
        e.response?.data?.message ||
          "Failed to fetch guest room bookings. Please try again later.",
      );
      setGuestBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestBookings();
  }, []);

  const renderBookingCards = (bookings, filterStatus) =>
    bookings
      .filter((booking) => booking.status === filterStatus)
      .map((booking) => (
        <GuestRoomBookingCard
          key={booking.id}
          roomType={booking.room_type}
          roomSize={`${booking.room_size} sq m`}
          checkInDate={booking.arrival_date}
          checkOutDate={booking.departure_date}
          bookingDate={booking.booking_date}
          paymentStatus={booking.payment_status}
          totalAmount={booking.total_amount}
          guestName={booking.guest_name}
          leaveStatus={booking.status}
        />
      ));

  return (
    <Paper
      shadow="md"
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
      <ScrollArea style={{ flex: 1 }}>
        <Text
          align="left"
          mb="xl"
          size="24px"
          style={{ color: "#757575", fontWeight: "bold" }}
        >
          Guest Room Booking Status
        </Text>

        {loading ? (
          <Container
            py="xl"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Loader size="lg" />
          </Container>
        ) : error ? (
          <Text align="center" color="red" size="lg">
            {error}
          </Text>
        ) : guestBookings.length > 0 ? (
          <Stack spacing="xl">
            <Stack spacing="md">
              <Group position="apart" align="center">
                <Text weight={500} size="xl" color="dimmed">
                  Active Bookings
                </Text>
                <Group spacing="xs">
                  <Text size="sm" color="dimmed">
                    Sort By:
                  </Text>
                  <Select
                    placeholder="Date"
                    data={[
                      { value: "checkInDate", label: "Check-in Date" },
                      { value: "bookingDate", label: "Booking Date" },
                      { value: "roomType", label: "Room Type" },
                    ]}
                    style={{ width: "100px" }}
                    variant="unstyled"
                    size="sm"
                  />
                </Group>
              </Group>
              {renderBookingCards(guestBookings, "confirmed")}
            </Stack>

            <Stack spacing="md">
              <Group position="apart" align="center">
                <Text weight={500} size="xl" color="dimmed">
                  Past Bookings
                </Text>
                <Group spacing="xs">
                  <Text size="sm" color="dimmed">
                    Sort By:
                  </Text>
                  <Select
                    placeholder="Date"
                    data={[
                      { value: "checkInDate", label: "Check-in Date" },
                      { value: "bookingDate", label: "Booking Date" },
                      { value: "roomType", label: "Room Type" },
                    ]}
                    style={{ width: "100px" }}
                    variant="unstyled"
                    size="sm"
                  />
                </Group>
              </Group>
              {renderBookingCards(guestBookings, "completed")}
              {renderBookingCards(guestBookings, "cancelled")}
            </Stack>
          </Stack>
        ) : (
          <Text align="center" size="lg">
            No guest room bookings found.
          </Text>
        )}
      </ScrollArea>
    </Paper>
  );
}

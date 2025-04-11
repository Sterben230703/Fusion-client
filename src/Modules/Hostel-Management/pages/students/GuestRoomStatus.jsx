import React, { useState, useEffect } from "react";
import {
  Paper,
  Group,
  Text,
  Stack,
  ScrollArea,
  Loader,
  Container,
} from "@mantine/core";
import axios from "axios";
import GuestRoomBookingCardStudents from "../../components/students/GuestRoomBookingCardStudents";
import { get_guestroom_bookings_for_students } from "../../../../routes/hostelManagementRoutes";

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
      const response = await axios.get(get_guestroom_bookings_for_students, {
        headers: { Authorization: `Token ${token}` },
      });
      setGuestBookings(Array.isArray(response.data) ? response.data : []);
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

  const renderBookingCards = (bookings, filterStatuses) =>
    bookings
      .filter((booking) =>
        filterStatuses.includes(booking.status.toLowerCase()),
      )
      .map((booking) => (
        <GuestRoomBookingCardStudents
          key={booking.id}
          guestName={booking.guest_name.trim()}
          guestEmail={booking.guest_email}
          guestPhone={booking.guest_phone}
          guestAddress={booking.guest_address}
          nationality={booking.nationality}
          purpose={booking.purpose}
          roomType={booking.room_type}
          roomsRequired={booking.rooms_required}
          totalGuests={booking.total_guest}
          checkInDate={booking.arrival_date}
          checkOutDate={booking.departure_date}
          bookingDate={booking.booking_date}
          status={booking.status}
          totalAmount={booking.total_amount}
          paymentStatus={booking.payment_status}
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
                  Pending Bookings
                </Text>
              </Group>
              {renderBookingCards(guestBookings, ["pending"])}
            </Stack>

            <Stack spacing="md">
              <Group position="apart" align="center">
                <Text weight={500} size="xl" color="dimmed">
                  Completed Bookings
                </Text>
              </Group>
              {renderBookingCards(guestBookings, ["accepted", "rejected"])}
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

import {
  Paper,
  Text,
  Badge,
  Stack,
  ScrollArea,
  Loader,
  Container,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { getNotices } from "../../../../routes/hostelManagementRoutes";
import { Empty } from "../../../../components/empty";

// Helper function to transform scope number to string
const getScopeType = (scope) => {
  return scope === "1" ? "global" : "hall";
};

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(getNotices, {
        headers: { Authorization: `Token ${token}` },
      });

      // Transform and sort the notices by id in descending order
      const transformedNotices = response.data
        .map((notice) => ({
          ...notice,
          hall: notice.hall_id,
          scope: getScopeType(notice.scope),
          posted_date: new Date().toLocaleDateString(),
        }))
        .sort((a, b) => b.id - a.id); // Sorting by id in descending order

      setNotices(transformedNotices);
      setError(null);
    } catch (err) {
      console.error("Error fetching notices:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch notices. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotices();
  }, []);

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
      <Text
        align="left"
        mb="xl"
        size="24px"
        style={{ color: "#757575", fontWeight: "bold" }}
      >
        Hostel Notice Board
      </Text>

      <ScrollArea style={{ flex: 1, height: "calc(66vh)" }}>
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
        ) : notices.length === 0 ? (
          <Empty />
        ) : (
          <Stack spacing="md" pb="md">
            {notices.map((notice) => (
              <Paper
                key={notice.id}
                p="md"
                withBorder
                shadow="xs"
                sx={(theme) => ({
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor:
                    notice.scope === "global"
                      ? theme.colors.yellow[0]
                      : theme.white,
                  borderColor:
                    notice.scope === "global"
                      ? theme.colors.yellow[5]
                      : theme.colors.gray[3],
                })}
              >
                <Text
                  size="lg"
                  weight={notice.scope === "global" ? "bold" : "normal"}
                >
                  {notice.head_line}
                </Text>

                <Text size="md" color="gray" mt="xs">
                  {notice.content}
                </Text>

                <Text size="sm" color="dimmed" mt="xs">
                  {notice.description}
                </Text>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Badge
                    size="lg"
                    variant={notice.scope === "global" ? "filled" : "outline"}
                    color={notice.scope === "global" ? "yellow" : "blue"}
                    style={{ flex: 1 }}
                  >
                    {notice.hall}
                  </Badge>

                  <div
                    style={{ flex: 7.5, textAlign: "right", color: "#757575" }}
                  >
                    Posted by: {notice.posted_by}
                  </div>
                </div>
              </Paper>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Paper>
  );
}

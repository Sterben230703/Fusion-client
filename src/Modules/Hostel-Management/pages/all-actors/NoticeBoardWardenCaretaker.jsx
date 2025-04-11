import React, { useState, useEffect } from "react";
import {
  Paper,
  Text,
  Badge,
  Stack,
  ScrollArea,
  Loader,
  Container,
  Button,
  Modal,
  Group,
  CloseButton,
} from "@mantine/core";
import axios from "axios";
import CreateNotice from "../../components/warden/CreateNotice";
import {
  getNotices,
  deleteNotice,
} from "../../../../routes/hostelManagementRoutes";
import { Empty } from "../../../../components/empty";

const getScopeType = (scope) => (scope === "1" ? "global" : "hall");

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);

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
      console.log(response);

      const transformedNotices = response.data
        .map((notice) => ({
          ...notice,
          hall: notice.hall_id,
          scope: getScopeType(notice.scope),
          posted_date: new Date().toLocaleDateString(),
        }))
        .sort((a, b) => b.id - a.id); // Sort notices by ID in descending order

      setNotices(transformedNotices);
      setError(null);
    } catch (err) {
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

  const handleDeleteNotice = async (noticeId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        deleteNotice,
        { id: noticeId },
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      if (response.status === 200) {
        setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));
        console.log("Notice deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting notice:", err);
      setError("Failed to delete notice. Please try again.");
    }
  };

  const handleCreateNoticeSubmit = (announcement) => {
    console.log("New announcement:", announcement);
    setIsCreateNoticeOpen(false);
  };

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
      <Group position="apart" mb="xl">
        <Text size="24px" style={{ color: "#757575", fontWeight: "bold" }}>
          Hostel Notice Board
        </Text>
        <Button onClick={() => setIsCreateNoticeOpen(true)}>
          Create Notice
        </Button>
      </Group>

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
                <Group position="apart" align="flex-start">
                  <Text
                    size="lg"
                    weight={notice.scope === "global" ? "bold" : "normal"}
                  >
                    {notice.head_line}
                  </Text>
                </Group>

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
                  <CloseButton
                    variant="transparent"
                    onClick={() => handleDeleteNotice(notice.id)}
                  />
                </div>
              </Paper>
            ))}
          </Stack>
        )}
      </ScrollArea>
      <Modal
        opened={isCreateNoticeOpen}
        onClose={() => setIsCreateNoticeOpen(false)}
        size="lg"
      >
        <CreateNotice onSubmit={handleCreateNoticeSubmit} />
      </Modal>
    </Paper>
  );
}

import {
  Container,
  Loader,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Paper,
  Text,
  CloseButton,
} from "@mantine/core";
import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Empty } from "../../../components/empty";
import {
  notificationReadRoute,
  notificationDeleteRoute,
  notificationUnreadRoute,
  getNotificationsRoute,
} from "../../../routes/dashboardRoutes";

function NotificationItem({
  notification,
  markAsRead,
  deleteNotification,
  markAsUnread,
  loading,
}) {
  const { module } = notification.data;

  return (
    <Grid.Col span={{ base: 12, md: 6 }} key={notification.id}>
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{ borderLeft: "0.6rem solid #15ABFF" }}
        withBorder
        maw="1240px"
      >
        <Flex justify="space-between">
          <Flex direction="column">
            <Flex gap="md">
              <Text fw={600} size="1.2rem" mb="0.4rem">
                {notification.verb}
              </Text>
              <Badge color="#15ABFF">{module || "N/A"}</Badge>
            </Flex>
            <Text c="#6B6B6B" size="0.7rem">
              {new Date(notification.timestamp).toLocaleDateString()}
            </Text>
            <Divider my="sm" w="10rem" />
          </Flex>
          <CloseButton
            variant="transparent"
            style={{ cursor: "pointer" }}
            onClick={() => deleteNotification(notification.id)}
          />
        </Flex>
        <Flex justify="space-between">
          <Text>{notification.description || "No description available."}</Text>
          <Button
            variant="filled"
            color={notification.unread ? "blue" : "gray"}
            onClick={() =>
              notification.unread
                ? markAsRead(notification.id)
                : markAsUnread(notification.id)
            }
            loaderProps={{ type: "dots" }}
            loading={loading === notification.id}
            style={{ cursor: "pointer" }}
            ml="sm"
            miw="120px"
          >
            {notification.unread ? "Mark as read" : "Unread"}
          </Button>
        </Flex>
      </Paper>
    </Grid.Col>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    verb: PropTypes.string.isRequired,
    description: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    data: PropTypes.shape({
      module: PropTypes.string,
      flag: PropTypes.string,
    }),
    unread: PropTypes.bool.isRequired,
  }).isRequired,
  markAsRead: PropTypes.func.isRequired,
  markAsUnread: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  loading: PropTypes.number.isRequired,
};

function Notifications() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);

  // Does below two states really needed?

  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState("0");
  // eslint-disable-next-line no-unused-vars
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const [loading, setLoading] = useState(false);
  const [read_Loading, setRead_Loading] = useState(-1);
  const dispatch = useDispatch();
  // const tabsListRef = useRef(null);
  // const tabItems = [{ title: "Notifications" }, { title: "Announcements" }];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");

      try {
        setLoading(true);
        const { data } = await axios.get(getNotificationsRoute, {
          headers: { Authorization: `Token ${token}` },
        });
        const { notifications } = data;
        const notificationsData = notifications.map((item) => ({
          ...item,
          data: JSON.parse(item.data.replace(/'/g, '"')),
        }));

        setNotificationsList(
          notificationsData.filter(
            (item) => item.data?.flag !== "announcement",
          ),
        );
        setAnnouncementsList(
          notificationsData.filter(
            (item) => item.data?.flag === "announcement",
          ),
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // Module team has not used this yet So commenting it out to avoid eslint error

  // const handleTabChange = (direction) => {
  //   const newIndex =
  //     direction === "next"
  //       ? Math.min(+activeTab + 1, tabItems.length - 1)
  //       : Math.max(+activeTab - 1, 0);
  //   setActiveTab(String(newIndex));
  //   tabsListRef.current.scrollBy({
  //     left: direction === "next" ? 50 : -50,
  //     behavior: "smooth",
  //   });
  // };

  const notificationsToDisplay =
    activeTab === "1" ? announcementsList : notificationsList;

  // Unused Code hence commenting it out

  // const notification_for_badge_count =
  //   activeTab === "0" ? announcementsList : notificationsList;

  // const notification_count = notification_for_badge_count.filter(
  //   (n) => !n.deleted && n.unread,
  // ).length;

  // sortMap is an object that maps sorting categories to sorting functions.
  const sortedNotifications = useMemo(() => {
    const sortMap = {
      "Most Recent": (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      Tags: (a, b) => a.data.module.localeCompare(b.data.module),
      Title: (a, b) => a.verb.localeCompare(b.verb),
    };
    return [...notificationsToDisplay].sort(sortMap[sortedBy]);
  }, [sortedBy, notificationsToDisplay]);

  const markAsRead = async (notifId) => {
    const token = localStorage.getItem("authToken");
    try {
      setRead_Loading(notifId);
      const response = await axios.post(
        notificationReadRoute,
        { id: notifId },
        { headers: { Authorization: `Token ${token}` } },
      );
      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: false } : notif,
          ),
        );
        setAnnouncementsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: false } : notif,
          ),
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    } finally {
      setRead_Loading(-1);
    }
  };

  const markAsUnread = async (notifId) => {
    const token = localStorage.getItem("authToken");
    try {
      setRead_Loading(notifId);
      const response = await axios.post(
        notificationUnreadRoute,
        { id: notifId },
        { headers: { Authorization: `Token ${token}` } },
      );
      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: true } : notif,
          ),
        );
        setAnnouncementsList((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, unread: true } : notif,
          ),
        );
      }
    } catch (err) {
      console.error("Error marking notification as unread:", err);
    } finally {
      setRead_Loading(-1);
    }
  };

  const deleteNotification = async (notifId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        notificationDeleteRoute,
        { id: notifId },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setNotificationsList((prev) =>
          prev.filter((notif) => notif.id !== notifId),
        );
        setAnnouncementsList((prev) =>
          prev.filter((notif) => notif.id !== notifId),
        );

        console.log("Notification deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <Grid mt="xl">
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : sortedNotifications.filter((notification) => !notification.deleted)
          .length === 0 ? (
        <Empty />
      ) : (
        sortedNotifications
          .filter((notification) => !notification.deleted)
          .map((notification) => (
            <NotificationItem
              notification={notification}
              key={notification.id}
              markAsRead={markAsRead}
              markAsUnread={markAsUnread}
              deleteNotification={deleteNotification}
              loading={read_Loading}
            />
          ))
      )}
    </Grid>
  );
}

export default Notifications;

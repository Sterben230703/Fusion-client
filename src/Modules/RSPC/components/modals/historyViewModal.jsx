import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Badge,
  Card,
  Group,
  Loader,
  Container,
  Divider,
} from "@mantine/core";
import axios from "axios";
import { fetchFileTrackingHistoryRoute } from "../../../../routes/RSPCRoutes";
import { badgeColor } from "../../helpers/badgeColours";

function HistoryViewModal({ opened, onClose, file }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);
  const [historyDetails, setHistoryDetails] = useState({});
  const [approval, setApproval] = useState("Pending");
  useEffect(() => {
    if (opened && file) {
      setLoading(true);
      const fetchFile = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");
        try {
          const response = await axios.get(
            fetchFileTrackingHistoryRoute(file),
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            },
          );
          console.log("Fetched File Tracking History:", response.data);
          const sortedHistoryDetails = response.data.historyData.sort(
            (a, b) => new Date(a.forward_date) - new Date(b.forward_date),
          );
          setHistoryDetails(sortedHistoryDetails);
          setApproval(response.data.approval);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
          setFetched(false);
        }
      };
      fetchFile();
    }
  }, [file]);

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : historyDetails && Array.isArray(historyDetails) && fetched ? (
        <>
          <Group position="apart" style={{ marginBottom: 30 }}>
            <Text size="32px" weight={700}>
              {historyDetails[0].tracking_extra_JSON["tracker heading"]}
            </Text>
            <Badge
              color={badgeColor[approval]}
              size="lg"
              style={{ fontSize: "18px" }}
            >
              {approval}
            </Badge>
          </Group>

          <Text
            fw={700}
            size="26px"
            style={{ marginBottom: 10, color: "#15ABFF", textAlign: "center" }}
          >
            File Tracking History
          </Text>
          <Divider my="sm" size="md" />

          {historyDetails.map((entry, index) => (
            <Card
              key={index}
              shadow="md"
              padding="lg"
              radius="md"
              my="10px"
              withBorder
              sx={{
                marginBottom: "15px",
              }}
            >
              <Group position="apart" mb="xs">
                <Text>
                  Sent by:{" "}
                  <Text fw={700} component="span">
                    {entry.current_id}
                  </Text>
                </Text>
                <Text size="sm" color="dimmed">
                  <Text fw={700} component="span">
                    {new Date(entry.forward_date).toLocaleString()}
                  </Text>
                </Text>
              </Group>
              <Text mb="xs">
                Received by:{" "}
                <Text fw={700} component="span">
                  {entry.tracking_extra_JSON.receiver}
                </Text>
              </Text>
              <Text mb="xs">
                Remarks: {entry.remarks || "No remarks provided"}
              </Text>
            </Card>
          ))}
        </>
      ) : (
        <Text color="red" size="xl" weight={700} align="center">
          Failed to load file tracking history
        </Text>
      )}
    </Modal>
  );
}

HistoryViewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.number.isRequired,
};

export default HistoryViewModal;

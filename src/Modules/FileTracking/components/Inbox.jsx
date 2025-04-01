import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Title,
  Table,
  ActionIcon,
  Tooltip,
  TextInput,
  Group,
  Modal,
  Text,
  Button,
} from "@mantine/core";
import {
  Archive,
  Eye,
  CaretUp,
  CaretDown,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import View from "./ViewFile";
import {
  getFilesRoute,
  createArchiveRoute,
} from "../../../routes/filetrackingRoutes";

export default function Inboxfunc() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  let current_module = useSelector((state) => state.module.current_module);
  current_module = current_module.split(" ").join("").toLowerCase();

  // New state for archive confirmation modal
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedArchiveFile, setSelectedArchiveFile] = useState(null);

  // Helper function to convert dates
  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  // Fetch files on component mount
  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(`${getFilesRoute}`, {
          params: {
            username,
            designation: role,
            src_module: current_module,
          },
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log("Inbox: ", response.data);
        setFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    getFiles();
  }, [username, role, current_module, token]);

  const handleArchive = async (fileID) => {
    try {
      await axios.post(
        `${createArchiveRoute}`,
        { file_id: fileID },
        {
          params: {
            username,
            designation: role,
            src_module: current_module,
          },
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const updatedFiles = files.filter((file) => file.id !== fileID);
      setFiles(updatedFiles);
      notifications.show({
        title: "File archived",
        message: "The file has been successfully archived",
        color: "green",
      });
    } catch (err) {
      console.error("Error archiving file:", err);
    }
  };

  const handleBack = () => {
    setSelectedFile(null);
  };
  const sortedFiles = [...files].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
  });

  const filteredFiles = sortedFiles.filter(
    (file) =>
      file.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.id.toString().includes(searchQuery) ||
      file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convertDate(file.upload_date).includes(searchQuery),
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Using e.currentTarget ensures the style is applied to the ActionIcon element
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = e.currentTarget.dataset.hoverColor;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor =
      e.currentTarget.dataset.defaultColor;
  };

  // Archive modal functions
  const openArchiveModal = (file) => {
    setSelectedArchiveFile(file);
    setShowArchiveModal(true);
  };

  const confirmArchive = () => {
    if (selectedArchiveFile) {
      handleArchive(selectedArchiveFile.id);
      setShowArchiveModal(false);
      setSelectedArchiveFile(null);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#F5F7F8",
        position: "absolute",
        height: "70vh",
        width: "90vw",
        overflowY: "auto",
      }}
    >
      {!selectedFile && (
        <Group position="apart" mb="md">
          <Title
            order={2}
            mb="md"
            style={{
              fontSize: "24px",
            }}
          >
            Inbox
          </Title>
          <TextInput
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "10px", marginLeft: "auto" }}
          />
        </Group>
      )}

      {selectedFile ? (
        <div>
          <Title
            order={3}
            mb="md"
            style={{
              fontSize: "26px",
            }}
          >
            File Subject
          </Title>
          <View
            onBack={handleBack}
            fileID={selectedFile.id}
            updateFiles={() =>
              setFiles(files.filter((f) => f.id !== selectedFile.id))
            }
          />
        </div>
      ) : (
        <Box
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflowY: "auto",
            height: "56vh",
            backgroundColor: "#fff",
          }}
        >
          <Table
            highlightOnHover
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                <th data-label="">Archive</th>
                {[
                  "File ID",
                  "uploader",
                  "designation",
                  "subject",
                  "upload_date",
                ].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      padding: "12px",
                      width: "15.5%",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      display: "align-items",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {key === "uploader"
                      ? "Sent By"
                      : key === "upload_date"
                        ? "Date"
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortConfig.key === key ? (
                      sortConfig.direction === "asc" ? (
                        <CaretUp size={16} />
                      ) : (
                        <CaretDown size={16} />
                      )
                    ) : (
                      <ArrowsDownUp size={16} opacity={0.6} />
                    )}
                  </th>
                ))}
                <th
                  style={{
                    padding: "12px",
                    width: "8.5%",
                    border: "1px solid ##ddd",
                  }}
                >
                  View File
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Tooltip label="Archive file" position="top" withArrow>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        className="archive-icon"
                        data-default-color="transparent"
                        data-hover-color="#ffebee"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => openArchiveModal(file)}
                      >
                        <Archive size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.branch}-{new Date(file.upload_date).getFullYear()}-
                    {(new Date(file.upload_date).getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}
                    -#{file.id}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                    data-label="Sent By"
                  >
                    {file.sent_by_user}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                    data-label="Sent By"
                  >
                    {file.sent_by_designation}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.subject}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {convertDate(file.upload_date)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                    data-label=""
                  >
                    <Tooltip label="View File" position="top" withArrow>
                      <ActionIcon
                        variant="light"
                        color="black"
                        style={{
                          transition: "background-color 0.3s",
                          width: "2rem",
                          height: "2rem",
                        }}
                        onClick={() => setSelectedFile(file)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#E3F2FD";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        <Eye size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      )}
      {/* Archive Confirmation Modal */}
      <Modal
        opened={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        title={
          <Text align="center" weight={600} size="lg">
            Confirm Archive
          </Text>
        }
        centered
      >
        <Text weight={600} mb="md">
          Are you sure you want to archive this file?
        </Text>
        {selectedArchiveFile && (
          <>
            <Text mb="ls">Subject: {selectedArchiveFile.subject}</Text>
            <Text mb="md">File ID: #{selectedArchiveFile.id}</Text>
          </>
        )}
        <Group justify="center" gap="xl" style={{ width: "100%" }}>
          <Button
            onClick={confirmArchive}
            color="blue"
            style={{ width: "120px" }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setShowArchiveModal(false)}
            variant="outline"
            style={{ width: "120px" }}
          >
            Cancel
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}

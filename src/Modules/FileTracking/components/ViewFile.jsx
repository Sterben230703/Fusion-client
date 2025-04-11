/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from "react";
import {
  Card,
  Textarea,
  Button,
  Title,
  Group,
  Table,
  FileInput,
  Select,
  Box,
  TextInput,
  Divider,
  Grid,
  Autocomplete,
  Modal,
  Text,
} from "@mantine/core";
import PropTypes from "prop-types";

import { notifications } from "@mantine/notifications";
import axios from "axios";
import {
  ArrowLeft,
  DownloadSimple,
  PaperPlaneTilt,
  Trash,
  Upload,
} from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  createFileRoute,
  designationsRoute,
  forwardFileRoute,
  getUsernameRoute,
  historyRoute,
} from "../../../routes/filetrackingRoutes";
import { host } from "../../../routes/globalRoutes";

export default function ViewFile({ onBack, fileID, updateFiles }) {
  // State management
  const [activeSection, setActiveSection] = useState(null);
  const [file, setFile] = useState({});
  const [uploadedFile, setUploadedFile] = useState("");
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [receiver_username, setReceiverUsername] = useState("");
  const [receiver_designation, setReceiverDesignation] = useState("");
  const [receiver_designations, setReceiverDesignations] = useState("");
  const [current_receiver, setCurrentReceiver] = useState("");
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [files, setFiles] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const token = localStorage.getItem("authToken");
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedForwardFile, setSelectedForwardFile] = useState(null);
  const openForwardModal = (x) => {
    setSelectedForwardFile(x);
    setShowForwardModal(true);
  };
  const receiverRoles = Array.isArray(receiver_designations)
    ? receiver_designations.map((role) => ({
        value: role,
        label: role,
      }))
    : [];
  const currentUser = useSelector((state) => state.user.roll_no);
  // Helper function to format dates
  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };
  const removeFile = () => {
    setFiles(null);
  };

  const handleOpenRemarksModal = (x) => {
    setSelectedRemarks(x);
    setOpened(true);
  };

  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await axios.get(`${createFileRoute}${fileID}`, {
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setFile(response.data);
        setSelectedForwardFile(response.data);
        setUploadedFile(response.data.upload_file);
        console.log("File: ", response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    const getHistory = async () => {
      try {
        const response = await axios.get(`${historyRoute}${fileID}`, {
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setTrackingHistory(response.data);
        setCurrentReceiver(response.data[0].receiver_id);
        console.log("Tracking: ", response.data);
      } catch (err) {
        console.log("Error fetching tracking history");
      }
    };
    getFile();
    getHistory();
  }, [fileID, token]);
  useEffect(() => {
    let isMounted = true;
    const getUsernameSuggestion = async () => {
      try {
        const response = await axios.post(
          `${getUsernameRoute}`,
          { value: receiver_username },
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        const users = JSON.parse(response.data.users);
        // Ensure response.data.users is an array before mapping
        if (response.data && Array.isArray(users)) {
          const suggestedUsernames = users.map((user) => user.fields.username);
          console.log(suggestedUsernames);
          if (isMounted) {
            setUsernameSuggestions(suggestedUsernames);
          }
        }
      } catch (error) {
        console.error("Error fetching username suggestion:", error);
      }
    };

    if (receiver_username) {
      getUsernameSuggestion();
    }

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [receiver_username, token]);

  // Fetch designations when a user is selected
  const fetchRoles = async () => {
    if (!receiver_username || receiver_username === "") return "";
    try {
      const response = await axios.get(
        `${designationsRoute}${receiver_username}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setReceiverDesignations(response.data.designations);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        console.warn("Retrying fetchRoles in 2 seconds...");
      }
    }
  };
  // Toggle sections (forward/delete/etc)
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleFileChange = (data) => {
    setFiles(data);
  };

  // Handle file forwarding
  const handleForward = async () => {
    if (!receiver_username || !receiver_designation) {
      notifications.show({
        title: "Missing information",
        message: "Please select both receiver and designation",
        color: "red",
        position: "top-center",
      });
      return;
    }

    setIsForwarding(true);
    try {
      const formData = new FormData();
      files.forEach((fileItem, index) => {
        const fileAttachment =
          fileItem instanceof File
            ? fileItem
            : new File([fileItem], `uploaded_file_${index}`, {
                type: "application/octet-stream",
              });
        formData.append("files", fileAttachment); // Append each file
      });
      formData.append("receiver", receiver_username);
      formData.append("receiver_designation", receiver_designation);
      formData.append("remarks", remarks);
      const response = await axios.post(
        `${forwardFileRoute}${fileID}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      if (response.status === 201) {
        notifications.show({
          title: "File forwarded successfully",
          message: "The file has forwarded sent successfully.",
          color: "green",
          position: "top-center",
        });
        console.log(response.data);
        setIsForwarding(false);
        setActiveSection(null);
        setReceiverDesignation("");
        setReceiverUsername("");
        setRemarks("");
        setFiles(null);
      }
    } catch (err) {
      console.log(err);
      setIsForwarding(false);
    }
  };
  const confirmForward = () => {
    if (selectedForwardFile) {
      handleForward();
      setShowForwardModal(false);
      setSelectedForwardFile(null);
      toggleSection(null);
      updateFiles();
      onBack();
    }
  };
  // Handle file download
  const downloadAttachment = (url) => {
    window.open(`${host}${url}`, "_blank");
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "10vh",
        padding: "2rem",
      }}
    >
      {/* File Details: ViewFile */}
      <div>
        <Group position="apart" mb="lg">
          <Button variant="subtle" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <Title order={3} style={{ textAlign: "center", flex: 1 }}>
            {file.branch}-{new Date(file.upload_date).getFullYear()}-
            {(new Date(file.upload_date).getMonth() + 1)
              .toString()
              .padStart(2, "0")}
            -#{file.id}: {file?.subject || "File Details"}
          </Title>
        </Group>

        <Divider mb="lg" />

        <Box mb="md">
          <Textarea
            label="File Content"
            placeholder="No content available"
            value={file?.description || ""}
            readOnly
          />
        </Box>

        <Box mb="md">
          <TextInput
            label="File ID"
            value={file?.id || "Not available"}
            readOnly
          />
        </Box>

        <Box mb="md">
          <TextInput
            label="Upload Date"
            value={
              file?.upload_date
                ? convertDate(file.upload_date)
                : "Not available"
            }
            readOnly
          />
        </Box>

        <Box mb="md">
          <TextInput
            label="Department"
            value={file?.src_module || "Not available"}
            readOnly
          />
        </Box>

        <Box mb="md">
          <TextInput
            label="Sender"
            value={file?.uploader || "Not available"}
            readOnly
          />
        </Box>

        <Box mb="md">
          <TextInput
            label="Attachment"
            value={file?.upload_file?.split("/").pop() || "No attachment"}
            readOnly
          />
        </Box>
      </div>
      {/* Tracking History of the File */}
      <Title order={4} mt="xl" mb="md">
        Tracking History
      </Title>
      <Box
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflowY: "auto",
          overflowX: "auto",
          backgroundColor: "#fff",
        }}
      >
        <Table
          highlightOnHover
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontSize: "12px", // Reduced font size
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px", // Reduced padding
                  width: "9%",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: "8px", // Reduced padding
                  width: "13%",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Sender
              </th>
              <th
                style={{
                  padding: "8px", // Reduced padding
                  width: "13%",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Receiver
              </th>
              <th
                style={{
                  padding: "8px", // Reduced padding
                  width: "13%",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Designation
              </th>
              <th
                style={{
                  padding: "8px", // Reduced padding
                  width: "20%",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Remarks
              </th>
              <th
                style={{
                  padding: "8px", // Reduced padding
                  width: "10%",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Attachment
              </th>
            </tr>
          </thead>
          <tbody>
            {trackingHistory.map((track, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "8px", // Reduced padding
                    textAlign: "center",
                    border: "1px solid #ddd",
                    wordWrap: "break-word", // Prevent overflow
                  }}
                >
                  {convertDate(track.forward_date)}
                </td>
                <td
                  style={{
                    padding: "8px", // Reduced padding
                    textAlign: "center",
                    border: "1px solid #ddd",
                    wordWrap: "break-word", // Prevent overflow
                  }}
                >
                  {track.current_id}
                </td>
                <td
                  style={{
                    padding: "8px", // Reduced padding
                    textAlign: "center",
                    border: "1px solid #ddd",
                    wordWrap: "break-word", // Prevent overflow
                  }}
                >
                  {track.receiver_id}
                </td>
                <td
                  style={{
                    padding: "8px", // Reduced padding
                    textAlign: "center",
                    border: "1px solid #ddd",
                    wordWrap: "break-word", // Prevent overflow
                  }}
                >
                  {track.receive_design}
                </td>
                <td
                  style={{
                    padding: "8px", // Reduced padding
                    textAlign: "center",
                    border: "1px solid #ddd",
                    wordWrap: "break-word", // Prevent overflow
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenRemarksModal(track.remarks || "-")}
                >
                  {track.remarks && track.remarks.length > 15
                    ? `${track.remarks.slice(0, 15)}...`
                    : track.remarks || "-"}
                </td>
                <td
                  style={{
                    padding: "8px", // Reduced padding
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {(
                    index === trackingHistory.length - 1
                      ? uploadedFile
                      : track.upload_file
                  ) ? (
                    <Button
                      variant="subtle"
                      size="xs"
                      leftIcon={<DownloadSimple size={16} />}
                      onClick={() =>
                        downloadAttachment(
                          index === trackingHistory.length - 1
                            ? uploadedFile
                            : track.upload_file,
                        )
                      }
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        fontSize: "10px", // Reduced font size
                      }}
                    >
                      Download
                    </Button>
                  ) : (
                    "File not found"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal to show remarks */}
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Full Remarks"
          size="lg"
        >
          <Text style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {selectedRemarks}
          </Text>
        </Modal>
      </Box>
      <Group position="center" mt="lg" spacing="xl">
        <Button
          leftIcon={<PaperPlaneTilt size={20} />}
          onClick={() => toggleSection("forward")}
          disabled={current_receiver !== currentUser} // Disable if the current user is not the latest receiver.
        >
          Forward
        </Button>
        {file?.upload_file && (
          <Button
            leftIcon={<DownloadSimple size={20} />}
            onClick={() => {
              trackingHistory.forEach((track) => {
                if (track.upload_file) {
                  downloadAttachment(track.upload_file);
                }
              });
              if (file.upload_file) {
                downloadAttachment(file.upload_file);
              }
            }}
          >
            Download All Attachments
          </Button>
        )}
      </Group>

      {activeSection === "forward" && (
        <Card
          shadow="xs"
          padding="md"
          mt="xl"
          style={{
            backgroundColor: "#F9FAFB",
            border: "1px solid #E0E6ED",
          }}
        >
          <Grid mb="sm" gutter="sm">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Autocomplete
                label="Forward To"
                placeholder="Enter forward recipient"
                value={receiver_username}
                data={usernameSuggestions} // Pass the array of suggestions
                onChange={(value) => {
                  setReceiverDesignation("");
                  setReceiverUsername(value);
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Receiver Designation"
                placeholder="Select designation"
                onClick={() => {
                  if (receiverRoles.length === 0) {
                    fetchRoles();
                  }
                }}
                value={receiver_designation} // Use receiver_designation (string)
                data={receiverRoles} // Ensure this is populated correctly
                onChange={(value) => setReceiverDesignation(value)}
                searchable // Allows searching for designations
                nothingFound="No designations found"
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Remarks"
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => {
              const words = e.currentTarget.value.trim().split(/\s+/);
              if (words.length < 50) {
                setRemarks(e.currentTarget.value);
              }
            }}
            mb="md"
          />

          <Text align="right">{remarks.split(/\s+/).length} / 50 words</Text>

          <FileInput
            label="Attach file (PDF, JPG, PNG) (MAX: 10MB)"
            placeholder="Upload file"
            accept="application/pdf,image/jpeg,image/png"
            icon={<Upload size={16} />}
            value={files} // Set the file state as the value
            onChange={handleFileChange} // Update file state on change
            mb="sm"
            multiple
          />

          <Group position="right">
            <Button
              variant="outline"
              onClick={() => {
                setActiveSection(null);
                setIsForwarding(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={() => openForwardModal(file)}
              loading={isForwarding}
            >
              Forward File
            </Button>
            {files && (
              // <Group position="apart" mt="sm">
              <Button
                leftIcon={<Trash size={16} />}
                color="red"
                onClick={removeFile}
                compact
              >
                Remove File
              </Button>
              // </Group>
            )}
          </Group>
        </Card>
      )}
      <Modal
        opened={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        title={
          <Text align="center" weight={600} size="lg">
            Confirm Forward
          </Text>
        }
        centered
      >
        <Text weight={600} mb="md">
          Are you sure you want to forward this file?
        </Text>
        {selectedForwardFile && (
          <>
            <Text mb="ls">Subject: {selectedForwardFile.subject}</Text>
            <Text mb="md">
              {" "}
              File ID: {selectedForwardFile.branch}-
              {new Date(selectedForwardFile.upload_date).getFullYear()}-
              {(new Date(selectedForwardFile.upload_date).getMonth() + 1)
                .toString()
                .padStart(2, "0")}
              -#{selectedForwardFile.id}
            </Text>
          </>
        )}
        <Group justify="center" gap="xl" style={{ width: "100%" }}>
          <Button
            onClick={confirmForward}
            color="blue"
            style={{ width: "120px" }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setShowForwardModal(false)}
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

ViewFile.propTypes = {
  onBack: PropTypes.func.isRequired,
  fileID: PropTypes.number.isRequired,
  updateFiles: PropTypes.func.isRequired,
};

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Title,
  Table,
  Button,
  ActionIcon,
  Tooltip,
  Modal,
  Text,
  Group,
} from "@mantine/core";
import { Archive, PencilSimple } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useSelector } from "react-redux";
import EditDraft from "./EditDraft";
import {
  createArchiveRoute,
  createFileRoute,
  getDraftRoute,
} from "../../../routes/filetrackingRoutes";

export default function Draft() {
  const [files, setFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // New state for archive confirmation modal
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedArchiveFile, setSelectedArchiveFile] = useState(null);

  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  let current_module = useSelector((state) => state.module.current_module);
  current_module = current_module.split(" ").join("").toLowerCase();

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(`${getDraftRoute}`, {
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
        });
        setFiles(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    getFiles();
  }, [username, role, current_module, token]);

  const [editFile, setEditFile] = useState(null); // File being edited

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

  const handleDeleteFile = async (fileID) => {
    await axios.delete(`${createFileRoute}${fileID}`, {
      withCredentials: true,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileID));
    notifications.show({
      title: "File deleted",
      message: "The file has been successfully deleted",
      color: "red",
    });
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

  // Delete modal functions
  const openDeleteModal = (file) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedFile) {
      handleDeleteFile(selectedFile.id);
      setShowDeleteModal(false);
      setSelectedFile(null);
    }
  };

  const handleEditFile = (file) => {
    setEditFile(file); // Set the file to edit mode
  };

  const handleBack = () => {
    setEditFile(null); // Exit edit mode and go back
  };

  return (
    <>
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
        {!editFile && (
          <Title
            order={2}
            mb="md"
            style={{
              fontSize: "24px",
            }}
          >
            Drafts
          </Title>
        )}

        {editFile ? (
          <EditDraft
            file={editFile}
            onBack={handleBack}
            deleteDraft={(file) => openDeleteModal(file)}
          />
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
                tableLayout: "auto",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#0000" }}>
                  <th
                    style={{
                      padding: "12px",
                      width: "8%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Archive
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "12%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Created By
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "12%",
                      border: "1px solid #ddd",
                    }}
                  >
                    File ID
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "33%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Subject
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "33%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "33%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Remarks
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "12.5%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Delete draft
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      width: "8.5%",
                      border: "1px solid #ddd",
                    }}
                  >
                    Edit Draft
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      <Tooltip label="Archive file" position="top" withArrow>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => openArchiveModal(file)}
                          style={{
                            transition: "background-color 0.3s",
                            width: "2rem",
                            height: "2rem",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffebee";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
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
                      {file.uploader}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {new Date(file.upload_date).getFullYear()}-
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
                    >
                      {file.file_extra_JSON.subject}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {file.file_extra_JSON.description}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {file.file_extra_JSON.remarks}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        color="blue"
                        variant="outline"
                        style={{
                          transition: "background-color 0.3s",
                          fontSize: "0.9rem",
                          padding: "0.5rem 1rem",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#e3f2fd";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "white";
                        }}
                        onClick={() => openDeleteModal(file)}
                      >
                        Delete file
                      </Button>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <ActionIcon
                        variant="outline"
                        color="black"
                        style={{
                          transition: "background-color 0.3s",
                          width: "2rem",
                          height: "2rem",
                        }}
                        onClick={() => handleEditFile(file)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#e0e0e0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <PencilSimple size="1rem" />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        )}
      </Card>

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
        <Text weight={600} mb="ls">
          Are you sure you want to archive this file?
        </Text>
        {selectedArchiveFile && (
          <>
            <Text mb="ls">
              Subject: {selectedArchiveFile.file_extra_JSON.subject}
            </Text>
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

      {/* Delete Confirmation Modal */}
      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={
          <Text align="center" weight={600} size="lg">
            Confirm Deletion
          </Text>
        }
        centered
      >
        <Text weight={600} mb="ls">
          Do you want to delete this file?
        </Text>
        {selectedFile && (
          <>
            <Text mb="ls">Subject: {selectedFile.file_extra_JSON.subject}</Text>
            <Text mb="md">File ID: #{selectedFile.id}</Text>
          </>
        )}
        <Group justify="center" gap="xl" style={{ width: "100%" }}>
          <Button
            onClick={confirmDelete}
            color="blue"
            style={{ width: "120px" }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setShowDeleteModal(false)}
            variant="outline"
            style={{ width: "120px" }}
          >
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  );
}

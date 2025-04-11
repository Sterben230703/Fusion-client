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
  TextInput,
  Pagination,
} from "@mantine/core";
import {
  Archive,
  CaretUp,
  CaretDown,
  ArrowsDownUp,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 7;

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

  const sortedFiles = [...files].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    if (sortConfig.key === "file_id") {
      return direction * (a.id - b.id);
    }

    if (sortConfig.key === "subject") {
      return (
        direction *
        a.file_extra_JSON.subject.localeCompare(b.file_extra_JSON.subject)
      );
    }

    if (sortConfig.key === "description") {
      return (
        direction *
        a.file_extra_JSON.description.localeCompare(
          b.file_extra_JSON.description,
        )
      );
    }

    if (sortConfig.key === "remarks") {
      return (
        direction *
        a.file_extra_JSON.remarks.localeCompare(b.file_extra_JSON.remarks)
      );
    }

    return direction * (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1);
  });

  const filteredFiles = sortedFiles.filter((file) => {
    const idString = `${file.branch}-${new Date(file.upload_date).getFullYear()}-${(new Date(file.upload_date).getMonth() + 1).toString().padStart(2, "0")}-#${file.id}`;
    return (
      idString.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.file_extra_JSON.subject
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      file.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.file_extra_JSON.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      file.file_extra_JSON.remarks
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const handlePageJump = (e) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(pageInput, 10);
      const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
      if (
        Number.isNaN(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > totalPages
      ) {
        setPageInput("");
        return;
      }
      setCurrentPage(pageNumber);
      setPageInput("");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredFiles.length);

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
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        {!editFile && (
          <Group position="apart" mb="md">
            <Title
              order={2}
              mb="md"
              style={{
                fontSize: "24px",
              }}
            >
              Drafts
            </Title>
            <TextInput
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ marginBottom: "10px", marginLeft: "auto" }}
            />
          </Group>
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
              overflowY: "hidden",
              height: "calc(57vh - 20px)",
              minHeight: "300px",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              marginBottom: 0,
            }}
          >
            <div style={{ flex: 1, overflowY: "hidden", marginBottom: "-1px" }}>
              <Table
                highlightOnHover
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                  fontSize: "14px",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 1,
                  }}
                >
                  <tr style={{ backgroundColor: "#0000" }}>
                    <th
                      style={{
                        padding: "6px",
                        width: "7%",
                        height: "36px",
                      }}
                    >
                      Archive
                    </th>
                    {[
                      { key: "file_id", label: "File ID" },
                      { key: "uploader", label: "Created By" },
                      { key: "subject", label: "Subject" },
                      { key: "description", label: "Description" },
                      { key: "remarks", label: "Remarks" },
                      { key: "upload_date", label: "Date" },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        style={{
                          cursor: "pointer",
                          padding: "10px",
                          width: "14%",
                          border: "1px solid #0000",
                          alignItems: "center",
                          gap: "5px",
                          height: "36px",
                        }}
                      >
                        {label}
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
                        padding: "6px",
                        width: "7%",
                        border: "1px solid #ddd",
                        height: "36px",
                      }}
                    >
                      Edit
                    </th>
                    <th
                      style={{
                        padding: "6px",
                        width: "7%",
                        border: "1px solid #ddd",
                        height: "36px",
                      }}
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage,
                    )
                    .map((file, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            height: "36px",
                          }}
                        >
                          <Tooltip
                            label="Archive file"
                            position="top"
                            withArrow
                          >
                            <ActionIcon
                              variant="light"
                              color="blue"
                              className="archive-icon"
                              data-default-color="transparent"
                              data-hover-color="#ffebee"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#ffebee";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                              onClick={() => openArchiveModal(file)}
                            >
                              <Archive size="1.5rem" />
                            </ActionIcon>
                          </Tooltip>
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            height: "36px",
                          }}
                        >
                          {`${file.branch}-${new Date(file.upload_date).getFullYear()}-${(new Date(file.upload_date).getMonth() + 1).toString().padStart(2, "0")}-#${file.id}`}
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            height: "36px",
                          }}
                        >
                          {file.uploader}
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            height: "36px",
                          }}
                        >
                          {file.file_extra_JSON.subject}
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            height: "36px",
                          }}
                        >
                          {file.file_extra_JSON.description}
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            height: "36px",
                          }}
                        >
                          {file.file_extra_JSON.remarks}
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            height: "36px",
                          }}
                        >
                          {new Date(file.upload_date).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            height: "36px",
                          }}
                        >
                          <Tooltip label="Edit Draft" position="top" withArrow>
                            <ActionIcon
                              variant="light"
                              color="black"
                              style={{
                                transition: "background-color 0.3s",
                                width: "2rem",
                                height: "2rem",
                              }}
                              onClick={() => handleEditFile(file)}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#E3F2FD";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                              }}
                            >
                              <PencilSimple size="1rem" />
                            </ActionIcon>
                          </Tooltip>
                        </td>
                        <td
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            height: "36px",
                          }}
                        >
                          <Tooltip
                            label="Delete Draft"
                            position="top"
                            withArrow
                          >
                            <ActionIcon
                              variant="light"
                              color="red"
                              style={{
                                transition: "background-color 0.3s",
                                width: "2rem",
                                height: "2rem",
                              }}
                              onClick={() => openDeleteModal(file)}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#ffebee";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                              }}
                            >
                              <Trash size="1rem" />
                            </ActionIcon>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Group
              position="right"
              style={{
                backgroundColor: "#fff",
                padding: "8px 16px",
                borderTop: "1px solid #ddd",
                marginTop: "auto",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                height: "35px",
                gap: "16px",
              }}
            >
              <Text size="sm" color="dimmed">
                {`Showing ${filteredFiles.length > 0 ? startIndex + 1 : 0}-${endIndex} of ${filteredFiles.length} files`}
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  height: "36px",
                  marginLeft: "auto",
                }}
              >
                <Tooltip
                  label={`Enter page number (1-${Math.ceil(filteredFiles.length / itemsPerPage)})`}
                  position="top"
                >
                  <TextInput
                    placeholder="Page #"
                    value={pageInput}
                    onChange={(e) => {
                      setPageInput(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                    onKeyPress={handlePageJump}
                    style={{
                      width: "80px",
                      textAlign: "center",
                    }}
                    size="sm"
                    type="text"
                    maxLength={3}
                  />
                </Tooltip>
                <Pagination
                  total={Math.ceil(filteredFiles.length / itemsPerPage)}
                  value={currentPage}
                  onChange={(page) => {
                    setCurrentPage(page);
                    setPageInput("");
                  }}
                  size="sm"
                  boundaries={1}
                  siblings={1}
                  withEdges
                />
              </div>
            </Group>
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

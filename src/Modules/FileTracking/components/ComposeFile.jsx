import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  FileInput,
  TextInput,
  Textarea,
  Title,
  ActionIcon,
  Text,
  Select,
  Group,
  Autocomplete,
  Grid,
  Modal,
} from "@mantine/core";
import { Upload, FloppyDisk, Trash } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  designationsRoute,
  createFileRoute,
  getUsernameRoute,
  createDraftRoute,
} from "../../../routes/filetrackingRoutes";

axios.defaults.withCredentials = true;

export default function Compose() {
  const [files, setFiles] = React.useState([]);
  const [usernameSuggestions, setUsernameSuggestions] = React.useState([]);
  const [receiver_username, setReceiverUsername] = React.useState("");
  const [receiver_designation, setReceiverDesignation] = React.useState("");
  const [receiver_designations, setReceiverDesignations] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  const token = localStorage.getItem("authToken");
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const roles = useSelector((state) => state.user.roles);
  let module = useSelector((state) => state.module.current_module);
  module = module.split(" ").join("").toLowerCase();
  const uploaderRole = useSelector((state) => state.user.role);
  const [designation, setDesignation] = React.useState(uploaderRole);
  const options = roles.map((role) => ({ value: role, label: role }));
  const receiverRoles = Array.isArray(receiver_designations)
    ? receiver_designations.map((role) => ({
        value: role,
        label: role,
      }))
    : [];

  const handleFileChange = (uploadedFiles) => {
    if (Array.isArray(uploadedFiles)) {
      setFiles(uploadedFiles);
    } else if (uploadedFiles) {
      setFiles([uploadedFiles]);
    } else {
      setFiles([]);
    }
  };
  const removeFile = () => {
    setFiles([]);
  };
  const postSubmit = () => {
    setFiles([]);
    setDesignation("");
    setReceiverDesignation("");
    setReceiverDesignations("");
    setReceiverUsername("");
    setSubject("");
    setDescription("");
    setRemarks("");
  };
  useEffect(() => {
    setDesignation(roles);
  }, [roles]);

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
        if (response.data && Array.isArray(users)) {
          const suggestedUsernames = users.map((user) => user.fields.username);
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
      isMounted = false;
    };
  }, [receiver_username, token]);

  const fetchRoles = async () => {
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
        setTimeout(fetchRoles, 2000);
      }
    }
  };
  const handleSaveDraft = async () => {
    try {
      const formData = new FormData();
      formData.append("designation", uploaderRole);
      formData.append("src_module", module);
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("remarks", remarks);
      formData.append("receiver_username", receiver_username);
      formData.append("receiver_designation", receiver_designation);
      files.forEach((file) => {
        formData.append("files", file);
      });
      await axios.post(`${createDraftRoute}`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      notifications.show({
        title: "Draft saved successfully",
        message: "The draft has been saved successfully.",
        color: "green",
        position: "top-center",
      });
      postSubmit();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateFile = () => {
    if (
      files.length === 0 ||
      !subject ||
      !description ||
      !receiver_username ||
      !receiver_designation
    ) {
      notifications.show({
        title: "Incomplete Form",
        message: "Please fill out all required fields before submitting.",
        color: "red",
        position: "top-center",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const finalSubmit = async () => {
    setShowConfirmModal(false);
    try {
      const formData = new FormData();
      if (Array.isArray(files) && files.length > 0) {
        files.forEach((fileItem, index) => {
          const fileAttachment =
            fileItem instanceof File
              ? fileItem
              : new File([fileItem], `uploaded_file_${index}`, {
                  type: "application/octet-stream",
                });
          formData.append("files", fileAttachment);
        });
      }
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("designation", designation);
      formData.append("receiver_username", receiver_username);
      formData.append("receiver_designation", receiver_designation);
      formData.append("src_module", module);
      const response = await axios.post(`${createFileRoute}`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 201) {
        notifications.show({
          title: "File sent successfully",
          message: "The file has been sent successfully.",
          color: "green",
          position: "top-center",
        });
        postSubmit();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="inbox-card"
      style={{
        backgroundColor: "#F5F7F8",
        position: "absolute",
        height: "70vh",
        width: "90vw",
        overflowY: "auto",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ActionIcon
          size="lg"
          variant="outline"
          color="blue"
          onClick={() => handleSaveDraft()}
          title="Save as Draft"
        >
          <FloppyDisk size={20} />
        </ActionIcon>
        <Text color="blue" size="xs" mt={4}>
          Save as Draft
        </Text>
      </Box>

      <Title
        order={2}
        mb="md"
        style={{
          fontSize: "24px",
        }}
      >
        Compose File
      </Title>
      <Box
        component="form"
        onSubmit={(e) => e.preventDefault()}
        style={{
          backgroundColor: "#F5F7F8",
          padding: "16px",
        }}
      >
        <TextInput
          label="Title of File"
          placeholder="Enter file title"
          mb="sm"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter description"
          mb="sm"
          value={description}
          onChange={(e) => {
            const words = e.currentTarget.value.trim().split(/\s+/);
            if (words.length < 100) {
              setDescription(e.currentTarget.value);
            }
          }}
          required
        />
        <Text align="right">{description.split(/\s+/).length} / 100 words</Text>

        <Textarea
          label="Remarks"
          placeholder="Enter remarks"
          mb="sm"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required
        />
        <Select
          label="Designation"
          placeholder="Sender's Designation"
          value={designation}
          data={options}
          mb="sm"
          onChange={(value) => setDesignation(value)}
        />
        <FileInput
          label="Attach file (PDF, JPG, PNG) (MAX: 10MB)"
          placeholder="Upload file"
          accept="application/pdf,image/jpeg,image/png"
          icon={<Upload size={16} />}
          value={files}
          onChange={handleFileChange}
          mb="sm"
          multiple
          maxSize={10 * 1024 * 1024}
        />
        {files && (
          <Group position="apart" mt="sm">
            <Button
              leftIcon={<Trash size={16} />}
              color="red"
              onClick={removeFile}
              compact
            >
              Remove File
            </Button>
          </Group>
        )}
        <Grid mb="sm" gutter="md" align="flex-start">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box style={{ height: "100%", width: "98.5%", marginLeft: "8px" }}>
              <Autocomplete
                label="Send To"
                placeholder="Enter recipient"
                value={receiver_username}
                data={usernameSuggestions}
                onChange={(value) => {
                  setReceiverDesignation("");
                  setReceiverUsername(value);
                }}
                styles={(theme) => ({
                  label: {
                    marginBottom: theme.spacing.xs,
                  },
                  input: {
                    height: 36,
                  },
                })}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Box style={{ height: "100%", width: "99%" }}>
              <Select
                label="Receiver Designation"
                placeholder="Select designation"
                onClick={() => {
                  if (receiverRoles.length === 0) {
                    fetchRoles();
                  }
                }}
                value={receiver_designation}
                data={receiverRoles}
                onChange={(value) => setReceiverDesignation(value)}
                searchable
                nothingFound="No designations found"
                styles={(theme) => ({
                  label: {
                    marginBottom: theme.spacing.xs,
                  },
                  input: {
                    height: 36,
                  },
                })}
              />
            </Box>
          </Grid.Col>
        </Grid>
        <Button
          type="submit"
          color="blue"
          style={{
            display: "block",
            margin: "0 auto",
            width: "200px",
          }}
          onClick={handleCreateFile}
        >
          Submit
        </Button>
      </Box>

      <Modal
        opened={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={
          <Text align="center" weight={600} size="lg">
            Confirm Submission
          </Text>
        }
        centered
      >
        <Text weight={600} mb="ls">
          Do you want to send this file?
        </Text>
        <Text mb="ls">Sender: ({designation})</Text>
        <Text mb="md">
          Receiver: {receiver_username} ({receiver_designation})
        </Text>
        <Group justify="center" gap="xl" style={{ width: "100%" }}>
          <Button
            onClick={() => setShowConfirmModal(false)}
            variant="outline"
            style={{ width: "120px" }}
          >
            Cancel
          </Button>
          <Button onClick={finalSubmit} color="blue" style={{ width: "120px" }}>
            Confirm
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}

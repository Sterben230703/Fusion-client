/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Group,
  Divider,
  Select,
  TextInput,
  Box,
  Grid,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import {
  forwardFileRoute,
  rejectFileRoute,
  approveFileRoute,
} from "../../../../routes/RSPCRoutes";
import classes from "../../styles/formStyle.module.css";
import {
  rspc_admin,
  dean_rspc,
  director,
  designations,
} from "../../helpers/designations";

function FileActionsModal({ opened, onClose, file, username, setActiveTab }) {
  const receiver = { Director: director, "Dean RSPC": dean_rspc };
  const [approveButtonDisabled, setApproveButtonDisabled] = useState(false);
  const [rejectButtonDisabled, setRejectButtonDisabled] = useState(false);
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(false);
  const [forwardList, setForwardList] = useState([]);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState("File Forwarding Failed");
  const [alertBody, setAlertBody] = useState(
    "The file could not be forwarded! Please verify the filled details and try again.",
  );

  const form = useForm({
    initialValues: {
      recipient: "",
      remarks: "",
    },
    validate: {
      recipient: (value) => (value ? null : "Recipient is required"),
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("file_id", file.fileData.id);
      formData.append("receiver", receiver[values.recipient]);
      formData.append("remarks", values.remarks);
      formData.append(
        "receiver_designation",
        designations[receiver[values.recipient]],
      );
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(forwardFileRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      setAlertHeader("File Forwarded Successfully");
      setAlertBody("The file has been successfully forwarded!");
      onClose();
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("1");
      }, 2500);
    } catch (error) {
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  const handleApprove = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const response = await axios.get(approveFileRoute(file.fileData.id), {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setAlertHeader(response.data.message);
      setAlertBody(
        "The file has been successfully approved! The requestor of file will be informed of the file approval and the file is now closed.",
      );
      onClose();
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("1");
      }, 2500);
    } catch (error) {
      setAlertHeader("File Approval Failed");
      setAlertBody(
        "The file could not be approved! Please check the file details and try again.",
      );
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const response = await axios.get(rejectFileRoute(file.fileData.id), {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setAlertHeader(response.data.message);
      setAlertBody(
        "The file has been successfully rejected! The requestor of file will be informed of the file rejection and the file is now closed.",
      );
      onClose();
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("1");
      }, 2500);
    } catch (error) {
      setAlertHeader("File Rejection Failed");
      setAlertBody(
        "The file could not be rejected! Please check the file details and try again.",
      );
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (username === rspc_admin) {
      setApproveButtonDisabled(true);
      setRejectButtonDisabled(true);
      setForwardList(["Dean RSPC", "Director"]);
    } else if (username === dean_rspc) {
      setForwardList(["Director"]);
      if (file) {
        if (file.fileData.file_extra_JSON.request_type === "Expenditure") {
          setApproveButtonDisabled(true);
        }
      }
    } else if (username === director) {
      setForwardButtonDisabled(true);
    }
  }, [file]);

  return (
    <>
      <Modal opened={opened} onClose={onClose} size="xl">
        {file ? (
          <>
            <Text
              align="center"
              size="32px"
              weight={700}
              style={{ marginBottom: "30px", color: "#15ABFF" }}
            >
              File Actions
            </Text>
            <Grid>
              {/* Left Side - Static Fields */}
              <Grid.Col span={6}>
                <Box>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>File ID:</strong>{" "}
                    {file.fileData.id}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Subject:</strong>{" "}
                    {file.fileData.description}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                    {file.fileData.file_extra_JSON.pid}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Requestor:</strong>{" "}
                    {file.fileData.uploader}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Date Of Request:</strong>{" "}
                    {new Date(file.fileData.upload_date).toLocaleDateString()}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Sent By:</strong>{" "}
                    {file.sender}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>
                      Sender Designation:
                    </strong>{" "}
                    {file.sender_designation}
                  </Text>
                </Box>

                {/* Buttons under the Left column */}
                <Group position="left" style={{ marginTop: "20px" }}>
                  <Button
                    color="green"
                    style={{ borderRadius: "8px" }}
                    onClick={handleApprove}
                    disabled={approveButtonDisabled}
                  >
                    <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                    Approve
                  </Button>
                  <Button
                    color="red"
                    style={{ borderRadius: "8px" }}
                    onClick={handleReject}
                    variant="outline"
                    disabled={rejectButtonDisabled}
                  >
                    <ThumbsDown size={26} style={{ marginRight: "3px" }} />
                    Reject
                  </Button>
                </Group>
              </Grid.Col>

              <Divider orientation="vertical" size="md" />

              <Grid.Col span={5} style={{ paddingLeft: "15px" }}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Text size="lg" weight={500} className={classes.fieldLabel}>
                    Select Recipient <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Select
                    disabled={username === director}
                    placeholder="Choose a role"
                    data={forwardList}
                    {...form.getInputProps("recipient")}
                    style={{ marginBottom: "20px" }}
                  />

                  <Text size="lg" weight={500} className={classes.fieldLabel}>
                    Add Remarks
                  </Text>
                  <TextInput
                    disabled={username === director}
                    placeholder="Enter additional comments for the recipient"
                    {...form.getInputProps("remarks")}
                    style={{ marginBottom: "20px" }}
                  />

                  {/* Single Button under the Right column */}
                  <Button
                    type="submit"
                    fullWidth
                    style={{ marginTop: "20px", borderRadius: "8px" }}
                    color="cyan"
                    disabled={forwardButtonDisabled}
                  >
                    Forward File
                  </Button>
                </form>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load project details
          </Text>
        )}
      </Modal>

      {(successAlertVisible || failureAlertVisible) && (
        <div className={classes.overlay}>
          <Alert
            variant="filled"
            color={successAlertVisible ? "#85B5D9" : "red"}
            title={alertHeader}
            icon={
              successAlertVisible ? (
                <ThumbsUp size={96} />
              ) : (
                <ThumbsDown size={96} />
              )
            }
            className={classes.alertBox}
          >
            {alertBody}
          </Alert>
        </div>
      )}
    </>
  );
}

FileActionsModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.shape({
    fileData: PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string,
      file_extra_JSON: PropTypes.shape({
        pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        request_type: PropTypes.string,
      }),
      uploader: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      upload_date: PropTypes.string,
    }).isRequired,
    sender: PropTypes.string,
    sender_designation: PropTypes.string,
  }).isRequired,
  username: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default FileActionsModal;

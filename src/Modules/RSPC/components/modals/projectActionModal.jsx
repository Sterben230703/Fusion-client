/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Text,
  Group,
  Divider,
  Box,
  Grid,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { ThumbsUp, ThumbsDown, FileText, Pencil } from "@phosphor-icons/react";
import {
  acceptProjectCompletionRoute,
  projectClosureRoute,
} from "../../../../routes/RSPCRoutes";
import classes from "../../styles/formStyle.module.css";
import { rspc_admin } from "../../helpers/designations";
import { host } from "../../../../routes/globalRoutes";

function ProjectActionModal({ opened, onClose, projectData, setActiveTab }) {
  const [file, setFile] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState("Project Termination Failed");
  const [alertBody, setAlertBody] = useState(
    "The project could not be terminated! Please verify the filled details and submit the form again.",
  );

  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate("/research/forms", { state: { projectData } });
  };

  const form = useForm({
    initialValues: {
      enddate: "",
    },
    validate: {
      enddate: (value) =>
        value === "" ? "Project termination date is required" : null,
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("enddate", values.enddate);
      formData.append("pid", projectData.pid);
      if (file) {
        formData.append("file", file);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(
        projectClosureRoute(rspc_admin),
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      onClose();
      setAlertHeader("Project Termination Successful");
      setAlertBody(
        "The project has been successfully terminated! The project lead will be informed of the project termination and the project is now closed.",
      );
      console.log(response.data);
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("1");
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  const handleAccept = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const response = await axios.get(
        acceptProjectCompletionRoute(projectData.pid),
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(response.data);
      setAlertHeader("Project Completion Successful");
      setAlertBody(
        "The project has been successfully completed! The project lead will be informed of the project completion and the project is now closed.",
      );
      onClose();
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("1");
        window.location.reload();
      }, 2500);
    } catch (error) {
      setAlertHeader("Project Completion Failed");
      setAlertBody(
        "The project could not be completed! Please check the project details and try again.",
      );
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} size="xl">
        {projectData ? (
          <>
            <Group position="apart" style={{ marginBottom: 20 }}>
              <Text size="32px" weight={700}>
                {projectData.name}
              </Text>
              <Button
                onClick={() => handleEditClick()}
                color="green"
                size="s"
                style={{ borderRadius: "8px", padding: "7px 18px" }}
              >
                <Pencil size={26} style={{ marginRight: "3px" }} />
                Edit Details
              </Button>
            </Group>
            <Text
              align="center"
              size="26px"
              weight={700}
              style={{ marginBottom: "30px", color: "#15ABFF" }}
            >
              Project Closure Actions
            </Text>
            <Grid>
              {/* Left Side - Static Fields */}
              <Grid.Col span={6}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Text size="lg" weight={500} className={classes.fieldLabel}>
                    Date Of Project Completion
                    <span style={{ color: "red" }}> *</span>
                  </Text>
                  <input
                    type="date"
                    {...form.getInputProps("enddate")}
                    className={classes.dateInput}
                  />

                  <Text
                    size="lg"
                    weight={500}
                    className={classes.fieldLabel}
                    style={{ marginTop: "20px" }}
                  >
                    Project Report <span style={{ color: "red" }}>*</span>
                  </Text>
                  <div className={classes.fileInputContainer}>
                    <Button
                      variant="outline"
                      color="#15ABFF"
                      size="md"
                      component="label"
                      className={classes.fileInputButton}
                      style={{ borderRadius: "8px" }}
                    >
                      <FileText size={26} style={{ marginRight: "3px" }} />
                      Choose File
                      <input
                        type="file"
                        hidden
                        onChange={(event) =>
                          setFile(event.currentTarget.files[0])
                        }
                      />
                    </Button>
                    {file && (
                      <span className={classes.fileName}>{file.name}</span>
                    )}
                  </div>

                  {/* Single Button under the Left column */}
                  <Button
                    type="submit"
                    fullWidth
                    style={{ marginTop: "20px", borderRadius: "8px" }}
                    color="cyan"
                  >
                    Terminate File
                  </Button>
                </form>
              </Grid.Col>

              <Divider orientation="vertical" size="md" />

              <Grid.Col span={5} style={{ paddingLeft: "15px" }}>
                {projectData &&
                Object.keys(projectData).length > 0 &&
                projectData.finish_date ? (
                  <>
                    <Box>
                      <Text
                        size="lg"
                        weight={500}
                        style={{ marginBottom: "10px" }}
                      >
                        <strong style={{ color: "blue" }}>
                          Project Finish Date:
                        </strong>{" "}
                        {projectData.finish_date}
                      </Text>
                      {projectData.end_report && (
                        <Group spacing="xs">
                          <Text
                            size="lg"
                            weight={500}
                            // style={{ marginBottom: "3px" }}
                          >
                            <strong style={{ color: "blue" }}>
                              Attachment:
                            </strong>{" "}
                          </Text>
                          <Button
                            variant="light"
                            component="a"
                            href={`${host}/${projectData.end_report}`}
                            target="_blank"
                            radius="md"
                            style={{
                              textOverflow: "ellipsis",
                              maxWidth: "170px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {projectData.end_report.split("/").pop()}
                          </Button>
                        </Group>
                      )}
                    </Box>
                    <Button
                      color="green"
                      onClick={handleAccept}
                      fullWidth
                      style={{ marginTop: "20px", borderRadius: "8px" }}
                    >
                      <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                      Accept Completion
                    </Button>
                  </>
                ) : (
                  <Text size="xl" weight={700} align="center">
                    <br />
                    <br />
                    No Project Completion Request From Project Lead
                  </Text>
                )}
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

ProjectActionModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    finish_date: PropTypes.string,
    end_report: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default ProjectActionModal;

/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Modal,
  Button,
  Text,
  Grid,
  Group,
  GridCol,
  Alert,
} from "@mantine/core";
import axios from "axios";
import { FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { projectDecisionRoute } from "../../../../routes/RSPCRoutes";
import { host } from "../../../../routes/globalRoutes";

function ProjectClosureModal({ opened, onClose, projectData, setActiveTab }) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState("Project Closure Failed");
  const [alertBody, setAlertBody] = useState(
    "Your action on project closure could not be successfully registered! Please verify the filled details and try again.",
  );

  const handleProjectDecision = async (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("pid", projectData.pid);
      formData.append("action", action);
      formData.append("form", "uc/se");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(projectDecisionRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      onClose();
      setAlertHeader("Project Closure Decision Successful");
      setAlertBody(
        "Your decision on project closure is successfully registered!",
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

  return (
    <>
      <Modal opened={opened} onClose={onClose} size="xl">
        {projectData && Object.keys(projectData).length > 0 ? (
          <>
            <Group position="apart" style={{ marginBottom: 10 }}>
              <Text size="32px" weight={700}>
                Utilization Certificate & Statement of Expenditure and Project
                Closure
              </Text>
              <Group position="left" style={{ marginTop: "20px" }}>
                <Button
                  color="green"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleProjectDecision("approve")}
                >
                  <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                  Approve
                </Button>
                <Button
                  color="red"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleProjectDecision("reject")}
                  variant="outline"
                >
                  <ThumbsDown size={26} style={{ marginRight: "3px" }} />
                  Reject
                </Button>
              </Group>
            </Group>

            <Grid gutter="xs" style={{ marginBottom: 20 }}>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Title:</strong>{" "}
                  {projectData.name}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                  {projectData.pid}
                </Text>
              </GridCol>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Project Investigator:
                  </strong>{" "}
                  {projectData.pi_name}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Total Amount Sanctioned:
                  </strong>{" "}
                  INR {projectData.sanctioned_amount}
                </Text>
              </GridCol>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Proposal Start Date:
                  </strong>{" "}
                  {new Date(projectData.start_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Duration:</strong>{" "}
                  {projectData.duration} months
                </Text>
              </GridCol>

              <GridCol span={12}>
                <Text size="xl">
                  <strong
                    style={{
                      color: "blue",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Issuing of Final Utilization Certificate & Statement of
                    Expenditure and Closure of Project
                  </strong>
                </Text>
                {projectData.end_report && (
                  <Button
                    variant="outline"
                    color="#15ABFF"
                    size="md"
                    className={classes.fileInputButton}
                    style={{ borderRadius: "8px" }}
                    component="a"
                    href={`${host}/${projectData.end_report}`} // Directly access the file URL
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={26} style={{ marginRight: "3px" }} />
                    Open UC/SE
                  </Button>
                )}
              </GridCol>
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

ProjectClosureModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    name: PropTypes.string,
    status: PropTypes.string,
    pi_name: PropTypes.string,
    duration: PropTypes.number,
    sanctioned_amount: PropTypes.number,
    start_date: PropTypes.string,
    end_report: PropTypes.string,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default ProjectClosureModal;

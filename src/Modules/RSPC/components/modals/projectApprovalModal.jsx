/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Modal,
  Button,
  Text,
  Divider,
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

function ProjectApprovalModal({ opened, onClose, projectData, setActiveTab }) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState("Project Proposal Failed");
  const [alertBody, setAlertBody] = useState(
    "Your action on project's proposal could not be successfully registered! Please verify the filled details and try again.",
  );

  const handleProjectDecision = async (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");
    if (action === "approve" && projectData.status === "HoD Forward") {
      action = "forward";
    }

    try {
      const formData = new FormData();
      formData.append("pid", projectData.pid);
      formData.append("action", action);
      if (projectData.sanctioned_amount > 0)
        formData.append("form", "registration");
      else formData.append("form", "proposal");
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
      setAlertHeader("Project Proposal Decision Successful");
      setAlertBody(
        "Your decision on project's proposal is successfully registered!",
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
                Project Proposal And Registration
              </Text>
              <Group position="left" style={{ marginTop: "20px" }}>
                <Button
                  color="green"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleProjectDecision("approve")}
                >
                  <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                  {projectData.status === "HoD Forward" ? "Forward" : "Approve"}
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
              <Grid.Col span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Co-Principal Investigators:
                  </strong>
                </Text>
                {projectData.copis.length > 0 ? (
                  <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                    {projectData.copis.map((copi, index) => (
                      <li key={index}>
                        <Text size="lg">{copi}</Text>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text color="dimmed">No Co-PIs</Text>
                )}
              </Grid.Col>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Project To Be Operated By:
                  </strong>{" "}
                  {projectData.access === "Co"
                    ? "Only PI"
                    : "Either PI or Co-PI(s)"}
                </Text>
              </GridCol>

              <Grid.Col span={12}>
                <Divider
                  my="lg"
                  label="X X X"
                  labelPosition="center"
                  size="md"
                />
              </Grid.Col>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Type:</strong>{" "}
                  {projectData.type}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Department:</strong>{" "}
                  {projectData.dept}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Category:</strong>{" "}
                  {projectData.category}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Project Sponsor Agency:
                  </strong>{" "}
                  {projectData.sponsored_agency}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Scheme:</strong>{" "}
                  {projectData.scheme}
                </Text>
              </GridCol>
              <GridCol span={12}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Abstract:</strong>{" "}
                  {projectData.description}
                </Text>
              </GridCol>

              <Grid.Col span={12}>
                <Divider
                  my="lg"
                  label="X X X"
                  labelPosition="center"
                  size="md"
                />
              </Grid.Col>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Duration:</strong>{" "}
                  {projectData.duration} months
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Proposal Submission Date:
                  </strong>{" "}
                  {new Date(projectData.submission_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Project Budget Proposed:
                  </strong>{" "}
                  INR {projectData.total_budget}
                </Text>
              </GridCol>

              {projectData.sanctioned_amount > 0 && (
                <>
                  <Grid.Col span={12}>
                    <Divider
                      my="lg"
                      label="X X X"
                      labelPosition="center"
                      size="md"
                    />
                  </Grid.Col>

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
                        Project Sanction Date:
                      </strong>{" "}
                      {new Date(projectData.sanction_date).toLocaleDateString()}
                    </Text>
                  </GridCol>
                  <Grid.Col span={12}>
                    <Text size="xl">
                      <strong
                        style={{
                          color: "blue",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        Project Agreement (Sanction Letter, MoU, etc.)
                      </strong>
                    </Text>
                    {projectData.file && (
                      <Button
                        variant="outline"
                        color="#15ABFF"
                        size="md"
                        className={classes.fileInputButton}
                        style={{ borderRadius: "8px" }}
                        component="a"
                        href={`${host}/${projectData.file}`} // Directly access the file URL
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText size={26} style={{ marginRight: "3px" }} />
                        Open File
                      </Button>
                    )}
                  </Grid.Col>
                </>
              )}
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

ProjectApprovalModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    access: PropTypes.string,
    sponsored_agency: PropTypes.string,
    status: PropTypes.string,
    pi_name: PropTypes.string,
    copis: PropTypes.arrayOf(PropTypes.string),
    dept: PropTypes.string,
    category: PropTypes.string,
    scheme: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    sanctioned_amount: PropTypes.number,
    submission_date: PropTypes.string,
    sanction_date: PropTypes.string,
    file: PropTypes.string,
    total_budget: PropTypes.number,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default ProjectApprovalModal;

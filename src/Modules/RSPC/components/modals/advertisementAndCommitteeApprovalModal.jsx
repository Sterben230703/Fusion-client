import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Modal,
  Group,
  Button,
  Text,
  Grid,
  Divider,
  GridCol,
  Alert,
} from "@mantine/core";
import axios from "axios";
import { ThumbsUp, ThumbsDown, FileText } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { staffDecisionRoute } from "../../../../routes/RSPCRoutes";
import { host } from "../../../../routes/globalRoutes";

function AdvertisementAndCommitteeApprovalModal({
  opened,
  onClose,
  staffData,
  setActiveTab,
}) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState(
    "Advertisement And Committee Approval Failed",
  );
  const [alertBody, setAlertBody] = useState(
    "Your action on advertisement and committee request could not be successfully registered! Please verify the filled details and try again.",
  );

  const handleStaffDecision = async (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");
    if (action === "approve" && staffData.approval === "HoD Forward") {
      action = "forward";
    }

    try {
      const formData = new FormData();
      formData.append("sid", staffData.sid);
      formData.append("action", action);
      formData.append("form", "ad");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(staffDecisionRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      onClose();
      setAlertHeader("Advertisement And Committee Request Decision Successful");
      setAlertBody(
        "Your decision on advertisement and committee request is successfully registered!",
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
        {staffData && Object.keys(staffData).length > 0 ? (
          <>
            <Group position="apart" style={{ marginBottom: 10 }}>
              <Text size="32px" weight={700}>
                Approval Of Advertisement And Selection Committee
              </Text>
              <Group position="left" style={{ marginTop: "20px" }}>
                <Button
                  color="green"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleStaffDecision("approve")}
                >
                  <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                  {staffData.approval === "HoD Forward" ? "Forward" : "Approve"}
                </Button>
                <Button
                  color="red"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleStaffDecision("reject")}
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
                  {staffData.project_title}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                  {staffData.pid}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Sponsor Agency:</strong>{" "}
                  {staffData.sponsor_agency}
                </Text>
              </GridCol>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Project Sanction Date:
                  </strong>{" "}
                  {new Date(staffData.sanction_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project Start Date:</strong>{" "}
                  {new Date(staffData.project_start_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Project duration:</strong>{" "}
                  {staffData.duration_project} months
                </Text>
              </GridCol>

              {/* -------------- */}
              <Grid.Col span={12}>
                <Divider
                  my="lg"
                  label="X X X"
                  labelPosition="center"
                  size="md"
                />
              </Grid.Col>
              <GridCol span={12}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Availability Of Sufficient Funds To Accomodate The Required
                    Manpower:
                  </strong>{" "}
                  {staffData.has_funds}
                </Text>
              </GridCol>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Rank Of Position Advertised:
                  </strong>{" "}
                  {staffData.type}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Consolidated Salary + Housing Rent Allowance:
                  </strong>{" "}
                  {staffData.salary} (in INR)
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Appointment Duration:
                  </strong>{" "}
                  {staffData.duration} months
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Eligibility Criteria:
                  </strong>{" "}
                  {staffData.eligibility}
                </Text>
              </GridCol>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Last Date Of Applying:
                  </strong>{" "}
                  {new Date(staffData.submission_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Date Of Written Test:
                  </strong>{" "}
                  {new Date(staffData.test_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Interview Date:</strong>{" "}
                  {new Date(staffData.interview_date).toLocaleDateString()}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Mode Of Written Test:
                  </strong>{" "}
                  {staffData.test_mode}
                </Text>
              </GridCol>
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Interview Location:</strong>{" "}
                  {staffData.interview_place}
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
                    Signed Advertisement To Be Uploaded On Institute Website
                  </strong>
                </Text>
                {staffData.post_on_website && (
                  <Button
                    variant="outline"
                    color="#15ABFF"
                    size="md"
                    className={classes.fileInputButton}
                    style={{ borderRadius: "8px" }}
                    component="a"
                    href={`${host}/${staffData.post_on_website}`} // Directly access the file URL
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={26} style={{ marginRight: "3px" }} />
                    Open Advertisement
                  </Button>
                )}
              </GridCol>

              {/* -------------- */}
              <Grid.Col span={12}>
                <Divider
                  my="lg"
                  label="X X X"
                  labelPosition="center"
                  size="md"
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Text size="xl">
                  <strong
                    style={{
                      color: "blue",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Selection Committee Members
                  </strong>
                </Text>

                <Text>
                  <strong
                    style={{
                      size: "md",
                      weight: "500",
                    }}
                  >
                    PI (Convener of the Committee):
                  </strong>{" "}
                  {staffData.pi_name}
                </Text>
                {Object.entries(staffData.selection_committee).map(
                  ([role, name], index) => (
                    <Text key={index}>
                      <strong
                        style={{
                          size: "md",
                          weight: "500",
                        }}
                      >
                        {role}:
                      </strong>{" "}
                      {Array.isArray(name) ? name.join(", ") : name}
                    </Text>
                  ),
                )}
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load advertisement and committee details
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

AdvertisementAndCommitteeApprovalModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  staffData: PropTypes.shape({
    sid: PropTypes.number,
    pid: PropTypes.number,
    project_title: PropTypes.string,
    sponsor_agency: PropTypes.string,
    duration_project: PropTypes.number,
    selection_committee: PropTypes.arrayOf(PropTypes.string),
    test_date: PropTypes.string,
    submission_date: PropTypes.string,
    test_mode: PropTypes.string,
    duration: PropTypes.number,
    pi_name: PropTypes.string,
    approval: PropTypes.string,
    eligibility: PropTypes.string,
    type: PropTypes.string,
    sanction_date: PropTypes.string,
    start_date: PropTypes.string,
    project_start_date: PropTypes.string,
    interview_date: PropTypes.string,
    interview_place: PropTypes.string,
    salary: PropTypes.number,
    has_funds: PropTypes.string,
    post_on_website: PropTypes.string,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default AdvertisementAndCommitteeApprovalModal;

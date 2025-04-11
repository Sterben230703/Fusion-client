/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Modal,
  Button,
  Text,
  Divider,
  Grid,
  TextInput,
  Group,
  GridCol,
  Alert,
} from "@mantine/core";
import axios from "axios";
import { FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { host } from "../../../../routes/globalRoutes";
import classes from "../../styles/formStyle.module.css";
import {
  committeeActionRoute,
  staffDecisionRoute,
} from "../../../../routes/RSPCRoutes";

function SelectionCommitteeReportApprovalModal({
  opened,
  onClose,
  staffData,
  setActiveTab,
}) {
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState(
    "Selection Committee Report Failed",
  );
  const [alertBody, setAlertBody] = useState(
    "Your action on selection committee's report could not be successfully registered! Please verify the filled details and try again.",
  );

  const handleCommitteeAction = async (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("sid", staffData.sid);
      formData.append("action", action);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(committeeActionRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      onClose();
      setAlertHeader("Selection Committee Action Successful");
      setAlertBody(
        "Your action on selection committee's report is successfully registered! The report needs to be checked by other members of the selection committee.",
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
      formData.append("form", "report");
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
      setAlertHeader("Selection Committee Report Decision Successful");
      setAlertBody(
        "Your decision on selection committee's report is successfully registered!",
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
                Report Of Selection Committee
              </Text>
              <Group position="left" style={{ marginTop: "20px" }}>
                <Button
                  color="green"
                  style={{ borderRadius: "8px" }}
                  onClick={() =>
                    staffData.approval === "Committee Approval"
                      ? handleCommitteeAction("approve")
                      : handleStaffDecision("approve")
                  }
                >
                  <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                  {staffData.approval === "HoD Forward" ? "Forward" : "Approve"}
                </Button>
                <Button
                  color="red"
                  style={{ borderRadius: "8px" }}
                  onClick={() =>
                    staffData.approval === "Committee Approval"
                      ? handleCommitteeAction("reject")
                      : handleStaffDecision("reject")
                  }
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
                  <strong style={{ color: "blue" }}>Designation:</strong>{" "}
                  {staffData.type}
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
                  <strong style={{ color: "blue" }}>Project duration:</strong>{" "}
                  {staffData.duration_project} months
                </Text>
              </GridCol>

              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Test Date:</strong>{" "}
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
                  <strong style={{ color: "blue" }}>Interview Venue:</strong>{" "}
                  {staffData.interview_place}
                </Text>
              </GridCol>

              <Grid.Col span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Number Of Candidates Applied:
                  </strong>{" "}
                  {staffData.candidates_applied}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Number Of Candidates Called For Test:
                  </strong>{" "}
                  {staffData.candidates_called}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Number Of Candidates Interviewed:
                  </strong>{" "}
                  {staffData.candidates_interviewed}
                </Text>
              </Grid.Col>

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
                    Final Selection(s) For {staffData.type}
                  </strong>
                </Text>

                {staffData.final_selection.map((candidate, index) => (
                  <Grid key={index} gutter="sm" align="center">
                    <Grid.Col span={12}>
                      <Text
                        size="lg"
                        weight={500}
                        className={classes.fieldLabel}
                      >
                        Selection {index + 1}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Candidate Name
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={candidate.name}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Date Of Birth
                      </Text>
                      <TextInput
                        value={candidate.dob}
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Category
                      </Text>
                      <TextInput
                        value={candidate.category}
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Consolidated Salary
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={`INR ${candidate.salary}`}
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Text size="md" weight={500}>
                        Term Duration
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={`${candidate.duration} months`}
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Text size="md" weight={500}>
                        Start Date Of Term
                      </Text>
                      <TextInput
                        value={candidate.begin}
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Text size="md" weight={500}>
                        End Date Of Term
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={candidate.end}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Resume
                      </Text>
                      {staffData.biodata_final[index] && (
                        <Button
                          variant="outline"
                          color="#15ABFF"
                          size="md"
                          className={classes.fileInputButton}
                          style={{ borderRadius: "8px" }}
                          component="a"
                          href={`${host}/${staffData.biodata_final[index]}`} // Directly access the file URL
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText size={26} style={{ marginRight: "3px" }} />
                          Open Resume
                        </Button>
                      )}
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <Divider
                        my="lg"
                        label=""
                        labelPosition="center"
                        size="sm"
                      />
                    </Grid.Col>
                  </Grid>
                ))}
              </Grid.Col>

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
                    Waiting List For {staffData.type}
                  </strong>
                </Text>

                {staffData.waiting_list.map((candidate, index) => (
                  <Grid key={index} gutter="sm" align="center">
                    <Grid.Col span={12}>
                      <Text
                        size="lg"
                        weight={500}
                        className={classes.fieldLabel}
                      >
                        Selection {index + 1}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Candidate Name
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={candidate.name}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Date Of Birth
                      </Text>
                      <TextInput
                        value={candidate.dob}
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Category
                      </Text>
                      <TextInput
                        value={candidate.category}
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Consolidated Salary
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={`INR ${candidate.salary}`}
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Text size="md" weight={500}>
                        Term Duration
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={`${candidate.duration} months`}
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Text size="md" weight={500}>
                        Start Date Of Term
                      </Text>
                      <TextInput
                        value={candidate.begin}
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Text size="md" weight={500}>
                        End Date Of Term
                      </Text>
                      <TextInput
                        readOnly
                        styles={{
                          input: {
                            cursor: "not-allowed", // Show forbidden cursor
                          },
                        }}
                        value={candidate.end}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Text size="md" weight={500}>
                        Resume
                      </Text>
                      {staffData.biodata_waiting[index] && (
                        <Button
                          variant="outline"
                          color="#15ABFF"
                          size="md"
                          className={classes.fileInputButton}
                          style={{ borderRadius: "8px" }}
                          component="a"
                          href={`${host}/${staffData.biodata_waiting[index]}`} // Directly access the file URL
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText size={26} style={{ marginRight: "3px" }} />
                          Open Resume
                        </Button>
                      )}
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <Divider
                        my="lg"
                        label=""
                        labelPosition="center"
                        size="sm"
                      />
                    </Grid.Col>
                  </Grid>
                ))}
              </Grid.Col>

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
                    Copy Of Advertisement Uploaded On Institute Website
                  </strong>
                </Text>
                {staffData.ad_file && (
                  <Button
                    variant="outline"
                    color="#15ABFF"
                    size="md"
                    className={classes.fileInputButton}
                    style={{ borderRadius: "8px" }}
                    component="a"
                    href={`${host}/${staffData.ad_file}`} // Directly access the file URL
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={26} style={{ marginRight: "3px" }} />
                    Open Copy
                  </Button>
                )}
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
                    Comparative Statements Of Candidates
                  </strong>
                </Text>
                {staffData.comparative_file && (
                  <Button
                    variant="outline"
                    color="#15ABFF"
                    size="md"
                    className={classes.fileInputButton}
                    style={{ borderRadius: "8px" }}
                    component="a"
                    href={`${host}/${staffData.comparative_file}`} // Directly access the file URL
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={26} style={{ marginRight: "3px" }} />
                    Open Statement
                  </Button>
                )}
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load staff details
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

SelectionCommitteeReportApprovalModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  staffData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    biodata_waiting: PropTypes.arrayOf(PropTypes.string),
    biodata_final: PropTypes.arrayOf(PropTypes.string),
    sponsor_agency: PropTypes.string,
    project_title: PropTypes.string,
    approval: PropTypes.string,
    type: PropTypes.string,
    duration_project: PropTypes.number,
    test_date: PropTypes.string,
    interview_date: PropTypes.string,
    interview_place: PropTypes.string,
    salary: PropTypes.number,
    sid: PropTypes.number,
    candidates_applied: PropTypes.number,
    candidates_called: PropTypes.number,
    candidates_interviewed: PropTypes.number,
    ad_file: PropTypes.string,
    comparative_file: PropTypes.string,
    final_selection: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        dob: PropTypes.string.isRequired,
        category: PropTypes.string,
        duration: PropTypes.number,
        salary: PropTypes.number,
        begin: PropTypes.string,
        end: PropTypes.string,
      }),
    ),
    waiting_list: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        dob: PropTypes.string.isRequired,
        category: PropTypes.string,
        duration: PropTypes.number,
        salary: PropTypes.number,
        begin: PropTypes.string,
        end: PropTypes.string,
      }),
    ),
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default SelectionCommitteeReportApprovalModal;

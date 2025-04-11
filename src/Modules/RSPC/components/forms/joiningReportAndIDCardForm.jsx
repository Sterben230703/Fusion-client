/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  NumberInput,
  Paper,
  Title,
  Grid,
  Text,
  Alert,
  Divider,
  Anchor,
} from "@mantine/core";
import { FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { staffDocumentUploadRoute } from "../../../../routes/RSPCRoutes";
import { host } from "../../../../routes/globalRoutes";

function JoiningReportAndIDCardForm({ staffData }) {
  const [report, setReport] = useState(null);
  const [ID, setID] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      salary_per_month: staffData.salary_per_month,
      start_date: new Date(staffData.start_date).toISOString().split("T")[0],
    },
    validate: {
      salary_per_month: (value) =>
        value > 0 ? null : "Salary must be greater than 0",
    },
  });

  const handleSubmit = async (values) => {
    if (!ID && !report) {
      console.error(
        "At least one file (Joining Report or ID Card) is required.",
      );
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("sid", staffData.sid);
      formData.append("start_date", values.start_date);
      formData.append("salary_per_month", values.salary_per_month);
      if (report) {
        formData.append("joining_report", report);
      }
      if (ID) {
        formData.append("id_card", ID);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(staffDocumentUploadRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        navigate("/research");
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {staffData &&
        Object.keys(staffData).length > 0 &&
        "sid" in staffData ? (
          <Paper padding="lg" shadow="s" className={classes.formContainer}>
            <Title order={2} className={classes.formTitle}>
              Upload Joining Report And ID Card
            </Title>

            {staffData.approval === "Approved" ? (
              <>
                <Grid gutter="xl">
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Project Title
                    </Text>
                    <TextInput
                      value={staffData.project_title}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Project ID
                    </Text>
                    <TextInput
                      value={staffData.pid}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Personnel Name
                    </Text>
                    <TextInput
                      value={staffData.person}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Staff ID
                    </Text>
                    <TextInput
                      value={staffData.sid}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Designation
                    </Text>
                    <TextInput
                      value={staffData.type}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Consolidated Salary
                    </Text>
                    <TextInput
                      value={`INR ${staffData.salary}`}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Appointment Duration
                    </Text>
                    <TextInput
                      value={`${staffData.duration} months`}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Joining Date
                    </Text>
                    <TextInput
                      value={new Date(
                        staffData.start_date,
                      ).toLocaleDateString()}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Divider
                      my="lg"
                      label="X X X"
                      labelPosition="center"
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Salary Per Month (as mentioned in Joining Report)
                    </Text>
                    <NumberInput
                      placeholder="Salary per month for personnel (in INR)"
                      min={0}
                      {...form.getInputProps("salary_per_month")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Joining Date (as mentioned in Joining Report)
                    </Text>
                    <input
                      type="date"
                      required
                      {...form.getInputProps("start_date")}
                      className={classes.dateInput}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Joining Report{" "}
                      <Anchor
                        href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PEM/PEM06%20Joining%20Report.docx"
                        style={{ fontSize: "0.85em" }}
                      >
                        (Download format here)
                      </Anchor>
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
                            setReport(event.currentTarget.files[0])
                          }
                        />
                      </Button>
                      {report && (
                        <span className={classes.fileName}>{report.name}</span>
                      )}
                    </div>
                    {staffData.joining_report && (
                      <Button
                        variant="outline"
                        color="#15ABFF"
                        size="md"
                        className={classes.fileInputButton}
                        style={{ borderRadius: "8px" }}
                        component="a"
                        href={`${host}/${staffData.joining_report}`} // Directly access the file URL
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText size={26} style={{ marginRight: "3px" }} />
                        Already Uploaded Joining Report
                      </Button>
                    )}
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
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      ID Card{" "}
                      <Anchor
                        href="https://www.iiitdmj.ac.in/rspc.iiitdmj.ac.in/DRSPC/PEM/PEM07%20ID%20Card.doc"
                        style={{ fontSize: "0.85em" }}
                      >
                        (Download format here)
                      </Anchor>
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
                            setID(event.currentTarget.files[0])
                          }
                        />
                      </Button>
                      {ID && (
                        <span className={classes.fileName}>{ID.name}</span>
                      )}
                    </div>
                    {staffData.id_card && (
                      <Button
                        variant="outline"
                        color="#15ABFF"
                        size="md"
                        className={classes.fileInputButton}
                        style={{ borderRadius: "8px" }}
                        component="a"
                        href={`${host}/${staffData.id_card}`} // Directly access the file URL
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText size={26} style={{ marginRight: "3px" }} />
                        Already Uploaded ID Card
                      </Button>
                    )}
                  </Grid.Col>
                </Grid>

                <div className={classes.submitButtonContainer}>
                  <Button
                    size="lg"
                    type="submit"
                    color="cyan"
                    style={{ borderRadius: "8px" }}
                  >
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <Text color="red" size="xl" weight={700} align="center">
                Staff position not yet filled!
              </Text>
            )}
          </Paper>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load staff details
          </Text>
        )}
      </form>

      {(successAlertVisible || failureAlertVisible) && (
        <div className={classes.overlay}>
          <Alert
            variant="filled"
            color={successAlertVisible ? "#85B5D9" : "red"}
            title={
              successAlertVisible
                ? "Document Upload Successful"
                : "Document Upload Failed"
            }
            icon={
              successAlertVisible ? (
                <ThumbsUp size={96} />
              ) : (
                <ThumbsDown size={96} />
              )
            }
            className={classes.alertBox}
          >
            {successAlertVisible
              ? "The staff document has been successfully uploaded! The staff details have been successfully updated!"
              : "The staff document could not be uploaded! At least one file (Joining Report or ID Card) is required. Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

JoiningReportAndIDCardForm.propTypes = {
  staffData: PropTypes.shape({
    sid: PropTypes.number,
    pid: PropTypes.number,
    project_title: PropTypes.string,
    salary_per_month: PropTypes.string,
    duration_project: PropTypes.number,
    selection_committee: PropTypes.arrayOf(PropTypes.string),
    test_date: PropTypes.string,
    submission_date: PropTypes.string,
    id_card: PropTypes.string,
    duration: PropTypes.number,
    pi_name: PropTypes.string,
    approval: PropTypes.string,
    joining_report: PropTypes.string,
    type: PropTypes.string,
    sanction_date: PropTypes.string,
    start_date: PropTypes.string,
    interview_date: PropTypes.string,
    interview_place: PropTypes.string,
    salary: PropTypes.number,
    has_funds: PropTypes.string,
    person: PropTypes.string,
  }).isRequired,
};

export default JoiningReportAndIDCardForm;

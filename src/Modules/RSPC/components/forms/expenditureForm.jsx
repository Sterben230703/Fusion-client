/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Select,
  Radio,
  NumberInput,
  Textarea,
  Paper,
  Title,
  Grid,
  Text,
  Alert,
} from "@mantine/core";
import { FileText, User, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { expenditureFormSubmissionRoute } from "../../../../routes/RSPCRoutes";
import { rspc_admin, rspc_admin_designation } from "../../helpers/designations";

function ExpenditureForm({ projectID }) {
  const [file, setFile] = useState(null);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);

  function isDateBefore(inputDate) {
    const [day, month, year] = inputDate.split("/");
    const dateToCheck = new Date(year, month - 1, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return dateToCheck < currentDate;
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      exptype: "",
      item: "",
      cost: 0,
      lastdate: "",
      mode: "",
      inventory: "",
      desc: "",
      file: null,
    },
    validate: {
      exptype: (value) =>
        value === "" ? "Expenditure type is required" : null,
      item: (value) =>
        value.trim() === "" ? "Requirement item is required" : null,
      cost: (value) =>
        value <= 0 ? "Estimated cost must be greater than zero" : null,
      mode: (value) =>
        value === "" ? "Mode of fulfillment is required" : null,
      lastdate: (value) =>
        value !== "" && isDateBefore(value)
          ? "Last date cannot be in the past"
          : null,
      inventory: (value) =>
        value === "" ? "Future use scope is required" : null,
    },
  });
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");
    try {
      const formData = new FormData();
      if (values.lastdate == null) values.lastdate = "";
      formData.append("exptype", values.exptype);
      formData.append("item", values.item);
      formData.append("cost", values.cost);
      formData.append("lastdate", values.lastdate);
      formData.append("mode", values.mode);
      formData.append("inventory", values.inventory);
      formData.append("desc", values.desc);
      formData.append("pid", projectID);
      formData.append("approval", "Pending");
      if (file) {
        formData.append("file", file);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(
        expenditureFormSubmissionRoute(
          role,
          rspc_admin,
          rspc_admin_designation,
        ),
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
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
        <Paper
          padding="lg"
          shadow="s"
          radius="md"
          className={classes.formContainer}
        >
          <Title order={2} className={classes.formTitle}>
            Request Fund Allocation
          </Title>

          <Grid gutter="xl">
            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Expenditure Type <span style={{ color: "red" }}>*</span>
              </Text>
              <Radio.Group {...form.getInputProps("exptype")}>
                <Radio value="Tangible" label="Physical Item" />
                <Radio value="Non-tangible" label="Non-tangible Resource" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Requirement <span style={{ color: "red" }}>*</span>
              </Text>
              <TextInput
                placeholder="Enter subject of expenditure"
                {...form.getInputProps("item")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Estimated Cost (in INR) <span style={{ color: "red" }}>*</span>
              </Text>
              <NumberInput
                placeholder="Enter estimated cost of expenditure"
                {...form.getInputProps("cost")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Latest Required By <span style={{ color: "red" }}>*</span>
              </Text>
              <input
                type="date"
                {...form.getInputProps("lastdate")}
                className={classes.dateInput}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Select Mode Of Fulfillment{" "}
                <span style={{ color: "red" }}>*</span>
              </Text>
              <Select
                placeholder="Choose how the requirement is fulfilled"
                {...form.getInputProps("mode")}
                data={["Online Purchase", "Offline Purchase", "Other"]}
                icon={<User />}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Future Use Scope For Inventory{" "}
                <span style={{ color: "red" }}>*</span>
              </Text>
              <Radio.Group {...form.getInputProps("inventory")}>
                <Radio
                  value="Yes"
                  label="Non-perishable (Can go to college inventory after use)"
                />
                <Radio value="No" label="Perishable (Cannot be used further)" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Purchase Details And Requirement Description
              </Text>
              <Textarea
                placeholder="Provide purchase link, vendor contact, fund receiver, etc. along with detailed description of why the said subject of expenditure is required in the project for future record-keeping"
                {...form.getInputProps("desc")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Quotation And Billing
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
                    onChange={(event) => setFile(event.currentTarget.files[0])}
                  />
                </Button>
                {file && <span className={classes.fileName}>{file.name}</span>}
              </div>
            </Grid.Col>
          </Grid>

          <div className={classes.submitButtonContainer}>
            <Button
              size="lg"
              type="submit"
              color="#15ABFF"
              style={{ borderRadius: "8px" }}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </form>

      {(successAlertVisible || failureAlertVisible) && (
        <div className={classes.overlay}>
          <Alert
            variant="filled"
            color={successAlertVisible ? "#85B5D9" : "red"}
            title={
              successAlertVisible
                ? "Form Submission Successful"
                : "Form Submission Failed"
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
              ? "The form has been successfully submitted! Your request will be processed soon!"
              : "The form details could not be saved! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

ExpenditureForm.propTypes = {
  projectID: PropTypes.number.isRequired,
};

export default ExpenditureForm;

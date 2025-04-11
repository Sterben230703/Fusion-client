/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Select,
  NumberInput,
  Paper,
  Title,
  Grid,
  Text,
  Divider,
  Radio,
  Alert,
  Textarea,
  Container,
  Loader,
} from "@mantine/core";
import {
  User,
  ThumbsDown,
  ThumbsUp,
  Trash,
  FileText,
} from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import {
  advertisementAndCommitteeApprovalFormSubmissionRoute,
  fetchProfIDsRoute,
  fetchStaffPositionsRoute,
} from "../../../../routes/RSPCRoutes";

function AdvertisementAndCommitteeApprovalForm({ projectData }) {
  const [advertisements, setAdvertisements] = useState([
    {
      type: "",
      salary: "",
      duration: "",
      eligibility: "",
      submission_date: "",
      test_date: "",
      test_mode: "",
      interview_date: "",
      interview_place: "",
    },
  ]);
  const [members, setMembers] = useState([
    { role: "Discipline Expert", name: "" },
    { role: "RSPC Nominee", name: "" },
  ]);
  const [postFile, setPostFile] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const navigate = useNavigate();

  const [profIDs, setProfIDs] = useState([]);
  useEffect(() => {
    const storedProfIDs = localStorage.getItem("profIDs");
    if (storedProfIDs) {
      try {
        const parsedProfIDs = JSON.parse(storedProfIDs);
        if (Array.isArray(parsedProfIDs) && parsedProfIDs.length > 0) {
          setProfIDs(parsedProfIDs); // Use stored data if valid
          return;
        }
      } catch (error) {
        console.error("Error parsing stored profIDs:", error);
      }
    }

    const fetchProfIDs = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(fetchProfIDsRoute, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const profIDsArray = response.data.profIDs;
        if (Array.isArray(profIDsArray) && profIDsArray.length > 0) {
          localStorage.setItem("profIDs", JSON.stringify(profIDsArray)); // Store only array
          setProfIDs(profIDsArray);
        }
      } catch (error) {
        console.error("Error during Axios GET:", error);
      }
    };
    fetchProfIDs();
  }, []);

  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([
    { type: "", available: "", occupied: "", incumbents: "" },
  ]);
  useEffect(() => {
    if (projectData) {
      setLoading(true);
      const fetchStaffPositions = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");
        try {
          const response = await axios.get(
            fetchStaffPositionsRoute(projectData.pid),
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            },
          );
          console.log("Fetched Staff Positions:", response.data);

          const parsedPositions = Object.entries(response.data.positions).map(
            ([type, [available, occupied]]) => ({
              type,
              available,
              occupied,
              incumbents: response.data.incumbents[type] || [],
            }),
          );
          if (parsedPositions.length === 0) {
            parsedPositions.push({
              type: "",
              available: "",
              occupied: "",
              incumbents: [],
            });
          }
          setPositions(parsedPositions);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
        }
      };
      fetchStaffPositions();
    }
  }, [projectData]);

  const form = useForm({
    initialValues: {
      has_funds: "",
      // post_on_website: "",
    },
    validate: {
      has_funds: (value) =>
        value ? null : "Funds availability confirmation is required",
      // post_on_website: (value) =>
      //   value ? null : "Website advertisement confirmation is required",
    },
  });

  const handleAddPosition = () => {
    setPositions([
      ...positions,
      { type: "", available: "", occupied: "", incumbents: "" },
    ]);
  };
  const handleAddAdvertisement = () => {
    setAdvertisements([
      ...advertisements,
      {
        type: "",
        salary: "",
        duration: "",
        eligibility: "",
        submission_date: "",
        test_date: "",
        test_mode: "",
        interview_date: "",
        interview_place: "",
      },
    ]);
  };
  const handleAddMember = () => {
    setMembers([...members, { role: "Other", name: "" }]);
  };

  const handlePositionChange = (index, field, value) => {
    const updatedPositions = positions.map((pos, i) => {
      if (i === index) {
        if (field === "occupied") {
          return {
            ...pos,
            [field]: value,
            incumbents: Array.from({ length: value }, () => ({
              name: "",
              date: "",
            })), // Reset incumbents
          };
        }
        return { ...pos, [field]: value };
      }
      return pos;
    });
    setPositions(updatedPositions);
  };
  const handleIncumbentChange = (posIndex, incIndex, field, value) => {
    const updatedPositions = positions.map((pos, i) => {
      if (i === posIndex) {
        const updatedIncumbents = pos.incumbents.map((inc, j) => {
          if (j === incIndex) {
            return { ...inc, [field]: value };
          }
          return inc;
        });
        return { ...pos, incumbents: updatedIncumbents };
      }
      return pos;
    });
    setPositions(updatedPositions);
  };
  const handleAdvertisementChange = (index, field, value) => {
    const updatedAdvertisements = advertisements.map((ad, i) =>
      i === index ? { ...ad, [field]: value } : ad,
    );
    setAdvertisements(updatedAdvertisements);
  };
  const handleMemberChange = (index, value) => {
    const updatedMembers = members.map((member, i) =>
      i === index ? { ...member, name: value } : member,
    );
    setMembers(updatedMembers);
  };

  const handleRemovePosition = (index) => {
    setPositions(positions.filter((_, i) => i !== index));
  };
  const handleRemoveAdvertisement = (index) => {
    setAdvertisements(advertisements.filter((_, i) => i !== index));
  };
  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");
    try {
      const formData = new FormData();
      formData.append("has_funds", values.has_funds);
      if (postFile) {
        formData.append("post_on_website", postFile);
      }
      formData.append("pid", projectData.pid);
      formData.append("positions", JSON.stringify(positions));
      formData.append("advertisements", JSON.stringify(advertisements));
      const updatedMembers = [
        ...members,
        ...projectData.copis.map((copi) => ({ role: "Co-PI", name: copi })),
      ];
      formData.append("members", JSON.stringify(updatedMembers));
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.post(
        advertisementAndCommitteeApprovalFormSubmissionRoute,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      console.log("Form submitted successfully:", response.data);
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
        {loading ? (
          <Container py="xl">
            {" "}
            <Loader size="lg" />
          </Container>
        ) : projectData &&
          Object.keys(projectData).length > 0 &&
          "pi_id" in projectData ? (
          <Paper padding="lg" shadow="s" className={classes.formContainer}>
            <Title order={2} className={classes.formTitle}>
              {" "}
              Approval Of Advertisement And Selection Committee{" "}
            </Title>

            {projectData.status === "OnGoing" ? (
              <>
                <Grid gutter="xl">
                  <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      {" "}
                      Project Title{" "}
                    </Text>
                    <TextInput
                      value={projectData.name}
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
                      {" "}
                      Project ID{" "}
                    </Text>
                    <TextInput
                      value={projectData.pid}
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
                      {" "}
                      Project Sponsor Agency{" "}
                    </Text>
                    <TextInput
                      value={projectData.sponsored_agency}
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
                      {" "}
                      Project Sanction Date{" "}
                    </Text>
                    <TextInput
                      type="date"
                      value={projectData.sanction_date}
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
                      {" "}
                      Project Start Date{" "}
                    </Text>
                    <TextInput
                      type="date"
                      value={projectData.start_date}
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
                      {" "}
                      Project Duration{" "}
                    </Text>
                    <TextInput
                      value={`${projectData.duration} months`}
                      readOnly
                      styles={{
                        input: {
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed", // Show forbidden cursor
                        },
                      }}
                    />
                  </Grid.Col>

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
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Availability Of Sufficient Funds To Accomodate The
                      Required Manpower <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Radio.Group {...form.getInputProps("has_funds")}>
                      <Radio value="Yes" label="Yes" />
                      <Radio value="No" label="No" />
                    </Radio.Group>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "space-between",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <Text
                        size="xl"
                        weight={500}
                        className={classes.fieldLabel}
                        style={{ textAlign: "center", flex: 1 }}
                      >
                        Staff Positions
                      </Text>
                      <Button
                        onClick={handleAddPosition}
                        color="cyan"
                        variant="outline"
                        style={{
                          borderRadius: "8px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        Add Position
                      </Button>
                    </div>
                    {positions.map((pos, index) => (
                      <Grid key={index} gutter="sm" align="center">
                        <Grid.Col span={5}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Position Rank{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <Select
                            placeholder="Choose type of sanctioned position"
                            value={pos.type}
                            onChange={(value) =>
                              handlePositionChange(index, "type", value)
                            }
                            data={[
                              "Research Associate",
                              "Senior Research Fellow",
                              "Junior Research Fellow",
                              "Project Trainee",
                              "Supporting Staff",
                            ]}
                            icon={<User />}
                            error={!pos.type && "This field is required"}
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Available Spots{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            placeholder="Enter number of positions available"
                            value={pos.available || 0}
                            min={0}
                            onChange={(value) =>
                              handlePositionChange(index, "available", value)
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={3}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Occupied Spots{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            placeholder="Enter number of positions occupied"
                            value={pos.occupied || 0}
                            min={0}
                            disabled={pos.type === ""}
                            onChange={(value) =>
                              handlePositionChange(index, "occupied", value)
                            }
                          />
                        </Grid.Col>

                        {index !== 0 && (
                          <Grid.Col span={1}>
                            <Text
                              size="md"
                              weight={500}
                              className={classes.fieldLabel}
                            >
                              {" "}
                              Remove{" "}
                            </Text>
                            <Button
                              color="red"
                              onClick={() => handleRemovePosition(index)}
                              variant="outline"
                            >
                              <Trash />
                            </Button>
                          </Grid.Col>
                        )}

                        {pos.occupied && (
                          <Grid.Col key={pos.occupied} span={12}>
                            <Text
                              size="md"
                              weight={500}
                              className={classes.fieldLabel}
                            >
                              {" "}
                              Details of Incumbents For {pos.type}{" "}
                            </Text>
                            {pos.incumbents.map((inc, ind) => (
                              <React.Fragment key={ind}>
                                <Text
                                  size="lg"
                                  weight={500}
                                  style={{ textAlign: "center" }}
                                >
                                  {" "}
                                  Name and Last Date of Tenure of Incumbent{" "}
                                  {ind + 1}{" "}
                                </Text>
                                <Grid gutter="sm" mb="16px">
                                  <Grid.Col span={6}>
                                    <TextInput
                                      placeholder="Name of position holder"
                                      style={{ width: "100%" }}
                                      value={inc.name}
                                      onChange={(e) =>
                                        handleIncumbentChange(
                                          index,
                                          ind,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Grid.Col>

                                  <Grid.Col span={6}>
                                    <input
                                      type="date"
                                      style={{ width: "100%" }}
                                      value={inc.date}
                                      placeholder="Last date of tenure"
                                      onChange={(e) =>
                                        handleIncumbentChange(
                                          index,
                                          ind,
                                          "date",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Grid.Col>
                                </Grid>
                              </React.Fragment>
                            ))}
                          </Grid.Col>
                        )}
                      </Grid>
                    ))}
                  </Grid.Col>

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
                    <Text size="lg" weight={500} className={classes.fieldLabel}>
                      Signed Advertisement To Be Uploaded On Institute Website{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    {/* <Radio.Group {...form.getInputProps("post_on_website")}>
                      <Radio value="Yes" label="Yes" />
                      <Radio value="No" label="No" />
                    </Radio.Group> */}
                    <div className={classes.fileInputContainer}>
                      <Button
                        variant="outline"
                        color="#15ABFF"
                        size="md"
                        component="label"
                        className={classes.fileInputButton}
                        style={{ borderRadius: "8px", marginTop: "5px" }}
                      >
                        <FileText size={26} style={{ marginRight: "3px" }} />
                        Choose File
                        <input
                          type="file"
                          hidden
                          required
                          onChange={(event) =>
                            setPostFile(event.currentTarget.files[0])
                          }
                        />
                      </Button>
                      {postFile && (
                        <span className={classes.fileName}>
                          {postFile.name}
                        </span>
                      )}
                    </div>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "space-between",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <Text
                        size="xl"
                        weight={500}
                        className={classes.fieldLabel}
                        style={{ textAlign: "center", flex: 1 }}
                      >
                        Positions To Be Advertised
                      </Text>
                      <Button
                        onClick={handleAddAdvertisement}
                        color="cyan"
                        variant="outline"
                        style={{
                          borderRadius: "8px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        Add Advertisement
                      </Button>
                    </div>
                    {advertisements.map((ad, index) => (
                      <Grid key={index} gutter="sm" align="center">
                        <Grid.Col span={11}>
                          <Text
                            size="lg"
                            weight={500}
                            style={{ textAlign: "center", width: "100%" }}
                          >
                            {" "}
                            Advertisement {index + 1}{" "}
                          </Text>
                        </Grid.Col>
                        {index !== 0 && (
                          <Grid.Col span={1}>
                            <Text
                              size="md"
                              weight={500}
                              className={classes.fieldLabel}
                            >
                              {" "}
                              Remove{" "}
                            </Text>
                            <Button
                              color="red"
                              onClick={() => handleRemoveAdvertisement(index)}
                              variant="outline"
                            >
                              <Trash />
                            </Button>
                          </Grid.Col>
                        )}
                        <Grid.Col span={6}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Position Rank{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <Select
                            placeholder="Choose type of sanctioned position"
                            value={ad.type}
                            onChange={(value) =>
                              handleAdvertisementChange(index, "type", value)
                            }
                            data={[
                              "Research Associate",
                              "Senior Research Fellow",
                              "Junior Research Fellow",
                              "Project Trainee",
                              "Other",
                            ]}
                            icon={<User />}
                            error={!ad.type && "This field is required"}
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Consolidated Salary + Housing Rent Allowance{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            required
                            placeholder="Enter net amount (in INR)"
                            min={0}
                            value={ad.salary}
                            onChange={(value) =>
                              handleAdvertisementChange(index, "salary", value)
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Appointment Duration (in months){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <NumberInput
                            required
                            placeholder="Enter tenure duration"
                            value={ad.duration}
                            min={0}
                            onChange={(value) =>
                              handleAdvertisementChange(
                                index,
                                "duration",
                                value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Eligibility Criteria
                          </Text>
                          <Textarea
                            placeholder="Eligibility requirements"
                            value={ad.eligibility}
                            onChange={(e) =>
                              handleAdvertisementChange(
                                index,
                                "eligibility",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={4}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Last Date Of Applying
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <input
                            required
                            type="date"
                            value={ad.submission_date}
                            placeholder="Last date of application submission"
                            onChange={(e) =>
                              handleAdvertisementChange(
                                index,
                                "submission_date",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={4}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Date Of Written Test{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <input
                            required
                            type="date"
                            value={ad.test_date}
                            placeholder="Proposed date of written test"
                            onChange={(e) =>
                              handleAdvertisementChange(
                                index,
                                "test_date",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={4}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Interview Date{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <input
                            required
                            type="date"
                            value={ad.interview_date}
                            placeholder="Proposed date of interview"
                            onChange={(e) =>
                              handleAdvertisementChange(
                                index,
                                "interview_date",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Mode Of Written Test{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <TextInput
                            required
                            placeholder="Enter mode in which written or skill test will be conducted"
                            value={ad.test_mode}
                            onChange={(e) =>
                              handleAdvertisementChange(
                                index,
                                "test_mode",
                                e.target.value,
                              )
                            }
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            Interview Location{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                          <TextInput
                            required
                            placeholder="Enter place or mode to conduct interview"
                            value={ad.interview_place}
                            onChange={(e) =>
                              handleAdvertisementChange(
                                index,
                                "interview_place",
                                e.target.value,
                              )
                            }
                          />
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "space-between",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <Text
                        size="xl"
                        weight={500}
                        className={classes.fieldLabel}
                        style={{ textAlign: "center", flex: 1 }}
                      >
                        Selection Committee Members
                      </Text>
                      <Button
                        onClick={handleAddMember}
                        color="cyan"
                        variant="outline"
                        style={{
                          borderRadius: "8px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        Add Member
                      </Button>
                    </div>

                    <Grid.Col span={6}>
                      <Text
                        size="md"
                        weight={500}
                        className={classes.fieldLabel}
                      >
                        PI (Convener of the Committee){" "}
                        <span style={{ color: "red" }}>*</span>
                      </Text>
                      <TextInput
                        value={projectData.pi_name}
                        readOnly
                        styles={{ input: { cursor: "not-allowed" } }}
                      />
                    </Grid.Col>

                    {projectData.copis.map((copi, index) => (
                      <Grid.Col span={6} key={index}>
                        <Text
                          size="md"
                          weight={500}
                          className={classes.fieldLabel}
                        >
                          Co-PI {index + 1}
                        </Text>
                        <TextInput
                          value={copi}
                          readOnly
                          styles={{ input: { cursor: "not-allowed" } }}
                        />
                      </Grid.Col>
                    ))}

                    {members.map((member, index) => (
                      <Grid key={index} gutter="xl" align="center">
                        <Grid.Col span={5}>
                          <Text
                            size="md"
                            weight={500}
                            className={classes.fieldLabel}
                          >
                            {member.role === "Other"
                              ? `${member.role} Member ${index - 1}`
                              : `${member.role} Member`}
                          </Text>
                          <Select
                            placeholder="Choose Fusion username of member"
                            value={member.name}
                            onChange={(value) =>
                              handleMemberChange(index, value)
                            }
                            data={profIDs}
                            icon={<User />}
                            searchable
                            error={!member.name && "This field is required"}
                          />
                        </Grid.Col>
                        {member.role === "Other" && (
                          <Grid.Col span={1}>
                            <Text
                              size="md"
                              weight={500}
                              className={classes.fieldLabel}
                            >
                              {" "}
                              Remove{" "}
                            </Text>
                            <Button
                              color="red"
                              onClick={() => handleRemoveMember(index)}
                              variant="outline"
                            >
                              <Trash />
                            </Button>
                          </Grid.Col>
                        )}
                      </Grid>
                    ))}
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
                </div>{" "}
              </>
            ) : (
              <Text color="red" size="xl" weight={700} align="center">
                Project has not yet commenced!
              </Text>
            )}
          </Paper>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load project details
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

AdvertisementAndCommitteeApprovalForm.propTypes = {
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
    sanction_date: PropTypes.string,
    start_date: PropTypes.string,
  }).isRequired,
};

export default AdvertisementAndCommitteeApprovalForm;

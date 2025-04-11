import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Badge,
  Group,
  Table,
  Loader,
  Container,
  Divider,
  Grid,
  GridCol,
} from "@mantine/core";
import { DownloadSimple } from "@phosphor-icons/react";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import {
  fetchStaffPositionsRoute,
  fetchBudgetRoute,
} from "../../../../routes/RSPCRoutes";
import { badgeColor } from "../../helpers/badgeColours";
import { host } from "../../../../routes/globalRoutes";

function ProjectViewModal({ opened, onClose, projectData }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);

  const [staffPositions, setStaffPositions] = useState(null);
  useEffect(() => {
    if (opened && projectData) {
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
          setStaffPositions(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
          setFetched(false);
        }
      };
      fetchStaffPositions();
    }
  }, [projectData]);

  const [budget, setBudget] = useState(null);
  useEffect(() => {
    if (opened && projectData) {
      setLoading(true);
      const fetchBudget = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");
        try {
          const response = await axios.get(fetchBudgetRoute(projectData.pid), {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          console.log("Fetched Budget:", response.data);
          setBudget(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
          setFetched(false);
        }
      };
      fetchBudget();
    }
  }, [projectData]);

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {loading ? (
        <Container py="xl">
          {" "}
          <Loader size="lg" />
        </Container>
      ) : projectData && Object.keys(projectData).length > 0 && fetched ? (
        <>
          <Group position="apart" style={{ marginBottom: 20 }}>
            <Text size="32px" weight={700}>
              {projectData.name}
            </Text>
            <Badge
              color={badgeColor[projectData.status]}
              size="lg"
              style={{ fontSize: "18px" }}
            >
              {projectData.status}
            </Badge>
          </Group>

          <Grid gutter="xs" style={{ marginBottom: 20 }}>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>
                  Principal Investigator:
                </strong>{" "}
                {projectData.pi_name} ({projectData.pi_id})
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
                <strong style={{ color: "blue" }}>Sponsoring Agency:</strong>{" "}
                {projectData.sponsored_agency}
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
                <strong style={{ color: "blue" }}>Scheme:</strong>{" "}
                {projectData.scheme}
              </Text>
            </GridCol>
            <Grid.Col span={6}>
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
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
                  Open File
                </Button>
              )}
            </Grid.Col>
            <GridCol span={12}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Project Abstract:</strong>{" "}
                {projectData.description}
              </Text>
            </GridCol>

            <Grid.Col span={12}>
              <Divider my="lg" label="X X X" labelPosition="center" size="md" />
            </Grid.Col>

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
                  Project Sanction Date:
                </strong>{" "}
                {new Date(projectData.sanction_date).toLocaleDateString()}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Project Duration:</strong>{" "}
                {projectData.duration} months
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>
                  Project Commencement Date:
                </strong>{" "}
                {new Date(projectData.start_date).toLocaleDateString()}
              </Text>
            </GridCol>

            <Grid.Col span={12}>
              <Divider my="lg" label="X X X" labelPosition="center" size="md" />
            </Grid.Col>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>
                  Total Proposed Budget:
                </strong>{" "}
                INR {projectData.total_budget}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>
                  Total Sanctioned Amount:
                </strong>{" "}
                INR {projectData.sanctioned_amount}
              </Text>
            </GridCol>
            {budget && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Current Funds:</strong> INR{" "}
                  {budget.current_funds}
                </Text>
              </GridCol>
            )}
            <Grid.Col span={6}>
              <Text size="xl">
                <strong
                  style={{
                    color: "blue",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Project Registration
                </strong>
              </Text>
              {projectData.registration_form && (
                <Button
                  variant="outline"
                  color="#15ABFF"
                  size="md"
                  className={classes.fileInputButton}
                  style={{ borderRadius: "8px" }}
                  component="a"
                  href={`${host}/${projectData.registration_form}`} // Directly access the file URL
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
                  Open Registration
                </Button>
              )}
            </Grid.Col>
          </Grid>

          {budget && Object.keys(budget).length > 0 && (
            <>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Budget Heads</strong>
              </Text>
              <Table striped>
                <thead style={{ textAlign: "left" }}>
                  <tr>
                    <th>
                      <Text size="lg">
                        <strong>Category</strong>
                      </Text>
                    </th>
                    {budget.manpower.map((_, index) => (
                      <th key={index}>
                        <Text size="lg" weight="bold">
                          <strong>Year {index + 1}</strong>
                        </Text>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "manpower",
                    "travel",
                    "contingency",
                    "consumables",
                    "equipments",
                  ].map((category) => (
                    <tr key={category}>
                      <td>
                        <Text size="lg">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                      </td>
                      {budget[category].map((value, index) => (
                        <td key={index}>
                          <Text size="lg">{value}</Text>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Overhead Expenses:</strong>{" "}
                INR {budget.overhead}
              </Text>
            </>
          )}

          {staffPositions && Object.keys(staffPositions).length > 0 && (
            <>
              <Divider my="lg" label="X X X" labelPosition="center" size="md" />
              <Text size="xl">
                <strong style={{ color: "blue" }}>Project Personnel</strong>
              </Text>
              <Table striped>
                <thead style={{ textAlign: "left" }}>
                  <tr>
                    <th>
                      <Text size="lg">
                        <strong>Designation</strong>
                      </Text>
                    </th>
                    <th>
                      <Text size="lg">
                        <strong>Available Spots</strong>
                      </Text>
                    </th>
                    <th>
                      <Text size="lg">
                        <strong>Occupied Spots</strong>
                      </Text>
                    </th>
                    <th>
                      <Text size="lg">
                        <strong>Current Staff</strong>
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(staffPositions.positions).map((position) => (
                    <tr key={position}>
                      <td>
                        <Text size="lg">{position}</Text>
                      </td>
                      <td>
                        <Text size="lg">
                          {staffPositions.positions[position][0]}
                        </Text>
                      </td>
                      <td>
                        <Text size="lg">
                          {staffPositions.positions[position][1]}
                        </Text>
                      </td>
                      <td>
                        <Text size="lg">
                          {staffPositions.incumbents[position]?.length > 0
                            ? staffPositions.incumbents[position].map(
                                (incumbent, index) => (
                                  <div key={index}>{incumbent.name}</div>
                                ),
                              )
                            : "None"}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </>
      ) : (
        <Text color="red" size="xl" weight={700} align="center">
          Failed to load project details
        </Text>
      )}
    </Modal>
  );
}

ProjectViewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectData: PropTypes.shape({
    pid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    pi_name: PropTypes.string,
    pi_id: PropTypes.string.isRequired,
    access: PropTypes.string,
    sponsored_agency: PropTypes.string.isRequired,
    dept: PropTypes.string,
    scheme: PropTypes.string,
    type: PropTypes.string,
    start_date: PropTypes.string,
    submission_date: PropTypes.string,
    sanction_date: PropTypes.string,
    total_budget: PropTypes.number,
    sanctioned_amount: PropTypes.number,
    duration: PropTypes.number,
    copis: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.string,
    registration_form: PropTypes.string,
  }).isRequired,
};

export default ProjectViewModal;

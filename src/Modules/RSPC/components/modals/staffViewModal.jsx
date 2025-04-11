import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Text,
  Badge,
  Group,
  Divider,
  Grid,
  GridCol,
} from "@mantine/core";
import { DownloadSimple } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { badgeColor } from "../../helpers/badgeColours";
import { host } from "../../../../routes/globalRoutes";

function StaffViewModal({ opened, onClose, staffData }) {
  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {staffData && Object.keys(staffData).length > 0 ? (
        <>
          <Group position="apart" style={{ marginBottom: 10 }}>
            <Text size="32px" weight={700}>
              {staffData.person && staffData.person.trim() !== ""
                ? staffData.person
                : "TBD"}
            </Text>
            <Badge
              color={badgeColor[staffData.approval]}
              size="lg"
              style={{ fontSize: "18px" }}
            >
              {staffData.approval}
            </Badge>
          </Group>

          <Text size="26px" style={{ marginBottom: 30 }}>
            {staffData.type}
          </Text>
          <Grid gutter="xs" style={{ marginBottom: 20 }}>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Project Title:</strong>{" "}
                {staffData.project_title}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Staff ID:</strong>{" "}
                {staffData.sid}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Joining Date:</strong>{" "}
                {new Date(staffData.start_date).toLocaleDateString()}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Appointment Duration:</strong>{" "}
                {staffData.duration} months
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Consolidated Salary:</strong>{" "}
                INR {staffData.salary}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Salary Per Month:</strong> INR{" "}
                {staffData.salary_per_month}
              </Text>
            </GridCol>

            <Grid.Col span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Resume</strong>
              </Text>
              {staffData.biodata_final[staffData.biodata_number] && (
                <Button
                  variant="outline"
                  color="#15ABFF"
                  size="md"
                  className={classes.fileInputButton}
                  style={{ borderRadius: "8px" }}
                  component="a"
                  href={`${host}/${staffData.biodata_final[staffData.biodata_number]}`} // Directly access the file URL
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
                  Open Resume
                </Button>
              )}
            </Grid.Col>
            <GridCol span={6}>
              <Text size="xl">
                <strong
                  style={{
                    color: "blue",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Joining Report
                </strong>
              </Text>
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
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
                  Open Report
                </Button>
              )}
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
                  ID Card
                </strong>
              </Text>
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
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
                  Open ID
                </Button>
              )}
            </GridCol>

            <Grid.Col span={12}>
              <Divider my="lg" label="X X X" labelPosition="center" size="md" />
            </Grid.Col>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Test Date:</strong>{" "}
                {new Date(staffData.test_date).toLocaleDateString()}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Mode Of Test:</strong>{" "}
                {staffData.test_mode}
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

            <GridCol span={12}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Eligibility Criteria:</strong>{" "}
                {staffData.eligibility}
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
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
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
                  Selection Committee
                </strong>
              </Text>
              {staffData.selection_committee &&
              Object.keys(staffData.selection_committee).length > 0 ? (
                <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                  {Object.values(staffData.selection_committee)
                    .flat()
                    .map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                </ul>
              ) : (
                <Text color="dimmed">None</Text>
              )}
            </Grid.Col>

            <Grid.Col span={12}>
              <Divider my="lg" label="X X X" labelPosition="center" size="md" />
            </Grid.Col>

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
              <Text size="xl">
                <strong
                  style={{
                    color: "blue",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Final Selections
                </strong>
              </Text>
              {staffData.final_selection.length > 0 ? (
                <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                  {staffData.final_selection.map((candidate, index) => (
                    <li key={index}>{candidate.name}</li>
                  ))}
                </ul>
              ) : (
                <Text color="dimmed">None</Text>
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
                  Waiting List
                </strong>
              </Text>
              {staffData.waiting_list.length > 0 ? (
                <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                  {staffData.waiting_list.map((candidate, index) => (
                    <li key={index}>{candidate.name}</li>
                  ))}
                </ul>
              ) : (
                <Text color="dimmed">None</Text>
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
                  <DownloadSimple size={26} style={{ marginRight: "3px" }} />
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
  );
}

StaffViewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  staffData: PropTypes.shape({
    sid: PropTypes.number,
    pid: PropTypes.number,
    project_title: PropTypes.string,
    eligibility: PropTypes.string,
    ad_file: PropTypes.string,
    comparative_file: PropTypes.string,
    selection_committee: PropTypes.arrayOf(PropTypes.string),
    test_date: PropTypes.string,
    test_mode: PropTypes.string,
    submission_date: PropTypes.string,
    id_card: PropTypes.string,
    duration: PropTypes.number,
    candidates_applied: PropTypes.number,
    candidates_called: PropTypes.number,
    candidates_interviewed: PropTypes.number,
    approval: PropTypes.string,
    joining_report: PropTypes.string,
    type: PropTypes.string,
    sanction_date: PropTypes.string,
    start_date: PropTypes.string,
    interview_date: PropTypes.string,
    interview_place: PropTypes.string,
    salary: PropTypes.number,
    salary_per_month: PropTypes.number,
    person: PropTypes.string,
    biodata_final: PropTypes.arrayOf(PropTypes.string),
    biodata_number: PropTypes.number,
    final_selection: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ),
    waiting_list: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

export default StaffViewModal;

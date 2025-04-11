import PropTypes from "prop-types";
import cx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, Badge, ScrollArea, Text } from "@mantine/core";
import {
  Eye,
  FileText,
  PlusCircle,
  ArrowBendDoubleUpRight,
} from "@phosphor-icons/react";
import classes from "../../styles/tableStyle.module.css";
import ProjectViewModal from "../modals/projectViewModal";
import ProjectApprovalModal from "../modals/projectApprovalModal";
import ProjectClosureModal from "../modals/projectClosureModal";
import { badgeColor } from "../../helpers/badgeColours";

function ProjectTable({ setActiveTab, projectsData }) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [projectApprovalModalOpened, setProjectApprovalModalOpened] =
    useState(false);
  const [projectClosureModalOpened, setProjectClosureModalOpened] =
    useState(false);

  const role = useSelector((state) => state.user.role);

  const navigate = useNavigate();
  const handleProjectActionClick = (row) => {
    if (role.includes("rspc_admin")) {
      setActiveTab("3");
    } else {
      const tabIndex = row.status === "OnGoing" ? "2" : "1";
      navigate("/research/forms", {
        state: { data: row, initialTab: tabIndex },
      });
    }
  };

  const handleProjectAddClick = () => {
    setActiveTab("3");
  };

  const handleViewClick = (row) => {
    setSelectedProject(row);
    setViewModalOpened(true);
  };

  const handleProjectDecisionClick = (row) => {
    setSelectedProject(row);
    if (row.end_approval === "Pending") {
      setProjectClosureModalOpened(true);
    } else {
      setProjectApprovalModalOpened(true);
    }
  };

  const rows = projectsData.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td className={classes["row-content"]}>
        <Badge color={badgeColor[row.status]} size="lg">
          {row.status}
        </Badge>
      </Table.Td>
      <Table.Td className={classes["row-content"]}>{row.name}</Table.Td>
      <Table.Td className={classes["row-content"]}>{row.pid}</Table.Td>
      <Table.Td className={classes["row-content"]}>
        {row.sponsored_agency}
      </Table.Td>

      <Table.Td className={classes["row-content"]}>
        {role.includes("HOD") ? (
          <Button
            onClick={() => handleProjectDecisionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.status !== "HoD Forward"}
            style={{ borderRadius: "8px" }}
          >
            <ArrowBendDoubleUpRight size={26} style={{ marginRight: "3px" }} />
            Forward File
          </Button>
        ) : role.includes("Professor") ? (
          <Button
            onClick={() => handleProjectActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.status !== "Submitted" && row.status !== "OnGoing"}
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            {row.status === "Submitted" ? "Register Project" : "Forms"}
          </Button>
        ) : !role.includes("SectionHead_RSPC") ? (
          <Button
            onClick={() => handleProjectActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Forms
          </Button>
        ) : row.status === "RSPC Approval" || row.end_approval === "Pending" ? (
          <Button
            onClick={() => handleProjectDecisionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={
              row.status !== "RSPC Approval" && row.end_approval !== "Pending"
            }
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Dean Approval
          </Button>
        ) : (
          <Button
            onClick={() => handleProjectActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.status !== "Registered" && row.status !== "OnGoing"}
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            {row.status === "Registered" ? "Commence Project" : "Forms"}
          </Button>
        )}
      </Table.Td>

      {/* {role.includes("Professor") && (
        <Table.Td className={classes["row-content"]}>
          <Button
            onClick={() => handleRequestClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.status === "Completed"}
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Request
          </Button>
        </Table.Td>
      )}

      {username === rspc_admin && (
        <Table.Td className={classes["row-content"]}>
          <Button
            onClick={() => handleActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.status === "Completed"}
            style={{ borderRadius: "8px" }}
          >
            <FlagCheckered size={26} style={{ marginRight: "3px" }} />
            Action
          </Button>
        </Table.Td>
      )} */}

      <Table.Td className={classes["row-content"]}>
        <Button
          onClick={() => handleViewClick(row)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "8px" }}
        >
          <Eye size={26} style={{ margin: "3px" }} />
          View
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: "3% 5%" }}>
      <ScrollArea
        h={350}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th className={classes["header-cell"]}>Status</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Project Name
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>Project ID</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Sponsor Agency
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Action Centre
              </Table.Th>
              {/* {role.includes("Professor") && (
                <Table.Th className={classes["header-cell"]}>
                  Request Application
                </Table.Th>
              )} */}
              <Table.Th className={classes["header-cell"]}>
                Project Info
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          {projectsData ? (
            <Table.Tbody>{rows}</Table.Tbody>
          ) : (
            <Text color="red" size="xl" weight={700} align="center">
              Unable to load project details
            </Text>
          )}
        </Table>
      </ScrollArea>
      {role.includes("Professor") && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "3%",
            marginRight: "3%",
          }}
        >
          <Button
            onClick={handleProjectAddClick}
            color="green"
            size="s"
            style={{ borderRadius: "8px", padding: "7px 18px" }}
          >
            <PlusCircle size={26} style={{ marginRight: "3px" }} />
            Add Project
          </Button>
        </div>
      )}
      <ProjectViewModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        projectData={selectedProject}
      />
      <ProjectApprovalModal
        opened={projectApprovalModalOpened}
        onClose={() => setProjectApprovalModalOpened(false)}
        projectData={selectedProject}
        setActiveTab={setActiveTab}
      />
      <ProjectClosureModal
        opened={projectClosureModalOpened}
        onClose={() => setProjectClosureModalOpened(false)}
        projectData={selectedProject}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

ProjectTable.propTypes = {
  projectsData: PropTypes.arrayOf(
    PropTypes.shape({
      pid: PropTypes.number,
    }),
  ),
  setActiveTab: PropTypes.func.isRequired,
};

export default ProjectTable;

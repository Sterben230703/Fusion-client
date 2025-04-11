import PropTypes from "prop-types";
import cx from "clsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Container,
  Text,
  Loader,
  Button,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { ArrowBendDoubleUpRight, Eye, FileText } from "@phosphor-icons/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "../../styles/tableStyle.module.css";
import { fetchStaffRoute, fetchPIDsRoute } from "../../../../routes/RSPCRoutes";
import StaffViewModal from "../modals/staffViewModal";
import { badgeColor } from "../../helpers/badgeColours";
import SelectionCommitteeReportApprovalModal from "../modals/selectionCommitteeReportApprovalModal";
import AdvertisementAndCommitteeApprovalModal from "../modals/advertisementAndCommitteeApprovalModal";
import JoiningReportAndIDCardApprovalModal from "../modals/joiningReportAndIDCardApprovalModal";

function StaffTable({ setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);
  const role = useSelector((state) => state.user.role);

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [documentModalOpened, setDocumentModalOpened] = useState(false);
  const [reportApprovalModalOpened, setReportApprovalModalOpened] =
    useState(false);
  const [
    advertisementAndCommitteeApprovalModalOpened,
    setAdvertisementAndCommitteeApprovalModalOpened,
  ] = useState(false);

  const [PIDs, setPIDs] = useState([]);
  useEffect(() => {
    const fetchPIDs = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(fetchPIDsRoute(role), {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log("Fetched PIDs:", response.data);
        setPIDs(response.data);
      } catch (error) {
        console.error("Error during Axios GET:", error);
      }
    };
    fetchPIDs();
  }, [role]);

  const handleViewClick = (row) => {
    setSelectedStaff(row);
    setViewModalOpened(true);
  };

  const handleStaffDecisionClick = (row) => {
    setSelectedStaff(row);
    if (!row.final_selection || row.final_selection.length === 0) {
      setAdvertisementAndCommitteeApprovalModalOpened(true);
    } else if (row.doc_approval === "Pending") {
      setDocumentModalOpened(true);
    } else {
      setReportApprovalModalOpened(true);
    }
  };

  const navigate = useNavigate();
  const handleStaffActionClick = (row) => {
    navigate("/research/forms", {
      state: { data: row, initialTab: "4" },
    });
  };

  const handleCommitteeActionClick = (row) => {
    setSelectedStaff(row);
    if ("pi_name" in row) {
      navigate("/research/forms", {
        state: { data: row, initialTab: "3" },
      });
    } else {
      setReportApprovalModalOpened(true);
    }
  };

  const [staffRequests, setStaffRequests] = useState([]);
  useEffect(() => {
    setLoading(true);
    const fetchStaffData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");

      try {
        const response = await axios.get(fetchStaffRoute, {
          params: { "pids[]": PIDs, role },
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials if necessary
        });
        console.log("Fetched Staff:", response.data);
        setStaffRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error during fetching details:", error);
        setLoading(false);
        setFetched(false);
      }
    };
    fetchStaffData();
  }, [PIDs]);

  const staffRows = staffRequests.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td className={classes["row-content"]}>
        <Badge color={badgeColor[row.approval]} size="lg">
          {row.approval}
        </Badge>
      </Table.Td>
      <Table.Td className={classes["row-content"]}>
        {row.project_title}
      </Table.Td>
      <Table.Td className={classes["row-content"]}>
        {row.person ? row.person : "TBD"}
      </Table.Td>
      <Table.Td className={classes["row-content"]}>
        {role.includes("HOD") ? (
          <Button
            onClick={() => handleStaffDecisionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.approval !== "HoD Forward"}
            style={{ borderRadius: "8px" }}
          >
            <ArrowBendDoubleUpRight size={26} style={{ marginRight: "3px" }} />
            Forward File
          </Button>
        ) : role.includes("SectionHead_RSPC") ? (
          <Button
            onClick={() => handleStaffDecisionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={
              (row.approval !== "RSPC Approval" ||
                row.current_approver !== role) &&
              row.doc_approval !== "Pending"
            }
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Dean Approval
          </Button>
        ) : role.includes("rspc_admin") ? (
          <Button
            onClick={() => handleStaffDecisionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={
              row.approval !== "RSPC Approval" || row.current_approver !== role
            }
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Dean Approval
          </Button>
        ) : !("pi_name" in row) ? (
          <Button
            onClick={() => handleCommitteeActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.approval !== "Committee Approval"}
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            {"pi_name" in row ? "Selection Committee Report" : ""}
            Approve Report
          </Button>
        ) : row.approval === "Hiring" ? (
          <Button
            onClick={() => handleCommitteeActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.approval !== "Hiring"}
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Selection Committee Report
          </Button>
        ) : (
          <Button
            onClick={() => handleStaffActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            disabled={row.approval !== "Approved"}
            style={{ borderRadius: "8px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Forms
          </Button>
        )}
      </Table.Td>
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
                Project Title
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>Staff Name</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Action Centre
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>
                File Details
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan="6">
                  <Container py="xl">
                    <Loader size="lg" />
                  </Container>
                </Table.Td>
              </Table.Tr>
            ) : fetched ? (
              <> {staffRows} </>
            ) : (
              <Table.Tr>
                <Table.Td colSpan="6" align="center">
                  <Text color="red" size="xl" weight={700} align="center">
                    Failed to load personnel details
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <StaffViewModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        staffData={selectedStaff}
      />
      <SelectionCommitteeReportApprovalModal
        opened={reportApprovalModalOpened}
        onClose={() => setReportApprovalModalOpened(false)}
        staffData={selectedStaff}
        setActiveTab={setActiveTab}
      />
      <AdvertisementAndCommitteeApprovalModal
        opened={advertisementAndCommitteeApprovalModalOpened}
        onClose={() => setAdvertisementAndCommitteeApprovalModalOpened(false)}
        staffData={selectedStaff}
        setActiveTab={setActiveTab}
      />
      <JoiningReportAndIDCardApprovalModal
        opened={documentModalOpened}
        onClose={() => setDocumentModalOpened(false)}
        staffData={selectedStaff}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

StaffTable.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default StaffTable;

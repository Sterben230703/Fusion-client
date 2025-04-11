import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Group,
  Stack,
  Loader,
  Button,
  Badge,
  Paper,
} from "@mantine/core";
import { Paperclip } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import { host } from "../../../routes/globalRoutes/index";
import { GetFileData, GetItems } from "../handlers/handlers";
import DeanProcess from "./FileActions/DeanProcess";
import DirectorApproval from "./FileActions/DirectorApproval";
import ForwardFile from "./FileActions/ForwardFile";
import ProcessBill from "./FileActions/ProcessBill";
import CreateProposalForm from "./ProposalForm";
import ProposalTable from "./viewproposals";
import IssueWorkOrderForm from "./IssueWorkOrderForm";
import AdminApproval from "./FileActions/AdminApproval";
import ItemsTable from "./ItemsTable";

export default function ViewRequestFile({ request, handleBackToList }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [fileAction, setFileAction] = useState(0);
  const [view, setView] = useState("main");
  const role = useSelector((state) => state.user.role);
  const [proposaldata, setProposalData] = useState({});
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      remarks: "",
      file: null,
      designation: null,
    },
    validate: {
      designation: (value) => (value ? null : "Field is required"),
    },
  });
  const statusBadge = () => {
    if (request.status === "Pending")
      return <Badge color="yellow">PENDING</Badge>;
    if (request.status === "Work Completed")
      return <Badge color="#1e90ff">WORK COMPLETED</Badge>;
    if (request.status === "Work Order issued")
      return <Badge color="#1e90ff">WORK ISSUED</Badge>;
    if (request.status === "Approved by Director")
      return <Badge color="green">APPROVED</Badge>;
    if (request.status === "Approved by IWD Admin")
      return <Badge color="#1e90ff">Approved by IWD Admin</Badge>;
    return <Badge color="red">REJECTED</Badge>;
  };
  const fileActionsList = [
    <br />,
    <DeanProcess
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <ForwardFile
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <DirectorApproval
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <ProcessBill
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
    <AdminApproval
      handleBackToList={handleBackToList}
      form={form}
      request={request}
    />,
  ];
  const allowedFormList = [
    "admin iwd",
    "ee",
    "executive engineer(civil)",
    "electrical_ae",
    "civil_ae",
    "civil_je",
    "electrical_je",
    "electrical_ae",
    "junior engineer",
    "sectionhead_iwd",
  ];
  const allowedRoleslist = [
    "director",
    "admin iwd",
    "ee",
    "executive engineer(civil)",
    "electrical_ae",
    "civil_ae",
    "civil_je",
    "electrical_je",
    "electrical_ae",
    "auditor",
    "accounts admin",
    "junior engineer",
    "sectionhead_iwd",
  ];
  useEffect(() => {
    GetFileData({ setLoading, form, request, setMessages });
    if (role === "Director") {
      if (request.processed_by_director === 0) setFileAction(3);
      else setFileAction(0);
    } else if (role === "Dean (P&D)" && request.processed_by_dean === 0) {
      setFileAction(1);
    } else if (role === "Admin IWD" && request.processed_by_admin === 0) {
      setFileAction(5);
    } else if (
      request.processed_by_admin === 1 &&
      allowedRoleslist.includes(role.toLowerCase())
    ) {
      setFileAction(2);
    } else {
      setFileAction(0);
    }
    if (request.active_proposal) {
      // setSelectedProposalId(request.active_proposal);
      GetItems(setLoading, request.active_proposal).then((data) => {
        console.log("datadata\n\n", data);
        setProposalData(data);
      });
    }
  }, []);
  return (
    <Paper
      style={{
        border: "1px solid #ccc",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        margin: "0 auto",
        backgroundColor: "#fff",
        borderLeft: "8px solid #15ABFF",
      }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {loading ? (
          <Loader size="lg" />
        ) : view === "proposalForm" ? (
          <CreateProposalForm
            onBack={() => setView("main")}
            request_id={request.request_id}
            submitter={() => {
              handleBackToList();
            }}
          />
        ) : view === "proposalTable" ? (
          <ProposalTable
            requestId={request.request_id}
            onBack={() => setView("main")}
          />
        ) : view === "IssueWorkOrderForm" ? (
          <IssueWorkOrderForm
            workOrder={request}
            onBack={() => setView("main")}
            submitter={() => {
              handleBackToList();
            }}
          />
        ) : (
          <>
            <Group position="apart" mb="md">
              <Text fw={700} size="xl" style={{ color: "#1e90ff" }}>
                Request Information
              </Text>
              {statusBadge()}
            </Group>
            <Group position="apart" mb="md">
              <Text style={{ color: "#1e90ff", fontWeight: 600 }}>
                Created By:
              </Text>
              <Text>{messages.file?.uploader || "N/A"}</Text>
            </Group>
            <Text size="lg" mt="md" fw={500} style={{ color: "#1e90ff" }}>
              File Tracking Information
            </Text>
            <Stack spacing="md">
              {messages.tracks?.map((message, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Group position="apart">
                    <Text style={{ color: "#1e90ff", fontWeight: 600 }}>
                      Sent by:
                    </Text>
                    <Text>{message.current_id}</Text>
                  </Group>
                  <Group position="apart">
                    <Text style={{ color: "#1e90ff", fontWeight: 600 }}>
                      Sent Date & Time:
                    </Text>
                    <Text>{message.forward_date || "N/A"}</Text>
                  </Group>
                  <Group position="apart">
                    <Text style={{ color: "#1e90ff", fontWeight: 600 }}>
                      Received by:
                    </Text>
                    <Text>{message.receiver_id || "N/A"}</Text>
                  </Group>
                  <Text style={{ color: "#1e90ff", fontWeight: 600 }}>
                    Remarks:
                  </Text>
                  <Text>{message.remarks}</Text>
                  {message.upload_file && (
                    <Group spacing="xs" mt="xs">
                      <Paperclip size="1rem" />
                      <Button
                        variant="light"
                        component="a"
                        href={`${host}/${message.upload_file}`}
                        target="_blank"
                        radius="md"
                        sx={{
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {message.upload_file.split("/")[2]}
                      </Button>
                    </Group>
                  )}
                </Card>
              ))}
            </Stack>

            <Group spacing="md" mt="md">
              {request.active_proposal != null ||
              !allowedFormList.includes(role.toLowerCase()) ||
              request.processed_by_admin === 0 ? null : (
                <Button
                  variant="light"
                  radius="md"
                  onClick={() => setView("proposalForm")}
                  sx={{
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  Proposal Form
                </Button>
              )}
              <Button
                variant="light"
                radius="md"
                onClick={() => setView("proposalTable")}
                sx={{
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                View Proposals
              </Button>
              {request.work_order === 0 &&
              request.processed_by_director === 1 ? (
                <Button
                  variant="light"
                  radius="md"
                  onClick={() => setView("IssueWorkOrderForm")}
                  sx={{
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  Issue Work Order
                </Button>
              ) : null}
            </Group>
            {request.active_proposal ? (
              Object.keys(proposaldata).length > 0 ? (
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <ItemsTable proposaldata={proposaldata} />
                </div>
              ) : (
                <Loader size="lg" />
              )
            ) : null}
            {fileActionsList[fileAction]}
          </>
        )}
      </Card>
    </Paper>
  );
}

ViewRequestFile.propTypes = {
  request: PropTypes.shape({
    request_id: PropTypes.number.isRequired,
    name: PropTypes.string,
    area: PropTypes.string,
    description: PropTypes.string,
    requestCreatedBy: PropTypes.string,
    status: PropTypes.string.isRequired,
    file_id: PropTypes.number.isRequired,
    processed_by_admin: PropTypes.number,
    processed_by_director: PropTypes.number,
    processed_by_dean: PropTypes.number,
    work_order: PropTypes.number,
    work_completed: PropTypes.number,
    active_proposal: PropTypes.number,
  }).isRequired,
  handleBackToList: PropTypes.func.isRequired,
};

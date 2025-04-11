import React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  Button,
  Text,
  Group,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { Paperclip, CaretLeft } from "@phosphor-icons/react";
import { host } from "../../../routes/globalRoutes";

export default function ItemsTable({ setSelectedProposalId, proposaldata }) {
  const { itemsList, proposal } = proposaldata;

  return (
    <Paper
      shadow="xl"
      radius="md"
      p="lg"
      style={{
        marginTop: "40px",
        marginBottom: "40px",
        background: "#ffffff",
      }}
    >
      <Group position="apart" mb="xl" align="flex-end">
        <Text fw={700} size="2xl" color="blue">
          Proposal Information
        </Text>
      </Group>
      <Stack spacing="md" mb="lg">
        <Group position="apart">
          <Text fw={600} color="blue">
            ID:
          </Text>
          <Text>{proposal?.id || "N/A"}</Text>
        </Group>
        <Group position="apart">
          <Text fw={600} color="blue">
            Created By:
          </Text>
          <Text>{proposal?.created_by || "N/A"}</Text>
        </Group>
        <Group position="apart">
          <Text fw={600} color="blue">
            Budget:
          </Text>
          <Text>{proposal?.proposal_budget || "N/A"}</Text>
        </Group>
        {proposal.supporting_documents && (
          <Group position="apart">
            <Text fw={600} color="blue">
              Docs:
            </Text>
            <Group spacing="xs">
              <Paperclip size="16" />
              <Button
                variant="light"
                component="a"
                href={`${host}/${proposal.supporting_documents}`}
                target="_blank"
                radius="md"
                sx={{
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {proposal.supporting_documents.split("/")[2] || "N/A"}
              </Button>
            </Group>
          </Group>
        )}
      </Stack>
      <ScrollArea>
        <Table highlightOnHover striped>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ padding: "12px" }}>Item ID</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Description</th>
              <th style={{ padding: "12px" }}>Unit</th>
              <th style={{ padding: "12px" }}>Price/Unit</th>
              <th style={{ padding: "12px" }}>Total</th>
              <th style={{ padding: "12px" }}>Document</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.length > 0 ? (
              itemsList.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "12px" }}>{item.id}</td>
                  <td style={{ padding: "12px" }}>{item.name}</td>
                  <td style={{ padding: "12px" }}>{item.description}</td>
                  <td style={{ padding: "12px" }}>{item.unit}</td>
                  <td style={{ padding: "12px" }}>{item.price_per_unit}</td>
                  <td style={{ padding: "12px" }}>{item.total_price}</td>
                  <td style={{ padding: "12px" }}>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => window.open(item.docs, "_blank")}
                      disabled={!item.docs}
                      radius="xl"
                      variant="outline"
                    >
                      View Docs
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {setSelectedProposalId && (
          <Button
            leftIcon={<CaretLeft size={16} />}
            onClick={() => setSelectedProposalId(null)}
            radius="xl"
            variant="outline"
          >
            Back
          </Button>
        )}
      </ScrollArea>
    </Paper>
  );
}

ItemsTable.propTypes = {
  setSelectedProposalId: PropTypes.func,
  proposaldata: PropTypes.shape({
    itemsList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        unit: PropTypes.string,
        price_per_unit: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        docs: PropTypes.string,
      }),
    ),
    proposal: PropTypes.shape({
      proposal_budget: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      created_by: PropTypes.string,
      supporting_documents: PropTypes.string,
    }),
  }).isRequired,
};

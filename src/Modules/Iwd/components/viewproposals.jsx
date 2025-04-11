import React, { useState, useEffect } from "react";
import { Container, Table, Button, Title, Loader, Flex } from "@mantine/core";
import PropTypes from "prop-types";
import { GetItems, GetProposals } from "../handlers/handlers";
import ItemList from "./ItemsTable";

function ProposalTable({ requestId, onBack }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [proposaldata, setProposalData] = useState({});

  useEffect(() => {
    if (requestId) {
      GetProposals({
        setLoading,
        setProposalList: setProposals,
        requestId,
        setProposalIds: () => {},
      });
    }
  }, [requestId]);

  const handleViewItems = (proposalId) => {
    GetItems(setLoading, proposalId).then((data) => {
      setProposalData(data);
    });
    setSelectedProposalId(proposalId);
  };

  return (
    <Container>
      {loading ? (
        <Loader size="lg" />
      ) : !selectedProposalId ? (
        <>
          <Title mb="md">Proposals</Title>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Proposal ID</th>
                <th>Current Status</th>
                <th>Created By</th>
                <th>Last Updated</th>
                <th>Created At</th>
                <th>Proposal Budget</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {proposals.length > 0 ? (
                proposals.map((proposal) => (
                  <tr key={proposal.id}>
                    <td>{proposal.id}</td>
                    <td>{proposal.status}</td>
                    <td>{proposal.created_by}</td>
                    <td>
                      {new Date(proposal.updated_at).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </td>
                    <td>{proposal.proposal_budget}</td>
                    <td>
                      <Button
                        size="xs"
                        onClick={() => handleViewItems(proposal.id)}
                        style={{
                          backgroundColor: "#1E90FF",
                          color: "white",
                          borderRadius: "20px",
                        }}
                      >
                        View Items
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No proposals available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Flex direction="row" gap="xs" mt="md">
            <Button
              size="sm"
              variant="light"
              color="gray"
              style={{
                width: "100px",
                backgroundColor: "#1E90FF",
                color: "white",
                borderRadius: "20px",
              }}
              onClick={onBack}
            >
              Back
            </Button>
          </Flex>
        </>
      ) : (
        <ItemList
          setSelectedProposalId={setSelectedProposalId}
          proposaldata={proposaldata}
        />
      )}
    </Container>
  );
}

ProposalTable.propTypes = {
  onBack: PropTypes.func.isRequired,
  requestId: PropTypes.number.isRequired,
};

export default ProposalTable;

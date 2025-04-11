import React, { useState, useEffect } from "react";
import { Button, Group, Table, Badge, Select } from "@mantine/core";
import { InventoryRequest } from "../../../routes/inventoryRoutes";

function InventoryRequests() {
  const [filter, setFilter] = useState("all");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch(InventoryRequest, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching inventory requests:", error);
      }
    }
    fetchRequests();
  }, [token]);

  const handleStatusChange = async (requestId, newStatus) => {
    if (newStatus === "UNAPPROVED") {
      newStatus = "NOT_APPROVED";
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/inventory/api/requests/${requestId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ approval_status: newStatus }),
        },
      );

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(
          `Failed to update: ${responseData.detail || "Unknown error"}`,
        );
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.request_id === requestId
            ? { ...req, approval_status: newStatus }
            : req,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const status = request.approval_status.toUpperCase();
    switch (filter) {
      case "approved":
        return status === "APPROVED";
      case "pending":
        return status === "PENDING";
      case "unapproved":
        return status !== "APPROVED" && status !== "PENDING";
      default:
        return true;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2
        style={{ color: "#007BFF", textAlign: "center", marginBottom: "20px" }}
      >
        Inventory Requests
      </h2>

      {isSmallScreen ? (
        <Select
          placeholder="Filter Requests"
          data={[
            { value: "all", label: "All Requests" },
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "unapproved", label: "Unapproved" },
          ]}
          value={filter}
          onChange={setFilter}
          style={{ marginBottom: "20px", width: "80%" }}
        />
      ) : (
        <Group position="center" style={{ marginBottom: "20px" }}>
          {["all", "approved", "pending", "unapproved"].map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? "filled" : "outline"}
              style={{ margin: "0 5px" }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Group>
      )}

      <div
        style={{
          width: "80%",
          overflowX: "auto",
          maxHeight: "500px", // Adjust height as needed
          overflowY: "auto",
          border: "1px solid #ddd",
        }}
      >
        <Table
          style={{
            minWidth: "1000px", // Ensures the table doesn't shrink too much
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f0f0f0",
                borderBottom: "2px solid #ddd",
              }}
            >
              <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                Date
              </th>
              <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                Item
              </th>
              <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                Department
              </th>
              <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                Purpose
              </th>
              <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                Specifications
              </th>
              <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => {
              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: "15px", border: "1px solid #ddd" }}>
                    {new Date(request.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ddd" }}>
                    {request.item_name}
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ddd" }}>
                    {request.department_name}
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ddd" }}>
                    {request.purpose}
                  </td>
                  <td style={{ padding: "15px", border: "1px solid #ddd" }}>
                    {request.specifications}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <Badge
                      color={
                        request.approval_status.toUpperCase() === "APPROVED"
                          ? "green"
                          : request.approval_status.toUpperCase() === "PENDING"
                            ? "yellow"
                            : "red"
                      }
                    >
                      {request.approval_status.toUpperCase()}
                    </Badge>
                    {request.approval_status.toUpperCase() === "PENDING" && (
                      <div style={{ marginTop: "5px" }}>
                        <Button
                          size="xs"
                          color="green"
                          onClick={() =>
                            handleStatusChange(request.request_id, "APPROVED")
                          }
                          style={{ marginRight: "5px" }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() =>
                            handleStatusChange(request.request_id, "UNAPPROVED")
                          }
                        >
                          ✗
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default InventoryRequests;

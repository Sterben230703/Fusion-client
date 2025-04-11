import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Group,
  Button,
  Text,
  ScrollArea,
  Select,
} from "@mantine/core";
import { useSelector } from "react-redux";
import AddProduct from "./AddProduct";
import TransferProduct from "./TransferProduct";
import RequestProduct from "./RequestProduct";
import "../styles/popupModal.css";
import { InventoryDepartments } from "../../../routes/inventoryRoutes";

export default function Inventory() {
  const role = useSelector((state) => state.user.role);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showTransferProductModal, setShowTransferProductModal] =
    useState(false);
  const [showRequestProductModal, setShowRequestProductModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const departments = [
    { label: "CSE", value: "CSE" },
    { label: "ECE", value: "ECE" },
    { label: "ME", value: "ME" },
    { label: "SM", value: "SM" },
    { label: "NS", value: "NS" },
    { label: "Design", value: "Design" },
  ];

  // Helper function to return the auto-assigned department based on role
  const getDepartmentLabel = () => {
    if (role === "deptadmin_cse") return "CSE";
    if (role === "deptadmin_ece" || role === "Junior Technician") return "ECE";
    if (role === "deptadmin_me") return "Mech";
    if (role === "deptadmin_sm") return "SM";
    if (role === "deptadmin_design") return "Design";
    return "";
  };

  // Determine if the user has a default role (full UI) or not (auto‑assigned dept)
  const isDefaultRole = !(
    role === "deptadmin_cse" ||
    role === "deptadmin_ece" ||
    role === "Junior Technician" ||
    role === "deptadmin_me" ||
    role === "deptadmin_sm" ||
    role === "deptadmin_design"
  );

  // Auto-set the department for non-default roles if not already set
  useEffect(() => {
    if (!selectedDepartment && !isDefaultRole) {
      setSelectedDepartment(getDepartmentLabel());
    }
  }, [role, selectedDepartment, isDefaultRole]);

  const fetchDepartmentData = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please log in to add a product");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        InventoryDepartments(`${selectedDepartment}`),
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch department data");
      }

      const data = await response.json();
      console.log("Department data:", data);
      setInventoryData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department data:", error);
      setLoading(false);
    }
  };

  // Fetch data when selectedDepartment is set/changed
  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentData();
    }
  }, [selectedDepartment]);

  // Modal open/close functions
  const openAddProductModal = () => setShowAddProductModal(true);
  const closeAddProductModal = () => setShowAddProductModal(false);

  const openTransferProductModal = () => setShowTransferProductModal(true);
  const closeTransferProductModal = () => setShowTransferProductModal(false);

  const openRequestProductModal = () => setShowRequestProductModal(true);
  const closeRequestProductModal = () => setShowRequestProductModal(false);

  return (
    <>
      {/* Breadcrumb */}
      <Text style={{ marginLeft: "70px", fontSize: "16px" }} color="dimmed">
        <span
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedDepartment("")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedDepartment("");
            }
          }}
        >
          Departments
        </span>
        {" > "} <span>{selectedDepartment}</span>
      </Text>

      <Container
        style={{
          maxWidth: "1000px",
          maxHeight: "1000px",
          padding: "20px",
        }}
      >
        <Text
          align="center"
          style={{
            fontSize: "26px",
            marginBottom: "20px",
            fontWeight: 600,
            color: "#228BE6",
          }}
        >
          {selectedDepartment} Department Inventory
        </Text>

        {/* Dropdown for department selection */}
        <Select
          placeholder="Select Department"
          data={departments}
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          style={{ width: "90%", margin: "0 auto 20px auto" }}
        />

        {/* Action Buttons */}
        {isDefaultRole ? (
          <Group
            position="center"
            style={{
              marginBottom: "20px",
              gap: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="filled"
              color="blue"
              onClick={openTransferProductModal}
              size="md"
            >
              Transfer Item
            </Button>
            <Button
              variant="filled"
              color="blue"
              onClick={openAddProductModal}
              size="md"
            >
              Add Product
            </Button>
          </Group>
        ) : (
          <Group position="center" style={{ marginBottom: "20px" }}>
            <Button
              variant="filled"
              color="blue"
              onClick={openRequestProductModal}
              size="md"
            >
              Request Product
            </Button>
          </Group>
        )}

        {/* Inventory Table */}
        <ScrollArea style={{ width: "80%", margin: "0 auto" }}>
          <Table
            style={{
              width: "100%",
              border: "1px solid #ddd",
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
                  Item
                </th>
                <th style={{ padding: "15px", border: "1px solid #ddd" }}>
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    Loading data...
                  </td>
                </tr>
              ) : (
                inventoryData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #ddd",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "15px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {item.item_name}
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </ScrollArea>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                overflow: "hidden",
              }}
              role="button"
              tabIndex={0}
              onClick={closeAddProductModal}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && closeAddProductModal()
              }
              aria-label="Close Add Product Modal Background"
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                zIndex: 1001,
                overflow: "hidden",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={closeAddProductModal}
                aria-label="Close Modal"
              >
                X
              </button>

              <div
                style={{
                  margin: "-80px 0 -65px 0",
                  height: "835px",
                  overflow: "hidden",
                }}
              >
                <AddProduct
                  onSuccess={closeAddProductModal}
                  selectedDepartment={selectedDepartment}
                  val="departments"
                  name="department_name"
                />
              </div>
            </div>
          </>
        )}

        {/* Transfer Product Modal */}
        {showTransferProductModal && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                overflow: "hidden",
              }}
              role="button"
              tabIndex={0}
              onClick={closeTransferProductModal}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                closeTransferProductModal()
              }
              aria-label="Close Transfer Product Modal Background"
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                zIndex: 1001,
                overflow: "hidden",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={closeTransferProductModal}
                aria-label="Close Modal"
              >
                X
              </button>

              <div
                style={{
                  margin: "-80px 0 -65px 0",
                  height: "835px",
                  overflow: "hidden",
                }}
              >
                <TransferProduct />
              </div>
            </div>
          </>
        )}

        {/* Request Product Modal (for non-default roles) */}
        {!isDefaultRole && showRequestProductModal && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                overflow: "hidden",
              }}
              role="button"
              tabIndex={0}
              onClick={closeRequestProductModal}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                closeRequestProductModal()
              }
              aria-label="Close Request Product Modal Background"
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                zIndex: 1001,
                overflow: "hidden",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={closeRequestProductModal}
                aria-label="Close Modal"
              >
                X
              </button>

              <div style={{ margin: "20px" }}>
                <RequestProduct
                  closeModal={closeRequestProductModal}
                  selectedDepartment={selectedDepartment}
                />
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

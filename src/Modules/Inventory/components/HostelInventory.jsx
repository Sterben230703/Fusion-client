import React, { useState, useEffect } from "react";
import { Table, Group, Button, Text, Select, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import AddProduct from "./AddProduct";
import TransferProduct from "./TransferProduct";
import RequestProduct from "./RequestProduct";
import { InventorySections } from "../../../routes/inventoryRoutes";

export default function HostelInventory() {
  const role = useSelector((state) => state.user.role);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showTransferProductModal, setShowTransferProductModal] =
    useState(false);
  const [showRequestProductModal, setShowRequestProductModal] = useState(false);

  // Full list of departments (will be overridden for specific roles)
  let departments = [
    { label: "H1", value: "H1" },
    { label: "H3", value: "H3" },
    { label: "H4", value: "H4" },
    { label: "Panini", value: "Panini" },
    { label: "Nagarjuna", value: "Nagarjuna" },
    { label: "Maa Saraswati", value: "Maa Saraswati" },
    { label: "RSPC", value: "RSPC" },
    { label: "GymKhana", value: "GymKhana" },
    { label: "IWD", value: "IWD" },
    { label: "Mess", value: "Mess" },
    { label: "Academic", value: "Academic" },
    { label: "VH", value: "VH" },
  ];

  // Returns the appropriate department label and customizes the department list based on role.
  const renderDepartmentLabel = () => {
    if (role === "ps_admin") {
      return selectedDepartment || "H1";
    }
    switch (role) {
      case "hall1caretaker":
        departments = [{ label: "H1", value: "H1" }];
        return "H1";
      case "hall3caretaker":
        departments = [{ label: "H3", value: "H3" }];
        return "H3";
      case "hall4caretaker":
        departments = [{ label: "H4", value: "H4" }];
        return "H4";
      case "phcaretaker":
        departments = [{ label: "Panini", value: "Panini" }];
        return "Panini";
      case "nhcaretaker":
        departments = [{ label: "Nagarjuna", value: "Nagarjuna" }];
        return "Nagarjuna";
      case "mshcaretaker":
        departments = [{ label: "Maa Saraswati", value: "Maa Saraswati" }];
        return "Maa Saraswati";
      case "rspc_admin":
        departments = [{ label: "RSPC", value: "RSPC" }];
        return "RSPC";
      case "SectionHead_IWD":
        departments = [{ label: "IWD", value: "IWD" }];
        return "IWD";
      case "mess_manager":
        departments = [{ label: "Mess", value: "Mess" }];
        return "Mess";
      case "acadadmin":
        departments = [{ label: "Academic", value: "Academic" }];
        return "Academic";
      case "VhCaretaker":
        departments = [{ label: "VH", value: "VH" }];
        return "VH";
      default:
        return "H1";
    }
  };

  // Auto-set the department if not already selected.
  useEffect(() => {
    if (!selectedDepartment) {
      if (role === "ps_admin") {
        setSelectedDepartment("H1");
      } else {
        setSelectedDepartment(renderDepartmentLabel());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, selectedDepartment]);

  // Fetch inventory data based on the selected department.
  const fetchDepartmentData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to view inventory");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(InventorySections(`${selectedDepartment}`), {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch department data");
      }
      const data = await response.json();
      setInventoryData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department data: ", error);
      setLoading(false);
    }
  };

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
          onClick={() => setSelectedDepartment("")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setSelectedDepartment("");
          }}
        >
          Sections
        </span>
        {" > "} <span>{renderDepartmentLabel()}</span>
      </Text>

      <Text
        align="center"
        style={{
          fontSize: "26px",
          marginBottom: "20px",
          fontWeight: 600,
          color: "#228BE6",
        }}
      >
        {renderDepartmentLabel()} Inventory
      </Text>

      {/* Dropdown for department selection (always visible) */}
      <Select
        placeholder="Select Department"
        data={departments.map((dept) => ({
          value: dept.value,
          label: dept.label,
        }))}
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        style={{
          marginBottom: "20px",
          width: "70%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      {/* Action Buttons */}
      {role === "ps_admin" ? (
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
        <Group
          position="center"
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="filled"
            color="blue"
            size="md"
            onClick={openRequestProductModal}
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

      {/* Modals */}
      {role === "ps_admin" && showAddProductModal && (
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
            }}
            role="button"
            tabIndex={0}
            onClick={closeAddProductModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") closeAddProductModal();
            }}
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
            <div style={{ margin: "20px" }}>
              <AddProduct
                closeModal={closeAddProductModal}
                selectedDepartment={selectedDepartment}
                val="sections"
                name="section_name"
              />
            </div>
          </div>
        </>
      )}

      {role === "ps_admin" && showTransferProductModal && (
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
            }}
            role="button"
            tabIndex={0}
            onClick={closeTransferProductModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                closeTransferProductModal();
            }}
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
            <div style={{ margin: "20px" }}>
              <TransferProduct
                closeModal={closeTransferProductModal}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </div>
        </>
      )}

      {role !== "ps_admin" && showRequestProductModal && (
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
            }}
            role="button"
            tabIndex={0}
            onClick={closeRequestProductModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                closeRequestProductModal();
            }}
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
    </>
  );
}

import React, { useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Select,
  Group,
  Text,
  ScrollArea,
} from "@mantine/core";

const departments = [
  "CSE",
  "ECE",
  "Mech",
  "SM",
  "Design",
  "NS",
  "H1",
  "H3",
  "H4",
  "Panini",
  "Nagarjuna",
  "Maa Saraswati",
  "RSPC",
  "GymKhana",
  "IWD",
  "Mess",
  "Academic",
  "VH",
];

const inventoryData = [
  { product: "Computer", quantity: 10 },
  { product: "Oscilloscope", quantity: 5 },
  { product: "Projector", quantity: 3 },
  { product: "Printer", quantity: 7 },
  { product: "Desk Chair", quantity: 15 },
  { product: "Whiteboard", quantity: 4 },
  { product: "Laptop", quantity: 12 },
  { product: "Microscope", quantity: 6 },
  { product: "3D Printer", quantity: 2 },
  { product: "Tablet", quantity: 8 },
  { product: "Server Rack", quantity: 3 },
  { product: "Smart Board", quantity: 5 },
  { product: "Drone", quantity: 4 },
  { product: "VR Headset", quantity: 7 },
  { product: "Robot Kit", quantity: 9 },
];

const productDetails = {
  Computer: [
    {
      purchaseId: "C001",
      issueDate: "01-01-2024",
      department: "CSE",
      supplier: "ABC Corp",
      specification: "Intel i7, 16GB RAM, 512GB SSD",
    },
    {
      purchaseId: "C002",
      issueDate: "02-01-2024",
      department: "ECE",
      supplier: "XYZ Ltd",
      specification: "AMD Ryzen 5, 8GB RAM, 256GB SSD",
    },
    {
      purchaseId: "C003",
      issueDate: "03-01-2024",
      department: "Mech",
      supplier: "Tech Solutions",
      specification: "Intel i5, 8GB RAM, 1TB HDD",
    },
  ],
  Oscilloscope: [
    {
      purchaseId: "O001",
      issueDate: "05-02-2024",
      department: "ECE",
      supplier: "Tech Supplies",
      specification: "100MHz bandwidth, Dual Channel",
    },
    {
      purchaseId: "O002",
      issueDate: "06-02-2024",
      department: "CSE",
      supplier: "Electro World",
      specification: "200MHz bandwidth, 4 Channels",
    },
    {
      purchaseId: "O003",
      issueDate: "07-02-2024",
      department: "Design",
      supplier: "InnovaTech",
      specification: "50MHz bandwidth, Portable",
    },
  ],
  Projector: [
    {
      purchaseId: "P001",
      issueDate: "10-03-2024",
      department: "Mech",
      supplier: "Vision Ltd",
      specification: "1080p resolution, 5000 lumens",
    },
    {
      purchaseId: "P002",
      issueDate: "11-03-2024",
      department: "Design",
      supplier: "ProTech",
      specification: "4K resolution, Wireless",
    },
    {
      purchaseId: "P003",
      issueDate: "12-03-2024",
      department: "Academic",
      supplier: "EduTech",
      specification: "720p resolution, HDMI support",
    },
  ],
  Printer: [
    {
      purchaseId: "PR001",
      issueDate: "15-04-2024",
      department: "Admin",
      supplier: "PrintMaster",
      specification: "Laser Printer, Monochrome",
    },
    {
      purchaseId: "PR002",
      issueDate: "16-04-2024",
      department: "CSE",
      supplier: "Ink Solutions",
      specification: "Inkjet Printer, Color",
    },
    {
      purchaseId: "PR003",
      issueDate: "17-04-2024",
      department: "Design",
      supplier: "QuickPrint",
      specification: "All-in-One Printer, WiFi",
    },
  ],
  "Desk Chair": [
    {
      purchaseId: "DC001",
      issueDate: "20-05-2024",
      department: "Admin",
      supplier: "FurniCorp",
      specification: "Ergonomic, Mesh Back",
    },
    {
      purchaseId: "DC002",
      issueDate: "21-05-2024",
      department: "Design",
      supplier: "Comfort Works",
      specification: "Recliner, Leather",
    },
    {
      purchaseId: "DC003",
      issueDate: "22-05-2024",
      department: "Academic",
      supplier: "ErgoDesign",
      specification: "Adjustable Height, Cushion Seat",
    },
  ],
  Whiteboard: [
    {
      purchaseId: "WB001",
      issueDate: "25-06-2024",
      department: "Academic",
      supplier: "BoardMakers",
      specification: "4x6 ft, Magnetic",
    },
    {
      purchaseId: "WB002",
      issueDate: "26-06-2024",
      department: "CSE",
      supplier: "WriteRight",
      specification: "3x5 ft, Non-Magnetic",
    },
    {
      purchaseId: "WB003",
      issueDate: "27-06-2024",
      department: "Design",
      supplier: "SmartBoards",
      specification: "5x7 ft, Interactive",
    },
  ],
  Laptop: [
    {
      purchaseId: "L001",
      issueDate: "01-07-2024",
      department: "CSE",
      supplier: "TechWorld",
      specification: "Intel i9, 32GB RAM, 1TB SSD",
    },
    {
      purchaseId: "L002",
      issueDate: "02-07-2024",
      department: "ECE",
      supplier: "LaptopHub",
      specification: "AMD Ryzen 7, 16GB RAM, 512GB SSD",
    },
    {
      purchaseId: "L003",
      issueDate: "03-07-2024",
      department: "Academic",
      supplier: "EduTech",
      specification: "Intel i5, 8GB RAM, 256GB SSD",
    },
  ],
  Microscope: [
    {
      purchaseId: "M001",
      issueDate: "05-08-2024",
      department: "ECE",
      supplier: "LabTech",
      specification: "40x magnification, Digital",
    },
    {
      purchaseId: "M002",
      issueDate: "06-08-2024",
      department: "CSE",
      supplier: "MicroLabs",
      specification: "100x magnification, Optical",
    },
    {
      purchaseId: "M003",
      issueDate: "07-08-2024",
      department: "NS",
      supplier: "BioTech",
      specification: "60x magnification, Fluorescence",
    },
  ],
  "3D Printer": [
    {
      purchaseId: "3D001",
      issueDate: "10-09-2024",
      department: "Design",
      supplier: "Print3D",
      specification: "Resin-based, High Precision",
    },
    {
      purchaseId: "3D002",
      issueDate: "11-09-2024",
      department: "Mech",
      supplier: "Tech3D",
      specification: "Filament-based, Multi-Color",
    },
    {
      purchaseId: "3D003",
      issueDate: "12-09-2024",
      department: "CSE",
      supplier: "Innovate3D",
      specification: "Metal Printing, Industrial Use",
    },
  ],
  Tablet: [
    {
      purchaseId: "T001",
      issueDate: "15-10-2024",
      department: "CSE",
      supplier: "TabWorld",
      specification: "10-inch, 4GB RAM, 64GB Storage",
    },
    {
      purchaseId: "T002",
      issueDate: "16-10-2024",
      department: "ECE",
      supplier: "TabTech",
      specification: "12-inch, 6GB RAM, 128GB Storage",
    },
    {
      purchaseId: "T003",
      issueDate: "17-10-2024",
      department: "Academic",
      supplier: "EduTab",
      specification: "8-inch, 3GB RAM, 32GB Storage",
    },
  ],
  "Smart Board": [
    {
      purchaseId: "SB001",
      issueDate: "01-11-2024",
      department: "CSE",
      supplier: "SmartTech Inc.",
      specification: "65-inch, Touchscreen, 4K",
    },
  ],
};

export default function InventoryReport() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = item.product
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDepartment =
      !selectedDepartment ||
      (productDetails[item.product] &&
        productDetails[item.product].some(
          (detail) => detail.department === selectedDepartment,
        ));

    return matchesSearch && matchesDepartment;
  });

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
        height: "70vh",
        overflowY: "auto",
      }}
    >
      <Group position="center" mb="xl">
        <Text size="xl" weight={700} color="blue">
          Inventory Report
        </Text>
      </Group>

      {/* Primary Filter: Search by product name */}
      <TextInput
        placeholder="Search by product name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {/* Secondary Filter: Filter by department */}
      <Select
        data={[
          { value: "", label: "All Departments" },
          ...departments.map((dept) => ({ value: dept, label: dept })),
        ]}
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        placeholder="Filter by department"
        clearable
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {/* Main Table Container with ScrollArea */}
      <ScrollArea style={{ height: "70vh", marginBottom: "20px" }}>
        <Table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            overflowY: "auto",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f0f0f0",
                borderBottom: "2px solid #ddd",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Product
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Quantity
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.product}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <Button
                      variant="light"
                      color="blue"
                      size="xs"
                      onClick={() =>
                        setSelectedProduct(
                          selectedProduct === item.product
                            ? null
                            : item.product,
                        )
                      }
                    >
                      {selectedProduct === item.product
                        ? "Hide Details"
                        : "View Details"}
                    </Button>
                  </td>
                </tr>
                {selectedProduct === item.product &&
                  productDetails[item.product] && (
                    <tr>
                      <td colSpan={3}>
                        {/* Nested Table Container with ScrollArea */}
                        <ScrollArea
                          style={{ maxHeight: "100vh", margin: "10px 0" }}
                        >
                          <Table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  backgroundColor: "#e0e0e0",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  Purchase ID
                                </th>
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  Date of Issue
                                </th>
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  Department
                                </th>
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  Specification
                                </th>
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  Supplier Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {productDetails[item.product].map((detail, i) => (
                                <tr
                                  key={i}
                                  style={{
                                    backgroundColor:
                                      i % 2 === 0 ? "#f9f9f9" : "#fff",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.purchaseId}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.issueDate}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.department}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.specification}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.supplier}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </ScrollArea>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import {
  Table,
  Tabs,
  Text,
  Container,
  Group,
  Badge,
  Paper,
  Divider,
  Select,
  Button,
} from "@mantine/core";

import AddProduct from "./AddProduct";
import TransferProduct from "./TransferProduct";
import "../styles/popupModal.css";

const data = [
  {
    product: "Computer",
    quantity: 50,
    price: 10000,
    department: "CSE",
    lastUpdated: "29-03-2024",
  },
  {
    product: "Peripherals",
    quantity: 50,
    price: 500,
    department: "CSE",
    lastUpdated: "29-03-2024",
  },
  {
    product: "Projectors",
    quantity: 50,
    price: 15000,
    department: "CSE",
    lastUpdated: "14-03-2024",
  },
  {
    product: "Wires",
    quantity: 30,
    price: 600,
    department: "ECE",
    lastUpdated: "26-03-2024",
  },
  {
    product: "Voltmeter",
    quantity: 30,
    price: 1200,
    department: "ECE",
    lastUpdated: "26-03-2024",
  },
  {
    product: "Chairs",
    quantity: 80,
    price: 480,
    department: "Mech",
    lastUpdated: "29-03-2024",
  },
  {
    product: "Lasers",
    quantity: 140,
    price: 900,
    department: "SM",
    lastUpdated: "04-03-2024",
  },
  {
    product: "Boards",
    quantity: 140,
    price: 2050,
    department: "SM",
    lastUpdated: "04-03-2024",
  },
  {
    product: "Drafts",
    quantity: 5,
    price: 300,
    department: "Design",
    lastUpdated: "18-03-2024",
  },
  {
    product: "Screens",
    quantity: 5,
    price: 3000,
    department: "Design",
    lastUpdated: "18-03-2024",
  },
  {
    product: "Cables",
    quantity: 80,
    price: 80,
    department: "Mech",
    lastUpdated: "29-03-2024",
  },
];

export default function Inventory() {
  const [selectedCategory, setSelectedCategory] = useState("CSE");
  const [sortOption, setSortOption] = useState("Last Updated");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showTransferProductModal, setShowTransferProductModal] =
    useState(false);

  const categories = [
    { label: "CSE", value: "CSE" },
    { label: "ECE", value: "ECE" },
    { label: "Mech", value: "Mech" },
    { label: "SM", value: "SM" },
  ];

  const sortedData = [...data]
    .filter((item) => item.department === selectedCategory)
    .sort((a, b) => {
      if (sortOption === "Last Updated") {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      if (sortOption === "price") {
        return a.price - b.price;
      }
      return 0;
    });

  const filteredRows = sortedData.map((item, index) => (
    <React.Fragment key={index}>
      <tr>
        <td style={{ fontSize: "16px", textAlign: "center", padding: "10px" }}>
          {item.product}
        </td>
        <td style={{ fontSize: "16px", textAlign: "center", padding: "10px" }}>
          {item.quantity}
        </td>
        <td style={{ fontSize: "16px", textAlign: "center", padding: "10px" }}>
          {item.price}
        </td>
        <td style={{ fontSize: "16px", textAlign: "center", padding: "10px" }}>
          {item.department}
        </td>
        <td style={{ fontSize: "16px", textAlign: "center", padding: "10px" }}>
          {item.lastUpdated}
        </td>
      </tr>
      {index < sortedData.length - 1 && (
        <tr>
          <td colSpan="6">
            <Divider />
          </td>
        </tr>
      )}
    </React.Fragment>
  ));

  const openAddProductModal = () => {
    setShowAddProductModal(true); // Show the modal when "Add Product" is clicked
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false); // Close the modal when needed
  };

  const openTransferProductModal = () => {
    setShowTransferProductModal(true); // Show the modal when "Add Product" is clicked
  };

  const closeTransferProductModal = () => {
    setShowTransferProductModal(false); // Close the modal when needed
  };

  return (
    <Container>
      {/* Header Section with Badge Counts */}
      <Paper
        shadow="xs"
        p="lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "20px",
          marginBottom: "20px",
          padding: "30px",
        }}
      >
        <Group position="apart" spacing="xl">
          <div>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: "20px",
                color: "#000000",
              }}
            >
              Categories
            </Text>
            <Badge size="xl" color="blue">
              14
            </Badge>
          </div>
          <Divider
            orientation="vertical"
            style={{
              height: "65px",
              margin: "0 20px",
              backgroundColor: "black",
            }}
          />
          <div>
            <Text
              style={{
                fontFamily: "Manrope",
                fontSize: "20px",
                color: "#000000",
              }}
            >
              Total Products
            </Text>
            <Badge size="xl" color="blue">
              30252
            </Badge>
          </div>
          <Button
            color="blue"
            size="lg"
            style={{ marginLeft: "auto" }}
            onClick={openTransferProductModal}
          >
            Transfer Product
          </Button>
        </Group>
      </Paper>

      {/* Tabs and Table */}
      <Paper
        shadow="xs"
        p="lg"
        style={{ borderRadius: "20px", padding: "30px" }}
      >
        <Tabs defaultValue="CSE">
          <Tabs.List style={{ marginBottom: "15px" }}>
            {categories.map((category, index) => (
              <Tabs.Tab
                key={index}
                value={category.value}
                style={{
                  fontSize: "15px",
                  padding: "12px",
                  border: "1px solid black",
                  width: "100px",
                  borderRadius: "5px",
                  marginRight: "1px",
                  backgroundColor:
                    selectedCategory === category.value
                      ? "#1366D9"
                      : "lightblue",
                }}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Tabs.Tab>
            ))}

            <Button
              className="button-blue"
              style={{ marginLeft: "auto" }}
              onClick={openAddProductModal}
            >
              Add Product
            </Button>
            <Button className="button-blue" style={{ marginLeft: "10px" }}>
              Filters
            </Button>
          </Tabs.List>

          <Group position="apart" style={{ marginBottom: "10px" }}>
            <Select
              value={sortOption}
              onChange={setSortOption}
              data={[
                { value: "Last Updated", label: "Last Updated" },
                { value: "price", label: "Price" },
              ]}
              placeholder="Sort By"
              style={{ width: "140px" }}
            />
          </Group>

          <div
            style={{
              height: "420px",
              overflowY: "scroll",
              scrollbarWidth: "thin",
            }}
          >
            <Table
              striped
              highlightOnHover
              verticalSpacing="lg"
              horizontalSpacing="xl"
              fontSize="lg"
            >
              <thead>
                <tr>
                  <th
                    style={{
                      fontSize: "18px",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    Products
                  </th>
                  <th
                    style={{
                      fontSize: "18px",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      fontSize: "18px",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      fontSize: "18px",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    Department
                  </th>
                  <th
                    style={{
                      fontSize: "18px",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    Last Updated
                  </th>
                </tr>
              </thead>

              <tbody>{filteredRows}</tbody>
            </Table>
          </div>

          <Group style={{ marginTop: "20px", justifyContent: "space-between" }}>
            <Button>Previous</Button>
            <Button>Next</Button>
          </Group>
        </Tabs>
      </Paper>

      {showAddProductModal && (
        <>
          <div className="overlay" onClick={closeAddProductModal} />
          <div className="modal">
            <button className="close-button" onClick={closeAddProductModal}>
              X
            </button>
            <AddProduct />
          </div>
        </>
      )}
      {showTransferProductModal && (
        <>
          <div className="overlay" onClick={closeTransferProductModal} />
          <div className="modal">
            <button
              className="close-button"
              onClick={closeTransferProductModal}
            >
              X
            </button>
            <TransferProduct />
          </div>
        </>
      )}
    </Container>
  );
}

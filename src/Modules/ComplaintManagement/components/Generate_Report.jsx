import React, { useEffect, useState } from "react";
import { Paper, Badge, Button, Flex, Divider, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { getComplaintReport } from "../routes/api"; // Ensure correct import path for getComplaintReport
import "../styles/GenerateReport.css";
import detailIcon from "../../../assets/detail.png";
import declinedIcon from "../../../assets/declined.png";
import resolvedIcon from "../../../assets/resolved.png";

const complaintTypes = [
  "Electricity",
  "Carpenter",
  "Plumber",
  "Garbage",
  "Dustbin",
  "Internet",
  "Other",
];

const locations = [
  "Hall-1",
  "Hall-3",
  "Hall-4",
  "Nagarjun Hostel",
  "Maa Saraswati Hostel",
  "Panini Hostel",
  "LHTC",
  "CORE LAB",
  "CC1",
  "CC2",
  "Rewa Residency",
  "NR2",
];

function GenerateReport() {
  const [complaintsData, setComplaintsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    complaintType: "",
    status: "",
    startDate: "",
    endDate: "",
    sortBy: "",
  });
  const username = useSelector((state) => state.user.username);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);

  const fetchComplaintsData = async () => {
    try {
      const { success, data, error } = await getComplaintReport(filters, token);
      if (success) {
        console.log("Fetched data:", data);
        setComplaintsData(data);
        setFilteredData(data);
      } else {
        console.error("Error fetching complaints data:", error);
        alert("Error fetching complaints. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred. Please try again.");
    }
  };

  const applyFilters = () => {
    let filtered = [...complaintsData];

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.location.toLowerCase() === filters.location.toLowerCase(),
      );
    }
    // Apply complaint type filter
    if (filters.complaintType) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaint_type.toLowerCase() ===
          filters.complaintType.toLowerCase(),
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (complaint) => String(complaint.status) === filters.status,
      );
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (complaint) =>
          new Date(complaint.complaint_date) >= new Date(filters.startDate),
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (complaint) =>
          new Date(complaint.complaint_date) <= new Date(filters.endDate),
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      if (filters.sortBy === "status") {
        filtered.sort((a, b) => {
          return a.status - b.status;
        });
      } else if (filters.sortBy === "mostRecent") {
        filtered.sort(
          (a, b) => new Date(b.complaint_date) - new Date(a.complaint_date),
        );
      } else if (filters.sortBy === "mostOlder") {
        filtered.sort(
          (a, b) => new Date(a.complaint_date) - new Date(b.complaint_date),
        );
      }
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchComplaintsData();
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, complaintsData]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const statusMapping = {
    0: "Pending",
    2: "Resolved",
    3: "Declined",
  };

  const generateCSV = () => {
    if (!filteredData.length) {
      console.error("No data to generate CSV");
      alert("No data to generate CSV");
      return;
    }

    const currentDateTime = new Date().toLocaleString().replace(",", "");
    const reportTitle = `Complaint Report`;
    const dateLine = `Date of Generation: ${currentDateTime}`;
    const userLine = `Generated by: ${username}`;

    const appliedFilters = [
      filters.complaintType && `Complaint Type: ${filters.complaintType}`,
      filters.location && `Location: ${filters.location}`,
      filters.status && `Status: ${statusMapping[filters.status]}`,
      filters.startDate && `From Date: ${filters.startDate}`,
      filters.endDate && `To Date: ${filters.endDate}`,
    ].filter(Boolean);

    // CSV headers
    const headers = ["Complaint Type", "Location", "Status", "Date", "Details"];

    // Create rows from complaints data
    const rows = filteredData.map((complaint) => [
      complaint.complaint_type,
      complaint.location,
      statusMapping[complaint.status] || "Pending",
      formatDate(complaint.complaint_date),
      complaint.details.replace(/,/g, ""), // Remove commas to prevent CSV formatting issues
    ]);

    const csvContent = [
      [reportTitle],
      [dateLine],
      [userLine],
      ...appliedFilters.map((line) => [line]),
      [],
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csvData = generateCSV();

    if (!csvData) return;

    // Create a Blob from the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });

    // Create a download link and simulate a click
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Complaint Report.csv";
    link.click();
  };

  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`; // Format: DD-MM-YYYY HH:MM
  };

  return (
    <div className="full-width-container ">
      <Paper
        radius="md"
        px="lg"
        pt="sm"
        pb="xl"
        style={{
          borderLeft: "0.6rem solid #15ABFF",
          width: "60vw",
          minHeight: "45vh",
          maxHeight: "78vh",
          overflowY: "auto",
          marginTop: "3.5vh",
        }}
        withBorder
        maw="1240px"
        backgroundColor="white"
      >
        <Flex direction="column ">
          {filteredData.length > 0 ? (
            filteredData.map((complaint, index) => {
              const displayedStatus =
                complaint.status === 2
                  ? "Resolved"
                  : complaint.status === 3
                    ? "Declined"
                    : "Pending";
              console.log("Complaint:", displayedStatus);

              return (
                <Paper
                  key={index}
                  radius="md"
                  px="lg"
                  pt="sm"
                  pb="xl"
                  style={{
                    width: "100%",
                    margin: "10px 0",
                  }}
                  withBorder
                >
                  <Flex direction="column" style={{ width: "100%" }}>
                    <Flex direction="row" justify="space-between">
                      <Flex direction="row" gap="xs" align="center">
                        <Text size="14px" style={{ fontWeight: "Bold" }}>
                          Complaint Id: {complaint.id}
                        </Text>
                        <Badge
                          size="lg"
                          color={
                            displayedStatus === "Resolved" ? "green" : "blue"
                          }
                        >
                          {complaint.complaint_type}
                        </Badge>
                      </Flex>
                      {displayedStatus === "Resolved" ? (
                        <img
                          src={resolvedIcon}
                          alt="Resolved"
                          style={{
                            width: "35px",
                            borderRadius: "50%",
                            backgroundColor: "#2BB673",
                            padding: "10px",
                          }}
                        />
                      ) : displayedStatus === "Declined" ? (
                        <img
                          src={declinedIcon}
                          alt="Declined"
                          style={{
                            width: "35px",
                            borderRadius: "50%",
                            backgroundColor: "#FF6B6B",
                            padding: "10px",
                          }}
                        />
                      ) : (
                        <img
                          src={detailIcon}
                          alt="Pending"
                          style={{
                            width: "35px",
                            borderRadius: "50%",
                            backgroundColor: "#FF6B6B",
                            padding: "10px",
                          }}
                        />
                      )}
                    </Flex>

                    <Flex direction="column" gap="xs">
                      <Text size="14px">
                        <b>Date:</b> {formatDateTime(complaint.complaint_date)}
                      </Text>
                      <Text size="14px">
                        <b>Location:</b> {complaint.specific_location},{" "}
                        {complaint.location}
                      </Text>
                    </Flex>

                    <Divider my="md" size="sm" />

                    <Flex
                      direction="row"
                      justify="space-between"
                      align="center"
                    >
                      <Text size="14px">
                        <b>Description:</b> {complaint.details}
                      </Text>
                    </Flex>
                  </Flex>
                </Paper>
              );
            })
          ) : (
            <p>No complaints found.</p>
          )}
        </Flex>
      </Paper>

      <div className="filter-card-container mt-5">
        <h2>Filters</h2>

        {role.includes("supervisor") && (
          <>
            <div className="filter-label" style={{ fontWeight: "bold" }}>
              Location
            </div>
            <select name="location" onChange={handleFilterChange}>
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </>
        )}

        {(role.includes("caretaker") || role.includes("convener")) && (
          <>
            <div className="filter-label" style={{ fontWeight: "bold" }}>
              Complaint Type
            </div>

            <select name="complaintType" onChange={handleFilterChange}>
              <option value="">Select Complaint Type</option>
              {complaintTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="filter-label" style={{ fontWeight: "bold" }}>
          Status
        </div>
        <select name="status" onChange={handleFilterChange}>
          <option value="">Select Status</option>
          <option value="0">Pending</option>
          <option value="2">Resolved</option>
          <option value="3">Declined</option>
        </select>

        <div className="filter-label" style={{ fontWeight: "bold" }}>
          From Date
        </div>
        <input type="date" name="startDate" onChange={handleFilterChange} />

        <div className="filter-label" style={{ fontWeight: "bold" }}>
          To Date
        </div>
        <input type="date" name="endDate" onChange={handleFilterChange} />

        <div className="filter-label" style={{ fontWeight: "bold" }}>
          Sort By
        </div>
        <select name="sortBy" onChange={handleFilterChange}>
          <option value="">Sort By</option>
          <option value="mostRecent">Most Recent</option>
          <option value="mostOlder">Most Older</option>
          <option value="status">Status</option>
        </select>

        <Flex direction="row-reverse">
          <Button onClick={downloadCSV} size="xs" variant="outline">
            Download CSV
          </Button>
        </Flex>
      </div>
    </div>
  );
}

export default GenerateReport;

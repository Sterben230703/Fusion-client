import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextInput,
  Textarea,
  Title,
  Button,
  FileInput,
  Group,
  Notification,
  Container,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MantineReactTable } from "mantine-react-table";
import { fetchRegistrationRoute } from "../../../routes/placementCellRoutes";

function CompanyRegistrationForm() {
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([
    {
      id: 1,
      companyName: "Company A",
      description: "Description A",
      address: "Address A",
      website: "www.companya.com",
    },
    {
      id: 2,
      companyName: "Company B",
      description: "Description B",
      address: "Address B",
      website: "www.companyb.com",
    },
    {
      id: 3,
      companyName: "Company C",
      description: "Description C",
      address: "Address C",
      website: "www.companyc.com",
    },
  ]);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(fetchRegistrationRoute, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.status !== 200) {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        } else {
          setCompanies(response.data);
        }
      } catch (err) {
        notifications.show({
          title: "Failed to fetch data",
          message: "Failed to fetch companies list",
          color: "red",
        });
        console.error(err);
      }
    };
    fetchRegistrationData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!companyName || !description || !address || !website) {
      setError("Please fill all required fields.");
      return;
    }
    const newRegistration = {
      companyName,
      description,
      address,
      website,
      logo,
    };
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        fetchRegistrationRoute,
        newRegistration,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        notifications.show({
          title: "Success",
          message: "successfully added!",
          color: "green",
          position: "top-center",
        });
        setCompanies([...companies, response.data]);
      } else {
        notifications.show({
          title: "Failed",
          message: `Failed to add`,
          color: "red",
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Error adding restriction:", err);
      notifications.show({
        title: "Error",
        message: "Failed to add restriction.",
        color: "red",
        position: "top-center",
      });
    }
  };

  const columns = [
    { accessorKey: "companyName", header: "Company Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "website", header: "Website" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Container mt="xl" flex={1}>
        <Title order={2} mb="xl">
          Company Registration
        </Title>
        {error && (
          <Notification color="red" onClose={() => setError("")}>
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Company Name"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <Textarea
            label="Company Description"
            placeholder="Enter a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextInput
            label="Company Address"
            placeholder="Enter company address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <TextInput
            label="Website URL"
            placeholder="Enter website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />
          <FileInput
            label="Company Logo"
            value={logo}
            onChange={setLogo}
            placeholder="Upload logo"
            accept="image/*"
          />
          <Group position="right" mt="md">
            <Button type="submit">Register Company</Button>
          </Group>
        </form>
      </Container>

      <Container mt="xl" flex={1}>
        <Title order={2} mb="xl">
          Registred Companies
        </Title>
        <MantineReactTable columns={columns} data={companies} />
      </Container>
    </div>
  );
}

export default CompanyRegistrationForm;

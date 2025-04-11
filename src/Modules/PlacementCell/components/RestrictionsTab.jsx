/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Container,
  Title,
  Button,
  Select,
  TextInput,
  Grid,
  Pagination,
  Alert,
  Chip,
  Text,
  ActionIcon,
  Group,
  Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Pencil, Trash } from "@phosphor-icons/react";
import axios from "axios";
import { MantineReactTable } from "mantine-react-table";
import { fetchRestrictionsRoute } from "../../../routes/placementCellRoutes";

function RestrictionsTab() {
  const [restrictions, setRestrictions] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const recordsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [condition, setCondition] = useState("");
  const [values, setValues] = useState([]);
  const [editingRestriction, setEditingRestriction] = useState(null);

  const conditionOptions = {
    cgpa: [
      { value: "less_than", label: "CGPA <" },
      { value: "greater_than", label: "CGPA >" },
    ],
    company: [
      { value: "equal", label: "Company = " },
      { value: "not_equal", label: "Company ≠" },
    ],
    year: [
      { value: "equal", label: "Year = " },
      { value: "greater_than", label: "Year >" },
      { value: "less_than", label: "Year <" },
    ],
    ctc: [
      { value: "greater_than", label: "CTC >" },
      { value: "less_than", label: "CTC <" },
    ],
  };

  useEffect(() => {
    const fetchRestrictionsList = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(fetchRestrictionsRoute, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          setRestrictions([]);
          response.data.forEach((element) => {
            const newField = {
              criteria: element.criteria,
              condition: element.condition,
              value: element.value,
              description: element.description,
            };
            setRestrictions((prevFields) => [...prevFields, newField]);
          });
        } else if (response.status === 406) {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        } else {
          notifications.show({
            title: "Error fetching data",
            message: `Error fetching data: ${response.status}`,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Failed to fetch data",
          message: "Failed to fetch feilds list",
          color: "red",
        });
      }
    };
    fetchRestrictionsList();
  }, []);

  const getRuleDescription = () => {
    if (!criteria || !condition || values.length === 0) return "";

    let conditionText = "";

    if (criteria === "cgpa") {
      conditionText =
        condition === "greater_than"
          ? `Students with CGPA > ${values[0]} are not allowed to participate in further drives.`
          : `Students with CGPA < ${values[0]} are not allowed to participate in further drives.`;
    } else if (criteria === "company") {
      conditionText =
        condition === "equal"
          ? `Students placed in ${values.join(", ")} are not allowed to participate in further drives.`
          : `Students not placed in ${values.join(", ")} are not allowed to participate in further drives.`;
    } else if (criteria === "year") {
      conditionText =
        condition === "greater_than"
          ? `Students in year > ${values[0]} are not allowed to participate in further drives.`
          : `Students in year < ${values[0]} are not allowed to participate in further drives.`;
    } else if (criteria === "ctc") {
      conditionText =
        condition === "greater_than"
          ? `Students with CTC > ${values[0]} are not allowed to participate in further drives.`
          : `Students with CTC < ${values[0]} are not allowed to participate in further drives.`;
    }

    return conditionText;
  };

  const resetForm = () => {
    setCriteria("");
    setCondition("");
    setValues([]);
    setEditingRestriction(null);
  };

  const handleSubmit = async () => {
    const restrictionData = {
      criteria,
      condition,
      value: values.join(", "),
      description: getRuleDescription(),
    };

    if (editingRestriction) {
      setRestrictions(
        restrictions.map((r) =>
          r.id === editingRestriction.id ? { ...restrictionData, id: r.id } : r,
        ),
      );
      notifications.show({
        title: "Success",
        message: "Restriction updated successfully!",
        color: "green",
      });
    } else {
      const newRestriction = { ...restrictionData, id: Math.random() };
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          fetchRestrictionsRoute,
          newRestriction,
          {
            headers: {
              Authorization: `Token ${token}`,
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
          setRestrictions([...restrictions, newRestriction]);
        } else {
          notifications.show({
            title: "Failed",
            message: `Failed to add`,
            color: "red",
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error adding restriction:", error);
        notifications.show({
          title: "Error",
          message: "Failed to add restriction.",
          color: "red",
          position: "top-center",
        });
      }
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    setRestrictions(restrictions.filter((r) => r.id !== id));
    notifications.show({
      title: "Success",
      message: "Restriction deleted successfully!",
      color: "green",
    });
  };

  const handleEdit = (restriction) => {
    setEditingRestriction(restriction);
    setCriteria(restriction.criteria);
    setCondition(restriction.condition);
    setValues(restriction.value.split(", "));
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "criteria", header: "Criteria", size: 200 },
      { accessorKey: "condition", header: "Condition", size: 150 },
      { accessorKey: "value", header: "Value", size: 150 },
      { accessorKey: "description", header: "Description", size: 250 },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 120,
        Cell: ({ row }) => (
          <Group spacing="xs">
            <ActionIcon onClick={() => handleEdit(row.original)}>
              <Pencil size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => handleDelete(row.original.id)}
              color="red"
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [],
  );

  const paginatedRestrictions = restrictions.slice(
    (activePage - 1) * recordsPerPage,
    activePage * recordsPerPage,
  );

  return (
    <Container>
      <Card
        shadow="sm"
        padding="lg"
        radius="lg"
        withBorder
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title order={3} align="center" style={{ marginBottom: "20px" }}>
          Restrictions
        </Title>
        <Button
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: "20px", width: "10rem" }}
        >
          Add Restriction
        </Button>

        {restrictions.length > 0 ? (
          <MantineReactTable columns={columns} data={paginatedRestrictions} />
        ) : (
          <Alert color="yellow">No restrictions available</Alert>
        )}

        <Pagination
          page={activePage}
          onChange={setActivePage}
          total={Math.ceil(restrictions.length / recordsPerPage)}
          style={{ marginTop: "20px" }}
        />
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add/Edit Restriction"
        size="lg"
        centered
      >
        <Card style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Title order={3} align="center" style={{ marginBottom: "20px" }}>
            {editingRestriction ? "Edit Restriction" : "Add Restriction"}
          </Title>
          <Grid gutter="lg">
            <Grid.Col span={12}>
              <Select
                label="Criteria"
                placeholder="Select criteria"
                data={[
                  { value: "company", label: "Company" },
                  { value: "cgpa", label: "CGPA" },
                  { value: "year", label: "Year of Study" },
                  { value: "ctc", label: "CTC" },
                ]}
                value={criteria}
                onChange={setCriteria}
              />
            </Grid.Col>

            {criteria && (
              <Grid.Col span={12}>
                <Select
                  label="Condition"
                  placeholder="Select condition"
                  data={conditionOptions[criteria] || []}
                  value={condition}
                  onChange={setCondition}
                />
              </Grid.Col>
            )}

            <Grid.Col span={12}>
              <TextInput
                label="Value(s)"
                placeholder="Enter value(s)"
                value={values.join(", ")}
                onChange={(e) =>
                  setValues(e.target.value.split(", ").map((v) => v.trim()))
                }
              />
              <div style={{ marginTop: 10 }}>
                {values.map((value, index) => (
                  <Chip key={index} color="blue" style={{ margin: 3 }}>
                    {value}
                  </Chip>
                ))}
              </div>
            </Grid.Col>

            {/* Rule Preview Chip */}
            <Grid.Col span={12}>
              <div style={{ marginTop: 20 }}>
                <Text size="sm" style={{ marginBottom: 5 }}>
                  {" "}
                  Rule Preview:{" "}
                </Text>
                {criteria && condition && values.length > 0 && (
                  <Chip color="teal">{getRuleDescription()}</Chip>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={12}>
              <Button onClick={handleSubmit} fullWidth>
                Submit
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </Modal>
    </Container>
  );
}

export default RestrictionsTab;

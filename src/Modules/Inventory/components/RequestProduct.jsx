import React, { useState } from "react";
import { useSelector } from "react-redux";
import { InventoryRequest } from "../../../routes/inventoryRoutes";

// Inline CSS styles
const styles = {
  container: {
    maxWidth: "450px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#007BFF",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "80px",
    resize: "vertical",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

function SubmitInventoryRequest() {
  const role = useSelector((state) => state.user.role);
  console.log(role);

  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    department_name: "",
    purpose: "",
    specifications: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRequest = async () => {
    setLoading(true);
    setErrorMessage(null);

    const requestData = {
      ...formData,
      approval_status: "PENDING",
      date: new Date().toISOString().split("T")[0], // Today's date
    };

    try {
      const response = await fetch(InventoryRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      console.log("✅ Request submitted successfully");
      alert("✅ Inventory Request Submitted!");
      setFormData({
        item_name: "",
        quantity: "",
        department_name: "",
        purpose: "",
        specifications: "",
      });
    } catch (error) {
      console.error("❌ Failed to submit request:", error);
      setErrorMessage("❌ Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Inventory Request Form</h3>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label style={styles.label}>Product Name</label>
        <input
          type="text"
          name="item_name"
          placeholder="Enter product name"
          value={formData.item_name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Quantity</label>
        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          value={formData.quantity}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Department</label>
        <input
          type="text"
          name="department_name"
          placeholder="Enter department"
          value={formData.department_name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Purpose</label>
        <textarea
          name="purpose"
          placeholder="Enter purpose"
          value={formData.purpose}
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <label style={styles.label}>Specifications</label>
        <textarea
          name="specifications"
          placeholder="Enter specifications (optional)"
          value={formData.specifications}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button
          style={styles.button}
          onClick={submitRequest}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

export default SubmitInventoryRequest;

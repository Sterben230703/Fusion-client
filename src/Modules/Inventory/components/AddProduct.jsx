import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/addProduct.css";
import { InventoryAdd } from "../../../routes/inventoryRoutes";

function AddProduct({ onSuccess, selectedDepartment, val, name }) {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name: inputName, value } = e.target;
    setFormData({ ...formData, [inputName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please log in to add a product");
      return;
    }

    if (!formData.productName || !formData.quantity) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const response = await fetch(InventoryAdd(`${val}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          item_name: formData.productName,
          quantity: parseInt(formData.quantity, 10), // Add radix parameter
          // department_name: selectedDepartment,
          [name]: selectedDepartment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add product: ${errorData.detail || response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Product added:", data);
      alert("Product added successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert(`Error occurred: ${error.message}`);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter Product Name"
          />
        </div>

        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter Quantity"
          />
        </div>

        <center>
          <button type="submit">Add Product</button>
        </center>
      </form>
    </div>
  );
}

AddProduct.propTypes = {
  onSuccess: PropTypes.func,
  selectedDepartment: PropTypes.string.isRequired,
  val: PropTypes.string.isRequired, // Add validation for 'val'
  name: PropTypes.string.isRequired, // Add validation for 'name'
};

export default AddProduct;

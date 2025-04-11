import React from "react";
import { useForm } from "react-hook-form";
import "../styles/transferProduct.css";
import { InventoryTransfer } from "../../../routes/inventoryRoutes";

function TransferProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // Removed unused inventoryData state

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(InventoryTransfer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          productName: data.productName,
          quantity: parseInt(data.quantity, 10),
          fromDepartment: data.fromDepartment,
          toDepartment: data.toDepartment,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Product transferred successfully:", result);
        alert("Product transferred successfully.");

        // Update inventory data logic can be implemented here if needed
        console.log("Inventory data update logic is not defined.");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || error.detail}`);
      }
    } catch (error) {
      console.error("Error transferring product:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Transfer Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Product Name
          <span className="required">*</span>
        </label>
        <input
          type="text"
          name="productName"
          ref={(e) => register(e, { required: "Product Name is required" })}
          placeholder="Enter Product Name"
        />
        {errors.productName && (
          <p className="error-message">{errors.productName.message}</p>
        )}

        <label>
          Quantity
          <span className="required">*</span>
        </label>
        <input
          type="number"
          name="quantity"
          ref={register({
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" },
          })}
          placeholder="Enter Quantity"
        />
        {errors.quantity && (
          <p className="error-message">{errors.quantity.message}</p>
        )}

        <label>
          From Department
          <span className="required">*</span>
        </label>
        <input
          type="text"
          name="fromDepartment"
          ref={register({
            required: "From Department is required",
          })}
          placeholder="Enter From Department"
        />
        {errors.fromDepartment && (
          <p className="error-message">{errors.fromDepartment.message}</p>
        )}

        <label>
          To Department
          <span className="required">*</span>
        </label>
        <select
          ref={(e) => {
            register(e, { required: "To Department is required" });
          }}
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="SM">SM</option>
          <option value="DS">DS</option>
        </select>
        {errors.toDepartment && (
          <p className="error-message">{errors.toDepartment.message}</p>
        )}

        <center>
          <button type="submit">Transfer Product</button>
        </center>
      </form>
    </div>
  );
}

export default TransferProduct;

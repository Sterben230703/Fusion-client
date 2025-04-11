import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PropTypes from "prop-types"; // Import PropTypes

export default function InventoryTable({ items }) {
  // Function to generate PDF
  const downloadPDF = () => {
    const table = document.getElementById("inventory-table");
    html2canvas(table, {
      scale: 2, // Increase the scale to capture a higher-resolution image
      useCORS: true, // Enable cross-origin resource sharing if needed
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF("landscape", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20); // Adjust the image to fit PDF width
      pdf.save("inventory_table.pdf");
    });
  };

  return (
    <div>
      <div
        style={{
          maxWidth: "100%",
          height: "550px", // Fixed height for scrollability
          overflowY: "auto",
          overflowX: "auto",
          border: "1px solid #ddd",
          margin: "20px auto",
        }}
      >
        <table
          id="inventory-table"
          style={{
            width: "90%",
            margin: "0 auto",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Item ID
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Department
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Item Name
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Item Type
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Serial Number
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Date Issued
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Issued To
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Total Cost
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Date Purchased
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.itemId}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.department}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.itemName}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.itemType}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.serialNumber}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.dateIssued}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.issuedTo}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.unitPrice}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.totalCost}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.datePurchased}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={downloadPDF}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
    </div>
  );
}
InventoryTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      itemId: PropTypes.number.isRequired,
      department: PropTypes.string.isRequired,
      itemName: PropTypes.string.isRequired,
      itemType: PropTypes.string.isRequired,
      serialNumber: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      dateIssued: PropTypes.string.isRequired,
      issuedTo: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      totalCost: PropTypes.number.isRequired,
      datePurchased: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

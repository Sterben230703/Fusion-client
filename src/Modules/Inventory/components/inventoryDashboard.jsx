import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { House, Package } from "@phosphor-icons/react";
import { Section } from "lucide-react";
import { InventoryData } from "../../../routes/inventoryRoutes";

// --- Styled Components ---

// A container for the whole dashboard
const Container = styled.div`
  padding: 16px;
  background: #fff;
  min-height: 100vh;
  box-sizing: border-box;
`;

// A wrapper that will scale down (zoom out) the content on small screens
const MobileScaleWrapper = styled.div`
  /* For mobile screens, scale down the content */
  @media (max-width: 768px) {
    transform: scale(0.85);
    transform-origin: top left;
    /* When scaling down, sometimes extra width is needed */
    width: 117%;
  }
`;

// Header and text elements
const Header = styled.div`
  margin-bottom: 16px;
`;

const OverviewText = styled.div`
  color: #666;
  margin-left: 16px;
  cursor: pointer;
  font-size: 16px;

  @media (max-width: 768px) {
    margin-left: 8px;
    font-size: 14px;
  }
`;

const SummaryCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 16px;
`;

const OverviewTitle = styled.h3`
  font-size: 20px;
  margin: 16px 0;
`;

const Content = styled.div`
  margin-top: 16px;
`;

// Grid for the cards
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const CardItem = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: 16px;
`;

const InfoText = styled.div`
  font-size: 16px;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 16px;
`;

// --- Main Component ---

function InventoryDashboard() {
  const [inventoryItems, setInventoryItems] = useState([
    { name: "Department", totalQuantity: 0, icon: <House size={24} /> },
    { name: "Section", totalQuantity: 0, icon: <Section size={24} /> },
  ]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  // Fetch inventory data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(InventoryData, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network error");
        }
        const data = await response.json();
        setInventoryItems([
          {
            name: "Department",
            totalQuantity: data.department_total_quantity,
            icon: <House size={24} />,
          },
          {
            name: "Section",
            totalQuantity: data.section_total_quantity,
            icon: <Section size={24} />,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Container>
      <MobileScaleWrapper>
        <Header>
          <OverviewText>Overview</OverviewText>

          <SummaryCard>
            <Title>Inventory Summary</Title>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper>
                <Package size={24} />
              </IconWrapper>
              <div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Total items
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {inventoryItems.reduce(
                    (total, item) => total + item.totalQuantity,
                    0,
                  )}
                </div>
              </div>
            </div>
          </SummaryCard>

          <OverviewTitle>Inventory Overview</OverviewTitle>
        </Header>

        <Content>
          {loading ? (
            <LoadingText>Loading...</LoadingText>
          ) : (
            <Grid>
              {inventoryItems.map((item, index) => (
                <CardItem key={index}>
                  <IconWrapper>{item.icon}</IconWrapper>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {item.name}
                    </div>
                    <InfoText>{item.totalQuantity} items</InfoText>
                  </div>
                </CardItem>
              ))}
            </Grid>
          )}
        </Content>
      </MobileScaleWrapper>
    </Container>
  );
}

export default InventoryDashboard;

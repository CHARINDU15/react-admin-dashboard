import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import supabase from "../../components/supabase/config";

const PaymentHistory = () => {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const colors = {
    greenAccent: 400, // Replace with your actual color value
    blueAccent: 400, // Replace with your actual color value
    primary: 400, // Replace with your actual color value
  };

  const columns = [
    { field: "PaymentId", headerName: "Payment ID" },
    {
      field: "Value",
      headerName: "Value",
      flex: 1,
      renderCell: (params) => (
        <Typography style={{ color: colors.greenAccent }}>
          {params.row.Value}
        </Typography>
      ),
    },
    {
      field: "PaymentType",
      headerName: "Payment Type",
      flex: 1,
    },
    {
      field: "PaymentDate",
      headerName: "Payment Date",
      flex: 1,
    },
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase.from("PaymentHistory").select("*");
        if (error) {
          throw new Error(error.message); // Throw error to trigger catch block
        }
        console.log("Fetched data:", data); // Log fetched data
       payments(data || {})
      } catch (error) {
        console.error("Error fetching payments:", error.message);
      }
    };

    fetchPayments();
  }, []);

  return (
    <Box m="20px">
      <Header title="PAYMENT HISTORY" subtitle="List of Payment History" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          // Your existing styles
        }}
      >
        <DataGrid
          checkboxSelection
          rows={payments}
          columns={columns}
          loading={!payments.length}
          components={{
            NoRowsOverlay: () => <Typography>No data available</Typography>,
          }}
        />
      </Box>
    </Box>
  );
};

export default PaymentHistory;

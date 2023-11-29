import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import supabase from "../../components/supabase/config";
import { tokens } from "../../theme";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const columns = [
    { field: "ServicePackageID", headerName: "Package ID", flex: 0.5 },
    { field: "service_pack_name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "ServicePackagePrice", headerName: "Price", type: "number", headerAlign: "left", align: "left" },
    { field: "Features", headerName: "Features", flex: 1 },
    { field: "service_pack_dis", headerName: "Description", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
  ];

  useEffect(() => {
    async function fetchServicePackages() {
      try {
        const { data, error } = await supabase
          .from('ServicePackages')
          .select('*')
          .eq('Vendor_ID', '89b00430-a8d9-4ab7-9e2f-b5a3d6b29500');

        if (error) {
          setError(error.message);
        } else {
          // Add a unique id to each row
          const rowsWithIds = data.map((row, index) => ({ id: index + 1, ...row }));
          setContacts(rowsWithIds);
        }
      } catch (error) {
        setError(error.message);
      }
    }

    fetchServicePackages();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <Box m="20px">
      <Header
        title="PACKAGES"
        subtitle="List of Packages for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          // Your existing styles
        }}
      >
        <DataGrid
          rows={contacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
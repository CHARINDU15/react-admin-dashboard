import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import supabase from "../../components/supabase/config";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    try {
      // Insert data into the ServicePackages table
      const { data, error } = await supabase
        .from("ServicePackages")
        .insert([
          {
            ServicePackageID: values.Pid,
            ServicePackagePrice: parseFloat(values.Pprice),
            Features: JSON.parse(values.Pfeatures), // Assuming Pfeatures is a JSON string
            service_pack_name: values.Pname,
            service_pack_dis: values.Pdes,
            type: values.Ptype,
          },
        ]);

      if (error) {
        console.error("Error inserting data:", error.message);
      } else {
        console.log("Data inserted successfully:", data);
      }
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE PACKAGE" subtitle="Create a New Package" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Package Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pname}
                name="Pname"
                error={!!touched.Pname && !!errors.Pname}
                helperText={touched.Pname && errors.Pname}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Package Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Ptype}
                name="Ptype"
                error={!!touched.Ptype && !!errors.Ptype}
                helperText={touched.Ptype && errors.Ptype}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pdes}
                name="Pdes"
                error={!!touched.Pdes && !!errors.Pdes}
                helperText={touched.Pdes && errors.Pdes}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Package ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pid}
                name="Pid"
                error={!!touched.Pid && !!errors.Pid}
                helperText={touched.Pid && errors.Pid}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pprice}
                name="Pprice"
                error={!!touched.Pprice && !!errors.Pprice}
                helperText={touched.Pprice && errors.Pprice}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Available Dates"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pdates}
                name="Pdates"
                error={!!touched.Pdates && !!errors.Pdates}
                helperText={touched.Pdates && errors.Pdates}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Features (JSON)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Pfeatures}
                name="Pfeatures"
                error={!!touched.Pfeatures && !!errors.Pfeatures}
                helperText={touched.Pfeatures && errors.Pfeatures}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Package
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  Pname: yup.string().required("required"),
  Ptype: yup.string().required("required"),
  Pdes: yup.string().required("required"),
  Pid: yup.string().required("required"),
  Pprice: yup.string().required("required"),
  Pdates: yup.string().required("required"),
  Pfeatures: yup.string().required("required"),
});

const initialValues = {
  Pname: "",
  Ptype: "",
  Pdes: "",
  Pid: "",
  Pprice: "",
  Pdates: "",
  Pfeatures: "",
};

export default Form;

import React from "react";
import ManageUsers from "./ManageUsers";

// Reuse the same UI but filter by role=admin
const ManageAdmins = () => <ManageUsers filterRole="admin" />;

export default ManageAdmins;


import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation } from "../../features/products/productsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const DeleteProductButton = ({ productId }) => {
  const me = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  if (!me || me.role !== "superAdmin") return null;

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId).unwrap();
      navigate("/collection"); // adjust if your route differs
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to delete product");
    }
  };

  return (
    <button onClick={onDelete} disabled={isLoading} className="px-3 py-1 rounded-lg border text-red-600">
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteProductButton;

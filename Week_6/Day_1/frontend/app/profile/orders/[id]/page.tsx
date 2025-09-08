"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getSocket } from '../../../../lib/socket';
import { useGetOrderByIdQuery } from "../../../../store/api";
import OrderDetails from "../../../components/OrderDetails";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserOrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("connect", () => {
      // console.log("user order socket connected", socket.id);
    });

    // Only refresh this order if it's updated
    socket.on("order-updated", (payload: any) => {
      if (payload?.orderId === orderId) {
        refetch();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, refetch]);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10">Failed to load order.</div>;
  if (!order) return <div className="p-10">Order not found.</div>;

  return <OrderDetails order={order} showUserInfo={false} />;
}

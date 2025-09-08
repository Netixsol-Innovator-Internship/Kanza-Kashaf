import Link from "next/link";

export default function OrderHistory({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <Link
            key={order._id || order.id || index}
            href={`/profile/orders/${order._id}`}
            className="block"
          >
            <div className="p-6 border rounded-lg shadow space-y-4 hover:bg-gray-50 cursor-pointer">
              {/* Order Header */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Address Snapshot */}
              {order.address && (
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Ship To:</strong>{" "}
                    {order.address.addressLine1}, {order.address.city},{" "}
                    {order.address.province}, {order.address.country},{" "}
                    {order.address.postalCode}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={item._id || idx}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product?.name || item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="text-right space-y-1">
                <p className="font-semibold text-lg">
                  Total: PKR {order.total}
                </p>
                {order.pointsUsed > 0 && (
                  <p className="text-sm text-gray-600">
                    Points Used: {order.pointsUsed}
                  </p>
                )}
                {order.pointsEarned > 0 && (
                  <p className="text-sm text-gray-600">
                    Points Earned: {order.pointsEarned}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

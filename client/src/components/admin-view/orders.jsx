import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

const statusOrder = {
  pending: 1,
  "in process": 2,
  "in shipping": 3,
  delivered: 4,
  rejected: 5,
};

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Sort orders based on custom order defined above
  const sortedOrders = orderList
    ? [...orderList].sort(
        (a, b) =>
          statusOrder[a.orderStatus] - statusOrder[b.orderStatus] ||
          new Date(b.orderDate) - new Date(a.orderDate)
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders && sortedOrders.length > 0 ? (
              sortedOrders.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem._id}</TableCell>
                  <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem.orderStatus === "delivered"
                          ? "bg-green-500"
                          : orderItem.orderStatus === "pending"
                          ? "bg-yellow-500"
                          : orderItem.orderStatus === "in process"
                          ? "bg-blue-500"
                          : orderItem.orderStatus === "in shipping"
                          ? "bg-gray-500"
                          : orderItem.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-gray-500" // Default for unknown status
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${orderItem.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem._id)}
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;

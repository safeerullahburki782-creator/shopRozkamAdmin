"use client";

import React, { useMemo, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import {
  useBulkDeleteSuppliers,
  useGetInactiveSupp,
} from "@/hooks/apis/useSupplier";
import { format } from "date-fns";
import Link from "next/link";

const InactiveSupplier = () => {
  const { token } = useContextConsumer();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: inActiveSupp, isLoading: loading } = useGetInactiveSupp(token);
  const { mutate: bulkDeleteSuppliers, isPending: bulkDeleting } =
    useBulkDeleteSuppliers(token);

  const data = inActiveSupp?.data?.users || [];

  const handleBulkDelete = async () => {
    const count = selectedIds.length;
    const isConfirmed = await SweetAlert(
      `Delete ${count} supplier${count === 1 ? "" : "s"}?`,
      "This permanently deletes the selected suppliers. It cannot be undone.",
      "warning",
      "Yes, delete them!",
      "#15803D"
    );
    if (isConfirmed) {
      bulkDeleteSuppliers(selectedIds, {
        onSuccess: (res: any) => {
          if (res?.success) setSelectedIds([]);
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row }: any) => (
          <Link
            href={`/dashboard/suppliers/supplier/${row.original.uuid}`}
            className="text-primary underline italic"
          >
            {row.original.username}
          </Link>
        ),
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Days Inactive",
        accessor: "daysInactive",
        Cell: ({ value }: any) => (value !== null ? `${value} days` : "N/A"),
      },
      {
        Header: "Last Active On",
        accessor: "lastActiveOn",
        Cell: ({ value }: any) =>
          value ? format(new Date(value), "dd MMM yyyy, hh:mm a") : "N/A",
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-2 lg:p-10 rounded-2xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">
            Inactive Suppliers
          </h2>
        </div>
        {loading ? (
          <SkeletonCard className="w-full h-40" />
        ) : data.length <= 0 ? (
          <p>No inactive users found.</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={columns}
              data={data}
              paginate={data.length > 10}
              selection={{
                selected: selectedIds,
                onChange: setSelectedIds,
                getRowId: (row: any) => row.uuid,
                actions: (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8"
                    disabled={bulkDeleting}
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete Selected ({selectedIds.length})
                  </Button>
                ),
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InactiveSupplier;

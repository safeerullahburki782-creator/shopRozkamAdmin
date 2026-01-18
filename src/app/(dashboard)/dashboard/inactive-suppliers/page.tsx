"use client";

import React, { useMemo } from "react";
import { useContextConsumer } from "@/context/Context";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { useGetInactiveSupp } from "@/hooks/apis/useSupplier";
import { format } from "date-fns";
import Link from "next/link";

const InactiveSupplier = () => {
  const { token } = useContextConsumer();

  const { data: inActiveSupp, isLoading: loading } = useGetInactiveSupp(token);

  const data = inActiveSupp?.data?.users || [];

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
        disableFilter: true,
        Cell: ({ value }: any) => (value !== null ? `${value} days` : "N/A"),
      },
      {
        Header: "Last Active On",
        accessor: "lastActiveOn",
        disableFilter: true,
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
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InactiveSupplier;

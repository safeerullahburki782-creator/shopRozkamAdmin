"use client";

import React, { useMemo, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import PasswordModal from "@/components/Forms/forms-modal/passwords/AddPassword";
import { useGetAllPasswords } from "@/hooks/apis/usePasswords";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";

const Passwords = () => {
  const { token } = useContextConsumer();
  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] =
    useState<boolean>(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
    useState<boolean>(false);
  const [isBulkUpdatePasswordModalOpen, setIsBulkUpdatePasswordModalOpen] =
    useState<boolean>(false);
  const [selectedPasswordToView, setSelectedPasswordToView] = useState({});

  const { data, isLoading } = useGetAllPasswords(token);

  const passwords = data?.data || [];

  const handleView = (password: any) => {
    setIsUpdatePasswordModalOpen(true);
    setSelectedPasswordToView(password);
  };

  const passwordColumns = useMemo(
    () => [
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        disableFilter: true,
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        disableFilter: true,
        Cell: ({ row }: any) =>
          format(new Date(row.original.updatedAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: ({ row }: any) => (
          <Badge variant={row.original.active ? "success" : "destructive"}>
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-2 lg:p-10 rounded-2xl">
        <div className="lg:flex items-center justify-between">
          <h2 className="text-xl font-bold">All Passwords</h2>
          <div className="flex gap-2">
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsAddPasswordModalOpen(true)}
            >
              Create Password
              <Plus className="h-4 w-4 ml-1 font-bold" />
            </Button>
            {/* //need to work on  */}
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsBulkUpdatePasswordModalOpen(true)}
            >
              Bulk Update Password(s)
              <Edit className="h-4 w-4 ml-1 font-bold" />
            </Button>
          </div>
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : passwords.length <= 0 ? (
          <p>No Password Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={passwordColumns}
              data={passwords}
              paginate={passwords.length > 10}
            />
          </div>
        )}
      </div>
      <PasswordModal
        open={isAddPasswordModalOpen}
        onOpenChange={setIsAddPasswordModalOpen}
        mode="add"
      />
      <PasswordModal
        open={isBulkUpdatePasswordModalOpen}
        onOpenChange={setIsBulkUpdatePasswordModalOpen}
        mode="add"
        bulkUpdate
      />
      <PasswordModal
        open={isUpdatePasswordModalOpen}
        onOpenChange={setIsUpdatePasswordModalOpen}
        password={selectedPasswordToView}
        mode="view"
      />
    </>
  );
};

export default Passwords;

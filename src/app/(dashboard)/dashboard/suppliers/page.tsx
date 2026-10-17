"use client";

import React, { useMemo, useState } from "react";
import {
  useBulkDeleteSuppliers,
  useDeleteSupplier,
  useGetAllSuppliers,
} from "@/hooks/apis/useSupplier";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import SupplierModal from "@/components/Forms/forms-modal/supplier/AddSupplier";
import { Toaster } from "react-hot-toast";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { filterSupplierSchema } from "@/schemas/FormsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LabelInputContainer from "@/components/Forms/LabelInputContainer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

const extractTitlePart = (title: string, keyword: string) => {
  const regex = new RegExp(`${keyword}_(\\w+)`);
  const match = title.match(regex);
  return match ? match[1].split("_")[0] : "-";
};

const Suppliers = () => {
  const { token } = useContextConsumer();
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] =
    useState<boolean>(false);
  const [isUpdateSupplierModalOpen, setIsUpdateSupplierModalOpen] =
    useState<boolean>(false);
  const [selectedSupplierToView, setSelectedSupplierToView] = useState({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [filterCriteria, setFilterCriteria] = useState<any>({
    active: "",
  });
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);

  const form = useForm<z.infer<typeof filterSupplierSchema>>({
    resolver: zodResolver(filterSupplierSchema),
    defaultValues: {
      active: "",
    },
  });

  const { data, isLoading } = useGetAllSuppliers(token, filterCriteria);
  const { mutate: deleteSupplier, isPending: deletingSupplier } =
    useDeleteSupplier(token);

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleFilterSubmit = (criteria: any) => {
    setFilterCriteria({
      ...criteria,
    });
  };

  const handleClearFilters = () => {
    form.reset();
    setFilterCriteria({ active: "" });
    setSearchQuery("");
    setShowSearch(false);
  };

  const filteredSuppliers = useMemo(() => {
    if (!data || !data?.data) return [];
    return data?.data
      .filter((supp: any) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          supp?.username?.toLowerCase().includes(searchLower) ||
          supp?.phone?.toLowerCase().includes(searchLower) ||
          supp?.userTitle?.toLowerCase().includes(searchLower)
        );
      })
      .filter((sup: any) => {
        if (filterCriteria.active !== "") {
          const isActive = filterCriteria.active === "true";
          if (sup.active !== isActive) return false;
        }
        return true;
      });
  }, [data, searchQuery, filterCriteria]);

  console.log(filteredSuppliers, "filteredSuppliers");

  const handleView = (supplier: any) => {
    setIsUpdateSupplierModalOpen(true);
    setSelectedSupplierToView(supplier);
  };

  const handleDelete = async (supplierId: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Supplier?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteSupplier(supplierId);
    }
  };

  const { mutate: bulkDeleteSuppliers, isPending: bulkDeleting } =
    useBulkDeleteSuppliers(token);

  const handleBulkDelete = async () => {
    const count = selectedSupplierIds.length;
    const isConfirmed = await SweetAlert(
      `Delete ${count} supplier${count === 1 ? "" : "s"}?`,
      "This permanently deletes the selected suppliers. It cannot be undone.",
      "warning",
      "Yes, delete them!",
      "#15803D"
    );
    if (isConfirmed) {
      bulkDeleteSuppliers(selectedSupplierIds, {
        onSuccess: (res: any) => {
          if (res?.success) setSelectedSupplierIds([]);
        },
      });
    }
  };

  const supplierColumns = useMemo(
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
        accessor: "combinedPhone",
        Cell: ({ row }: any) => {
          const countryCode = row.original.countryCode || "-";
          const phone = row.original.phone || "-";
          return (
            <span>
              {countryCode} {phone}
            </span>
          );
        },
        exportValue: (row: any) => {
          const countryCode = row?.countryCode || "-";
          const phone = row?.phone || "-";
          return `${countryCode} ${phone}`;
        },
      },
      {
        Header: "User Title",
        accessor: "userTitle",
        Cell: ({ value }: any) => value || "-",
      },
      {
        Header: "Custom Text",
        accessor: "customText",
        Cell: ({ row }: any) => {
          const title: string = row.original.userTitle || "";
          let premium = "";
          let warning = "";

          if (title.includes("~")) {
            const afterTilde = title.split("~")[1] || "";
            const [p, w] = afterTilde.split("-");
            premium = p?.trim() || "";
            warning = w?.trim() || "";
          } else if (title.includes("-")) {
            const parts = title.split("-");
            if (parts.length === 2) {
              warning = parts[1].trim();
            }
          }
          const partsToShow = [premium, warning].filter(Boolean);
          return partsToShow.length > 0
            ? partsToShow.join(" ").toUpperCase()
            : "-";
        },
      },
      {
        Header: "Refer Code",
        accessor: "referCode",
        Cell: ({ value }: any) => value || "-",
      },
      {
        Header: "Available Balance",
        accessor: "availableBalance",
        Cell: ({ value }: any) =>
          value !== null && value !== undefined ? value : "-",
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: ({ row }: any) => (
          <Badge
            variant={row.original.active ? "success" : "destructive"}
            className={
              row.original.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        Header: "Premium",
        accessor: "isPremium",
        Cell: ({ row }: any) => (
          <Badge
            variant={row.original.isPremium ? "success" : "destructive"}
            className={
              row.original.isPremium
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {row.original.isPremium ? "True" : "False"}
          </Badge>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        filterValue: () => "Edit, Delete",
        Cell: ({ row }: any) => (
          <div className="flex items-center justify-end gap-2.5">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => handleView(row.original)}
            >
              <Pencil className="h-3.5 w-3.5 text-gray-600" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-7 w-7"
              onClick={() => handleDelete(row.original.uuid)}
              disabled={deletingSupplier}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-2 lg:p-10 rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">All Suppliers</h2>
          <Button
            className="text-xs"
            size="sm"
            onClick={() => setIsAddSupplierModalOpen(true)}
          >
            Add Supplier
            <Plus className="h-4 w-4 ml-1 font-bold" />
          </Button>
        </div>
        <div>
          <p className="text-md lg:pl-2 font-normal pb-4 text-left dark:text-farmacieGrey">
            Filter and search the email from the list.
          </p>
          <Card
            className={cn(
              "w-full py-6 rounded-xl text-center bg-primary/10",
              showSearch ? "mb-2" : "mb-6"
            )}
          >
            <CardContent className="p-0 px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFilterSubmit)}>
                  <div className="lg:grid grid-cols-2 xl:grid-cols-4 gap-4 space-y-4 lg:space-y-0">
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Active</SelectItem>
                                  <SelectItem value="false">
                                    Inactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    <div className="flex gap-2">
                      <Button
                        className="lg:col-span-1 w-full text-white font-medium"
                        type="submit"
                      >
                        Filter <Filter size={18} className="ml-1" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-full dark:text-farmacieWhite font-medium border border-primary"
                        type="button"
                        onClick={handleClearFilters}
                      >
                        <RotateCcw size={18} className="ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        className="lg:col-span-1 w-full dark:text-farmacieWhite font-medium border border-primary"
                        type="button"
                        onClick={() => setShowSearch(true)}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          {showSearch && (
            <Card className="w-full py-6 rounded-xl text-center bg-primary/10 my-3">
              <CardContent className="p-0 px-6">
                <div className="flex justify-between items-center gap-2">
                  <div className="relative max-w-md lg:max-w-lg w-full">
                    <Input
                      placeholder="Search supplier by username, phone or userTitle..."
                      type="text"
                      className="outline-none border py-5 border-primary rounded-full pl-12 w-full"
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Search className="absolute left-3.5 -translate-y-1/2 bottom-0.5 w-5 h-5 text-gray-400" />
                  </div>
                  <Button
                    size="icon"
                    className="text-white font-medium"
                    type="button"
                    onClick={() => setShowSearch(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : filteredSuppliers.length <= 0 ? (
          <p>No filteredSuppliers Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={supplierColumns}
              data={filteredSuppliers}
              paginate={filteredSuppliers.length > 10}
              selection={{
                selected: selectedSupplierIds,
                onChange: setSelectedSupplierIds,
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
                    Delete Selected ({selectedSupplierIds.length})
                  </Button>
                ),
              }}
            />
          </div>
        )}
      </div>
      <SupplierModal
        open={isAddSupplierModalOpen}
        onOpenChange={setIsAddSupplierModalOpen}
        mode="add"
      />
      <SupplierModal
        open={isUpdateSupplierModalOpen}
        onOpenChange={setIsUpdateSupplierModalOpen}
        supplier={selectedSupplierToView}
        mode="view"
      />
    </>
  );
};

export default Suppliers;

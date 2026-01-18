"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useGetAllEmails, useGetDuplicateEmails } from "@/hooks/apis/useEmails";
import BulkEmailUpdateModal from "@/components/Forms/forms-modal/emails/BulkEmail";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { cn } from "@/lib/utils";
import { filterEmailSchema } from "@/schemas/FormsValidation";
import LabelInputContainer from "@/components/Forms/LabelInputContainer";
import { Input } from "@/components/ui/input";
import { filterStatus } from "@/constant/data";
import { useSearchParams } from "next/navigation";
import InsertEmailsModals from "@/components/Forms/forms-modal/emails/InsertBulkEmails";
import Link from "next/link";

const Emails = () => {
  const { token } = useContextConsumer();
  const searchParams = useSearchParams();
  const [showDuplicateEmails, setShowDuplicateEmails] = useState(false);
  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);
  const [searchedEmails, setSearchedEmails] = useState<any[]>([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isInsertEmailsModalOpen, setIsInsertEmailsModalOpen] = useState(false);
  const [isSearchEmailsModalOpen, setIsSearchEmailsModalOpen] = useState(false);
  const [isDeleteEmailsModalOpen, setIsDeleteEmailsModalOpen] = useState(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const duplicateSectionRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(100);

  const [filterCriteria, setFilterCriteria] = useState<{
    status: string;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    limit?: number;
  }>({
    status: "",
    page: 1,
    limit: 100,
  });

  const form = useForm<z.infer<typeof filterEmailSchema>>({
    resolver: zodResolver(filterEmailSchema),
    defaultValues: {
      status: "",
    },
  });

  // API call with pagination
  const { data, isLoading } = useGetAllEmails(token, {
    ...filterCriteria,
    page: currentPage,
    limit: pageLimit,
  });

  const { data: duplicateEmailsData, isLoading: duplicateLoading } =
    useGetDuplicateEmails(token);

  const duplicateEmails = duplicateEmailsData?.data || [];

  // Extract emails and pagination from API response
  const emails = data?.data?.emails || [];
  const pagination = data?.data?.pagination || {
    totalEmails: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 100,
  };

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleFilterSubmit = (criteria: any) => {
    setFilterCriteria({
      ...criteria,
      page: 1,
      limit: pageLimit,
    });
    setCurrentPage(1);
  };

  // Frontend search only (backend handles filtering)
  const filteredEmails = useMemo(() => {
    if (!emails || !Array.isArray(emails)) return [];

    if (!searchQuery) return emails;

    return emails.filter((email: any) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        email.user?.username?.toLowerCase().includes(searchLower) ||
        email.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [emails, searchQuery]);

// Pagination handlers
const handleNextPage = () => {
  if (currentPage < pagination.totalPages) {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    setFilterCriteria((prev) => ({
      ...prev,
      page: newPage,
    }));
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    setFilterCriteria((prev) => ({
      ...prev,
      page: newPage,
    }));
  }
};

const handlePageLimitChange = (newLimit: number) => {
  setPageLimit(newLimit);
  setCurrentPage(1);
  setFilterCriteria((prev) => ({
    ...prev,
    limit: newLimit,
    page: 1,
  }));
};

  useEffect(() => {
    const scrollParam = searchParams.get("scroll");
    if (scrollParam === "duplicate") {
      setShowDuplicateEmails(true);
      setTimeout(() => {
        duplicateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [searchParams]);

  const toggleEmailSelection = (uuid: string) => {
    setSelectedUUIDs((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const duplicateColumns = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "originalEmail.email",
      },
      {
        Header: "Status",
        accessor: "originalEmail.status",
        Cell: ({ row }: any) => (
          <Badge
            className={
              row.original.originalEmail?.status === "good"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          >
            {row.original.originalEmail?.status}
          </Badge>
        ),
      },
      {
        Header: "Duplicate File",
        accessor: "fileName",
        disableFilter: true,
      },
      {
        Header: "Uploader",
        accessor: "uploader.username",
      },
      {
        Header: "Original File",
        accessor: "originalEmail.fileName",
        disableFilter: true,
      },
    ],
    []
  );

  const emailColumns = useMemo(
    () => [
      {
        Header: "",
        accessor: "select",
        disableFilter: true,
        Cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={selectedUUIDs.includes(row.original.uuid)}
            onChange={() => toggleEmailSelection(row.original.uuid)}
          />
        ),
      },
      {
        Header: "Uploaded At",
        accessor: "createdAt",
        disableFilter: true,
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Title",
        accessor: "user.userTitle",
        Cell: ({ row }: any) => (
          <Link
            href={`/dashboard/suppliers/supplier/${row.original.user?.uuid}`}
            className="text-primary underline italic"
          >
            {row.original.user?.userTitle || "-"}
          </Link>
        ),
      },
      {
        Header: "Custom Text",
        accessor: "customText",
        Cell: ({ row }: any) => {
          const title: string = row.original.user?.userTitle || "";
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
        exportValue: (row: any) => {
          const title: string = row?.user?.userTitle || "";
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
        Header: "Name",
        accessor: "name",
        Cell: ({ value }: any) => value || "-",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Old Password",
        accessor: "lastPassword",
        Cell: ({ row }: any) => {
          const { password, user } = row.original;
          if (!user) return "-";

          const isPremium = user?.isPremium;

          if (isPremium) {
            return password !== user?.lastDailyPassword
              ? user?.lastDailyPassword || "-"
              : "-";
          }

          return user?.oldPassword?.password || "-";
        },
        exportValue: (row: any) => {
          const { password, user } = row;
          if (!user) return "-";

          const isPremium = user?.isPremium;

          if (isPremium) {
            return password !== user?.lastDailyPassword
              ? user?.lastDailyPassword || "-"
              : "-";
          }

          return user?.oldPassword?.password || "-";
        },
      },
      {
        Header: "Recovery Email",
        accessor: "recoveryEmail",
        Cell: ({ value }: any) => value || "-",
      },
   {
  Header: "User Remarks",
  accessor: "remarks",
  Cell: ({ value }: any) => value || "-",
},
{
  Header: "Admin Remarks",
  accessor: "adminRemarks",
  Cell: ({ value }: any) => value || "-",
},
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: any) => (
          <Badge
            variant={row.original.status === "bad" ? "secondary" : "success"}
            className={
              row.original.status === "bad"
                ? "bg-red-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        disableFilter: true,
        Cell: ({ row }: any) =>
          row.original.status === "good" ? (
            <span>{row.original.amount ?? "-"}</span>
          ) : (
            "-"
          ),
      },
    {
  Header: "Screenshot",
  accessor: "emailScreenshot",
  disableFilter: true,
  Cell: ({ row }: any) => (
    <a  // ← This was missing!
      href={row.original.emailScreenshot}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline text-xs"
    >
      View Image
    </a>
  ),
},
    {
        Header: "Updated At",
        accessor: "updatedAt",
        disableFilter: true,
        Cell: ({ row }: any) => {
          const rawDate = row.original.updatedAt;
          if (!rawDate) return "-";
          const parsedDate = new Date(
            typeof rawDate === "string" && rawDate.length === 19
              ? rawDate.replace(" ", "T") + "Z"
              : rawDate
          );
          return isNaN(parsedDate.getTime())
            ? "-"
            : format(parsedDate, "dd MMM yyyy, hh:mm a");
        },
      },
    ],
    [selectedUUIDs]
  );
  

  const emailsToDisplay =
    searchedEmails.length > 0 ? searchedEmails : filteredEmails;

  console.log(emailsToDisplay, "emailsToDisplay");

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-2 lg:p-10 rounded-2xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Available Emails</h2>
          <div className="flex gap-2">
            <Button
              className="text-xs"
              size="sm"
              variant="outline"
              onClick={() => setIsSearchEmailsModalOpen(true)}
            >
              Bulk Search Emails
            </Button>
            <Button
              className="text-xs"
              size="sm"
              variant="outline"
              onClick={() => setIsBulkUpdateModalOpen(true)}
            >
              Bulk Update
            </Button>
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsInsertEmailsModalOpen(true)}
            >
              Bulk Insert Emails
            </Button>
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsDeleteEmailsModalOpen(true)}
            >
              Bulk Delete Emails
            </Button>
          </div>
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
                  <div className="lg:grid grid-cols-3 xl:grid-cols-6 gap-4 space-y-2 lg:space-y-0">
                    {/* Status */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {filterStatus.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    {/* Start Date */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="Start Date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    {/* End Date */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="End Date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    {/* Order By */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="orderBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Order By" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="createdAt">
                                    Created At
                                  </SelectItem>
                                  <SelectItem value="updatedAt">
                                    Updated At
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
            <Card className="w-full py-6 rounded-xl text-center bg-primary/10 mb-6">
              <CardContent className="p-0 px-6">
                <div className="flex justify-between items-center gap-2">
                  <div className="relative max-w-md lg:max-w-lg w-full">
                    <Input
                      placeholder="Search supplier by username or email"
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
        ) : emailsToDisplay.length <= 0 ? (
          <p>No Email Data Available!</p>
        ) : (
          <>
            <div className="border rounded-2xl">
              <DataTable
                columns={emailColumns}
                data={emailsToDisplay}
                paginate={false}
              />
            </div>

            {/* Custom Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageLimit) + 1} to{" "}
                  {Math.min(currentPage * pageLimit, pagination.totalEmails)} of{" "}
                  {pagination.totalEmails} emails
                </span>

                <select
                  value={pageLimit}
                  onChange={(e) => handlePageLimitChange(Number(e.target.value))}
                  className="border rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800"
                >
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                  <option value={200}>200 per page</option>
                  <option value={500}>500 per page</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm px-2">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        {showDuplicateEmails && (
          <div ref={duplicateSectionRef} className="pt-10">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Duplicate Emails
            </h2>
            {duplicateLoading ? (
              <SkeletonCard className="w-full h-40" />
            ) : duplicateEmails.length <= 0 ? (
              <p>No Duplicate Emails Found.</p>
            ) : (
              <div className="border rounded-2xl">
                <DataTable
                  columns={duplicateColumns}
                  data={duplicateEmails}
                  paginate={duplicateEmails.length > 10}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <BulkEmailUpdateModal
        open={isBulkUpdateModalOpen}
        onClose={() => setIsBulkUpdateModalOpen(false)}
        uuids={selectedUUIDs}
        selectedEmailData={
          selectedUUIDs.length === 1
            ? emailsToDisplay.find(
                (email: any) => email.uuid === selectedUUIDs[0]
              )
            : null
        }
        clearSelection={() => setSelectedUUIDs([])}
      />

      <InsertEmailsModals
        open={isInsertEmailsModalOpen}
        onOpenChange={setIsInsertEmailsModalOpen}
      />
      <InsertEmailsModals
        open={isDeleteEmailsModalOpen}
        onOpenChange={setIsDeleteEmailsModalOpen}
        deleteBulk
      />
      <InsertEmailsModals
        open={isSearchEmailsModalOpen}
        onOpenChange={setIsSearchEmailsModalOpen}
        searchBulk
        onSearchSuccess={(data: any) => {
          setSearchedEmails(data?.foundRecords || []);
          setIsSearchEmailsModalOpen(false);
        }}
      />
    </>
  );
};

export default Emails;
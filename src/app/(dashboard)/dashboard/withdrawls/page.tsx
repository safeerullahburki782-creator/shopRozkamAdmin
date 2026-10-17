"use client";

import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { useContextConsumer } from "@/context/Context";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import DataTable from "@/components/Table/DataTable";
import { format } from "date-fns";
import {
  useGetWithdrawl,
  useGetWithdrawlBonus,
} from "@/hooks/apis/useWithdrawl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import WithdrawlUpdateModal from "@/components/Forms/forms-modal/withdrawl/UpdateWithdrawl";
import ImagePreviewModal from "@/components/Forms/forms-modal/ImagePreviewModal";
import Link from "next/link";
import { imagesBaseURL } from "@/lib/helpers";

const Withdrawals = () => {
  const { token } = useContextConsumer();
  const bonusSectionRef = useRef<HTMLDivElement>(null);
  const [isUpdateWithdrawlModalOpen, setIsUpdateWithdrawlModalOpen] =
    useState(false);
  const [isUpdateWithdrawlBonusModalOpen, setIsUpdateWithdrawlBonusModalOpen] =
    useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [selectedWithdrawlToView, setSelectedWithdrawlToView] = useState({});
  const [selectedReferralWithdrawlToView, setSelectedReferralWithdrawlToView] =
    useState({});
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const { data: withdrawlsData, isLoading: loading } = useGetWithdrawl(token);
  const { data: withdrawlsBonusData, isLoading: bonusDataloading } =
    useGetWithdrawlBonus(token);

  const withdrawls = withdrawlsData?.data || [];
  const withdrawlBonus = withdrawlsBonusData?.data || [];

  const handleView = (data: any) => {
    setIsUpdateWithdrawlModalOpen(true);
    setSelectedWithdrawlToView(data);
  };

  const handleBonusView = (data: any) => {
    setIsUpdateWithdrawlBonusModalOpen(true);
    setSelectedReferralWithdrawlToView(data);
  };

  const handleShowBonus = () => {
    setShowBonus(true);
    setTimeout(() => {
      bonusSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const openImageModal = (url: string) => {
    setSelectedImageUrl(url);
    setIsPreviewModalOpen(true);
  };

  const columns = [
    {
      Header: "User Title",
      accessor: "user.userTitle",
      Cell: ({ row }: any) => {
        const user = row.original.user;
        return user ? (
          <Link
            href={`/dashboard/suppliers/supplier/${row.original.userUuid}`}
            className="text-primary underline italic"
          >
            {user.userTitle}
          </Link>
        ) : (
          "-"
        );
      },
    },
    {
      Header: "Custom Text",
      accessor: "customText",
      Cell: ({ row }: any) => {
        const title: string = row.original.user.userTitle || "";
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
      Header: "Method Type",
      accessor: "withdrawalMethod.methodType",
      Cell: ({ row }: any) => row.original.withdrawalMethod?.methodType || "-",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }: any) => {
        const status = row.original.status;
        let colorClass = "bg-gray-100 text-gray-700";
        if (status === "approved") colorClass = "bg-green-100 text-green-700";
        else if (status === "pending")
          colorClass = "bg-yellow-100 text-yellow-700";
        else if (status === "rejected") colorClass = "bg-red-100 text-red-700";

        return <Badge className={`capitalize ${colorClass}`}>{status}</Badge>;
      },
    },
    {
      Header: "Account Number",
      accessor: "withdrawalMethod.accountNumber",
      Cell: ({ row }: any) => {
        const value = row.original.withdrawalMethod?.accountNumber || "-";
        return value === "-" ? (
          value
        ) : (
          <div className="flex items-center gap-2">
            <span>{value}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => handleCopy(value)}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        );
      },
    },
    {
      Header: "Account Title",
      accessor: "withdrawalMethod.accountTitle",
      Cell: ({ row }: any) => {
        const value = row.original.withdrawalMethod?.accountTitle || "-";
        return value === "-" ? (
          value
        ) : (
          <div className="flex items-center gap-2">
            <span>{value}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => handleCopy(value)}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        );
      },
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
      Header: "Screenshot",
      accessor: "paymentScreenshot",
      filterValue: (row: any) =>
        row.paymentScreenshot?.trim() ? "Has screenshot" : "",
      Cell: ({ row }: any) => {
        const imageUrl = row.original.paymentScreenshot;
        const hasImage = imageUrl && imageUrl.trim() !== "";
        const fullImageUrl = hasImage
          ? `${imagesBaseURL}${imageUrl}`
          : "/images/no-image.png";

        return (
          <div
            className="w-16 h-16 cursor-pointer"
            onClick={() => hasImage && openImageModal(fullImageUrl)}
          >
            <img
              src={fullImageUrl}
              alt="Screenshot"
              className="object-cover w-full h-full rounded-md border border-gray-200 shadow-sm"
            />
          </div>
        );
      },
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ row }: any) =>
        format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
    },
    {
      Header: "Actions",
      accessor: "actions",
      // processed withdrawals have no actions (blank)
      filterValue: (row: any) =>
        row.status === "approved" || row.status === "rejected" ? "" : "Edit",
      Cell: ({ row }: any) => {
        const status = row.original.status;
        if (status === "approved" || status === "rejected") {
          return null;
        }
        return (
          <div className="flex items-center justify-end gap-2.5">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => handleView(row.original)}
            >
              <Pencil className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  const withdrawlBonusColoumns = useMemo(
    () => [
      {
        Header: "User Title",
        accessor: "user.userTitle",
        Cell: ({ row }: any) => row.original.user?.userTitle || "-",
      },
      {
        Header: "Username",
        accessor: "user.username",
        Cell: ({ row }: any) => (
          <Link
            href={`/dashboard/suppliers/supplier/${row.original.uuid}`}
            className="text-primary underline italic"
          >
            {row.original.user?.username}
          </Link>
        ),
      },
      {
        Header: "Type",
        accessor: "withdrawalType",
        Cell: ({ row }: any) => {
          const raw = row.original.withdrawalType || "";
          const formatted =
            raw
              .split("-")
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ") || "-";
          return formatted;
        },
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: any) => {
          const status = row.original.status;
          let colorClass = "bg-gray-100 text-gray-700";
          if (status === "approved") colorClass = "bg-green-100 text-green-700";
          else if (status === "pending")
            colorClass = "bg-yellow-100 text-yellow-700";
          else if (status === "rejected")
            colorClass = "bg-red-100 text-red-700";

          return <Badge className={`capitalize ${colorClass}`}>{status}</Badge>;
        },
      },
      {
        Header: "Method Type",
        accessor: "withdrawalMethod.methodType",
        Cell: ({ row }: any) =>
          row.original.withdrawalMethod?.methodType || "-",
      },
      {
        Header: "Account Number",
        accessor: "withdrawalMethod.accountNumber",
        Cell: ({ row }: any) =>
          row.original.withdrawalMethod?.accountNumber || "-",
      },
      {
        Header: "Account Title",
        accessor: "withdrawalMethod.accountTitle",
        Cell: ({ row }: any) =>
          row.original.withdrawalMethod?.accountTitle || "-",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Actions",
        accessor: "actions",
        filterValue: () => "Edit",
        Cell: ({ row }: any) => (
          <div className="flex items-center justify-end gap-2.5">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => handleBonusView(row.original)}
            >
              <Pencil className="h-3.5 w-3.5 text-gray-600" />
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
      <div className="space-y-4 p-2 lg:p-10 rounded-2xl max-w-full mx-auto">
        <div className="lg:flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary mb-4">Withdrawals</h2>
          <Button className="text-xs" size="sm" onClick={handleShowBonus}>
            Show Bonus Withdrawals
          </Button>
        </div>
        {loading ? (
          <SkeletonCard className="w-full h-40" />
        ) : withdrawls.length <= 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No withdrawal data available.
          </p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={columns}
              data={withdrawls}
              paginate={withdrawls.length > 10}
            />
          </div>
        )}

        {showBonus && (
          <div ref={bonusSectionRef} className="pt-10">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Bonus Withdrawals
            </h2>
            {bonusDataloading ? (
              <SkeletonCard className="w-full h-40" />
            ) : withdrawlBonus.length <= 0 ? (
              <p>No Bonus Withdrawl Found.</p>
            ) : (
              <div className="border rounded-2xl">
                <DataTable
                  columns={withdrawlBonusColoumns}
                  data={withdrawlBonus}
                  paginate={withdrawlBonus.length > 10}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <WithdrawlUpdateModal
        withdrawl={selectedWithdrawlToView}
        open={isUpdateWithdrawlModalOpen}
        onClose={setIsUpdateWithdrawlModalOpen}
      />
      <WithdrawlUpdateModal
        withdrawl={selectedReferralWithdrawlToView}
        open={isUpdateWithdrawlBonusModalOpen}
        onClose={setIsUpdateWithdrawlBonusModalOpen}
        bonus
      />
      <ImagePreviewModal
        open={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        imageUrl={selectedImageUrl}
      />
    </>
  );
};

export default Withdrawals;

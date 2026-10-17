"use client";

import React, { useEffect, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import {
  useDeleteSecondaryPhone,
  useDeleteWithdrawlMeth,
  useGetSupplier,
  useSavePhone,
  useUpdateSecondaryPhone,
  useUpdateSupplier,
  useWarnSupplier,
} from "@/hooks/apis/useSupplier";
import {
  Tooltip, 
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import DataTable from "@/components/Table/DataTable";
import { baseURL } from "@/api/auth";
import { toast } from "react-hot-toast";
import {
  BadgeCheck,
  BadgeX,
  Check,
  CheckCircle,
  Contact2Icon,
  Loader,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MarkSupplierPremiumModal from "@/components/Forms/forms-modal/supplier/MarkPremium";
import UpdateWithdrawlMethodModal from "@/components/Forms/forms-modal/supplier/UpdateWithdrawlMethod";

const SupplierDetails = ({ params }: { params: { id: string } }) => {
  const { token } = useContextConsumer();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumUser, setPremiumUser] = useState<any>(null);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [warnUser, setWarnUser] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordState, setPasswordState] = useState({
    value: "",
    isEditing: false,
  });
  const [phoneEdits, setPhoneEdits] = useState<
    Record<string, { isEditing: boolean; value: string }>
  >({});
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [tempFilters, setTempFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const {
    data: supplierDetails,
    isLoading: detailsLoading,
    refetch: reloadSupplierDetails,
  } = useGetSupplier(params.id!, token, filters);
  const { mutate: updateSupplier } = useUpdateSupplier();
  const { mutate: savePhone } = useSavePhone();
  const { mutate: warnSupplier, isPending: warning } = useWarnSupplier();
  const { mutate: updateSecondaryPhone } = useUpdateSecondaryPhone();
  const { mutate: deleteSecondaryPhone, isPending: deleting } =
    useDeleteSecondaryPhone(token);
  const { mutate: deleteWithdrawlMethod, isPending: deletingWithdrawlMethod } =
    useDeleteWithdrawlMeth(token);

  const details = supplierDetails?.data;

  useEffect(() => {
    reloadSupplierDetails();
  }, [filters]);

  if (detailsLoading) {
    return <SkeletonCard className="w-full h-64" />;
  }

  const handleToggleStatus = async (field: "active" | "isPremium") => {
    const newVal = !user[field];
    const label = field === "active" ? "Active" : "Premium";

    if (field === "isPremium" && newVal) {
      setShowPremiumModal(true);
      setPremiumUser(user);
      return;
    }

    const isConfirmed = await SweetAlert(
      `Mark as ${newVal ? "Active" : "Inactive"}?`,
      `This will change the ${label} status to "${
        newVal ? "Active" : "Inactive"
      }".`,
      "question",
      `Yes, mark as ${newVal ? "Active" : "Inactive"}`,
      "#15803D"
    );

    if (isConfirmed) {
      updateSupplier({
        data: { uuid: user.uuid, [field]: newVal },
        token,
      });
    }
  };

  const handlePremiumSubmit = (customText: string) => {
    if (!premiumUser) return;
    updateSupplier({
      data: { uuid: premiumUser.uuid, isPremium: true, customText },
      token,
    });
    setShowPremiumModal(false);
    setPremiumUser(null);
  };

  if (!details) {
    return <p className="text-center mt-10 text-red-500">User not found.</p>;
  }

  const {
    user,
    emailStats,
    bonusStats,
    otherPhones,
    withdrawalMethods,
    emailWithdrawalHistory,
    bonusWithdrawalHistory,
  } = details;

  const renderStats = (stats: Record<string, Record<string, number>>) => (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(stats).map(([key, val]) => (
        <Card key={key} className="p-4 shadow-none border">
          <CardTitle className="capitalize text-lg text-primary">
            {key}
          </CardTitle>
          <CardContent className="grid grid-cols-2 gap-2 pt-2">
            {Object.entries(val || {}).map(([statKey, statVal]) => (
              <div key={statKey} className="text-sm flex items-center gap-1">
                <span className="font-semibold capitalize">{statKey}:</span>
                <Badge
                  variant={
                    statKey === "good"
                      ? "success"
                      : statKey === "bad"
                      ? "destructive"
                      : statKey === "pending"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs px-2 py-0.5"
                >
                  {String(statVal)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFlatStats = (stats: Record<string, number>) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <Card key={key} className="p-4 shadow-none border">
          <CardTitle className="capitalize text-md text-primary mb-2">
            {key}
          </CardTitle>
          <CardContent className="pt-0">
            <Badge
              variant={
                key === "good"
                  ? "success"
                  : key === "bad"
                  ? "destructive"
                  : key === "pending"
                  ? "secondary"
                  : "outline"
              }
              className="text-sm px-3 py-1"
            >
              {value}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmailWithdrawals = emailWithdrawalHistory.map((item: any) => ({
    uuid: item.uuid,
    amount: item.amount,
    status: item.status,
    remarks: item.remarks ?? "-",
    // raw date for filtering/sorting by day; `date` is what the cell shows
    createdAt: item.createdAt,
    date: format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a"),
    emailCount: item.withdrawnEmailUuids?.length ?? 0,
  }));

  const renderBonusWithdrawals = bonusWithdrawalHistory.map((item: any) => ({
    uuid: item.uuid,
    type: item.withdrawalType,
    amount: item.amount,
    status: item.status,
    remarks: item.remarks ?? "-",
    createdAt: item.createdAt,
    date: format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a"),
  }));

  const handlePasswordUpdate = () => {
    if (passwordState.value && passwordState.value !== user.password) {
      updateSupplier({
        data: { uuid: user.uuid, password: passwordState.value },
        token,
      });
    }
    setPasswordState((prev) => ({ ...prev, isEditing: false }));
  };

  const togglePhoneEdit = (uuid: string, initialValue?: string) => {
    setPhoneEdits((prev) => ({
      ...prev,
      [uuid]: {
        isEditing: !prev[uuid]?.isEditing,
        value: initialValue ?? prev[uuid]?.value ?? "",
      },
    }));
  };

  const handlePhoneChange = (uuid: string, value: string) => {
    setPhoneEdits((prev) => ({
      ...prev,
      [uuid]: {
        ...prev[uuid],
        value,
      },
    }));
  };

  const handlePhoneUpdate = (phone: any) => {
    const entry = phoneEdits[phone.uuid];
    if (!entry || entry.value === `${phone.countryCode}${phone.phone}`) {
      togglePhoneEdit(phone.uuid);
      return;
    }

    const countryCode = entry.value.slice(0, 3);
    const phoneNumber = entry.value.slice(3);

    const updatedData = {
      data: {
        uuid: phone.uuid,
        countryCode,
        phone: phoneNumber,
      },
      token,
    };

    updateSecondaryPhone(updatedData);
    togglePhoneEdit(phone.uuid);
  };

  const handleSavePhone = async (phone: any) => {
    const isConfirmed = await SweetAlert(
      "Verify this phone?",
      `Are you sure you want to mark ${phone.countryCode} ${phone.phone} as verified?`,
      "question",
      "Yes, verify",
      "#15803D"
    );

    if (isConfirmed) {
      savePhone({
        data: {
          uuid: phone.uuid,
        },
        token,
      });
    }
  };

  const handleWarn = (user: any) => {
    const isRemoveWarning = /-([a-zA-Z0-9]+)$/.test(user.userTitle || "");
    setWarnUser(user);
    if (isRemoveWarning) {
      handleWarnSubmit("");
    } else {
      setShowWarnModal(true);
    }
  };

  const handleWarnSubmit = (customText: string) => {
    if (!warnUser) return;
    warnSupplier({
      data: { uuid: warnUser.uuid, customText },
      token,
    });
    setShowWarnModal(false);
    setWarnUser(null);
  };

  const handleDeletePhone = async (phone: any) => {
    const isConfirmed = await SweetAlert(
      "Delete this phone?",
      `Are you sure you want to delete ${phone.countryCode} ${phone.phone}?`,
      "warning",
      "Yes, delete",
      "#B91C1C"
    );
    if (isConfirmed) {
      deleteSecondaryPhone(phone.uuid);
    }
  };

  const handleViewWithdrawlMethod = (method: any) => {
    setSelectedMethod(method);
    setEditModalOpen(true);
  };

  const handleDeleteWithdrawlMethod = async (withdrawlID: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Withdrawl Method?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteWithdrawlMethod(withdrawlID);
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="methods">Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-none border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">
                    User Profile
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.username}
                  </p>
                 {user.profile_img && (
  <Image
    src={`${baseURL.replace("/api", "")}${user.profile_img.startsWith('/') ? '' : '/'}${user.profile_img}`}
    alt="Profile"
    width={100}
    height={100}
    className="rounded-full object-cover border w-20 h-20"
  />
)}
                </div>
                {!user.userTitle ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleWarn(user)}
                            disabled
                          >
                            Warn
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update User Title to proceed with the warning.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleWarn(user)}
                    disabled={warning}
                  >
                    {warning ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : /-([a-zA-Z0-9]+)$/.test(user.userTitle || "") ? (
                      "Remove Warning"
                    ) : (
                      "Warn"
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="font-medium">Phone:</strong>{" "}
                  {user.countryCode} {user.phone}
                </div>
               <div className="flex items-center gap-2">
  <strong className="font-medium">Active:</strong>
  {user.active ? (
    <Badge
      onClick={() => handleToggleStatus("active")}
      className="bg-yellow-200 text-yellow-800 border border-yellow-300 flex items-center gap-1 cursor-pointer hover:bg-yellow-300"
    >
      <BadgeX className="w-4 h-4" /> Ban
    </Badge>
  ) : user.everActive ? (
    <Badge
      onClick={() => handleToggleStatus("active")}
      className="bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 cursor-pointer hover:bg-blue-200"
    >
      <BadgeCheck className="w-4 h-4" /> Un Ban
    </Badge>
  ) : (
    <Badge
      onClick={() => handleToggleStatus("active")}
      className="bg-green-200 text-green-800 border border-green-200 flex items-center gap-1 cursor-pointer hover:bg-green-300"
    >
      <BadgeCheck className="w-4 h-4" /> Active
    </Badge>
  )}
</div>
                <div className="flex items-center gap-2">
                  <strong className="font-medium">Premium:</strong>
                  {user.isPremium ? (
                    <Badge
                      onClick={() => handleToggleStatus("isPremium")}
                      className="bg-green-200 text-green-800 border border-green-200 flex items-center gap-1 cursor-pointer hover:bg-green-300"
                    >
                      <BadgeCheck className="w-4 h-4" /> Active
                    </Badge>
                  ) : (
                    <Badge
                      onClick={() => handleToggleStatus("isPremium")}
                      className="bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 cursor-pointer hover:bg-red-300"
                    >
                      <BadgeX className="w-4 h-4" /> Inactive
                    </Badge>
                  )}
                </div>
                <div>
                  <strong className="font-medium">User Title:</strong>{" "}
                  {user.userTitle}
                </div>
                <div>
                  <strong className="font-medium">Refer Code:</strong>{" "}
                  {user.referCode ?? "-"}
                </div>
                <div className="flex items-center gap-2">
                  <strong className="font-medium">Password:</strong>
                  {passwordState.isEditing ? (
                    <>
                      <Input
                        value={passwordState.value}
                        onChange={(e) =>
                          setPasswordState((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        className="max-w-xs"
                      />
                      <button
                        onClick={handlePasswordUpdate}
                        className="text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="truncate max-w-xs inline-block">
                        {user.password}
                      </span>
                      <button
                        onClick={() =>
                          setPasswordState((prev) => ({
                            ...prev,
                            isEditing: true,
                          }))
                        }
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-none border mt-4">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Other Phones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {otherPhones.map((phone: any, index: number) => {
                  const isEditing = phoneEdits[phone.uuid]?.isEditing;
                  const value =
                    phoneEdits[phone.uuid]?.value ??
                    `${phone.countryCode}${phone.phone}`;

                  return (
                    <div
                      key={phone.uuid}
                      className="flex items-center justify-between text-sm border p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <strong>Phone:</strong>
                        {isEditing ? (
                          <Input
                            value={value}
                            onChange={(e) =>
                              handlePhoneChange(phone.uuid, e.target.value)
                            }
                            className="max-w-[160px] text-xs"
                          />
                        ) : (
                          <span>
                            {phone.countryCode} {phone.phone}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handlePhoneUpdate(phone)}
                            className="text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              togglePhoneEdit(
                                phone.uuid,
                                `${phone.countryCode}${phone.phone}`
                              )
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Phone"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePhone(phone)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Phone"
                          disabled={deleting}
                        >
                          <BadgeX className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSavePhone(phone)}
                          className="text-green-600 hover:text-green-800"
                          title="Verify Phone"
                        >
                          <Contact2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="mb-8 mt-4 flex flex-col sm:flex-wrap sm:flex-row items-center gap-3 w-full">
              <Input
                type="date"
                value={tempFilters.startDate}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, startDate: e.target.value })
                }
                className="w-full sm:w-48"
              />
              <span>-</span>
              <Input
                type="date"
                value={tempFilters.endDate}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, endDate: e.target.value })
                }
                className="w-full sm:w-48"
              />
              <Button
                onClick={() => {
                  if (
                    tempFilters.startDate &&
                    tempFilters.endDate &&
                    new Date(tempFilters.endDate) <
                      new Date(tempFilters.startDate)
                  ) {
                    toast.error(
                      "End date must be greater than or equal to start date"
                    );
                    return;
                  }
                  setFilters({ ...tempFilters });
                }}
                className="text-white"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTempFilters({ startDate: "", endDate: "" });
                  setFilters({ startDate: "", endDate: "" });
                }}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <Card className="mb-4 shadow-none border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Email Stats
                </CardTitle>
              </CardHeader>
              <CardContent>{renderFlatStats(emailStats)}</CardContent>
            </Card>
            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Bonus Stats
                </CardTitle>
              </CardHeader>
              <CardContent>{renderStats(bonusStats)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <div className="mb-8 mt-4 flex flex-col sm:flex-wrap sm:flex-row items-center gap-3 w-full">
              <Input
                type="date"
                value={tempFilters.startDate}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, startDate: e.target.value })
                }
                className="w-full sm:w-48"
              />
              <span>-</span>
              <Input
                type="date"
                value={tempFilters.endDate}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, endDate: e.target.value })
                }
                className="w-full sm:w-48"
              />
              <Button
                onClick={() => {
                  if (
                    tempFilters.startDate &&
                    tempFilters.endDate &&
                    new Date(tempFilters.endDate) <
                      new Date(tempFilters.startDate)
                  ) {
                    toast.error(
                      "End date must be greater than or equal to start date"
                    );
                    return;
                  }
                  setFilters({ ...tempFilters });
                }}
                className="text-white"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTempFilters({ startDate: "", endDate: "" });
                  setFilters({ startDate: "", endDate: "" });
                }}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <Card className="mb-4 shadow-none border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Email Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    { Header: "Amount", accessor: "amount" },
                    { Header: "Status", accessor: "status" },
                    { Header: "Remarks", accessor: "remarks" },
                    {
                      Header: "Date",
                      accessor: "createdAt",
                      Cell: ({ row }: any) => row.original.date,
                      exportValue: (row: any) => row.date,
                    },
                    { Header: "Emails", accessor: "emailCount" },
                  ]}
                  data={renderEmailWithdrawals}
                  paginate={renderEmailWithdrawals.length > 5}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Bonus Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    { Header: "Type", accessor: "type" },
                    { Header: "Amount", accessor: "amount" },
                    { Header: "Status", accessor: "status" },
                    { Header: "Remarks", accessor: "remarks" },
                    {
                      Header: "Date",
                      accessor: "createdAt",
                      Cell: ({ row }: any) => row.original.date,
                      exportValue: (row: any) => row.date,
                    },
                  ]}
                  data={renderBonusWithdrawals}
                  paginate={renderBonusWithdrawals.length > 5}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods">
            <Card className="mb-6 shadow-none border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Withdrawal Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    { Header: "Account Title", accessor: "accountTitle" },
                    { Header: "Method Type", accessor: "methodType" },
                    { Header: "Account Number", accessor: "accountNumber" },
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
                            onClick={() =>
                              handleViewWithdrawlMethod(row.original)
                            }
                          >
                            <Pencil className="h-3.5 w-3.5 text-gray-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() =>
                              handleDeleteWithdrawlMethod(row.original.uuid)
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  data={withdrawalMethods}
                  paginate={withdrawalMethods.length > 5}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <MarkSupplierPremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onSubmitHandler={handlePremiumSubmit}
        mode="direct"
      />
      <MarkSupplierPremiumModal
        open={showWarnModal}
        onOpenChange={setShowWarnModal}
        onSubmitHandler={handleWarnSubmit}
        mode="warn"
      />
      <UpdateWithdrawlMethodModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        method={selectedMethod}
      />
    </>
  );
};

export default SupplierDetails;

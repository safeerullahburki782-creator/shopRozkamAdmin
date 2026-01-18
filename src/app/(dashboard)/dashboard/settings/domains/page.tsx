"use client";

import { useEffect, useState } from "react";
import TabLayout from "@/components/layout/TabLayout";
import { useContextConsumer } from "@/context/Context";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil, BadgeCheck, BadgeX } from "lucide-react";
import {
  useDeleteDomains,
  useGetDomainsList,
  useUpdateDomains,
} from "@/hooks/apis/useDomains";
import DomainModals from "@/components/Forms/forms-modal/domains/AddDomain";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export default function Domains() {
  const { token } = useContextConsumer();
  const [domains, setDomain] = useState<any[]>([]);
  const [selectedDomainToView, setSelectedDomainToView] = useState({});
  const [isAddDomainModalOpen, setIsAddDomainModalOpen] =
    useState<boolean>(false);
  const [isEditDomainModalOpen, setIsEditDomainModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useGetDomainsList(token);
  const { mutate: updateDomain } = useUpdateDomains();
  const { mutate: deleteDomain } = useDeleteDomains(token);

  const handleEdit = (item: any) => {
    setIsEditDomainModalOpen(true);
    setSelectedDomainToView(item);
  };

  const handleDelete = async (uuid: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Domain?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteDomain(uuid);
    }
  };

  const handleToggle = (uuid: string, isEnabled: boolean) => {
    const toggleStatus = isEnabled ? "false" : "true";
    const updatedData = {
      data: {
        uuid,
        isEnabled: toggleStatus,
      },
      token,
    };
    updateDomain(updatedData);
  };

  useEffect(() => {
    if (data?.data) {
      setDomain([...data.data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  return (
    <>
      <TabLayout>
        <div className="p-6 space-y-3">
          <div className="flex flex-col lg:flex-row justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Domains</h2>
            <Button
              size="sm"
              className="text-xs flex items-center gap-2 shadow-sm ml-6"
              onClick={() => setIsAddDomainModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Add Domain
            </Button>
          </div>
          {data?.data.length <= 0 && <p>No Domains Available</p>}

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 mt-6">
              {domains.map((item: any) => (
                <div
                  key={item.uuid}
                  className={clsx(
                    "relative bg-white border p-4 pt-8 rounded-xl transition-all hover:bg-gray-50",
                    "group"
                  )}
                >
                  <div className="absolute top-2 left-2 z-10">
                    {item.isEnabled ? (
                      <Badge
                        className="bg-green-200 text-green-800 border border-green-300 text-xs px-2 py-0.5 rounded-full cursor-pointer shadow-sm hover:bg-green-300 transition-colors flex items-center gap-1"
                        onClick={() => handleToggle(item.uuid, item.isEnabled)}
                      >
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        className="bg-red-100 text-red-800 border border-red-300 text-xs px-2 py-0.5 rounded-full cursor-pointer shadow-sm hover:bg-red-300 transition-colors flex items-center gap-1"
                        onClick={() => handleToggle(item.uuid, item.isEnabled)}
                      >
                        <BadgeX className="w-3.5 h-3.5" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-1 right-2 z-10 flex">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.uuid)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="py-6 flex items-start gap-3">
                    <p className="font-normal text-sm text-gray-800">
                      {item.domain}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabLayout>
      <DomainModals
        open={isAddDomainModalOpen}
        onOpenChange={setIsAddDomainModalOpen}
        mode="add"
      />
      <DomainModals
        open={isEditDomainModalOpen}
        onOpenChange={setIsEditDomainModalOpen}
        domain={selectedDomainToView}
        mode="view"
      />
    </>
  );
}

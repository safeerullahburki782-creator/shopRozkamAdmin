"use client";

import { useCallback, useEffect, useState } from "react";
import TabLayout from "@/components/layout/TabLayout";
import { useContextConsumer } from "@/context/Context";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import MarqueeModal from "@/components/Forms/forms-modal/marquee/AddMarquee";
import { DndProvider } from "react-dnd";
import update from "immutability-helper";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useDeleteMarquee,
  useGetMarqueeList,
  useReorderMarquee,
  useUpdateMarquee,
} from "@/hooks/apis/useMarquee";
import DraggableMarqueeItem from "@/components/marquee/DraggableMarqueeItem";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Maquee() {
  const { token } = useContextConsumer();
  const [marquees, setMarquees] = useState<any[]>([]);
  const [selectedMarqueToView, setSelectedMarqueToView] = useState({});
  const [isAddMarqueeModalOpen, setIsAddMarqueeModalOpen] =
    useState<boolean>(false);
  const [isEditMarqueeModalOpen, setIsEditMarqueeModalOpen] =
    useState<boolean>(false);

  //
  const { data, isLoading } = useGetMarqueeList(token);
  const { mutate: updateMarquee } = useUpdateMarquee();
  const { mutate: reorderMarquee } = useReorderMarquee();
  const { mutate: deleteMarquee } = useDeleteMarquee(token);

  const handleEdit = (item: any) => {
    setIsEditMarqueeModalOpen(true);
    setSelectedMarqueToView(item);
  };

  const handleDelete = async (uuid: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Marquee?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteMarquee(uuid);
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
    updateMarquee(updatedData);
  };

  useEffect(() => {
    if (data?.data) {
      setMarquees([...data.data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  const moveMarquee = useCallback((dragIndex: number, hoverIndex: number) => {
    setMarquees((prevMarquees) =>
      update(prevMarquees, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevMarquees[dragIndex]],
        ],
      })
    );
  }, []);

  const handleDrop = () => {
    const reorder = {
      data: {
        uuids: marquees.map((m) => m.uuid),
      },
      token,
    };
    reorderMarquee(reorder);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <TabLayout>
          <div className="p-6 space-y-3">
            <div className="flex flex-col lg:flex-row justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Marquee Messages
              </h2>
              <Button
                size="sm"
                className="text-xs flex items-center gap-2 shadow-sm ml-6"
                onClick={() => setIsAddMarqueeModalOpen(true)}
              >
                <PlusCircle className="w-4 h-4" />
                Add Marquee
              </Button>
            </div>
            {data?.data.length <= 0 && <p>No Marquee Available</p>}

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data?.data
                ?.sort((a: any, b: any) => a.order - b.order)
                .map((item: any, index: number) => (
                  <DraggableMarqueeItem
                    key={item.uuid}
                    index={index}
                    id={item.uuid}
                    moveMarquee={moveMarquee}
                    onDrop={handleDrop}
                    message={item.message}
                    isEnabled={item.isEnabled}
                    uuid={item.uuid}
                    order={item.order}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.uuid)}
                    onToggle={() => handleToggle(item.uuid, item.isEnabled)}
                  />
                ))
            )}
          </div>
        </TabLayout>
      </DndProvider>
      <MarqueeModal
        open={isAddMarqueeModalOpen}
        onOpenChange={setIsAddMarqueeModalOpen}
        mode="add"
      />
      <MarqueeModal
        open={isEditMarqueeModalOpen}
        onOpenChange={setIsEditMarqueeModalOpen}
        marquee={selectedMarqueToView}
        mode="view"
      />
    </>
  );
}

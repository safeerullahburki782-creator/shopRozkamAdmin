"use client";

import { useCallback, useEffect, useState } from "react";
import TabLayout from "@/components/layout/TabLayout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { useContextConsumer } from "@/context/Context";
import DraggableInstructionItem from "@/components/instructions/DraggableInstructionItem";

import InsModal from "@/components/Forms/forms-modal/instructions/AddIns";
import {
  useDeleteIns,
  useGetInsList,
  useReorderIns,
  useUpdateIns,
} from "@/hooks/apis/useInts";
import { reorderIns } from "@/api/inst";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstructionPage() {
  const { token } = useContextConsumer();
  const [instructions, setInstructions] = useState<any[]>([]);
  const [selectedInstruction, setSelectedInstruction] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddInseModalOpen, setIsAddInseModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useGetInsList(token);
  const { mutate: updateInstruction } = useUpdateIns();
  const { mutate: deleteInstruction } = useDeleteIns(token);
  const { mutate: reorderInstructions } = useReorderIns();

  const handleEdit = (item: any) => {
    setIsEditModalOpen(true);
    setSelectedInstruction(item);
  };

  const handleDelete = async (uuid: any) => {
    const confirm = await SweetAlert(
      "Delete Instruction?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (confirm) deleteInstruction(uuid);
  };

  const handleToggle = (uuid: string, isEnabled: boolean) => {
    updateInstruction({
      data: {
        uuid,
        isEnabled: !isEnabled,
      },
      token,
    });
  };

  useEffect(() => {
    if (data?.data) {
      setInstructions([...data.data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  const moveInstruction = useCallback((from: number, to: number) => {
    setInstructions((prev) =>
      update(prev, {
        $splice: [
          [from, 1],
          [to, 0, prev[from]],
        ],
      })
    );
  }, []);

  const handleDrop = () => {
    reorderInstructions({
      data: {
        uuids: instructions.map((i) => i.uuid),
      },
      token,
    });
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <TabLayout>
          <div className="p-6 space-y-3">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {" "}
                Instructions
              </h2>
              <Button
                size="sm"
                className="text-xs flex items-center gap-2 shadow-sm"
                onClick={() => setIsAddInseModalOpen(true)}
              >
                <PlusCircle className="w-4 h-4" />
                Add Instruction
              </Button>
            </div>

            {instructions?.length <= 0 && <p>No Instruction Available</p>}

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              instructions.map((item, index) => (
                <DraggableInstructionItem
                  key={item.uuid}
                  id={item.uuid}
                  index={index}
                  moveInstruction={moveInstruction}
                  onDrop={handleDrop}
                  title={item.title}
                  description={item.description}
                  isEnabled={item.isEnabled}
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
      <InsModal
        open={isAddInseModalOpen}
        onOpenChange={setIsAddInseModalOpen}
        mode="add"
      />
      <InsModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        ins={selectedInstruction}
        mode="view"
      />
    </>
  );
}

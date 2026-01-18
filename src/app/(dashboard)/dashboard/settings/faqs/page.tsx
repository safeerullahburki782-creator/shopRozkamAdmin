"use client";

import { useCallback, useEffect, useState } from "react";
import TabLayout from "@/components/layout/TabLayout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { useContextConsumer } from "@/context/Context";
import DraggableFaqItem from "@/components/faqs/DraggableFaqItem";
import {
  useDeleteFaq,
  useGetFaqsList,
  useReorderFaq,
  useUpdateFaq,
} from "@/hooks/apis/useFaqs";
import FAqModal from "@/components/Forms/forms-modal/faq/AddFAq";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function FAQ() {
  const { token } = useContextConsumer();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [selectedFaqToView, setSelectedFaqToView] = useState({});
  const [isEditFaqModalOpen, setIsEditFAqModalOpen] = useState<boolean>(false);
  const [isAddFaqeModalOpen, setIsAddFaqeModalOpen] = useState<boolean>(false);

  //
  const { data, isLoading } = useGetFaqsList(token);
  const { mutate: updateFaq } = useUpdateFaq();
  const { mutate: reorderFaq } = useReorderFaq();
  const { mutate: deleteFaq } = useDeleteFaq(token);

  const handleEdit = (item: any) => {
    setIsEditFAqModalOpen(true);
    setSelectedFaqToView(item);
  };

  const handleDelete = async (uuid: any) => {
    const confirm = await SweetAlert(
      "Delete FAQ?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (confirm) deleteFaq(uuid);
  };

  const handleToggle = (uuid: string, isEnabled: boolean) => {
    updateFaq({
      data: {
        uuid,
        isEnabled: !isEnabled,
      },
      token,
    });
  };

  useEffect(() => {
    if (data?.data) {
      setFaqs([...data.data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  const moveFaq = useCallback((from: number, to: number) => {
    setFaqs((prev) =>
      update(prev, {
        $splice: [
          [from, 1],
          [to, 0, prev[from]],
        ],
      })
    );
  }, []);

  const handleDrop = () => {
    reorderFaq({
      data: {
        uuids: faqs.map((f) => f.uuid),
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
              <h2 className="text-xl font-semibold text-gray-800">FAQs</h2>
              <Button
                size="sm"
                className="text-xs flex items-center gap-2 shadow-sm"
                onClick={() => setIsAddFaqeModalOpen(true)}
              >
                <PlusCircle className="w-4 h-4" />
                Add FAQ
              </Button>
            </div>

            {faqs?.length <= 0 && <p>No Faqs Available</p>}

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              faqs.map((faq, index) => (
                <DraggableFaqItem
                  key={faq.uuid}
                  id={faq.uuid}
                  index={index}
                  moveFaq={moveFaq}
                  onDrop={handleDrop}
                  question={faq.question}
                  answer={faq.answer}
                  isEnabled={faq.isEnabled}
                  order={faq.order}
                  onEdit={() => handleEdit(faq)}
                  onDelete={() => handleDelete(faq.uuid)}
                  onToggle={() => handleToggle(faq.uuid, faq.isEnabled)}
                />
              ))
            )}
          </div>
        </TabLayout>
      </DndProvider>
      <FAqModal
        open={isAddFaqeModalOpen}
        onOpenChange={setIsAddFaqeModalOpen}
        mode="add"
      />

      <FAqModal
        open={isEditFaqModalOpen}
        onOpenChange={setIsEditFAqModalOpen}
        faq={selectedFaqToView}
        mode="view"
      />
    </>
  );
}

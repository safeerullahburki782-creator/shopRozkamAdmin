"use client";

import { useEffect, useState } from "react";
import TabLayout from "@/components/layout/TabLayout";
import { useContextConsumer } from "@/context/Context";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import clsx from "clsx";
import {
  useDeleteCategoryWhatsapp,
  useGetCategoryWhatsapp,
} from "@/hooks/apis/useCategoryWhatsapp";
import CategoryWhatsappModal from "@/components/Forms/forms-modal/category-whatsapp/AddCategoryWhatsapp";

export default function CategoryWhatsapp() {
  const { token } = useContextConsumer();
  const [categories, setCategoriesWhatsapp] = useState<any[]>([]);
  const [selectedCategoryToView, setSelectedCategoryToView] = useState({});
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    useState<boolean>(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useGetCategoryWhatsapp(token);
  const { mutate: deleteCategory } = useDeleteCategoryWhatsapp(token);

  const handleEdit = (item: any) => {
    setIsEditCategoryModalOpen(true);
    setSelectedCategoryToView(item);
  };

  const handleDelete = async (uuid: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Whatsapp Category?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteCategory(uuid);
    }
  };

  useEffect(() => {
    if (data?.data) {
      setCategoriesWhatsapp([...data.data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  return (
    <>
      <TabLayout>
        <div className="p-6 space-y-3">
          <div className="flex flex-col lg:flex-row justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Whatsapp Categories
            </h2>
            <Button
              size="sm"
              className="text-xs flex items-center gap-2 shadow-sm ml-6"
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Add Whatsapp
            </Button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">No Category Available</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 mt-6">
              {categories.map((item: any) => (
                <div
                  key={item.uuid}
                  className={clsx(
                    "relative bg-white border p-4 pt-8 rounded-xl transition-all hover:bg-gray-50",
                    "group"
                  )}
                >
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

                  <div className="py-6 flex flex-col gap-2">
                    <p className="font-medium text-sm text-gray-900">
                      Category: {item.category.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Whatsapp: {item.whatsappNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabLayout>
      <CategoryWhatsappModal
        open={isAddCategoryModalOpen}
        onOpenChange={setIsAddCategoryModalOpen}
        mode="add"
      />
      <CategoryWhatsappModal
        open={isEditCategoryModalOpen}
        onOpenChange={setIsEditCategoryModalOpen}
        categoryWhtsp={selectedCategoryToView}
        mode="view"
      />
    </>
  );
}

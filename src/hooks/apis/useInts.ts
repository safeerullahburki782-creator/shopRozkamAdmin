import {
  addIns,
  deleteIns,
  getInsList,
  reorderIns,
  updateIns,
} from "@/api/inst";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddIns = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      addIns(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allIns", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useGetInsList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allIns", token],
    queryFn: () => getInsList(token),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  } as UseQueryOptions);
};

export const useUpdateIns = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      updateIns(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allIns", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useDeleteIns = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: any) => deleteIns(uuid, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allFaqs", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useReorderIns = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      reorderIns(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allFaqs", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

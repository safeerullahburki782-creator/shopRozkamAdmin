import {
  addDomains,
  deleteDomains,
  getDomainsList,
  updateDomains,
} from "@/api/domains";
import { reorderMarquee } from "@/api/marquee";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetDomainsList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allDomains", token],
    queryFn: () => getDomainsList(token),
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

export const useAddDomains = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      addDomains(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allDomains", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useUpdateDomains = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      updateDomains(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allDomains", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useDeleteDomains = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: any) => deleteDomains(uuid, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allDomains", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useReorderDomains = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      reorderMarquee(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allDomains", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

import {
  deleteBulkEmails,
  emailBulkUpdate,
  emailBulkUpdateUuids,
  getDuplicateEmailsList,
  getEmailsList,
  getEmailsStats,
  getSupplierList,
  insertEmails,
  searchBulkEmails,
} from "@/api/emails";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAllEmails = (token: string, filters: any) => {
  return useQuery<any, Error>({
    queryKey: ["allEmails", token, filters.page, filters.limit, filters.status, filters.startDate, filters.endDate, filters.orderBy],
    queryFn: () => getEmailsList(token, filters),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to fetch emails");
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  } as UseQueryOptions);
};

export const useGetDuplicateEmails = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["duplicateEmails", token],
    queryFn: () => getDuplicateEmailsList(token),
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

export const useGetEmailStats = (token: string, filters: any) => {
  return useQuery<any, Error>({
    queryKey: ["getEmailsStats", token],
    queryFn: () => getEmailsStats(token, filters),
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

export const useBulkEmailUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      emailBulkUpdate(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allEmails", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useBulkEmailUpdateUuid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      emailBulkUpdateUuids(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allEmails", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useInsertEmails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      insertEmails(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allEmails", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useSearchBulkEmails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      searchBulkEmails(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allEmails", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useDeleteBulkEmails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      deleteBulkEmails(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allEmails", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useGetSupplierList = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["suppliers", token],
    queryFn: () => getSupplierList(token),
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

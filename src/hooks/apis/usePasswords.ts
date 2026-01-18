import {
  createPassword,
  getPasswordList,
  updatePassword,
} from "@/api/passwords";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateNewPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      createPassword(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries(["allPasswords", variables.token] as any);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useGetAllPasswords = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["allPasswords", token],
    queryFn: () => getPasswordList(token),
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

export const useUpdatePassword = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: any }) => updatePassword(data, token),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["allPasswords", token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

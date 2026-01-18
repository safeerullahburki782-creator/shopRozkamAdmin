import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createAccount,
  getUserProfile,
  login,
  updateUserAccountPassword,
  updateUserProfile,
} from "@/api/auth";
import { useAuth } from "../useAuth";

export const useUserAccount = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: createAccountPayload) => createAccount(data),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        router.push("/");
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useUserLogin = () => {
  const { loginAuth } = useAuth();
  return useMutation({
    mutationFn: (data: any) => login(data),
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        loginAuth(data?.data.accessToken, data?.data.refreshToken);
      } else {
        toast.error(data?.response?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useUpdateUserAccountPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      updateUserAccountPassword(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["userProfile", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useGetUSerProfile = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ["userProfile", token],
    queryFn: () => getUserProfile(token),
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

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      updateUserProfile(data, token),
    onSuccess: (data: any, variables: { data: any; token: string }) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries(["userProfile", variables.token] as any);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

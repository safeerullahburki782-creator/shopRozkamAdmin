interface Project {
  uid: string;
  estate: string;
  tehsil: string;
  district: string;
  province: string;
  size_acre: number;
  estate_asking_price: number;
  [key: string]: any;
}

interface createAccountPayload {
  password: string;
  confirmPassword: string;
}

type ForgotPasswordFormValues =
  | { email: string }
  | { email: string; otp: string }
  | { email: string; newPassword: string; confirmPassword: string };

interface Option {
  value: string;
  label: string;
}

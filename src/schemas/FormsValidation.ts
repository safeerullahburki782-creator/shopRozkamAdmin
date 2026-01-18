import * as z from "zod";

const createAccountFormSchema = z
  .object({
    username: z.string().nonempty({
      message: "Enter username",
    }),
    phone: z.string().nonempty({
      message: "Enter phone number.",
    }),
    role: z.string().nonempty({
      message: "Select Role",
    }),
    password: z.string().nonempty({
      message: "Enter password",
    }),
    confirmPassword: z.string().nonempty({
      message: "Enter confirm password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginAccountFormSchema = z.object({
  username: z.string().nonempty({
    message: "Enter username",
  }),
  password: z.string().nonempty({
    message: "Password is required.",
  }),
});

const profileFormSchema = z.object({
  username: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .optional(),
  role: z.string().optional(),
  verified: z.boolean().optional(),
  profileImg: z.string().url().nullable().optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const projectFormSchema = z
  .object({
    title: z.string().nonempty({ message: "Project Title is required." }),
    trade: z.string().nonempty({ message: "Trade selection is required." }),
    sector: z.string().nonempty({ message: "Sector is required." }),
    description: z.string().nonempty({ message: "Description is required." }),
    requirements: z
      .string()
      .nonempty({ message: "Requirements are required." }),
    location: z
      .array(z.number())
      .length(2, { message: "Location must contain latitude and longitude." }),
    address: z.string().nonempty({ message: "Address is required." }),
    tehsil: z.string().nonempty({ message: "Tehsil is required." }),
    district: z.string().nonempty({ message: "District is required." }),
    province: z.string().nonempty({ message: "Province is required." }),
    duration: z.string().nonempty({ message: "Duration is required." }),
    startDate: z.string().nonempty({ message: "Start Date is required." }),
    endDate: z.string().nonempty({ message: "End Date is required." }),
    deadline: z
      .string()
      .nonempty({ message: "Application Deadline is required." }),
    totalSlots: z.string().nonempty({ message: "Total Slots are required." }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be greater than start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.startDate) > new Date(data.deadline), {
    message: "Deadline must be smaller than start date",
    path: ["deadline"],
  });

const addNewSupplierFormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    countryCode: z.string().min(2, "Country code is required"),
    phone: z.string().min(10, "Phone is required"),
    password: z.string().min(6, "Password is required"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    bonus: z.string().optional(),
    category: z.string().optional(),
    active: z.string().optional(),
    isPremium: z.string().optional(),
    customText: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateSupplierFormSchema = z
  .object({
    bonus: z.string().optional(),
    category: z.string().optional(),
    active: z.string().optional(),
    isPremium: z.string().optional(),
    customText: z.string().optional(),
    password: z.string().optional(),
  })
  .refine((data) => data.isPremium !== "true" || !!data.customText?.trim(), {
    path: ["customText"],
    message: "Custom text is required when premium is true",
  });

const addEmailRewardFormSchema = z.object({
  reward: z.string().nonempty({
    message: "Enter reward",
  }),
});

const addWithdrawThresholdFormSchema = z.object({
  threshold: z.string().nonempty({
    message: "Enter threshold",
  }),
});

const addBonusFormSchema = z.object({
  bonus: z.string().nonempty({
    message: "Enter bonus",
  }),
});

const filterEmailSchema = z.object({
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  orderBy: z.string().optional(),
});

const addPasswordSchema = z.object({
  passwords: z
    .string()
    .nonempty({ message: "Please enter at least one password" }),
});

const bulkEmailUpdate = z.object({
  email: z.string().optional(),
  emails: z.string().optional(),
  amount: z.string().optional(),
  status: z.string().nonempty({
    message: "Select Status",
  }),
remarks: z.string().optional(),  
});

const withdrawlUpdate = z.object({
  action: z.string().nonempty({ message: "Select Action" }),
  remarks: z.string().optional(),
  paymentScreenshot: z.any().optional(),
});

const insertEmailsSchema = z.object({
  userUuid: z.string().nonempty({ message: "Please select a supplier" }),
  emails: z.string().nonempty({ message: "Please enter at least one email" }),
  status: z.string().nonempty({ message: "Select a status" }),
  remarks: z.string().optional(),
});

const deleteOnlySchema = z.object({
  emails: z.string().nonempty("Please enter at least one email"),
});

const addFaq = z.object({
  question: z.string().nonempty({ message: "Enter FAQ" }),
  answer: z.string().nonempty({ message: "Enter FAQ ans" }),
});

const addInsSchema = z.object({
  title: z.string().nonempty({ message: "Enter title" }),
  description: z.string().nonempty({ message: "Enter description" }),
});

const addMarquee = z.object({
  message: z.string().nonempty({ message: "Enter marquee" }),
});

const markSupplierPremiumSchema = z.object({
  customText: z.string().nonempty({ message: "Enter..." }),
});

const addDomain = z.object({
  domain: z.string().nonempty({ message: "Enter domain" }),
});

const addCategoryWhatsappFormSchema = z.object({
  category: z.string().nonempty({ message: "Select Category" }),
  whatsappNumber: z.string().nonempty({ message: "Enter Whatsapp No" }),
});

const filterSupplierSchema = z.object({
  active: z.string().optional(),
});

export {
  createAccountFormSchema,
  loginAccountFormSchema,
  profileFormSchema,
  projectFormSchema,
  passwordSchema,
  addNewSupplierFormSchema,
  addPasswordSchema,
  addEmailRewardFormSchema,
  addWithdrawThresholdFormSchema,
  addBonusFormSchema,
  bulkEmailUpdate,
  filterEmailSchema,
  withdrawlUpdate,
  insertEmailsSchema,
  filterSupplierSchema,
  addFaq,
  addMarquee,
  addInsSchema,
  addDomain,
  deleteOnlySchema,
  addCategoryWhatsappFormSchema,
  markSupplierPremiumSchema,
};

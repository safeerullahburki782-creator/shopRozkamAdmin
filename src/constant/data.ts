export const category = [
  { value: "province", label: "Province" },
  { value: "district", label: "District" },
  { value: "tehsil", label: "Tehsil" },
];

export const role = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

export const filterStatus = [
  { value: "good", label: "Good" },
  { value: "bad", label: "Bad" },
  { value: "pending", label: "Pending" },
];

export const withdrawlOption = [
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
];

export const supplierActiveVal = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export const supplierCategory = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "H", label: "H" },
  { value: "I", label: "I" },
  { value: "J", label: "J" },
  { value: "K", label: "K" },
  { value: "L", label: "L" },
  { value: "M", label: "M" },
  { value: "N", label: "N" },
  { value: "O", label: "O" },
  { value: "P", label: "P" },
  { value: "Q", label: "Q" },
  { value: "R", label: "R" },
  { value: "S", label: "S" },
  { value: "T", label: "T" },
  { value: "U", label: "U" },
  { value: "V", label: "V" },
  { value: "W", label: "W" },
  { value: "X", label: "X" },
  { value: "Y", label: "Y" },
  { value: "Z", label: "Z" },
];

export const trade = [
  { value: "carpenter", label: "Carpenter" },
  { value: "elevator_mechanic", label: "Elevator Mechanic" },
  { value: "iron_worker", label: "Iron Worker" },
  { value: "laborer", label: "Laborer" },
  { value: "civil_engineer", label: "Civil Engineer" },
  { value: "mechanical", label: "Mechanical" },
  { value: "electrical", label: "Electrical" },
  { value: "electronics", label: "Electronics" },
  { value: "chemical", label: "Chemical" },
  { value: "mechatronics", label: "Mechatronics" },
  { value: "printing_graphic_arts", label: "Printing and Graphic Arts" },
  { value: "electrical_automation", label: "Electrical Automation" },
];

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard/overiew",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Suppliers",
    url: "/dashboard/suppliers",
    icon: "suppliers",
    isActive: false,
    shortcut: ["s", "s"],
    items: [],
  },
  {
    title: "Inactive Suppliers",
    url: "/dashboard/inactive-suppliers",
    icon: "PanelTopOpen",
    isActive: false,
    shortcut: ["in", "in"],
    items: [],
  },
  {
    title: "Whatsapp",
    url: "/dashboard/settings/category-whatsapp",
    icon: "chat",
    isActive: false,
    shortcut: ["ch", "ch"],
    items: [],
  },
  {
    title: "Emails",
    url: "/dashboard/emails",
    icon: "mail",
    isActive: false,
    shortcut: ["e", "e"],
    items: [],
  },
  {
    title: "Duplicate Emails",
    url: "/dashboard/emails?scroll=duplicate",
    icon: "mailList",
    isActive: false,
    shortcut: ["e", "e"],
    items: [],
  },
  {
    title: "Passwords",
    url: "/dashboard/passwords",
    icon: "passwords",
    isActive: false,
    shortcut: ["p", "p"],
    items: [],
  },
  {
    title: "Withdrawls",
    url: "/dashboard/withdrawls",
    icon: "PanelTopOpen",
    isActive: false,
    shortcut: ["w", "w"],
    items: [],
  },
  {
    title: "Profile",
    url: "/dashboard/settings",
    icon: "user",
    isActive: false,
    shortcut: ["u", "u"],
    items: [],
  },
];

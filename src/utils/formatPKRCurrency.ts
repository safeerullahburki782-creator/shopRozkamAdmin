export const formatPKRCurrency = (value: any) => {
  if (value === undefined || value === null) return "No Price Record";

  if (value < 1000) {
    return value.toString();
  } else if (value < 100000) {
    let formatted = (value / 1000).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + " Thousand"
      : formatted + " Thousand";
  } else if (value < 10000000) {
    let formatted = (value / 100000).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + " Lakh"
      : formatted + " Lakh";
  } else if (value < 1000000000) {
    let formatted = (value / 10000000).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + " Crore"
      : formatted + " Crore";
  } else {
    let formatted = (value / 1000000000).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + " Arab"
      : formatted + " Arab";
  }
};

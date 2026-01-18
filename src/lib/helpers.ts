export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const createQueryString = (filters: any): string => {
  const queryParams: string[] = [];

  if (filters.facilities && filters.facilities.length > 0) {
    filters.facilities.forEach((facility: string) => {
      queryParams.push(`${facility}=true`);
    });
  }
  if (filters.landType && filters.landType.length > 0) {
    queryParams.push(
      "region=[" +
        filters.landType.map((type: any) => `"${type}"`).join(",") +
        "]"
    );
  }
  if (filters.landStatus && filters.landStatus.length > 0) {
    queryParams.push(`estate=${filters.landStatus.join(",")}`);
  }
  if (filters.crop && filters.crop.length > 0) {
    queryParams.push(`crop=${filters.crop}`);
  }
  if (filters.price && filters.price.length > 0) {
    queryParams.push(`estate_minmax=${filters.price}`);
  }
  if (filters.landSize && filters.landSize.length > 0) {
    queryParams.push(`farm_size=${filters.landSize}`);
  }

  return queryParams.join("&");
};

export const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500 text-white";
    case "open":
      return "bg-green-600 text-white";
    case "closed":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const imagesBaseURL =
  "https://s3-emailmarketing.s3.eu-north-1.amazonaws.com/";

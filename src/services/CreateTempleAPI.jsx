import axiosInstance from "../utils/axiosConfig";

export const CreateTempleAPI = async (data) => {
  console.log("Temple API called with:", JSON.stringify(data, null, 2));

  // Transform form values to JSON payload as per mongoose schema
  const transformData = (data) => {
    return {
      title: data.title || "",
      titleHi: data.titleHi || "",
      // Handle location as object with value property or direct string
      location: typeof data.location === 'object' ? (data.location?.value || data.location?.label || "") : (data.location || ""),
      locationHi: typeof data.locationHi === 'object' ? (data.locationHi?.value || data.locationHi?.label || "") : (data.locationHi || ""),
      subTitle: data.subtitle || "",
      subTitleHi: data.subtitleHi || "",
      bhagwan: data.bhagwan || "",
      bhagwanHi: data.bhagwanHi || "",
      templeDescription: data.description || "",
      templeDescriptionHi: data.descriptionHi || "",
      longDescription: data.longDescription || "",
      longDescriptionHi: data.longDescriptionHi || "",
    };
  };

  try {
    const jsonPayload = transformData(data);
    console.log("Temple JSON Payload:", JSON.stringify(jsonPayload, null, 2));

    const response = await axiosInstance.post("/api/temples", jsonPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200 || response?.status === 201) {
      return response?.data;
    }
  } catch (error) {
    console.error("Temple API Error:", error.response?.data || error.message);
    if (error.response?.data) {
      return { error: error.response.data.msg || error.response.data.error || JSON.stringify(error.response.data) };
    } else if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      return { error: "Connection timed out. Please try again later." };
    }
    return { error: "Something went wrong." };
  }
};


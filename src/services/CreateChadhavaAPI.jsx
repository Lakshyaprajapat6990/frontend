import axiosInstance from "../utils/axiosConfig";

export const CreateChadhavaAPI = async (data, itemImage) => {
  console.log("Data being sent to CreateChadhavaAPI:", JSON.stringify(data, null, 2));
  try {
    // Build JSON object matching backend structure
    // Handle both field names (description/desc and mandir object/string)
    const jsonPayload = {
      title: data.title || "",
      titleHi: data.titleHi || "",
      subtitle: data.subtitle || "",
      subtitleHi: data.subtitleHi || "",
      chadhava: data.chadhava || null,
      // Handle both description and desc field names
      desc: data.description || data.desc || "",
      desc_hi: data.descriptionHi || data.descHi || "",
      // Handle mandir as object with value property or as direct string
      mandir: typeof data.mandir === 'object' ? (data.mandir?.value || data.mandir?.label || "") : (data.mandir || ""),
      mandirHi: typeof data.mandirHi === 'object' ? (data.mandirHi?.value || data.mandirHi?.label || "") : (data.mandirHi || ""),
      
      // Items array
      items: (data.cItem || []).map((item, i) => ({
        title: item.title || "",
        titleHi: item.titleHi || "",
        description: item.description || "",
        descriptionHi: item.descriptionHi || "",
        price: item.price || 0,
        image: item.imageUrl || item.img || "",
      })),
      
      // Benefits array
      benefit: (data.benefit || []).map((b) => ({
        title: b.title || "",
        titleHi: b.titleHi || "",
        description: b.description || "",
        descriptionHi: b.descriptionHi || "",
      })),
      
      // FAQ array
      faq: Array.isArray(data.faq)
        ? data.faq.map((f) => ({
            question: f.question || "",
            questionHi: f.questionHi || "",
            answer: f.answer || "",
            answerHi: f.answerHi || "",
          }))
        : [],
    };

    console.log("Chadhava JSON Payload:", JSON.stringify(jsonPayload, null, 2));

    const response = await axiosInstance.post("/api/chadhavas", jsonPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200 || response?.status === 201) {
      return response?.data;
    }
  } catch (error) {
    console.error("Chadhava API Error:", error.response?.data || error.message);
    if (error.response?.data) {
      return { error: error.response.data.msg || error.response.data.error || JSON.stringify(error.response.data) };
    } else if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      return { error: "Connection timed out. Please try again later." };
    }
    return { error: "Something went wrong." };
  }
};


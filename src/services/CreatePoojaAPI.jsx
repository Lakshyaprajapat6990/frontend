import axiosInstance from "../utils/axiosConfig";

export const CreatePoojaAPI = async (data) => {
  const transformData = (data) => {
    // Build JSON object with proper nested structure
    const jsonData = {
      title: data.title || "",
      titleHi: data.titleHi || "",
      subtitle: data.subtitle || "",
      subtitleHi: data.subtitleHi || "",
      location: data.originator?.value || "",
      locationHi: data.originatorHi?.value || "",
      capDate: data.capDate ? new Date(data.capDate).toISOString() : null,
      
      // Price as proper array
      price: data.price?.type ? data.price.type.map(p => ({
        single: {
          amaount: p.single?.amaount || null,
          description: p.single?.description || "",
          descriptionHi: p.single?.descriptionHi || ""
        },
        couple: {
          amaount: p.couple?.amaount || null,
          description: p.couple?.description || "",
          descriptionHi: p.couple?.descriptionHi || ""
        },
        family: {
          amaount: p.family?.amaount || null,
          description: p.family?.description || "",
          descriptionHi: p.family?.descriptionHi || ""
        }
      })) : [],
      
      // Benefit array
      benefit: Array.isArray(data.benefit) 
        ? data.benefit.map(b => ({
            title: b.title || "",
            titleHi: b.titleHi || "",
            description: b.description || "",
            descriptionHi: b.descriptionHi || ""
          }))
        : [],
      
      // FAQ array
      faq: Array.isArray(data.faq)
        ? data.faq.map(f => ({
            question: f.question || "",
            questionHi: f.questionHi || "",
            answer: f.answer || "",
            answerHi: f.answerHi || ""
          }))
        : [],
      
      // Items array
      items: Array.isArray(data.items)
        ? data.items.map(item => ({
            title: item.title || "",
            titleHi: item.titleHi || "",
            description: item.description || "",
            descriptionHi: item.descriptionHi || "",
            price: item.price || "",
            image: item.img || ""
          }))
        : []
    };

    return jsonData;
  };

  try {
    const formattedData = transformData(data);
    console.log("Sending Pooja data:", JSON.stringify(formattedData, null, 2));
    
    const response = await axiosInstance.post("/api/poojas", formattedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Pooja API Error:", error.response?.data || error.message);
    if (error.response?.data) {
      return { status: error.response.status, error: error.response.data.message || error.response.data };
    } else if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      return { status: 0, error: "Connection timed out. Please try again later." };
    }
    return { status: 0, error: "Something went wrong." };
  }
};


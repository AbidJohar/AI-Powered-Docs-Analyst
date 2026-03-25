import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // replace with your backend URL
  headers: { "Content-Type": "application/json" },
});


// Intercept errors and extract backend message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message; // use message not error

    // Let 429 pass through as-is so onError can handle it properly
    if (status === 429) {
      return Promise.reject(error); // keeps error.response intact
    }

    // For other errors, throw with the backend message
    if (backendMessage) {
      return Promise.reject(new Error(backendMessage));
    }

    return Promise.reject(error);
  }
);

// Upload a document (multipart/form-data)
export const uploadDocumentApi = async (file: File) => {
  const formData = new FormData();
  formData.append("document", file);

  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// List all documents
export const listDocumentsApi = async (page : number = 1) => {
  const { data } = await api.get("/documents", {
    params : {page , limit : 6}
  });
  //  console.log("data:",data);
   
  return data;
};

// Get single document
export const getDocumentApi = async (id: string) => {
  const { data } = await api.get(`/documents/${id}`);
  return data;
};

// Ask a question about a document
export const askQuestionApi = async (document_id: string, question: string) => {
  const { data } = await api.post("/ask", { document_id, question });
  return data;
};

// Get Q&A history for a document
export const getHistoryApi = async (document_id: string) => {
  const { data } = await api.get(`/history/${document_id}`);
  return data;
};
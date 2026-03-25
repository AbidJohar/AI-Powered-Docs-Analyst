import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  askQuestionApi,
  getDocumentApi,
  getHistoryApi,
  listDocumentsApi,
  uploadDocumentApi,
} from "../api/documentApi";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const queryKeys = {
  documents: ["documents"] as const,
  document: (id: string) => ["documents", id] as const,
  history: (documentId: string) => ["history", documentId] as const,
};

// ─── List all documents ───────────────────────────────────────────────────────
export const useDocuments = () =>
  useInfiniteQuery({
    queryKey: queryKeys.documents,
    queryFn: ({ pageParam = 1 }) => listDocumentsApi(pageParam as number),

    initialPageParam: 1,   // ← required in TQ v5

    getNextPageParam: (lastPage: any) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined,

    staleTime: 1000 * 60 * 2,
  });

// ─── Single document ──────────────────────────────────────────────────────────
export const useDocument = (id: string) =>
  useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => getDocumentApi(id),

    select: (response) => response.data,
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 min — document content is static after upload
  });

// ─── Q&A history for a document ───────────────────────────────────────────────
export const useHistory = (documentId: string) =>
  useQuery({
    queryKey: queryKeys.history(documentId),
    queryFn: () => getHistoryApi(documentId),
    enabled: Boolean(documentId),
    select: (response) => response.data ?? [],
    staleTime: 0, // always fresh — user just asked a question
  });

// ─── Upload a document ────────────────────────────────────────────────────────
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocumentApi,
    onSuccess: () => {
      // Bust the document list so the sidebar shows the new doc immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    }
  });
};


// ─── Ask a question ───────────────────────────────────────────────────────────
export const useAskQuestion = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: string) => askQuestionApi(documentId, question),
    onSuccess: () => {
      // Refresh history so the new Q&A pair appears instantly
      queryClient.invalidateQueries({
        queryKey: queryKeys.history(documentId),
      });
    },
  });
};
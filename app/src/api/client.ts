/**
 * Single API client module for Dra Lia app (NFR-001, NFR-002).
 * Uses BFF when authToken and API base are set; otherwise mocked for dev.
 */

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

export type UserProfile = {
  id: string;
  firebaseUid: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type DocumentStatus = 'pending' | 'processing' | 'processed' | 'failed';

export type DocumentSummary = {
  id: string;
  fileName: string;
  status: DocumentStatus;
  totalItems: number | null;
  outOfRangeItems: number | null;
  createdAt: string;
};

export type ExamItem = {
  code: string | null;
  name: string;
  date: string | null;
  resultValue: string;
  unit: string | null;
  referenceRange: string | null;
  outOfRange: boolean;
  notes: string | null;
};

export type DocumentDetail = {
  id: string;
  fileName: string;
  status: DocumentStatus;
  laboratory: string | null;
  examItems: ExamItem[];
};

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function headers(omitContentType?: boolean): HeadersInit {
  const h: Record<string, string> = {};
  if (!omitContentType) h['Content-Type'] = 'application/json';
  if (authToken) h['Authorization'] = `Bearer ${authToken}`;
  return h;
}

function useRealApi(): boolean {
  return Boolean(authToken && API_BASE && !API_BASE.includes('example.com'));
}

/** GET /v1/me */
export async function getMe(): Promise<UserProfile> {
  if (useRealApi()) {
    const res = await fetch(`${API_BASE}/v1/me`, { headers: headers() });
    if (!res.ok) throw new Error(`getMe: ${res.status}`);
    return res.json();
  }
  return {
    id: 'mock-user-id',
    firebaseUid: 'mock-firebase-uid',
    displayName: 'Test User',
    avatarUrl: null,
  };
}

/** GET /v1/documents */
export async function getDocuments(): Promise<{ items: DocumentSummary[] }> {
  if (useRealApi()) {
    const res = await fetch(`${API_BASE}/v1/documents`, { headers: headers() });
    if (!res.ok) throw new Error(`getDocuments: ${res.status}`);
    return res.json();
  }
  return {
    items: [
      {
        id: 'mock-doc-1',
        fileName: 'exam-sample.pdf',
        status: 'processed',
        totalItems: 12,
        outOfRangeItems: 2,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

/** GET /v1/documents/:id */
export async function getDocument(id: string): Promise<DocumentDetail> {
  if (useRealApi()) {
    const res = await fetch(`${API_BASE}/v1/documents/${id}`, { headers: headers() });
    if (!res.ok) throw new Error(`getDocument: ${res.status}`);
    return res.json();
  }
  return {
    id,
    fileName: 'exam-sample.pdf',
    status: 'processed',
    laboratory: 'Lab Mock',
    examItems: [
      {
        code: 'GLU',
        name: 'Glucose',
        date: '2025-01-15',
        resultValue: '95',
        unit: 'mg/dL',
        referenceRange: '70-100',
        outOfRange: false,
        notes: null,
      },
      {
        code: 'CREAT',
        name: 'Creatinine',
        date: '2025-01-15',
        resultValue: '1.4',
        unit: 'mg/dL',
        referenceRange: '0.7-1.2',
        outOfRange: true,
        notes: null,
      },
      {
        code: 'ALT',
        name: 'ALT',
        date: '2025-01-15',
        resultValue: '62',
        unit: 'U/L',
        referenceRange: '7-56',
        outOfRange: true,
        notes: null,
      },
    ],
  };
}

/** POST /v1/documents - multipart upload */
export async function uploadDocument(file: { uri: string; name: string }): Promise<DocumentSummary> {
  if (useRealApi()) {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: 'application/pdf',
    } as any);
    const res = await fetch(`${API_BASE}/v1/documents`, {
      method: 'POST',
      headers: headers(true) as Record<string, string>,
      body: formData,
    });
    if (!res.ok) throw new Error(`uploadDocument: ${res.status}`);
    return res.json();
  }
  return {
    id: 'mock-doc-new',
    fileName: file.name,
    status: 'pending',
    totalItems: null,
    outOfRangeItems: null,
    createdAt: new Date().toISOString(),
  };
}

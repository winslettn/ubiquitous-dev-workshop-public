import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/config';

type Status = 'new' | 'reviewing' | 'approved' | 'declined' | 'fulfilled';

interface Note {
  noteId: number;
  note: string;
}

interface ProductRequest {
  productRequestId: number;
  reference: string;
  contactEmail: string;
  itemName: string;
  description: string;
  preferredBrandModel: string | null;
  targetPrice: number | null;
  status: Status;
  productId: number | null;
  notes?: Note[];
}

const NEXT_STATUSES: Record<Status, Status[]> = {
  new: ['reviewing', 'declined'],
  reviewing: ['approved', 'declined'],
  approved: ['fulfilled', 'declined'],
  declined: ['reviewing'],
  fulfilled: [],
};

const TOKEN_KEY = 'staffToken';

export default function AdminProductRequests() {
  const { isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '');
  const [tokenInput, setTokenInput] = useState('');
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [selected, setSelected] = useState<ProductRequest | null>(null);
  const [newNote, setNewNote] = useState('');
  const [productIdInput, setProductIdInput] = useState('');
  const [error, setError] = useState('');

  const base = `${api.baseURL}${api.endpoints.productRequests}`;
  const headers = useCallback((t: string) => ({ Authorization: `Bearer ${t}` }), []);

  const describeError = (e: unknown) => {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        return 'Staff authorization failed. Check your staff token.';
      }
      return e.response?.data?.error?.message ?? 'Request failed';
    }
    return 'Request failed';
  };

  const loadQueue = async (t: string = token) => {
    try {
      const { data } = await axios.get<ProductRequest[]>(base, { headers: headers(t) });
      setRequests(data);
      setError('');
    } catch (e) {
      setRequests([]);
      setError(describeError(e));
    }
  };

  const openRequest = async (id: number) => {
    try {
      const { data } = await axios.get<ProductRequest>(`${base}/${id}`, { headers: headers(token) });
      setSelected(data);
      setError('');
    } catch (e) {
      setError(describeError(e));
    }
  };

  const mutate = async (fn: () => Promise<unknown>, id: number) => {
    try {
      await fn();
      await openRequest(id);
      await loadQueue();
    } catch (e) {
      setError(describeError(e));
    }
  };

  const saveToken = async () => {
    const t = tokenInput.trim();
    if (!t) {return;}
    sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setTokenInput('');
    await loadQueue(t);
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const text = darkMode ? 'text-light' : 'text-gray-800';
  const card = `rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
  const input = `px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`;
  const btn = 'px-3 py-1 bg-primary hover:bg-accent text-white rounded transition-colors';

  return (
    <div className={`container mx-auto px-4 pt-20 pb-8 min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${text}`}>Product Requests</h1>

      <div className={`${card} mb-6 flex flex-wrap items-end gap-2`}>
        <div>
          <label htmlFor="staff-token" className={`block text-sm mb-1 ${text}`}>
            Staff token
          </label>
          <input
            id="staff-token"
            type="password"
            className={input}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
        </div>
        <button className={btn} onClick={saveToken}>
          Load queue
        </button>
        {token && (
          <button className={btn} onClick={() => loadQueue()}>
            Refresh
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={card}>
          <h2 className={`font-semibold mb-2 ${text}`}>Queue</h2>
          {requests.length === 0 ? (
            <p className={text}>No requests to show.</p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {requests.map((r) => (
                <li key={r.productRequestId} className="py-2 flex justify-between items-center">
                  <span className={text}>
                    {r.reference} - {r.itemName} <em>({r.status})</em>
                  </span>
                  <button className={btn} onClick={() => openRequest(r.productRequestId)}>
                    View {r.reference}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <div className={card} aria-label="Request details">
            <h2 className={`font-semibold mb-2 ${text}`}>{selected.itemName}</h2>
            <dl className={`text-sm space-y-1 ${text}`}>
              <div>Reference: {selected.reference}</div>
              <div>Status: {selected.status}</div>
              <div>Contact: {selected.contactEmail}</div>
              <div>Description: {selected.description}</div>
              {selected.preferredBrandModel && <div>Brand/model: {selected.preferredBrandModel}</div>}
              {selected.targetPrice !== null && <div>Target price: ${selected.targetPrice.toFixed(2)}</div>}
              <div>Linked product: {selected.productId ?? 'None'}</div>
            </dl>

            <div className="flex flex-wrap gap-2 mt-3">
              {NEXT_STATUSES[selected.status].map((s) => (
                <button
                  key={s}
                  className={btn}
                  onClick={() =>
                    mutate(
                      () => axios.put(`${base}/${selected.productRequestId}/status`, { status: s }, { headers: headers(token) }),
                      selected.productRequestId,
                    )
                  }
                >
                  Mark {s}
                </button>
              ))}
            </div>

            {selected.status === 'fulfilled' && (
              <div className="mt-3 flex gap-2 items-end">
                <div>
                  <label htmlFor="link-product-id" className={`block text-sm mb-1 ${text}`}>
                    Catalog product ID
                  </label>
                  <input
                    id="link-product-id"
                    className={input}
                    value={productIdInput}
                    onChange={(e) => setProductIdInput(e.target.value)}
                  />
                </div>
                <button
                  className={btn}
                  onClick={() =>
                    mutate(
                      () =>
                        axios.put(
                          `${base}/${selected.productRequestId}/product`,
                          { productId: Number(productIdInput) },
                          { headers: headers(token) },
                        ),
                      selected.productRequestId,
                    )
                  }
                >
                  Link product
                </button>
              </div>
            )}

            <h3 className={`font-semibold mt-4 mb-2 ${text}`}>Internal notes</h3>
            <ul className="space-y-2">
              {(selected.notes ?? []).map((n) => (
                <li key={n.noteId} className={`flex justify-between gap-2 ${text}`}>
                  <span>{n.note}</span>
                  <span className="space-x-2 whitespace-nowrap">
                    <button
                      className={btn}
                      onClick={() => {
                        const updated = window.prompt('Edit note', n.note);
                        if (updated && updated.trim()) {
                          mutate(
                            () =>
                              axios.put(
                                `${base}/${selected.productRequestId}/notes/${n.noteId}`,
                                { note: updated },
                                { headers: headers(token) },
                              ),
                            selected.productRequestId,
                          );
                        }
                      }}
                    >
                      Edit note
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      onClick={() =>
                        mutate(
                          () =>
                            axios.delete(`${base}/${selected.productRequestId}/notes/${n.noteId}`, {
                              headers: headers(token),
                            }),
                          selected.productRequestId,
                        )
                      }
                    >
                      Delete note
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2 items-end">
              <div className="flex-grow">
                <label htmlFor="new-note" className={`block text-sm mb-1 ${text}`}>
                  New note
                </label>
                <textarea
                  id="new-note"
                  className={`${input} w-full`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>
              <button
                className={btn}
                onClick={async () => {
                  await mutate(
                    () =>
                      axios.post(
                        `${base}/${selected.productRequestId}/notes`,
                        { note: newNote },
                        { headers: headers(token) },
                      ),
                    selected.productRequestId,
                  );
                  setNewNote('');
                }}
              >
                Add note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

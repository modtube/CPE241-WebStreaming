import { useEffect, useState, useCallback } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';

// =============================================================================
// Reviews.tsx — Admin Reviews View page
// เชื่อมกับ backend ที่ /api/reviews ทำได้: list, search, filter, pagination,
// delete, change status, sort (ผ่าน backend — sort ทั้ง dataset ก่อน paginate)
// =============================================================================

const API_BASE = 'http://localhost:5000';

// ---------- Types ----------
type ReviewStatus = 'Published' | 'Hidden' | 'Removed';

interface Review {
  review_id: string;
  user_id: string | null;
  username: string | null;
  movie_id: string;
  movie_title: string | null;
  rating: string;
  comment_text: string | null;
  post_time: string;
  post_status: ReviewStatus;
}

interface ReviewListResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Sortable columns (ตรงกับ ALLOWED_SORT_COLUMNS ใน backend)
type SortKey = 'review_id' | 'user_id' | 'movie_id' | 'post_status' | 'post_time';
type SortDir = 'asc' | 'desc';

// ---------- Helpers ----------
function statusBadgeColor(status: ReviewStatus): string {
  switch (status) {
    case 'Published':
      return 'bg-green-100 text-green-800';
    case 'Hidden':
      return 'bg-yellow-100 text-yellow-800';
    case 'Removed':
      return 'bg-red-100 text-red-800';
  }
}

// ---------- Component ----------
export default function Reviews() {
  // data
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // controls
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ReviewStatus>('');
  const [ratingFilter, setRatingFilter] = useState<string>(''); // '' | '5' | '4.5' | ...
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showRatingFilter, setShowRatingFilter] = useState(false);

  // sort
  const [sortKey, setSortKey] = useState<SortKey>('post_time');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // ui state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const limit = 20;

  // ---------- Fetch reviews ----------
  // เรียกทุกครั้งที่ filter / sort / page เปลี่ยน
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    params.set('sort_by', sortKey);
    params.set('sort_order', sortDir);
    if (statusFilter) params.set('post_status', statusFilter);
    if (ratingFilter) params.set('rating', ratingFilter);
    if (searchId.trim()) params.set('search_id', searchId.trim());

    fetch(`${API_BASE}/api/reviews?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ReviewListResponse>;
      })
      .then((data) => {
        setReviews(data.data);
        setTotal(data.total);
        setTotalPages(data.total_pages);
        setSelectedIds(new Set());
      })
      .catch((err) => {
        console.error('Failed to load reviews:', err);
        setError('โหลด review ไม่สำเร็จ — backend อาจไม่ได้รัน');
      })
      .finally(() => setLoading(false));
  }, [page, statusFilter, ratingFilter, searchId, sortKey, sortDir, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  // ---------- Sort logic ----------
  // คลิกที่ header → toggle 2 จังหวะ: asc ↔ desc
  // คลิก column ใหม่ → เริ่มต้นที่ asc
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else {
      // toggle ระหว่าง asc / desc
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    }
    setPage(1); // กลับไปหน้าแรกเสมอเมื่อเปลี่ยน sort
  };

  // ไอคอน sort
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDir === 'asc' ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    );
  };

  // ---------- Actions ----------

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`ยืนยันลบ ${selectedIds.size} review?`)) return;

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`${API_BASE}/api/reviews/${id}`, { method: 'DELETE' })
        )
      );
      reload();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('ลบไม่สำเร็จ');
    }
  };

  const handleCycleStatus = async (review: Review) => {
    const next: ReviewStatus =
      review.post_status === 'Published'
        ? 'Hidden'
        : review.post_status === 'Hidden'
        ? 'Removed'
        : 'Published';

    try {
      const res = await fetch(`${API_BASE}/api/reviews/${review.review_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_status: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReviews((prev) =>
        prev.map((r) => (r.review_id === review.review_id ? { ...r, post_status: next } : r))
      );
    } catch (err) {
      console.error('Update status failed:', err);
      alert('เปลี่ยน status ไม่สำเร็จ');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map((r) => r.review_id)));
    }
  };

  // ---------- Render ----------

  const startIdx = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  // sortable column header (ใช้ลูกศร)
  const SortableTh = ({ columnKey, label }: { columnKey: SortKey; label: string }) => (
    <th
      className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-100"
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <PageContainer>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Review Management</h2>
              <p className="text-sm text-gray-600 mt-1">View and manage user reviews</p>
            </div>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete ({selectedIds.size})
            </button>
          </div>

          {/* Search + Filter */}
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search by ID (V00001, U00001, M00001)..."
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setPage(1);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ReviewStatus | '');
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Hidden">Hidden</option>
              <option value="Removed">Removed</option>
            </select>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No reviews found</div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === reviews.length && reviews.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <SortableTh columnKey="review_id" label="ID" />
                    <SortableTh columnKey="user_id" label="User ID" />
                    <SortableTh columnKey="movie_id" label="Movie ID" />

                    {/* Rating — ใช้ funnel เพราะเป็น filter ไม่ใช่ sort */}
                    <th className="px-4 py-3 text-left relative">
                      <button
                        onClick={() => setShowRatingFilter((v) => !v)}
                        className="flex items-center space-x-1 select-none hover:text-blue-600"
                      >
                        <span>Rating</span>
                        <Filter
                          size={14}
                          className={ratingFilter ? 'text-blue-600' : 'text-gray-400'}
                        />
                      </button>
                      {/* Dropdown filter rating */}
                      {showRatingFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 w-32 normal-case">
                          {['', '5.0', '4.5', '4.0', '3.5', '3.0', '2.5', '2.0', '1.5', '1.0'].map(
                            (val) => (
                              <button
                                key={val || 'all'}
                                onClick={() => {
                                  setRatingFilter(val);
                                  setPage(1);
                                  setShowRatingFilter(false);
                                }}
                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                                  ratingFilter === val ? 'bg-blue-50 text-blue-600' : ''
                                }`}
                              >
                                {val === '' ? 'All ratings' : val}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </th>

                    <SortableTh columnKey="post_status" label="Status" />
                    <SortableTh columnKey="post_time" label="Post Time" />
                    <th className="px-4 py-3 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((r) => (
                    <tr key={r.review_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(r.review_id)}
                          onChange={() => toggleSelect(r.review_id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono">{r.review_id}</td>
                      <td className="px-4 py-3 font-mono">{r.user_id ?? '-'}</td>
                      <td className="px-4 py-3 font-mono">{r.movie_id}</td>
                      <td className="px-4 py-3">{r.rating}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleCycleStatus(r)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(
                            r.post_status
                          )} hover:opacity-80`}
                          title="คลิกเพื่อเปลี่ยน status"
                        >
                          {r.post_status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(r.post_time).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                        {r.comment_text ?? '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {startIdx} to {endIdx} of {total} results
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-3 py-1">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}

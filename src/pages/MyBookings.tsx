import { useState, useEffect, useMemo } from 'react';
import { Download } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Reveal } from '../components/Reveal';
import { Crumb, SectionHead, Tabs, money } from '../components/royale';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const PAGE_SIZE = 5;

const filterTabs = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const;
type FilterTab = (typeof filterTabs)[number];

/**
 * My Bookings — mockup PAGES.bookings.
 *
 * "Your Devotion" header with the "Book New Seva" CTA → `.bstat` counter
 * strip → `.tabs` status filter → `.brow` rows with the gold date block,
 * seva title, temple/time/ID line, status `.pill` and Marcellus amount.
 * Pagination, receipt download and auth handling are unchanged.
 */
export function MyBookings() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tab, setTab] = useState<FilterTab>('All');

  const fetchBookings = async (
    pageNumber: number,
    append = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(
        `api/bookings?page=${pageNumber}&pageSize=${PAGE_SIZE}`
      );

      const items = Array.isArray(response.data?.items) ? response.data.items : [];

      const mappedBookings = items.map((item: any) => ({
        id: item.bookingId || 'N/A',
        temple: item.temple || null,
        seva: item.offeringTitle || 'Seva',
        date: item.date || '',
        time: item.startTime || '',
        amount: item.totalAmount || 0,
        status:
          item.status === 'PAID'
            ? 'confirmed'
            : (item.status || 'created').toLowerCase()
      }));

      if (append) {
        setBookings((prev) => [...prev, ...mappedBookings]);
      } else {
        setBookings(mappedBookings);
      }

      setHasMore(items.length === PAGE_SIZE);
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
        'Failed to load bookings'
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    fetchBookings(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;

    fetchBookings(nextPage, true);
    setPage(nextPage);
  };

  const downloadReciept = async (bookingId: any) => {
    const response = await api.get(
      `api/bookings/receipts/${bookingId}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${bookingId}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /** Maps API status → mockup `.pill` variant + display label */
  const statusMeta = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
      case 'created':
        return { cls: '', label: 'Upcoming', group: 'Upcoming' };
      case 'completed':
        return { cls: 'grey', label: 'Completed', group: 'Completed' };
      case 'cancelled':
        return { cls: 'red', label: 'Cancelled', group: 'Cancelled' };
      default:
        return { cls: 'grey', label: status || 'Pending', group: 'Other' };
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter((b) => statusMeta(b.status).group === 'Upcoming').length,
    completed: bookings.filter((b) => statusMeta(b.status).group === 'Completed').length,
    offered: bookings.reduce((a, b) => a + (Number(b.amount) || 0), 0),
  }), [bookings]);

  const visible = useMemo(
    () => bookings.filter((b) => tab === 'All' || statusMeta(b.status).group === tab),
    [bookings, tab]
  );

  const dayOf = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit' }) : '--';
  const monthOf = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { month: 'short' }) : '';

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'My Bookings' }]} />

      <SectionHead
        tag="Your Devotion"
        title="My Bookings"
        lede="Every seva you have offered, with receipts, sankalpa videos and prasad tracking."
        right={
          <button className="btn-primary shimmer" onClick={() => navigate('/pujas-homas')}>
            Book New Seva
          </button>
        }
      />

      {!isLoggedIn ? (
        <div className="card flex flex-col items-center justify-center py-14 text-center">
          <p className="mb-5 text-lg text-muted-foreground">
            Please log in to view your bookings
          </p>
          <button className="btn-primary shimmer" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      ) : (
        <>
          <div className="bstat">
            <div><div className="n">{stats.total}</div><div className="l">Total Bookings</div></div>
            <div><div className="n">{stats.upcoming}</div><div className="l">Upcoming</div></div>
            <div><div className="n">{stats.completed}</div><div className="l">Completed</div></div>
            <div><div className="n">{money(stats.offered)}</div><div className="l">Total Offered</div></div>
          </div>

          <Tabs tabs={filterTabs} active={tab} onChange={setTab} />

          {loading ? (
            <div className="card mt-6 py-14 text-center text-muted-foreground">
              Loading bookings...
            </div>
          ) : visible.length === 0 ? (
            <div className="card mt-6 py-14 text-center text-muted-foreground">
              No bookings found
            </div>
          ) : (
            <Reveal>
              <div className="list">
                {visible.map((booking, i) => {
                  const meta = statusMeta(booking.status);
                  return (
                    <div
                      key={`${booking.id}-${i}`}
                      className="brow stagger-item"
                      style={{ animationDelay: `${(i % 6) * 0.06}s` }}
                    >
                      <div className="date">
                        <div className="d">{dayOf(booking.date)}</div>
                        <div className="m">{monthOf(booking.date)}</div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate">{booking.seva}</h4>
                        <p className="truncate">
                          {[booking.temple, booking.time, booking.id].filter(Boolean).join(' · ')}
                        </p>
                        <button
                          onClick={() => downloadReciept(booking.id)}
                          className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-soft transition-colors hover:text-foreground"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Receipt
                        </button>
                      </div>

                      <div className="brow-end text-right">
                        <span className={`pill ${meta.cls}`}>{meta.label}</span>
                        <div className="serif mt-2 text-gold-soft">{money(booking.amount)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          )}

          {hasMore && !loading && (
            <div className="mt-6 flex justify-center">
              <button className="btn-ghost" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}

import { CheckCircle, Download, Calendar, MapPin } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';

export function BookingConfirmation() {

  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state?.booking;

  if (!bookingData) {
    return (
      <PageShell>
        <div className="card py-12 text-center text-muted-foreground">
          Booking details not found.
        </div>
      </PageShell>
    );
  }

  const downloadReciept = async (bookingId: any) => {
    try {
      const response = await api.get(`api/bookings/receipts/${bookingId}`,
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
    } catch (error) {
      alert("Unable to download receipt. Please try again.");
    }
  };

  return (
    <PageShell showFooter={false}>
      {/* ===== Success ticket — mockup `.ticket` treatment ===== */}
      <div className="mx-auto max-w-[560px] py-6 text-center">
        <div className="relative mx-auto mb-6 inline-block">
          <div className="absolute inset-0 animate-ping rounded-full bg-success/20 opacity-75" />
          <div className="glow-gold relative grid h-[104px] w-[104px] place-items-center rounded-full border border-gold/30 bg-surface">
            <CheckCircle className="h-14 w-14 text-success" />
          </div>
        </div>

        <h1 className="page-title text-success">Booking Confirmed</h1>
        <p className="lede mx-auto mt-2 text-center">
          Your {bookingData.type === 'specialpuja' ? 'Special Puja' : 'Seva'} has been successfully
          booked. The sankalpa will be offered in your name.
        </p>

        {/* Booking Details Card */}
        <div className="card shimmer mt-8 text-left">
          <div className="mb-2 border-b border-dashed border-gold-deep pb-5 text-center">
            <span className="tag" style={{ marginBottom: 4 }}>Booking ID</span>
            <h2 className="serif text-[24px] text-gold-soft">{bookingData?.bookingId}</h2>
          </div>

          {bookingData?.type == 'seva' && (
            <>
              <div className="row">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-soft" /> Temple
                </span>
                <span>{bookingData?.offering?.providerTemple?.name}</span>
              </div>

              <div className="row">
                <span>✨ Seva</span>
                <span>{bookingData?.offering?.name}</span>
              </div>
            </>
          )}

          {bookingData?.type == "specialpuja" && (
            <div className="row">
              <span>✨ Special Puja</span>
              <span>{bookingData?.offering?.name}</span>
            </div>
          )}

          <div className="row">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold-soft" /> Date &amp; Time
            </span>
            <span>
              {new Date(bookingData?.date).toLocaleDateString()} · {bookingData?.slot?.start_time}
            </span>
          </div>

          <button
            className="btn-ghost mt-5 block w-full"
            onClick={() => downloadReciept(bookingData?.bookingId)}
          >
            <span className="flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button className="btn-ghost flex-1" onClick={() => navigate('/home')}>
            Go to Home
          </button>
          <button className="btn-primary shimmer flex-1" onClick={() => navigate('/my-bookings')}>
            My Bookings
          </button>
        </div>
      </div>
    </PageShell>
  );
}

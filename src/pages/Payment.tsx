
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { api } from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Crumb, money } from '../components/royale';
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

export function Payment() {
  
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state?.booking;
  const offering = bookingData?.offering;

  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  if (!bookingData) {
    return (
      <PageShell>
        <div className="card py-12 text-center text-muted-foreground">
          Invalid booking details.
        </div>
      </PageShell>
    );
  }

  const addonAmount =
  bookingData?.addonDetails?.reduce(
    (sum: number, addon: any) =>
      sum + addon.price * addon.quantity,
    0
  ) || 0;

  const subtotal =  (offering?.price || 0) + addonAmount;

  const serviceFee = subtotal * 0.01;
  const total = subtotal + serviceFee;

  const handlePayment = (internalOrderRespnse: any) => {
    const options = {
      key: razorpayKey,
      order_id: internalOrderRespnse.paymentOrderID,

      name: "Book My Temples",
      description: offering?.seva?.name,

      handler: async function (response: any) {
        sessionStorage.removeItem("specialPujaDraft")
        setVerifyingPayment(true);
        try {
          await api.post("api/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          setVerifyingPayment(false);

          navigate('/booking-confirmation', {
            state: {
              booking: {
                ...bookingData,
                bookingId: internalOrderRespnse.bookingId
              }
            }
          });
        }finally{
          setVerifyingPayment(false);
        }
        setLoading(false);
      },

      theme: {
        color: "var(--color-gold)",
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.on("payment.failed", function (response: any) {
      const reason = response?.error?.reason;

      if (reason === "payment_cancelled") {
        setLoading(false);
        return;
      }

      alert(response.error.description || "Payment failed. Please try again.");
      setLoading(false);
    });

    razorpay.open();
  };

  const createOrderId = () => {
    if (loading) return;

    setLoading(true);

    const payload = {
      offeringId: offering?.id,
      scheduleId: bookingData?.slot?.scheduleId,
      scheduleModeId: bookingData?.scheduleModeId,
      participantOptionId: bookingData?.participantOptionId,
      participants: Array.isArray(bookingData?.devoteeDetails)
        ? bookingData.devoteeDetails
            .filter(Boolean)
            .map((participant: any) => ({
              familyMemberId: participant.id
            }))
        // Seva bookings store the actual selected family members under
        // `participantDetails` (devoteeDetails there is the unrelated
        // name/nakshatra/gotra/occasion object) — fall back to that so
        // seva bookings send real participants too instead of silently
        // sending an empty array.
        : Array.isArray(bookingData?.participantDetails)
          ? bookingData.participantDetails
              .filter(Boolean)
              .map((participant: any) => ({
                familyMemberId: participant.id
              }))
          : [],
      addons: Array.isArray(bookingData?.addonDetails)
        ? bookingData.addonDetails
            .filter(Boolean)
            .map((addOn: any) => ({
              addonId: addOn.addonId,
              quantity: addOn.quantity
            }))
        : [],
    };

    // TEMP DEBUG: log exactly what's being sent, so a failed booking
    // creation can be compared side-by-side against a working one.
    console.log('[createOrderId] POST api/bookings payload:', payload);

    api.post(`api/bookings`, payload)
      .then(response => {
        handlePayment(response.data);
      })
      .catch((err) => {
        // TEMP DEBUG: surface the real backend rejection instead of a
        // generic message, so the actual validation error is visible.
        console.error('[createOrderId] api/bookings failed:', err?.response?.status, err?.response?.data);
        alert(
          err?.response?.data?.message ||
          err?.response?.data?.title ||
          JSON.stringify(err?.response?.data) ||
          'Please try after sometime'
        );
        setLoading(false);
      });
  };

  return (
    <PageShell>
      
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'My Bookings', to: '/my-bookings' },
          { label: 'Payment' },
        ]}
      />

      <h1 className="page-title">Booking Summary &amp; Payment</h1>

      <div className="stepper">
        <div className="st"><b>1</b>Date &amp; Time</div>
        <div className="bar" />
        <div className="st"><b>2</b>Details</div>
        <div className="bar" />
        <div className="st on"><b>3</b>Payment</div>
      </div>

      <div className="mt-6">
        {/* Booking Summary */}
        <div className="card mb-[18px]">
          <span className="tag">Booking Summary</span>

          <div>
            <div className="row">
              <span>Seva</span>
              <span>{bookingData?.offering?.name}</span>
            </div>
            <div className="row">
              <span>Date</span>
              <span>
                {new Date(bookingData?.date).toLocaleDateString()}
              </span>
            </div>
            <div className="row">
              <span>Time</span>
              <span>{bookingData?.slot?.start_time || bookingData?.slot?.startTime}</span>
            </div>
            
            {bookingData?.devoteeDetails?.length > 0 && (
              <div className="row">
                <span>
                  Family Members
                </span>

                <div className="text-right">
                  {bookingData.devoteeDetails.map((member: any) => (
                    <div key={member?.id}>
                      {member?.firstName} {member?.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookingData?.participantDetails?.length > 0 && (
              <div className="row">
                <span>
                  Family Members
                </span>

                <div className="text-right">
                  {bookingData.participantDetails.map((member: any) => (
                    <div key={member?.id}>
                      {member?.firstName} {member?.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookingData?.addonDetails?.length > 0 && (
              <>
                <div className="divider" />
                <span className="tag">Add-ons</span>

                {bookingData.addonDetails.map((addon: any) => (
                  <div key={addon?.addonId} className="row">
                    <span>
                      {addon?.name}
                      {addon?.quantity > 0 ? ` x ${addon?.quantity}` : ''}
                    </span>

                    <span>
                      {money(Number((addon?.price * addon?.quantity).toFixed(2)))}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="divider" />

          <div>
            <div className="row">
              <span>Seva Amount</span>
              <span>{money(Number(offering?.price ?? 0))}</span>
            </div>

            <div className="row">
              <span>Platform Fee</span>
              <span>{money(Number(serviceFee.toFixed(2)))}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-4">
            <span className="text-[13.5px] text-muted-foreground">Total payable</span>
            <span className="serif text-2xl text-gold-soft">
              {money(Number(total.toFixed(2)))}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 z-30 -mx-[var(--gutter)] mt-8 border-t border-border bg-background/95 px-[var(--gutter)] py-4 backdrop-blur">
        <div className="mx-auto max-w-md">
          <Button
            fullWidth
            onClick={createOrderId}
            disabled={loading}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay {money(Number(total.toFixed(2)))}
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

      {verifyingPayment && (
        <>
          {/* Background */}
          <div className="fixed inset-0 bg-black/30 z-[999]" />

          {/* Card */}
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
            <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl p-6 text-center">
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-gold-soft" />

              <h3 className="mt-5 text-lg font-semibold text-gold-soft">
                Verifying Payment
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we confirm your payment.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Do not press back or close the app.
              </p>
            </div>
          </div>
        </>
      )}

    </PageShell>
  );
}

// import { useState } from 'react';
// import { Loader2 } from 'lucide-react';
// import { Button } from '../components/Button';
// import { api } from '../api/client';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { PageShell } from '../components/PageShell';
// import { Crumb, money } from '../components/royale';
// const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

// export function Payment() {
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   const bookingData = location.state?.booking;
//   const offering = bookingData?.offering;

//   const [loading, setLoading] = useState(false);
//   const [verifyingPayment, setVerifyingPayment] = useState(false);

//   if (!bookingData) {
//     return (
//       <PageShell>
//         <div className="card py-12 text-center text-muted-foreground">
//           Invalid booking details.
//         </div>
//       </PageShell>
//     );
//   }

//   const addonAmount =
//   bookingData?.addonDetails?.reduce(
//     (sum: number, addon: any) =>
//       sum + addon.price * addon.quantity,
//     0
//   ) || 0;

//   const subtotal =  (offering?.price || 0) + addonAmount;

//   const serviceFee = subtotal * 0.01;
//   const total = subtotal + serviceFee;

//   const handlePayment = (internalOrderRespnse: any) => {
//     const options = {
//       key: razorpayKey,
//       order_id: internalOrderRespnse.paymentOrderID,

//       name: "Book My Temples",
//       description: offering?.seva?.name,

//       handler: async function (response: any) {
//         sessionStorage.removeItem("specialPujaDraft")
//         setVerifyingPayment(true);
//         try {
//           await api.post("api/payments/verify", {
//             razorpayOrderId: response.razorpay_order_id,
//             razorpayPaymentId: response.razorpay_payment_id,
//             razorpaySignature: response.razorpay_signature,
//           });

//           setVerifyingPayment(false);

//           navigate('/booking-confirmation', {
//             state: {
//               booking: {
//                 ...bookingData,
//                 bookingId: internalOrderRespnse.bookingId
//               }
//             }
//           });
//         }finally{
//           setVerifyingPayment(false);
//         }
//         setLoading(false);
//       },

//       theme: {
//         color: "var(--color-gold)",
//       },

//       modal: {
//         ondismiss: function () {
//           setLoading(false);
//         }
//       }
//     };

//     const razorpay = new (window as any).Razorpay(options);

//     razorpay.on("payment.failed", function (response: any) {
//       const reason = response?.error?.reason;

//       if (reason === "payment_cancelled") {
//         setLoading(false);
//         return;
//       }

//       alert(response.error.description || "Payment failed. Please try again.");
//       setLoading(false);
//     });

//     razorpay.open();
//   };

//   const createOrderId = () => {
//     if (loading) return;

//     setLoading(true);

//     api.post(`api/bookings`, {
//       offeringId: offering?.id,
//       scheduleId: bookingData?.slot?.scheduleId,
//       scheduleModeId: bookingData?.scheduleModeId,
//       participantOptionId: bookingData?.participantOptionId,
//       participants: Array.isArray(bookingData?.devoteeDetails)
//       ? bookingData.devoteeDetails
//           .filter(Boolean)
//           .map((participant: any) => ({
//             familyMemberId: participant.id
//           }))
//       : [],
//       addons: Array.isArray(bookingData?.addonDetails)
//         ? bookingData.addonDetails
//             .filter(Boolean)
//             .map((addOn: any) => ({
//               addonId: addOn.addonId,
//               quantity: addOn.quantity
//             }))
//         : [],
//       })
//       .then(response => {
//         handlePayment(response.data);
//       })
//       .catch(() => {
//         alert('Please try after sometime');
//         setLoading(false);
//       });
//   };

//   return (
//     <PageShell>
      
//       <Crumb
//         parts={[
//           { label: 'Home', to: '/home' },
//           { label: 'My Bookings', to: '/my-bookings' },
//           { label: 'Payment' },
//         ]}
//       />

//       <h1 className="page-title">Booking Summary &amp; Payment</h1>

//       <div className="stepper">
//         <div className="st"><b>1</b>Date &amp; Time</div>
//         <div className="bar" />
//         <div className="st"><b>2</b>Details</div>
//         <div className="bar" />
//         <div className="st on"><b>3</b>Payment</div>
//       </div>

//       <div className="mt-6">
//         {/* Booking Summary */}
//         <div className="card mb-[18px]">
//           <span className="tag">Booking Summary</span>

//           <div>
//             <div className="row">
//               <span>Seva</span>
//               <span>{bookingData?.offering?.name}</span>
//             </div>
//             <div className="row">
//               <span>Date</span>
//               <span>
//                 {new Date(bookingData?.date).toLocaleDateString()}
//               </span>
//             </div>
//             <div className="row">
//               <span>Time</span>
//               <span>{bookingData?.slot?.start_time || bookingData?.slot?.startTime}</span>
//             </div>
            
//             {bookingData?.devoteeDetails?.length > 0 && (
//               <div className="row">
//                 <span>
//                   Family Members
//                 </span>

//                 <div className="text-right">
//                   {bookingData.devoteeDetails.map((member: any) => (
//                     <div key={member?.id}>
//                       {member?.firstName} {member?.lastName}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {bookingData?.addonDetails?.length > 0 && (
//               <>
//                 <div className="divider" />
//                 <span className="tag">Add-ons</span>

//                 {bookingData.addonDetails.map((addon: any) => (
//                   <div key={addon?.addonId} className="row">
//                     <span>
//                       {addon?.name}
//                       {addon?.quantity > 0 ? ` x ${addon?.quantity}` : ''}
//                     </span>

//                     <span>
//                       {money(Number((addon?.price * addon?.quantity).toFixed(2)))}
//                     </span>
//                   </div>
//                 ))}
//               </>
//             )}
//           </div>

//           <div className="divider" />

//           <div>
//             <div className="row">
//               <span>Seva Amount</span>
//               <span>{money(Number(offering?.price ?? 0))}</span>
//             </div>

//             <div className="row">
//               <span>Platform Fee</span>
//               <span>{money(Number(serviceFee.toFixed(2)))}</span>
//             </div>
//           </div>

//           <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-4">
//             <span className="text-[13.5px] text-muted-foreground">Total payable</span>
//             <span className="serif text-2xl text-gold-soft">
//               {money(Number(total.toFixed(2)))}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Action */}
//       <div className="sticky bottom-0 z-30 -mx-[var(--gutter)] mt-8 border-t border-border bg-background/95 px-[var(--gutter)] py-4 backdrop-blur">
//         <div className="mx-auto max-w-md">
//           <Button
//             fullWidth
//             onClick={createOrderId}
//             disabled={loading}
//           >
//             <span className="flex items-center justify-center gap-2">
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   Pay {money(Number(total.toFixed(2)))}
//                 </>
//               )}
//             </span>
//           </Button>
//         </div>
//       </div>

//       {verifyingPayment && (
//         <>
//           {/* Background */}
//           <div className="fixed inset-0 bg-black/30 z-[999]" />

//           {/* Card */}
//           <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
//             <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl p-6 text-center">
//               <Loader2 className="w-10 h-10 mx-auto animate-spin text-gold-soft" />

//               <h3 className="mt-5 text-lg font-semibold text-gold-soft">
//                 Verifying Payment
//               </h3>

//               <p className="mt-2 text-sm text-muted-foreground">
//                 Please wait while we confirm your payment.
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Do not press back or close the app.
//               </p>
//             </div>
//           </div>
//         </>
//       )}

//     </PageShell>
//   );
// }
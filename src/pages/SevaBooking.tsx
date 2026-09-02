// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams, useLocation, useNavigationType } from 'react-router-dom';
// import { Calendar, Clock } from 'lucide-react';
// import { Button } from '../components/Button';
// import { api } from '../api/client';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { PageShell } from '../components/PageShell';
// import { Crumb, money } from '../components/royale';

// type ParticipantOption = {
//   participantOptionId: number;
//   name: string;
//   participantCount: number;
//   price: number;
//   isDefault: boolean;
// };

// type Addon = {
//   addonId: number;
//   name: string;
//   description: string;
//   price: number;
//   maxQuantity: number;
// };

// type Mode = {
//   scheduleModeId: number;
//   mode: string;
//   availableCapacity: number | null;
//   participantOptions: ParticipantOption[];
//   addons: Addon[];
// };

// type Slot = {
//   scheduleId: number;
//   date: string;
//   slot: string;
//   start_time: string;
//   availableCapacity: number | null;
//   modes: Mode[];
// };

// // Converts a 24-hour hour/minute pair into a "h:mm AM/PM" label.
// // Built from the already-parsed numeric hours/minutes rather than
// // string-slicing the raw "HH:mm:ss" value, so it's correct regardless
// // of whether the hour has a leading zero (e.g. 17:00 -> "5:00 PM",
// // 07:30 -> "7:30 AM").
// const formatTime12 = (hours: number, minutes: number) => {
//   const period = hours >= 12 ? 'PM' : 'AM';
//   const hour12 = hours % 12 === 0 ? 12 : hours % 12;
//   return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
// };

// // item.startTime isn't guaranteed to be a clean "HH:mm:ss" string — it may
// // come through as "07:30 AM", "7:30:00 AM", etc. Splitting on ':' and
// // calling Number() on the raw pieces breaks the moment anything trails the
// // minutes (e.g. Number("30 AM") -> NaN). This pulls out just the leading
// // hour/minute digits and ignores everything else.
// const parseTimeParts = (timeStr: string): [number, number] => {
//   const str = (timeStr ?? '').trim();
//   const match = /^(\d{1,2}):(\d{1,2})/.exec(str);
//   if (!match) return [0, 0];

//   let hours = Number(match[1]);
//   const minutes = Number(match[2]);

//   // If the source string already carries an AM/PM marker, trust it and
//   // normalize to 24-hour so formatTime12 (which expects 24-hour input)
//   // reformats it correctly. If there's no marker, treat the hour as
//   // already being 24-hour.
//   const meridiem = /\b(am|pm)\b/i.exec(str)?.[1]?.toLowerCase();
//   if (meridiem === 'pm' && hours < 12) hours += 12;
//   if (meridiem === 'am' && hours === 12) hours = 0;

//   return [hours, minutes];
// };

// export function SevaBooking() {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { sevaId } = useParams();
//   // Distinguishes a fresh visit (PUSH — clicking the seva from a list)
//   // from browser Back/Forward (POP). The saved draft should only be
//   // restored on POP; otherwise a leftover draft from a previous booking
//   // attempt would make Select Participants (and the picked date/slot)
//   // appear immediately on what the user expects to be a blank form.
//   const navigationType = useNavigationType();

//   const modeSectionRef = useRef<HTMLDivElement>(null);
//   const participentSectionRef = useRef<HTMLDivElement>(null);

//   const [availableDates, setAvailableDates] = useState<Date[]>([]);
//   const [allSchedules, setAllSchedules] = useState<any[]>([]);

//   if (!sevaId) {
//     return (
//       <PageShell>
//         <div className="card py-12 text-center text-muted-foreground">
//           Invalid Seva
//         </div>
//       </PageShell>
//     );
//   }

//   const [selectedDate, setSelectedDate] = useState('');
//   const [name] = useState('');
//   const [nakshatra] = useState('');
//   const [gotra] = useState('');
//   const [occasion] = useState('');
//   const [slotsList, setSlotsList] = useState<Slot[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

//   const [seva, setSeva] = useState<any>(null);
//   const [loadingSeva, setLoadingSeva] = useState(false);

//   const [defaultDuration] = useState<any>('30 Min');

//   const [familyMembers, setFamilyMembers] = useState<any[]>([]);
//   const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

//   const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

//   const [selectedParticipantOption, setSelectedParticipantOption] =
//     useState<ParticipantOption | null>(null);

//   const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
//   // Unlike special-puja, a seva's add-ons live on their own endpoint
//   // (GET /api/sevas/{id}/addons) — not nested inside schedule modes — so
//   // they're fetched once, independent of mode/slot selection.
//   const [sevaAddons, setSevaAddons] = useState<Addon[]>([]);

//   const [hasAddress, setHasAddress] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if(!token){
//       navigate('/login');
//       return;
//     }
//     const storedProfileCompleted =
//     localStorage.getItem("profileCompleted") === "true";
//     if(!storedProfileCompleted){
//       navigate('/profile-details');
//       return;
//     }
//     setLoadingSeva(true);
//     api.get(`api/sevas/${sevaId}`)
//       .then((response) => {
//         const item = response.data;
//          setSeva({
//           id: item.id,
//           name: item.title,
//           description: item.description,
//           // Different seva records have been seen using different field
//           // names for the base price (basePrice vs price vs cost) — try
//           // them in order instead of assuming one, so a naming mismatch
//           // doesn't silently produce a 0 amount at checkout.
//           price: item.basePrice ?? item.price ?? item.cost ?? 0,
//           duration: item.duration || defaultDuration,
//           image: item.profileImageUrl,
//           maxParticipants: item.maxParticipants,
//           providerTemple: item.provider?.name,
//           conductedBy: item.provider?.name,
//           locationCity: item.location?.city,
//           googleMaps: item.location?.googleMapsUrl,
//         });

//         api.get('api/user/family')
//           .then((res) => {
//             setFamilyMembers(res.data);
//           })
//           .catch(console.error);

//         api.get(`api/sevas/${sevaId}/addons`)
//           .then((res) => {
//             setSevaAddons(res.data ?? []);
//           })
//           .catch(() => {
//             setSevaAddons([]);
//           });

//         // const draft = sessionStorage.getItem("sevaDraft");
//                 const draft =
//           navigationType === "POP"
//             ? sessionStorage.getItem("sevaDraft")
//             : null;

//         if (draft) {
//           const state = JSON.parse(draft);
//           setSelectedDate(state.selectedDate || '');
//           setSelectedSlot(state.selectedSlot || null);
//           setSelectedMode(state.selectedMode || null);
//           setSelectedParticipantOption(
//             state.selectedParticipantOption || null
//           );
//           setSelectedParticipants(state.selectedParticipants || []);
//           setSelectedAddons(state.selectedAddons || []);
//         }

//         api.get("api/user/address")
//           .then((res) => {
//             const d = Array.isArray(res.data)
//               ? (res.data[0] || {})
//               : (res.data || {});
//             setHasAddress(!!d.addressLine1);
//           })
//           .catch(() => {
//             setHasAddress(false);
//           });
//       })
//       .catch(() => {
//         setLoadingSeva(false);
//       })
//       .finally(() => {
//         setLoadingSeva(false);
//       });

//   }, []);

//   useEffect(() => {
//     setLoadingSeva(true);
//     api.get(`api/sevas/${sevaId}/schedules`)
//       .then((response) => {
//         const data = response.data ?? [];
//         setAllSchedules(data);
//         setAvailableDates(data.map((item: any) => new Date(item.date)));
//       })
//       .catch(() => {
//         setLoadingSeva(false);
//       })
//       .finally(() => {
//         setLoadingSeva(false);
//       });

//   }, []);

//   useEffect(() => {
//     if (!selectedDate) {
//       setSlotsList([]);
//       return;
//     }

//     const selectedDay = allSchedules.find(
//       (item: any) => item.date === selectedDate
//     );

//     const result = (selectedDay?.schedules ?? []).map((item: any, i: number) => {
//       const [hours, minutes] = parseTimeParts(item.startTime);

//       const offsetDuration =
//         item.duration || Number(defaultDuration.split(' ')[0]);

//       const endDate = new Date();
//       endDate.setHours(hours, minutes + offsetDuration, 0, 0);

//       const endHours = endDate.getHours();
//       const endMinutes = endDate.getMinutes();

//       const startLabel = formatTime12(hours, minutes);
//       const endLabel = formatTime12(endHours, endMinutes);

//       return {
//         scheduleId: item.scheduleId,
//         date: selectedDate,
//         slot: `${startLabel} - ${endLabel}`,
//         start_time: startLabel,
//         availableCapacity: item.availableCapacity,
//         modes: item.modes || [],
//         un_id: i + Date.now(),
//       };
//     });

//     setSlotsList(result);
//     setSelectedSlot(null); // Reset previously selected slot
//     setSelectedMode(null);
//     setSelectedParticipantOption(null);
//     setSelectedAddons([]);
//   }, [selectedDate, allSchedules]);

//   const handleParticipantChange = (index: number, familyMemberId: string) => {
//     const member = familyMembers.find(x => String(x.id) === familyMemberId);

//     setSelectedParticipants(prev => {
//       const updated = [...prev];
//       updated[index] = member;
//       return updated.filter(Boolean);
//     });
//   };

//   const handleAddonQuantityChange = (addon: any, quantity: number) => {
//     if (quantity <= 0) {
//       setSelectedAddons(prev =>
//         prev.filter(x => x.addonId !== addon.addonId)
//       );
//       return;
//     }

//     setSelectedAddons(prev => {
//       const existing = prev.find(
//         x => x.addonId === addon.addonId
//       );

//       if (existing) {
//         return prev.map(x =>
//           x.addonId === addon.addonId
//             ? { ...x, quantity }
//             : x
//         );
//       }

//       return [
//         ...prev,
//         {
//           ...addon,
//           quantity
//         }
//       ];
//     });
//   };

//   const getAddonQuantity = (addonId: number) =>
//     selectedAddons.find(x => x.addonId === addonId)?.quantity || 0;

//   const participantPrice = selectedParticipantOption?.price ?? seva?.price ?? 0;
//   const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price * addon.quantity, 0);
//   const totalPrice = participantPrice + addonPrice;

//   const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
//     if (!ref.current) return;

//     const y =
//       ref.current.getBoundingClientRect().top +
//       window.pageYOffset -
//       90;

//     window.scrollTo({
//       top: y,
//       behavior: "smooth",
//     });
//   };

//   const handleContinue = () => {
//     if (!selectedDate || !selectedSlot) return;
//     if (selectedSlot.modes.length > 0 && !selectedMode) return;

//     const bookingData = {
//       type: 'seva',

//       offering: {
//         id: seva.id,
//         name: seva.name,
//         description: seva.description,
//         // Base price only — NOT totalPrice. The payment page adds up
//         // addonDetails separately for its own "Add-ons" line item, so
//         // baking addonPrice into offering.price here double-counts it
//         // in the grand total.
//         price: participantPrice,
//         duration: seva.duration,
//         image: seva.image,
//         maxParticipants: seva.maxParticipants,
//         providerTemple: seva.providerTemple
//       },

//       date: selectedDate,
//       slot: selectedSlot,

//       mode: selectedMode
//         ? {
//             scheduleModeId: selectedMode.scheduleModeId,
//             mode: selectedMode.mode
//           }
//         : null,

//       scheduleModeId: selectedMode?.scheduleModeId,
//       participantOptionId: selectedParticipantOption?.participantOptionId,

//       participantOption: selectedParticipantOption,

//       devoteeDetails: {
//         name,
//         nakshatra,
//         gotra,
//         occasion
//       },

//       participantDetails: selectedParticipants,

//       addonDetails: selectedAddons,

//       totalPrice
//     };

//     // Persist the in-progress selections before leaving this page — if the
//     // user hits browser Back from /payment (or anywhere downstream), the
//     // restore-on-mount logic above puts them right back where they left off
//     // instead of resetting to a blank form.
//     sessionStorage.setItem(
//       "sevaDraft",
//       JSON.stringify({
//         selectedDate,
//         selectedSlot,
//         selectedMode,
//         selectedParticipantOption,
//         selectedParticipants,
//         selectedAddons,
//       })
//     );

//     navigate('/payment', {
//       state: {
//         booking: bookingData
//       }
//     });
//   };

//   const formatLocalDate = (date: Date) =>
//   `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//   const continueDisabled =
//     !selectedDate ||
//     !selectedSlot ||
//     (selectedSlot.modes.length > 0 && !selectedMode);

//   // A seva may not have `modes` populated at all (participantOptions only
//   // exist nested inside modes) — but the family member fetch is
//   // unconditional (api/user/family), so Select Participants should always
//   // be shown once a slot (and mode, if the slot has one) is chosen —
//   // not hidden behind a maxParticipants check.
//   const hasModes = !!selectedSlot && selectedSlot.modes.length > 0;
//     // Falls back through: mode's participant option -> seva's own
//   // maxParticipants -> however many family members exist (so the reveal
//   // never gets stuck at 1 dropdown even if a seva is missing this field).

//   const effectiveParticipantCount =
//     // selectedParticipantOption?.participantCount ?? seva?.maxParticipants ?? 1;
//       selectedParticipantOption?.participantCount ??
//     seva?.maxParticipants ??
//     (familyMembers.length + 1);

//   const showParticipantSection =
//     !!selectedSlot && (hasModes ? !!selectedMode : true);

//   // Reveal family-member dropdowns one at a time: start with a single
//   // dropdown, and only show the next one once the current one has a
//   // selection. If the seva/mode reports it needs more than 1 participant,
//   // cap at that; otherwise always allow at least 1 optional companion slot.
//   const requiredParticipantCount = Math.max(effectiveParticipantCount - 1, 1);
//   const filledParticipantCount = selectedParticipants.filter(Boolean).length;
//   const visibleParticipantSlots = Math.min(
//     filledParticipantCount + 1,
//     requiredParticipantCount
//   );

//   return (
//     <PageShell>
      
//       <Crumb
//         parts={[
//           { label: 'Home', to: '/home' },
//           { label: 'Temples', to: '/temples' },
//           { label: 'Book Seva' },
//         ]}
//       />

//       <h1 className="page-title">Seva Booking</h1>

//       {/* Progress Steps — mockup `.stepper` */}
//       <div className="stepper">
//         <div className="st on"><b>1</b>Date &amp; Time</div>
//         <div className="bar" />
//         <div className="st"><b>2</b>Details</div>
//         <div className="bar" />
//         <div className="st"><b>3</b>Payment</div>
//       </div>

//       <div className="mt-6">
//         {/* Seva Summary */}
//         <div className="card mb-[18px]">
//           {loadingSeva && 
//             <div>Loading</div>
//           }
//           {seva && 
//             <div>
//               <div className="mb-3 flex items-start justify-between gap-4">
//                 <h3 className="serif text-[20px]">{seva.name}</h3>
//                 <span className="serif shrink-0 text-[20px] text-gold-soft">{money(seva.price)}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mb-2">
//                 <span className="text-muted-foreground">{seva.description}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <small>{seva.duration}</small>
//                 </div>
//                 <div>
//                 </div>
//               </div>
//             </div>
//           }
//         </div>

//         {/* Event Details */}
//         {/* {seva && (seva.conductedBy || seva.locationCity) && (
//           <div className="card mb-[18px]">
//             <span className="tag">Event Details</span>

//             <div className="space-y-4">
//               {seva.conductedBy && (
//                 <div>
//                   <p className="text-xs text-muted-foreground mb-1">Conducted By</p>
//                   <p className="text-sm">{seva.conductedBy}</p>
//                 </div>
//               )}

//               {seva.locationCity && (
//                 <div>
//                   <div className="flex items-center justify-between mb-1">
//                     <p className="text-xs text-muted-foreground">Location</p>
//                     {seva.googleMaps && (
//                       <a
//                         href={seva.googleMaps}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="bg-surface shadow-lg px-3 py-2 rounded-full text-xs font-medium text-gold-soft whitespace-nowrap"
//                       >
//                         Open Maps →
//                       </a>
//                     )}
//                   </div>
//                   <p className="text-sm font-medium">{seva.locationCity}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )} */}

        
//           <div className="space-y-6">
//             {/* Date Selection */}
//             <div>
//               <label className="block text-sm text-foreground mb-3">
//                 <Calendar className="w-4 h-4 inline mr-2" />
//                 Date
//               </label>
//               <div className="relative w-full">
//                 <DatePicker
//                   selected={selectedDate ? new Date(selectedDate) : null}
//                   onChange={(date: Date |null) => {
//                     if (!date) return;
//                     setSelectedDate(formatLocalDate(date));
//                   }}
//                   includeDates={availableDates}
//                   dateFormat="dd/MM/yyyy"
//                   placeholderText="Select Date"
//                   className="w-full rounded-xl border border-border bg-[rgba(15,27,60,.75)] py-3 pl-10 pr-4 text-sm"
//                   wrapperClassName="w-full"
//                   /* Escape the .card's `overflow:hidden` by rendering the
//                      popup in a fixed-position portal instead of as an
//                      absolutely-positioned child of the card. This is what
//                      was causing the calendar to be clipped and appear to
//                      overlap the Continue button / slots below it. */
//                   portalId="bmt-datepicker-portal"
//                   popperClassName="bmt-datepicker-popper"
//                   popperPlacement="bottom-start"
//                   popperProps={{ strategy: 'fixed' }}
//                   shouldCloseOnSelect
//                 />

//                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
//               </div>
//             </div>

//             {/* Time Slot Selection */}
//             {selectedDate && (
//               <div>
//                 {slotsList.length > 0 ? (
//                   <>
//                     <label className="mb-3 block text-[11.5px] uppercase tracking-[0.14em] text-gold-soft">
//                       <Clock className="mr-2 inline h-3.5 w-3.5" />
//                       Select Time Slot
//                     </label>

//                     <div className="slots">
//                       {slotsList.map((slot: any) => (
//                         <button
//                           key={slot.scheduleId}
//                           onClick={() => {
//                             setSelectedSlot(slot);
//                             setSelectedMode(null);
//                             setSelectedParticipantOption(null);
//                             setSelectedAddons([]);

//                             if (slot.modes && slot.modes.length > 0) {
//                               setTimeout(() => {
//                                 modeSectionRef.current?.scrollIntoView({
//                                   behavior: "smooth",
//                                   block: "start",
//                                 });
//                               }, 100);
//                             } else if (seva?.maxParticipants > 1) {
//                               setTimeout(() => {
//                                 scrollToSection(participentSectionRef);
//                               }, 100);
//                             }
//                           }}
//                           className={`slot ${
//                             selectedSlot?.scheduleId === slot.scheduleId ? 'on' : ''
//                           }`}
//                         >
//                           {slot.start_time}
//                         </button>
//                       ))}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex items-center justify-center py-6">
//                     <h3 className="text-foreground text-sm">
//                       No Slots Available
//                     </h3>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//       </div>

//       {/* Select Mode — only when the chosen slot offers modes */}
//       {selectedSlot && selectedSlot.modes.length > 0 && (
//         <div ref={modeSectionRef} className="card mt-[18px]">
//           <h3 className="font-medium mb-4">
//             Select Mode
//           </h3>

//           <div className="grid grid-cols-2 gap-3">
//             {selectedSlot.modes.map((mode) => (
//               <button
//                 key={mode.scheduleModeId}
//                 onClick={() => {
//                   setSelectedMode(mode);

//                   const defaultParticipant =
//                     mode.participantOptions.find(x => x.isDefault) ??
//                     mode.participantOptions[0] ??
//                     null;

//                   setSelectedParticipantOption(defaultParticipant);

//                   setSelectedAddons([]);

//                   setTimeout(() => {
//                     scrollToSection(participentSectionRef);
//                   }, 100);
//                 }}
//                 className={`p-3 rounded-lg border-2 transition-all ${
//                   selectedMode?.scheduleModeId === mode.scheduleModeId
//                     ? "border-gold bg-gold/10 text-gold-soft"
//                     : "border-border"
//                 }`}
//               >
//                 {mode.mode}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Select Participant Type (only when the mode carries priced options)
//           + Select Participants / Family Members (shown whenever this seva
//           needs more than 1 participant, whether or not modes exist). */}
//       {showParticipantSection && (
//         <div ref={participentSectionRef} className="card mt-[18px]">
//           {hasModes && selectedMode && (
//             <>
//               <h3 className="font-medium mb-4">
//                 Select Participant Type
//               </h3>

//               <div className="space-y-3">
//                 {selectedMode.participantOptions.map((option: any) => (
//                   <label
//                     key={option.participantOptionId}
//                     className="flex items-center justify-between border rounded-lg p-3 cursor-pointer"
//                   >
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="radio"
//                         name="participantOption"
//                         checked={
//                           selectedParticipantOption?.participantOptionId ===
//                           option.participantOptionId
//                         }
//                         onChange={() => setSelectedParticipantOption(option)}
//                         className="accent-[var(--color-gold)]"
//                       />

//                       <div>
//                         <p className="font-medium">{option.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {option.participantCount} Participants
//                         </p>
//                       </div>
//                     </div>

//                     <div className="font-semibold text-gold-soft">
//                       ₹{option.price}
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}

//           <h3
//             className={
//               hasModes && selectedMode
//                 ? "font-medium mt-6 mb-4"
//                 : "font-medium mb-4"
//             }
//           >
//             Select Participants
//           </h3>

//           <div className="rounded-lg bg-gold/10 border border-gold/30 p-4">
//             <p className="text-sm text-muted-foreground">
//               Verify your family members under your profile.
//             </p>

//             {effectiveParticipantCount > 1 &&
//               familyMembers.length <
//                 Math.max(effectiveParticipantCount - 1, 0) && (
//                 <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 mt-4">
//                   <p className="text-sm text-destructive">
//                     This booking requires{" "}
//                     {effectiveParticipantCount - 1} family member
//                     {effectiveParticipantCount - 1 > 1 ? "s" : ""}.
//                     <br />
//                     You currently have {familyMembers.length}.
//                     <br />
//                     Please add{" "}
//                     {effectiveParticipantCount -
//                       1 -
//                       familyMembers.length}{" "}
//                     more family member
//                     {effectiveParticipantCount -
//                       1 -
//                       familyMembers.length >
//                     1
//                       ? "s"
//                       : ""}{" "}
//                   </p>
//                 </div>
//               )
//             }

//             <button
//               style={{cursor:"pointer", marginTop:"5px"}}
//               onClick={() => {
//                 sessionStorage.setItem(
//                   "sevaDraft",
//                   JSON.stringify({
//                     selectedDate,
//                     selectedSlot,
//                     selectedMode,
//                     selectedParticipantOption,
//                     selectedParticipants,
//                     selectedAddons,
//                   })
//                 );

//                 navigate("/familyDetails", {
//                   state: {
//                     from: location.pathname,
//                   },
//                 });
//               }}
//               className="mt-3 text-sm font-medium text-gold-soft"
//             >
//               Go to Profile →
//             </button>
//           </div>

//           <div className="space-y-4">
//             {Array.from({
//               length: visibleParticipantSlots,
//             }).map((_, index) => (
//               <div key={index}>
//                 <label className="block text-sm text-muted-foreground mb-2">
//                   Family Member
//                 </label>

//                 <select
//                   value={selectedParticipants[index]?.id || ""}
//                   onChange={(e) =>
//                     handleParticipantChange(index, e.target.value)
//                   }
//                   className="w-full border border-border rounded-lg px-3 py-3"
//                 >
//                   <option value="">
//                     Select Participant
//                   </option>

//                   {familyMembers.map((member) => {
//                     const alreadySelected = selectedParticipants.some(
//                       (p, i) => i !== index && p?.id === member.id
//                     );

//                     return (
//                       <option
//                         key={member.id}
//                         value={member.id}
//                         disabled={alreadySelected}
//                       >
//                         {member.firstName} {member.lastName}
//                         {alreadySelected ? " (Selected)" : ""}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Add-ons — sevas fetch these from their own /api/sevas/{id}/addons
//           endpoint (unlike special-puja, where addons are nested inside
//           schedule modes), so this renders independent of mode selection. */}
//       {selectedSlot && sevaAddons.length > 0 && (
//         <div className="card mt-[18px]">
//           <h3 className="font-medium mb-4">
//             Add-ons
//           </h3>

//           {!hasAddress && (
//             <div className="mt-6 rounded-lg bg-gold/10 border border-gold/30 p-4 mb-2">
//               <p className="text-sm text-muted-foreground">
//                 Please add your address. It is required for Prasadam delivery.
//               </p>

//               <button
//                 onClick={() => {
//                   sessionStorage.setItem(
//                     "sevaDraft",
//                     JSON.stringify({
//                       selectedDate,
//                       selectedSlot,
//                       selectedMode,
//                       selectedParticipantOption,
//                       selectedParticipants,
//                       selectedAddons,
//                     })
//                   );

//                   navigate("/addressDetails", {
//                     state: {
//                       from: location.pathname,
//                     },
//                   });
//                 }}
//                 className="mt-3 text-sm font-medium text-gold-soft"
//                 style={{ cursor: "pointer" }}
//               >
//                 Add Address →
//               </button>
//             </div>
//           )}

//           <div className="space-y-4">
//             {sevaAddons.map((addon) => {
//               const quantity = getAddonQuantity(addon.addonId);

//               return (
//                 <div
//                   key={addon.addonId}
//                   className="flex items-center justify-between border border-border rounded-lg p-3"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {addon.name}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       ₹{addon.price}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       className="w-8 h-8 border border-border rounded hover:border-gold/50 transition-colors"
//                       onClick={() =>
//                         handleAddonQuantityChange(
//                           addon,
//                           Math.max(quantity - 1, 0)
//                         )
//                       }
//                     >
//                       -
//                     </button>

//                     <span className="w-6 text-center">
//                       {quantity}
//                     </span>

//                     <button
//                       type="button"
//                       className="w-8 h-8 border border-border rounded hover:border-gold/50 transition-colors"
//                       onClick={() =>
//                         handleAddonQuantityChange(
//                           addon,
//                           Math.min(
//                             quantity + 1,
//                             addon.maxQuantity
//                           )
//                         )
//                       }
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Bottom Action */}
//       <div className="sticky bottom-0 z-30 -mx-[var(--gutter)] mt-8 border-t border-border bg-background/95 px-[var(--gutter)] py-4 backdrop-blur">
//         <div className="mx-auto max-w-md">
//           <Button 
//             fullWidth
//             onClick={handleContinue}
//             disabled={continueDisabled}
//           >
//             Continue
//           </Button>
//         </div>
//       </div>
//     </PageShell>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, useNavigationType } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { api } from '../api/client';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PageShell } from '../components/PageShell';
import { Crumb, money } from '../components/royale';

type ParticipantOption = {
  participantOptionId: number;
  name: string;
  participantCount: number;
  price: number;
  isDefault: boolean;
};

type Addon = {
  addonId: number;
  name: string;
  description: string;
  price: number;
  maxQuantity: number;
};

type Mode = {
  scheduleModeId: number;
  mode: string;
  availableCapacity: number | null;
  participantOptions: ParticipantOption[];
  addons: Addon[];
};

type Slot = {
  scheduleId: number;
  date: string;
  slot: string;
  start_time: string;
  availableCapacity: number | null;
  modes: Mode[];
};

// Converts a 24-hour hour/minute pair into a "h:mm AM/PM" label.
// Built from the already-parsed numeric hours/minutes rather than
// string-slicing the raw "HH:mm:ss" value, so it's correct regardless
// of whether the hour has a leading zero (e.g. 17:00 -> "5:00 PM",
// 07:30 -> "7:30 AM").
const formatTime12 = (hours: number, minutes: number) => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
};

// item.startTime isn't guaranteed to be a clean "HH:mm:ss" string — it may
// come through as "07:30 AM", "7:30:00 AM", etc. Splitting on ':' and
// calling Number() on the raw pieces breaks the moment anything trails the
// minutes (e.g. Number("30 AM") -> NaN). This pulls out just the leading
// hour/minute digits and ignores everything else.
const parseTimeParts = (timeStr: string): [number, number] => {
  const str = (timeStr ?? '').trim();
  const match = /^(\d{1,2}):(\d{1,2})/.exec(str);
  if (!match) return [0, 0];

  let hours = Number(match[1]);
  const minutes = Number(match[2]);

  // If the source string already carries an AM/PM marker, trust it and
  // normalize to 24-hour so formatTime12 (which expects 24-hour input)
  // reformats it correctly. If there's no marker, treat the hour as
  // already being 24-hour.
  const meridiem = /\b(am|pm)\b/i.exec(str)?.[1]?.toLowerCase();
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  return [hours, minutes];
};

export function SevaBooking() {

  const navigate = useNavigate();
  const location = useLocation();
  const { sevaId } = useParams();
  // Distinguishes a fresh visit (PUSH — clicking the seva from a list)
  // from browser Back/Forward (POP). The saved draft should only be
  // restored on POP; otherwise a leftover draft from a previous booking
  // attempt would make Select Participants (and the picked date/slot)
  // appear immediately on what the user expects to be a blank form.
  const navigationType = useNavigationType();

  const modeSectionRef = useRef<HTMLDivElement>(null);
  const participentSectionRef = useRef<HTMLDivElement>(null);

  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [allSchedules, setAllSchedules] = useState<any[]>([]);

  if (!sevaId) {
    return (
      <PageShell>
        <div className="card py-12 text-center text-muted-foreground">
          Invalid Seva
        </div>
      </PageShell>
    );
  }

  const [selectedDate, setSelectedDate] = useState('');
  const [name] = useState('');
  const [nakshatra] = useState('');
  const [gotra] = useState('');
  const [occasion] = useState('');
  const [slotsList, setSlotsList] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [seva, setSeva] = useState<any>(null);
  const [loadingSeva, setLoadingSeva] = useState(false);

  const [defaultDuration] = useState<any>('30 Min');

  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const [selectedParticipantOption, setSelectedParticipantOption] =
    useState<ParticipantOption | null>(null);

  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  // Unlike special-puja, a seva's add-ons live on their own endpoint
  // (GET /api/sevas/{id}/addons) — not nested inside schedule modes — so
  // they're fetched once, independent of mode/slot selection.
  const [sevaAddons, setSevaAddons] = useState<Addon[]>([]);

  const [hasAddress, setHasAddress] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login');
      return;
    }
    const storedProfileCompleted =
    localStorage.getItem("profileCompleted") === "true";
    if(!storedProfileCompleted){
      navigate('/profile-details');
      return;
    }
    setLoadingSeva(true);
    api.get(`api/sevas/${sevaId}`)
      .then((response) => {
        const item = response.data;
         setSeva({
          id: item.id,
          name: item.title,
          description: item.description,
          // Different seva records have been seen using different field
          // names for the base price (basePrice vs price vs cost) — try
          // them in order instead of assuming one, so a naming mismatch
          // doesn't silently produce a 0 amount at checkout.
          price: item.basePrice ?? item.price ?? item.cost ?? 0,
          duration: item.duration || defaultDuration,
          image: item.profileImageUrl,
          maxParticipants: item.maxParticipants,
          providerTemple: item.provider?.name,
          conductedBy: item.provider?.name,
          locationCity: item.location?.city,
          googleMaps: item.location?.googleMapsUrl,
        });

        api.get('api/user/family')
          .then((res) => {
            setFamilyMembers(res.data);
          })
          .catch(console.error);

        api.get(`api/sevas/${sevaId}/addons`)
          .then((res) => {
            setSevaAddons(res.data ?? []);
          })
          .catch(() => {
            setSevaAddons([]);
          });

        const draft =
          navigationType === "POP"
            ? sessionStorage.getItem("sevaDraft")
            : null;
        if (draft) {
          const state = JSON.parse(draft);
          setSelectedDate(state.selectedDate || '');
          setSelectedSlot(state.selectedSlot || null);
          setSelectedMode(state.selectedMode || null);
          setSelectedParticipantOption(
            state.selectedParticipantOption || null
          );
          setSelectedParticipants(state.selectedParticipants || []);
          setSelectedAddons(state.selectedAddons || []);
        }

        api.get("api/user/address")
          .then((res) => {
            const d = Array.isArray(res.data)
              ? (res.data[0] || {})
              : (res.data || {});
            setHasAddress(!!d.addressLine1);
          })
          .catch(() => {
            setHasAddress(false);
          });
      })
      .catch(() => {
        setLoadingSeva(false);
      })
      .finally(() => {
        setLoadingSeva(false);
      });

  }, []);

  useEffect(() => {
    setLoadingSeva(true);
    api.get(`api/sevas/${sevaId}/schedules`)
      .then((response) => {
        const data = response.data ?? [];
        setAllSchedules(data);
        setAvailableDates(data.map((item: any) => new Date(item.date)));
      })
      .catch(() => {
        setLoadingSeva(false);
      })
      .finally(() => {
        setLoadingSeva(false);
      });

  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setSlotsList([]);
      return;
    }

    const selectedDay = allSchedules.find(
      (item: any) => item.date === selectedDate
    );

    const result = (selectedDay?.schedules ?? []).map((item: any, i: number) => {
      const [hours, minutes] = parseTimeParts(item.startTime);

      const offsetDuration =
        item.duration || Number(defaultDuration.split(' ')[0]);

      const endDate = new Date();
      endDate.setHours(hours, minutes + offsetDuration, 0, 0);

      const endHours = endDate.getHours();
      const endMinutes = endDate.getMinutes();

      const startLabel = formatTime12(hours, minutes);
      const endLabel = formatTime12(endHours, endMinutes);

      return {
        scheduleId: item.scheduleId,
        date: selectedDate,
        slot: `${startLabel} - ${endLabel}`,
        start_time: startLabel,
        availableCapacity: item.availableCapacity,
        modes: item.modes || [],
        un_id: i + Date.now(),
      };
    });

    setSlotsList(result);
    setSelectedSlot(null); // Reset previously selected slot
    setSelectedMode(null);
    setSelectedParticipantOption(null);
    setSelectedAddons([]);
  }, [selectedDate, allSchedules]);

  const handleParticipantChange = (index: number, familyMemberId: string) => {
    const member = familyMembers.find(x => String(x.id) === familyMemberId);

    setSelectedParticipants(prev => {
      const updated = [...prev];
      updated[index] = member;
      return updated.filter(Boolean);
    });
  };

  const handleAddonQuantityChange = (addon: any, quantity: number) => {
    if (quantity <= 0) {
      setSelectedAddons(prev =>
        prev.filter(x => x.addonId !== addon.addonId)
      );
      return;
    }

    setSelectedAddons(prev => {
      const existing = prev.find(
        x => x.addonId === addon.addonId
      );

      if (existing) {
        return prev.map(x =>
          x.addonId === addon.addonId
            ? { ...x, quantity }
            : x
        );
      }

      return [
        ...prev,
        {
          ...addon,
          quantity
        }
      ];
    });
  };

  const getAddonQuantity = (addonId: number) =>
    selectedAddons.find(x => x.addonId === addonId)?.quantity || 0;

  const participantPrice = selectedParticipantOption?.price ?? seva?.price ?? 0;
  const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price * addon.quantity, 0);
  const totalPrice = participantPrice + addonPrice;

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;

    const y =
      ref.current.getBoundingClientRect().top +
      window.pageYOffset -
      90;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return;
    if (selectedSlot.modes.length > 0 && !selectedMode) return;

    const bookingData = {
      type: 'seva',

      offering: {
        id: seva.id,
        name: seva.name,
        description: seva.description,
        // Base price only — NOT totalPrice. The payment page adds up
        // addonDetails separately for its own "Add-ons" line item, so
        // baking addonPrice into offering.price here double-counts it
        // in the grand total.
        price: participantPrice,
        duration: seva.duration,
        image: seva.image,
        maxParticipants: seva.maxParticipants,
        providerTemple: seva.providerTemple
      },

      date: selectedDate,
      slot: selectedSlot,

      mode: selectedMode
        ? {
            scheduleModeId: selectedMode.scheduleModeId,
            mode: selectedMode.mode
          }
        : null,

      scheduleModeId: selectedMode?.scheduleModeId,
      participantOptionId: selectedParticipantOption?.participantOptionId,

      participantOption: selectedParticipantOption,

      devoteeDetails: {
        name,
        nakshatra,
        gotra,
        occasion
      },

      participantDetails: selectedParticipants,

      addonDetails: selectedAddons,

      totalPrice
    };

    // Persist the in-progress selections before leaving this page — if the
    // user hits browser Back from /payment (or anywhere downstream), the
    // restore-on-mount logic above puts them right back where they left off
    // instead of resetting to a blank form.
    sessionStorage.setItem(
      "sevaDraft",
      JSON.stringify({
        selectedDate,
        selectedSlot,
        selectedMode,
        selectedParticipantOption,
        selectedParticipants,
        selectedAddons,
      })
    );

    navigate('/payment', {
      state: {
        booking: bookingData
      }
    });
  };

  const formatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const continueDisabled =
    !selectedDate ||
    !selectedSlot ||
    (selectedSlot.modes.length > 0 && !selectedMode);

  // A seva may not have `modes` populated at all (participantOptions only
  // exist nested inside modes) — but the family member fetch is
  // unconditional (api/user/family), so Select Participants should always
  // be shown once a slot (and mode, if the slot has one) is chosen —
  // not hidden behind a maxParticipants check.
  const hasModes = !!selectedSlot && selectedSlot.modes.length > 0;
  // Falls back through: mode's participant option -> seva's own
  // maxParticipants -> however many family members exist (so the reveal
  // never gets stuck at 1 dropdown even if a seva is missing this field).
  const effectiveParticipantCount =
    selectedParticipantOption?.participantCount ??
    seva?.maxParticipants ??
    (familyMembers.length + 1);
  const showParticipantSection =
    !!selectedSlot && (hasModes ? !!selectedMode : true);

  // Reveal family-member dropdowns one at a time: start with a single
  // dropdown, and only show the next one once the current one has a
  // selection. Capped purely by how many family members exist to choose
  // from — uniformly across modes/participant options, so this behaves
  // the same whether or not the booking has a mode step.
  const requiredParticipantCount = seva?.maxParticipants ?? 1;

  // const requiredParticipantCount = familyMembers.length;
  const filledParticipantCount = selectedParticipants.filter(Boolean).length;
  const visibleParticipantSlots = Math.min(
    filledParticipantCount + 1,
    requiredParticipantCount
  );

  return (
    <PageShell>
      
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Temples', to: '/temples' },
          { label: 'Book Seva' },
        ]}
      />

      <h1 className="page-title">Seva Booking</h1>

      {/* Progress Steps — mockup `.stepper` */}
      <div className="stepper">
        <div className="st on"><b>1</b>Date &amp; Time</div>
        <div className="bar" />
        <div className="st"><b>2</b>Details</div>
        <div className="bar" />
        <div className="st"><b>3</b>Payment</div>
      </div>

      <div className="mt-6">
        {/* Seva Summary */}
        <div className="card mb-[18px]">
          {loadingSeva && 
            <div>Loading</div>
          }
          {seva && 
            <div>
              <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="serif text-[20px]">{seva.name}</h3>
                <span className="serif shrink-0 text-[20px] text-gold-soft">{money(seva.price)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">{seva.description}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <small>{seva.duration}</small>
                </div>
                <div>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Event Details */}
        {/* {seva && (seva.conductedBy || seva.locationCity) && (
          <div className="card mb-[18px]">
            <span className="tag">Event Details</span>

            <div className="space-y-4">
              {seva.conductedBy && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conducted By</p>
                  <p className="text-sm">{seva.conductedBy}</p>
                </div>
              )}

              {seva.locationCity && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    {seva.googleMaps && (
                      <a
                        href={seva.googleMaps}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-surface shadow-lg px-3 py-2 rounded-full text-xs font-medium text-gold-soft whitespace-nowrap"
                      >
                        Open Maps →
                      </a>
                    )}
                  </div>
                  <p className="text-sm font-medium">{seva.locationCity}</p>
                </div>
              )}
            </div>
          </div>
        )} */}

        
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm text-foreground mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <div className="relative w-full">
                <DatePicker
                  selected={selectedDate ? new Date(selectedDate) : null}
                  onChange={(date: Date |null) => {
                    if (!date) return;
                    setSelectedDate(formatLocalDate(date));
                  }}
                  includeDates={availableDates}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date"
                  className="w-full rounded-xl border border-border bg-[rgba(15,27,60,.75)] py-3 pl-10 pr-4 text-sm"
                  wrapperClassName="w-full"
                  /* Escape the .card's `overflow:hidden` by rendering the
                     popup in a fixed-position portal instead of as an
                     absolutely-positioned child of the card. This is what
                     was causing the calendar to be clipped and appear to
                     overlap the Continue button / slots below it. */
                  portalId="bmt-datepicker-portal"
                  popperClassName="bmt-datepicker-popper"
                  popperPlacement="bottom-start"
                  popperProps={{ strategy: 'fixed' }}
                  shouldCloseOnSelect
                />

                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div>
                {slotsList.length > 0 ? (
                  <>
                    <label className="mb-3 block text-[11.5px] uppercase tracking-[0.14em] text-gold-soft">
                      <Clock className="mr-2 inline h-3.5 w-3.5" />
                      Select Time Slot
                    </label>

                    <div className="slots">
                      {slotsList.map((slot: any) => (
                        <button
                          key={slot.scheduleId}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setSelectedMode(null);
                            setSelectedParticipantOption(null);
                            setSelectedAddons([]);

                            if (slot.modes && slot.modes.length > 0) {
                              setTimeout(() => {
                                modeSectionRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }, 100);
                            } else if (seva?.maxParticipants > 1) {
                              setTimeout(() => {
                                scrollToSection(participentSectionRef);
                              }, 100);
                            }
                          }}
                          className={`slot ${
                            selectedSlot?.scheduleId === slot.scheduleId ? 'on' : ''
                          }`}
                        >
                          {slot.start_time}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-6">
                    <h3 className="text-foreground text-sm">
                      No Slots Available
                    </h3>
                  </div>
                )}
              </div>
            )}
          </div>
      </div>

      {/* Select Mode — only when the chosen slot offers modes */}
      {selectedSlot && selectedSlot.modes.length > 0 && (
        <div ref={modeSectionRef} className="card mt-[18px]">
          <h3 className="font-medium mb-4">
            Select Mode
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {selectedSlot.modes.map((mode) => (
              <button
                key={mode.scheduleModeId}
                onClick={() => {
                  setSelectedMode(mode);

                  const defaultParticipant =
                    mode.participantOptions.find(x => x.isDefault) ??
                    mode.participantOptions[0] ??
                    null;

                  setSelectedParticipantOption(defaultParticipant);

                  setSelectedAddons([]);

                  setTimeout(() => {
                    scrollToSection(participentSectionRef);
                  }, 100);
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMode?.scheduleModeId === mode.scheduleModeId
                    ? "border-gold bg-gold/10 text-gold-soft"
                    : "border-border"
                }`}
              >
                {mode.mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select Participant Type (only when the mode carries priced options)
          + Select Participants / Family Members (shown whenever this seva
          needs more than 1 participant, whether or not modes exist). */}
      {showParticipantSection && (
        <div ref={participentSectionRef} className="card mt-[18px]">
          {hasModes && selectedMode && (
            <>
              <h3 className="font-medium mb-4">
                Select Participant Type
              </h3>

              <div className="space-y-3">
                {selectedMode.participantOptions.map((option: any) => (
                  <label
                    key={option.participantOptionId}
                    className="flex items-center justify-between border rounded-lg p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="participantOption"
                        checked={
                          selectedParticipantOption?.participantOptionId ===
                          option.participantOptionId
                        }
                        onChange={() => setSelectedParticipantOption(option)}
                        className="accent-[var(--color-gold)]"
                      />

                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.participantCount} Participants
                        </p>
                      </div>
                    </div>

                    <div className="font-semibold text-gold-soft">
                      ₹{option.price}
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          <h3
            className={
              hasModes && selectedMode
                ? "font-medium mt-6 mb-4"
                : "font-medium mb-4"
            }
          >
            Select Participants
          </h3>

          <div className="rounded-lg bg-gold/10 border border-gold/30 p-4">
            <p className="text-sm text-muted-foreground">
              Verify your family members under your profile.
            </p>

            {effectiveParticipantCount > 1 &&
              familyMembers.length <
                Math.max(effectiveParticipantCount - 1, 0) && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 mt-4">
                  <p className="text-sm text-destructive">
                    This booking requires{" "}
                    {effectiveParticipantCount - 1} family member
                    {effectiveParticipantCount - 1 > 1 ? "s" : ""}.
                    <br />
                    You currently have {familyMembers.length}.
                    <br />
                    Please add{" "}
                    {effectiveParticipantCount -
                      1 -
                      familyMembers.length}{" "}
                    more family member
                    {effectiveParticipantCount -
                      1 -
                      familyMembers.length >
                    1
                      ? "s"
                      : ""}{" "}
                  </p>
                </div>
              )
            }

            <button
              style={{cursor:"pointer", marginTop:"5px"}}
              onClick={() => {
                sessionStorage.setItem(
                  "sevaDraft",
                  JSON.stringify({
                    selectedDate,
                    selectedSlot,
                    selectedMode,
                    selectedParticipantOption,
                    selectedParticipants,
                    selectedAddons,
                  })
                );

                navigate("/familyDetails", {
                  state: {
                    from: location.pathname,
                  },
                });
              }}
              className="mt-3 text-sm font-medium text-gold-soft"
            >
              Go to Profile →
            </button>
          </div>

          <div className="space-y-4">
            {Array.from({
              length: visibleParticipantSlots,
            }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm text-muted-foreground mb-2">
                  Family Member
                </label>

                <select
                  value={selectedParticipants[index]?.id || ""}
                  onChange={(e) =>
                    handleParticipantChange(index, e.target.value)
                  }
                  className="w-full border border-border rounded-lg px-3 py-3"
                >
                  <option value="">
                    Select Participant
                  </option>

                  {familyMembers.map((member) => {
                    const alreadySelected = selectedParticipants.some(
                      (p, i) => i !== index && p?.id === member.id
                    );

                    return (
                      <option
                        key={member.id}
                        value={member.id}
                        disabled={alreadySelected}
                      >
                        {member.firstName} {member.lastName}
                        {alreadySelected ? " (Selected)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons — sevas fetch these from their own /api/sevas/{id}/addons
          endpoint (unlike special-puja, where addons are nested inside
          schedule modes), so this renders independent of mode selection. */}
      {selectedSlot && sevaAddons.length > 0 && (
        <div className="card mt-[18px]">
          <h3 className="font-medium mb-4">
            Add-ons
          </h3>

          {!hasAddress && (
            <div className="mt-6 rounded-lg bg-gold/10 border border-gold/30 p-4 mb-2">
              <p className="text-sm text-muted-foreground">
                Please add your address. It is required for Prasadam delivery.
              </p>

              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "sevaDraft",
                    JSON.stringify({
                      selectedDate,
                      selectedSlot,
                      selectedMode,
                      selectedParticipantOption,
                      selectedParticipants,
                      selectedAddons,
                    })
                  );

                  navigate("/addressDetails", {
                    state: {
                      from: location.pathname,
                    },
                  });
                }}
                className="mt-3 text-sm font-medium text-gold-soft"
                style={{ cursor: "pointer" }}
              >
                Add Address →
              </button>
            </div>
          )}

          <div className="space-y-4">
            {sevaAddons.map((addon) => {
              const quantity = getAddonQuantity(addon.addonId);

              return (
                <div
                  key={addon.addonId}
                  className="flex items-center justify-between border border-border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">
                      {addon.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{addon.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 border border-border rounded hover:border-gold/50 transition-colors"
                      onClick={() =>
                        handleAddonQuantityChange(
                          addon,
                          Math.max(quantity - 1, 0)
                        )
                      }
                    >
                      -
                    </button>

                    <span className="w-6 text-center">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      className="w-8 h-8 border border-border rounded hover:border-gold/50 transition-colors"
                      onClick={() =>
                        handleAddonQuantityChange(
                          addon,
                          Math.min(
                            quantity + 1,
                            addon.maxQuantity
                          )
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Action */}
      <div className="sticky bottom-0 z-30 -mx-[var(--gutter)] mt-8 border-t border-border bg-background/95 px-[var(--gutter)] py-4 backdrop-blur">
        <div className="mx-auto max-w-md">
          <Button 
            fullWidth
            onClick={handleContinue}
            disabled={continueDisabled}
          >
            Continue
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
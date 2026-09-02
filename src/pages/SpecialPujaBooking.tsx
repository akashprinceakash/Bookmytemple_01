// import { useState, useEffect, useRef  } from 'react';
// import { useNavigate, useParams, useLocation, useNavigationType } from 'react-router-dom';
// import { Clock } from 'lucide-react';
// import { Button } from '../components/Button';
// import { api } from '../api/client';
// import { PageShell } from '../components/PageShell';
// import { Crumb } from '../components/royale';

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
//   startTime: string;
//   availableCapacity: number | null;
//   modes: Mode[];
// };

// export function SpecialPujaBooking() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { specialPujaId } = useParams();

//   // Distinguishes a fresh visit (PUSH — clicking the puja from the temple's
//   // list) from browser Back/Forward (POP). The saved draft should only be
//   // restored on POP; otherwise a leftover draft from a previous booking
//   // attempt would make Select Participants (and the picked schedule)
//   // appear immediately on what the user expects to be a blank form.
//   const navigationType = useNavigationType();
//   // Passed from TempleDetail.tsx when linking to a Temple Special Puja's
//   // booking page. GET /api/special-pujas/{id} doesn't return price or a
//   // participant count for these — that data only exists on the
//   // temple-scoped list endpoint (as `cost`/`participants`), which needs
//   // this id to be fetched.
//   const templeIdFromState = (location.state as any)?.templeId;


//   const modeSectionRef = useRef<HTMLDivElement>(null);
//   const participentSectionRef = useRef<HTMLDivElement>(null);

//   if (!specialPujaId) {
//     return (
//       <PageShell>
//         <div className="card py-12 text-center text-muted-foreground">
//           Invalid Special Puja
//         </div>
//       </PageShell>
//     );
//   }

//   const [slotsList, setSlotsList] = useState<Slot[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

//   const [specialPuja, setSpecialPuja] = useState<any>(null);
//   const [loadingPuja, setLoadingPuja] = useState(false);

//   const [familyMembers, setFamilyMembers] = useState<any[]>([]);
//   const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

//   // const [addons, setAddons] = useState<any[]>([]);

//   const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

//   const [selectedParticipantOption, setSelectedParticipantOption] =
//   useState<ParticipantOption | null>(null);

//   const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
//   // Some special-pujas (e.g. Temple Special Pujas) have no `modes` at all,
//   // so their add-ons — if any exist on the backend — would need to come
//   // from a dedicated endpoint rather than nested inside a mode. This is
//   // fetched the same way as seva add-ons, and used as a fallback whenever
//   // there's no mode to pull addons from.
//   const [specialPujaAddons, setSpecialPujaAddons] = useState<Addon[]>([]);

//   const [hasAddress, setHasAddress] = useState(true);

//   const [defaultDuration] = useState('30 Min');

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const storedProfileCompleted =
//       localStorage.getItem('profileCompleted') === 'true';

//     if (!storedProfileCompleted) {
//       navigate('/profile-details');
//       return;
//     }

//     setLoadingPuja(true);

//     api
//       .get(`api/special-pujas/${specialPujaId}`)
//       .then((response) => {
//         const item = response.data;

//         setSpecialPuja({
//           id: item.id,
//           name: item.title,
//           description: item.description,
//                     // The Special Pujas detail endpoint has been seen without a
//           // price field at all for Temple Special Pujas (it only shows up
//           // as "cost" on the temple-scoped list endpoint). Try known
//           // variants here so a naming mismatch doesn't silently produce a
//           // 0 amount at checkout the moment backend does add it here.
//           price: item.price ?? item.cost ?? item.basePrice ?? 0,
//           duration: item.duration || defaultDuration,
//           image: item.profileImageUrl,
//           maxParticipants: item.maxParticipants,
//           providerTemple: item.conductedBy,
//           conductedBy: item.conductedBy,
//           locationName: item.locationName,
//           locationAddress: item.locationAddress,
//           googleMaps: item.googleMaps,
//         });

//         const schedules: Slot[] = [];

//         (item.schedule || []).forEach((day: any) => {
//           (day.schedules || []).forEach((schedule: any) => {
//             schedules.push({
//               scheduleId: schedule.scheduleId,
//               date: day.date,
//               startTime: schedule.startTime,
//               availableCapacity: schedule.availableCapacity,
//               modes: schedule.modes || []
//             });
//           });
//         });

//         setSlotsList(schedules);

//         api.get('api/user/family')
//         .then((response) => {
//           setFamilyMembers(response.data);
//         })
//         .catch(console.error);

//         api.get(`api/special-pujas/${specialPujaId}/addons`)
//           .then((res) => {
//             setSpecialPujaAddons(res.data ?? []);
//           })
//           .catch(() => {
//             setSpecialPujaAddons([]);
//           });

//         // const draft = sessionStorage.getItem("specialPujaDraft");
//                 // Cross-reference the temple-scoped list for whatever the direct
//         // detail endpoint is missing (price/participants, for Temple
//         // Special Pujas). Only attempted when a templeId was actually
//         // passed in via navigation state — direct Special Pujas (no
//         // temple link) already have everything they need and skip this.
//         if (templeIdFromState) {
//           api.get(`api/temples/${templeIdFromState}/special-pujas`)
//             .then((res) => {
//               const list = Array.isArray(res.data?.items)
//                 ? res.data.items
//                 : Array.isArray(res.data)
//                   ? res.data
//                   : [];
//               const match = list.find((p: any) => p.id === specialPujaId);
//               if (match) {
//                 setSpecialPuja((prev: any) => ({
//                   ...prev,
//                   price: prev?.price || match.cost || match.price || 0,
//                   maxParticipants:
//                     prev?.maxParticipants || match.participants || match.maxParticipants,
//                 }));
//               }
//             })
//             .catch(console.error);
//         }

//         const draft =
//           navigationType === "POP"
//             ? sessionStorage.getItem("specialPujaDraft")
//             : null;

//         if (draft) {
//           const state = JSON.parse(draft);
//           setSelectedSlot(state.selectedSlot || null);
//           setSelectedMode(state.selectedMode || null);
//           setSelectedParticipantOption(
//             state.selectedParticipantOption || null
//           );
//           setSelectedParticipants(state.selectedParticipants || []);
//           setSelectedAddons(state.selectedAddons || []);
//         }

//         api.get("api/user/address")
//         .then((res) => {
//           const d = Array.isArray(res.data)
//             ? (res.data[0] || {})
//             : (res.data || {});
//           setHasAddress(!!d.addressLine1);
//         })
//         .catch(() => {
//           setHasAddress(false);
//         });

//       })
//       .catch((err) => {
//         console.error(err);
//       })
//       .finally(() => {
//         setLoadingPuja(false);
//       });
//   }, []);


//   const handleParticipantChange = (index: number,familyMemberId: string) => {
//   const member = familyMembers.find(x => String(x.id) === familyMemberId);

//   setSelectedParticipants(prev => {
//       const updated = [...prev];
//       updated[index] = member;
//       return updated.filter(Boolean);
//     });
//   };

//   const handleAddonQuantityChange = (addon: any,quantity: number) => {
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
//   selectedAddons.find(x => x.addonId === addonId)?.quantity || 0;
//   // const participantPrice = selectedParticipantOption?.price || 0;
//     const participantPrice = selectedParticipantOption?.price ?? specialPuja?.price ?? 0;

//   const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price * addon.quantity,0);
//   const totalPrice = participantPrice + addonPrice;

//   // Some special-pujas (Temple Special Pujas) have no `modes` populated at
//   // all, so Select Participants and Add-ons shouldn't be hidden behind a
//   // mode selection that will never happen. Family data is fetched
//   // unconditionally, so Select Participants always shows once a slot (and
//   // mode, if that slot has one) is picked — matching the seva booking fix.
//   const hasModes = !!selectedSlot && selectedSlot.modes.length > 0;
//   const showParticipantSection =
//     !!selectedSlot && (hasModes ? !!selectedMode : true);

//   // Reveal family-member dropdowns one at a time: start with a single
//   // dropdown, and only show the next one once the current one has a
//   // selection. If a mode's participant option reports a real count beyond
//   // 1, cap at that; otherwise always allow at least 1 optional companion.

//     // selection. Cap at a real participant count when one is known (from a
//   // selected mode's participant option); otherwise — since Temple Special
//   // Pujas have no `maxParticipants`/`participants` field on their detail
//   // endpoint at all — fall back to "however many family members exist",
//   // so the user can keep adding companions up to their full family list.

//   const requiredParticipantCount = Math.max(
//     // (selectedParticipantOption?.participantCount ?? 0) - 1,
//         (selectedParticipantOption?.participantCount ??
//       specialPuja?.maxParticipants ??
//       (familyMembers.length + 1)) - 1,
//     1
//   );
//   const filledParticipantCount = selectedParticipants.filter(Boolean).length;
//   const visibleParticipantSlots = Math.min(
//     filledParticipantCount + 1,
//     requiredParticipantCount
//   );

//   // Add-ons: prefer the selected mode's addons when one exists and has any
//   // (this is how the working "Direct Special Puja" flow — e.g. Sri Chakra
//   // Pooja — already gets its addons). Otherwise fall back to the
//   // dedicated /api/special-pujas/{id}/addons fetch, for pujas with no
//   // modes at all.
//   const usingModeAddons =
//     hasModes && !!selectedMode && selectedMode.addons.length > 0;
//   const addonsToShow = usingModeAddons
//     ? selectedMode!.addons
//     : specialPujaAddons;
//   const showAddonsSection =
//     !!selectedSlot &&
//     addonsToShow.length > 0 &&
//     (hasModes ? !!selectedMode : true);
//   const showAddressPrompt =
//     !hasAddress &&
//     (usingModeAddons ? selectedMode?.mode === "ONLINE" : true);

//   const handleContinue = () => {
//     if (!selectedSlot) return;

//     const bookingData = {
//       type: "specialpuja",

//       offering: {
//         id: specialPuja.id,
//         name: specialPuja.name,
//         description: specialPuja.description,
//         // Base price only — NOT totalPrice. The payment page adds up
//         // addonDetails separately for its own "Add-ons" line item, so
//         // baking addonPrice into offering.price here double-counts it
//         // in the grand total.
//         price: participantPrice,
//         duration: specialPuja.duration,
//         image: specialPuja.image,
//         providerTemple: specialPuja.providerTemple
//       },

//       date: selectedSlot.date,

//       slot: {
//         scheduleId: selectedSlot.scheduleId,
//         startTime: selectedSlot.startTime
//       },

//       mode: {
//         scheduleModeId: selectedMode?.scheduleModeId,
//         mode: selectedMode?.mode
//       },

//       scheduleModeId: selectedMode?.scheduleModeId,
//       participantOptionId: selectedParticipantOption?.participantOptionId,

//       participantOption: selectedParticipantOption,

//       devoteeDetails: selectedParticipants,

//       addonDetails: selectedAddons,

//       totalPrice
//     };

//     // Persist the in-progress selections before leaving this page — if the
//     // user hits browser Back from /payment (or anywhere downstream), the
//     // restore-on-mount logic above puts them right back where they left off
//     // instead of resetting to a blank form.
//     sessionStorage.setItem(
//       "specialPujaDraft",
//       JSON.stringify({
//         selectedSlot,
//         selectedMode,
//         selectedParticipantOption,
//         selectedParticipants,
//         selectedAddons,
//       })
//     );

//     navigate('/payment', {
//       state: {
//         booking: bookingData,
//       },
//     });
//   };

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

//   return (
//     <PageShell>
      
//       <Crumb
//         parts={[
//           { label: 'Home', to: '/home' },
//           { label: 'Puja & Seva', to: '/pujas-homas' },
//           { label: 'Book' },
//         ]}
//       />

//       <h1 className="page-title">Special Puja Booking</h1>

//       {/* Progress Steps — mockup `.stepper` */}
//       <div className="stepper">
//         <div className="st on"><b>1</b>Schedule</div>
//         <div className="bar" />
//         <div className="st"><b>2</b>Details</div>
//         <div className="bar" />
//         <div className="st"><b>3</b>Payment</div>
//       </div>

//       <div className="mt-6">
//         {/* Special Puja Summary */}
//         <div className="card mb-[18px]">
//           {loadingPuja && <div>Loading...</div>}

//           {specialPuja && (
//             <div>
//               <div className="flex items-center justify-between text-sm mb-2">
//                 <h3 className="serif mb-2 text-[20px]">
//                   {specialPuja.name}
//                 </h3>

//                 {/* <div className="flex items-center gap-1 text-gold-soft">
//                   <IndianRupee className="w-4 h-4" />
//                   <span>₹{totalPrice}</span>
//                 </div> */}
//               </div>

//               <div className="flex items-center justify-between text-sm mb-2">
//                 <div className="text-sm text-muted-foreground mb-2">
//                   {specialPuja.description
//                     .split('\n')
//                     .map((line: any, index: any) => (
//                       <p key={index} className={line ? 'mb-2' : 'h-3'}>
//                         {line}
//                       </p>
//                     ))}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <small>{specialPuja.duration}</small>
//                 </div>
//                 {/* <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4" />
//                   <small>{specialPuja.maxParticipants}</small>
//                 </div> */}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Event Details */}
//         {/* {specialPuja && (
//           <div className="card mb-[18px]">
//             <span className="tag">Event Details</span>

//             <div className="space-y-4">
//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Conducted By</p>
//                 <p className="text-sm">{specialPuja.conductedBy}</p>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <p className="text-xs text-muted-foreground">Location</p>
//                   {specialPuja.googleMaps && (
//                     <a
//                       href={specialPuja.googleMaps}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="bg-surface shadow-lg px-3 py-2 rounded-full text-xs font-medium text-gold-soft whitespace-nowrap"
//                     >
//                       Open Maps →
//                     </a>
//                   )}
//                 </div>
//                 <p className="text-sm font-medium">{specialPuja.locationName}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {specialPuja.locationAddress}
//                 </p>
//               </div>

//             </div>
//           </div>
//         )} */}

//         {/* Schedule Selection */}
//         <div>
//           {slotsList.length > 0 ? (
//             <>
//               <label className="block text-sm text-foreground mb-3">
//                 <Clock className="w-4 h-4 inline mr-2" />
//                 Select Schedule
//               </label>

//               <div className="space-y-3">
//                 {slotsList.map((slot) => (
//                   <button
//                     key={slot.scheduleId}
//                     onClick={() => {
//                       setSelectedSlot(slot);

//                       // const defaultMode =
//                       //   slot.modes.find((m) => m.mode === "ONLINE") ??
//                       //   slot.modes[0] ??
//                       //   null;

//                       // setSelectedMode(defaultMode);
//                       setSelectedMode(null);

//                       // const defaultParticipant =
//                       //   defaultMode?.participantOptions.find((x) => x.isDefault) ??
//                       //   defaultMode?.participantOptions[0] ??
//                       //   null;

//                       // setSelectedParticipantOption(defaultParticipant);
//                       setSelectedParticipantOption(null);

//                       setSelectedAddons([]);

//                       setTimeout(() => {
//                         modeSectionRef.current?.scrollIntoView({
//                           behavior: "smooth",
//                           block: "start",
//                         });
//                       }, 100);
//                     }}
//                     className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
//                       selectedSlot?.scheduleId === slot.scheduleId
//                         ? 'border-gold bg-gold/10 text-gold-soft'
//                         : 'border-border hover:border-gold'
//                     }`}
//                   >
//                     <div className="font-medium">
//                       {new Date(slot.date).toLocaleDateString('en-IN', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric',
//                       })} - {slot.startTime}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </>
//           ) : (
//             !loadingPuja && (
//               <div className="flex items-center justify-center py-6">
//                 <h3 className="text-foreground text-sm">
//                   No Schedules Available
//                 </h3>
//               </div>
//             )
//           )}
//         </div>
//       </div>



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

//                   // setTimeout(() => {
//                   //   participentSectionRef.current?.scrollIntoView({
//                   //     behavior: "smooth",
//                   //     block: "start",
//                   //   });
//                   // }, 100);

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
//           + Select Participants / Family Members (shown whenever a slot is
//           picked — and a mode too, if that slot has modes — regardless of
//           whether the puja carries priced participant options). */}
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

//             {(selectedParticipantOption?.participantCount ?? 0) > 1 &&
//               familyMembers.length <
//                 Math.max(
//                   (selectedParticipantOption?.participantCount ?? 0) - 1,
//                   0
//                 ) && (
//                 <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 mt-4">
//                   <p className="text-sm text-destructive">
//                     This booking requires{" "}
//                     {selectedParticipantOption!.participantCount - 1} family member
//                     {selectedParticipantOption!.participantCount - 1 > 1 ? "s" : ""}.
//                     <br />
//                     You currently have {familyMembers.length}.
//                     <br />
//                     Please add{" "}
//                     {selectedParticipantOption!.participantCount -
//                       1 -
//                       familyMembers.length}{" "}
//                     more family member
//                     {selectedParticipantOption!.participantCount -
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
//                   "specialPujaDraft",
//                   JSON.stringify({
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

//       {showAddonsSection && (
//         <div className="card mt-[18px]">
//           <h3 className="font-medium mb-4">
//             Add-ons
//           </h3>

//           {showAddressPrompt && (
//             <div className="mt-6 rounded-lg bg-gold/10 border border-gold/30 p-4 mb-2">
//               <p className="text-sm text-muted-foreground">
//                 Please add your address. It is required for Prasadam delivery.
//               </p>

//               <button
//                 onClick={() => {
//                   sessionStorage.setItem(
//                     "specialPujaDraft",
//                     JSON.stringify({
//                       selectedSlot,
//                       selectedMode,
//                       selectedParticipantOption,
//                       selectedParticipants,
//                       selectedAddons,
//                     })
//                   );

//                   // navigate("/addressDetails");
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
//             {addonsToShow.map((addon) => {
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
//         <div className="max-w-md mx-auto">
//           <Button
//             fullWidth
//             onClick={handleContinue}
//             disabled={!selectedSlot || (selectedSlot.modes.length > 0 && !selectedMode)}
//           >
//             Continue
//           </Button>
//         </div>
//       </div>
//     </PageShell>
//   );
// }

import { useState, useEffect, useRef  } from 'react';
import { useNavigate, useParams, useLocation, useNavigationType } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { api } from '../api/client';
import { PageShell } from '../components/PageShell';
import { Crumb } from '../components/royale';

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
  startTime: string;
  availableCapacity: number | null;
  modes: Mode[];
};

export function SpecialPujaBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { specialPujaId } = useParams();
  // Distinguishes a fresh visit (PUSH — clicking the puja from the temple's
  // list) from browser Back/Forward (POP). The saved draft should only be
  // restored on POP; otherwise a leftover draft from a previous booking
  // attempt would make Select Participants (and the picked schedule)
  // appear immediately on what the user expects to be a blank form.
  const navigationType = useNavigationType();
  // Passed from TempleDetail.tsx when linking to a Temple Special Puja's
  // booking page. GET /api/special-pujas/{id} doesn't return price or a
  // participant count for these — that data only exists on the
  // temple-scoped list endpoint (as `cost`/`participants`), which needs
  // this id to be fetched.
  const templeIdFromState = (location.state as any)?.templeId;

  const modeSectionRef = useRef<HTMLDivElement>(null);
  const participentSectionRef = useRef<HTMLDivElement>(null);

  if (!specialPujaId) {
    return (
      <PageShell>
        <div className="card py-12 text-center text-muted-foreground">
          Invalid Special Puja
        </div>
      </PageShell>
    );
  }

  const [slotsList, setSlotsList] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [specialPuja, setSpecialPuja] = useState<any>(null);
  const [loadingPuja, setLoadingPuja] = useState(false);

  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

  // const [addons, setAddons] = useState<any[]>([]);

  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const [selectedParticipantOption, setSelectedParticipantOption] =
  useState<ParticipantOption | null>(null);

  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  // Some special-pujas (e.g. Temple Special Pujas) have no `modes` at all,
  // so their add-ons — if any exist on the backend — would need to come
  // from a dedicated endpoint rather than nested inside a mode. This is
  // fetched the same way as seva add-ons, and used as a fallback whenever
  // there's no mode to pull addons from.
  const [specialPujaAddons, setSpecialPujaAddons] = useState<Addon[]>([]);

  const [hasAddress, setHasAddress] = useState(true);

  const [defaultDuration] = useState('30 Min');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const storedProfileCompleted =
      localStorage.getItem('profileCompleted') === 'true';

    if (!storedProfileCompleted) {
      navigate('/profile-details');
      return;
    }

    setLoadingPuja(true);

    api
      .get(`api/special-pujas/${specialPujaId}`)
      .then((response) => {
        const item = response.data;

        setSpecialPuja({
          id: item.id,
          name: item.title,
          description: item.description,
          // The Special Pujas detail endpoint has been seen without a
          // price field at all for Temple Special Pujas (it only shows up
          // as "cost" on the temple-scoped list endpoint). Try known
          // variants here so a naming mismatch doesn't silently produce a
          // 0 amount at checkout the moment backend does add it here.
          price: item.price ?? item.cost ?? item.basePrice ?? 0,
          duration: item.duration || defaultDuration,
          image: item.profileImageUrl,
          maxParticipants: item.maxParticipants,
          providerTemple: item.conductedBy,
          conductedBy: item.conductedBy,
          locationName: item.locationName,
          locationAddress: item.locationAddress,
          googleMaps: item.googleMaps,
        });

        const schedules: Slot[] = [];

        (item.schedule || []).forEach((day: any) => {
          (day.schedules || []).forEach((schedule: any) => {
            schedules.push({
              scheduleId: schedule.scheduleId,
              date: day.date,
              startTime: schedule.startTime,
              availableCapacity: schedule.availableCapacity,
              modes: schedule.modes || []
            });
          });
        });

        setSlotsList(schedules);

        api.get('api/user/family')
        .then((response) => {
          setFamilyMembers(response.data);
        })
        .catch(console.error);

        // api.get(`api/special-pujas/${specialPujaId}/addons`)
        api.get(`api/sevas/${specialPujaId}/addons`)
          .then((res) => {
            setSpecialPujaAddons(res.data ?? []);
          })
          .catch(() => {
            setSpecialPujaAddons([]);
          });

        // Cross-reference the temple-scoped list for whatever the direct
        // detail endpoint is missing (price/participants, for Temple
        // Special Pujas). Only attempted when a templeId was actually
        // passed in via navigation state — direct Special Pujas (no
        // temple link) already have everything they need and skip this.
        if (templeIdFromState) {
          api.get(`api/temples/${templeIdFromState}/special-pujas`)
            .then((res) => {
              const list = Array.isArray(res.data?.items)
                ? res.data.items
                : Array.isArray(res.data)
                  ? res.data
                  : [];
              const match = list.find((p: any) => p.id === specialPujaId);
              if (match) {
                setSpecialPuja((prev: any) => ({
                  ...prev,
                  price: prev?.price || match.cost || match.price || 0,
                  maxParticipants:
                    prev?.maxParticipants || match.participants || match.maxParticipants,
                }));
              }
            })
            .catch(console.error);
        }

        const draft =
          navigationType === "POP"
            ? sessionStorage.getItem("specialPujaDraft")
            : null;
        if (draft) {
          const state = JSON.parse(draft);
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
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoadingPuja(false);
      });
  }, []);


  const handleParticipantChange = (index: number,familyMemberId: string) => {
  const member = familyMembers.find(x => String(x.id) === familyMemberId);

  setSelectedParticipants(prev => {
      const updated = [...prev];
      updated[index] = member;
      return updated.filter(Boolean);
    });
  };

  const handleAddonQuantityChange = (addon: any,quantity: number) => {
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
  const participantPrice = selectedParticipantOption?.price ?? specialPuja?.price ?? 0;
  const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price * addon.quantity,0);
  const totalPrice = participantPrice + addonPrice;

  // Some special-pujas (Temple Special Pujas) have no `modes` populated at
  // all, so Select Participants and Add-ons shouldn't be hidden behind a
  // mode selection that will never happen. Family data is fetched
  // unconditionally, so Select Participants always shows once a slot (and
  // mode, if that slot has one) is picked — matching the seva booking fix.
  const hasModes = !!selectedSlot && selectedSlot.modes.length > 0;
  const showParticipantSection =
    !!selectedSlot && (hasModes ? !!selectedMode : true);

  // Reveal family-member dropdowns one at a time: start with a single
  // dropdown, and only show the next one once the current one has a
  // selection. Capped purely by how many family members exist to choose
  // from — uniformly across modes/participant options, so this behaves
  // the same whether or not the puja has a mode step.
  // const requiredParticipantCount = familyMembers.length;
  // const filledParticipantCount = selectedParticipants.filter(Boolean).length;
  // const visibleParticipantSlots = Math.min(
  //   filledParticipantCount + 1,
  //   requiredParticipantCount
  // );

  const maxAllowedParticipants =
  selectedParticipantOption?.participantCount ??
  specialPuja?.maxParticipants ??
  1;

const filledParticipantCount =
  selectedParticipants.filter(Boolean).length;

const visibleParticipantSlots = Math.min(
  filledParticipantCount + 1,
  maxAllowedParticipants
);

  // Add-ons: prefer the selected mode's addons when one exists and has any
  // (this is how the working "Direct Special Puja" flow — e.g. Sri Chakra
  // Pooja — already gets its addons). Otherwise fall back to the
  // dedicated /api/special-pujas/{id}/addons fetch, for pujas with no
  // modes at all.
  const usingModeAddons =
    hasModes && !!selectedMode && selectedMode.addons.length > 0;
  const addonsToShow = usingModeAddons
    ? selectedMode!.addons
    : specialPujaAddons;
  const showAddonsSection =
    !!selectedSlot &&
    addonsToShow.length > 0 &&
    (hasModes ? !!selectedMode : true);
  const showAddressPrompt =
    !hasAddress &&
    (usingModeAddons ? selectedMode?.mode === "ONLINE" : true);

  const handleContinue = () => {
    if (!selectedSlot) return;

    const bookingData = {
      type: "specialpuja",

      offering: {
        id: specialPuja.id,
        name: specialPuja.name,
        description: specialPuja.description,
        // Base price only — NOT totalPrice. The payment page adds up
        // addonDetails separately for its own "Add-ons" line item, so
        // baking addonPrice into offering.price here double-counts it
        // in the grand total.
        price: participantPrice,
        duration: specialPuja.duration,
        image: specialPuja.image,
        providerTemple: specialPuja.providerTemple
      },

      date: selectedSlot.date,

      slot: {
        scheduleId: selectedSlot.scheduleId,
        startTime: selectedSlot.startTime
      },

      mode: {
        scheduleModeId: selectedMode?.scheduleModeId,
        mode: selectedMode?.mode
      },

      scheduleModeId: selectedMode?.scheduleModeId,
      participantOptionId: selectedParticipantOption?.participantOptionId,

      participantOption: selectedParticipantOption,

      devoteeDetails: selectedParticipants,

      addonDetails: selectedAddons,

      totalPrice
    };

    // Persist the in-progress selections before leaving this page — if the
    // user hits browser Back from /payment (or anywhere downstream), the
    // restore-on-mount logic above puts them right back where they left off
    // instead of resetting to a blank form.
    sessionStorage.setItem(
      "specialPujaDraft",
      JSON.stringify({
        selectedSlot,
        selectedMode,
        selectedParticipantOption,
        selectedParticipants,
        selectedAddons,
      })
    );

    navigate('/payment', {
      state: {
        booking: bookingData,
      },
    });
  };

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

  return (
    <PageShell>
      
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Puja & Seva', to: '/pujas-homas' },
          { label: 'Book' },
        ]}
      />

      <h1 className="page-title">Special Puja Booking</h1>

      {/* Progress Steps — mockup `.stepper` */}
      <div className="stepper">
        <div className="st on"><b>1</b>Schedule</div>
        <div className="bar" />
        <div className="st"><b>2</b>Details</div>
        <div className="bar" />
        <div className="st"><b>3</b>Payment</div>
      </div>

      <div className="mt-6">
        {/* Special Puja Summary */}
        <div className="card mb-[18px]">
          {loadingPuja && <div>Loading...</div>}

          {specialPuja && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <h3 className="serif mb-2 text-[20px]">
                  {specialPuja.name}
                </h3>

                {/* <div className="flex items-center gap-1 text-gold-soft">
                  <IndianRupee className="w-4 h-4" />
                  <span>₹{totalPrice}</span>
                </div> */}
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <div className="text-sm text-muted-foreground mb-2">
                  {specialPuja.description
                    .split('\n')
                    .map((line: any, index: any) => (
                      <p key={index} className={line ? 'mb-2' : 'h-3'}>
                        {line}
                      </p>
                    ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <small>{specialPuja.duration}</small>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <small>{specialPuja.maxParticipants}</small>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        {/* {specialPuja && (
          <div className="card mb-[18px]">
            <span className="tag">Event Details</span>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Conducted By</p>
                <p className="text-sm">{specialPuja.conductedBy}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  {specialPuja.googleMaps && (
                    <a
                      href={specialPuja.googleMaps}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-surface shadow-lg px-3 py-2 rounded-full text-xs font-medium text-gold-soft whitespace-nowrap"
                    >
                      Open Maps →
                    </a>
                  )}
                </div>
                <p className="text-sm font-medium">{specialPuja.locationName}</p>
                <p className="text-sm text-muted-foreground">
                  {specialPuja.locationAddress}
                </p>
              </div>

            </div>
          </div>
        )} */}

        {/* Schedule Selection */}
        <div>
          {slotsList.length > 0 ? (
            <>
              <label className="block text-sm text-foreground mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Select Schedule
              </label>

              <div className="space-y-3">
                {slotsList.map((slot) => (
                  <button
                    key={slot.scheduleId}
                    onClick={() => {
                      setSelectedSlot(slot);

                      // const defaultMode =
                      //   slot.modes.find((m) => m.mode === "ONLINE") ??
                      //   slot.modes[0] ??
                      //   null;

                      // setSelectedMode(defaultMode);
                      setSelectedMode(null);

                      // const defaultParticipant =
                      //   defaultMode?.participantOptions.find((x) => x.isDefault) ??
                      //   defaultMode?.participantOptions[0] ??
                      //   null;

                      // setSelectedParticipantOption(defaultParticipant);
                      setSelectedParticipantOption(null);

                      setSelectedAddons([]);

                      setTimeout(() => {
                        modeSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 100);
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSlot?.scheduleId === slot.scheduleId
                        ? 'border-gold bg-gold/10 text-gold-soft'
                        : 'border-border hover:border-gold'
                    }`}
                  >
                    <div className="font-medium">
                      {new Date(slot.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })} - {slot.startTime}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            !loadingPuja && (
              <div className="flex items-center justify-center py-6">
                <h3 className="text-foreground text-sm">
                  No Schedules Available
                </h3>
              </div>
            )
          )}
        </div>
      </div>



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

                  // setTimeout(() => {
                  //   participentSectionRef.current?.scrollIntoView({
                  //     behavior: "smooth",
                  //     block: "start",
                  //   });
                  // }, 100);

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
          + Select Participants / Family Members (shown whenever a slot is
          picked — and a mode too, if that slot has modes — regardless of
          whether the puja carries priced participant options). */}
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

            {(selectedParticipantOption?.participantCount ?? 0) > 1 &&
              familyMembers.length <
                Math.max(
                  (selectedParticipantOption?.participantCount ?? 0) - 1,
                  0
                ) && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 mt-4">
                  <p className="text-sm text-destructive">
                    This booking requires{" "}
                    {selectedParticipantOption!.participantCount - 1} family member
                    {selectedParticipantOption!.participantCount - 1 > 1 ? "s" : ""}.
                    <br />
                    You currently have {familyMembers.length}.
                    <br />
                    Please add{" "}
                    {selectedParticipantOption!.participantCount -
                      1 -
                      familyMembers.length}{" "}
                    more family member
                    {selectedParticipantOption!.participantCount -
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
                  "specialPujaDraft",
                  JSON.stringify({
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

      {showAddonsSection && (
        <div className="card mt-[18px]">
          <h3 className="font-medium mb-4">
            Add-ons
          </h3>

          {showAddressPrompt && (
            <div className="mt-6 rounded-lg bg-gold/10 border border-gold/30 p-4 mb-2">
              <p className="text-sm text-muted-foreground">
                Please add your address. It is required for Prasadam delivery.
              </p>

              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "specialPujaDraft",
                    JSON.stringify({
                      selectedSlot,
                      selectedMode,
                      selectedParticipantOption,
                      selectedParticipants,
                      selectedAddons,
                    })
                  );

                  // navigate("/addressDetails");
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
            {addonsToShow.map((addon) => {
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
        <div className="max-w-md mx-auto">
          <Button
            fullWidth
            onClick={handleContinue}
            disabled={!selectedSlot || (selectedSlot.modes.length > 0 && !selectedMode)}
          >
            Continue
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
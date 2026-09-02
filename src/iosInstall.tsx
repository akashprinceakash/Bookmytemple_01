import { useEffect, useState } from "react";

export function IOSInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (!isIOS || isStandalone) return;

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={() => setShow(false)}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
          <h2 className="text-lg font-semibold text-[#641220]">
            Install Book My Temples
          </h2>

          <p className="text-gray-600 text-sm mt-3">
            Install the app for a faster experience and easy access.
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <div>1. Tap <strong>Share</strong> ⬆️</div>
            <div>2. Select <strong>Add to Home Screen</strong></div>
            <div>3. Tap <strong>Add</strong></div>
          </div>

          <button
            onClick={() => setShow(false)}
            className="mt-6 w-full rounded-lg bg-[#FF7A00] py-3 text-white font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}
export const openGoogleMaps = (url?: string, location?: string) => {
  if (url) {
    window.open(url, '_blank');
    return;
  }

  if (location) {
    const encoded = encodeURIComponent(location);

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      '_blank'
    );
  }
};
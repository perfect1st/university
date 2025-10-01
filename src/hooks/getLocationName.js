const getLocationName = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${'AIzaSyAGlpOmeTxThm0dIpuEZ4WaZEhQ5IJwEc0'}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address; // or pick another result
    } else {
      console.error("No results found or error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

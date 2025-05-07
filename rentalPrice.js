function getSeason(pickupDate, dropoffDate) {
  const startMonth = 4, endMonth = 10;
  const pickup = new Date(pickupDate).getMonth();
  const dropoff = new Date(dropoffDate).getMonth();

  const isHighSeason =
    (pickup >= startMonth && pickup <= endMonth) ||
    (dropoff >= startMonth && dropoff <= endMonth) ||
    (pickup < startMonth && dropoff > endMonth);

  return isHighSeason ? "High" : "Low";
}

function getDays(pickupDate, dropoffDate) {
  const MS_PER_DAY = 86_400_000;
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);
  const today = new Date();
  today.setHours(1, 59, 0, 0);

  if (start > end || start < today) return null;

  const days = Math.round((end - start) / MS_PER_DAY) + 1;
  return days;
}

function getLicenseYears(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  if (start > now) return 0;

  const msInYear = 365.25 * 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / msInYear);
}

function price(licenseStart, pickupDate, dropoffDate, type, age) {
  const days = getDays(pickupDate, dropoffDate);
  const season = getSeason(pickupDate, dropoffDate);
  const licenseYears = getLicenseYears(licenseStart);

  if (age < 18) return "Driver too young - cannot quote the price";
  if (licenseYears < 1) return "Unable to rent because of driving license";
  if (!days) return "Invalid date";
  if (age <= 21 && type !== "Compact") return "Drivers 21 y/o or less can only rent Compact vehicles";

  let rentalPrice = age;

  if (licenseYears < 3 && season === "High") rentalPrice += 15;
  if (licenseYears < 2) rentalPrice *= 1.3;
  if (type === "Racer" && age <= 25 && season === "High") rentalPrice *= 1.5;
  if (season === "High") rentalPrice *= 1.15;
  if (days > 10 && season === "Low") rentalPrice *= 0.9;

  return `$${rentalPrice.toFixed(2)}`;
}

exports.price = price;

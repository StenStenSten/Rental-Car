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
  const licenseYears = getLicenseYears(licenseStart);

  if (age < 18) return "Driver too young - cannot quote the price";
  if (licenseYears < 1) return "Unable to rent because of driving license";
  if (!days) return "Invalid date";
  if (age <= 21 && type !== "Compact") return "Drivers 21 y/o or less can only rent Compact vehicles";

  let rentalPrice = age;

  const start = new Date(pickupDate);
  let weekendDays = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay(); // 0 = Sunday, 6 = Saturday
    if (dow === 0 || dow === 6) weekendDays++;
  }

  const weekdayDays = days - weekendDays;
  const dailyRate = rentalPrice / days;
  rentalPrice = (dailyRate * weekdayDays) + (dailyRate * weekendDays * 1.05);

  return `$${rentalPrice.toFixed(2)}`;
}



exports.price = price;

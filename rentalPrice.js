
function price(pickup, dropoff, pickupDate, dropoffDate, type, age, driverslicencedate) {
  const clazz = getClazz(type); //returns the same type 
  const days = get_days(pickupDate, dropoffDate); //returns renting period in days
  const season = getSeason(pickupDate, dropoffDate); //checks if the date is in high or low season
  const licenceYears = driverLicenceCalc(pickupDate, driverslicencedate); //returns licence years gap 
  const MinimumRentAge = 18;
  const USDrinkingAge = 21;
  const QuarterCenturyAge = 25; 

  if (licenceYears < 1) {
    return "Driver's license must be held for at least one year to rent a car.";
  }
  
  if (age < MinimumRentAge) {
      return "Driver too young - cannot quote the price";
    }
    
    if (age <= USDrinkingAge && clazz !== "Compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }
    
    let rentalprice = age * days;
    
    if(licenceYears < 3 && season == "High"){
        rentalprice + 15;
    }
    
    if(licenceYears < 2){
      rentalprice *= 1.3;
    }


  if (clazz === "Racer" && age <= QuarterCenturyAge && season === "High") {
      rentalprice *= 1.5;
  }

  if (season === "High" ) {
    rentalprice *= 1.15;
  }

  if (days > 10 && season === "Low" ) {
      rentalprice *= 0.9;
  }

  return '$' + rentalprice;
}

function driverLicenceCalc(pickupDate, driverslicencedate){
  const firstDate = new Date(pickupDate);
  const secondDate = new Date(driverslicencedate);

  // Calculate the difference in years
  let yearsDifference = firstDate.getFullYear() - secondDate.getFullYear();
  
  // Adjust the years difference if the current year's month and day haven't passed yet
  const monthDifference = firstDate.getMonth() - secondDate.getMonth();
  const dayDifference = firstDate.getDate() - secondDate.getDate();

  // If the pickup month is before the license issue month, or if it's the same month but the day hasn't passed yet, subtract 1 from yearsDifference
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    yearsDifference--;
  }

  return yearsDifference;  // This will return the number of years between the two dates
}


function getClazz(type) { 
  switch (type) {
      case "Compact":
          return "Compact";
      case "Electric":
          return "Electric";
      case "Cabrio":
          return "Cabrio";
      case "Racer":
          return "Racer";
      default:
          return "Unknown";
  }
}

function get_days(pickupDate, dropoffDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(pickupDate);
  const secondDate = new Date(dropoffDate);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1; // this function is used to round the number of days, +1 Ensures that even a single-day rental counts as at least 1 day.
}

function getSeason(pickupDate, dropoffDate) {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);

  const start = 4; 
  const end = 10;

  const pickupMonth = pickup.getMonth();
  const dropoffMonth = dropoff.getMonth();

  if ( 
      (pickupMonth >= start && pickupMonth <= end) || //if pickup month is in high season
      (dropoffMonth >= start && dropoffMonth <= end) ||//if dropoff month is in high season
      (pickupMonth < start && dropoffMonth > end) //if pickup and dropoff is outside of high season
  ) {
      return "High";
  } else {
      return "Low";
  }
}

exports.price = price;
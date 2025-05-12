const { price } = require('../rentalPrice');

// Helper to format dates as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Returns a future date X days from now
function futureDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

// Returns a date with month offset (to test seasons)
function futureDateWithMonthOffset(offset) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  return formatDate(date);
}

describe('price function tests', () => {
  test('returns error for age under 18', () => {
    const result = price(
      formatDate(new Date('2020-01-01')),
      futureDate(1),
      futureDate(3),
      'Compact',
      17
    );
    expect(result).toBe("Driver too young - cannot quote the price");
  });

  test('returns error for license less than 1 year old', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear());
    const result = price(
      formatDate(licenseStart),
      futureDate(1),
      futureDate(3),
      'Compact',
      25
    );
    expect(result).toBe("Unable to rent because of driving license");
  });

  test('returns error for invalid date (pickup > dropoff)', () => {
    const result = price(
      formatDate(new Date('2020-01-01')),
      futureDate(5),
      futureDate(2),
      'Compact',
      25
    );
    expect(result).toBe("Invalid date");
  });

  test('returns error for pickup date in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);
    const result = price(
      formatDate(new Date('2020-01-01')),
      formatDate(pastDate),
      futureDate(5),
      'Compact',
      25
    );
    expect(result).toBe("Invalid date");
  });

  test('returns error for young drivers renting non-Compact', () => {
    const result = price(
      formatDate(new Date('2020-01-01')),
      futureDate(1),
      futureDate(3),
      'Cabrio',
      21
    );
    expect(result).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
  });

  test('valid rental: high season, license < 3yrs, Racer, age 25', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 2);
    const result = price(
      formatDate(licenseStart),
      '2026-07-01',
      '2026-07-10',
      'Racer',
      25
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('valid rental: low season, >10 days, discount applies', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 5);
    const result = price(
      formatDate(licenseStart),
      '2026-01-01',
      '2026-01-15',
      'Compact',
      35
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('pickup in low, dropoff in high season', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 5);
    const result = price(
      formatDate(licenseStart),
      '2026-04-01',
      '2026-07-01',
      'Compact',
      30
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('pickup before April and dropoff after October', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 5);
    const result = price(
      formatDate(licenseStart),
      '2026-03-01',
      '2026-11-01',
      'Compact',
      30
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('license less than 2 years, high season', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 1);
    const result = price(
      formatDate(licenseStart),
      '2026-08-01',
      '2026-08-05',
      'Compact',
      30
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('license over 3 years, low season, <=10 days', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 4);
    const result = price(
      formatDate(licenseStart),
      '2026-12-01',
      '2026-12-05',
      'Compact',
      30
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('rental for 1 day', () => {
    const licenseStart = new Date();
    licenseStart.setFullYear(licenseStart.getFullYear() - 3);
    const date = futureDate(1);
    const result = price(
      formatDate(licenseStart),
      date,
      date,
      'Compact',
      30
    );
    expect(result).toMatch(/^\$\d+\.\d{2}$/);
  });
  test('license start date in the future', () => {
    const futureLicenseStart = new Date();
    futureLicenseStart.setFullYear(futureLicenseStart.getFullYear() + 1); 
    const result = price(
      formatDate(futureLicenseStart),
      futureDate(1),
      futureDate(5),
      'Compact',
      25
    );
    expect(result).toBe("Unable to rent because of driving license");
  });
});

const { price } = require('../rentalPrice');

// Helper function to format a date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

describe('Weekend pricing tests', () => {
  test('50 y/o rents Mon–Wed (no weekend) — no price increase', () => {
    const today = new Date();
    // Get the upcoming Monday
    today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));

    const mon = new Date(today);
    const tue = new Date(today); tue.setDate(mon.getDate() + 1);
    const wed = new Date(today); wed.setDate(mon.getDate() + 2);

    const result = price(
      formatDate(new Date(today.getFullYear() - 30, 0, 1)), // license issued 30 years ago
      formatDate(mon),
      formatDate(wed),
      "Compact",
      50
    );

    expect(result).toBe('$50.00');
  });

  test('50 y/o rents Thu–Sat (1 weekend day) — price includes 5% increase for Sat', () => {
    const today = new Date();
    // Get the upcoming Thursday
    today.setDate(today.getDate() + ((4 + 7 - today.getDay()) % 7));

    const thu = new Date(today);
    const fri = new Date(today); fri.setDate(thu.getDate() + 1);
    const sat = new Date(today); sat.setDate(thu.getDate() + 2);

    const result = price(
      formatDate(new Date(today.getFullYear() - 30, 0, 1)), // license issued 30 years ago
      formatDate(thu),
      formatDate(sat),
      "Compact",
      50
    );

    // Thu + Fri + Sat = 3 days
    // 2 weekdays + 1 weekend day (5% increase for 1/3 of the price)
    // (50 / 3) * 2 + ((50 / 3) * 1 * 1.05) ≈ $50 * 1.0167 = $50.83
    expect(result).toBe('$50.83');
  });
});

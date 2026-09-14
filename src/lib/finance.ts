export const MONTHLY_RATES: Record<number, number> = {
  1: 0.012,
  2: 0.025,
  3: 0.038,
  4: 0.05,
  5: 0.063,
  6: 0.075,
  7: 0.087,
  8: 0.1,
  9: 0.112,
  10: 0.125,
  11: 0.137,
  12: 0.15,
  13: 0.162,
  14: 0.175,
  15: 0.187,
  16: 0.2,
  17: 0.212,
  18: 0.225,
  19: 0.237,
  20: 0.25,
  21: 0.262,
  22: 0.275,
  23: 0.287,
  24: 0.3,
};

export const TERM_OPTIONS = Object.keys(MONTHLY_RATES).map(Number);

export const APP_FEE_RATIO = 0;

export function projectInvestment(amount: number, terms: number) {
  const rate = MONTHLY_RATES[terms] ?? 0;
  const gross = amount * rate;
  const fee = gross * APP_FEE_RATIO;
  const net = gross - fee;
  return { rate, gross, fee, net, total: amount + net };
}

export function projectCredit(amount: number, cuotas: number) {
  const rate = MONTHLY_RATES[cuotas] ?? 0;
  const total = amount + amount * rate;
  return { rate, total, monthly: total / cuotas };
}

export function ratePercent(rate: number) {
  return Math.round(rate * 100);
}

export function ratePercentMonthly(rate: number, months: number) {
  return Math.round((rate / Math.max(1, months)) * 100 * 10) / 10;
}
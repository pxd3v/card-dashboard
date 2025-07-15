export function centsToDollars(cents: BigInt | number): number {
  return Number(cents) / 100;
}
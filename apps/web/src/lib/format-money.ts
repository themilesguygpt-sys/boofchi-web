import type { Money } from "@boofchi/contracts";

const tomanFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

export function formatMoney(money: Money): string {
  if (money.unit !== "TOMAN") {
    throw new Error(`Unsupported money unit: ${money.unit}`);
  }

  if (!Number.isSafeInteger(money.amount)) {
    throw new Error("Money amounts must be safe integers.");
  }

  return `${tomanFormatter.format(money.amount)} تومان`;
}

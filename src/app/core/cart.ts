import { Injectable, computed, signal } from '@angular/core';
import { Product, Variant, Voucher } from './models';
export interface CartLine {
  variantId: number;
  slug: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}
/** The browser estimates totals; the server revalidates prices, vouchers and inventory at checkout. */
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly lines = signal<CartLine[]>([]);
  readonly open = signal(false);
  readonly checkout = signal(false);
  readonly voucher = signal('');
  readonly voucherRule = signal<Voucher | null>(null);
  readonly shippingRule = signal({ freeShippingThreshold: 199000, shippingFee: 25000 });
  readonly orderCode = signal('');
  readonly discount = computed(() => {
    const rule = this.voucherRule();
    if (!rule || rule.code !== this.voucher() || this.total() < (rule.minOrderAmount || 0))
      return 0;
    const amount =
      rule.discountType === 'percent'
        ? Math.round((this.total() * rule.discountValue) / 100)
        : rule.discountValue;
    return Math.min(this.total(), rule.maxDiscount ?? Infinity, amount);
  });
  readonly shipping = computed(() =>
    this.count() && this.total() < this.shippingRule().freeShippingThreshold
      ? this.shippingRule().shippingFee
      : 0,
  );
  readonly payable = computed(() => this.total() - this.discount() + this.shipping());
  readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  readonly total = computed(() =>
    this.lines().reduce((sum, line) => sum + line.price * line.quantity, 0),
  );
  add(product: Product, variant: Variant, quantity: number) {
    if (
      !Number.isFinite(quantity) ||
      quantity < 1 ||
      !Number.isFinite(variant.price) ||
      variant.price! < 0
    )
      return false;
    if (variant.stockStatus === 'out_of_stock' || variant.stockQty === 0 || variant.price == null)
      return false;
    const current = this.lines().find((line) => line.variantId === variant.id);
    const requested = (current?.quantity || 0) + Math.max(1, Math.floor(quantity));
    if (variant.stockQty != null && requested > variant.stockQty) return false;
    this.lines.update((lines) =>
      current
        ? lines.map((line) =>
            line.variantId === variant.id
              ? { ...line, quantity: requested, price: variant.price! }
              : line,
          )
        : [
            ...lines,
            {
              variantId: variant.id,
              slug: product.slug,
              name: product.name,
              sku: variant.sku,
              price: variant.price!,
              quantity: requested,
            },
          ],
    );
    this.open.set(true);
    return true;
  }
  remove(id: number) {
    this.lines.update((lines) => lines.filter((line) => line.variantId !== id));
  }
}

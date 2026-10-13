import { CartService } from './cart';
import { Product, Variant } from './models';

describe('Temporary cart', () => {
  it('applies the demo voucher threshold/cap and shipping threshold', () => {
    const cart = new CartService();
    const item = {
      id: 8,
      sku: 'SKU',
      price: 125000,
      stockQty: 10,
      stockStatus: 'in_stock',
    } as Variant;
    cart.add({ id: 1, name: 'Demo', slug: 'demo' } as Product, item, 1);
    cart.voucher.set('SHIN22');
    cart.voucherRule.set({
      id: 1,
      code: 'SHIN22',
      name: 'Test',
      discountType: 'percent',
      discountValue: 22,
      maxDiscount: 50000,
      minOrderAmount: 99000,
    });
    expect(cart.discount()).toBe(27500);
    expect(cart.shipping()).toBe(25000);
    expect(cart.payable()).toBe(122500);
    cart.add({ id: 1, name: 'Demo', slug: 'demo' } as Product, item, 1);
    expect(cart.discount()).toBe(50000);
    expect(cart.shipping()).toBe(0);
    expect(cart.payable()).toBe(200000);
  });
  const product = { id: 1, name: 'Bộ đồ', slug: 'bo-do' } as Product;
  const variant = {
    id: 7,
    sku: 'SKU-7',
    price: 150000,
    stockQty: 3,
    stockStatus: 'in_stock',
  } as Variant;
  it('combines the same SKU, rejects quantities above stock and computes the total', () => {
    const cart = new CartService();
    expect(cart.add(product, variant, 1)).toBe(true);
    expect(cart.add(product, variant, 2)).toBe(true);
    expect(cart.lines().length).toBe(1);
    expect(cart.count()).toBe(3);
    expect(cart.total()).toBe(450000);
    expect(cart.add(product, variant, 1)).toBe(false);
    expect(cart.count()).toBe(3);
    cart.remove(7);
    expect(cart.total()).toBe(0);
  });
  it('rejects missing prices, unavailable stock and invalid quantities', () => {
    const cart = new CartService();
    expect(cart.add(product, { ...variant, price: undefined }, 1)).toBe(false);
    expect(cart.add(product, { ...variant, stockQty: 0 }, 1)).toBe(false);
    expect(cart.add(product, { ...variant, stockStatus: 'out_of_stock' }, 1)).toBe(false);
    expect(cart.add(product, variant, NaN)).toBe(false);
    expect(cart.add(product, variant, Infinity)).toBe(false);
    expect(cart.count()).toBe(0);
  });
});

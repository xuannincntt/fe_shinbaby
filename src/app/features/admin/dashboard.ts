import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../core/auth';
import { errorMessage } from '../../core/api';
import { ManagementApi, AdminRow, AdminResource, camel, labels } from '../../core/management';
import { Page } from '../../core/models';
import { Icon } from '../../shared/icon';
import { ReferenceArt } from '../../shared/reference-art';
import { DialogFocus } from '../../shared/dialog-focus';
import { ContentEditor } from './content-editor';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    RouterLinkActive,
    Icon,
    ReferenceArt,
    DialogFocus,
    ContentEditor,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./overview.scss', './dashboard.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  readonly auth = inject(AuthService);
  private readonly api = inject(ManagementApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly schema = signal<AdminResource[]>([]);
  readonly resource = signal<AdminResource | null>(null);
  readonly mode = signal('overview');
  readonly result = signal<Page<AdminRow> | null>(null);
  readonly stats = signal<AdminRow>({});
  readonly busy = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly editor = signal(false);
  readonly confirm = signal<AdminRow | null>(null);
  readonly mobile = signal(false);
  readonly selected = signal<AdminRow | null>(null);
  readonly options = signal<Record<string, AdminRow[]>>({});
  readonly linked = signal<AdminRow[]>([]);
  readonly attributeOptions = signal<AdminRow[]>([]);
  readonly orderItems = signal<AdminRow[]>([]);
  readonly groups = [
    'Cửa hàng',
    'Khuyến mãi',
    'Nội dung website',
    'Khách hàng',
    'Vận hành',
    'Hệ thống',
  ];
  readonly overviewCards = [
    { key: 'products', label: 'Sản phẩm', icon: 'box', resource: 'products', tone: 'pink' },
    { key: 'orders', label: 'Đơn hàng', icon: 'cart', resource: 'orders', tone: 'blue' },
    { key: 'leads', label: 'Yêu cầu tư vấn', icon: 'headset', resource: 'leads', tone: 'green' },
    {
      key: 'pendingReviews',
      label: 'Đánh giá chờ duyệt',
      icon: 'star',
      resource: 'reviews',
      tone: 'amber',
    },
  ];
  search = '';
  model: AdminRow = {};
  valueIds: number[] = [];
  campaignItem: AdminRow = { productId: null, promoPrice: null, sortOrder: 0 };
  orderState = '';
  orderNote = '';
  private subscriptions = new Subscription();
  readonly label = (value: unknown) => labels[String(value)] || String(value ?? '—');
  readonly camel = camel;
  ngOnInit() {
    this.busy.set(true);
    this.subscriptions.add(
      forkJoin({ schema: this.api.schema(), stats: this.api.dashboard() }).subscribe({
        next: ({ schema, stats }) => {
          this.schema.set(schema);
          this.stats.set(stats);
          this.subscriptions.add(
            this.route.paramMap.subscribe((params) => {
              this.mode.set(params.get('resource') || 'overview');
              this.resource.set(schema.find((s) => s.key === this.mode()) || null);
              this.search = '';
              this.error.set('');
              this.message.set('');
              this.editor.set(false);
              this.mobile.set(false);
              this.load();
            }),
          );
        },
        error: (e) => {
          this.fail(e);
          this.busy.set(false);
        },
      }),
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  resources(group: string) {
    return this.schema().filter((r) => r.group === group);
  }
  icon(group: string) {
    return (
      (
        {
          'Cửa hàng': 'box',
          'Khuyến mãi': 'gift',
          'Nội dung website': 'grid',
          'Khách hàng': 'user',
          'Vận hành': 'truck',
          'Hệ thống': 'shield',
        } as Record<string, string>
      )[group] || 'grid'
    );
  }
  load(page = 1) {
    const r = this.resource();
    this.busy.set(true);
    this.error.set('');
    if (!r) {
      this.api
        .dashboard()
        .pipe(finalize(() => this.busy.set(false)))
        .subscribe({ next: (v) => this.stats.set(v), error: (e) => this.fail(e) });
      return;
    }
    const query: Record<string, string | number> = { q: this.search, page, limit: 20 };
    const productId = this.route.snapshot.queryParamMap.get('productId');
    if (productId) query['productId'] = productId;
    const variantId = this.route.snapshot.queryParamMap.get('variantId');
    if (variantId) query['variantId'] = variantId;
    for (const field of r.fields)
      if (field.relation && !this.options()[field.relation]) this.asyncOptions(field.relation);
    this.api
      .list(r.key, query)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({ next: (v) => this.result.set(v), error: (e) => this.fail(e) });
  }
  columns() {
    const r = this.resource();
    if (!r) return [];
    if (r.readOnly)
      return (
        r.key === 'orders'
          ? ['orderNo', 'customerName', 'phone', 'totalAmount', 'status', 'createdAt']
          : r.key === 'admin_users'
            ? ['displayName', 'email', 'status', 'lastLoginAt']
            : ['action', 'entityType', 'entityId', 'createdAt']
      ).map((key) => ({ key, label: this.label(key) }));
    return r.fields
      .filter(
        (f) =>
          !['textarea', 'url', 'checkbox', 'datetime-local'].includes(f.type) &&
          !['slug', 'brand', 'barcode'].includes(f.key),
      )
      .slice(0, 5)
      .map((f) => ({ key: camel(f.key), label: f.label }));
  }
  cell(row: AdminRow, key: string) {
    const f = this.resource()?.fields.find((f) => camel(f.key) === key);
    if (f?.relation) {
      const related = this.options()[f.relation]?.find((v) => Number(v['id']) === Number(row[key]));
      return related?.['label'] || '#' + row[key];
    }
    if (key === 'isActive') return Number(row[key]) === 1 ? 'Đang hiển thị' : 'Tạm ẩn';
    if (
      key === 'status' ||
      key === 'stockStatus' ||
      key === 'priceType' ||
      key === 'discountType' ||
      key === 'placement' ||
      key === 'mediaType'
    )
      return this.label(row[key]);
    return row[key] ?? '—';
  }
  isMoney(key: string) {
    return ['amount', 'totalAmount', 'promoPrice', 'minOrderAmount', 'maxDiscount'].includes(key);
  }
  picture(row: AdminRow) {
    return (
      row['homeImageUrl'] ||
      row['imageUrl'] ||
      (row['mediaType'] === 'image' ? row['url'] : null) ||
      row['coverImageUrl'] ||
      row['avatarUrl']
    );
  }
  asyncOptions(relation: string, q = '') {
    this.api.options(relation, q).subscribe({
      next: (rows) => this.options.update((v) => ({ ...v, [relation]: rows })),
      error: (e) => this.fail(e),
    });
  }
  open(row: AdminRow | null = null) {
    const r = this.resource();
    if (!r) return;
    this.selected.set(row);
    this.model = {};
    this.linked.set([]);
    this.campaignItem = { productId: null, promoPrice: null, sortOrder: 0 };
    this.orderItems.set([]);
    this.valueIds = [];
    this.error.set('');
    for (const f of r.fields) {
      const k = camel(f.key);
      let v =
        row?.[k] ??
        (f.type === 'checkbox'
          ? 1
          : f.type === 'number'
            ? f.required
              ? 0
              : null
            : f.type === 'select'
              ? f.options[0]
              : '');
      if (f.type === 'datetime-local' && v) v = this.localDate(v);
      this.model[k] = f.type === 'checkbox' ? !!Number(v) : v;
      if (f.relation) {
        this.asyncOptions(f.relation);
        if (row?.[k])
          this.api.get(f.relation, Number(row[k])).subscribe({
            next: (related) => {
              this.options.update((all) => ({
                ...all,
                [f.relation!]: [
                  ...(all[f.relation!] || []).filter((v) => v['id'] !== related['id']),
                  {
                    id: related['id'],
                    label: related['name'] || related['sku'] || related['value'],
                  },
                ],
              }));
            },
          });
      }
    }
    if (!row && r.key === 'products') this.model['brand'] = 'Shinbaby';
    if (!row && r.key === 'campaigns') this.model['type'] = 'promotion';
    if (!row && this.route.snapshot.queryParamMap.get('productId'))
      this.model['productId'] = Number(this.route.snapshot.queryParamMap.get('productId'));
    if (!row && r.key === 'product_prices') {
      this.model['variantId'] = Number(this.route.snapshot.queryParamMap.get('variantId')) || '';
      this.model['isActive'] = true;
    }
    if (row && r.key === 'product_variants') {
      this.api.variantValues(row['id']).subscribe({
        next: (v) => (this.valueIds = v.map((x) => Number(x['id']))),
        error: (e) => this.fail(e),
      });
      this.api
        .list('attribute_values', { limit: 100 })
        .subscribe({ next: (v) => this.attributeOptions.set(v.data), error: (e) => this.fail(e) });
    }
    if (row && r.key === 'campaigns') {
      this.loadCampaign();
      this.asyncOptions('products');
    }
    if (row && r.key === 'orders') {
      this.orderState = row['status'];
      this.orderNote = row['adminNote'] || '';
      this.api
        .orderItems(row['id'])
        .subscribe({ next: (v) => this.orderItems.set(v), error: (e) => this.fail(e) });
    }
    this.editor.set(true);
  }
  localDate(value: string) {
    const d = new Date(value);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  save() {
    const r = this.resource();
    if (!r || this.saving()) return;
    const value = { ...this.model };
    for (const f of r.fields) {
      const k = camel(f.key);
      if (f.type === 'datetime-local')
        value[k] = value[k] ? new Date(value[k]).toISOString() : null;
      if (f.type === 'relation' || f.type === 'number')
        value[k] = value[k] === '' || value[k] == null ? null : Number(value[k]);
    }
    this.saving.set(true);
    this.error.set('');
    this.api
      .save(r.key, value, this.selected()?.['id'])
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (row) => {
          this.message.set(
            'Đã lưu ' + r.title.toLowerCase() + '. Thay đổi được áp dụng trên website.',
          );
          this.selected.set(row);
          this.editor.set(false);
          this.load(this.result()?.meta.page || 1);
        },
        error: (e) => this.fail(e),
      });
  }
  remove() {
    const row = this.confirm(),
      r = this.resource();
    if (!row || !r) return;
    this.saving.set(true);
    this.api
      .delete(r.key, row['id'])
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.confirm.set(null);
          this.message.set('Đã cập nhật dữ liệu.');
          this.load();
        },
        error: (e) => this.fail(e),
      });
  }
  deletion() {
    return this.resource()?.deletion === 'archive'
      ? 'Lưu trữ'
      : this.resource()?.deletion === 'hide'
        ? 'Ẩn'
        : 'Xóa';
  }
  imageField(key: string) {
    return /image|avatar|photo/.test(key) || (key === 'url' && this.model['mediaType'] === 'image');
  }
  upload(event: Event, key: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.saving.set(true);
    this.api
      .upload(file)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (v) => {
          this.model[key] = v.url;
          this.message.set('Đã tải ảnh. Bấm Lưu thay đổi để áp dụng.');
        },
        error: (e) => this.fail(e),
      });
  }
  toggleValue(id: number, checked: boolean) {
    this.valueIds = checked ? [...this.valueIds, id] : this.valueIds.filter((v) => v !== id);
  }
  saveValues() {
    this.saving.set(true);
    this.api
      .saveVariantValues(this.selected()!['id'], this.valueIds)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.message.set('Đã lưu thuộc tính của phiên bản.'),
        error: (e) => this.fail(e),
      });
  }
  searchValues(q: string) {
    this.api.list('attribute_values', { q, limit: 100 }).subscribe({
      next: (v) =>
        this.attributeOptions.update((old) => [
          ...old.filter(
            (item) =>
              this.valueIds.includes(Number(item['id'])) &&
              !v.data.some((row) => row['id'] === item['id']),
          ),
          ...v.data,
        ]),
      error: (e) => this.fail(e),
    });
  }
  loadCampaign() {
    this.api
      .campaignProducts(this.selected()!['id'])
      .subscribe({ next: (v) => this.linked.set(v), error: (e) => this.fail(e) });
  }
  addCampaign() {
    if (!this.campaignItem['productId']) return;
    this.saving.set(true);
    this.api
      .saveCampaignProduct(this.selected()!['id'], this.campaignItem)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.loadCampaign();
          this.message.set('Đã lưu sản phẩm áp dụng.');
        },
        error: (e) => this.fail(e),
      });
  }
  removeCampaign(id: number) {
    this.api
      .removeCampaignProduct(this.selected()!['id'], id)
      .subscribe({ next: () => this.loadCampaign(), error: (e) => this.fail(e) });
  }
  saveOrder() {
    this.saving.set(true);
    this.api
      .orderStatus(this.selected()!['id'], this.orderState, this.orderNote)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.editor.set(false);
          this.message.set('Đã cập nhật đơn hàng.');
          this.load();
        },
        error: (e) => this.fail(e),
      });
  }
  orderStates() {
    const old = this.selected()?.['status'];
    return [
      old,
      ...((
        {
          pending: ['processing', 'cancelled'],
          processing: ['shipped', 'cancelled'],
          shipped: ['completed'],
        } as Record<string, string[]>
      )[old] || []),
    ];
  }
  displayDetails(row: AdminRow) {
    return Object.entries(row)
      .filter(([k, v]) => v != null && !['afterJson', 'beforeJson', 'shippingAddress'].includes(k))
      .map(([key, value]) => ({
        key,
        label: this.label(key),
        value: typeof value === 'object' ? JSON.stringify(value) : this.label(value),
      }));
  }
  address() {
    try {
      return JSON.parse(this.selected()?.['shippingAddress'] || '{}').address || '—';
    } catch {
      return this.selected()?.['shippingAddress'] || '—';
    }
  }
  logout() {
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/dang-nhap'),
      error: (e) => this.fail(e),
    });
  }
  private fail(e: unknown) {
    this.error.set(errorMessage(e));
  }
}

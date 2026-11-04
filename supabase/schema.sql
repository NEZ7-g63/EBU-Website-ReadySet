-- Chạy trong Supabase: Project → SQL Editor → New query → dán toàn bộ file này → Run.
-- Chỉ cần chạy 1 lần khi mới tạo project.

create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  payment_method text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_address text not null,
  customer_city text,
  customer_district text,
  customer_ward text,
  customer_note text,
  lines jsonb not null,
  subtotal_amount integer not null,
  shipping_fee_amount integer not null,
  total_amount integer not null
);

create index if not exists orders_created_at_idx on orders (created_at desc);

-- Project ĐÃ chạy schema này từ trước (bảng orders đã tồn tại) thì "create table if not
-- exists" ở trên sẽ bị bỏ qua, không tự thêm cột mới — chạy thêm dòng dưới đây 1 lần để
-- có cột customer_ward (form địa chỉ 3 cấp: Tỉnh/Quận huyện/Phường xã):
alter table orders add column if not exists customer_ward text;

-- Bảng này chỉ được đọc/ghi qua service role key ở server (app/lib/data/orders.ts),
-- không có client nào gọi thẳng từ trình duyệt, nên không cần bật Row Level Security.

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  phone text,
  password_hash text not null
);

create index if not exists customers_email_idx on customers (lower(email));

-- Cũng chỉ đọc/ghi qua service role key ở server (lib/data/customers.ts) — mật khẩu
-- luôn được băm (scrypt) trước khi lưu, không bao giờ lưu mật khẩu gốc.

-- Sản phẩm — thêm/sửa/xoá ở /admin/products. Mỗi dòng giữ nguyên 1 object RawProduct
-- (xem lib/data/products.ts) trong cột "data". Bảng trống thì vào /admin/products bấm
-- "Nhập sản phẩm mẫu" để chép các sản phẩm đang viết sẵn trong code vào đây.
create table if not exists products (
  handle text primary key,
  created_at timestamptz not null default now(),
  data jsonb not null
);

-- Ảnh sản phẩm upload từ trang admin — bucket công khai để trang web hiển thị trực tiếp.
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

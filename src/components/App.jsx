import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { banners, categories, money, products } from "../js/products.js";
import {
  getSession,
  login,
  logout,
  restoreSession,
  signup,
} from "../js/authStore.js";
import {
  getValidationErrors,
  loginSchema,
  signupSchema,
} from "../js/authValidation.js";
import {
  loadCart,
  loadOrders,
  loadWishlist,
  saveCart,
  saveOrders,
  saveWishlist,
} from "../js/commerceStore.js";

function Icon({ name, className = "size-5" }) {
  const paths = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    bag: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    star: (
      <path d="m12 2.5 3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3-5.9 3 1.1-6.4-4.7-4.6 6.5-1 3-6Z" />
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    shield: (
      <path d="M12 3 4.5 6v5c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10V6L12 3Z" />
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M19 12a7 7 0 1 0-2 5" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg
      className={`${className} fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Logo({ compact = false }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 text-left"
      aria-label="Go to home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-[#ff5a1f] text-white shadow-sm">
        <Icon name="bag" className="size-5" />
      </span>
      {!compact && (
        <span>
          <strong className="block font-display text-xl leading-none tracking-[-.8px] text-[#172b25]">
            ReMarket
          </strong>
          <small className="mt-0.5 block text-[9px] font-bold uppercase tracking-[1.5px] text-[#ff5a1f]">
            shop everything
          </small>
        </span>
      )}
    </button>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-[#172b25] text-white">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4 text-[10px] font-bold tracking-wide sm:justify-between sm:px-6 lg:px-8">
        <span className="hidden sm:block">
          Download the ReMarket app for exclusive offers
        </span>
        <span>
          <strong className="text-[#ffb08f]">FREE DELIVERY</strong> on orders
          above ₹999
        </span>
        <span className="hidden items-center gap-4 sm:flex">
          <button type="button">Help & Support</button>
          <button type="button">Track Order</button>
        </span>
      </div>
    </div>
  );
}

function Header({
  query,
  setQuery,
  setCategory,
  setView,
  cartCount,
  wishlistCount,
}) {
  const suggestions = query.trim()
    ? products
        .filter((product) =>
          `${product.name} ${product.brand}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 4)
    : [];
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <AnnouncementBar />
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 sm:px-6 lg:px-8">
        <div onClick={() => setView("home")}>
          <Logo />
        </div>
        <button
          type="button"
          className="hidden items-center gap-2 text-left text-xs text-slate-500 lg:flex"
        >
          <Icon name="pin" />
          <span>
            Deliver to
            <br />
            <strong className="text-sm text-[#172b25]">Bengaluru 560001</strong>
          </span>
        </button>
        <div className="relative hidden flex-1 md:block">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCategory("All");
              setView("products");
            }}
            placeholder="Search for products, brands and categories"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none focus:border-[#ff5a1f] focus:bg-white focus:ring-4 focus:ring-[#ff5a1f]/10"
          />
          {suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-[54px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setQuery(product.name);
                    setCategory("All");
                    setView("products");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="size-10 rounded-lg object-cover"
                  />
                  <span>
                    <strong className="block text-xs">{product.name}</strong>
                    <small className="text-[10px] text-slate-400">
                      {product.brand} · {money(product.price)}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <nav className="ml-auto hidden items-center gap-2 md:flex">
          <HeaderAction
            icon="heart"
            label="Wishlist"
            count={wishlistCount}
            onClick={() => setView("wishlist")}
          />
          <HeaderAction
            icon="bag"
            label="Cart"
            count={cartCount}
            onClick={() => setView("cart")}
          />
          <HeaderAction
            icon="user"
            label="Account"
            onClick={() => setView("account")}
          />
        </nav>
        <button
          type="button"
          onClick={() => setView("cart")}
          className="relative ml-auto grid size-11 place-items-center rounded-xl bg-slate-100 md:hidden"
        >
          <Icon name="bag" />
          {cartCount > 0 && <Badge value={cartCount} />}
        </button>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <label className="relative block">
          <Icon
            name="search"
            className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCategory("All");
              setView("products");
            }}
            placeholder="Search products and brands"
            className="h-11 w-full rounded-xl bg-slate-100 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#ff5a1f]/20"
          />
        </label>
      </div>
      <nav className="hidden border-t border-slate-100 md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-7 px-6 text-xs font-bold text-[#425b52] lg:px-8">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setView("products");
            }}
            className="flex items-center gap-2 text-[#ff5a1f]"
          >
            <Icon name="menu" className="size-4" />
            All categories
          </button>
          {categories.slice(1).map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(item.name);
                setView("products");
              }}
              className="hover:text-[#ff5a1f]"
            >
              {item.name}
            </button>
          ))}
          <span className="ml-auto rounded-full bg-[#fff1eb] px-3 py-1 text-[#ff5a1f]">
            Today&apos;s deals
          </span>
        </div>
      </nav>
    </header>
  );
}

function HeaderAction({ icon, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#334b43] hover:bg-slate-100"
    >
      <Icon name={icon} />
      <span>{label}</span>
      {count > 0 && <Badge value={count} />}
    </button>
  );
}

function Badge({ value }) {
  return (
    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#ff5a1f] px-1 text-[10px] font-extrabold leading-5 text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}

function MobileNav({ view, setView, cartCount, wishlistCount }) {
  const items = [
    ["home", "Home"],
    ["heart", "Wishlist"],
    ["bag", "Cart"],
    ["user", "Account"],
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_25px_rgba(15,23,42,.06)] md:hidden">
      {items.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setView(key === "heart" ? "wishlist" : key)}
          className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${view === (key === "heart" ? "wishlist" : key) ? "text-[#ff5a1f]" : "text-slate-500"}`}
        >
          <span className="relative">
            <Icon name={key} className="size-[22px]" />
            {key === "bag" && cartCount > 0 && <Badge value={cartCount} />}
            {key === "heart" && wishlistCount > 0 && (
              <Badge value={wishlistCount} />
            )}
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}

function CategoryRail({ active, onSelect }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto py-1 sm:grid sm:grid-cols-8 sm:overflow-visible">
      {categories.map((item) => (
        <button
          type="button"
          key={item.name}
          onClick={() => onSelect(item.name)}
          className={`flex min-w-[82px] flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-xs font-bold sm:min-w-0 ${active === item.name ? "border-[#ff5a1f] bg-[#fff5f1] text-[#ff5a1f]" : "border-slate-200 bg-white text-[#425b52] hover:border-[#ff5a1f]/40"}`}
        >
          <span className="text-2xl">{item.icon}</span>
          {item.name}
        </button>
      ))}
    </div>
  );
}

function Hero({ index, setIndex, onCategory }) {
  const banner = banners[index];
  const visualProducts = [
    [products[1], products[4]],
    [products[2], products[8]],
    [products[7], products[9]],
  ][index];
  return (
    <section
      className="relative min-h-[330px] overflow-hidden rounded-[28px] px-6 py-9 text-white shadow-[0_24px_70px_rgba(15,23,42,.16)] sm:px-10 sm:py-12 lg:px-14"
      style={{
        background: `linear-gradient(120deg, ${banner.from}, ${banner.to})`,
      }}
    >
      <div className="absolute -right-16 -top-20 size-72 rounded-full border-[45px] border-white/10" />
      <div className="absolute -bottom-28 right-[25%] size-64 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10 max-w-xl">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold tracking-[2px] backdrop-blur">
          {banner.eyebrow}
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-[-1.5px] sm:text-5xl">
          {banner.title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
          {banner.copy}
        </p>
        <button
          type="button"
          onClick={() => onCategory(banner.category)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#172b25] shadow-lg hover:-translate-y-0.5"
        >
          {banner.action}
          <Icon name="arrow" />
        </button>
      </div>
      <div className="absolute right-[7%] top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="relative h-[270px] w-[340px]">
          <div className="absolute left-0 top-7 w-40 -rotate-6 overflow-hidden rounded-3xl border-4 border-white/30 bg-white p-2 shadow-2xl">
            <img
              src={visualProducts[0].image}
              alt=""
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
            <p className="px-2 pb-1 pt-2 text-xs font-extrabold text-[#172b25]">
              {money(visualProducts[0].price)}
            </p>
          </div>
          <div className="absolute right-0 top-0 w-44 rotate-6 overflow-hidden rounded-3xl border-4 border-white/30 bg-white p-2 shadow-2xl">
            <img
              src={visualProducts[1].image}
              alt=""
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
            <p className="px-2 pb-1 pt-2 text-xs font-extrabold text-[#172b25]">
              {money(visualProducts[1].price)}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {banners.map((_, dot) => (
          <button
            key={dot}
            type="button"
            aria-label={`Show offer ${dot + 1}`}
            onClick={() => setIndex(dot)}
            className={`h-1.5 rounded-full ${index === dot ? "w-7 bg-white" : "w-2 bg-white/45"}`}
          />
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
      {[
        ["truck", "Free delivery", "Above ₹999"],
        ["shield", "Secure payment", "100% protected"],
        ["refresh", "Easy returns", "Within 7 days"],
      ].map(([icon, title, copy]) => (
        <div
          key={title}
          className="flex flex-col items-center gap-1 px-2 text-center sm:flex-row sm:justify-center sm:gap-3 sm:text-left"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#fff1eb] text-[#ff5a1f]">
            <Icon name={icon} />
          </span>
          <span>
            <strong className="block text-[11px] sm:text-sm">{title}</strong>
            <small className="hidden text-slate-500 sm:block">{copy}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function DealOfTheDay({ onOpen, onAdd }) {
  const [seconds, setSeconds] = useState(6 * 3600 + 42 * 60 + 18);
  useEffect(() => {
    const timer = window.setInterval(
      () => setSeconds((value) => (value > 0 ? value - 1 : 24 * 3600)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const time = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ].map((value) => String(value).padStart(2, "0"));
  return (
    <section className="overflow-hidden rounded-[28px] bg-[#172b25] text-white">
      <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
        <div className="shrink-0 lg:w-64">
          <p className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#ff9a72]">
            Limited time
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            Deal of the day
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Grab these prices before the clock runs out.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {time.map((value, index) => (
              <span
                key={index}
                className="grid size-11 place-items-center rounded-xl bg-white/10 font-mono text-sm font-extrabold"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
        <div className="no-scrollbar flex flex-1 gap-3 overflow-x-auto pb-1">
          {products.slice(0, 5).map((product) => (
            <article
              key={product.id}
              className="min-w-[180px] overflow-hidden rounded-2xl bg-white text-[#172b25] sm:min-w-[200px]"
            >
              <button
                type="button"
                onClick={() => onOpen(product)}
                className="block w-full text-left"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-3">
                  <p className="truncate text-xs font-bold">{product.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <strong className="text-sm">{money(product.price)}</strong>
                    <del className="text-[10px] text-slate-400">
                      {money(product.originalPrice)}
                    </del>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onAdd(product.id)}
                className="mx-3 mb-3 h-9 w-[calc(100%-1.5rem)] rounded-lg bg-[#ff5a1f] text-[11px] font-extrabold text-white"
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandDiscovery({ onCategory }) {
  const cards = [
    [
      "THE STYLE STUDIO",
      "New-season fashion",
      "Fashion",
      "from-fuchsia-700 to-pink-500",
      products[0].image,
    ],
    [
      "STEP INTO NEW",
      "Sneakers under ₹2,499",
      "Footwear",
      "from-blue-700 to-cyan-500",
      products[11].image,
    ],
    [
      "SMART LIVING",
      "Tech that keeps up",
      "Electronics",
      "from-slate-800 to-slate-500",
      products[2].image,
    ],
  ];
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[1.8px] text-[#ff5a1f]">
            Curated stores
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold">
            Shop by mood
          </h2>
        </div>
        <span className="hidden text-xs text-slate-400 sm:block">
          Fresh edits, updated weekly
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map(([title, copy, category, gradient, image]) => (
          <button
            key={title}
            type="button"
            onClick={() => onCategory(category)}
            className={`group relative min-h-48 overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 text-left text-white shadow-lg`}
          >
            <img
              src={image}
              alt=""
              className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-60 mix-blend-luminosity transition duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 max-w-[55%]">
              <p className="text-[9px] font-extrabold tracking-[1.5px] text-white/65">
                {title}
              </p>
              <h3 className="mt-2 text-xl font-extrabold leading-tight">
                {copy}
              </h3>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold">
                Explore <Icon name="arrow" className="size-4" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function CouponStrip({ onCopy }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#ffd5c4] bg-[#fff4ef] px-5 py-5 sm:px-7">
      <div className="absolute -right-10 -top-16 size-40 rounded-full bg-[#ff5a1f]/10" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[1.8px] text-[#ff5a1f]">
            Welcome offer
          </p>
          <h2 className="mt-1 text-xl font-extrabold">
            Get extra 15% off your first order
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Maximum discount ₹500 · Minimum order ₹1,499
          </p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="flex h-12 items-center justify-between gap-5 rounded-xl border-2 border-dashed border-[#ff5a1f]/40 bg-white px-4 text-left"
        >
          <span>
            <small className="block text-[9px] uppercase text-slate-400">
              Use code
            </small>
            <strong className="tracking-[1.5px] text-[#ff5a1f]">FIRST15</strong>
          </span>
          <span className="text-xs font-extrabold text-[#172b25]">COPY</span>
        </button>
      </div>
    </section>
  );
}

function ProductCard({ product, wished, onWish, onAdd, onOpen }) {
  const discount = Math.round(
    (1 - product.price / product.originalPrice) * 100,
  );
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/4.7] overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-[#ff5a1f] shadow-sm backdrop-blur">
            {product.badge}
          </span>
        </div>
        <div className="p-3.5 sm:p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[1.2px] text-slate-400">
            {product.brand}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[#172b25]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#138a5b] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
              {product.rating}
              <span>★</span>
            </span>
            <span className="text-[10px] text-slate-400">
              ({product.reviews})
            </span>
            <span className="ml-auto rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-700">
              ASSURED
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <strong className="text-base">{money(product.price)}</strong>
            <del className="text-xs text-slate-400">
              {money(product.originalPrice)}
            </del>
            <span className="text-xs font-bold text-[#138a5b]">
              {discount}% off
            </span>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-slate-500">
            Free delivery · 7-day returns
          </p>
        </div>
      </button>
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => onWish(product.id)}
        className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur ${wished ? "text-rose-500" : "text-slate-500"}`}
      >
        <Icon
          name="heart"
          className={`size-[18px] ${wished ? "fill-current" : ""}`}
        />
      </button>
      <button
        type="button"
        onClick={() => onAdd(product.id)}
        className="mx-3.5 mb-3.5 flex h-10 w-[calc(100%-1.75rem)] items-center justify-center gap-2 rounded-xl bg-[#172b25] text-xs font-extrabold text-white hover:bg-[#ff5a1f]"
      >
        <Icon name="bag" className="size-4" />
        Add to cart
      </button>
    </article>
  );
}

function ProductGrid({ list, wishlist, onWish, onAdd, onOpen }) {
  if (!list.length)
    return (
      <Empty
        title="No products found"
        copy="Try another search or category."
        icon="search"
      />
    );
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {list.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          wished={wishlist.includes(product.id)}
          onWish={onWish}
          onAdd={onAdd}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function HomeView({
  query,
  category,
  setCategory,
  sort,
  setSort,
  list,
  banner,
  setBanner,
  wishlist,
  onWish,
  onAdd,
  onOpen,
  onToast,
  catalogOnly = false,
}) {
  const chooseCategory = (name) => {
    setCategory(name);
    window.setTimeout(
      () =>
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 pb-28 sm:px-6 sm:py-7 md:pb-12 lg:px-8">
      {!query && !catalogOnly && (
        <>
          <CategoryRail active={category} onSelect={chooseCategory} />
          <Hero
            index={banner}
            setIndex={setBanner}
            onCategory={chooseCategory}
          />
          <Benefits />
          <DealOfTheDay onOpen={onOpen} onAdd={onAdd} />
          <BrandDiscovery onCategory={chooseCategory} />
          <CouponStrip
            onCopy={() => {
              navigator.clipboard?.writeText("FIRST15");
              onToast("Coupon FIRST15 copied");
            }}
          />
        </>
      )}
      <section id="products">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.8px] text-[#ff5a1f]">
              {query
                ? "Search results"
                : catalogOnly
                  ? "Full catalogue"
                  : "Handpicked for you"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-.8px] sm:text-3xl">
              {query
                ? `Results for “${query}”`
                : category === "All"
                  ? catalogOnly
                    ? "All products"
                    : "Trending now"
                  : category}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {list.length} products
            </p>
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none focus:border-[#ff5a1f]"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        {!query && (
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1 sm:hidden">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => setCategory(item.name)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${category === item.name ? "border-[#ff5a1f] bg-[#ff5a1f] text-white" : "border-slate-200 bg-white"}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        <ProductGrid
          list={list}
          wishlist={wishlist}
          onWish={onWish}
          onAdd={onAdd}
          onOpen={onOpen}
        />
      </section>
    </main>
  );
}

function CartView({
  items,
  subtotal,
  delivery,
  savings,
  onQty,
  onCheckout,
  onShop,
}) {
  if (!items.length)
    return (
      <PageShell title="Your cart">
        <Empty
          title="Your cart is empty"
          copy="Add something you love and it will appear here."
          icon="bag"
          action="Start shopping"
          onAction={onShop}
        />
      </PageShell>
    );
  return (
    <PageShell
      title={`Your cart (${items.reduce((sum, item) => sum + item.qty, 0)})`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"
            >
              <img
                src={product.image}
                alt=""
                className="size-24 rounded-xl object-cover sm:size-32"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {product.brand}
                </p>
                <h3 className="mt-1 text-sm font-bold sm:text-base">
                  {product.name}
                </h3>
                <p className="mt-2 font-extrabold">{money(product.price)}</p>
                <div className="mt-3 flex w-fit items-center rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onQty(product.id, qty - 1)}
                    className="grid size-9 place-items-center"
                  >
                    <Icon name="minus" className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQty(product.id, qty + 1)}
                    className="grid size-9 place-items-center"
                  >
                    <Icon name="plus" className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <OrderSummary
          subtotal={subtotal}
          delivery={delivery}
          savings={savings}
          onCheckout={onCheckout}
        />
      </div>
    </PageShell>
  );
}

function OrderSummary({ subtotal, delivery, savings, onCheckout }) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-extrabold">Price details</h2>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Delivery</span>
          <span className={delivery ? "" : "font-bold text-[#138a5b]"}>
            {delivery ? money(delivery) : "FREE"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">You save</span>
          <span className="font-bold text-[#138a5b]">-{money(savings)}</span>
        </div>
        <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between text-base font-extrabold">
          <span>Total</span>
          <span>{money(subtotal + delivery)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        className="mt-5 h-12 w-full rounded-xl bg-[#ff5a1f] font-extrabold text-white hover:bg-[#e94b12]"
      >
        Proceed to checkout
      </button>
      <p className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
        <Icon name="shield" className="size-4" />
        Safe and secure payments
      </p>
    </aside>
  );
}

function WishlistView({ list, wishlist, onWish, onAdd, onOpen, onShop }) {
  return (
    <PageShell title={`My wishlist (${list.length})`}>
      {list.length ? (
        <ProductGrid
          list={list}
          wishlist={wishlist}
          onWish={onWish}
          onAdd={onAdd}
          onOpen={onOpen}
        />
      ) : (
        <Empty
          title="Your wishlist is empty"
          copy="Save products you love and find them here later."
          icon="heart"
          action="Explore products"
          onAction={onShop}
        />
      )}
    </PageShell>
  );
}

function AuthPage({ mode, onAuthenticated }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const authLocation = useLocation();
  const initialEmail =
    new URLSearchParams(authLocation.search).get("email") || "";
  const [values, setValues] = useState({
    name: "",
    email: initialEmail,
    password: "",
    confirm: "",
    remember: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const result = (isSignup ? signupSchema : loginSchema).safeParse(values);
    if (!result.success) {
      setErrors(getValidationErrors(result.error));
      return;
    }
    try {
      setLoading(true);
      const user = isSignup
        ? await signup(result.data)
        : await login(result.data);
      onAuthenticated(user);
      navigate("/", { replace: true });
    } catch (error) {
      if (!isSignup && error.code === "USER_NOT_FOUND") {
        navigate(`/signup?email=${encodeURIComponent(result.data.email)}`, {
          replace: true,
          state: { notice: error.message },
        });
        return;
      }
      if (isSignup && error.code === "USER_EXISTS") {
        navigate(`/login?email=${encodeURIComponent(result.data.email)}`, {
          replace: true,
          state: { notice: error.message },
        });
        return;
      }
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,#fff1eb_0,transparent_38%),#f7f8f7] px-4 py-8 sm:px-6">
      <section className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/80 bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_24px_80px_rgba(23,43,37,.12)] sm:p-9">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#ff5a1f] via-[#ff8a5f] to-[#172b25]" />
        <div>
          <div className="flex items-center justify-between"><div onClick={() => navigate("/")}><Logo /></div><span className="grid size-11 place-items-center rounded-2xl bg-[#fff1eb] text-[#ff5a1f]"><Icon name="shield" className="size-5" /></span></div>
          <div className="mt-9">
            <p className="text-[10px] font-extrabold uppercase tracking-[1.8px] text-[#ff5a1f]">
              {isSignup
                  ? "New shopper"
                  : "Welcome back"}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-1px]">
              {isSignup
                  ? "Create your account"
                  : "Sign in to your account"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isSignup
                  ? "It only takes a minute to get started."
                  : "Enter your details to continue shopping."}
            </p>
          </div>
          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            {authLocation.state?.notice && (
              <p className="rounded-xl border border-[#ffd5c4] bg-[#fff4ef] p-3 text-xs leading-5 text-[#9a3412]">
                {authLocation.state.notice}
              </p>
            )}
            <AuthField
              label="Email address"
              type="email"
              value={values.email}
              onChange={(value) => update("email", value)}
              error={errors.email}
              autoComplete="email"
              placeholder="you@example.com"
            />
            {isSignup && (
              <AuthField
                label="Full name"
                type="text"
                value={values.name}
                onChange={(value) => update("name", value)}
                error={errors.name}
                autoComplete="name"
                placeholder="Your full name"
              />
            )}
            <AuthField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(value) => update("password", value)}
                error={errors.password}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
                action={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-xs font-bold text-[#ff5a1f]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
            />
            {isSignup && (
              <p className="-mt-2 text-[10px] leading-4 text-slate-400">
                Use 8–64 characters with uppercase, lowercase, and a number.
              </p>
            )}
            {isSignup && (
              <AuthField
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                value={values.confirm}
                onChange={(value) => update("confirm", value)}
                error={errors.confirm}
                autoComplete="new-password"
                placeholder="Repeat your password"
              />
            )}
            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={values.remember}
                    onChange={(event) =>
                      update("remember", event.target.checked)
                    }
                    className="size-4 accent-[#ff5a1f]"
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-[#ff5a1f]"
                >
                  Forgot password?
                </button>
              </div>
            )}
            {errors.form && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-xs text-red-700"
              >
                {errors.form}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#ff5a1f] font-extrabold text-white hover:bg-[#e94b12] disabled:opacity-60"
            >
              {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">{isSignup ? "Already have an account?" : "New to ReMarket?"} <button type="button" onClick={() => navigate(`${isSignup ? "/login" : "/signup"}${values.email ? `?email=${encodeURIComponent(values.email)}` : ""}`)} className="font-extrabold text-[#ff5a1f] hover:underline">{isSignup ? "Sign in" : "Create account"}</button></p>
        </div>
      </section>
    </main>
  );
}

function AuthField({
  label,
  type,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  action,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-bold text-[#425b52]">
        <span>{label}</span>
        {action}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:border-[#ff5a1f] focus:ring-4 focus:ring-[#ff5a1f]/10 ${error ? "border-red-400" : "border-slate-200"}`}
      />
      {error && (
        <small className="mt-1.5 block text-[11px] text-red-600">{error}</small>
      )}
    </label>
  );
}

function AccountView({ orders, onShop, user, onLogin, onLogout }) {
  if (!user)
    return (
      <PageShell title="My account">
        <div className="grid min-h-[480px] place-items-center rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <div>
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#fff1eb] text-[#ff5a1f]">
              <Icon name="user" className="size-9" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">
              Sign in to your account
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Access your orders, saved addresses, wishlist, and faster
              checkout.
            </p>
            <button
              type="button"
              onClick={onLogin}
              className="mt-6 h-12 rounded-xl bg-[#ff5a1f] px-8 font-extrabold text-white"
            >
              Sign in or create account
            </button>
          </div>
        </div>
      </PageShell>
    );
  return (
    <PageShell title="My account">
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid size-14 place-items-center rounded-full bg-[#fff1eb] text-[#ff5a1f]">
            <Icon name="user" className="size-7" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold">
            Hello, {user.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <div className="mt-5 space-y-2 text-sm">
            <button className="w-full rounded-xl bg-slate-100 px-4 py-3 text-left font-bold">
              My orders
            </button>
            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-500 hover:bg-slate-50">
              Saved addresses
            </button>
            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-500 hover:bg-slate-50">
              Help centre
            </button>
            <button
              onClick={onLogout}
              className="w-full rounded-xl px-4 py-3 text-left font-bold text-red-500 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </aside>
        <section>
          <h2 className="mb-3 text-lg font-extrabold">Recent orders</h2>
          {orders.length ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Order #{order.id}
                      </p>
                      <strong className="mt-1 block">
                        {order.items} item{order.items > 1 ? "s" : ""}
                      </strong>
                    </div>
                    <span className="h-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      Order placed
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
                    <span className="text-slate-500">{order.date}</span>
                    <strong>{money(order.total)}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No orders yet"
              copy="Your completed orders will appear here."
              icon="bag"
              action="Start shopping"
              onAction={onShop}
            />
          )}
        </section>
      </div>
    </PageShell>
  );
}

function PageShell({ title, children }) {
  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-6 pb-28 sm:px-6 md:pb-12 lg:px-8">
      <h1 className="mb-5 font-display text-2xl font-extrabold tracking-[-.8px] sm:text-3xl">
        {title}
      </h1>
      {children}
    </main>
  );
}

function Empty({ title, copy, icon, action, onAction }) {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-slate-100 text-slate-400">
          <Icon name={icon} className="size-8" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{copy}</p>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 rounded-xl bg-[#172b25] px-5 py-3 text-sm font-bold text-white"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

function ProductModal({ product, wished, onClose, onWish, onAdd }) {
  if (!product) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-slate-950/55 backdrop-blur-sm sm:grid sm:place-items-center sm:p-5"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-[28px] bg-white sm:max-w-4xl sm:rounded-[28px]"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-white/90 shadow"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[1.5px] text-[#ff5a1f]">
              {product.brand}
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
              {product.name}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-[#138a5b] px-2 py-1 text-xs font-bold text-white">
                {product.rating} ★
              </span>
              <span className="text-xs text-slate-400">
                {product.reviews} verified reviews
              </span>
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <strong className="text-2xl">{money(product.price)}</strong>
              <del className="text-sm text-slate-400">
                {money(product.originalPrice)}
              </del>
              <span className="font-bold text-[#138a5b]">
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
                off
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              {product.description}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
              {[
                ["truck", "Fast delivery"],
                ["shield", "Secure pay"],
                ["refresh", "Easy return"],
              ].map(([icon, text]) => (
                <div key={text} className="rounded-xl bg-slate-50 p-3">
                  <Icon
                    name={icon}
                    className="mx-auto mb-1 size-5 text-[#ff5a1f]"
                  />
                  {text}
                </div>
              ))}
            </div>
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => onWish(product.id)}
                className={`grid size-12 shrink-0 place-items-center rounded-xl border ${wished ? "border-rose-200 bg-rose-50 text-rose-500" : "border-slate-200"}`}
              >
                <Icon
                  name="heart"
                  className={wished ? "size-5 fill-current" : "size-5"}
                />
              </button>
              <button
                type="button"
                onClick={() => onAdd(product.id)}
                className="h-12 flex-1 rounded-xl bg-[#ff5a1f] font-extrabold text-white"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckoutModal({ total, itemCount, onClose, onPlace }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
    payment: "cod",
  });
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (
      !form.name ||
      !/^\d{10}$/.test(form.phone) ||
      !form.address ||
      !form.city ||
      !/^\d{6}$/.test(form.pin)
    )
      return setError(
        "Please enter a valid name, 10-digit phone number, address, city, and 6-digit PIN code.",
      );
    onPlace(form);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-slate-950/55 sm:grid sm:place-items-center sm:p-5"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-[28px] sm:p-7"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff5a1f]">
              Secure checkout
            </p>
            <h2 className="text-2xl font-extrabold">Delivery details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full bg-slate-100"
          >
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <CheckoutInput
            label="Full name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
          />
          <CheckoutInput
            label="Phone number"
            type="tel"
            value={form.phone}
            onChange={(value) => setForm({ ...form, phone: value })}
          />
          <CheckoutInput
            label="Full address"
            value={form.address}
            onChange={(value) => setForm({ ...form, address: value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <CheckoutInput
              label="City"
              value={form.city}
              onChange={(value) => setForm({ ...form, city: value })}
            />
            <CheckoutInput
              label="PIN code"
              inputMode="numeric"
              value={form.pin}
              onChange={(value) => setForm({ ...form, pin: value })}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-slate-600">
              Payment method
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["cod", "Cash on delivery"],
                ["upi", "UPI / Card"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-3 text-xs font-bold ${form.payment === value ? "border-[#ff5a1f] bg-[#fff5f1]" : "border-slate-200"}`}
                >
                  <input
                    type="radio"
                    className="mr-2 accent-[#ff5a1f]"
                    checked={form.payment === value}
                    onChange={() => setForm({ ...form, payment: value })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-xl bg-[#ff5a1f] font-extrabold text-white"
          >
            Place order · {money(total)}
          </button>
          <p className="text-center text-[10px] text-slate-400">
            {itemCount} item{itemCount > 1 ? "s" : ""} · Safe checkout
          </p>
        </form>
      </section>
    </div>
  );
}

function CheckoutInput({ label, value, onChange, type = "text", inputMode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-600">
        {label}
      </span>
      <input
        required
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#ff5a1f] focus:ring-3 focus:ring-[#ff5a1f]/10"
      />
    </label>
  );
}

function Toast({ message }) {
  return (
    <div
      role="status"
      className={`fixed bottom-20 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#172b25] px-5 py-3 text-xs font-bold text-white shadow-2xl md:bottom-6 ${message ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <Icon name="check" className="size-4 text-green-400" />
      {message}
    </div>
  );
}

function Footer({ onCategory, onNavigate, onToast }) {
  const subscribe = (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("footer-email");
    if (!email) return;
    event.currentTarget.reset();
    onToast("You are subscribed to ReMarket offers");
  };
  const help = (message) => onToast(`${message} will be available in your account`);
  return (
    <footer className="bg-[#14221d] pb-20 text-white md:pb-0">
      <div className="border-b border-white/10 bg-[#1a2d26]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#ff9a72]">Deals in your inbox</p><h2 className="mt-1 text-xl font-extrabold">Get first access to new drops and offers</h2></div>
          <form onSubmit={subscribe} className="flex w-full max-w-md overflow-hidden rounded-xl bg-white p-1"><input name="footer-email" type="email" required placeholder="Enter your email address" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#172b25] outline-none"/><button type="submit" className="h-10 rounded-lg bg-[#ff5a1f] px-5 text-xs font-extrabold text-white">Subscribe</button></form>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1"><button type="button" onClick={() => onNavigate("home")} className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-xl bg-[#ff5a1f]"><Icon name="bag" className="size-5"/></span><span className="font-display text-xl font-extrabold">ReMarket</span></button><p className="mt-4 max-w-xs text-xs leading-6 text-white/55">Shop fashion, electronics, beauty, accessories, and everyday essentials in one place.</p><div className="mt-5 flex gap-2"><span className="rounded-lg bg-white/10 px-3 py-2 text-[10px] font-bold">Google Play</span><span className="rounded-lg bg-white/10 px-3 py-2 text-[10px] font-bold">App Store</span></div></div>
          <FooterColumn title="Shop" items={[["Fashion",() => onCategory("Fashion")],["Footwear",() => onCategory("Footwear")],["Electronics",() => onCategory("Electronics")],["Beauty",() => onCategory("Beauty")],["Accessories",() => onCategory("Accessories")]]}/>
          <FooterColumn title="Customer care" items={[["My orders",() => onNavigate("account")],["Track order",() => onNavigate("account")],["Returns & refunds",() => help("Returns and refunds")],["Payments",() => help("Payment support")],["Help centre",() => help("Help centre")]]}/>
          <FooterColumn title="Policies" items={[["Shipping policy",() => help("Shipping policy")],["Return policy",() => help("Return policy")],["Privacy",() => help("Privacy policy")],["Terms of use",() => help("Terms of use")],["Secure shopping",() => help("Secure shopping information")]]}/>
          <FooterColumn title="Sell with us" items={[["Become a seller",() => help("Seller registration")],["Seller centre",() => help("Seller centre")],["Advertise products",() => help("Advertising tools")],["Affiliate program",() => help("Affiliate program")],["Partner support",() => help("Partner support")]]}/>
        </div>
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[1.5px] text-white/35">Secure payments</p><div className="mt-2 flex flex-wrap gap-2">{["VISA","Mastercard","RuPay","UPI","COD"].map((method) => <span key={method} className="rounded-md border border-white/15 px-2 py-1 text-[9px] font-extrabold text-white/70">{method}</span>)}</div></div><div className="flex items-center gap-3 text-xs text-white/55"><Icon name="shield" className="size-5 text-[#ff9a72]"/><span>100% secure payments</span><Icon name="truck" className="ml-2 size-5 text-[#ff9a72]"/><span>Pan-India delivery</span></div></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return <div><h3 className="text-xs font-extrabold uppercase tracking-[1.4px] text-white/80">{title}</h3><ul className="mt-4 space-y-3">{items.map(([label,action]) => <li key={label}><button type="button" onClick={action} className="text-left text-xs text-white/50 hover:text-[#ff9a72]">{label}</button></li>)}</ul></div>;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const view = location.pathname.startsWith("/products")
    ? "products"
    : location.pathname.slice(1) || "home";
  const setView = (next) =>
    navigate(
      {
        home: "/",
        products: "/products",
        cart: "/cart",
        wishlist: "/wishlist",
        account: "/account",
        login: "/login",
        signup: "/signup",
      }[next] || "/",
    );
  const [user, setUser] = useState(getSession);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState(loadCart);
  const [wishlist, setWishlist] = useState(loadWishlist);
  const [orders, setOrders] = useState(loadOrders);
  const [banner, setBanner] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    let active = true;
    restoreSession().then((session) => {
      if (active) setUser(session);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => saveCart(cart), [cart]);
  useEffect(() => saveWishlist(wishlist), [wishlist]);
  useEffect(() => saveOrders(orders), [orders]);
  useEffect(() => {
    const id = window.setInterval(
      () => setBanner((current) => (current + 1) % banners.length),
      5500,
    );
    return () => window.clearInterval(id);
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2400);
  };
  const addToCart = (id) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    showToast("Added to cart");
  };
  const changeQty = (id, qty) =>
    setCart((current) => {
      const next = { ...current };
      if (qty < 1) delete next[id];
      else next[id] = qty;
      return next;
    });
  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    showToast(
      wishlist.includes(id) ? "Removed from wishlist" : "Saved to wishlist",
    );
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter(
      (product) =>
        (category === "All" || product.category === category) &&
        (!term ||
          `${product.name} ${product.brand} ${product.category}`
            .toLowerCase()
            .includes(term)),
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, category, sort]);

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({ product, qty: cart[product.id] }));
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );
  const savings = cartItems.reduce(
    (sum, item) =>
      sum + (item.product.originalPrice - item.product.price) * item.qty,
    0,
  );
  const delivery = subtotal && subtotal < 999 ? 99 : 0;
  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );
  const productId = location.pathname.match(/^\/products\/(\d+)/)?.[1];
  const routeProduct = products.find(
    (product) => product.id === Number(productId),
  );
  const openProduct = (product) => navigate(`/products/${product.id}`);
  const goHome = () => {
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const placeOrder = () => {
    const order = {
      id: String(Date.now()).slice(-8),
      items: cartCount,
      total: subtotal + delivery,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    setOrders((current) => [order, ...current]);
    setCart({});
    setCheckout(false);
    setView("account");
    showToast("Order placed successfully");
  };
  const signUserOut = () => {
    logout();
    setUser(null);
    navigate("/login");
    showToast("Signed out successfully");
  };
  const isAuthRoute = view === "auth" || view === "login" || view === "signup";

  return (
    <div className="min-h-dvh bg-[#f7f8f7] text-[#172b25]">
      {!isAuthRoute && (
        <Header
          query={query}
          setQuery={setQuery}
          setCategory={setCategory}
          setView={setView}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <HomeView
              query={query}
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
              list={filtered}
              banner={banner}
              setBanner={setBanner}
              wishlist={wishlist}
              onWish={toggleWishlist}
              onAdd={addToCart}
              onOpen={openProduct}
              onToast={showToast}
            />
          }
        />
        <Route
          path="/products"
          element={
            <HomeView
              query={query}
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
              list={filtered}
              banner={banner}
              setBanner={setBanner}
              wishlist={wishlist}
              onWish={toggleWishlist}
              onAdd={addToCart}
              onOpen={openProduct}
              onToast={showToast}
              catalogOnly
            />
          }
        />
        <Route
          path="/products/:productId"
          element={
            routeProduct ? (
              <>
                <HomeView
                  query={query}
                  category={category}
                  setCategory={setCategory}
                  sort={sort}
                  setSort={setSort}
                  list={filtered}
                  banner={banner}
                  setBanner={setBanner}
                  wishlist={wishlist}
                  onWish={toggleWishlist}
                  onAdd={addToCart}
                  onOpen={openProduct}
                  onToast={showToast}
                  catalogOnly
                />
                <ProductModal
                  product={routeProduct}
                  wished={wishlist.includes(routeProduct.id)}
                  onClose={() => navigate("/products")}
                  onWish={toggleWishlist}
                  onAdd={addToCart}
                />
              </>
            ) : (
              <Navigate to="/products" replace />
            )
          }
        />
        <Route
          path="/cart"
          element={
            <CartView
              items={cartItems}
              subtotal={subtotal}
              delivery={delivery}
              savings={savings}
              onQty={changeQty}
              onCheckout={() => (user ? setCheckout(true) : navigate("/login"))}
              onShop={goHome}
            />
          }
        />
        <Route
          path="/wishlist"
          element={
            <WishlistView
              list={wishlistProducts}
              wishlist={wishlist}
              onWish={toggleWishlist}
              onAdd={addToCart}
              onOpen={openProduct}
              onShop={goHome}
            />
          }
        />
        <Route
          path="/account"
          element={
            <AccountView
              orders={orders}
              onShop={goHome}
              user={user}
              onLogin={() => navigate("/login")}
              onLogout={signUserOut}
            />
          }
        />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage key="login" mode="login" onAuthenticated={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <AuthPage key="signup" mode="signup" onAuthenticated={setUser} />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthRoute && <Footer onCategory={(name) => { setCategory(name); setQuery(""); setView("products"); window.scrollTo({ top: 0, behavior: "smooth" }); }} onNavigate={setView} onToast={showToast} />}
      {!isAuthRoute && (
        <MobileNav
          view={view === "products" ? "home" : view}
          setView={setView}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
        />
      )}
      {checkout && (
        <CheckoutModal
          total={subtotal + delivery}
          itemCount={cartCount}
          onClose={() => setCheckout(false)}
          onPlace={placeOrder}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}

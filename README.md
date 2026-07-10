# 🐾 VadiPetFood

**Kişiye özel taze evcil hayvan beslenme platformu**

Siparişe özel, günlük taze hazırlanan butik mama. 7 adımlı beslenme planı oluşturma sihirbazı, AI destekli beslenme önerisi ve WhatsApp sipariş entegrasyonu.

---

## Özellikler

- 🧙 7 adımlı beslenme planı sihirbazı
- 🐶🐱 Kedi & köpek desteği
- 🧠 AI destekli kişisel beslenme önerisi (Claude Sonnet)
- 📊 Besin analizi paneli (protein / karbonhidrat / yağ)
- 🔄 Abonelik seçenekleri (tek / haftalık / 15 günlük / aylık)
- 🐾 Pati Puan sadakat sistemi
- 💾 Evcil hayvan profili localStorage'a kaydedilir
- 📱 WhatsApp sipariş bağlantısı
- ✨ Apple/Stripe kalitesinde mikro animasyonlar
- 📲 Tam responsive, mobile-first

---

## Kurulum

### 1. Depoyu klonlayın

```bash
git clone https://github.com/KULLANICI_ADI/vadipetfood.git
cd vadipetfood
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini tanımlayın

```bash
cp .env.example .env
```

`.env` dosyasını açıp doldurun:

```env
VITE_WHATSAPP_NUMBER=905551234567
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Geliştirme sunucusunu başlatın

AI fonksiyonlarıyla birlikte tam test için **Netlify CLI** kullanın:

```bash
# Netlify CLI yoksa kurun
npm install -g netlify-cli

# Hem Vite hem de Functions çalıştır
netlify dev
```

Yalnızca arayüzü test etmek için (AI olmadan):

```bash
npm run dev
```

---

## Deployment — Netlify (Önerilen)

### Yöntem A — Netlify UI (en kolay)

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. GitHub reponuzu bağlayın
3. Build ayarları otomatik gelir (`netlify.toml`'dan)
4. **Site configuration → Environment variables** bölümüne girin:
   - `ANTHROPIC_API_KEY` → Anthropic API anahtarınız
   - `VITE_WHATSAPP_NUMBER` → WhatsApp numaranız
5. **Deploy** edin

### Yöntem B — Netlify CLI

```bash
netlify login
netlify link          # mevcut siteye bağlan veya
netlify init          # yeni site oluştur

# Ortam değişkenlerini Netlify'a aktar
netlify env:set ANTHROPIC_API_KEY "sk-ant-..."
netlify env:set VITE_WHATSAPP_NUMBER "905551234567"

# Deploy et
netlify deploy --prod
```

---

## Deployment — Vercel (Alternatif)

Vercel'de Netlify Functions yerine **Vercel Edge Functions** kullanmak gerekir.

```bash
npm install -g vercel
vercel deploy
```

`netlify/functions/recommend.js` dosyasını `api/recommend.js` olarak taşıyın ve `fetchAI` fonksiyonundaki endpoint'i güncelleyin:

```js
// src/App.jsx içinde
const res = await fetch("/api/recommend", { ... });
```

---

## Proje Yapısı

```
vadipetfood/
├── netlify/
│   └── functions/
│       └── recommend.js    ← AI proxy (API key güvende)
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx             ← Ana uygulama bileşeni
│   ├── main.jsx            ← React giriş noktası
│   └── index.css           ← Global reset
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
├── .env.example            ← Örnek ortam değişkenleri
├── .gitignore
└── README.md
```

---

## Ortam Değişkenleri

| Değişken | Nerede? | Açıklama |
|---|---|---|
| `VITE_WHATSAPP_NUMBER` | `.env` + Netlify | Uluslararası format, `+` olmadan |
| `ANTHROPIC_API_KEY` | `.env` + Netlify | Claude API anahtarı — tarayıcıya açılmaz |

> **Güvenlik notu:** `ANTHROPIC_API_KEY` hiçbir zaman `VITE_` prefix'i ile tanımlanmamalı. Vite, `VITE_` ile başlayan değişkenleri bundle'a gömer ve herkes görebilir. Bu projede anahtar yalnızca Netlify Function (sunucu) tarafında kullanılır.

---

## Özelleştirme

### WhatsApp numarasını değiştirmek

`.env` dosyasında:
```env
VITE_WHATSAPP_NUMBER=905551234567
```

### Fiyatları güncellemek

`src/App.jsx` içinde `GRAMS` ve `EXTRAS` sabitlerini düzenleyin:

```js
const GRAMS  = [{ id:250, price:119 }, { id:500, price:219 }];
const EXTRAS = [{ id:"yumurta", label:"Yumurta", price:20 }, ...];
```

### Yeni mama türü eklemek

`MAMA_TYPES` dizisine yeni bir obje ekleyin.

---

## Geliştirme Notları

- **React 18** + **Vite 5**
- **lucide-react** ikon seti
- Tüm stiller `GlobalStyles` bileşeni içinde inline CSS olarak yönetilir (Tailwind bağımlılığı yoktur)
- `useLocalStorageSafe` hook'u localStorage erişimini try/catch ile sarar — SSR ve kısıtlı ortamlarda güvenle çalışır
- AI çağrısı özet adımına ilk girildiğinde tetiklenir, sonuç `useRef` ile korunur (tekrar çağrılmaz)

---

## Gelecek Geliştirmeler (Hazır Mimari)

Bu proje aşağıdaki sistemlere kolayca genişletilebilir:

- [ ] **Supabase Auth** — kullanıcı hesapları
- [ ] **Supabase Database** — sipariş geçmişi, profil senkronizasyonu
- [ ] **Stripe / iyzico** — online ödeme
- [ ] **Admin Paneli** — sipariş yönetimi
- [ ] **Veteriner Paneli** — tarif onaylama
- [ ] **Kurye Paneli** — teslimat takibi
- [ ] **Push Notification** — sipariş durumu bildirimleri
- [ ] **QR Sipariş** — masa / raf QR kodu ile sipariş

---

## Lisans

MIT © VadiPetFood

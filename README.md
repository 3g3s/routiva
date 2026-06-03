# Routiva

Routiva, yük verenler ile taşıyıcı kullanıcıları aynı platformda buluşturan harita tabanlı bir lojistik web uygulamasıdır.

## Proje Amacı

Bu projenin amacı, lojistik süreçlerini dijital ortama taşıyarak yük veren ve taşıyıcı kullanıcıların rota, eşleşme ve iletişim süreçlerini daha verimli yönetebilmesini sağlamaktır.

---

# Kullanılan Teknolojiler

## Backend

* ASP.NET Core MVC
* Entity Framework Core
* SQLite
* JWT Authentication

## Frontend

* React
* TypeScript
* HTML
* CSS

## QA & Test

* Playwright
* Postman

## Deployment

* Vercel
* Railway

---

# Temel Özellikler

* Kullanıcı kayıt ve giriş sistemi
* JWT tabanlı authentication sistemi
* Rol bazlı kullanıcı yapısı
* Dashboard ekranları
* Harita tabanlı rota sistemi
* API endpoint yönetimi
* Responsive tasarım
* QA test altyapısı
* Güvenlik testleri

---

# Güvenlik Özellikleri

Projede kullanıcı şifreleri düz metin olarak tutulmamaktadır.

Şifreler `Security/PasswordHasher.cs` yapısı içerisinde hashlenerek saklanmaktadır.

Gerçekleştirilen güvenlik kontrolleri:

* Authentication testleri
* Authorization testleri
* Yetkisiz erişim kontrolü
* Role access kontrolü
* 401 Unauthorized kontrolü
* Login doğrulama testleri

---

# QA ve Test Süreci

Projede UI/UX, yazılım ve güvenlik testleri gerçekleştirilmiştir.

## UI/UX Testleri

* Landing page kontrolleri
* Login/Register ekran testleri
* Responsive görünüm testleri

## Yazılım Testleri

* Register/Login akışı
* Dashboard erişimi
* API endpoint testleri

## Güvenlik Testleri

* Authentication kontrolleri
* Authorization kontrolleri
* Yetkisiz erişim testleri
* Rol bazlı erişim testleri

---

# Test Araçları

* Playwright
* Postman
* TypeScript

---

# QA Dokümantasyonu

QA test planı, test senaryoları, bug raporları ve tekrar test kontrol listeleri `docs` klasörü altında yer almaktadır.

```text
docs/
├── 01_QA_MASTER_PLAN.md
├── 02_TEST_CASES.md
├── 03_BUG_REPORTS_FOUND.md
└── 04_RETEST_AND_RELEASE_CHECKLIST.md
```

---

# Proje Yapısı

```text
routiva/
├── ClientApp/
├── Controllers/
├── Data/
├── Models/
├── Security/
├── Views/
├── wwwroot/
├── docs/
├── playwright/
├── postman/
└── README.md
```

---

# Kurulum

## Repository Clone

```bash
git clone https://github.com/3g3s/routiva.git
```

## Backend Kurulumu

```bash
dotnet restore
dotnet run
```

## Frontend Kurulumu

```bash
cd ClientApp
npm install
npm run dev
```

---

# Test Çalıştırma

## Playwright Testleri

```bash
npx playwright test
```

## API Testleri

Postman koleksiyon dosyası:

```text
postman/Routiva_API_Tests.postman_collection.json
```

---

# Deploy

Canlı proje bağlantısı:

routiva-production-f9e5.up.railway.app

---


# Repository İçeriği

Bu repository içerisinde:

* Proje kaynak kodları
* QA test dokümanları
* Playwright test senaryoları
* Postman API test koleksiyonları

yer almaktadır.

# Routiva Initial QA Findings

Bu bulgular kod incelemesine göre hazırlanmıştır. Canlı test ve otomasyon ile doğrulanmalıdır.

## BUG-001 — Register formundaki firma/araç bilgileri backend'e gönderilmiyor

**Severity:** High  
**Type:** Functional / Data loss  
**Module:** Register

### Açıklama
Register ekranında yük veren için firma/adres; taşıyıcı için araç/plaka/kapasite bilgileri alınıyor. Ancak `/api/auth/register` request body içinde sadece şu alanlar gönderiliyor:

```json
{
  "displayName": "...",
  "email": "...",
  "password": "...",
  "phone": "...",
  "role": "..."
}
```

### Beklenen
Kullanıcının kayıt sırasında girdiği firma/araç bilgileri backend'e gönderilmeli ve saklanmalı.

### Gerçek
Bu bilgiler request body içinde yok. Kayıt sonrası kaybolma riski var.

### Etki
Kullanıcı veri giriyor ama sistem saklamıyor. Güven ve veri bütünlüğü problemi.

### Düzeltme Yaklaşımı
- Backend `RegisterRequest` genişletilmeli.
- `AppUser` veya ayrı `CompanyProfile`, `VehicleProfile` modeli oluşturulmalı.
- Frontend `RegisterPage.tsx` request body genişletilmeli.
- API ve E2E testleri eklenmeli.

---

## BUG-002 — Remember Me frontend'de var ama backend session süresini etkilemiyor

**Severity:** Medium  
**Type:** Functional  
**Module:** Login

### Açıklama
Login ekranında `remember` state'i var ve request body içinde gönderiliyor. Ancak backend `LoginRequest` sadece `Email`, `Password` alıyor.

### Beklenen
Remember me kapalıysa kısa oturum, açıksa kalıcı oturum olmalı.

### Gerçek
Backend cookie ayarı her zaman 14 gün.

### Düzeltme Yaklaşımı
Backend request modeline `RememberMe` eklenmeli ve cookie properties buna göre ayarlanmalı.

---

## SEC-001 — Şifre politikası zayıf

**Severity:** Medium  
**Type:** Security Improvement  
**Module:** Register

### Açıklama
Minimum şifre uzunluğu 4 karakter.

### Beklenen
En az 8 karakter, tercihen harf/rakam kontrolü.

### Düzeltme
Frontend ve backend validation 8 karaktere çıkarılmalı.

---

## FEAT-001 — Yük/araç ilanları mock data ile çalışıyor olabilir

**Severity:** Medium  
**Type:** Feature incomplete  
**Module:** Load / Vehicle Listing

### Açıklama
Frontend tarafında `mock.ts` kullanımı var. Bu, gerçek database kaydı yerine demo veri gösterildiğini düşündürüyor.

### Beklenen
İlanlar backend API üzerinden database'e kaydedilmeli ve listelenmeli.

---

## FEAT-002 — LogisticsController demo response dönüyor

**Severity:** Medium  
**Type:** Feature incomplete  
**Module:** Logistics Matching

### Açıklama
`/api/logistics/carrier-search` ve `/api/logistics/load-search` demo mesajı dönüyor.

### Beklenen
Rota, kapasite, lokasyon ve yük tipi gibi alanlara göre gerçek eşleşme.

---

## TECH-001 — Runtime ALTER TABLE kullanımı teknik borç

**Severity:** Low/Medium  
**Type:** Technical Debt  
**Module:** Database

### Açıklama
`Program.cs` içinde SQLite için runtime `ALTER TABLE` kullanılmış.

### Beklenen
EF Core migrations kullanılmalı.

### Düzeltme
```bash
dotnet ef migrations add AddCarrierRouteFields
dotnet ef database update
```

---

## QA Notu
Bu bulguların kesinleşmesi için:

1. Playwright E2E çalıştır.
2. Postman API testlerini çalıştır.
3. Bulgu PASS/FAIL olarak işaretle.
4. Jira ticket aç.
5. Fix sonrası retest yap.

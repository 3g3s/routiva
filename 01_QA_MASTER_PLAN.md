# Routiva QA Master Plan

## 1. Amaç

Routiva lojistik web uygulamasının kullanıcı akışlarını, UI/UX davranışını, backend API doğruluğunu ve kritik iş kurallarını profesyonel QA süreciyle test etmek.

## 2. Test Kapsamı

### Kapsam Dahili

- Landing page
- Register
- Login
- Logout
- Role based access: `yukveren`, `tasiyici`
- Dashboard
- Yük oluşturma
- Araç ilanı / yük bulma
- Taşıyıcı harita/güzergah
- Hesabım/profil
- Chat/AI sayfası temel erişim
- Backend API endpointleri
- UI/UX temel kalite kontrolleri
- E2E otomasyon
- API otomasyon

### Kapsam Dışı / Henüz Geliştirilmemiş Olabilir

- Gerçek ödeme sistemi
- Gerçek rota optimizasyon algoritması
- Gerçek canlı taşıyıcı/yük eşleşme motoru
- Gerçek SMS/e-posta doğrulama
- Load/vehicle kayıtlarının kalıcı database modeli, eğer mock data kullanılıyorsa

## 3. Test Türleri

| Test Türü | Amaç | Araç |
|---|---|---|
| Smoke Test | Sistem ayakta mı? | Playwright, Postman |
| Functional Test | Özellik çalışıyor mu? | Playwright, manuel |
| E2E Test | Kullanıcı akışı baştan sona çalışıyor mu? | Playwright |
| API Test | Backend doğru response dönüyor mu? | Postman, Playwright request |
| UI Test | Görsel hizalama, responsive, butonlar | Manuel + Playwright screenshots |
| UX Test | Kullanıcı akışı anlaşılır mı? | Manuel değerlendirme |
| Regression Test | Düzeltme sonrası eski şeyler bozuldu mu? | Playwright suite |
| Security Basic | Temel güvenlik kontrolleri | Postman |

## 4. Ortamlar

| Ortam | URL |
|---|---|
| Backend | http://localhost:5188 |
| Frontend | http://localhost:5173 |

## 5. Test Verileri

Her testte benzersiz email kullanılmalı:

```text
qa+timestamp@routiva.test
```

Örnek roller:

```text
yukveren
tasiyici
```

## 6. Kritik Başarı Kriterleri

- Kullanıcı kayıt olabilir.
- Kullanıcı login olabilir.
- Yanlış bilgilerde doğru hata mesajı alır.
- Kullanıcı rolüne göre doğru ekranlara erişir.
- Yetkisiz kullanıcı korumalı sayfalara erişemez.
- API endpointleri doğru status code döner.
- Form validation eksikleri raporlanır.
- Buglar Jira formatında takip edilir.
- Düzeltme sonrası retest yapılır.

## 7. QA Workflow

```text
TODO → IN PROGRESS → READY FOR TEST → TESTING → BUG FOUND / PASSED → DONE
```

## 8. Definition of Done

Bir işin kapanması için:

- Kod yazılmış olmalı.
- En az bir test case ile doğrulanmalı.
- Bug varsa Jira'ya yazılmalı.
- Düzeltildiyse retest sonucu PASS olmalı.
- Kritik E2E testleri geçmeli.

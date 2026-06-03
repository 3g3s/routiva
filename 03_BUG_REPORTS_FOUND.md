# Routiva Test Cases

## Module A — Smoke Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| SMK-001 | Frontend açılıyor mu? | `/` sayfasına git | Routiva ana sayfa görünür |
| SMK-002 | Backend health | `/api/logistics/health` çağır | 200 OK |
| SMK-003 | Register sayfası açılır | `/kayit` sayfasına git | Kayıt formu görünür |
| SMK-004 | Login sayfası açılır | `/giris` sayfasına git | Giriş formu görünür |

## Module B — Register Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| REG-001 | Yük veren başarılı kayıt | Role yük veren, geçerli bilgiler, kaydı tamamla | Kullanıcı oluşur, giriş yapılır |
| REG-002 | Taşıyıcı başarılı kayıt | Role taşıyıcı, geçerli bilgiler, kaydı tamamla | Kullanıcı oluşur, giriş yapılır |
| REG-003 | Boş email | Email boş bırak, devam et | Hata mesajı görünür |
| REG-004 | Geçersiz email | `abc` gir | Hata mesajı görünür |
| REG-005 | Kısa şifre | `123` gir | Hata mesajı görünür |
| REG-006 | Şifreler eşleşmiyor | iki farklı şifre gir | Hata mesajı görünür |
| REG-007 | Aynı email ile kayıt | Aynı email tekrar kaydet | Conflict / hata mesajı |
| REG-008 | Firma bilgisi kaydı | Firma/adres gir, kayıt sonrası profil/API kontrol | Bilgi saklanmalı |
| REG-009 | Araç bilgisi kaydı | Plaka/kapasite gir, kayıt sonrası profil/API kontrol | Bilgi saklanmalı |

## Module C — Login Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| LOG-001 | Başarılı login | Kayıtlı email/şifre ile giriş | Kullanıcı login olur |
| LOG-002 | Yanlış şifre | Doğru email, yanlış şifre | 401 / hata mesajı |
| LOG-003 | Boş email | Email boş | Validation |
| LOG-004 | Boş şifre | Şifre boş | Validation |
| LOG-005 | Remember me | Checkbox kapalı/açık test | Session süresi farklı davranmalı |
| LOG-006 | Logout | Login sonrası logout | Kullanıcı çıkış yapmalı |

## Module D — Authorization / Role Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| AUTH-001 | Login olmadan panel | `/panel` aç | Login sayfasına yönlenmeli |
| AUTH-002 | Yük veren taşıyıcı haritası | Yük veren ile `/tasiyici/harita` aç | Erişim engellenmeli/yönlenmeli |
| AUTH-003 | Taşıyıcı harita erişimi | Taşıyıcı ile `/tasiyici/harita` aç | Sayfa açılmalı |
| AUTH-004 | `/api/profile/route` unauthorized | Cookie olmadan API çağır | 401 Unauthorized |

## Module E — Profile / Route API Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| PROF-001 | Route kaydetme | Login cookie ile valid origin/destination PUT | 200 OK |
| PROF-002 | Route okuma | GET `/api/profile/route` | Kaydedilen route dönmeli |
| PROF-003 | Geçersiz lat | Lat 100 gönder | 400 Bad Request |
| PROF-004 | Geçersiz lng | Lng 200 gönder | 400 Bad Request |
| PROF-005 | Route silme | DELETE route | 200 OK / route temizlenir |

## Module F — Logistics API Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| LOGI-001 | Health | GET `/api/logistics/health` | 200 OK |
| LOGI-002 | Carrier search | POST valid body | 200 OK, matched true |
| LOGI-003 | Load search | POST valid body | 200 OK, matched true |
| LOGI-004 | Demo warning | Response message kontrol | Demo mesajı görülür; feature incomplete olarak raporlanır |

## Module G — UI/UX Tests

| ID | Test | Steps | Expected |
|---|---|---|---|
| UI-001 | Mobil ana sayfa | 390x844 viewport | Taşma olmamalı |
| UI-002 | Register mobil | 390x844 viewport | Form taşmamalı |
| UI-003 | Dashboard mobil | Login sonrası mobil panel | Kartlar okunabilir olmalı |
| UX-001 | Rol seçimi anlaşılır mı? | Kayıt/giriş ekranına bak | Kullanıcı ayrımı net olmalı |
| UX-002 | Hata mesajları anlaşılır mı? | Validation hataları üret | Türkçe ve net olmalı |

# Security Specification - Rodrigo Barbearia

## 1. Data Invariants
1. Slots (/slots/{slotKey}):
   - Uniquely keyed by date and time (`YYYY-MM-DD_HH-mm`).
   - Can only be created once per slotKey. No overwriting or updating allowed.
   - Contains NO personal identifiable information (PII). Publicly readable so visitors can view slot availability.
2. Appointments (/appointments/{appointmentId}):
   - Contains customer PII (name, phone, service, date, time).
   - Public read/list is strictly forbidden to preserve customer privacy.
   - Creation requires complete payload validation: valid customer name (2-100 chars), valid phone (8-25 chars), official service enum & price, operating hours 09:00-18:30 (30min step).
3. Clients (/clients/{clientId}):
   - Contains customer PII and booking history metrics.
   - Public list is forbidden.
   - Upsert is validated against strict schema.

## 2. Dirty Dozen Threat Vectors
1. Overwrite existing booked slot: Attacker attempts to overwrite `/slots/2026-10-01_10-00` with their own booking. (BLOCKED: `!exists(...)` check).
2. Data exfiltration of customer database: Attacker attempts `db.collection('clients').get()` (BLOCKED: `allow list: if false`).
3. Appointment scraping: Attacker attempts `db.collection('appointments').get()` (BLOCKED: `allow read: if false`).
4. Price tampering: Attacker attempts to book "Cabelo e Barba" for R$ 1,00 instead of R$ 60,00 (BLOCKED: `servicePrice == 60` validation).
5. Phantom services: Attacker attempts to book an unauthorized service name (BLOCKED: serviceName and serviceId enum check).
6. Out-of-hours booking: Attacker attempts to book at 03:00 or 23:30 (BLOCKED: time regex/pattern check).
7. Non-existent slot key hijacking: Attacker attempts malformed slotKey (BLOCKED: slotKey regex check).
8. Giant payload injection: Attacker attempts to send 2MB name or phone string (BLOCKED: size checks on all string fields).
9. Missing required fields: Attacker omits required phone or service (BLOCKED: hasAll() check).
10. Shadow fields attack: Attacker injects `isAdmin: true` into client doc (BLOCKED: hasOnly() check).
11. Appointment deletion: Attacker attempts to delete competitor's appointment (BLOCKED: `allow delete: if false`).
12. Status modification bypass: Attacker attempts to change appointment status directly (BLOCKED: `allow update: if false`).

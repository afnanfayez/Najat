# Image Generation Prompts (Gemini)

35 prompts for the seeded facility/article records that currently have `image: null`. Every
other entity type (aid points, aid donors, users) has no `image` column and needs nothing here.

## How to use this file

1. Paste each prompt into Gemini (image generation) as-is.
2. Save the output using the **filename** given under each entry — that's just a suggestion to
   keep track of which image belongs to which record while you review them; it does not need to
   match anything in the app.
3. Upload the image through the admin edit screen for that facility/article (Admin → Health
   Services / Health Guide → edit → image), which pushes it to Supabase Storage
   (`facility-images` / `article-images` buckets) and saves the returned URL to the record.
4. Do not regenerate this file per-image — if a prompt needs tweaking, edit it in place here.

## Style guide (applies to every prompt below)

- **Format**: photorealistic documentary/photojournalism style, natural daylight, 16:9 landscape.
- **Tone**: calm, functional, dignified — these represent real active facilities serving people
  in crisis. No staged smiling stock-photo energy, no dramatization, no visible gore, no weapons,
  no destruction/rubble in frame (that's not what these facility photos are for).
- **People**: if people appear, keep them generic/anonymous (backs turned, mid-distance, faces
  not the focus) — never a specific named or identifiable real individual.
- **Setting**: Gaza Strip, Mediterranean coastal architecture, modest concrete buildings,
  Arabic signage where signage is visible (do not render specific invented text/words on signs
  unless noted — just implied signage shapes/blocks is fine).
- **Negative constraints** (append mentally to every prompt): no visible brand logos, no
  identifiable real hospital signage/logos, no gore, no weapons, no political symbols, no text
  overlays baked into the image.

---

## Hospitals (10)

### 1. مستشفى الشفاء (hosp-001) — critical status, level-1 emergency, general surgery
`hospital-001-al-shifa.png`
> A large multi-story concrete hospital building exterior in Gaza City, main entrance with an
> ambulance bay, a few parked ambulances, overcast late-afternoon light, sense of a busy major
> trauma hospital operating at full capacity, photorealistic documentary photo, 16:9.

### 2. مستشفى ناصر الطبي (hosp-002) — Khan Younis, internal medicine/pediatrics/OB
`hospital-002-nasser.png`
> A mid-size regional hospital exterior in Khan Younis, clean modest concrete facade, covered
> entrance walkway, a nurse in scrubs walking toward the entrance in the middle distance,
> morning light, photorealistic documentary photo, 16:9.

### 3. مستشفى أوروبا غزة (الأوروبي) (hosp-003) — Khan Younis, trauma/orthopedics/cardiology
`hospital-003-european.png`
> A modern European-style hospital building exterior on the western edge of Khan Younis, wider
> footprint with multiple wings, an ambulance parked near a marked emergency entrance, clear
> daylight, photorealistic documentary photo, 16:9.

### 4. مستشفى الرنتيسي التخصصي للأطفال (hosp-004) — pediatric specialty, full/at-capacity
`hospital-004-rantisi-pediatric.png`
> A pediatric hospital exterior in Gaza City, softer building details suggesting a children's
> hospital (rounded awning, simple mural-style color accents on an otherwise plain concrete
> facade — no readable text), quiet entrance, daytime, photorealistic documentary photo, 16:9.

### 5. مستشفى النصر التخصصي للأطفال والولادة (hosp-005) — Deir al-Balah, maternity/pediatric
`hospital-005-al-nasr-maternity.png`
> A small specialty maternity and children's hospital exterior in Deir al-Balah, single low-rise
> building, modest entrance with a small covered waiting area, warm late-morning light,
> photorealistic documentary photo, 16:9.

### 6. مستشفى كمال عدوان (hosp-006) — Beit Lahiya, critical, level-1, limited ICU
`hospital-006-kamal-adwan.png`
> A modest hospital building exterior in Beit Lahiya showing visible strain — a full parking
> area, a couple of staff moving supplies near the entrance, functional but stretched
> atmosphere, overcast light, photorealistic documentary photo, 16:9.

### 7. مستشفى شهداء الأقصى (hosp-007) — Deir al-Balah, central Gaza, ER/general surgery
`hospital-007-al-aqsa-martyrs.png`
> A central hospital building exterior in Deir al-Balah, mid-size concrete structure with a
> visible emergency entrance sign area (blank/generic signage shape, no invented text), a
> stretcher trolley parked near the doors, midday light, photorealistic documentary photo, 16:9.

### 8. مستشفى أصدقاء المريض الخيري (hosp-008) — Gaza City / Zeitoun, charity, internal/kidney
`hospital-008-patients-friends.png`
> A smaller charitable hospital exterior in the Zeitoun area of Gaza City, understated modest
> building, simple entrance, calm and quiet street scene, soft afternoon light, photorealistic
> documentary photo, 16:9.

### 9. مستشفى الدرة للولادة والأطفال (hosp-009) — Gaza City, currently closed
`hospital-009-al-durra-closed.png`
> A maternity and children's hospital exterior in Gaza City that is currently closed —
> shuttered entrance gate, no cars in the small forecourt, quiet and still, muted grey daylight,
> photorealistic documentary photo, 16:9.

### 10. مستشفى الوفاء لإعادة التأهيل (hosp-010) — Al-Zahra, rehabilitation/orthopedics
`hospital-010-al-wafa-rehab.png`
> A rehabilitation hospital exterior in Al-Zahra, single-story accessible building with a ramp
> entrance and wide doorway, a wheelchair visible near the entrance, calm residential
> surroundings, soft daylight, photorealistic documentary photo, 16:9.

---

## Pharmacies (6)

### 11. صيدلية الشفاء (pharm-001) — Gaza City, 24-hour
`pharmacy-001-al-shifa.png`
> A small neighborhood pharmacy storefront in Gaza City at dusk with interior lights on
> (suggesting 24-hour operation), a green cross-style pharmacy sign silhouette (no readable
> text), shelves of medicine boxes visible through the window, photorealistic documentary
> photo, 16:9.

### 12. صيدلية النور (pharm-002) — Khan Younis
`pharmacy-002-al-nour.png`
> A modest pharmacy storefront on a street in Khan Younis, daytime, a shopkeeper's counter
> visible through an open door, a few medicine boxes stacked near the window, photorealistic
> documentary photo, 16:9.

### 13. صيدلية الرحمة (pharm-003) — Rafah
`pharmacy-003-al-rahma.png`
> A small pharmacy storefront in Rafah, simple shopfront with metal shutters partly open,
> modest stock visible on shelves inside, warm afternoon light, photorealistic documentary
> photo, 16:9.

### 14. صيدلية الأمل (pharm-004) — Deir al-Balah
`pharmacy-004-al-amal.png`
> A neighborhood pharmacy storefront in central Deir al-Balah, narrow single-window shop, a
> respiratory-inhaler display visible near the counter, midday light, photorealistic
> documentary photo, 16:9.

### 15. صيدلية بيت لاهيا المركزية (pharm-005) — Beit Lahiya
`pharmacy-005-beit-lahiya-central.png`
> A central pharmacy storefront in Beit Lahiya, slightly larger corner shop with two display
> windows, modest exterior, quiet street, overcast light, photorealistic documentary photo,
> 16:9.

### 16. صيدلية الوحدة (pharm-006) — Gaza City / Zeitoun, 24-hour
`pharmacy-006-al-wehda.png`
> A pharmacy storefront in the Zeitoun neighborhood of Gaza City, interior lights on against a
> dusk sky suggesting round-the-clock service, a small queue silhouette of two or three people
> waiting outside, photorealistic documentary photo, 16:9.

---

## Labs (5)

### 17. مختبر غزة المركزي (lab-001) — Gaza City, ISO-certified
`lab-001-gaza-central.png`
> A clean modern medical laboratory reception/entrance in Gaza City, glass door with a blood-
> test icon decal, a small waiting bench, bright clinical lighting, tidy and orderly,
> photorealistic documentary photo, 16:9.

### 18. مختبر النور التخصصي (lab-002) — Khan Younis
`lab-002-al-nour-specialist.png`
> A small specialist diagnostic lab storefront in Khan Younis, modest single-room clinic feel,
> a lab technician silhouette visible through a window bench, daylight, photorealistic
> documentary photo, 16:9.

### 19. مختبر رفح الطبي (lab-003) — Rafah
`lab-003-rafah-medical.png`
> A modest medical laboratory entrance in Rafah's Shaboura area, simple building front, a
> sample-collection window at street level, midday light, photorealistic documentary photo,
> 16:9.

### 20. مختبر دير البلح المشترك (lab-004) — Deir al-Balah, ISO-certified
`lab-004-deir-al-balah-joint.png`
> A joint diagnostic laboratory building front in Deir al-Balah, slightly larger shared-facility
> entrance with two doors, clean and orderly, soft afternoon light, photorealistic documentary
> photo, 16:9.

### 21. مختبر بيت حانون (lab-005) — Beit Hanoun
`lab-005-beit-hanoun.png`
> A small neighborhood lab at the northern entrance of Beit Hanoun, modest storefront, quiet
> street with few pedestrians, overcast light, photorealistic documentary photo, 16:9.

---

## Clinics (4)

### 22. عيادة الأمل التخصصية (clinic-001) — Gaza City, internal medicine/dermatology
`clinic-001-al-amal-specialist.png`
> A small specialist outpatient clinic entrance on a street in Gaza City, a simple waiting area
> visible through the doorway with a few plastic chairs, daylight, photorealistic documentary
> photo, 16:9.

### 23. عيادة خان يونس للأسرة (clinic-002) — Khan Younis, family medicine/pediatrics
`clinic-002-khan-younis-family.png`
> A family-medicine clinic storefront in the Amal neighborhood of Khan Younis, a small
> children's height chart or growth-chart poster silhouette visible through the window (no
> readable text), warm morning light, photorealistic documentary photo, 16:9.

### 24. عيادة رفح النسائية (clinic-003) — Rafah, women's/OB clinic
`clinic-003-rafah-womens.png`
> A women's health clinic entrance in the Tel al-Sultan area of Rafah, modest single-story
> building, a quiet private entrance with a small covered porch, soft daylight, photorealistic
> documentary photo, 16:9.

### 25. عيادة دير البلح للعظام (clinic-004) — Deir al-Balah, orthopedics/physiotherapy
`clinic-004-deir-al-balah-orthopedic.png`
> An orthopedics and physiotherapy clinic storefront on the main street of Deir al-Balah, a
> set of parallel bars or physiotherapy equipment faintly visible through the window, daylight,
> photorealistic documentary photo, 16:9.

---

## Dental clinics (3)

### 26. عيادة أسنان الابتسامة (dental-001) — Gaza City
`dental-001-al-ibtisama.png`
> A small dental clinic storefront on Al-Nasr street in Gaza City, a simple tooth-icon sign
> silhouette, clean glass entrance, bright daylight, photorealistic documentary photo, 16:9.

### 27. مركز خان يونس لطب الأسنان (dental-002) — Khan Younis, Qarara
`dental-002-khan-younis-dental-center.png`
> A dental center entrance in the Qarara district of Khan Younis, modest two-window storefront,
> a dental chair faintly visible through the glass, midday light, photorealistic documentary
> photo, 16:9.

### 28. عيادة رفح لطب وجراحة الفم (dental-003) — Rafah, Yibna, oral surgery
`dental-003-rafah-oral-surgery.png`
> A small oral surgery and dental clinic entrance in the Yibna neighborhood of Rafah, single
> narrow storefront, quiet street, soft afternoon light, photorealistic documentary photo,
> 16:9.

---

## Health-guide articles (7)

Illustration style for this group only — flat, warm, editorial medical-illustration style
(think WHO/UNICEF public-health poster art), not photorealistic. Muted warm palette (terracotta,
sand, soft teal), simple flat shapes, no text baked into the image, 16:9.

### 29. كيفية التعامل مع الجروح البسيطة — first aid, minor wounds
`article-001-minor-wounds.png`
> Flat editorial medical-illustration of a hand gently cleaning a small wound on a forearm with
> water and a cloth, a sterile bandage nearby, warm muted terracotta and soft teal palette, no
> text, calm reassuring tone, 16:9.

### 30. الإسعافات الأولية عند حدوث كسر — first aid, fractures
`article-002-fracture-first-aid.png`
> Flat editorial medical-illustration of a forearm being immobilized with a simple improvised
> splint and cloth wrap, a second pair of hands helping steady it, warm muted terracotta and
> soft teal palette, no text, calm instructional tone, 16:9.

### 31. التوعية بأهمية شرب المياه النظيفة — awareness, clean water
`article-003-clean-water-awareness.png`
> Flat editorial illustration of a hand pouring water through a simple cloth filter into a clean
> cup, sun and a water container in the background, warm muted terracotta and soft teal
> palette, no text, calm hopeful tone, 16:9.

### 32. الوقاية من أمراض الجهاز التنفسي في أوقات النزوح — awareness, respiratory health in shelters
`article-004-respiratory-health-shelters.png`
> Flat editorial illustration of an open tent or shelter flap with visible airflow/ventilation
> lines, a small family silhouette resting inside with space between them, warm muted
> terracotta and soft teal palette, no text, calm tone, 16:9.

### 33. دعم الصحة النفسية للأطفال في الأزمات — mental health, children
`article-005-child-mental-health.png`
> Flat editorial illustration of an adult and a child sitting together drawing or talking, warm
> and gentle body language, simple warm terracotta and soft teal palette, no text, tender and
> hopeful tone, 16:9.

### 34. التعامل مع القلق والتوتر النفسي — mental health, coping with anxiety
`article-006-coping-with-anxiety.png`
> Flat editorial illustration of a person sitting calmly with eyes closed, one hand on their
> chest in a breathing exercise, soft radiating calm-breath lines, warm muted terracotta and
> soft teal palette, no text, serene tone, 16:9.

### 35. مقال مؤرشف قيد المراجعة — archived/inactive placeholder article
`article-007-archived-placeholder.png`
> Flat editorial illustration of a simple closed folder or archive box with a soft muted color
> palette, understated and neutral, warm terracotta and soft teal palette, no text, quiet
> unobtrusive tone, 16:9.

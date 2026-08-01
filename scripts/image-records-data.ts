export interface ImageRecord {
  id: string
  category: 'hospitals' | 'pharmacies' | 'labs' | 'clinics' | 'dental_clinics' | 'articles'
  table: string
  matchColumn: string
  matchValue: string
  bucket: string
  storagePath: string
  suggestedFilename: string
  prompt: string
}

export const IMAGE_RECORDS: ImageRecord[] = [
  // Hospitals (10)
  {
    id: 'hosp-001',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى الشفاء',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-001-al-shifa.png',
    suggestedFilename: 'hospital-001-al-shifa.png',
    prompt:
      'A large multi-story concrete hospital building exterior in Gaza City, main entrance with an ambulance bay, a few parked ambulances, overcast late-afternoon light, sense of a busy major trauma hospital operating at full capacity, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'hosp-002',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى ناصر الطبي',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-002-nasser.png',
    suggestedFilename: 'hospital-002-nasser.png',
    prompt:
      'A mid-size regional hospital exterior in Khan Younis, clean modest concrete facade, covered entrance walkway, a nurse in scrubs walking toward the entrance in the middle distance, morning light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'hosp-003',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى أوروبا غزة (الأوروبي)',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-003-european.png',
    suggestedFilename: 'hospital-003-european.png',
    prompt:
      'A modern European-style hospital building exterior on the western edge of Khan Younis, wider footprint with multiple wings, an ambulance parked near a marked emergency entrance, clear daylight, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'hosp-004',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى الرنتيسي التخصصي للأطفال',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-004-rantisi-pediatric.png',
    suggestedFilename: 'hospital-004-rantisi-pediatric.png',
    prompt:
      "A pediatric hospital exterior in Gaza City, softer building details suggesting a children's hospital (rounded awning, simple mural-style color accents on an otherwise plain concrete facade — no readable text), quiet entrance, daytime, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'hosp-005',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى النصر التخصصي للأطفال والولادة',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-005-al-nasr-maternity.png',
    suggestedFilename: 'hospital-005-al-nasr-maternity.png',
    prompt:
      "A small specialty maternity and children's hospital exterior in Deir al-Balah, single low-rise building, modest entrance with a small covered waiting area, warm late-morning light, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'hosp-006',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى كمال عدوان',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-006-kamal-adwan.png',
    suggestedFilename: 'hospital-006-kamal-adwan.png',
    prompt:
      'A modest hospital building exterior in Beit Lahiya showing visible strain — a full parking area, a couple of staff moving supplies near the entrance, functional but stretched atmosphere, overcast light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'hosp-007',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى شهداء الأقصى',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-007-al-aqsa-martyrs.png',
    suggestedFilename: 'hospital-007-al-aqsa-martyrs.png',
    prompt:
      'A central hospital building exterior in Deir al-Balah, mid-size concrete structure with a visible emergency entrance sign area (blank/generic signage shape, no invented text), a stretcher trolley parked near the doors, midday light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'hosp-008',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى أصدقاء المريض الخيري',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-008-patients-friends.png',
    suggestedFilename: 'hospital-008-patients-friends.png',
    prompt:
      'A smaller charitable hospital exterior in the Zeitoun area of Gaza City, understated modest building, simple entrance, calm and quiet street scene, soft afternoon light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'hosp-009',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى الدرة للولادة والأطفال',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-009-al-durra-closed.png',
    suggestedFilename: 'hospital-009-al-durra-closed.png',
    prompt:
      "A maternity and children's hospital exterior in Gaza City that is currently closed — shuttered entrance gate, no cars in the small forecourt, quiet and still, muted grey daylight, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'hosp-010',
    category: 'hospitals',
    table: 'hospitals',
    matchColumn: 'name',
    matchValue: 'مستشفى الوفاء لإعادة التأهيل',
    bucket: 'facility-images',
    storagePath: 'hospitals/hospital-010-al-wafa-rehab.png',
    suggestedFilename: 'hospital-010-al-wafa-rehab.png',
    prompt:
      'A rehabilitation hospital exterior in Al-Zahra, single-story accessible building with a ramp entrance and wide doorway, a wheelchair visible near the entrance, calm residential surroundings, soft daylight, photorealistic documentary photo, 16:9.',
  },

  // Pharmacies (6)
  {
    id: 'pharm-001',
    category: 'pharmacies',
    table: 'pharmacies',
    matchColumn: 'name',
    matchValue: 'صيدلية الشفاء',
    bucket: 'facility-images',
    storagePath: 'pharmacies/pharmacy-001-al-shifa.png',
    suggestedFilename: 'pharmacy-001-al-shifa.png',
    prompt:
      'A small neighborhood pharmacy storefront in Gaza City at dusk with interior lights on (suggesting 24-hour operation), a green cross-style pharmacy sign silhouette (no readable text), shelves of medicine boxes visible through the window, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'pharm-002',
    category: 'pharmacies',
    table: 'pharmacies',
    matchColumn: 'name',
    matchValue: 'صيدلية النور',
    bucket: 'facility-images',
    storagePath: 'pharmacies/pharmacy-002-al-nour.png',
    suggestedFilename: 'pharmacy-002-al-nour.png',
    prompt:
      "A modest pharmacy storefront on a street in Khan Younis, daytime, a shopkeeper's counter visible through an open door, a few medicine boxes stacked near the window, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'pharm-003',
    category: 'pharmacies',
    table: 'pharmacies',
    matchColumn: 'name',
    matchValue: 'صيدلية الرحمة',
    bucket: 'facility-images',
    storagePath: 'pharmacies/pharmacy-003-al-rahma.png',
    suggestedFilename: 'pharmacy-003-al-rahma.png',
    prompt:
      'A small pharmacy storefront in Rafah, simple shopfront with metal shutters partly open, modest stock visible on shelves inside, warm afternoon light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'pharm-004',
    category: 'pharmacies',
    table: 'pharmacies',
    matchColumn: 'name',
    matchValue: 'صيدلية الأمل',
    bucket: 'facility-images',
    storagePath: 'pharmacies/pharmacy-004-al-amal.png',
    suggestedFilename: 'pharmacy-004-al-amal.png',
    prompt:
      'A neighborhood pharmacy storefront in central Deir al-Balah, narrow single-window shop, a respiratory-inhaler display visible near the counter, midday light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'pharm-005',
    category: 'pharmacies',
    table: 'pharmacies',
    matchColumn: 'name',
    matchValue: 'صيدلية بيت لاهيا المركزية',
    bucket: 'facility-images',
    storagePath: 'pharmacies/pharmacy-005-beit-lahiya-central.png',
    suggestedFilename: 'pharmacy-005-beit-lahiya-central.png',
    prompt:
      'A central pharmacy storefront in Beit Lahiya, slightly larger corner shop with two display windows, modest exterior, quiet street, overcast light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'pharm-006',
    category: 'pharmacies',
    table: 'pharmacies',
    matchColumn: 'name',
    matchValue: 'صيدلية الوحدة',
    bucket: 'facility-images',
    storagePath: 'pharmacies/pharmacy-006-al-wehda.png',
    suggestedFilename: 'pharmacy-006-al-wehda.png',
    prompt:
      'A pharmacy storefront in the Zeitoun neighborhood of Gaza City, interior lights on against a dusk sky suggesting round-the-clock service, a small queue silhouette of two or three people waiting outside, photorealistic documentary photo, 16:9.',
  },

  // Labs (5)
  {
    id: 'lab-001',
    category: 'labs',
    table: 'labs',
    matchColumn: 'name',
    matchValue: 'مختبر غزة المركزي',
    bucket: 'facility-images',
    storagePath: 'labs/lab-001-gaza-central.png',
    suggestedFilename: 'lab-001-gaza-central.png',
    prompt:
      'A clean modern medical laboratory reception/entrance in Gaza City, glass door with a blood-test icon decal, a small waiting bench, bright clinical lighting, tidy and orderly, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'lab-002',
    category: 'labs',
    table: 'labs',
    matchColumn: 'name',
    matchValue: 'مختبر النور التخصصي',
    bucket: 'facility-images',
    storagePath: 'labs/lab-002-al-nour-specialist.png',
    suggestedFilename: 'lab-002-al-nour-specialist.png',
    prompt:
      'A small specialist diagnostic lab storefront in Khan Younis, modest single-room clinic feel, a lab technician silhouette visible through a window bench, daylight, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'lab-003',
    category: 'labs',
    table: 'labs',
    matchColumn: 'name',
    matchValue: 'مختبر رفح الطبي',
    bucket: 'facility-images',
    storagePath: 'labs/lab-003-rafah-medical.png',
    suggestedFilename: 'lab-003-rafah-medical.png',
    prompt:
      "A modest medical laboratory entrance in Rafah's Shaboura area, simple building front, a sample-collection window at street level, midday light, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'lab-004',
    category: 'labs',
    table: 'labs',
    matchColumn: 'name',
    matchValue: 'مختبر دير البلح المشترك',
    bucket: 'facility-images',
    storagePath: 'labs/lab-004-deir-al-balah-joint.png',
    suggestedFilename: 'lab-004-deir-al-balah-joint.png',
    prompt:
      'A joint diagnostic laboratory building front in Deir al-Balah, slightly larger shared-facility entrance with two doors, clean and orderly, soft afternoon light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'lab-005',
    category: 'labs',
    table: 'labs',
    matchColumn: 'name',
    matchValue: 'مختبر بيت حانون',
    bucket: 'facility-images',
    storagePath: 'labs/lab-005-beit-hanoun.png',
    suggestedFilename: 'lab-005-beit-hanoun.png',
    prompt:
      'A small neighborhood lab at the northern entrance of Beit Hanoun, modest storefront, quiet street with few pedestrians, overcast light, photorealistic documentary photo, 16:9.',
  },

  // Clinics (4)
  {
    id: 'clinic-001',
    category: 'clinics',
    table: 'clinics',
    matchColumn: 'name',
    matchValue: 'عيادة الأمل التخصصية',
    bucket: 'facility-images',
    storagePath: 'clinics/clinic-001-al-amal-specialist.png',
    suggestedFilename: 'clinic-001-al-amal-specialist.png',
    prompt:
      'A small specialist outpatient clinic entrance on a street in Gaza City, a simple waiting area visible through the doorway with a few plastic chairs, daylight, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'clinic-002',
    category: 'clinics',
    table: 'clinics',
    matchColumn: 'name',
    matchValue: 'عيادة خان يونس للأسرة',
    bucket: 'facility-images',
    storagePath: 'clinics/clinic-002-khan-younis-family.png',
    suggestedFilename: 'clinic-002-khan-younis-family.png',
    prompt:
      "A family-medicine clinic storefront in the Amal neighborhood of Khan Younis, a small children's height chart or growth-chart poster silhouette visible through the window (no readable text), warm morning light, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'clinic-003',
    category: 'clinics',
    table: 'clinics',
    matchColumn: 'name',
    matchValue: 'عيادة رفح النسائية',
    bucket: 'facility-images',
    storagePath: 'clinics/clinic-003-rafah-womens.png',
    suggestedFilename: 'clinic-003-rafah-womens.png',
    prompt:
      "A women's health clinic entrance in the Tel al-Sultan area of Rafah, modest single-story building, a quiet private entrance with a small covered porch, soft daylight, photorealistic documentary photo, 16:9.",
  },
  {
    id: 'clinic-004',
    category: 'clinics',
    table: 'clinics',
    matchColumn: 'name',
    matchValue: 'عيادة دير البلح للعظام',
    bucket: 'facility-images',
    storagePath: 'clinics/clinic-004-deir-al-balah-orthopedic.png',
    suggestedFilename: 'clinic-004-deir-al-balah-orthopedic.png',
    prompt:
      'An orthopedics and physiotherapy clinic storefront on the main street of Deir al-Balah, a set of parallel bars or physiotherapy equipment faintly visible through the window, daylight, photorealistic documentary photo, 16:9.',
  },

  // Dental clinics (3)
  {
    id: 'dental-001',
    category: 'dental_clinics',
    table: 'dental_clinics',
    matchColumn: 'name',
    matchValue: 'عيادة أسنان الابتسامة',
    bucket: 'facility-images',
    storagePath: 'dental/dental-001-al-ibtisama.png',
    suggestedFilename: 'dental-001-al-ibtisama.png',
    prompt:
      'A small dental clinic storefront on Al-Nasr street in Gaza City, a simple tooth-icon sign silhouette, clean glass entrance, bright daylight, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'dental-002',
    category: 'dental_clinics',
    table: 'dental_clinics',
    matchColumn: 'name',
    matchValue: 'مركز خان يونس لطب الأسنان',
    bucket: 'facility-images',
    storagePath: 'dental/dental-002-khan-younis-dental-center.png',
    suggestedFilename: 'dental-002-khan-younis-dental-center.png',
    prompt:
      'A dental center entrance in the Qarara district of Khan Younis, modest two-window storefront, a dental chair faintly visible through the glass, midday light, photorealistic documentary photo, 16:9.',
  },
  {
    id: 'dental-003',
    category: 'dental_clinics',
    table: 'dental_clinics',
    matchColumn: 'name',
    matchValue: 'عيادة رفح لطب وجراحة الفم',
    bucket: 'facility-images',
    storagePath: 'dental/dental-003-rafah-oral-surgery.png',
    suggestedFilename: 'dental-003-rafah-oral-surgery.png',
    prompt:
      'A small oral surgery and dental clinic entrance in the Yibna neighborhood of Rafah, single narrow storefront, quiet street, soft afternoon light, photorealistic documentary photo, 16:9.',
  },

  // Health-guide articles (7)
  {
    id: 'article-001',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'كيفية التعامل مع الجروح البسيطة',
    bucket: 'article-images',
    storagePath: 'article-001-minor-wounds.png',
    suggestedFilename: 'article-001-minor-wounds.png',
    prompt:
      'Flat editorial medical-illustration of a hand gently cleaning a small wound on a forearm with water and a cloth, a sterile bandage nearby, warm muted terracotta and soft teal palette, no text, calm reassuring tone, 16:9.',
  },
  {
    id: 'article-002',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'الإسعافات الأولية عند حدوث كسر',
    bucket: 'article-images',
    storagePath: 'article-002-fracture-first-aid.png',
    suggestedFilename: 'article-002-fracture-first-aid.png',
    prompt:
      'Flat editorial medical-illustration of a forearm being immobilized with a simple improvised splint and cloth wrap, a second pair of hands helping steady it, warm muted terracotta and soft teal palette, no text, calm instructional tone, 16:9.',
  },
  {
    id: 'article-003',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'التوعية بأهمية شرب المياه النظيفة',
    bucket: 'article-images',
    storagePath: 'article-003-clean-water-awareness.png',
    suggestedFilename: 'article-003-clean-water-awareness.png',
    prompt:
      'Flat editorial illustration of a hand pouring water through a simple cloth filter into a clean cup, sun and a water container in the background, warm muted terracotta and soft teal palette, no text, calm hopeful tone, 16:9.',
  },
  {
    id: 'article-004',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'الوقاية من أمراض الجهاز التنفسي في أوقات النزوح',
    bucket: 'article-images',
    storagePath: 'article-004-respiratory-health-shelters.png',
    suggestedFilename: 'article-004-respiratory-health-shelters.png',
    prompt:
      'Flat editorial illustration of an open tent or shelter flap with visible airflow/ventilation lines, a small family silhouette resting inside with space between them, warm muted terracotta and soft teal palette, no text, calm tone, 16:9.',
  },
  {
    id: 'article-005',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'دعم الصحة النفسية للأطفال في الأزمات',
    bucket: 'article-images',
    storagePath: 'article-005-child-mental-health.png',
    suggestedFilename: 'article-005-child-mental-health.png',
    prompt:
      'Flat editorial illustration of an adult and a child sitting together drawing or talking, warm and gentle body language, simple warm terracotta and soft teal palette, no text, tender and hopeful tone, 16:9.',
  },
  {
    id: 'article-006',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'التعامل مع القلق والتوتر النفسي',
    bucket: 'article-images',
    storagePath: 'article-006-coping-with-anxiety.png',
    suggestedFilename: 'article-006-coping-with-anxiety.png',
    prompt:
      'Flat editorial illustration of a person sitting calmly with eyes closed, one hand on their chest in a breathing exercise, soft radiating calm-breath lines, warm muted terracotta and soft teal palette, no text, serene tone, 16:9.',
  },
  {
    id: 'article-007',
    category: 'articles',
    table: 'articles',
    matchColumn: 'title_ar',
    matchValue: 'مقال مؤرشف قيد المراجعة',
    bucket: 'article-images',
    storagePath: 'article-007-archived-placeholder.png',
    suggestedFilename: 'article-007-archived-placeholder.png',
    prompt:
      'Flat editorial illustration of a simple closed folder or archive box with a soft muted color palette, understated and neutral, warm terracotta and soft teal palette, no text, quiet unobtrusive tone, 16:9.',
  },
]

import type { ArticleResponseDto } from '@/schemas/articleApi'

export function seedArticles(): ArticleResponseDto[] {
  const now = new Date().toISOString()
  const author = { id: 'user-volunteer-001', fullName: 'محمد إبراهيم عودة', role: 'volunteer' }

  const items: Array<Omit<ArticleResponseDto, 'createdAt' | 'updatedAt'>> = [
    {
      id: 'article-001',
      titleAr: 'كيفية التعامل مع الجروح البسيطة',
      titleEn: 'How to treat minor wounds',
      contentAr:
        'نظّف الجرح بالماء النظيف والصابون، ثم غطّه بضمادة معقمة. راقب علامات الالتهاب مثل الاحمرار أو التورم واطلب المساعدة الطبية إذا استمرت.',
      contentEn: 'Clean the wound with clean water and soap, then cover it with a sterile bandage.',
      category: 'first-aid',
      image: null,
      readTime: 4,
      viewsCount: 1520,
      isActive: true,
      author,
    },
    {
      id: 'article-002',
      titleAr: 'الإسعافات الأولية عند حدوث كسر',
      titleEn: 'First aid for fractures',
      contentAr:
        'ثبّت العضو المصاب دون محاولة إعادته لوضعه الطبيعي، واستخدم جبيرة مؤقتة إن أمكن، وتوجه فوراً لأقرب مركز طبي.',
      contentEn: 'Immobilize the affected limb and seek medical help immediately.',
      category: 'first-aid',
      image: null,
      readTime: 5,
      viewsCount: 980,
      isActive: true,
      author,
    },
    {
      id: 'article-003',
      titleAr: 'التوعية بأهمية شرب المياه النظيفة',
      titleEn: 'Awareness on safe drinking water',
      contentAr: 'تأكد من غلي المياه أو تعقيمها قبل الشرب لتفادي الأمراض المنقولة عبر المياه الملوثة.',
      contentEn: 'Boil or purify water before drinking to avoid waterborne diseases.',
      category: 'awareness',
      image: null,
      readTime: 3,
      viewsCount: 2210,
      isActive: true,
      author,
    },
    {
      id: 'article-004',
      titleAr: 'الوقاية من أمراض الجهاز التنفسي في أوقات النزوح',
      titleEn: 'Preventing respiratory illness during displacement',
      contentAr: 'حافظ على التهوية الجيدة في أماكن الإيواء وتجنب الازدحام قدر الإمكان لتقليل انتشار العدوى.',
      contentEn: 'Keep shelters well-ventilated and avoid overcrowding to reduce infection spread.',
      category: 'awareness',
      image: null,
      readTime: 4,
      viewsCount: 1340,
      isActive: true,
      author,
    },
    {
      id: 'article-005',
      titleAr: 'دعم الصحة النفسية للأطفال في الأزمات',
      titleEn: "Supporting children's mental health in crises",
      contentAr: 'حافظ على روتين يومي بسيط للأطفال، وامنحهم مساحة للتعبير عن مشاعرهم دون خوف.',
      contentEn: 'Maintain a simple daily routine and allow children to express their feelings freely.',
      category: 'mental-health',
      image: null,
      readTime: 6,
      viewsCount: 875,
      isActive: true,
      author,
    },
    {
      id: 'article-006',
      titleAr: 'التعامل مع القلق والتوتر النفسي',
      titleEn: 'Coping with anxiety and stress',
      contentAr: 'مارس تمارين التنفس العميق وتحدث مع شخص تثق به عند الشعور بالضغط النفسي الشديد.',
      contentEn: 'Practice deep breathing and talk to someone you trust when feeling overwhelmed.',
      category: 'mental-health',
      image: null,
      readTime: 5,
      viewsCount: 660,
      isActive: true,
      author,
    },
    {
      id: 'article-007',
      titleAr: 'مقال مؤرشف قيد المراجعة',
      titleEn: 'Archived article under review',
      contentAr: 'هذا المحتوى غير معروض حالياً للجمهور وهو مثال على حالة "غير نشط".',
      contentEn: 'This content is currently inactive — an example of the "inactive" state.',
      category: 'awareness',
      image: null,
      readTime: 2,
      viewsCount: 12,
      isActive: false,
      author,
    },
  ]

  return items.map((item) => ({ ...item, createdAt: now, updatedAt: now }))
}

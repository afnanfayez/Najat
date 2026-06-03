import type {
  HealthGuideEmotion,
  HealthGuideMentalTip,
  HealthGuideMentalTool,
} from '@/schemas/healthGuide'

export const EMOTIONS: HealthGuideEmotion[] = [
  {
    emoji: '😨',
    label: 'الخوف',
    desc: 'من الطبيعي الشعور بالخوف. دعك من الجروح. حاول أن تكون في مكان آمن الآن.',
  },
  {
    emoji: '😢',
    label: 'الحزن',
    desc: 'البكاء يعبر عن ألم حقيقي. دعها تنهمر حتى تشعر ببعض الراحة.',
  },
  {
    emoji: '😡',
    label: 'الغضب',
    desc: 'الغضب والظلم شعور طبيعي. تنفس ببطء وحاول وصف ما تشعر به.',
  },
  {
    emoji: '😮',
    label: 'الصدمة',
    desc: 'بعد الصدمة قد تشعر بتخدر. خذ وقتك دون ضغط لتتعافى.',
  },
]

export const MENTAL_TIPS: HealthGuideMentalTip[] = [
  {
    title: 'تقليل استهلاك الأخبار',
    desc: 'خصص 15 دقيقة فقط لمتابعة المستجدات. التعرض المستمر للأخبار القلقة يزيد من مستويات التوتر المرضي.',
  },
  {
    title: 'الروتين اليومي البسيط',
    desc: 'حاول الالتزام بأوقات نوم وصحيان ووجبات ثابتة. الروتين يعطي الشعور بالاستقرار في أوقات الأزمات.',
  },
  {
    title: 'التواصل الاجتماعي الداعم',
    desc: 'تحدث مع شخص تثق به. مشاركة مشاعرك تخفف العبء النفسي وتساعد على الشعور بالانتماء.',
  },
]

export const MENTAL_TOOLS: HealthGuideMentalTool[] = [
  {
    label: 'تمارين تنفس',
    icon: 'https://api.iconify.design/solar:wind-bold.svg?color=white',
  },
  {
    label: 'تأمل وتوجيه',
    icon: 'https://api.iconify.design/solar:user-bold.svg?color=white',
  },
  {
    label: 'تمارين تنفس',
    icon: 'https://api.iconify.design/solar:sleeping-bold.svg?color=white',
  },
  {
    label: 'تمارين تنفس',
    icon: 'https://api.iconify.design/solar:heart-bold.svg?color=white',
  },
]

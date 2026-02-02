import { NewIndustryTemplate } from "@/lib/db/schema";

// ============================================
// INDUSTRY TEMPLATE DATA
// ============================================

export const industryTemplates: Omit<NewIndustryTemplate, "id" | "createdAt">[] = [
  // ==========================================
  // HEALTH & WELLNESS
  // ==========================================
  {
    slug: "fitness-coach",
    name: "Fitness Coach / Personal Trainer",
    category: "Health & Wellness",
    icon: "💪",
    celebrationHeadline: "Congratulations on crushing it!",
    celebrationBody:
      "You showed up. You did the work. That's what champions do. I'm proud of the progress you've made.",
    reviewAsk:
      "Your feedback helps others find a coach who actually cares about their results.",
    googleHeadline: "Help others find their coach",
    googleSubhead: "A quick review helps people like you find the right fit.",
    referralHeadline: "Know anyone who needs a push?",
    referralBody:
      "If you've got a friend who's been meaning to get in shape, I'd love to help them the way I helped you.",
    isActive: true,
  },
  {
    slug: "gym",
    name: "Gym / Fitness Center",
    category: "Health & Wellness",
    icon: "🏋️",
    celebrationHeadline: "Thanks for being part of our community!",
    celebrationBody:
      "Your dedication to your fitness journey inspires everyone around you. Keep crushing those goals!",
    reviewAsk: "Help others discover a gym that actually supports their goals.",
    googleHeadline: "Share your gym experience",
    googleSubhead:
      "Your honest review helps others find the right place to train.",
    referralHeadline: "Got a workout buddy in mind?",
    referralBody:
      "Know someone looking for a new gym? We'd love to welcome them to the community.",
    isActive: true,
  },
  {
    slug: "yoga-studio",
    name: "Yoga Studio",
    category: "Health & Wellness",
    icon: "🧘",
    celebrationHeadline: "Namaste! Thank you for practicing with us.",
    celebrationBody:
      "Your presence on the mat brings positive energy to our entire community. We're grateful you chose to practice here.",
    reviewAsk: "Help others find their path to wellness.",
    googleHeadline: "Share your practice experience",
    googleSubhead: "Your words might be exactly what someone needs to hear.",
    referralHeadline: "Know someone who could use some peace?",
    referralBody:
      "If you have a friend who could benefit from yoga, we'd love to welcome them.",
    isActive: true,
  },
  {
    slug: "chiropractor",
    name: "Chiropractor",
    category: "Health & Wellness",
    icon: "🦴",
    celebrationHeadline: "Great to see you feeling better!",
    celebrationBody:
      "Your commitment to your health is paying off. It's been a pleasure helping you on your journey to feeling your best.",
    reviewAsk: "Help others find relief from their pain.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review could help someone else find the relief they need.",
    referralHeadline: "Know someone dealing with pain?",
    referralBody:
      "If you know someone struggling with back pain or discomfort, I'd be happy to help them too.",
    isActive: true,
  },
  {
    slug: "massage-therapist",
    name: "Massage Therapist",
    category: "Health & Wellness",
    icon: "💆",
    celebrationHeadline: "Hope you're feeling relaxed!",
    celebrationBody:
      "Taking time for self-care is so important. Thank you for trusting me with your wellness.",
    reviewAsk: "Help others discover the benefits of massage therapy.",
    googleHeadline: "Share your relaxation experience",
    googleSubhead: "Your review helps others prioritize their self-care.",
    referralHeadline: "Know someone who needs to unwind?",
    referralBody:
      "If you have a stressed-out friend who could use some relaxation, send them my way!",
    isActive: true,
  },
  {
    slug: "nutritionist",
    name: "Nutritionist / Dietitian",
    category: "Health & Wellness",
    icon: "🥗",
    celebrationHeadline: "Amazing progress on your health journey!",
    celebrationBody:
      "The changes you've made are setting you up for long-term success. I'm so proud of your commitment.",
    reviewAsk: "Help others take control of their nutrition.",
    googleHeadline: "Share your transformation",
    googleSubhead: "Your story could inspire someone to make a change.",
    referralHeadline: "Know someone struggling with their diet?",
    referralBody:
      "If you know someone who wants to improve their nutrition but doesn't know where to start, I'd love to help.",
    isActive: true,
  },

  // ==========================================
  // HOME SERVICES
  // ==========================================
  {
    slug: "plumber",
    name: "Plumber",
    category: "Home Services",
    icon: "🔧",
    celebrationHeadline: "Glad we could get that sorted!",
    celebrationBody:
      "No one wants to deal with plumbing problems, so I'm happy we could fix it quickly for you.",
    reviewAsk: "Help your neighbors find a plumber they can trust.",
    googleHeadline: "Share your experience",
    googleSubhead: "Honest reviews help homeowners find reliable help.",
    referralHeadline: "Know anyone with plumbing issues?",
    referralBody:
      "If your friends or family ever need a plumber, I'd appreciate you passing along my info.",
    isActive: true,
  },
  {
    slug: "electrician",
    name: "Electrician",
    category: "Home Services",
    icon: "⚡",
    celebrationHeadline: "All powered up!",
    celebrationBody:
      "Glad we could get your electrical issues sorted safely and efficiently.",
    reviewAsk: "Help others find an electrician they can trust with their home.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps homeowners make safe choices.",
    referralHeadline: "Know anyone who needs electrical work?",
    referralBody:
      "If you know anyone needing electrical work done, I'd appreciate the referral.",
    isActive: true,
  },
  {
    slug: "hvac",
    name: "HVAC Technician",
    category: "Home Services",
    icon: "❄️",
    celebrationHeadline: "Stay comfortable!",
    celebrationBody:
      "Happy we could get your heating/cooling system running perfectly for you.",
    reviewAsk: "Help others find reliable HVAC service.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your feedback helps homeowners stay comfortable.",
    referralHeadline: "Know anyone with HVAC issues?",
    referralBody:
      "If you know anyone struggling with their heating or cooling, send them my way!",
    isActive: true,
  },
  {
    slug: "landscaper",
    name: "Landscaper / Gardener",
    category: "Home Services",
    icon: "🌳",
    celebrationHeadline: "Enjoy your beautiful outdoor space!",
    celebrationBody:
      "It's been great transforming your yard. Hope you love spending time out there!",
    reviewAsk: "Help others create their dream outdoor space.",
    googleHeadline: "Share your transformation",
    googleSubhead: "Before and after stories inspire others!",
    referralHeadline: "Know anyone who needs landscaping help?",
    referralBody:
      "If you have neighbors or friends who want to upgrade their yard, I'd love to help them too.",
    isActive: true,
  },
  {
    slug: "cleaner",
    name: "House Cleaner / Cleaning Service",
    category: "Home Services",
    icon: "🧹",
    celebrationHeadline: "Enjoy your sparkling clean home!",
    celebrationBody:
      "There's nothing like coming home to a clean space. Happy we could help!",
    reviewAsk: "Help busy people find reliable cleaning help.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps others find cleaning services they can trust.",
    referralHeadline: "Know anyone who could use help with cleaning?",
    referralBody:
      "If you have friends who are too busy to keep up with cleaning, we'd love to help them too.",
    isActive: true,
  },
  {
    slug: "handyman",
    name: "Handyman",
    category: "Home Services",
    icon: "🔨",
    celebrationHeadline: "All fixed up!",
    celebrationBody:
      "Glad I could cross those tasks off your to-do list. Your home is in great shape!",
    reviewAsk: "Help others find reliable help for their home projects.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps homeowners find trustworthy help.",
    referralHeadline: "Know anyone with a to-do list that keeps growing?",
    referralBody:
      "If you know anyone who needs help with home repairs or projects, send them my way!",
    isActive: true,
  },

  // ==========================================
  // PROFESSIONAL SERVICES
  // ==========================================
  {
    slug: "accountant",
    name: "Accountant / CPA",
    category: "Professional Services",
    icon: "📊",
    celebrationHeadline: "Your finances are in great shape!",
    celebrationBody:
      "It's been a pleasure helping you get organized and optimize your financial situation.",
    reviewAsk: "Help other business owners find reliable financial guidance.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps others find an accountant they can trust.",
    referralHeadline: "Know a business owner who needs help with their books?",
    referralBody:
      "If you know anyone struggling with their finances or taxes, I'd be happy to help them too.",
    isActive: true,
  },
  {
    slug: "lawyer",
    name: "Lawyer / Attorney",
    category: "Professional Services",
    icon: "⚖️",
    celebrationHeadline: "Glad we could get that resolved!",
    celebrationBody:
      "Legal matters can be stressful. I'm pleased we could navigate this together successfully.",
    reviewAsk: "Help others find legal representation they can trust.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps others in similar situations.",
    referralHeadline: "Know anyone who needs legal help?",
    referralBody:
      "If you know someone dealing with a legal matter, I'd be honored if you'd recommend me.",
    isActive: true,
  },
  {
    slug: "consultant",
    name: "Business Consultant / Coach",
    category: "Professional Services",
    icon: "💼",
    celebrationHeadline: "Great work on your progress!",
    celebrationBody:
      "Watching your business grow has been incredibly rewarding. You've put in the work and it shows.",
    reviewAsk: "Help other business owners find the guidance they need.",
    googleHeadline: "Share your growth story",
    googleSubhead: "Your journey could inspire another entrepreneur.",
    referralHeadline: "Know a business owner who's feeling stuck?",
    referralBody:
      "If you know someone who could use some guidance with their business, I'd love to connect.",
    isActive: true,
  },
  {
    slug: "photographer",
    name: "Photographer",
    category: "Professional Services",
    icon: "📷",
    celebrationHeadline: "Hope you love your photos!",
    celebrationBody:
      "It was such a pleasure capturing these moments for you. Memories to treasure forever!",
    reviewAsk: "Help others find a photographer who captures their vision.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps others find the right photographer.",
    referralHeadline: "Know anyone with a special occasion coming up?",
    referralBody:
      "Weddings, family portraits, events — if you know anyone who needs a photographer, I'd appreciate the referral!",
    isActive: true,
  },

  // ==========================================
  // FOOD & HOSPITALITY
  // ==========================================
  {
    slug: "restaurant",
    name: "Restaurant",
    category: "Food & Hospitality",
    icon: "🍽️",
    celebrationHeadline: "Thanks for dining with us!",
    celebrationBody:
      "We hope you had an amazing experience. It was our pleasure to serve you!",
    reviewAsk: "Help food lovers discover their next favorite spot.",
    googleHeadline: "Share your dining experience",
    googleSubhead: "Your review helps others find great food.",
    referralHeadline: "Know any fellow foodies?",
    referralBody:
      "If you have friends who'd love our food, we'd be thrilled to welcome them!",
    isActive: true,
  },
  {
    slug: "cafe",
    name: "Cafe / Coffee Shop",
    category: "Food & Hospitality",
    icon: "☕",
    celebrationHeadline: "Thanks for stopping by!",
    celebrationBody:
      "We love being part of your daily routine. See you again soon!",
    reviewAsk: "Help coffee lovers find their perfect spot.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps others find great coffee.",
    referralHeadline: "Know any fellow coffee lovers?",
    referralBody:
      "If you have friends who appreciate good coffee, send them our way!",
    isActive: true,
  },

  // ==========================================
  // AUTOMOTIVE
  // ==========================================
  {
    slug: "mechanic",
    name: "Auto Mechanic / Auto Shop",
    category: "Automotive",
    icon: "🔧",
    celebrationHeadline: "Your car is running great!",
    celebrationBody:
      "Glad we could get you back on the road safely. Drive with confidence!",
    reviewAsk: "Help others find a mechanic they can trust.",
    googleHeadline: "Share your experience",
    googleSubhead: "Your review helps other car owners make informed decisions.",
    referralHeadline: "Know anyone who needs a reliable mechanic?",
    referralBody:
      "If your friends or family need car work done, I'd appreciate you sending them my way.",
    isActive: true,
  },
  {
    slug: "auto-detailer",
    name: "Auto Detailer",
    category: "Automotive",
    icon: "✨",
    celebrationHeadline: "Enjoy your showroom-fresh car!",
    celebrationBody:
      "Nothing beats that new-car feeling. Drive proud!",
    reviewAsk: "Help other car enthusiasts find great detailing.",
    googleHeadline: "Share your results",
    googleSubhead: "Before/after stories really help!",
    referralHeadline: "Know anyone who takes pride in their ride?",
    referralBody:
      "If you know car enthusiasts who'd appreciate professional detailing, I'd love to work with them.",
    isActive: true,
  },

  // ==========================================
  // RETAIL & E-COMMERCE
  // ==========================================
  {
    slug: "boutique",
    name: "Boutique / Retail Store",
    category: "Retail",
    icon: "🛍️",
    celebrationHeadline: "Thanks for shopping with us!",
    celebrationBody:
      "We hope you love your purchase! It was wonderful helping you find exactly what you needed.",
    reviewAsk: "Help others discover our shop.",
    googleHeadline: "Share your shopping experience",
    googleSubhead: "Your review helps others find unique finds.",
    referralHeadline: "Know any fellow shoppers?",
    referralBody:
      "If you have friends who'd love our products, we'd be thrilled if you'd share!",
    isActive: true,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get template by slug
 */
export function getTemplateBySlug(slug: string) {
  return industryTemplates.find((t) => t.slug === slug);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string) {
  return industryTemplates.filter((t) => t.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return [...new Set(industryTemplates.map((t) => t.category))];
}

/**
 * Default template for industries not in our list
 */
export const defaultTemplate: Omit<NewIndustryTemplate, "id" | "createdAt" | "slug" | "name" | "category"> = {
  icon: "⭐",
  celebrationHeadline: "Thank you for your business!",
  celebrationBody:
    "It's been a pleasure working with you. We truly appreciate your trust in us.",
  reviewAsk: "Your honest feedback helps others make great decisions.",
  googleHeadline: "Share your experience",
  googleSubhead: "A quick review helps others find great service.",
  referralHeadline: "Know anyone who could use our help?",
  referralBody:
    "If you know anyone who might benefit from our services, we'd be grateful for the introduction.",
  isActive: true,
};

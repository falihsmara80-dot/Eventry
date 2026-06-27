import {
  Building2,
  UtensilsCrossed,
  Palette,
  Music,
  Camera,
  Armchair,
  UserCog,
  GlassWater,
  Gift,
  Speaker,
  Package,
} from 'lucide-react'

// Per-category icon + color treatment, shared by BundlePreview (single bundle)
// and BundleComparison (three-tier agent results) so both stay visually aligned.
export const CATEGORY_STYLES = {
  Venue: { icon: Building2, color: 'text-sky-300 bg-sky-500/10 border-sky-500/20' },
  Catering: { icon: UtensilsCrossed, color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
  Decor: { icon: Palette, color: 'text-pink-300 bg-pink-500/10 border-pink-500/20' },
  Entertainment: { icon: Music, color: 'text-violet-300 bg-violet-500/10 border-violet-500/20' },
  Photography: { icon: Camera, color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20' },
  'Furniture & Rentals': { icon: Armchair, color: 'text-orange-300 bg-orange-500/10 border-orange-500/20' },
  Staffing: { icon: UserCog, color: 'text-teal-300 bg-teal-500/10 border-teal-500/20' },
  Beverages: { icon: GlassWater, color: 'text-blue-300 bg-blue-500/10 border-blue-500/20' },
  Favors: { icon: Gift, color: 'text-rose-300 bg-rose-500/10 border-rose-500/20' },
  'Audio & Visual': { icon: Speaker, color: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' },
  Other: { icon: Package, color: 'text-slate-300 bg-slate-500/10 border-slate-500/20' },
}

// Resolve a category's style, falling back to "Other" for anything unmapped.
export function categoryStyle(category) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Other
}

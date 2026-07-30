---
name: Precision Industrial SaaS
colors:
  surface: '#ffffff'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424754'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success: '#10b981'
  warning: '#f59e0b'
  danger: '#f43f5e'
  info: '#0ea5e9'
  border: '#e2e8f0'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  table-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-margin: 24px
  gutter: 16px
  section-gap: 32px
  input-padding-x: 12px
  input-padding-y: 8px
---

## Brand & Style

This design system is engineered for professional contractors and project managers who require high data density without sacrificing clarity. The aesthetic is **Corporate Modern** with a lean towards **Minimalism**, prioritizing utility and systematic organization. 

The interface evokes a sense of reliability and architectural precision. By utilizing a "Deep Slate" foundation, the system feels grounded and authoritative, while vibrant "Action Blue" and "Emerald" accents provide clear signposts for interaction and status. The overall experience is designed to be calm yet efficient, reducing cognitive load during long periods of data entry and project tracking.

## Colors

The color palette is strictly functional. **Deep Slate (#0f172a)** is the anchor for typography and navigation, ensuring high contrast against the **White** surfaces. **Action Blue (#3b82f6)** is reserved exclusively for primary intents and interactive elements. 

Backgrounds utilize a subtle shift between **#f8fafc** (Main Canvas) and **#f1f5f9** (Sidebar/Section Headers) to create structural depth without heavy lines. Status colors follow the industry-standard semantic patterns: Emerald for growth/success, Amber for caution, and Rose for critical errors or deletions.

## Typography

The design system uses **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. The hierarchy is built on a tight scale to allow for high information density. 

- **Headlines:** Use tighter letter-spacing and heavier weights to stand out against data grids.
- **Body Text:** Set primarily at 14px for standard UI to maximize screen real estate while maintaining readability.
- **Labels:** Used for table headers and small captions, utilizing 13px semi-bold weights to distinguish "metadata" from "user data."

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop dashboards, centering content within a 1280px or 1440px max-width container to maintain focus. A 12-column system is used with 16px gutters to facilitate complex "Summary Card" layouts.

On mobile, the system transitions to a fluid vertical stack with 16px side margins. Horizontal scrolling is permitted for large data tables, provided the first column remains sticky. Spacing follows a 4px baseline grid to ensure all components align with mathematical precision.

## Elevation & Depth

Depth is achieved through **Tonal Layers** supplemented by **Ambient Shadows**. 

1.  **Level 0 (Base):** The main background (#f8fafc).
2.  **Level 1 (Card):** White surfaces with a 1px border (#e2e8f0).
3.  **Level 2 (Hover/Overlay):** Cards gain a soft, diffused shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.1)) to indicate interactivity.
4.  **Level 3 (Modals/Popovers):** Higher elevation with a more pronounced shadow and a backdrop blur (4px) to isolate the task from the background data.

Avoid heavy black shadows; use Slate-tinted shadows to maintain the professional, "clean" aesthetic.

## Shapes

The design system utilizes a **Rounded (0.5rem / 8px)** base to soften the industrial feel of the ERP, while specific larger components like "Dashboard Cards" use **rounded-xl (1.5rem / 24px)** to create a modern, approachable container style. 

- **Buttons & Inputs:** 8px (standard roundedness).
- **Data Cards:** 24px (rounded-xl) to create distinct visual islands.
- **Tags/Chips:** Full pill-shaped (999px) to contrast against the structural rigidity of table rows.

## Components

### Buttons
Primary buttons use the Action Blue (#3b82f6) with white text. Secondary buttons use a white background with the Slate-200 border. Use 8px corner radii.

### Cards
Dashboard cards should have a White surface, 24px corner radius, and a subtle Slate-200 border. Content should have consistent 24px internal padding.

### Input Fields
Inputs use a white background, Slate-200 border, and 14px text. When focused, the border shifts to Action Blue with a subtle 2px outer glow of the same color at 20% opacity.

### Data Tables
Tables are the heart of the system. Rows should have a subtle hover state (#f1f5f9). Cell padding should be 12px vertical and 16px horizontal to maintain density without feeling cramped. Use Slate-200 for horizontal dividers only; avoid vertical grid lines.

### Chips/Badges
Small, low-contrast background fills with high-contrast text. For example, a "Success" badge uses a light emerald tint background with Emerald-700 text.

### Status Indicators
Small 8px circles (dots) used within table rows to indicate "Active," "Pending," or "Error" statuses at a glance without requiring full text labels.
# Copilot Instructions for kencanafarmer

## Project Overview
- This is a React + Vite-based Agriculture Management App. The design reference is at https://www.figma.com/design/PriAJRd3MCNqWzsvwYoOjF/Agriculture-Management-App.
- The app is organized by feature modules in `src/components/` (e.g., `Dashboard.tsx`, `CropManagement.tsx`, etc.) and a shared UI library in `src/components/ui/`.
- UI components use Radix UI primitives and Tailwind CSS for styling. Custom UI elements are in `src/components/ui/`.

## Developer Workflows
- **Install dependencies:** `npm i`
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- No test scripts or test files are present; testing is not currently integrated.

## Key Architectural Patterns
- **Feature-first structure:** Each major feature (dashboard, crop management, etc.) is a separate file in `src/components/`.
- **UI Library:** Reusable UI primitives (buttons, dialogs, forms, etc.) are in `src/components/ui/`. Prefer using these over creating new UI from scratch.
- **Styling:** Use Tailwind CSS classes. Avoid inline styles unless necessary. Global styles are in `src/styles/globals.css`.
- **Figma Integration:** Reference designs in Figma for UI/UX consistency. See `src/components/figma/ImageWithFallback.tsx` for Figma asset handling.

## Conventions & Patterns
- **Component Naming:** Use PascalCase for components. Place one component per file.
- **Props:** Prefer explicit prop typing with TypeScript.
- **State Management:** Use React hooks (`useState`, `useEffect`). No global state library is present.
- **Forms:** Use `react-hook-form` for form state and validation.
- **Icons:** Use `lucide-react` for icons.
- **Charts:** Use `recharts` for data visualization.
- **Notifications:** Use `sonner` for toast notifications.

## Integration Points
- **Radix UI:** All interactive UI elements (dialogs, menus, etc.) should use Radix UI components from the shared UI library.
- **Figma Assets:** For image assets, use the `ImageWithFallback` component.

## Example: Adding a New Feature
1. Create a new file in `src/components/` (e.g., `Irrigation.tsx`).
2. Use UI primitives from `src/components/ui/` for layout and controls.
3. Style with Tailwind CSS classes.
4. Reference Figma for design consistency.

## References
- Main entry: `src/App.tsx`, `src/main.tsx`
- UI library: `src/components/ui/`
- Global styles: `src/styles/globals.css`
- Guidelines: `src/guidelines/Guidelines.md`

---

_If any conventions or workflows are unclear, please ask for clarification or provide feedback to improve these instructions._

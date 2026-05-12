# TODO - Fix User Profile white screen + theme alignment

## Step 1: Repo understanding
- [x] Checked routing and profile related pages/components.
- [x] Inspected `frontend/src/pages/ProfileDashboard.jsx`, `UserProfile.jsx`, `AuthContext.jsx`, `Navbar.jsx`, and `App.jsx`.

## Step 2: Identify root cause
- [ ] Find why `/profile` (ProfileDashboard) shows white screen (runtime error, missing component, bad import, or styling/theme clash).

## Step 3: Implement fix
- [ ] Adjust `ProfileDashboard` layout/colors to match existing site theme (dark/green theme used by other pages).
- [ ] Add safe guards (optional chaining, default user values) to prevent crashes when localStorage/user is missing.
- [ ] Ensure avatar image fallback exists (`/images/user.png` vs default avatar).

## Step 4: Verify
- [ ] Run frontend build/dev and navigate to `/profile`.
- [ ] Confirm no console errors and correct styling.


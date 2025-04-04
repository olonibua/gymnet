**# Gym Business Networking MVP Plan**

## **Project Overview**
Building a **Next.js**-based platform for gym members to **connect professionally**, inspired by **Framer's sleek design**. The platform will allow users to **showcase their skills, find other professionals, and network** within their gym community.

---

## **Core Features**
### **1. Home Page**
- **Dynamic Member Showcase:**
  - A component that **randomly displays a registered member** (e.g., "Linda is a hairdresser, view her profile").
  - **Fade-in & fade-out animation** (Framer Motion or GSAP).
- **Modern Gradient UI:**
  - **Dark-themed UI with gradients** that complement a black background.
  - **Smooth transitions and interactive elements.**
- **Call-to-Action:**
  - Buttons to **view more profiles, sign up, or log in**.

### **2. Member Profile Page**
- **Profile Details:**
  - Name, profile picture, business description.
  - Contact details (email, phone, etc.).
  - Pictures of their work/business.
  - Links to social media profiles.
  - **"Mutual Places"** (Shows shared locations between the viewer and the profile owner).
- **Interactive Features:**
  - **Like Profile Button** (save profiles users are interested in).
  - **Share Profile Button** (generate a shareable link).
  - **Animated layout transitions** for an engaging experience.

### **3. Authentication & User Management**
- **OAuth Authentication:**
  - **Sign in via Google or other OAuth providers** (Appwrite OAuth).
  - Automatic user account creation for first-time users.
  - Secure session management via Appwrite.
- **Profile Editing:**
  - Update name, business details, profile image, and contact info.
  - Modal-based UI (no separate pages).
- **Liked Profiles:**
  - Users can access their liked profiles in a modal.

---

## **Technology Stack**
- **Framework:** Next.js (App Router)
- **Backend & Auth:** Appwrite (Database, Storage, OAuth Authentication)
- **UI Components:** ShadCN (Customizable UI elements)
- **Animations:** Framer Motion / GSAP (For smooth transitions & interactions)
- **Styling:** Tailwind CSS (With custom gradient configurations)

---

## **Development Plan**
### **Phase 1: Setup & UI Design**
- Project setup with **Next.js, Appwrite, Tailwind, ShadCN**.
- Implement **gradient-based UI with dark theme**.
- Develop **random profile showcase component with animation**.

### **Phase 2: Authentication & Profiles**
- [x] Set up **Appwrite OAuth authentication** with Google provider
- [x] Create **Next.js API route for OAuth callback**
- [x] Implement sign-in modal with Google OAuth
- [x] Implement sign-up modal with Google OAuth
- [ ] Verify user profile creation on first login
- [ ] Fix database collection configuration
- [ ] Implement profile redirect after successful authentication

### **Phase 3: Interactivity & Final Touches**
- Implement **like & share functionalities**.
- Add **mutual place feature** for connections.
- **Optimize animations & UI transitions**.
- **Mobile responsiveness & final refinements**.

---

## Code Standards

### Type Definitions
- No duplicate type definitions across files
- Always export interfaces used across multiple files

### Code Quality
- **Always use &apos; instead of &quot; for strings**
- **No undefined types**: Never use `(error)` as a catch block of a try statement or any other error emitting component in code
- **Always define error types**: All catch blocks must use `(error: unknown)` and properly type-check the error
- **Error handling pattern**: Always follow this pattern:
  ```typescript
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Default error message';
    console.error("Descriptive context:", errorMessage);
    // Additional error handling as needed
  }
  ```
- **No unused variables**: All declared variables must be used or prefixed with underscore
- **Proper error handling**: Include try/catch blocks for async operations
- **Type safety**: Use proper TypeScript types for all variables and function parameters
- **⚠️ WARNING: No unused state variables**: Don't declare state variables (useState) without using them in the component. If you declare `setIsLoading`, you must use it in the UI (e.g., showing a loading indicator). Unused state variables cause errors during Vercel deployment.
- **⚠️ WARNING: Avoid using `any` type**: Never use the `any` type as it defeats TypeScript's type checking. Instead:
  ```typescript
  // ❌ Bad
  const data: any = response.data;
  
  // ✅ Good
  const data: Record<string, unknown> = response.data;
  // Or use more specific types like:
  const data: CustomType = response.data;
  ```

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

## Implementation Checklist

### Auth Integration
- [x] Set up OAuth providers in Appwrite Console
- [x] Create auth callback API route
- [x] Implement sign-in modal with OAuth providers
- [x] Implement sign-up modal with OAuth providers
- [ ] Verify user profile creation on first login
- [ ] Fix database collection configuration
- [ ] Implement profile redirect after successful authentication


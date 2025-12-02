<!-- # 🚀 Validly

**Stop guessing. Start validating.**  
Validly is a social media platform for startup enthusiasts that enables safe, structured, and rewarding sharing, testing, and collaboration on startup ideas.

---

## 📌 Overview

Millions of startup ideas fail because they aren’t properly validated. Validly helps students, aspiring founders, and niche hackers to:
- Validate ideas before building
- Gather actionable feedback
- Connect with collaborators and mentors
- Build communities and audiences around their startups

---

## ⚡️ The Problem

✅ Lack of problem-solution fit  
✅ Poor market research  
✅ Copycat ideas without a clear differentiator  
✅ Noisy, unstructured feedback  
✅ Barriers to collaboration  
✅ Wasted resources building products no one wants

---

## 💡 The Solution: Validly

Validly is a dedicated platform that makes sharing, testing, and improving startup ideas **safe, structured, and community-driven**, while fostering real collaboration and mentorship.

---

## 🔑 Core Features

- **Safe, Structured Idea Sharing**
  - Guided templates (Problem, Audience, Solution, Model, Stage)
  - Actionable polls & feedback
  - Public, Private, or Anonymous visibility

- **Control & Privacy**
  - Auto-delete ideas after 7, 30, or 90 days
  - Timestamps & share links as proof-of-posting
  - Downloadable PDF reports with feedback

- **Real Validation**
  - Feedback signals: “I’d use this”, “I’d pay”, “I’d build this”
  - Polls to measure genuine interest

- **Direct Messaging & Collaboration**
  - DM collaborators, discuss NDAs, and view requests/offers

- **Personal Validation Dashboard**
  - Track feedback, compare ideas, and measure traction

- **Trust & Safety**
  - Community norms, proof-of-posting, moderation tools

- **Extra Tools**
  - Landing page tests, waiting lists, downloadable reports

- **Hiring & Team Building**
  - Post job listings for developers/designers
  - Co-founder and collaborator matching
  - Hackathon teammate finder

- **Gamified Feedback Incentives**
  - Earn points for valuable feedback and unlock perks

- **Mentorship & 1:1 Sessions**
  - Offer or book mentoring sessions; Validly takes a small fee

- **Communities & Content**
  - Create communities for specific ideas or niches
  - Weekly startup competitions with community voting

- **Milestone Roadmap & Validation Checkpoints**
  - Visual roadmap to define, track, and share progress

---

## ✅ Getting Started

👉 **Sign Up:** Create your profile and share your first idea  
👉 **Post Ideas:** Use guided templates and polls to gather structured feedback  
👉 **Collaborate:** Connect with co-founders, teammates, or mentors  
👉 **Validate:** Use your personal dashboard to track feedback and iterate  
👉 **Launch:** Build what people really want, with confidence!

---

*Made with ❤️ by the Validly Team* -->





# Full Stack Engineering Intern - Interview Questions
## Based on TaskFlow Assignment

---

## 📋 Table of Contents
1. [Frontend Questions](#frontend-questions)
2. [Backend Questions](#backend-questions)
3. [Full-Stack Integration](#full-stack-integration)
4. [Database & ORM](#database--orm)
5. [Security & Authentication](#security--authentication)
6. [State Management](#state-management)
7. [Code Quality & Best Practices](#code-quality--best-practices)
8. [Testing & Debugging](#testing--debugging)
9. [Architecture & Design Decisions](#architecture--design-decisions)
10. [Problem-Solving Scenarios](#problem-solving-scenarios)

---

## Frontend Questions

### React Fundamentals

**Q1:** In `TaskCard.jsx`, you're using conditional rendering based on `viewMode`. Can you explain the difference between the grid and list view implementations? What are the trade-offs of this approach?

**A1:** The grid view (lines 63-148) displays tasks as cards with a vertical layout showing title, description, status badge, and due date. The list view (lines 11-60) displays tasks horizontally with a more compact layout, showing the checkbox, title, description, and action buttons in a single row.

**Trade-offs:**
- **Pros:** Single component handles both views, reducing code duplication. Easy to maintain consistency between views.
- **Cons:** The component is longer (150 lines) and has conditional logic that could be split. Both views are always rendered in the bundle even if only one is used. Better approach would be to extract view-specific rendering into separate components or use composition.

**Q2:** Looking at `TaskCard.jsx` line 36-40, there's a reference to `task.dueDate`, but the Prisma schema doesn't include a `dueDate` field. What would happen if this component receives a task without `dueDate`? How would you handle this edge case?

**A2:** Currently, the code checks `if(task.dueDate)` before rendering (line 36), so if `dueDate` is `undefined`, `null`, or falsy, the date section simply won't render. However, if `dueDate` exists but is invalid, `format(new Date(task.dueDate), 'MMM dd')` could throw an error.

**Better handling:**
```jsx
{task.dueDate && !isNaN(new Date(task.dueDate).getTime()) && (
  <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
    <Calendar className="w-4 h-4" />
    {format(new Date(task.dueDate), 'MMM dd')}
  </div>
)}
```
This validates the date before formatting. Alternatively, add `dueDate` to the Prisma schema if it's a required feature.

**Q3:** In `App.jsx`, you're using `useSelector` to get `currentUser` from Redux. If a user refreshes the page, what happens to the authentication state? How does `redux-persist` help here, and what are the security implications?

**A3:** Without `redux-persist`, refreshing the page would reset Redux state to initial values, losing `currentUser` and requiring re-authentication. 

Looking at `store.js`, `redux-persist` is configured with `whitelist: ['user']` (line 16), which means only the user slice is persisted to `localStorage`. On refresh:
1. Redux state is restored from `localStorage`
2. `currentUser` and `token` are available immediately
3. User appears logged in without API call

**Security implications:**
- **Token in localStorage:** Vulnerable to XSS attacks. If malicious script runs, it can access `localStorage.getItem('token')`
- **No token validation on refresh:** The app trusts the persisted token without verifying it's still valid on the server
- **Better approach:** On app load, verify token with backend or implement token refresh mechanism
- **Alternative:** Use `httpOnly` cookies for token storage (more secure but requires backend changes)

**Q4:** The `TaskCard` component receives `onEdit` and `onDelete` as props. What pattern is this called? What are the advantages and disadvantages compared to using Redux actions directly in the component?

**A4:** This is the **"Container/Presentational Component"** pattern (also called "Smart/Dumb Components"). `TaskCard` is a presentational component that receives callbacks as props.

**Advantages:**
- **Reusability:** Component can be used in different contexts with different handlers
- **Testability:** Easy to test by passing mock functions
- **Separation of concerns:** Component doesn't need to know about Redux
- **Flexibility:** Parent can add additional logic (e.g., analytics, confirmation dialogs)

**Disadvantages:**
- **Prop drilling:** If deeply nested, you pass props through many layers
- **More boilerplate:** Parent must define handlers
- **Less direct:** Can't dispatch actions directly from component

**Alternative (Redux directly):**
```jsx
import { useDispatch } from 'react-redux';
import { editTask, removeTask } from '../redux/task/taskSlice';

// In component:
const dispatch = useDispatch();
onClick={() => dispatch(editTask(task))}
```
This is simpler but couples the component to Redux, making it less reusable.

**Q5:** In `TaskModal.jsx` (based on the project structure), if you're using React Hook Form with Zod validation, how does the form handle validation errors? Walk me through the validation flow from user input to error display.

**A5:** Looking at `TaskModal.jsx`:

1. **Setup (lines 19-26):** `useForm` is configured with `zodResolver(taskSchema)` which integrates Zod validation with React Hook Form
2. **Registration (line 78):** Input fields are registered with `{...register('title')}`, connecting them to the form state
3. **Validation trigger:** By default, validation runs on `onSubmit`, but can be configured for `onChange` or `onBlur`
4. **Error state (line 17):** `formState: { errors }` provides access to validation errors
5. **Error display (lines 82-84):** Errors are conditionally rendered: `{errors.title && <p>{errors.title.message}</p>}`

**Flow:**
- User types → React Hook Form tracks value
- User submits → `handleSubmit` (line 69) validates using Zod schema
- If invalid → Zod returns errors → React Hook Form populates `errors` object
- Component re-renders → Error messages display below fields
- If valid → `onSubmit` callback executes → Redux action dispatched

**Zod validation happens:**
- Client-side: Immediate feedback, better UX
- Server-side: Also validates (in `taskController.js`) for security

### React Router & Navigation

**Q6:** In `App.jsx` lines 27 and 31, you're conditionally redirecting authenticated users away from sign-in/sign-up pages. What happens if a user manually navigates to `/sign-in` while already logged in? Is this the best approach?

**A6:** If a user manually navigates to `/sign-in` while logged in, the condition `currentUser ? <Navigate to="/dashboard" replace /> : <SignIn />` (line 27) will immediately redirect them to `/dashboard`. The `replace` prop replaces the current history entry instead of adding a new one, so the back button won't take them back to `/sign-in`.

**Is this the best approach?**
- **Pros:** Simple, prevents authenticated users from seeing login page
- **Cons:** No user feedback about why they were redirected. Could be confusing if user intentionally wanted to switch accounts

**Better approach:**
```jsx
<Route
  path="/sign-in"
  element={
    currentUser ? (
      <Navigate to="/dashboard" replace state={{ message: 'You are already logged in' }} />
    ) : (
      <SignIn />
    )
  }
/>
```
Or show a toast notification explaining the redirect.

**Q7:** Explain how `ProtectedRoute` component works. What happens when an unauthenticated user tries to access `/dashboard`? How would you implement a "redirect back after login" feature?

**A7:** Looking at `ProtectedRoute.jsx`:
1. It uses `useSelector` to get `currentUser` and `token` from Redux (line 6)
2. If either is missing (line 8), it returns `<Navigate to="/sign-in" replace />`
3. Otherwise, it renders the `children` (the protected component)

**When unauthenticated user accesses `/dashboard`:**
- `ProtectedRoute` checks Redux state
- Finds no `currentUser` or `token`
- Immediately redirects to `/sign-in`
- User sees login page

**Implementing "redirect back after login":**
```jsx
// ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, token } = useSelector((state) => state.user);
  const location = useLocation();

  if (!currentUser || !token) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return children;
}

// SignIn.jsx - after successful login
const location = useLocation();
const from = location.state?.from || '/dashboard';
navigate(from, { replace: true });
```
This stores the attempted route in navigation state and redirects back after login.

**Q8:** The catch-all route (`path="*"`) redirects to home. What are the pros and cons of this approach? When might you want to show a 404 page instead?

**A8:** The catch-all route `<Route path="*" element={<Navigate to="/" replace />} />` (line 41 in `App.jsx`) redirects all unmatched routes to home.

**Pros:**
- Simple implementation
- Good for SPAs where all routes should be handled by React Router
- Prevents users from seeing browser's default 404

**Cons:**
- **Poor UX:** User might be confused why they're on home page instead of expected route
- **SEO issues:** Search engines might index wrong pages
- **No error tracking:** Can't track which invalid URLs users are accessing
- **Accessibility:** Screen readers announce navigation but user doesn't know why

**When to show 404 page:**
- User explicitly types invalid URL (e.g., `/dashboard/invalid-page`)
- Better UX: Show friendly 404 page with navigation options
- Better for analytics: Track 404 errors
- Better for SEO: Return proper 404 status code

**Better implementation:**
```jsx
// Create NotFound.jsx component
function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}

// In App.jsx
<Route path="*" element={<NotFound />} />
```

### State Management (Redux)

**Q9:** In `taskSlice.js`, you're using `createAsyncThunk` for API calls. Explain the difference between handling async operations with `createAsyncThunk` vs. using `useEffect` with `dispatch` in a component.

**A9:** 

**Using `createAsyncThunk` (current approach):**
```jsx
// In slice
export const fetchTasks = createAsyncThunk('task/fetchTasks', async () => {
  const response = await getTasks();
  return response.data;
});

// In component
dispatch(fetchTasks());
```
- **Centralized:** All async logic in the slice
- **Automatic states:** Provides `pending`, `fulfilled`, `rejected` states
- **Reusable:** Can be dispatched from any component
- **Type-safe:** Better TypeScript support
- **Error handling:** Centralized error handling in `extraReducers`

**Using `useEffect` with dispatch:**
```jsx
// In component
useEffect(() => {
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      dispatch(setTasks(response.data));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setLoading(false);
    }
  };
  loadTasks();
}, []);
```
- **Decentralized:** Logic scattered across components
- **Manual state management:** Must manually track loading/error states
- **Duplication:** Same logic repeated in multiple components
- **Less maintainable:** Changes require updating multiple files

**Verdict:** `createAsyncThunk` is better for production apps as it provides better organization and automatic state management.

**Q10:** Looking at `taskSlice.js` line 103, when a new task is created, you're using `unshift` to add it to the beginning of the array. Why `unshift` instead of `push`? What are the performance implications?

**A10:** `unshift` adds the new task to the beginning of the array (line 103: `state.tasks.unshift(action.payload)`), while `push` would add it to the end.

**Why `unshift`?**
- **UX:** New tasks appear at the top, immediately visible to users
- **Common pattern:** Most task apps show newest items first
- **User expectation:** Users expect to see their newly created task first

**Performance implications:**
- **`unshift` is O(n):** Must shift all existing elements to make room at the beginning
- **`push` is O(1):** Constant time, just adds to end
- **Impact:** For small arrays (< 100 items), difference is negligible. For large arrays (1000+), `unshift` can be slow

**Optimization options:**
1. **Reverse display:** Store newest last, but reverse when displaying
2. **Virtual scrolling:** Only render visible items
3. **Accept the cost:** For typical task lists (< 100 tasks), `unshift` is fine

**Q11:** In the `editTask.fulfilled` case (lines 115-123), you're finding the task index and updating it. What would happen if the task doesn't exist in the state? How would you handle this edge case?

**A11:** Current code:
```jsx
const index = state.tasks.findIndex((task) => task.id === action.payload.id);
if (index !== -1) {
  state.tasks[index] = action.payload;
}
```

**What happens if task doesn't exist?**
- `findIndex` returns `-1`
- The `if` check prevents the update
- **Problem:** Task was updated on server but not reflected in UI
- **User impact:** Confusion - they updated task but don't see changes

**Possible causes:**
1. Task was deleted from state but update succeeded on server
2. State was reset/cleared
3. Race condition: Task removed while update in progress

**Better handling:**
```jsx
.addCase(editTask.fulfilled, (state, action) => {
  state.loading = false;
  const index = state.tasks.findIndex((task) => task.id === action.payload.id);
  if (index !== -1) {
    state.tasks[index] = action.payload;
  } else {
    // Task not in state - add it (might have been deleted locally)
    state.tasks.unshift(action.payload);
    // Or refetch all tasks to ensure consistency
    // Or show error to user
  }
  state.error = null;
});
```

**Best practice:** Refetch tasks after update to ensure consistency, or implement optimistic updates with rollback on error.

**Q12:** The `taskSlice` has a `clearError` reducer. When and where would you dispatch this action? How would you implement auto-clearing errors after a certain time?

**A12:** The `clearError` reducer (line 76-78) sets `state.error = null`.

**When to dispatch:**
1. **User dismisses error:** Click "X" button on error message
2. **New action starts:** Clear previous error when starting new operation
3. **Component unmounts:** Clean up on component unmount
4. **After successful operation:** Clear error on success

**Where to dispatch:**
```jsx
// In component after showing error
{error && (
  <div>
    {error}
    <button onClick={() => dispatch(clearError())}>Dismiss</button>
  </div>
)}

// Or automatically on new action
useEffect(() => {
  if (error) {
    dispatch(clearError());
  }
}, [someTrigger]);
```

**Auto-clearing errors:**
```jsx
// In component
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 5000); // Clear after 5 seconds

    return () => clearTimeout(timer);
  }
}, [error, dispatch]);
```

**Or in middleware:**
```jsx
// Custom middleware
const autoClearError = (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type.endsWith('/rejected')) {
    setTimeout(() => {
      store.dispatch(clearError());
    }, 5000);
  }
  
  return result;
};
```

### API Integration

**Q13:** In `api.js`, you're using Axios interceptors. Explain the request interceptor (lines 14-25). What happens if `localStorage.getItem('token')` returns `null`?

**A13:** The request interceptor (lines 14-25) runs before every API request:

```jsx
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**What it does:**
1. Intercepts every request before it's sent
2. Retrieves token from `localStorage`
3. If token exists, adds `Authorization: Bearer <token>` header
4. Returns modified config (with token) or original config (without token)

**If token is `null`:**
- The `if(token)` check (line 17) evaluates to `false`
- No `Authorization` header is added
- Request proceeds without authentication
- Backend will likely return 401 Unauthorized
- Response interceptor (line 31) will catch the 401 and redirect to login

**This is safe behavior:** The request still goes through, but unauthenticated requests will be rejected by the backend, which is the correct security behavior.

**Q14:** The response interceptor (lines 28-38) redirects to `/sign-in` on 401 errors. What are the potential issues with using `window.location.href`? How would you handle this in a React Router context?

**A14:** Current code uses `window.location.href = '/sign-in'` (line 34).

**Issues with `window.location.href`:**
1. **Full page reload:** Causes entire app to unmount and remount, losing all state
2. **Not React Router:** Bypasses React Router, so navigation state is lost
3. **Performance:** Slower than client-side navigation
4. **State loss:** Redux state, component state, scroll position all lost
5. **No programmatic control:** Can't use `navigate()` with state or replace

**Better approach with React Router:**
```jsx
// Option 1: Use navigate from a hook (requires refactoring)
import { useNavigate } from 'react-router-dom';

// But interceptors can't use hooks directly, so:

// Option 2: Create a navigation utility
// utils/navigation.js
let navigateFunction = null;

export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

export const navigateTo = (path) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    window.location.href = path; // Fallback
  }
};

// In App.jsx
import { useNavigate } from 'react-router-dom';
import { setNavigate } from './utils/navigation';

function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  
  // ...
}

// In api.js
import { navigateTo } from '../utils/navigation';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401) {
      localStorage.removeItem('token');
      navigateTo('/sign-in');
    }
    return Promise.reject(error);
  }
);
```

**Q15:** The API base URL uses `import.meta.env.VITE_API_URL`. Why is the `VITE_` prefix required? What happens if this environment variable is not set?

**A15:** Vite requires the `VITE_` prefix for security reasons. Only environment variables prefixed with `VITE_` are exposed to client-side code.

**Why the prefix?**
- **Security:** Prevents accidentally exposing sensitive server-side secrets
- **Explicit opt-in:** Makes it clear which env vars are client-accessible
- **Build-time replacement:** Vite replaces `import.meta.env.VITE_API_URL` at build time

**If `VITE_API_URL` is not set:**
- `import.meta.env.VITE_API_URL` returns `undefined`
- `api.js` line 3: `const API_BASE_URL = import.meta.env.VITE_API_URL;` sets `API_BASE_URL` to `undefined`
- Axios creates instance with `baseURL: undefined` (line 7)
- Requests will use relative URLs (e.g., `/api/tasks` instead of `http://localhost:5000/api/tasks`)
- **In development:** Might work if frontend and backend are on same origin
- **In production:** Will likely fail with CORS errors or wrong base URL

**Best practice:**
```jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL not set, using default');
}
```

**Environment file setup:**
```env
# .env.development
VITE_API_URL=http://localhost:5000/api

# .env.production
VITE_API_URL=https://api.yourapp.com/api
```

### UI/UX & Styling

**Q16:** The `TaskCard` component uses TailwindCSS with conditional classes. How would you optimize the className string on line 64-66? What tools or techniques could help maintain readability?

**A16:** Current code (line 64-66):
```jsx
className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
  isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-indigo-200'
}`}
```

**Optimization techniques:**

1. **Use `clsx` or `classnames` library:**
```jsx
import clsx from 'clsx';

className={clsx(
  'group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
  {
    'border-emerald-200 bg-emerald-50/30': isCompleted,
    'border-gray-200 hover:border-indigo-200': !isCompleted,
  }
)}
```

2. **Extract to a function:**
```jsx
const getCardClasses = (isCompleted) => {
  const base = 'group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1';
  return isCompleted 
    ? `${base} border-emerald-200 bg-emerald-50/30`
    : `${base} border-gray-200 hover:border-indigo-200`;
};

className={getCardClasses(isCompleted)}
```

3. **Use Tailwind's `cn` utility (from shadcn/ui pattern):**
```jsx
import { cn } from '@/lib/utils';

className={cn(
  'group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
  isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-indigo-200'
)}
```

**Tools:**
- **ESLint plugin:** `eslint-plugin-tailwindcss` for class ordering
- **Prettier plugin:** `prettier-plugin-tailwindcss` for automatic class sorting
- **VS Code extension:** "Tailwind CSS IntelliSense" for autocomplete

**Q17:** You're using `backdrop-blur-sm` in the TaskCard. What browser compatibility concerns should you be aware of? How would you add a fallback?

**A17:** `backdrop-blur` is a CSS filter that blurs the background behind an element.

**Browser compatibility:**
- **Supported:** Chrome 76+, Firefox 103+, Safari 9+, Edge 79+
- **Not supported:** Older browsers, some mobile browsers
- **Fallback needed:** For unsupported browsers, element will render without blur

**Adding fallback:**
```jsx
// Option 1: CSS with @supports
<div className="bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-sm">
  {/* content */}
</div>

// Option 2: Solid background fallback
<div className={clsx(
  'bg-white/80 rounded-2xl',
  'backdrop-blur-sm', // Modern browsers
  'bg-white', // Fallback for older browsers (override)
)}>
  {/* Use @supports in CSS */}
</div>

// Option 3: CSS file
.card {
  background-color: rgba(255, 255, 255, 0.8);
}

@supports (backdrop-filter: blur(4px)) {
  .card {
    backdrop-filter: blur(4px);
  }
}

@supports not (backdrop-filter: blur(4px)) {
  .card {
    background-color: rgba(255, 255, 255, 0.95); /* More opaque fallback */
  }
}
```

**Best practice:** Test in older browsers or use a tool like BrowserStack. For production, consider if the blur effect is essential or if a solid background is acceptable.

**Q18:** The component has hover effects and transitions. How would you ensure these work well on touch devices? What accessibility considerations should be made?

**A18:** 

**Touch device issues:**
- **Hover states:** On touch devices, hover can "stick" after tap
- **No hover:** Some devices don't support hover at all
- **Touch targets:** Buttons might be too small for touch

**Solutions:**

1. **Use `@media (hover: hover)` for hover-only styles:**
```jsx
// Only apply hover on devices that support hover
className="transition-all hover:shadow-lg [@media(hover:hover)]:hover:shadow-lg"
```

2. **Use `:active` for touch feedback:**
```jsx
className="transition-all active:scale-95 active:shadow-md"
```

3. **Ensure adequate touch targets (min 44x44px):**
```jsx
// Current buttons might be too small
<button className="p-2 ..."> // 32x32px - too small!
// Better:
<button className="p-3 min-w-[44px] min-h-[44px] ...">
```

**Accessibility considerations:**

1. **Keyboard navigation:**
```jsx
// Ensure focus states are visible
className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
```

2. **ARIA labels:**
```jsx
<button
  onClick={() => onEdit(task)}
  aria-label={`Edit task: ${task.title}`}
  className="..."
>
  <Edit2 className="w-4 h-4" />
</button>
```

3. **Screen reader support:**
```jsx
<div role="button" tabIndex={0} aria-label="Toggle task completion">
  {/* checkbox */}
</div>
```

4. **Color contrast:** Ensure text meets WCAG AA standards (4.5:1 for normal text)

5. **Reduced motion:**
```jsx
// Respect prefers-reduced-motion
className="transition-all motion-reduce:transition-none"
```

**Complete example:**
```jsx
<button
  onClick={() => onEdit(task)}
  className={clsx(
    'p-3 min-w-[44px] min-h-[44px] rounded-lg transition-all',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'active:scale-95 active:bg-indigo-100',
    '@media(hover:hover):hover:bg-indigo-50 @media(hover:hover):hover:text-indigo-600',
    'motion-reduce:transition-none'
  )}
  aria-label={`Edit task: ${task.title}`}
>
  <Edit2 className="w-4 h-4" />
</button>
```

---

## Backend Questions

### Express.js & Middleware

**Q19:** In `index.js`, you have multiple middleware layers. Explain the order of execution: CORS, JSON parser, routes, static files, catch-all, and error handler. Why is the error handler placed last?

**A19:** Middleware execution order in Express is **sequential** - they execute in the order they're defined:

1. **CORS (line 16):** `app.use(cors())` - Handles cross-origin requests first
2. **JSON parser (line 17):** `app.use(express.json())` - Parses JSON request bodies
3. **URL encoded (line 18):** `app.use(express.urlencoded())` - Parses form data
4. **Health check route (line 21):** Specific route handler
5. **API Routes (lines 30-31):** `/api/auth` and `/api/tasks` - These are matched first
6. **404 handler (lines 34-39):** Catches unmatched routes (but only if not matched above)
7. **Static files (line 42):** Serves built React app from `/frontend/dist`
8. **Catch-all SPA route (lines 45-47):** Serves `index.html` for any remaining routes
9. **Error handler (line 50):** `app.use(errorHandler)` - **MUST be last**

**Why error handler is last:**
- Express error handlers have **4 parameters** `(err, req, res, next)`
- Express only recognizes middleware with 4 params as error handlers
- Error handlers catch errors from **all previous middleware**
- If placed earlier, it won't catch errors from routes defined after it
- **Rule:** Error handlers must be defined after all routes and middleware

**Important note:** There's a bug in the current code! The 404 handler (line 34) and catch-all (line 45) both send responses, but the catch-all will never be reached because the 404 handler already sent a response. The catch-all should come before the 404 handler, or the 404 should only handle API routes.

**Q20:** The catch-all route (lines 45-47) serves the React app. What happens if someone makes an API request to a non-existent endpoint like `/api/invalid`? How would you fix this?

**A20:** Current flow for `/api/invalid`:

1. Request hits Express
2. CORS middleware runs
3. JSON parser runs
4. Routes checked: `/api/auth` - no match, `/api/tasks` - no match
5. **404 handler (line 34) catches it** - Returns JSON: `{ success: false, message: 'Route not found' }`
6. Catch-all (line 45) never reached

**This is actually correct behavior!** API routes return JSON 404, which is appropriate.

**However, there's a potential issue:**
- If someone requests `/api/tasks/invalid-id`, it matches `/api/tasks/:id` route
- The route handler (e.g., `updateTask`) will process it
- Should return 404 from controller, not from catch-all

**Better structure:**
```js
// API Routes (must come before static files)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// Catch-all for SPA (must come after static files)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Error handler (always last)
app.use(errorHandler);
```

**Q21:** In `taskRoutes.js`, you're using `router.use(authenticate)` to protect all routes. What's the difference between `router.use()` and applying `authenticate` to individual routes? When would you use each approach?

**A21:** 

**Current approach - `router.use(authenticate)` (line 15):**
```js
router.use(authenticate); // Applies to ALL routes below
router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
```

**Alternative - Individual route protection:**
```js
router.get('/', authenticate, getTasks);
router.post('/', authenticate, validate(createTaskSchema), createTask);
router.put('/:id', authenticate, validate(updateTaskSchema), updateTask);
router.delete('/:id', authenticate, deleteTask);
```

**Differences:**

1. **Code duplication:**
   - `router.use()`: Write `authenticate` once, applies to all
   - Individual: Must add to each route (more verbose)

2. **Flexibility:**
   - `router.use()`: All routes protected, harder to have public routes
   - Individual: Can selectively protect routes

3. **Order matters:**
   - `router.use()`: Must be before route definitions
   - Individual: Can be in any order (but should be first in middleware chain)

4. **Maintenance:**
   - `router.use()`: Change authentication logic in one place
   - Individual: Must update each route if auth logic changes

**When to use each:**

**Use `router.use()` when:**
- All routes in the router need protection (most common)
- You want DRY code
- Authentication logic is consistent

**Use individual protection when:**
- Some routes need different auth (e.g., public read, protected write)
- You have mixed public/protected routes
- You need route-specific auth logic

**Example of mixed approach:**
```js
// Public routes
router.get('/public', getPublicTasks);

// Protected routes
router.use(authenticate);
router.get('/', getTasks);
router.post('/', createTask);
```

**Best practice:** Use `router.use(authenticate)` for route groups where all routes need protection, which is the current implementation and is correct.

### Controllers & Business Logic

**Q22:** In `taskController.js`, the `updateTask` function (lines 50-93) checks ownership before updating. Why is this check necessary even though the route is protected? What security vulnerability does this prevent?

**A22:** The ownership check (lines 57-73) verifies that `existingTask.userId === userId` before allowing the update.

**Why it's necessary:**
- **Route protection only verifies authentication:** The `authenticate` middleware confirms the user is logged in and extracts `userId` from the token
- **Route protection does NOT verify authorization:** It doesn't check if the user owns the resource they're trying to modify
- **Without ownership check:** A logged-in user could modify ANY task by guessing or knowing another user's task ID

**Security vulnerability prevented:**
- **Horizontal Privilege Escalation:** User A could update/delete User B's tasks
- **Example attack:**
  1. User A logs in, gets task ID `123` (their own task)
  2. User A tries to update task ID `456` (User B's task)
  3. Without ownership check: Update succeeds, User A modifies User B's task
  4. With ownership check: Returns 403 Forbidden

**The check ensures:**
- Users can only modify their own resources
- Even authenticated users cannot access other users' data
- Follows **principle of least privilege**

**Q23:** In `updateTask`, you're using the spread operator with conditional properties (lines 79-81). Explain this pattern. What happens if `description` is an empty string vs. `null` vs. `undefined`?

**A23:** Current code:
```js
data: {
  ...(title && { title }),
  ...(description !== undefined && { description: description || null }),
  ...(status && { status }),
}
```

**Pattern explanation:**
- `...(condition && { key: value })` - Conditionally includes property in object
- If condition is `false`, spread operator spreads nothing (property omitted)
- If condition is `true`, property is included

**Behavior for different values:**

1. **`description = undefined`:**
   - `description !== undefined` → `false`
   - Property **not included** in update
   - Prisma **won't update** the description field (leaves existing value)

2. **`description = null`:**
   - `description !== undefined` → `true`
   - `description || null` → `null`
   - Property included: `{ description: null }`
   - Prisma **sets** description to `null` (clears the field)

3. **`description = ""` (empty string):**
   - `description !== undefined` → `true`
   - `description || null` → `null` (because `""` is falsy)
   - Property included: `{ description: null }`
   - Prisma **sets** description to `null` (clears the field)

**Potential issue:**
- Empty string `""` is treated as "clear field" (becomes `null`)
- If you want to allow empty strings as valid values, need different logic:
```js
...(description !== undefined && { description }), // Preserves empty string
```

**Current behavior is correct** if empty strings should be treated as "no description" (null).

**Q24:** The `deleteTask` function performs two database queries (findUnique, then delete). Could this be optimized? What are the trade-offs of using Prisma's `deleteMany` with a where clause?

**A24:** Current code (lines 95-132):
```js
// Query 1: Check ownership
const existingTask = await prisma.task.findUnique({
  where: { id: taskId },
});

if (existingTask.userId !== userId) {
  return res.status(403).json({ ... });
}

// Query 2: Delete
await prisma.task.delete({
  where: { id: taskId },
});
```

**Optimization with `deleteMany`:**
```js
const deletedTask = await prisma.task.deleteMany({
  where: {
    id: taskId,
    userId: userId, // Only delete if user owns it
  },
});

if (deletedTask.count === 0) {
  // Either task doesn't exist or user doesn't own it
  return res.status(404).json({ ... });
}
```

**Trade-offs:**

**Two queries (current):**
- **Pros:** Can differentiate between "not found" (404) and "not authorized" (403)
- **Pros:** Can return the deleted task data in response
- **Cons:** Two database round trips (slower)
- **Cons:** Race condition: Task could be deleted between queries

**Single `deleteMany` query:**
- **Pros:** One database round trip (faster)
- **Pros:** Atomic operation (no race condition)
- **Cons:** Can't distinguish "not found" from "not authorized" (both return count 0)
- **Cons:** Can't return deleted task data

**Best approach:**
```js
// Try to delete with ownership check
const deletedTask = await prisma.task.deleteMany({
  where: {
    id: taskId,
    userId: userId,
  },
});

if (deletedTask.count === 0) {
  // Check if task exists (to provide better error message)
  const taskExists = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true },
  });
  
  if (taskExists) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this task',
    });
  }
  
  return res.status(404).json({
    success: false,
    message: 'Task not found',
  });
}
```

**For this use case:** Current two-query approach is acceptable for clarity, but `deleteMany` is more efficient if you don't need to distinguish 403 from 404.

**Q25:** In `authController.js`, why do you return the same error message ("Invalid username or password") for both "user not found" and "wrong password" scenarios? Is this a security best practice?

**A25:** Yes, this is a **security best practice** called **"Security through Obscurity"** or **"Information Disclosure Prevention"**.

**Current code:**
```js
if (!user) {
  return res.status(401).json({
    success: false,
    message: 'Invalid username or password',
  });
}

if (!isPasswordValid) {
  return res.status(401).json({
    success: false,
    message: 'Invalid username or password',
  });
}
```

**Why use the same message:**

1. **Prevents user enumeration:**
   - **Bad:** "User not found" → Attacker knows username doesn't exist
   - **Good:** "Invalid username or password" → Attacker can't tell which is wrong

2. **Prevents timing attacks:**
   - Different code paths might have different execution times
   - Same message = same code path = harder to exploit timing differences

3. **Prevents account discovery:**
   - Attackers can't build a list of valid usernames
   - Can't identify which accounts exist in the system

**Attack scenario prevented:**
```
Attacker tries: username="admin"
Response: "User not found" → Admin account doesn't exist

Attacker tries: username="john"
Response: "Invalid password" → John's account exists! Now brute force password
```

**With same message:**
```
Attacker tries: username="admin"
Response: "Invalid username or password" → Unknown if account exists

Attacker tries: username="john"  
Response: "Invalid username or password" → Still unknown
```

**Additional security measures:**
- Rate limiting (prevent brute force)
- Account lockout after failed attempts
- CAPTCHA after multiple failures
- Log failed attempts for monitoring

**This is correct security practice** - always use generic error messages for authentication failures.

### Error Handling

**Q26:** All controller functions use `next(error)` to pass errors to the error handler. What types of errors might occur that aren't caught by try-catch? How does the error handler middleware handle different error types?

**A26:** 

**Errors NOT caught by try-catch:**
1. **Async errors in callbacks:**
```js
// This won't be caught!
setTimeout(() => {
  throw new Error('Uncaught!');
}, 1000);
```

2. **Promise rejections without catch:**
```js
// If this rejects and no .catch(), might not be caught
someAsyncFunction().then(() => { ... });
```

3. **Errors in middleware (before reaching controller):**
   - CORS errors
   - JSON parsing errors
   - Route not found (404)

4. **Synchronous errors outside try-catch:**
   - Syntax errors (caught at compile time)
   - Reference errors in global scope

**How error handler works:**
Looking at `errorHandler.js`:

1. **Prisma errors (lines 5-17):**
   - `P2002`: Unique constraint violation → 409 Conflict
   - `P2025`: Record not found → 404 Not Found

2. **JWT errors (lines 19-32):**
   - `JsonWebTokenError`: Invalid token → 401 Unauthorized
   - `TokenExpiredError`: Expired token → 401 Unauthorized

3. **Default errors (lines 34-42):**
   - Uses `err.statusCode` if provided, else 500
   - Returns error message
   - In development, includes stack trace

**Express error handling flow:**
1. Error thrown in controller → `next(error)` called
2. Express skips remaining middleware
3. Finds error handler (4-parameter function)
4. Error handler processes error
5. Sends response to client

**Best practices:**
- Always use `try-catch` in async functions
- Always call `next(error)` in catch blocks
- Use specific error types for better handling
- Log errors for debugging
- Don't expose stack traces in production

**Q27:** If a Prisma query fails (e.g., database connection lost), what error would be thrown? How would you differentiate between a validation error and a database error in your error handler?

**A27:** 

**Prisma error types:**

1. **Connection errors:**
```js
PrismaClientKnownRequestError {
  code: 'P1001',
  message: 'Can't reach database server'
}
```

2. **Query errors:**
```js
PrismaClientKnownRequestError {
  code: 'P2002', // Unique constraint
  code: 'P2025', // Record not found
  // ... many others
}
```

3. **Validation errors:**
   - These are typically caught by Zod validation middleware BEFORE Prisma
   - Prisma schema validation happens at query time

**Current error handler limitations:**
The current `errorHandler.js` only handles:
- `P2002` (duplicate) → 409
- `P2025` (not found) → 404
- JWT errors
- Generic errors → 500

**Missing error handling:**
- Connection errors (`P1001`, `P1008`, etc.)
- Timeout errors
- Transaction errors
- Other Prisma error codes

**Improved error handler:**
```js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P1001': // Can't reach database
      case 'P1008': // Operations timed out
        return res.status(503).json({
          success: false,
          message: 'Database unavailable. Please try again later.',
        });
      
      case 'P2002': // Unique constraint
        return res.status(409).json({
          success: false,
          message: 'Duplicate entry. This record already exists.',
        });
      
      case 'P2025': // Record not found
        return res.status(404).json({
          success: false,
          message: 'Record not found.',
        });
      
      default:
        // Other Prisma errors
        return res.status(500).json({
          success: false,
          message: 'Database error occurred.',
        });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Zod validation errors (from validation middleware)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

**Differentiating error types:**
- **Validation errors:** Caught by Zod middleware, never reach Prisma
- **Database errors:** Prisma throws with error codes
- **Connection errors:** Prisma throws with `P1xxx` codes
- **Business logic errors:** Custom errors with `statusCode` property

---

## Full-Stack Integration

**Q28:** When a user creates a task, walk me through the complete flow from clicking "Create Task" button to seeing the task appear in the UI. Include frontend state updates, API calls, backend processing, and response handling.

**A28:** Complete flow:

**1. User Interaction (Frontend - Dashboard.jsx):**
   - User clicks "New Task" button (line 83)
   - `handleCreateTask()` called (line 25)
   - Sets `editingTask = null`, opens modal (`setIsModalOpen(true)`)

**2. Form Submission (Frontend - TaskModal.jsx):**
   - User fills form and clicks "Create Task"
   - `handleSubmit(onSubmit)` triggered (line 69)
   - React Hook Form validates with Zod schema
   - If valid, `onSubmit` called (line 38)

**3. Redux Action Dispatch (Frontend - TaskModal.jsx):**
   - `dispatch(addTask(data))` called (line 43)
   - `addTask` is a `createAsyncThunk` from `taskSlice.js`

**4. Redux State Update - Pending (Frontend - taskSlice.js):**
   - `addTask.pending` reducer runs (lines 97-99)
   - Sets `loading = true`, `error = null`

**5. API Call (Frontend - taskService.js → api.js):**
   - `createTask(data)` service function called
   - Axios request interceptor adds JWT token to headers
   - POST request to `/api/tasks` with task data

**6. Backend Route (Backend - taskRoutes.js):**
   - Request hits `/api/tasks` POST route (line 18)
   - `authenticate` middleware verifies JWT token
   - `validate(createTaskSchema)` validates request body
   - Routes to `createTask` controller

**7. Controller Processing (Backend - taskController.js):**
   - `createTask` function (lines 26-48)
   - Extracts `userId` from `req.userId` (set by auth middleware)
   - Creates task in database via Prisma (lines 31-38)
   - Returns 201 with created task data

**8. Response Handling (Frontend - taskSlice.js):**
   - `addTask.fulfilled` reducer runs (lines 101-105)
   - Sets `loading = false`
   - Adds task to state: `state.tasks.unshift(action.payload)`
   - Task appears at top of list

**9. UI Update (Frontend - Dashboard.jsx):**
   - Component re-renders due to Redux state change
   - `filteredTasks` recalculated (line 59)
   - TaskCard renders new task (lines 162-170)
   - Modal closes via `onSuccess()` callback

**Total time:** ~100-500ms depending on network latency

**Q29:** The frontend uses Zod for validation, and the backend also uses Zod. Why validate on both sides? What happens if the frontend validation passes but backend validation fails?

**A29:** 

**Why validate on both sides:**

1. **Frontend validation (UX):**
   - **Immediate feedback:** User sees errors instantly, no server round-trip
   - **Better UX:** Prevents unnecessary API calls
   - **Reduced server load:** Invalid requests never reach backend
   - **Can be bypassed:** User can disable JavaScript, use Postman, or modify code

2. **Backend validation (Security):**
   - **Security:** Frontend validation can be bypassed - backend is the source of truth
   - **Data integrity:** Ensures database only receives valid data
   - **API protection:** Protects against malicious requests
   - **Required:** Never trust client-side validation alone

**What happens if frontend passes but backend fails:**

**Scenario:**
1. User submits form → Frontend Zod validation passes
2. Request sent to backend
3. Backend Zod validation fails (e.g., different schema, stricter rules)

**Flow:**
- Backend `validate` middleware (in `taskRoutes.js` line 18) catches error
- Returns 400 Bad Request with validation errors:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```
- Frontend Axios receives error response
- `addTask.rejected` reducer runs (lines 106-109)
- Error stored in Redux state: `state.error = action.payload`
- UI should display error to user

**Potential issues:**
- If error handling is poor, user might not see the error
- Schema mismatch between frontend/backend causes confusion
- User experience degrades (thought it was valid, but rejected)

**Best practices:**
- Keep validation schemas in sync (consider sharing schema file)
- Show backend validation errors in UI
- Provide clear error messages
- Consider using a monorepo tool to share validation schemas

**Q30:** If the backend API is down, what happens in the frontend? How would you implement retry logic? What user experience would you provide?

**A30:** 

**Current behavior:**
- Axios request fails (network error, timeout, 500 error)
- `addTask.rejected` reducer runs
- Error stored in state: `state.error = "Failed to create task"`
- User sees error (if error UI is implemented)

**Problems:**
- No retry logic
- User must manually retry
- Poor UX for transient failures

**Implementing retry logic:**

**Option 1: Axios interceptor with retry:**
```js
// Install: npm install axios-retry
import axiosRetry from 'axios-retry';

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay, // 1s, 2s, 4s
  retryCondition: (error) => {
    // Retry on network errors or 5xx errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           (error.response?.status >= 500);
  },
});
```

**Option 2: Custom retry in Redux thunk:**
```js
export const addTask = createAsyncThunk(
  'task/addTask',
  async (taskData, { rejectWithValue, dispatch }) => {
    let lastError;
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await createTask(taskData);
        return response.data;
      } catch (error) {
        lastError = error;
        
        // Don't retry on 4xx errors (client errors)
        if (error.response?.status < 500) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    return rejectWithValue(lastError.response?.data?.message || 'Failed to create task');
  }
);
```

**User experience improvements:**

1. **Loading states:**
```jsx
{loading && (
  <div>
    <Loader2 className="animate-spin" />
    <p>Creating task... {retryCount > 0 && `(Retry ${retryCount}/3)`}</p>
  </div>
)}
```

2. **Error messages:**
```jsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-800">{error}</p>
    <button onClick={handleRetry}>Retry</button>
  </div>
)}
```

3. **Offline detection:**
```js
// Check if online
if (!navigator.onLine) {
  return rejectWithValue('You are offline. Please check your connection.');
}
```

4. **Optimistic updates with rollback:**
```js
// Add task optimistically
state.tasks.unshift(optimisticTask);

// If fails, remove it
state.tasks = state.tasks.filter(t => t.id !== optimisticTask.id);
```

**Q31:** The JWT token is stored in `localStorage`. What are the security implications? When would you use `httpOnly` cookies instead? How would you implement token refresh?

**A31:** 

**Security implications of localStorage:**

**Vulnerabilities:**
1. **XSS (Cross-Site Scripting):**
   - If malicious script runs, it can access `localStorage.getItem('token')`
   - Attacker can steal token and impersonate user
   - Common attack vector: Injected via third-party libraries, user input

2. **No automatic expiration:**
   - Token stays until explicitly removed
   - Even if token expires, it's still in localStorage

3. **Accessible to all scripts:**
   - Any JavaScript on the page can read it
   - No domain restrictions (within same origin)

**When to use httpOnly cookies:**

**Use httpOnly cookies when:**
- High security requirements (banking, healthcare)
- XSS is a major concern
- You control both frontend and backend domains
- You need automatic token management

**httpOnly cookie benefits:**
- **Not accessible to JavaScript:** Can't be read by XSS attacks
- **Automatic sending:** Browser sends with every request
- **Secure flag:** Can be set to only send over HTTPS
- **SameSite flag:** Prevents CSRF attacks

**Implementation:**
```js
// Backend - Set httpOnly cookie
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// Frontend - No need to manually add token
// Axios automatically includes cookies
api.defaults.withCredentials = true;
```

**Token refresh implementation:**

**Strategy:**
1. Short-lived access token (15 minutes)
2. Long-lived refresh token (7 days, stored in httpOnly cookie)
3. Refresh endpoint that exchanges refresh token for new access token

**Backend:**
```js
// Refresh token endpoint
router.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }
  
  try {
    const decoded = verifyToken(refreshToken);
    const newAccessToken = generateToken(decoded.userId);
    
    res.json({
      success: true,
      data: { token: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});
```

**Frontend - Axios interceptor:**
```js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true,
        });
        
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('token');
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Q32:** In a production environment, how would you handle CORS? The current setup allows all origins. What would you change for production?

**A32:** 

**Current setup:**
```js
app.use(cors()); // Allows ALL origins - security risk!
```

**Security risks:**
- **Any website can make requests** to your API
- **CSRF attacks:** Malicious sites can trigger actions on behalf of users
- **Data leakage:** Unauthorized sites can access user data

**Production CORS configuration:**

```js
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://yourapp.com',
      'https://www.yourapp.com',
      'https://app.yourapp.com',
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

**Environment-based configuration:**

```js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') // From env var
    : ['http://localhost:5173', 'http://localhost:3000'], // Development
  credentials: true,
};

app.use(cors(corsOptions));
```

**Additional security headers:**

```js
// Helmet.js for security headers
import helmet from 'helmet';

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Or manually:
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

**Best practices:**
- **Whitelist specific origins:** Never use `*` in production
- **Use environment variables:** Store allowed origins in `.env`
- **Enable credentials only when needed:** For httpOnly cookies
- **Limit methods:** Only allow necessary HTTP methods
- **Set maxAge:** Cache preflight requests
- **Monitor CORS errors:** Log blocked requests for debugging

---

## Database & ORM

### Prisma

**Q33:** Looking at the Prisma schema, the `Task` model has `userId` as a String with `@db.ObjectId`. Why not use a relation field directly? Explain the relationship between `userId` and the `user` relation.

**A33:** 

**Current schema:**
```prisma
model Task {
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Why both `userId` and `user` relation:**

1. **`userId` (String field):**
   - **Direct foreign key:** Stores the actual ObjectId value
   - **Required for queries:** Used in `where: { userId }` queries
   - **Explicit:** Makes the relationship clear
   - **Type safety:** Prisma knows it's an ObjectId

2. **`user` (relation field):**
   - **Virtual field:** Doesn't exist in database, computed by Prisma
   - **Enables joins:** Allows `include: { user }` to fetch related data
   - **Type safety:** Provides TypeScript types for related data
   - **Convenience:** Easy to access related user data

**Why not just relation field?**
- You **need** `userId` to:
  - Query tasks by user: `where: { userId: '...' }`
  - Set the foreign key: `data: { userId: '...' }`
  - Access the ID directly without a join

**Example usage:**
```js
// Using userId (direct)
const tasks = await prisma.task.findMany({
  where: { userId: currentUserId },
});

// Using relation (with include)
const tasks = await prisma.task.findMany({
  where: { userId: currentUserId },
  include: { user: true }, // Fetches user data
});

// Accessing
tasks[0].userId; // Direct access
tasks[0].user.username; // Via relation
```

**This is the correct Prisma pattern** - you need both the foreign key field and the relation field.

**Q34:** The schema uses `onDelete: Cascade` for the Task-User relationship. What does this mean? What happens if you delete a user? Is this the desired behavior?

**A34:** 

**Current schema:**
```prisma
user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
```

**What `onDelete: Cascade` means:**
- When a User is deleted, **all their Tasks are automatically deleted**
- Cascades down the relationship chain
- Happens at database level (enforced by MongoDB/Prisma)

**What happens when you delete a user:**
```js
await prisma.user.delete({
  where: { id: userId },
});
// All tasks with userId are automatically deleted
```

**Is this desired behavior?**

**For a task management app:**
- **Pros:** Clean data, no orphaned tasks, simple data model
- **Cons:** User loses all their data permanently, can't recover tasks

**Alternative behaviors:**

1. **`onDelete: SetNull`:**
   - Tasks remain but `userId` becomes `null`
   - Requires `userId` to be optional: `userId String?`
   - Tasks become "orphaned" - might not be desired

2. **`onDelete: Restrict`:**
   - Prevents user deletion if they have tasks
   - Must delete tasks first, then user
   - Better for data integrity

3. **Soft delete:**
   - Don't actually delete user, mark as deleted
   - Keep tasks associated
   - Allows data recovery

**Better approach for production:**
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  username  String   @unique
  password  String
  deletedAt DateTime? // Soft delete
  tasks     Task[]
}

// In controller
await prisma.user.update({
  where: { id: userId },
  data: { deletedAt: new Date() },
});
// Tasks remain, but filter out deleted users
```

**For this assignment:** `Cascade` is acceptable for simplicity, but in production, consider soft deletes or `Restrict`.

**Q35:** There's an index on `userId` in the Task model. Why is this important? What query performance issues might occur without this index?

**A35:** 

**Current schema:**
```prisma
model Task {
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

**Why the index is important:**

1. **Query performance:**
   - Most queries filter by `userId`: `where: { userId }`
   - Without index: MongoDB scans **all documents** (full collection scan)
   - With index: MongoDB uses index to find matching documents quickly

2. **Performance difference:**
   - **Without index:** O(n) - scans all tasks
   - **With index:** O(log n) - binary search on index
   - **Example:** 10,000 tasks, finding user's 10 tasks
     - Without index: Scans all 10,000
     - With index: Direct lookup, ~10-20 documents examined

3. **Real-world impact:**
   - **Small collections (< 1000):** Difference is negligible
   - **Medium (1,000-100,000):** 10-100x slower without index
   - **Large (> 100,000):** Can be 1000x+ slower, may timeout

**Query that benefits:**
```js
// This query uses the index
const tasks = await prisma.task.findMany({
  where: { userId: currentUserId },
});
```

**What happens without index:**
- MongoDB performs **collection scan**
- Examines every task document
- Checks `userId` field for each document
- Returns matching documents
- **Very slow** as collection grows

**Additional indexes to consider:**
```prisma
@@index([userId, status]) // Composite index for filtering by user and status
@@index([userId, createdAt]) // For sorting user's tasks by date
```

**Best practice:** Always index foreign keys and frequently queried fields.

**Q36:** If you wanted to add pagination to the `getTasks` endpoint, how would you modify the Prisma query? What parameters would you accept from the frontend?

**A36:** 

**Current query (no pagination):**
```js
const tasks = await prisma.task.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
});
```

**Adding pagination:**

**Backend changes:**
```js
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.task.count({
        where: { userId },
      }),
    ]);

    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

**Frontend parameters:**
```js
// Query parameters
GET /api/tasks?page=1&limit=20

// Or in service
const getTasks = (page = 1, limit = 10) => {
  return api.get(`/tasks?page=${page}&limit=${limit}`);
};
```

**Cursor-based pagination (better for large datasets):**
```js
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cursor = req.query.cursor; // Last task ID from previous page
    const limit = parseInt(req.query.limit) || 10;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Fetch one extra to check if there's more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasNext = tasks.length > limit;
    const data = hasNext ? tasks.slice(0, -1) : tasks;
    const nextCursor = hasNext ? data[data.length - 1].id : null;

    res.json({
      success: true,
      data,
      pagination: {
        cursor: nextCursor,
        hasNext,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

**Frontend implementation:**
```jsx
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const response = await getTasks(page + 1);
  setTasks([...tasks, ...response.data]);
  setHasMore(response.pagination.hasNext);
  setPage(page + 1);
};
```

**Trade-offs:**
- **Offset pagination:** Simple, but slow for large offsets (skip 10,000 is slow)
- **Cursor pagination:** Fast, but can't jump to specific page

### MongoDB

**Q37:** Why did you choose MongoDB over a relational database like PostgreSQL for this application? What are the trade-offs?

**A37:** 

**MongoDB advantages for this app:**
1. **Schema flexibility:** Easy to add fields without migrations
2. **JSON-like documents:** Natural fit for JavaScript/Node.js
3. **Horizontal scaling:** Easier to scale across multiple servers
4. **Simple queries:** Good for simple CRUD operations
5. **Rapid prototyping:** Faster initial development

**Trade-offs vs PostgreSQL:**

**MongoDB:**
- ✅ Flexible schema (good for evolving requirements)
- ✅ Easy horizontal scaling
- ✅ Good for document-based data
- ❌ No joins (must fetch related data separately)
- ❌ No transactions across collections (limited)
- ❌ Weaker consistency guarantees
- ❌ Less mature tooling

**PostgreSQL:**
- ✅ ACID transactions
- ✅ Strong consistency
- ✅ Joins and relationships
- ✅ Mature ecosystem
- ✅ Better for complex queries
- ❌ More rigid schema
- ❌ Vertical scaling (harder to scale horizontally)

**For this task app:**
- **MongoDB is fine:** Simple data model, no complex relationships
- **PostgreSQL might be better if:** You need transactions, complex queries, or strict data integrity

**When to choose each:**
- **MongoDB:** Document stores, flexible schemas, horizontal scaling needs
- **PostgreSQL:** Relational data, complex queries, transactions, data integrity critical

**Q38:** If you needed to add a "tags" feature where tasks can have multiple tags, how would you model this in MongoDB? Would you embed tags in the Task document or create a separate collection?

**A38:** 

**Option 1: Embed tags in Task document (Array of strings):**
```prisma
model Task {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  tags        String[] // Array of tag names
  // ...
}
```

**Pros:**
- Simple queries: `where: { tags: { has: 'urgent' } }`
- Fast reads (all data in one document)
- No joins needed

**Cons:**
- Can't query "all tasks with tag X" efficiently (requires scanning)
- Duplicate tag names across documents
- Can't store tag metadata (color, description)
- Hard to rename tags (must update all documents)

**Option 2: Separate Tags collection (Normalized):**
```prisma
model Tag {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   @unique
  color     String?
  tasks     Task[]
}

model Task {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  tagIds      String[] @db.ObjectId
  tags        Tag[]    @relation("TaskTags")
  // ...
}
```

**Pros:**
- Can store tag metadata (color, description, count)
- Easy to query "all tasks with tag X"
- Easy to rename tags (update one document)
- Can track tag usage

**Cons:**
- More complex queries (requires joins/lookups)
- Slower reads (multiple queries or aggregation)

**Option 3: Hybrid (Recommended for this use case):**
```prisma
model Task {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  tags        String[] // Simple array for quick access
  // ...
}

// Optional: Separate collection for tag management
model Tag {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   @unique
  color     String?
  // Store metadata, but don't enforce relationship
}
```

**Best approach for this app:**
- **Start with Option 1 (embedded array):** Simple, fast, meets most needs
- **Upgrade to Option 3 if needed:** If you need tag management features

**Query examples:**
```js
// Find tasks with specific tag
const tasks = await prisma.task.findMany({
  where: {
    userId,
    tags: { has: 'urgent' },
  },
});

// Add tag to task
await prisma.task.update({
  where: { id: taskId },
  data: {
    tags: { push: 'urgent' },
  },
});
```

**Q39:** How would you implement full-text search for tasks? What MongoDB features would you use?

**A39:** 

**Option 1: MongoDB Text Index (Simple):**
```prisma
// In schema (Prisma doesn't directly support, but can be added via raw MongoDB)
// You'd need to create index manually or use Prisma's raw queries
```

```js
// Create text index (run once)
await prisma.$runCommandRaw({
  createIndexes: 'Task',
  indexes: [
    {
      key: { title: 'text', description: 'text' },
      name: 'task_text_index',
    },
  ],
});

// Search query
const tasks = await prisma.$runCommandRaw({
  find: 'Task',
  filter: {
    userId: userId,
    $text: { $search: 'important meeting' },
  },
  sort: { score: { $meta: 'textScore' } },
});
```

**Limitations:**
- Prisma doesn't have great support for text search
- Requires raw MongoDB queries
- Limited language support

**Option 2: Regex search (Simple, no index needed):**
```js
export const searchTasks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const query = req.query.q; // Search term
    
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
```

**Pros:** Simple, works with Prisma
**Cons:** Slow for large collections, no relevance ranking

**Option 3: External search service (Recommended for production):**
- **Algolia:** Fast, hosted, great UX
- **Elasticsearch:** Powerful, self-hosted
- **Atlas Search:** MongoDB's built-in search (if using Atlas)

**Algolia example:**
```js
// Backend - Index tasks
import algoliasearch from 'algoliasearch';

const client = algoliasearch(APP_ID, API_KEY);
const index = client.initIndex('tasks');

// When task created/updated
await index.saveObject({
  objectID: task.id,
  title: task.title,
  description: task.description,
  userId: task.userId,
});

// Search
const { hits } = await index.search(query, {
  filters: `userId:${userId}`,
});
```

**Option 4: MongoDB Atlas Search (if using Atlas):**
```js
// Create search index in Atlas UI, then:
const tasks = await prisma.$runCommandRaw({
  aggregate: 'Task',
  pipeline: [
    {
      $search: {
        index: 'task_search_index',
        text: {
          query: searchTerm,
          path: ['title', 'description'],
        },
      },
    },
    { $match: { userId: userId } },
  ],
});
```

**Recommendation:**
- **Development:** Use regex search (Option 2)
- **Production:** Use Algolia or Atlas Search for better performance and relevance

---

## Security & Authentication

**Q40:** In `auth.js` middleware, you're extracting the token from the Authorization header. What happens if someone sends a malformed token? How does `verifyToken` handle expired tokens?

**A40:** 

**Malformed token scenarios:**

1. **Missing "Bearer " prefix:**
   - `authHeader.startsWith('Bearer ')` returns `false` (line 7)
   - Returns 401: "No token provided" (line 8-11)

2. **Token is just "Bearer" with no value:**
   - `authHeader.substring(7)` returns empty string
   - `verifyToken('')` throws error
   - Caught by catch block (line 20), returns 401: "Invalid or expired token"

3. **Invalid JWT format (not a valid JWT structure):**
   - `jwt.verify()` throws `JsonWebTokenError`
   - Caught in `verifyToken` (line 18), throws "Invalid or expired token"
   - Middleware catch block returns 401

**Expired token handling:**

Looking at `jwt.js`:
```js
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
```

- `jwt.verify()` throws `TokenExpiredError` if token is expired
- Caught in try-catch, throws generic error
- Middleware returns 401

**Better error handling:**
```js
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};
```

**Q41:** The JWT secret is stored in an environment variable. What happens if this secret is compromised? How would you rotate JWT secrets in production?

**A41:** 

**If JWT secret is compromised:**
- **Attacker can:** Generate valid tokens for any user
- **Attacker can:** Impersonate any user
- **Impact:** Complete authentication bypass
- **Severity:** Critical security breach

**Immediate actions:**
1. **Rotate secret immediately**
2. **Invalidate all existing tokens** (force re-login)
3. **Monitor for suspicious activity**
4. **Notify users** if necessary

**JWT secret rotation strategy:**

**Option 1: Immediate rotation (force re-login):**
```js
// Update .env
JWT_SECRET=new_secret_here

// Restart server
// All existing tokens become invalid
// Users must log in again
```

**Option 2: Graceful rotation (support both secrets temporarily):**
```js
const OLD_SECRET = process.env.JWT_SECRET_OLD;
const NEW_SECRET = process.env.JWT_SECRET;

export const verifyToken = (token) => {
  try {
    // Try new secret first
    return jwt.verify(token, NEW_SECRET);
  } catch (error) {
    // If fails, try old secret (for tokens issued before rotation)
    if (OLD_SECRET) {
      try {
        const decoded = jwt.verify(token, OLD_SECRET);
        // Optionally issue new token with new secret
        return decoded;
      } catch {
        throw new Error('Invalid or expired token');
      }
    }
    throw new Error('Invalid or expired token');
  }
};
```

**Best practices:**
- **Use strong secrets:** Minimum 32 characters, random
- **Rotate regularly:** Every 90 days or after security incidents
- **Use secret management:** AWS Secrets Manager, HashiCorp Vault
- **Monitor token usage:** Alert on unusual patterns
- **Implement token blacklist:** For revoked tokens (requires database)

**Q42:** Passwords are hashed with bcrypt using a salt rounds of 10. What does this mean? Why not use a higher number like 15? What's the trade-off?

**A42:** 

**What salt rounds mean:**
- **Salt rounds = 10:** Algorithm runs 2^10 = 1,024 iterations
- **Each iteration:** Hashes the password + salt, making it exponentially harder to crack
- **Salt:** Random value added to each password before hashing (stored with hash)

**Why salt rounds matter:**
- **Higher rounds = more secure:** Takes longer to crack
- **Higher rounds = slower hashing:** Takes longer to hash (login slower)

**Trade-offs:**

**Rounds = 10 (current):**
- **Hash time:** ~100-200ms
- **Security:** Good for most applications
- **Login speed:** Acceptable (user won't notice)

**Rounds = 15:**
- **Hash time:** ~2-4 seconds
- **Security:** Very strong
- **Login speed:** Noticeable delay, poor UX

**Industry standards:**
- **10-12 rounds:** Standard for web applications
- **13-15 rounds:** High-security applications (banking)
- **8-10 rounds:** Legacy systems (too weak for new apps)

**Best practice:**
```js
// Use environment variable for flexibility
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
```

**For this app:** 10 rounds is appropriate. Consider 12 for production if security is critical.

**Q43:** In `authController.js`, user passwords are never returned in responses (line 30-34 uses `select`). What other sensitive data should you ensure is never exposed?

**A43:** 

**Current protection:**
```js
const user = await prisma.user.create({
  data: { username, password: hashedPassword },
  select: {
    id: true,
    username: true,
    createdAt: true,
    // password is NOT selected - good!
  },
});
```

**Other sensitive data to protect:**

1. **Passwords:** ✅ Already protected
2. **JWT secrets:** ✅ In environment variables
3. **API keys:** Should never be in responses
4. **Internal IDs:** Consider using public IDs instead of database IDs
5. **Email addresses:** May be sensitive (GDPR considerations)
6. **IP addresses:** Should not be logged in responses
7. **Session tokens:** Should never be exposed
8. **Credit card info:** If applicable, never store or return
9. **Social security numbers:** If applicable
10. **Internal system paths:** File paths, server info

**Additional protections:**

1. **Don't expose database structure:**
```js
// Bad - exposes internal structure
res.json({ user: { _id: "...", __v: 0 } });

// Good - clean response
res.json({ user: { id: "...", username: "..." } });
```

2. **Sanitize error messages:**
```js
// Bad - exposes system info
res.json({ error: err.stack });

// Good - generic message
res.json({ error: "An error occurred" });
```

3. **Use DTOs (Data Transfer Objects):**
```js
// Create user DTO
const userDTO = {
  id: user.id,
  username: user.username,
  createdAt: user.createdAt,
  // Explicitly exclude sensitive fields
};
```

4. **Remove sensitive fields from logs:**
```js
// Don't log passwords
console.log('User created:', { username, password: '[REDACTED]' });
```

**Q44:** The `updateTask` function checks `existingTask.userId !== userId`. What if `userId` is `undefined` or `null`? How would you add additional validation?

**A44:** 

**Current code:**
```js
if(existingTask.userId !== userId) {
  return res.status(403).json({ ... });
}
```

**Potential issues:**
- If `userId` is `undefined` or `null`, the check might not work as expected
- `undefined !== 'someId'` → `true` → Returns 403 (correct)
- But if both are `undefined`: `undefined !== undefined` → `false` → Bypasses check! ❌

**How `userId` could be undefined:**
- Auth middleware fails to set `req.userId`
- Token doesn't contain `userId`
- Middleware bug

**Additional validation:**
```js
export const updateTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Validate taskId format (MongoDB ObjectId)
    if (!taskId || !/^[0-9a-fA-F]{24}$/.test(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Strict equality check with type coercion protection
    if (String(existingTask.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task',
      });
    }

    // ... rest of update logic
  } catch (error) {
    next(error);
  }
};
```

**Better: Create validation middleware:**
```js
// middlewares/validateUserId.js
export const validateUserId = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  next();
};

// In routes
router.put('/:id', authenticate, validateUserId, validate(updateTaskSchema), updateTask);
```

**Q45:** If an attacker tries to brute-force login attempts, how would you implement rate limiting? Where would you add this protection?

**A45:** 

**Rate limiting strategy:**

**Option 1: Express rate limit middleware (Simple):**
```bash
npm install express-rate-limit
```

```js
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to login route
router.post('/login', loginLimiter, validate(loginSchema), login);
```

**Option 2: IP-based with Redis (Production):**
```js
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:login:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true, // Don't count successful logins
});
```

**Option 3: Account-based (More secure):**
```js
// Track failed attempts per username
const failedAttempts = new Map();

export const checkLoginAttempts = async (req, res, next) => {
  const { username } = req.body;
  const key = `login:${username}`;
  const attempts = failedAttempts.get(key) || { count: 0, resetTime: Date.now() + 15 * 60 * 1000 };

  if (Date.now() > attempts.resetTime) {
    attempts.count = 0;
    attempts.resetTime = Date.now() + 15 * 60 * 1000;
  }

  if (attempts.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.',
    });
  }

  req.loginAttempts = attempts;
  next();
};

// In login controller
export const login = async (req, res, next) => {
  try {
    // ... login logic
    
    if (!isPasswordValid) {
      const { username } = req.body;
      const key = `login:${username}`;
      const attempts = req.loginAttempts;
      attempts.count++;
      failedAttempts.set(key, attempts);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Success - clear attempts
    const key = `login:${req.body.username}`;
    failedAttempts.delete(key);
    
    // ... return token
  } catch (error) {
    next(error);
  }
};
```

**Where to add:**
1. **Login route:** Most critical
2. **Register route:** Prevent account creation spam
3. **Password reset:** Prevent abuse
4. **API routes:** General protection

**Additional security:**
- **CAPTCHA after 3 failed attempts**
- **Account lockout after 10 failed attempts**
- **Email notification on suspicious activity**
- **Log failed attempts for monitoring**

**Best practice:** Use IP-based for general protection, account-based for login specifically.

---

## State Management

**Q46:** You're using Redux Toolkit. What problems does it solve compared to plain Redux? How does `createSlice` simplify reducer logic?

**A46:** 

**Problems Redux Toolkit solves:**

1. **Boilerplate reduction:**
   - **Plain Redux:** Need action types, action creators, reducers separately
   - **Redux Toolkit:** All in one `createSlice`

2. **Immutability:**
   - **Plain Redux:** Must manually ensure immutability (easy to make mistakes)
   - **Redux Toolkit:** Uses Immer internally, write "mutating" code safely

3. **Store configuration:**
   - **Plain Redux:** Complex setup with `combineReducers`, middleware
   - **Redux Toolkit:** `configureStore` handles everything

**How `createSlice` simplifies:**

**Plain Redux:**
```js
// Action types
const ADD_TASK = 'ADD_TASK';
const DELETE_TASK = 'DELETE_TASK';

// Action creators
export const addTask = (task) => ({ type: ADD_TASK, payload: task });
export const deleteTask = (id) => ({ type: DELETE_TASK, payload: id });

// Reducer
const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
};
```

**Redux Toolkit (current):**
```js
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Automatically generates action creators and types
    addTask: (state, action) => {
      state.tasks.push(action.payload); // Immer handles immutability
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});

// Auto-generated: taskSlice.actions.addTask, taskSlice.actions.deleteTask
```

**Benefits:**
- **Less code:** ~70% less boilerplate
- **Type safety:** Better TypeScript support
- **Immutability:** Immer handles it automatically
- **DevTools:** Better debugging experience

**Q47:** In `taskSlice.js`, the initial state has `loading`, `error`, and `tasks`. How would you add optimistic updates? For example, when deleting a task, immediately remove it from UI before the API call completes.

**A47:** 

**Current delete flow:**
1. User clicks delete
2. API call starts (`removeTask.pending`)
3. API call completes (`removeTask.fulfilled`)
4. Task removed from UI

**Optimistic update flow:**
1. User clicks delete
2. **Task immediately removed from UI** (optimistic)
3. API call starts
4. If succeeds: Done (already removed)
5. If fails: **Restore task** and show error

**Implementation:**
```js
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    optimisticUpdates: [], // Track optimistic operations
  },
  reducers: {
    // Optimistic delete
    optimisticDeleteTask: (state, action) => {
      const taskId = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      
      // Store original task for rollback
      state.optimisticUpdates.push({
        type: 'delete',
        taskId,
        originalTask: task,
      });
      
      // Remove from UI immediately
      state.tasks = state.tasks.filter(t => t.id !== taskId);
    },
    
    // Rollback optimistic update
    rollbackOptimisticUpdate: (state, action) => {
      const update = state.optimisticUpdates.find(u => u.taskId === action.payload);
      if (update && update.type === 'delete') {
        // Restore task
        state.tasks.push(update.originalTask);
        state.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      state.optimisticUpdates = state.optimisticUpdates.filter(
        u => u.taskId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeTask.pending, (state, action) => {
        // Task already removed optimistically, just set loading
        state.loading = true;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
        // Task already removed, just clean up optimistic update
        state.optimisticUpdates = state.optimisticUpdates.filter(
          u => u.taskId !== action.payload
        );
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Rollback the optimistic delete
        const taskId = action.meta.arg; // The taskId passed to thunk
        state.optimisticUpdates = state.optimisticUpdates.filter(
          u => u.taskId !== taskId
        );
        // Restore task
        const update = state.optimisticUpdates.find(u => u.taskId === taskId);
        if (update) {
          state.tasks.push(update.originalTask);
        }
      });
  },
});
```

**In component:**
```jsx
const handleDelete = (taskId) => {
  // Optimistically remove
  dispatch(optimisticDeleteTask(taskId));
  
  // Then make API call
  dispatch(removeTask(taskId));
};
```

**Benefits:**
- **Instant UI feedback:** Better UX
- **Perceived performance:** App feels faster
- **Handles failures:** Can rollback on error

**Q48:** If you wanted to implement undo/redo functionality for task operations, how would you structure the Redux state? What middleware would you need?

**A48:** 

**State structure:**
```js
const initialState = {
  tasks: [],
  past: [], // History of states
  future: [], // Redo stack
  present: null, // Current state index
};
```

**Implementation with redux-undo:**
```bash
npm install redux-undo
```

```js
import undoable from 'redux-undo';

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
};

// Wrap reducer with undoable
export default undoable(taskReducer, {
  limit: 20, // Max 20 undo steps
  filter: (action) => {
    // Only track certain actions
    return ['ADD_TASK', 'DELETE_TASK', 'UPDATE_TASK'].includes(action.type);
  },
});
```

**Manual implementation:**
```js
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    history: {
      past: [],
      present: null,
      future: [],
    },
  },
  reducers: {
    addTask: (state, action) => {
      // Save current state to history
      state.history.past.push(JSON.parse(JSON.stringify(state.tasks)));
      state.history.future = []; // Clear redo stack
      
      // Apply change
      state.tasks.push(action.payload);
    },
    
    undo: (state) => {
      if (state.history.past.length === 0) return;
      
      // Move current state to future
      state.history.future.unshift(JSON.parse(JSON.stringify(state.tasks)));
      
      // Restore previous state
      state.tasks = state.history.past.pop();
    },
    
    redo: (state) => {
      if (state.history.future.length === 0) return;
      
      // Save current state to past
      state.history.past.push(JSON.parse(JSON.stringify(state.tasks)));
      
      // Restore future state
      state.tasks = state.history.future.shift();
    },
  },
});
```

**Middleware approach (more advanced):**
```js
// Custom middleware to track actions
const undoRedoMiddleware = (store) => (next) => (action) => {
  if (action.type === 'UNDO') {
    // Handle undo
    return next(action);
  }
  
  // Track action for undo
  const result = next(action);
  // Save state snapshot
  return result;
};
```

**UI implementation:**
```jsx
<button onClick={() => dispatch(undo())} disabled={!canUndo}>
  Undo
</button>
<button onClick={() => dispatch(redo())} disabled={!canRedo}>
  Redo
</button>
```

**Best practice:** Use `redux-undo` library for production apps - it handles edge cases and is well-tested.

**Q49:** The `userSlice` likely stores the current user. How would you handle token expiration? Would you check token validity on app load?

**A49:** 

**Current state:** Token is stored but not validated on app load.

**Token expiration handling:**

**1. Check on app load:**
```js
// In App.jsx or main.jsx
useEffect(() => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Decode token to check expiration (without verification)
    try {
      const decoded = jwt.decode(token); // Doesn't verify, just decodes
      const now = Date.now() / 1000;
      
      if (decoded.exp < now) {
        // Token expired
        dispatch(signOut());
        localStorage.removeItem('token');
      } else {
        // Token valid, verify with backend
        dispatch(verifyToken(token));
      }
    } catch (error) {
      // Invalid token format
      dispatch(signOut());
      localStorage.removeItem('token');
    }
  }
}, []);
```

**2. Verify token with backend:**
```js
// In userSlice.js
export const verifyToken = createAsyncThunk(
  'user/verifyToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      return rejectWithValue('Token invalid');
    }
  }
);

// In extraReducers
.addCase(verifyToken.rejected, (state) => {
  state.currentUser = null;
  state.token = null;
  localStorage.removeItem('token');
});
```

**3. Automatic refresh before expiration:**
```js
// Check token expiration periodically
useEffect(() => {
  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      const now = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - now;
      
      // If expires in less than 5 minutes, refresh
      if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
        dispatch(refreshToken());
      }
      
      // If expired, logout
      if (timeUntilExpiry <= 0) {
        dispatch(signOut());
      }
    }
  };
  
  checkToken();
  const interval = setInterval(checkToken, 60000); // Check every minute
  
  return () => clearInterval(interval);
}, []);
```

**4. Handle 401 responses (already implemented in api.js):**
- Response interceptor catches 401
- Removes token and redirects to login
- This is the fallback if other checks fail

**Best practice:**
- **Check on load:** Validate token when app starts
- **Periodic checks:** Check expiration every few minutes
- **Refresh tokens:** Implement refresh token mechanism
- **Handle 401:** Response interceptor as fallback
- **Clear on logout:** Always clear token on sign out

---

## Code Quality & Best Practices

**Q50:** In `taskController.js`, you're repeating the ownership check pattern in both `updateTask` and `deleteTask`. How would you refactor this to follow DRY principles?

**A50:** 

**Current duplication:**
Both `updateTask` and `deleteTask` have nearly identical ownership checks:
```js
const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
if (!existingTask) return res.status(404).json({ ... });
if (existingTask.userId !== userId) return res.status(403).json({ ... });
```

**Refactoring options:**

**Option 1: Extract to middleware:**
```js
// middlewares/checkTaskOwnership.js
export const checkTaskOwnership = async (req, res, next) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this task',
      });
    }

    // Attach task to request for use in controller
    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

// In routes
router.put('/:id', authenticate, checkTaskOwnership, validate(updateTaskSchema), updateTask);
router.delete('/:id', authenticate, checkTaskOwnership, deleteTask);

// In controller (simplified)
export const updateTask = async (req, res, next) => {
  try {
    const task = req.task; // Already verified
    const { title, description, status } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: { ... },
    });

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};
```

**Option 2: Extract to utility function:**
```js
// utils/taskUtils.js
export const verifyTaskOwnership = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error('TASK_NOT_FOUND');
  }

  if (task.userId !== userId) {
    throw new Error('TASK_ACCESS_DENIED');
  }

  return task;
};

// In controller
export const updateTask = async (req, res, next) => {
  try {
    const task = await verifyTaskOwnership(req.params.id, req.userId);
    // ... rest of logic
  } catch (error) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ ... });
    }
    if (error.message === 'TASK_ACCESS_DENIED') {
      return res.status(403).json({ ... });
    }
    next(error);
  }
};
```

**Best practice:** Use middleware (Option 1) - cleaner, more reusable, follows Express patterns.

**Q51:** The validation schemas are duplicated between frontend and backend. How would you share validation logic? What are the pros and cons of each approach?

**A51:** 

**Current situation:**
- Frontend: `frontend/src/utils/validationSchemas.js`
- Backend: `backend/utils/validation.js`
- Same Zod schemas duplicated

**Sharing options:**

**Option 1: Shared package (Monorepo):**
```
project/
├── packages/
│   └── shared/
│       └── validation/
│           └── schemas.js
├── frontend/
└── backend/
```

```js
// packages/shared/validation/schemas.js
export const taskSchema = z.object({ ... });

// Both frontend and backend import from shared
import { taskSchema } from '@shared/validation/schemas';
```

**Pros:** Single source of truth, type-safe, easy to maintain
**Cons:** Requires monorepo setup, build configuration

**Option 2: NPM package:**
```bash
# Create separate package
npm create validation-schemas
# Publish to npm or private registry
```

**Pros:** Reusable across projects, versioned
**Cons:** Overhead for small projects, publishing process

**Option 3: Git submodule:**
```bash
git submodule add <repo-url> shared-schemas
```

**Pros:** Simple, works with any repo structure
**Cons:** Submodule management complexity, merge conflicts

**Option 4: Copy script:**
```js
// scripts/copy-schemas.js
const fs = require('fs');
const schemas = fs.readFileSync('shared/schemas.js');
fs.writeFileSync('frontend/src/utils/validationSchemas.js', schemas);
fs.writeFileSync('backend/utils/validation.js', schemas);
```

**Pros:** Simple, no build setup
**Cons:** Manual sync, easy to get out of sync

**Option 5: Keep separate but validate consistency:**
```js
// tests/schema-consistency.test.js
import frontendSchema from '../frontend/src/utils/validationSchemas';
import backendSchema from '../backend/utils/validation';

test('schemas match', () => {
  expect(frontendSchema.taskSchema).toEqual(backendSchema.createTaskSchema);
});
```

**Pros:** No refactoring needed
**Cons:** Still duplicated, must remember to update both

**Recommendation:** For this project, Option 1 (shared package in monorepo) is best. For simpler projects, Option 5 with tests ensures consistency.

**Q52:** Looking at `TaskCard.jsx`, the component is quite long (150 lines). How would you break it down into smaller components? What principles would guide your refactoring?

**A52:** 

**Refactoring principles:**
1. **Single Responsibility:** Each component does one thing
2. **Reusability:** Extract reusable parts
3. **Readability:** Smaller components are easier to understand
4. **Testability:** Smaller components are easier to test

**Breakdown:**

**1. Extract TaskStatusBadge:**
```jsx
// components/TaskStatusBadge.jsx
export default function TaskStatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === 'completed' 
        ? 'bg-emerald-100 text-emerald-700' 
        : 'bg-amber-100 text-amber-700'
    }`}>
      {status === 'completed' ? 'Completed' : 'Pending'}
    </span>
  );
}
```

**2. Extract TaskCheckbox:**
```jsx
// components/TaskCheckbox.jsx
export default function TaskCheckbox({ isCompleted, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        isCompleted 
          ? 'bg-emerald-100 text-emerald-600' 
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {isCompleted ? <CheckCircle2 /> : <Circle />}
    </button>
  );
}
```

**3. Extract TaskMenu:**
```jsx
// components/TaskMenu.jsx
export default function TaskMenu({ task, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  // ... menu logic
}
```

**4. Extract TaskDueDate:**
```jsx
// components/TaskDueDate.jsx
export default function TaskDueDate({ dueDate }) {
  if (!dueDate) return <div className="text-sm text-gray-400">No due date</div>;
  
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Calendar className="w-4 h-4" />
      {format(new Date(dueDate), 'MMM dd, yyyy')}
    </div>
  );
}
```

**5. Split into TaskCardGrid and TaskCardList:**
```jsx
// components/TaskCardGrid.jsx
export default function TaskCardGrid({ task, onEdit, onDelete }) {
  return (
    <div className="...">
      <TaskCheckbox isCompleted={task.status === 'completed'} onClick={() => onEdit(task)} />
      <TaskMenu task={task} onEdit={onEdit} onDelete={onDelete} />
      <h3>{task.title}</h3>
      <TaskDueDate dueDate={task.dueDate} />
      <TaskStatusBadge status={task.status} />
    </div>
  );
}

// components/TaskCardList.jsx
export default function TaskCardList({ task, onEdit, onDelete }) {
  // List view implementation
}

// Main TaskCard (orchestrator)
export default function TaskCard({ task, onEdit, onDelete, viewMode }) {
  return viewMode === 'grid' 
    ? <TaskCardGrid task={task} onEdit={onEdit} onDelete={onDelete} />
    : <TaskCardList task={task} onEdit={onEdit} onDelete={onDelete} />;
}
```

**Benefits:**
- **TaskCard:** 150 lines → ~30 lines (orchestrator)
- **Each component:** 20-40 lines, focused responsibility
- **Easier testing:** Test each component independently
- **Reusability:** Components can be used elsewhere

**Q53:** In `api.js` line 27, there's a typo comment "Responsing" instead of "Response". How would you catch such issues? What tools would you use for code quality?

**A53:** 

**Tools to catch typos and code quality issues:**

**1. ESLint with spell-check plugin:**
```bash
npm install --save-dev eslint-plugin-spellcheck
```

```js
// eslint.config.js
export default [
  {
    plugins: ['spellcheck'],
    rules: {
      'spellcheck/spell-checker': ['warn', {
        comments: true,
        strings: true,
        identifiers: true,
      }],
    },
  },
];
```

**2. cspell (Code Spell Checker):**
```bash
npm install --save-dev cspell
```

```json
// cspell.json
{
  "version": "0.2",
  "language": "en",
  "words": ["redux", "prisma", "mongodb"],
  "ignorePaths": ["node_modules", "dist"]
}
```

**3. VS Code extensions:**
- **Code Spell Checker:** Highlights typos in real-time
- **Grammarly:** Checks grammar in comments
- **Typos:** Catches common typos

**4. Pre-commit hooks (Husky):**
```bash
npm install --save-dev husky lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "cspell"],
    "*.md": ["cspell"]
  }
}
```

**5. CI/CD checks:**
```yaml
# .github/workflows/ci.yml
- name: Spell check
  run: npx cspell "**/*.{js,jsx,md}"
```

**6. Code review tools:**
- **GitHub Copilot:** Suggests fixes
- **CodeRabbit:** Automated code review
- **SonarQube:** Code quality analysis

**7. Manual review checklist:**
- Comments and documentation
- Variable names
- Error messages
- User-facing text

**Best practice:** Use ESLint + cspell + pre-commit hooks for automated checking.

**Q54:** The error messages in controllers are user-friendly strings. Should error messages be internationalized (i18n)? How would you implement this?

**A54:** 

**When to internationalize:**
- **Multi-language support needed:** Users speak different languages
- **Global application:** Targeting international markets
- **Enterprise requirement:** Company policy
- **Not needed if:** Single language, internal tool, MVP

**Implementation options:**

**Option 1: i18next (Most popular):**
```bash
npm install i18next react-i18next
```

```js
// i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        taskNotFound: 'Task not found',
        accessDenied: 'You do not have permission',
      },
    },
    es: {
      translation: {
        taskNotFound: 'Tarea no encontrada',
        accessDenied: 'No tienes permiso',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
});

// In controller
import i18n from '../i18n/config';

export const updateTask = async (req, res, next) => {
  const lang = req.headers['accept-language'] || 'en';
  i18n.changeLanguage(lang);
  
  if (!existingTask) {
    return res.status(404).json({
      success: false,
      message: i18n.t('taskNotFound'),
    });
  }
};
```

**Option 2: Simple translation object:**
```js
// utils/translations.js
const translations = {
  en: {
    taskNotFound: 'Task not found',
    accessDenied: 'You do not have permission',
  },
  es: {
    taskNotFound: 'Tarea no encontrada',
    accessDenied: 'No tienes permiso',
  },
};

export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

// In controller
import { t } from '../utils/translations';

const lang = req.headers['accept-language']?.split(',')[0] || 'en';
res.json({ message: t('taskNotFound', lang) });
```

**Option 3: Backend returns error codes, frontend translates:**
```js
// Backend
res.status(404).json({
  success: false,
  errorCode: 'TASK_NOT_FOUND',
  message: 'Task not found', // Fallback
});

// Frontend
const errorMessages = {
  en: { TASK_NOT_FOUND: 'Task not found' },
  es: { TASK_NOT_FOUND: 'Tarea no encontrada' },
};

const message = errorMessages[lang][errorCode] || error.message;
```

**Best practice:**
- **For MVP:** Don't internationalize yet
- **For production:** Use i18next if multiple languages needed
- **Start simple:** Add i18n when you have 2+ languages
- **Consider:** User preference, browser language, URL parameter

---

## Testing & Debugging

**Q55:** The project has test files for both frontend and backend. Looking at the test structure, what testing strategies are being used? Unit tests, integration tests, or both?

**A55:** 

**Backend tests:**
- **Unit tests:** `authController.test.js`, `taskController.test.js`, `auth.middleware.test.js` - Test individual functions/middleware in isolation
- **Integration tests:** `authRoutes.integration.test.js`, `taskRoutes.integration.test.js` - Test full request/response cycle with routes

**Frontend tests:**
- **Component tests:** `SignIn.test.jsx`, `SignUp.test.jsx`, `TaskCard.test.jsx`, etc. - Test React components in isolation
- **Unit tests:** `validationSchemas.test.js` - Test utility functions

**Testing strategies:**
1. **Unit testing:** Individual functions/components
2. **Integration testing:** API endpoints, component interactions
3. **Coverage:** 70% threshold for branches, functions, lines, statements

**Missing test types:**
- **E2E tests:** Full user flows (Cypress, Playwright)
- **Performance tests:** Load testing, stress testing
- **Security tests:** Penetration testing, vulnerability scanning

**Q56:** How would you test the `authenticate` middleware? What edge cases would you cover? How would you mock JWT verification?

**A56:** 

**Test structure:**
```js
// __tests__/auth.middleware.test.js
import { authenticate } from '../middlewares/auth';
import { verifyToken } from '../utils/jwt';

jest.mock('../utils/jwt');

describe('authenticate middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() when token is valid', () => {
    req.headers.authorization = 'Bearer valid-token';
    verifyToken.mockReturnValue({ userId: '123' });

    authenticate(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(req.userId).toBe('123');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 when no token provided', () => {
    req.headers.authorization = undefined;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('No token provided'),
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token format is invalid', () => {
    req.headers.authorization = 'InvalidFormat token';

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is expired', () => {
    req.headers.authorization = 'Bearer expired-token';
    verifyToken.mockImplementation(() => {
      throw new Error('Token expired');
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token expired',
    });
  });

  it('should handle missing authorization header', () => {
    delete req.headers.authorization;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should extract token correctly from Bearer format', () => {
    req.headers.authorization = 'Bearer my-token-123';
    verifyToken.mockReturnValue({ userId: '123' });

    authenticate(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('my-token-123');
  });
});
```

**Edge cases covered:**
- No authorization header
- Invalid format (not "Bearer ...")
- Expired token
- Invalid token
- Malformed token
- Missing token value after "Bearer "
- Network errors during verification

**Q57:** For the `TaskCard` component, what would you test? How would you test user interactions like clicking edit or delete buttons?

**A57:** 

**What to test:**
1. **Rendering:** Component renders with correct props
2. **Display:** Shows task title, description, status correctly
3. **Conditional rendering:** Different views (grid/list), completed state
4. **User interactions:** Click handlers called with correct data
5. **Accessibility:** ARIA labels, keyboard navigation

**Test implementation:**
```jsx
// __tests__/TaskCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByLabelText(/edit/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('displays completed state correctly', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    
    render(
      <TaskCard
        task={completedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through');
  });

  it('renders grid view by default', () => {
    const { container } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(container.firstChild).toHaveClass('rounded-2xl'); // Grid styling
  });

  it('renders list view when specified', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        viewMode="list"
      />
    );

    expect(container.firstChild).toHaveClass('rounded-xl'); // List styling
  });
});
```

**Testing interactions:**
- Use `fireEvent` or `userEvent` from `@testing-library/user-event`
- Verify callbacks called with correct arguments
- Test keyboard interactions
- Test accessibility features

**Q58:** If a test is failing intermittently, what are common causes? How would you debug flaky tests?

**A58:** 

**Common causes:**

1. **Timing issues:**
   - Async operations not awaited
   - Race conditions
   - Timeout too short

2. **Shared state:**
   - Tests modifying global state
   - Database not cleaned between tests
   - Cache not cleared

3. **Random data:**
   - Tests using random values
   - Dates/timestamps
   - IDs generated randomly

4. **External dependencies:**
   - Network requests
   - File system operations
   - Environment variables

5. **Test isolation:**
   - Tests running in wrong order
   - Side effects from previous tests

**Debugging strategies:**

1. **Run tests in isolation:**
```bash
jest --runInBand  # Run serially, not in parallel
```

2. **Add logging:**
```js
test('flaky test', async () => {
  console.log('Starting test', Date.now());
  // ... test code
  console.log('Test completed', Date.now());
});
```

3. **Use `waitFor`:**
```js
await waitFor(() => {
  expect(screen.getByText('Expected')).toBeInTheDocument();
}, { timeout: 5000 });
```

4. **Mock external dependencies:**
```js
jest.mock('../utils/api');
```

5. **Clean up between tests:**
```js
beforeEach(() => {
  jest.clearAllMocks();
  // Reset database
  // Clear cache
});
```

6. **Fix test order dependency:**
```js
// Use .only to isolate
test.only('specific test', () => { ... });
```

7. **Increase timeouts:**
```js
jest.setTimeout(10000); // 10 seconds
```

**Best practices:**
- Always clean up after tests
- Use `beforeEach`/`afterEach` for setup/teardown
- Mock external dependencies
- Use deterministic data
- Run tests multiple times to identify flakiness

**Q59:** The coverage threshold is set to 70%. Is this sufficient? What areas of the codebase are most critical to test?

**A59:** 

**Is 70% sufficient?**
- **For MVP/learning:** Yes, reasonable starting point
- **For production:** Depends on application criticality
- **Industry standard:** 70-80% is common
- **100% coverage:** Often not worth the effort (diminishing returns)

**Critical areas to test (priority order):**

1. **Authentication & Authorization (100% coverage):**
   - Login/register flows
   - Token validation
   - Permission checks
   - Security-critical code

2. **Business logic (80%+ coverage):**
   - Task CRUD operations
   - Data validation
   - State management
   - Error handling

3. **API endpoints (80%+ coverage):**
   - Request/response handling
   - Error cases
   - Edge cases
   - Input validation

4. **User-facing features (70%+ coverage):**
   - Forms and validation
   - User interactions
   - Navigation
   - UI components

5. **Utilities (60%+ coverage):**
   - Helper functions
   - Formatters
   - Validators

**What NOT to test extensively:**
- Third-party library code
- Simple getters/setters
- Trivial utility functions
- Generated code

**Coverage goals by file type:**
- **Controllers:** 90%+ (business logic)
- **Middleware:** 90%+ (security)
- **Components:** 70%+ (UI)
- **Utils:** 80%+ (reusable logic)
- **Services:** 80%+ (API calls)

**Best practice:** Focus on **quality over quantity**. 70% well-tested code is better than 90% poorly tested code.

---

## Architecture & Design Decisions

**Q60:** Why did you choose a monorepo structure (frontend and backend in the same repository)? What are the alternatives, and when would you choose them?

**A60:** 

**Monorepo benefits:**
- **Code sharing:** Easy to share types, utilities, validation schemas
- **Atomic commits:** Frontend and backend changes in single commit
- **Simpler development:** One clone, one setup
- **Consistent tooling:** Same linting, formatting across codebase
- **Easier refactoring:** Change API and frontend together

**Alternatives:**

1. **Separate repositories (Polyrepo):**
   - **When:** Different teams, independent deployments, different release cycles
   - **Pros:** Clear boundaries, independent versioning, team autonomy
   - **Cons:** Harder to share code, version sync issues

2. **Monorepo with tools (Nx, Turborepo, Lerna):**
   - **When:** Large codebase, multiple packages, need build optimization
   - **Pros:** Better tooling, dependency management, caching
   - **Cons:** More setup complexity

**For this project:** Monorepo is appropriate - small team, shared code, simpler setup.

**Q61:** The backend serves the frontend build in production (line 42-47 in `index.js`). What are the pros and cons of this approach vs. deploying them separately?

**A61:** 

**Current approach (Backend serves frontend):**
```js
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
```

**Pros:**
- **Simple deployment:** One server, one deployment
- **No CORS issues:** Same origin
- **Easier development:** Single process
- **Cost effective:** One server instance

**Cons:**
- **Tight coupling:** Frontend and backend must deploy together
- **Scaling limitations:** Can't scale frontend/backend independently
- **CDN limitations:** Can't use CDN for static assets
- **Cache invalidation:** Harder to cache frontend separately

**Separate deployment:**
- **Frontend:** Deploy to Vercel, Netlify, S3+CloudFront
- **Backend:** Deploy to Heroku, AWS, Railway

**Pros:**
- **Independent scaling:** Scale each service separately
- **CDN benefits:** Fast global delivery
- **Independent deployments:** Deploy frontend without backend
- **Better caching:** Cache static assets aggressively

**Cons:**
- **CORS configuration:** Must configure CORS properly
- **More complex:** Multiple deployments, environments
- **Higher cost:** Potentially multiple services

**Best practice:** Start with combined (current), separate when you need independent scaling.

**Q62:** You're using ES6 modules (`import/export`) instead of CommonJS (`require/module.exports`). What are the benefits? What configuration was needed to support this?

**A62:** 

**ES6 modules benefits:**
- **Static analysis:** Tools can analyze imports at build time
- **Tree shaking:** Unused code eliminated
- **Better performance:** Faster parsing
- **Async loading:** Native support for dynamic imports
- **Standard:** ECMAScript standard, not Node.js specific

**Configuration needed:**

**Backend (Node.js):**
```json
// package.json
{
  "type": "module"  // Enables ES modules
}
```

**Or use .mjs extension:**
```js
// index.mjs instead of index.js
```

**Frontend (Vite):**
- Vite supports ES modules natively
- No configuration needed

**CommonJS example:**
```js
// CommonJS
const express = require('express');
module.exports = app;
```

**ES6 modules:**
```js
// ES6
import express from 'express';
export default app;
```

**Migration considerations:**
- `__dirname` not available (use `import.meta.url`)
- `require()` doesn't work (use `import()`)
- Some packages may not support ES modules

**Q63:** The project uses Vite for frontend build tooling. Why Vite over Create React App or Webpack? What are the performance benefits?

**A63:** 

**Vite advantages:**

1. **Development server speed:**
   - **CRA/Webpack:** Bundles entire app on startup (slow)
   - **Vite:** Serves source files directly, bundles on-demand (instant)

2. **Hot Module Replacement (HMR):**
   - **CRA:** Full page reload or slow HMR
   - **Vite:** Instant HMR, only updates changed modules

3. **Build performance:**
   - **CRA:** Uses Webpack (slower)
   - **Vite:** Uses Rollup (faster, better tree-shaking)

4. **Modern tooling:**
   - Native ES modules
   - Better TypeScript support
   - Modern JavaScript features

**Performance comparison:**
- **Dev server startup:** Vite ~100ms vs CRA ~10-30s
- **HMR:** Vite ~50ms vs CRA ~1-5s
- **Build time:** Vite ~30s vs CRA ~60-120s (for large apps)

**When to use each:**
- **Vite:** New projects, modern tooling, performance critical
- **CRA:** Legacy projects, established ecosystem
- **Webpack:** Complex custom configurations

**For this project:** Vite is excellent choice - fast development, modern tooling.

**Q64:** Redux is used for state management. When would you choose Redux over React Context API? For this application, could Context API have been sufficient?

**A64:** 

**Redux vs Context API:**

**Redux advantages:**
- **DevTools:** Excellent debugging
- **Time-travel debugging:** See state changes over time
- **Middleware:** Redux middleware ecosystem
- **Predictable updates:** Strict update patterns
- **Performance:** Optimized re-renders with selectors

**Context API advantages:**
- **Built-in:** No extra dependencies
- **Simpler:** Less boilerplate
- **Sufficient for:** Simple state, theme, user preferences

**When to use Redux:**
- Complex state logic
- Large applications
- Need time-travel debugging
- Multiple components need same state
- Need middleware (logging, async, etc.)

**When Context API is sufficient:**
- Simple state (theme, user, language)
- Small applications
- State doesn't change frequently
- Few components need state

**For this application:**
- **Current state:** Tasks, user, loading, errors
- **Complexity:** Moderate (async operations, optimistic updates)
- **Redux justified:** Yes, for DevTools, middleware, async handling
- **Context could work:** Yes, but Redux provides better developer experience

**Hybrid approach:**
- **Redux:** Global app state (tasks, user)
- **Context:** UI state (modals, theme)

---

## Problem-Solving Scenarios

**Q65:** A user reports that tasks are not appearing after creation, but the API returns success. Walk me through your debugging process. What would you check first?

**A65:** 

**Debugging process:**

1. **Check browser console:**
   - Look for JavaScript errors
   - Check network tab for API response
   - Verify response contains task data

2. **Check Redux state:**
   - Open Redux DevTools
   - Verify `addTask.fulfilled` action fired
   - Check if task added to state
   - Look for errors in state

3. **Check component rendering:**
   - Verify `filteredTasks` includes new task
   - Check if filter excludes the task
   - Verify component re-renders after state update

4. **Check API response:**
   - Verify response structure matches expected format
   - Check if task data is complete
   - Verify task has required fields (id, title, etc.)

5. **Check Redux reducer:**
   - Verify `addTask.fulfilled` reducer logic
   - Check if `unshift` is working correctly
   - Look for state mutations

**Most likely causes:**
- Redux state not updating (reducer issue)
- Filter excluding new task
- Component not re-rendering
- API response format mismatch

**First check:** Redux DevTools to see if action dispatched and state updated.

**Q66:** The application is slow when a user has 1000+ tasks. How would you optimize this? Consider both frontend rendering and backend queries.

**A66:** 

**Frontend optimizations:**

1. **Virtual scrolling:**
```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: tasks.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 200,
});

// Only render visible items
{virtualizer.getVirtualItems().map(virtualRow => (
  <TaskCard key={virtualRow.key} task={tasks[virtualRow.index]} />
))}
```

2. **Pagination:**
   - Load tasks in pages (20-50 per page)
   - Implement infinite scroll or "Load More"

3. **Memoization:**
```jsx
const TaskCard = React.memo(({ task, onEdit, onDelete }) => {
  // Component only re-renders if props change
});

const filteredTasks = useMemo(() => {
  return tasks.filter(task => task.status === filter);
}, [tasks, filter]);
```

4. **Code splitting:**
   - Lazy load Dashboard component
   - Split task list into separate chunk

**Backend optimizations:**

1. **Pagination:**
```js
const tasks = await prisma.task.findMany({
  where: { userId },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});
```

2. **Indexing:**
```prisma
@@index([userId, createdAt]) // Composite index
```

3. **Select only needed fields:**
```js
select: {
  id: true,
  title: true,
  status: true,
  // Don't fetch description if not needed
}
```

4. **Caching:**
```js
// Redis cache
const cacheKey = `tasks:${userId}:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

**Combined approach:** Pagination + virtual scrolling + caching = best performance.

**Q67:** You need to add a "due date" feature. Walk me through the changes needed:
   - Database schema changes
   - Backend API changes
   - Frontend form changes
   - State management updates

**A67:** 

**1. Database schema:**
```prisma
model Task {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  status      String   @default("pending")
  dueDate     DateTime? // Add this
  userId      String   @db.ObjectId
  // ...
}
```

Run: `npx prisma db push`

**2. Backend validation:**
```js
// utils/validation.js
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['pending', 'completed']).default('pending'),
  dueDate: z.date().optional().nullable(), // Add this
});
```

**3. Backend controller:**
```js
export const createTask = async (req, res, next) => {
  const { title, description, status, dueDate } = req.body;
  
  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      status: status || 'pending',
      dueDate: dueDate ? new Date(dueDate) : null, // Add this
      userId,
    },
  });
  
  res.status(201).json({ success: true, data: task });
};
```

**4. Frontend validation:**
```js
// utils/validationSchemas.js
export const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['pending', 'completed']).default('pending'),
  dueDate: z.date().optional().nullable(), // Add this
});
```

**5. Frontend form:**
```jsx
// TaskModal.jsx
<input
  type="date"
  {...register('dueDate')}
  className="..."
/>
{errors.dueDate && (
  <p className="text-red-600">{errors.dueDate.message}</p>
)}
```

**6. State management:** No changes needed - Redux will automatically handle the new field.

**7. Display:**
```jsx
// TaskCard.jsx (already has dueDate display logic)
{task.dueDate && (
  <div className="flex items-center gap-2">
    <Calendar className="w-4 h-4" />
    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
  </div>
)}
```

**Q68:** Users are complaining about losing their work when the page refreshes. How would you implement auto-save functionality for task edits?

**A68:** 

**Implementation:**

**1. Save to localStorage on change:**
```jsx
// TaskModal.jsx
const { watch } = useForm();

useEffect(() => {
  const subscription = watch((value) => {
    // Debounce saves
    const timer = setTimeout(() => {
      localStorage.setItem(
        `task-draft-${task?.id || 'new'}`,
        JSON.stringify(value)
      );
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timer);
  });

  return () => subscription.unsubscribe();
}, [watch, task?.id]);
```

**2. Restore on mount:**
```jsx
useEffect(() => {
  const draft = localStorage.getItem(`task-draft-${task?.id || 'new'}`);
  if (draft) {
    const shouldRestore = window.confirm('Restore unsaved changes?');
    if (shouldRestore) {
      reset(JSON.parse(draft));
    }
  }
}, []);
```

**3. Clear on successful save:**
```jsx
const onSubmit = async (data) => {
  try {
    await dispatch(addTask(data)).unwrap();
    localStorage.removeItem('task-draft-new'); // Clear draft
    onSuccess();
  } catch (error) {
    // Keep draft on error
  }
};
```

**4. Backend auto-save endpoint (optional):**
```js
// Save draft to database
router.post('/tasks/draft', authenticate, async (req, res) => {
  await prisma.taskDraft.upsert({
    where: { userId: req.userId },
    update: { data: req.body },
    create: { userId: req.userId, data: req.body },
  });
  res.json({ success: true });
});
```

**5. Warning on navigation:**
```jsx
useEffect(() => {
  const handleBeforeUnload = (e) => {
    const hasDraft = localStorage.getItem('task-draft-new');
    if (hasDraft) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);
```

**Q69:** You need to add real-time collaboration where multiple users can see each other's tasks updating. What technologies would you use? How would you modify the architecture?

**A69:** 

**Technology options:**

1. **WebSockets (Socket.io):**
   - Most popular
   - Real-time bidirectional communication
   - Fallback to polling

2. **Server-Sent Events (SSE):**
   - Simpler, one-way (server to client)
   - Good for notifications

3. **WebRTC:**
   - Peer-to-peer
   - Overkill for this use case

**Architecture with Socket.io:**

**Backend:**
```js
// Install: npm install socket.io
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: '*' },
});

io.use((socket, next) => {
  // Authenticate socket connection
  const token = socket.handshake.auth.token;
  const decoded = verifyToken(token);
  socket.userId = decoded.userId;
  next();
});

io.on('connection', (socket) => {
  socket.on('task:create', async (taskData) => {
    const task = await createTask(taskData, socket.userId);
    // Broadcast to all connected clients
    io.emit('task:created', task);
  });

  socket.on('task:update', async (taskId, updates) => {
    const task = await updateTask(taskId, updates, socket.userId);
    io.emit('task:updated', task);
  });
});
```

**Frontend:**
```jsx
// hooks/useSocket.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('task:created', (task) => {
      dispatch(addTask(task));
    });

    socket.on('task:updated', (task) => {
      dispatch(editTask({ taskId: task.id, taskData: task }));
    });

    return () => socket.disconnect();
  }, []);
};

// In Dashboard
useSocket();
```

**Database changes:**
- Add `lastModifiedBy` field to track who made changes
- Consider operational transform for conflict resolution

**Q70:** The application needs to support offline mode. Users should be able to create tasks offline and sync when online. How would you implement this?

**A70:** 

**Implementation with Service Workers + IndexedDB:**

**1. Service Worker setup:**
```js
// public/sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/tasks')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return cached data if offline
        return caches.match(event.request);
      })
    );
  }
});
```

**2. IndexedDB for offline storage:**
```js
// utils/offlineDB.js
import { openDB } from 'idb';

const db = await openDB('tasks-db', 1, {
  upgrade(db) {
    db.createObjectStore('tasks', { keyPath: 'id' });
    db.createObjectStore('pending', { keyPath: 'id' });
  },
});

// Save task offline
export const saveTaskOffline = async (task) => {
  await db.put('tasks', task);
  await db.put('pending', { ...task, syncStatus: 'pending' });
};

// Sync when online
export const syncPendingTasks = async () => {
  const pending = await db.getAll('pending');
  
  for (const task of pending) {
    try {
      await api.post('/tasks', task);
      await db.delete('pending', task.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};
```

**3. Redux middleware for offline:**
```js
// middleware/offlineMiddleware.js
const offlineMiddleware = (store) => (next) => (action) => {
  if (action.type === 'task/addTask/pending') {
    // Check if online
    if (!navigator.onLine) {
      // Save to IndexedDB
      saveTaskOffline(action.meta.arg);
      // Update Redux optimistically
      return next({ ...action, type: 'task/addTask/fulfilled', payload: action.meta.arg });
    }
  }
  
  return next(action);
};
```

**4. Online/offline detection:**
```jsx
useEffect(() => {
  const handleOnline = () => {
    syncPendingTasks();
    dispatch(fetchTasks()); // Refresh from server
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

**5. UI indicators:**
```jsx
{!navigator.onLine && (
  <div className="bg-yellow-100 p-2">
    You're offline. Changes will sync when online.
  </div>
)}
```

**Q71:** You discover that the JWT token doesn't expire (or expires too late). How would you implement token refresh without forcing users to log in again?

**A71:** 

**Token refresh strategy:**

**1. Backend refresh endpoint:**
```js
// routes/authRoutes.js
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // httpOnly cookie
  
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = generateToken(decoded.userId);
    
    res.json({
      success: true,
      data: { token: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});
```

**2. Frontend refresh logic:**
```js
// utils/api.js
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data.data;
        
        localStorage.setItem('token', token);
        processQueue(null, token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

**3. Proactive refresh:**
```jsx
// Check token expiration and refresh before it expires
useEffect(() => {
  const checkAndRefresh = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token);
      const expiresIn = decoded.exp - Date.now() / 1000;
      
      // Refresh if expires in less than 5 minutes
      if (expiresIn < 300 && expiresIn > 0) {
        try {
          const response = await api.post('/auth/refresh');
          localStorage.setItem('token', response.data.data.token);
        } catch (error) {
          // Refresh failed, will be handled by interceptor
        }
      }
    }
  };

  checkAndRefresh();
  const interval = setInterval(checkAndRefresh, 60000); // Check every minute
  return () => clearInterval(interval);
}, []);
```

**Q72:** A user reports they can see another user's tasks. What could cause this? How would you verify and fix this security issue?

**A72:** 

**Possible causes:**

1. **Missing userId filter in query:**
```js
// BUG: Missing userId filter
const tasks = await prisma.task.findMany({
  // Should be: where: { userId }
});
```

2. **Token verification bypass:**
```js
// BUG: Not checking userId from token
const userId = req.body.userId; // Should use req.userId from middleware
```

3. **Race condition:**
```js
// BUG: userId not set before query
const tasks = await prisma.task.findMany({
  where: { userId: req.userId }, // req.userId might be undefined
});
```

**Verification process:**

1. **Check backend logs:**
```js
console.log('User ID from token:', req.userId);
console.log('Tasks query:', { userId: req.userId });
```

2. **Test with different users:**
```bash
# User A token
curl -H "Authorization: Bearer tokenA" /api/tasks

# User B token  
curl -H "Authorization: Bearer tokenB" /api/tasks
```

3. **Check database directly:**
```js
// Verify tasks are properly isolated
const allTasks = await prisma.task.findMany();
console.log('All tasks:', allTasks.map(t => ({ id: t.id, userId: t.userId })));
```

4. **Review authentication middleware:**
```js
// Verify middleware sets req.userId correctly
export const authenticate = async (req, res, next) => {
  // ... token verification
  req.userId = decoded.userId; // Must be set
  console.log('Authenticated userId:', req.userId); // Debug log
  next();
};
```

**Fix:**
```js
// Ensure ALL task queries filter by userId
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: userId, // CRITICAL: Always filter by userId
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
```

**Prevention:**
- Add integration tests for authorization
- Code review checklist: "Does this query filter by userId?"
- Use middleware to verify ownership

**Q73:** The MongoDB connection is timing out in production. What could cause this? How would you implement connection pooling and retry logic?

**A73:** 

**Causes:**
- Too many connections
- Connection pool exhausted
- Network issues
- Database overload
- Long-running queries

**Connection pooling with Prisma:**
```js
// utils/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings
  __internal: {
    engine: {
      connection_limit: 10, // Max connections per instance
    },
  },
});

// Handle connection errors
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

export default prisma;
```

**Retry logic:**
```js
// utils/withRetry.js
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Check if it's a connection error
      if (error.code === 'P1001' || error.code === 'P1008') {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
};

// Usage
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await withRetry(async () => {
      return await prisma.task.findMany({ where: { userId: req.userId } });
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
```

**Connection monitoring:**
```js
// Monitor connection pool
setInterval(async () => {
  const metrics = await prisma.$metrics.json();
  console.log('Active connections:', metrics.connections.active);
  console.log('Idle connections:', metrics.connections.idle);
}, 60000);
```

**Database URL with connection options:**
```env
DATABASE_URL="mongodb://user:pass@host:27017/db?maxPoolSize=10&minPoolSize=2&maxIdleTimeMS=30000"
```

**Q74:** You need to add email notifications when tasks are due. How would you implement this without blocking the main request? What background job system would you use?

**A74:** 

**Background job options:**

1. **Bull (Redis-based):**
```bash
npm install bull
```

```js
// jobs/emailQueue.js
import Queue from 'bull';

const emailQueue = new Queue('email', {
  redis: { host: 'localhost', port: 6379 },
});

// Add job (non-blocking)
export const sendDueDateReminder = async (task, userEmail) => {
  await emailQueue.add('due-date-reminder', {
    taskId: task.id,
    userEmail,
    dueDate: task.dueDate,
  });
};

// Process jobs
emailQueue.process('due-date-reminder', async (job) => {
  const { userEmail, task } = job.data;
  await sendEmail(userEmail, `Task "${task.title}" is due soon!`);
});
```

2. **Node-cron (Simple scheduling):**
```bash
npm install node-cron
```

```js
// jobs/checkDueDates.js
import cron from 'node-cron';

cron.schedule('0 9 * * *', async () => {
  // Run daily at 9 AM
  const dueTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
        gte: new Date(),
      },
      status: 'pending',
    },
    include: { user: true },
  });

  for (const task of dueTasks) {
    await sendEmail(task.user.email, `Task due: ${task.title}`);
  }
});
```

3. **AWS SQS + Lambda:**
- More scalable
- Serverless
- Better for high volume

**Implementation:**
```js
// In task controller (non-blocking)
export const createTask = async (req, res, next) => {
  try {
    const task = await prisma.task.create({ ... });
    
    // Queue email job (non-blocking)
    if (task.dueDate) {
      emailQueue.add('check-due-date', {
        taskId: task.id,
        dueDate: task.dueDate,
      });
    }
    
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
```

**Best practice:** Use Bull for production - reliable, scalable, has retry logic.

**Q75:** The frontend build is 5MB. How would you optimize the bundle size? What tools would you use to analyze what's taking up space?

**A75:** 

**Analysis tools:**

1. **webpack-bundle-analyzer:**
```bash
npm install --save-dev webpack-bundle-analyzer
```

```js
// vite.config.js (or webpack config)
import { visualizer } from 'webpack-bundle-analyzer';

export default {
  plugins: [
    visualizer({ open: true, filename: 'bundle-analysis.html' }),
  ],
};
```

2. **Vite build analysis:**
```bash
npm run build -- --mode analyze
```

**Optimization strategies:**

1. **Code splitting:**
```jsx
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignIn = lazy(() => import('./pages/SignIn'));

// Lazy load heavy components
const TaskModal = lazy(() => import('./components/TaskModal'));
```

2. **Tree shaking:**
```js
// Import only what you need
import { format } from 'date-fns'; // Not: import * from 'date-fns'
```

3. **Remove unused dependencies:**
```bash
npm install depcheck
npx depcheck
```

4. **Optimize images:**
```bash
npm install vite-plugin-imagemin
```

5. **Compress with gzip/brotli:**
```js
// Server compression
import compression from 'compression';
app.use(compression());
```

6. **Externalize large libraries:**
```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
};
```

**Expected results:**
- Initial bundle: 5MB → 1-2MB
- With code splitting: < 500KB per chunk
- With compression: < 300KB gzipped

**Checklist:**
- ✅ Analyze bundle
- ✅ Remove unused code
- ✅ Code split routes
- ✅ Lazy load components
- ✅ Optimize images
- ✅ Enable compression

---

## Bonus: System Design

**Q76:** If this application needed to scale to 1 million users, what architectural changes would you make? Consider database scaling, caching, load balancing, and CDN.

**A76:** 

**Architectural changes:**

**1. Database scaling:**
- **MongoDB Atlas:** Managed MongoDB with auto-scaling
- **Sharding:** Distribute data across multiple servers
- **Read replicas:** Separate read/write operations
- **Connection pooling:** Optimize database connections

**2. Caching:**
```js
// Redis for caching
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache task lists
export const getTasks = async (req, res, next) => {
  const cacheKey = `tasks:${req.userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached) });
  }
  
  const tasks = await prisma.task.findMany({ where: { userId: req.userId } });
  await redis.setex(cacheKey, 300, JSON.stringify(tasks)); // 5 min cache
  
  res.json({ success: true, data: tasks });
};
```

**3. Load balancing:**
- **Multiple server instances:** 3-5 Node.js instances
- **Load balancer:** AWS ALB, Nginx, or HAProxy
- **Session management:** Stateless (JWT) or Redis sessions
- **Health checks:** Monitor instance health

**4. CDN:**
- **Static assets:** Serve from CloudFront, Cloudflare
- **API caching:** Cache GET requests at CDN level
- **Geographic distribution:** Reduce latency globally

**5. Microservices (if needed):**
- **Auth service:** Separate authentication
- **Task service:** Task management
- **Notification service:** Email/push notifications
- **API Gateway:** Route requests to services

**6. Monitoring:**
- **APM:** New Relic, Datadog
- **Logging:** ELK stack, CloudWatch
- **Metrics:** Prometheus, Grafana
- **Alerting:** PagerDuty, Opsgenie

**7. Database optimization:**
- **Indexes:** All frequently queried fields
- **Query optimization:** Use `explain()` to analyze
- **Pagination:** Always paginate large datasets
- **Archiving:** Move old tasks to cold storage

**Architecture diagram:**
```
Users → CDN → Load Balancer → [App Server 1, 2, 3] → Redis Cache → MongoDB Cluster
                                                      ↓
                                              Background Jobs (Bull)
```

**Q77:** How would you implement analytics to track user behavior? What events would you track? How would you ensure this doesn't impact performance?

**A77:** 

**Events to track:**
- Task created, updated, deleted
- User login, logout, registration
- Page views, time on page
- Feature usage (filters, search, etc.)
- Errors and exceptions

**Implementation:**

**1. Client-side tracking (non-blocking):**
```js
// utils/analytics.js
class Analytics {
  constructor() {
    this.queue = [];
    this.flushInterval = 5000; // Flush every 5 seconds
    this.startFlush();
  }

  track(event, properties = {}) {
    this.queue.push({
      event,
      properties,
      timestamp: Date.now(),
      userId: this.getUserId(),
    });
  }

  async flush() {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    // Send asynchronously (non-blocking)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    }).catch(() => {
      // Retry on failure
      this.queue.push(...events);
    });
  }

  startFlush() {
    setInterval(() => this.flush(), this.flushInterval);
    // Also flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }
}

export const analytics = new Analytics();
```

**2. Backend endpoint:**
```js
// routes/analyticsRoutes.js
router.post('/analytics', async (req, res) => {
  const { events } = req.body;
  
  // Process asynchronously (don't block response)
  setImmediate(async () => {
    await Promise.all(events.map(event => {
      // Store in database or send to analytics service
      return prisma.analyticsEvent.create({
        data: {
          event: event.event,
          properties: event.properties,
          userId: event.userId,
          timestamp: new Date(event.timestamp),
        },
      });
    }));
  });
  
  res.json({ success: true });
});
```

**3. Third-party integration (optional):**
```js
// Use service like Segment, Mixpanel, Amplitude
import { Analytics } from '@segment/analytics-node';

const analytics = new Analytics({ writeKey: process.env.SEGMENT_KEY });

analytics.track({
  userId: user.id,
  event: 'Task Created',
  properties: { taskId: task.id },
});
```

**Performance optimizations:**
- **Batch events:** Send multiple events together
- **Async processing:** Don't block main thread
- **Queue locally:** Buffer events, send in batches
- **Debounce:** Limit event frequency
- **Sample:** Only track percentage of users (1% sampling)

**Privacy considerations:**
- **GDPR compliance:** Get user consent
- **PII:** Don't track sensitive data
- **Opt-out:** Allow users to disable tracking

**Q78:** You need to add role-based access control (admin, user, guest). How would you modify the authentication system? What database changes would be needed?

**A78:** 

**Database changes:**
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  username  String   @unique
  password  String
  role      String   @default("user") // Add: "admin", "user", "guest"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}

enum Role {
  ADMIN
  USER
  GUEST
}
```

**Backend middleware:**
```js
// middlewares/authorize.js
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

// Usage
router.get('/admin/stats', authenticate, authorize('admin'), getStats);
router.delete('/tasks/:id', authenticate, authorize('admin', 'user'), deleteTask);
```

**JWT payload:**
```js
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, // Include role in token
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};
```

**Frontend:**
```jsx
// hooks/useAuth.js
export const useAuth = () => {
  const { currentUser } = useSelector(state => state.user);
  
  return {
    isAdmin: currentUser?.role === 'admin',
    isUser: currentUser?.role === 'user',
    isGuest: currentUser?.role === 'guest',
    canEdit: currentUser?.role !== 'guest',
  };
};

// Usage
const { isAdmin } = useAuth();
{isAdmin && <AdminPanel />}
```

**Protected routes:**
```jsx
// components/AdminRoute.jsx
export default function AdminRoute({ children }) {
  const { currentUser } = useSelector(state => state.user);
  
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}
```

**Q79:** The application needs to support multiple languages. How would you implement internationalization (i18n)? What libraries would you use?

**A79:** 

**Library: react-i18next (most popular)**

**Setup:**
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

**Configuration:**
```js
// i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          taskTitle: 'Task Title',
          createTask: 'Create Task',
          errors: {
            taskNotFound: 'Task not found',
            accessDenied: 'Access denied',
          },
        },
      },
      es: {
        translation: {
          welcome: 'Bienvenido',
          taskTitle: 'Título de la tarea',
          createTask: 'Crear tarea',
          errors: {
            taskNotFound: 'Tarea no encontrada',
            accessDenied: 'Acceso denegado',
          },
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

**Usage in components:**
```jsx
import { useTranslation } from 'react-i18next';

function TaskCard({ task }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{t('status')}: {t(`status.${task.status}`)}</p>
      <button>{t('buttons.edit')}</button>
    </div>
  );
}
```

**Backend i18n:**
```js
// utils/i18n.js
const translations = {
  en: {
    taskNotFound: 'Task not found',
    accessDenied: 'Access denied',
  },
  es: {
    taskNotFound: 'Tarea no encontrada',
    accessDenied: 'Acceso denegado',
  },
};

export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

// In controller
const lang = req.headers['accept-language']?.split(',')[0] || 'en';
res.json({ message: t('taskNotFound', lang) });
```

**Language switcher:**
```jsx
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };
  
  return (
    <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Best practices:**
- Store translations in JSON files
- Use namespaces for organization
- Pluralization support
- Date/number formatting
- RTL language support (if needed)

**Q80:** You're asked to add a mobile app. Would you build native apps or use React Native? How would you share code between web and mobile?

**A80:** 

**React Native vs Native:**

**React Native advantages:**
- **Code sharing:** Share business logic, Redux, API calls
- **Faster development:** One codebase for iOS and Android
- **Familiar:** Uses React (same as web)
- **Hot reload:** Fast development iteration

**Native advantages:**
- **Performance:** Better for complex animations
- **Platform features:** Full access to native APIs
- **Platform-specific UX:** Native look and feel

**Recommendation:** React Native for this app - can share significant code.

**Code sharing strategy:**

**1. Shared business logic:**
```
project/
├── packages/
│   ├── shared/
│   │   ├── api/          # API calls
│   │   ├── redux/        # Redux slices
│   │   ├── utils/        # Utilities
│   │   └── validation/   # Validation schemas
│   ├── web/              # React web app
│   └── mobile/           # React Native app
```

**2. Shared API layer:**
```js
// packages/shared/api/taskService.js
export const getTasks = async () => {
  return api.get('/tasks');
};

// Both web and mobile use this
```

**3. Shared Redux:**
```js
// packages/shared/redux/task/taskSlice.js
// Same Redux slice for web and mobile
```

**4. Platform-specific UI:**
```jsx
// Web: packages/web/components/TaskCard.jsx
// Mobile: packages/mobile/components/TaskCard.jsx
// Different UI, same data/logic
```

**React Native setup:**
```bash
npx react-native init TaskFlowMobile
```

**Monorepo structure:**
```json
// package.json (root)
{
  "workspaces": [
    "packages/*"
  ]
}
```

**Shared code example:**
```jsx
// packages/shared/hooks/useTasks.js
export const useTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks);
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  
  return { tasks };
};

// Web: packages/web/pages/Dashboard.jsx
import { useTasks } from '@shared/hooks/useTasks';

// Mobile: packages/mobile/screens/Dashboard.jsx
import { useTasks } from '@shared/hooks/useTasks';
```

**Platform detection:**
```js
import { Platform } from 'react-native';

const styles = Platform.select({
  ios: { padding: 20 },
  android: { padding: 10 },
  web: { padding: 15 },
});
```

**Best practice:**
- **Share:** Business logic, API calls, Redux, utilities
- **Separate:** UI components, navigation, platform-specific features
- **Use:** Monorepo with workspaces for code sharing

---

## Evaluation Criteria

When evaluating answers, consider:

1. **Technical Accuracy**: Does the candidate understand the concepts?
2. **Problem-Solving Approach**: Can they think through problems systematically?
3. **Code Quality Awareness**: Do they understand best practices and trade-offs?
4. **Communication**: Can they explain complex concepts clearly?
5. **Practical Experience**: Can they relate theory to actual implementation?
6. **Security Awareness**: Do they consider security implications?
7. **Performance Thinking**: Do they consider optimization and scalability?

---

## Tips for Interviewers

- **Start with easier questions** to build confidence
- **Ask follow-up questions** based on their answers
- **Encourage them to think aloud** - the process matters more than the answer
- **Provide hints** if they're stuck, but let them work through it
- **Discuss trade-offs** - there's rarely one "correct" answer
- **Ask about alternatives** - "What if you used X instead of Y?"
- **Test debugging skills** - present a bug scenario and ask how they'd debug it
- **Evaluate learning ability** - can they understand new concepts quickly?

---

## Recommended Question Flow

### For Junior/Intern Candidates (30-45 min):
1. Q1, Q2, Q3 (React basics)
2. Q19, Q22 (Backend basics)
3. Q28 (Full-stack flow)
4. Q40, Q42 (Security basics)
5. Q65 (Debugging scenario)

### For Mid-Level Candidates (45-60 min):
1. Q9, Q10, Q11 (State management)
2. Q22, Q23, Q24 (Backend logic)
3. Q33, Q34, Q35 (Database)
4. Q50, Q51 (Code quality)
5. Q66, Q67 (Problem-solving)

### For Senior Candidates (60-90 min):
1. Q46, Q47, Q48 (Advanced state management)
2. Q60, Q61, Q62 (Architecture)
3. Q69, Q70 (Complex scenarios)
4. Q76, Q77 (System design)

---

*Good luck with your interviews!*


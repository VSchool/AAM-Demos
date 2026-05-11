---
title: "Three TypeScript Patterns I Use Every Day"
description: "Practical TypeScript patterns that reduce bugs without adding complexity."
pubDate: 2026-05-08
tags: ["typescript", "patterns"]
---

I've been writing TypeScript for about four years now. In that time I've gone from "TypeScript is just JavaScript with extra steps" to "I won't start a project without it." These three patterns are the ones I reach for most often.

## 1. Discriminated unions for state

Instead of a single object with optional fields, model each state as its own type:

```typescript
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Post[] }
  | { status: 'error'; message: string };
```

Now TypeScript knows that `data` only exists when `status` is `'success'`. You can't accidentally read `data` during the loading state. The compiler catches the bug before your users do.

I use this pattern for every async operation: API calls, form submissions, file uploads. The `status` field acts as a discriminant — TypeScript narrows the type automatically inside `if` or `switch` blocks.

## 2. `satisfies` for config objects

The `satisfies` operator (TypeScript 4.9+) lets you validate a value against a type without widening it:

```typescript
type Route = {
  path: string;
  label: string;
  icon?: string;
};

const routes = {
  home:  { path: '/',      label: 'Home',  icon: 'house' },
  blog:  { path: '/blog',  label: 'Blog'  },
  about: { path: '/about', label: 'About', icon: 'user' },
} satisfies Record<string, Route>;
```

Without `satisfies`, you'd use `as const` and lose type checking, or use a type annotation and lose the literal types. `satisfies` gives you both: TypeScript validates the shape *and* preserves the exact keys and values.

I use this for route configs, theme tokens, feature flags — any config object where I want autocompletion on the keys.

## 3. Branded types for IDs

Primitive types are interchangeable. A `userId` and a `postId` are both strings, so TypeScript won't stop you from passing one where the other is expected:

```typescript
type UserId = string & { readonly __brand: 'UserId' };
type PostId = string & { readonly __brand: 'PostId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getPost(id: PostId): Post { /* ... */ }

const userId = createUserId('abc-123');
// getPost(userId); // Type error — can't pass UserId as PostId
```

The `__brand` property never exists at runtime. It's a compile-time tag that prevents mix-ups. This pattern has caught real bugs in every codebase where I've introduced it — especially in API layers where you're juggling multiple ID types.

## The common thread

All three patterns share the same idea: **make invalid states unrepresentable**. If bad data can't exist in your type system, it can't cause bugs at runtime. TypeScript's type system is expressive enough to encode most of your business rules — the trick is learning to use it that way.

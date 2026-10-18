"use client";

import { useActionState } from "react";
import { login, removeMember, type ActionState } from "./actions";

type Action = (state: ActionState, form: FormData) => Promise<ActionState>;

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="grid gap-4 max-w-sm">
      <div className="grid gap-1.5">
        <label htmlFor="admin-password" className="font-semibold">समिति पासवर्ड</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      {state?.error && <p role="alert" className="text-maroon font-semibold">{state.error}</p>}
      <button disabled={pending} className="btn btn-primary disabled:opacity-60">{pending ? "जाँच हो रही है…" : "लॉगिन करें"}</button>
    </form>
  );
}

// Wraps a server action form and shows its result inline.
export function ActionForm({
  action,
  children,
  className = "",
  hidden,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className} aria-busy={pending}>
      {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      {state?.error && <p role="alert" className="text-maroon font-semibold text-[0.95rem] w-full">{state.error}</p>}
      {state?.ok && <p role="status" className="text-leaf font-semibold text-[0.95rem] w-full">{state.ok}</p>}
    </form>
  );
}

export function DeleteMemberButton({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(removeMember, null);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`${name} को सदस्य सूची से हटाएँ?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button disabled={pending} className="text-maroon underline text-[0.9rem] disabled:opacity-50">
        {pending ? "हटा रहे हैं…" : "हटाएँ"}
      </button>
      {state?.error && <span role="alert" className="text-maroon text-[0.85rem] ml-2">{state.error}</span>}
    </form>
  );
}

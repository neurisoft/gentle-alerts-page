import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Mail, Monitor, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notification Settings — Coral" },
      {
        name: "description",
        content:
          "Choose which email and browser notifications you receive for referrals, messages, invoices and more.",
      },
      { property: "og:title", content: "Notification Settings — Coral" },
      {
        property: "og:description",
        content:
          "Choose which email and browser notifications you receive for referrals, messages, invoices and more.",
      },
    ],
  }),
  component: NotificationSettings,
});

type Channel = boolean | null;

type Item = { id: string; label: string; email: boolean; browser: Channel };

type Group = { title: string; items: Item[] };

const initialGroups: Group[] = [
  {
    title: "Referrals",
    items: [
      { id: "r1", label: "When someone assigns a referral to me", email: true, browser: true },
      { id: "r2", label: "New referral received", email: true, browser: true },
      { id: "r3", label: "Unread referral reminder", email: true, browser: null },
    ],
  },
  {
    title: "Messaging inside referral",
    items: [
      { id: "m1", label: "Messages & attachments from patient", email: true, browser: true },
      { id: "m2", label: "Messages & attachments from other organizations", email: true, browser: true },
      { id: "m3", label: "@ mentions", email: true, browser: true },
    ],
  },
  {
    title: "Mobile app requests",
    items: [
      { id: "a1", label: "Messages (including attachments)", email: true, browser: true },
      { id: "a2", label: "Urgent check-in request", email: false, browser: true },
    ],
  },
  {
    title: "Invoices & payments",
    items: [
      { id: "i1", label: "New invoice received", email: true, browser: true },
      { id: "i2", label: "Rejected invoices", email: true, browser: false },
      { id: "i3", label: "Payment sent to my bank account", email: true, browser: true },
    ],
  },
  {
    title: "Connections",
    items: [
      { id: "c1", label: "Connection request received", email: true, browser: true },
      { id: "c2", label: "Connection request accepted", email: false, browser: true },
    ],
  },
];

function NotificationSettings() {
  const [groups, setGroups] = useState(initialGroups);
  const [allEmail, setAllEmail] = useState(true);
  const [allBrowser, setAllBrowser] = useState(true);
  const [assignedOnly, setAssignedOnly] = useState(false);
  const [saved, setSaved] = useState(false);

  const setItem = (groupIdx: number, itemId: string, key: "email" | "browser", value: boolean) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi !== groupIdx
          ? g
          : {
              ...g,
              items: g.items.map((it) => (it.id === itemId ? { ...it, [key]: value } : it)),
            },
      ),
    );
  };

  const toggleAll = (key: "email" | "browser", value: boolean) => {
    if (key === "email") setAllEmail(value);
    else setAllBrowser(value);
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((it) =>
          key === "browser" && it.browser === null ? it : { ...it, [key]: value },
        ),
      })),
    );
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Bell className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Notification settings</h1>
              <p className="text-sm text-muted-foreground">
                Decide how and when we reach out to you.
              </p>
            </div>
          </div>
          <Button onClick={() => setSaved(true)}>
            {saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <div className="flex gap-3 rounded-xl border border-border bg-accent/40 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            Emails come from <span className="font-medium text-foreground">notifications@coral.io</span>.
            If you don't see them, check your spam folder. Browser notifications require permission
            in your browser settings.
          </p>
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Global controls
          </h2>
          <div className="mt-4 space-y-4">
            <ToggleRow
              icon={<Mail className="size-4" />}
              label="All email notifications"
              checked={allEmail}
              onChange={(v) => toggleAll("email", v)}
            />
            <Separator />
            <ToggleRow
              icon={<Monitor className="size-4" />}
              label="All browser notifications"
              checked={allBrowser}
              onChange={(v) => toggleAll("browser", v)}
            />
            <Separator />
            <ToggleRow
              label="Only notify me about referrals assigned to me"
              checked={assignedOnly}
              onChange={setAssignedOnly}
            />
          </div>
        </section>

        {groups.map((group, gi) => (
          <section key={group.title} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <div className="flex shrink-0 gap-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span className="w-12 text-center">Email</span>
                <span className="w-12 text-center">Browser</span>
              </div>
            </div>
            <ul className="divide-y divide-border">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex shrink-0 gap-6">
                    <div className="flex w-12 justify-center">
                      <Switch
                        checked={item.email}
                        onCheckedChange={(v) => setItem(gi, item.id, "email", v)}
                        aria-label={`Email notifications for ${item.label}`}
                      />
                    </div>
                    <div className="flex w-12 justify-center">
                      {item.browser === null ? (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      ) : (
                        <Switch
                          checked={item.browser}
                          onCheckedChange={(v) => setItem(gi, item.id, "browser", v)}
                          aria-label={`Browser notifications for ${item.label}`}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

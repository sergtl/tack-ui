"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useCreateIssue } from "@/lib/hooks/issues";
import { MarkdownEditor } from "./markdown-editor";

const schema = z.object({
  title: z.string().trim().min(1, "Enter an issue title."),
  description: z.string(),
});

export function CreateIssueDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-background p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">
            Create issue
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Add a title and describe what needs to be done.
          </Dialog.Description>
          <CreateIssueForm onCreated={() => setOpen(false)} />
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-4"
              aria-label="Close"
            >
              <XIcon />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CreateIssueForm({ onCreated }: { onCreated: () => void }) {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateIssue();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate(values, {
      onSuccess: ({ id }) => {
        onCreated();
        router.push(`/issues/${id}`);
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
      <Field>
        <FieldLabel htmlFor="issue-title">Title</FieldLabel>
        <Input
          id="issue-title"
          placeholder="Issue title"
          {...form.register("title")}
          aria-invalid={!!form.formState.errors.title}
          aria-describedby={
            form.formState.errors.title ? "issue-title-error" : undefined
          }
          disabled={isPending}
        />
        <FieldError
          id="issue-title-error"
          errors={[form.formState.errors.title]}
        />
      </Field>
      <Field>
        <span id="issue-description-label" className="text-sm font-medium">
          Description
        </span>
        <div
          role="group"
          aria-labelledby="issue-description-label"
          className="min-w-0 rounded-md border"
        >
          <MarkdownEditor
            markdown=""
            onChange={(value) =>
              form.setValue("description", value, { shouldDirty: true })
            }
            readOnly={isPending}
          />
        </div>
      </Field>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancel
          </Button>
        </Dialog.Close>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create issue"}
        </Button>
      </div>
    </form>
  );
}

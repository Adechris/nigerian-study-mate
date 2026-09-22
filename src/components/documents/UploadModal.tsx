import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { extractText } from "@/lib/pdf";
import { useApp } from "@/store/useApp";
import { EXAM_LEVELS, SUBJECTS, type Subject } from "@/types";

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function UploadModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded?: (id: string) => void;
}) {
  const addDoc = useApp((s) => s.addDoc);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState<Subject>("Biology");
  const [level, setLevel] = useState<string>("WAEC/NECO Candidate");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    if (!file) return toast.error("Choose a PDF or text file first.");
    setBusy(true);
    try {
      const { text, pages } = await extractText(file);
      if (text.length < 40) {
        toast.error("We couldn't read any text from that file. Try a text-based PDF.");
        setBusy(false);
        return;
      }
      const doc = addDoc({
        name: file.name,
        subject,
        examLevel: level,
        pages,
        sizeKb: Math.round(file.size / 1024),
        text,
      });
      toast.success(`${file.name} is ready to study 🎉`);
      setFile(null);
      onUploaded?.(doc.id);
      onClose();
    } catch {
      toast.error("Something went wrong reading that file. Please try another one.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            className="w-full max-w-lg rounded-t-3xl bg-card p-6 sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Upload study material</h2>
              <button onClick={onClose} aria-label="Close" className="text-muted-foreground">
                <X className="size-5" />
              </button>
            </div>

            <button
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary-soft px-6 py-10 text-center transition hover:border-primary"
            >
              <FileUp className="size-8 text-primary" />
              <p className="mt-3 text-sm font-semibold">
                {file ? file.name : "Click to choose a PDF or text file"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, TXT or Markdown · up to about 20MB
              </p>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,.md,application/pdf,text/plain"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Subject</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className={inputCls}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Exam level</span>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={inputCls}
                >
                  {EXAM_LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
            </div>

            <button
              onClick={submit}
              disabled={busy}
              className="gradient-primary mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground disabled:opacity-70"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {busy ? "Reading your document..." : "Upload & Start Studying"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

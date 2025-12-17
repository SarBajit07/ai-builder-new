export default function ChatPanel() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 text-lg font-semibold">
        AI Builder
      </div>

      <div className="flex-1 space-y-3 overflow-auto">
        <div className="max-w-[90%] rounded-lg bg-white/10 px-3 py-2 text-sm">
          make the color theme dark
        </div>
      </div>

      <div className="mt-4">
        <input
          placeholder="How can I help you?"
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

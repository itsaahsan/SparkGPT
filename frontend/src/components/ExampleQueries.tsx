interface Props {
  examples: string[];
  onSelect: (query: string) => void;
}

export default function ExampleQueries({ examples, onSelect }: Props) {
  if (examples.length === 0) return null;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="space-y-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => onSelect(ex)}
            className="w-full px-4 py-3 rounded-xl text-sm text-left transition-colors cursor-pointer"
            style={{ border: "1px solid #e5e5e5", color: "#0d0d0d", background: "#ffffff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

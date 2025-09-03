"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Suggestion = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchCommand({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (term: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 250);
  const [results, setResults] = React.useState<Suggestion[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    let ignore = false;
    async function fetchData() {
      if (!debounced || debounced.trim().length < 2) {
        setResults([]);
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`);
      if (!res.ok) return;
      const json = (await res.json()) as Suggestion[];
      if (!ignore) setResults(json.slice(0, 8));
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [debounced]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(query);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Busque por produtos..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleEnter}
      />
      <CommandList>
        <CommandEmpty>Digite para buscar…</CommandEmpty>

        {results.length > 0 && (
          <CommandGroup heading="Sugestões">
            {results.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => {
                  onOpenChange(false);
                  router.push(`/busca/${encodeURIComponent(query)}`);
                }}
              >
                {p.imageUrl ? (
                  <span className="relative mr-2 block h-6 w-6 overflow-hidden rounded">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="mr-2 inline-block h-6 w-6 rounded bg-slate-200" />
                )}
                <span className="truncate">{p.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup>
          <CommandItem
            disabled={!query.trim()}
            onSelect={() => onSubmit(query)}
          >
            Buscar por “{query}”
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

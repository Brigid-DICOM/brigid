"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ColorPickerLabels {
  title?: string;
  customColorHint?: string;
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;

  labels?: ColorPickerLabels;
  disabled?: boolean;
}

export const PRESET_COLORS = [
  "#E1593A", "#B8402A", "#FF8B62",
  "#49B56A", "#3A8F55", "#77D48E",
  "#E6B84A", "#C49633", "#F4D36D",
  "#C13F3A", "#9E2E2B", "#E35A55",
  "#C09355", "#4A7DD8",
  "#64748B", "#6B7280", "#374151", "#A5A5A5",
];

function ColorPicker({ value, onChange, className, labels, disabled }: ColorPickerProps) {
  const _labels = {
    title: "Custom Tag Color",
    customColorHint: "Or choose custom color",
    ...labels, // 覆蓋預設英文
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-sm font-medium">{_labels.title}</div>

      <div className="grid grid-cols-10 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={cn(
              "w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform",
              value === color
                ? "border-foreground ring-2 ring-ring ring-offset-1"
                : "border-muted-foreground/20"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
            disabled={disabled}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border cursor-pointer"
          disabled={disabled}
        />
        <span className="text-sm text-muted-foreground">
          {_labels.customColorHint}
        </span>
      </div>
    </div>
  );
}

export { ColorPicker };

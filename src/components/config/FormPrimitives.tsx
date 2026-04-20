/**
 * components/config/FormPrimitives.tsx
 * Reusable, styled form primitives for config panels.
 * Centralised here so all config forms look consistent.
 */

import React from 'react';

// ─── Wrapper ───────────────────────────────────────────────────────────────────

export const FormField: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-1">{children}</div>
);

// ─── Label ─────────────────────────────────────────────────────────────────────

export const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">
    {children}
  </label>
);

// ─── Input ─────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`
      w-full bg-slate-700/60 border border-slate-600/60 rounded-lg
      px-3 py-1.5 text-slate-200 text-xs placeholder-slate-500
      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
      transition-colors
      ${className}
    `}
  />
);

// ─── Textarea ──────────────────────────────────────────────────────────────────

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ className = '', ...props }) => (
  <textarea
    {...props}
    rows={3}
    className={`
      w-full bg-slate-700/60 border border-slate-600/60 rounded-lg
      px-3 py-1.5 text-slate-200 text-xs placeholder-slate-500 resize-none
      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
      transition-colors
      ${className}
    `}
  />
);

// ─── Select ────────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => (
  <select
    {...props}
    className={`
      w-full bg-slate-700/60 border border-slate-600/60 rounded-lg
      px-3 py-1.5 text-slate-200 text-xs
      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
      transition-colors cursor-pointer
      ${className}
    `}
  >
    {children}
  </select>
);

// ─── Toggle ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-slate-300 text-xs">{label}</span>
    <div
      onClick={() => onChange(!checked)}
      className={`
        relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0
        ${checked ? 'bg-indigo-500' : 'bg-slate-600'}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
          transition-transform duration-200
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `}
      />
    </div>
  </label>
);

// ─── Range Input ───────────────────────────────────────────────────────────────

interface RangeProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

export const RangeField: React.FC<RangeProps> = ({
  label, value, min = 0, max = 100, onChange
}) => (
  <FormField>
    <div className="flex items-center justify-between">
      <FormLabel>{label}</FormLabel>
      <span className="text-indigo-400 text-xs font-semibold">{value}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-indigo-500 cursor-pointer"
    />
  </FormField>
);

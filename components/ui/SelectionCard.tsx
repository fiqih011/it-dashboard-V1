"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import React from "react";

export type SelectionCardProps = {
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
};

export default function SelectionCard({
  title,
  subtitle,
  description,
  href,
  icon,
}: SelectionCardProps) {
  return (
    <div
      className={clsx(
        "group relative flex h-full flex-col rounded-xl",
        "bg-white border border-gray-200",
        "p-6 shadow-sm transition-all duration-200",
        "hover:border-gray-300 hover:shadow-md hover:bg-slate-50"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {icon && (
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              "bg-indigo-50 text-indigo-600",
              "transition-colors",
              "group-hover:bg-indigo-100"
            )}
          >
            {icon}
          </div>
        )}

        <div className="space-y-0.5">
          <h3 className="text-base font-semibold text-gray-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <Link
          href={href}
          className={clsx(
            "inline-flex items-center gap-2 text-sm font-medium",
            "text-indigo-600 hover:text-indigo-700",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          )}
        >
          View {title}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
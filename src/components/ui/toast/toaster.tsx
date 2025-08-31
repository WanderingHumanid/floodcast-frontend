"use client"

import * as React from "react"
import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"

export const Toaster = () => {
  const { toasts, dismiss } = useToast()

  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      {toasts.map(function ({ id, title, description, action }) {
        return (
          <div
            key={id}
            className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border bg-white p-6 pr-8 shadow-lg transition-all"
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && (
                <div className="text-sm opacity-90">{description}</div>
              )}
            </div>
            {action}
            <button
              type="button"
              aria-label="Close notification"
              onClick={() => dismiss(id)}
              className="absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

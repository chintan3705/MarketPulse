"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // Standard 5 seconds, or can be overridden by Toast component duration prop

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionTypeKeys = keyof typeof actionTypes;
type ActionTypeValues = (typeof actionTypes)[ActionTypeKeys];

let count = 0;

function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: ActionTypeValues; // More specific type
      toast: ToasterToast;
    }
  | {
      type: ActionTypeValues; // More specific type
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionTypeValues; // More specific type
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, removeDelay?: number) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const delay = removeDelay ?? TOAST_REMOVE_DELAY;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, delay);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast as ToasterToast, ...state.toasts].slice(
          0,
          TOAST_LIMIT,
        ),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === (action.toast as Partial<ToasterToast>).id
            ? { ...t, ...(action.toast as Partial<ToasterToast>) }
            : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action as {
        type: ActionTypeValues;
        toastId?: string;
      }; // Type assertion for toastId

      // If toastId is provided, remove specific toast
      if (toastId) {
        addToRemoveQueue(
          toastId,
          state.toasts.find((t) => t.id === toastId)?.duration,
        );
      } else {
        // Otherwise, remove all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, toast.duration);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if ((action as { toastId?: string }).toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter(
          (t) => t.id !== (action as { toastId?: string }).toastId,
        ),
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastArg = Omit<ToasterToast, "id">;

interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: Partial<Omit<ToasterToast, "id">>) => void;
}

function toast({ ...props }: ToastArg): ToastReturn {
  const id = genId();

  const update = (updateProps: Partial<Omit<ToasterToast, "id">>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updateProps, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };

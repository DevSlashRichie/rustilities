import { useEffect, useState } from "react";
import { EventHandler, type FactorySettings } from ".";

let globalHandler: EventHandler | null = null;

export function useEventSource(settings: FactorySettings, global = true) {
  const [eventHandler, setEventHandler] = useState<EventHandler>();

  useEffect(() => {
    if (global && !eventHandler) {
      globalHandler = EventHandler.create(settings);
      setEventHandler(globalHandler);
    } else if (!global) {
      setEventHandler(EventHandler.create(settings));
    }

    if (!global) {
      return () => {
        eventHandler?.close();
      };
    }
  }, []);

  return {
    eventHandler,
  };
}

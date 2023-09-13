interface Payload<T> {
  type: "connected" | string;
  message: T;
}

// eslint-disable-next-line no-unused-vars
export type EventConsumer<T> = (payload: T, ok: () => void) => void;

interface FactorySettings {
  url: string;
  auth?: AuthSettings;
}

interface AuthSettings {
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

export class EventHandler {
  private listeners: Map<
    string,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handlers: Array<EventConsumer<any>>;
      pattern: RegExp;
    }
  > = new Map();

  // We need this var since eventsource for some reason throws and error on start.
  private initialized: boolean;

  private connected: boolean;

  private readonly settings: FactorySettings;
  private authenticated = false;

  private _eventSource?: EventSource;
  private clientId?: string;

  constructor(settings: FactorySettings) {
    this.settings = settings;
    this.connected = false;
    this.initialized = false;
  }

  public get eventSource() {
    if (!this._eventSource) throw new Error("Event source not initialized");
    return this._eventSource;
  }

  public get requiresAuth() {
    return !!this.settings.auth;
  }

  public isAuth() {
    return this.authenticated;
  }

  private handleEvent(payload: Payload<{ id: string }>) {
    if (payload.type === "connected") this.handleConnected(payload.message);

    this.listeners.forEach(({ handlers, pattern }) => {
      let newList = handlers;

      if (pattern.exec(payload.type)) {
        handlers.forEach((exec) => {
          exec(payload.message, () => {
            newList = newList.filter((current) => current !== exec);
          });
        });

        this.listeners.set(pattern.toString(), {
          handlers: newList,
          pattern,
        });
      }
    });
  }

  private handleError(disconnected: boolean) {
    if (disconnected && this.connected) {
      this.connected = false;
      this.reconnect();
    }
  }

  private handleConnected(message: { id: string }) {
    this.clientId = message.id;
    console.info(`Client ${this.clientId} connected`);

    if (this.requiresAuth) this.authClient();

    this.connected = true;
    this.initialized = true;
  }

  private authing = false;
  private authClient() {
    if (
      this.clientId &&
      !this.isAuth() &&
      !this.authing &&
      this.settings.auth
    ) {
      this.authing = true;
      const auth = this.settings.auth;

      fetch(auth.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(auth.headers || {}),
        },
        body: JSON.stringify({
          id: this.clientId,
          ...(auth.body || {}),
        }),
      })
        .then(() => {
          console.info("Client Authenticated");
          this.authenticated = true;
          this.authing = false;
        })
        .catch((err) => {
          console.error("Error authenticating client", err);
          this.authing = false;
        });
    }
  }

  on<T>(event: RegExp, handler: EventConsumer<T>) {
    const key = event.toString();

    let listeners = this.listeners.get(key);

    if (!listeners)
      listeners = {
        handlers: [handler],
        pattern: event,
      };
    else listeners.handlers.push(handler);

    this.listeners.set(key, listeners);
    return {
      off: () => {
        if (listeners)
          this.listeners.set(key, {
            handlers: listeners.handlers.filter(
              (current) => current !== handler
            ),
            pattern: event,
          });
      },
    };
  }

  off(event: RegExp, handler: EventConsumer<unknown>) {
    const key = event.toString();

    const listeners = this.listeners.get(key);
    if (listeners) {
      this.listeners.set(key, {
        handlers: listeners.handlers.filter((current) => current !== handler),
        pattern: event,
      });

      if (listeners.handlers.length === 0) this.listeners.delete(key);
    }
  }

  private reconnect() {
    if (this._eventSource && !this.connected && this.initialized) {
      this._eventSource.close();
      this.connect(this._eventSource.url);
      console.info("Reconnecting Client...");

      const timeout = setTimeout(() => {
        if (this.connected) clearTimeout(timeout);
        else {
          console.info("No connection after 5 seconds, retrying...");
          this.reconnect();
        }
      }, 5000);
    }
  }

  private connect(url: string) {
    if (this.connected) return;

    this._eventSource = new EventSource(url);

    this._eventSource.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.handleEvent(data);
    };

    this._eventSource.onerror = () => {
      const state = this.eventSource.readyState;
      this.handleError(state === EventSource.CLOSED);
    };

    // We disconnect the event source when the client is closed
  }

  private static _eventHandler: EventHandler;

  public static create(settings: FactorySettings | string): EventHandler {
    const _settings =
      typeof settings === "string"
        ? ({
            url: settings,
          } as FactorySettings)
        : settings;

    const requiresAuth = !!_settings.url;

    if (EventHandler._eventHandler) {
      const isAuth = EventHandler._eventHandler.isAuth();
      if (!isAuth && requiresAuth) EventHandler._eventHandler.authClient();
      return EventHandler._eventHandler;
    }

    EventHandler._eventHandler = EventHandler.createClient(_settings);
    return EventHandler._eventHandler;
  }

  private static createClient(settings: FactorySettings) {
    const eventHandler = new EventHandler(settings);
    eventHandler.connect(settings.url);

    return eventHandler;
  }
}

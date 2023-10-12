import { useEventSource  } from "../src";

import '@testing-library/jest-dom'
import { render } from "@testing-library/react";
import React from "react";

describe.skip("useEventSource", () => {
    
    it("should use the same event source", async () => {
        let ev1;
        let ev2;

        function Page() {
            const { eventHandler  } = useEventSource({
                url: "http://localhost:3000",
            });

            ev1 = eventHandler;

            return (<div>test</div>);
        }

        function Page2() {
            const { eventHandler  } = useEventSource({
                url: "http://localhost:3000",
            });

            ev2 = eventHandler;

            return (<div>test</div>);
        }

        function Main() {
            return (
                <div>
                    <Page />
                    <Page2 />
                </div>
            );
        }

        render(<Main />);

        expect(ev1).toBe(ev2);
    });
});

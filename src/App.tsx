import { LensApp } from "@adk/lens-react";
import { IntlProvider } from "@adk/intl-provider";

function App() {
  return (
    <IntlProvider locale="en">
      <LensApp />
    </IntlProvider>
  );
}

export default App;

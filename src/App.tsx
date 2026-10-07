import { lazy, Suspense } from "react";
import SiteLoader from "./components/Loader/SiteLoader";

// The page is its own chunk: the loader's cup starts pouring straight away
// and fetches it in the meantime, so the page opens without a second wait.
const loadPage = () => import("./pages");
const Page = lazy(loadPage);
const PAGE_CHUNKS = [loadPage];

function App() {
  return (
    <SiteLoader preload={PAGE_CHUNKS}>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </SiteLoader>
  );
}

export default App;

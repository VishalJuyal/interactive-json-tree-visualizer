import { ThemeToggle } from "./components/ThemeToggle";
import { JsonTreeVisualizer } from "./components/JsonTreeVisualizer";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>
      <JsonTreeVisualizer />
    </div>
  );
}

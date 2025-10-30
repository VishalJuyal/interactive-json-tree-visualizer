import { ThemeToggle } from "./components/ThemeToggle";
import { JsonTreeVisualizer } from "./components/JsonTreeVisualizer";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </div>
      <JsonTreeVisualizer />
    </div>
  );
}


import { useEffect, useState } from "react";

export function HomepagePlaceholder() {
  const [motd, setMotd] = useState('');

  useEffect(() => {
    fetch('/api/motd')
      .then(res => res.json())
      .then(data => setMotd(data.message));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">Message of the Day</h1>
      <p className="mt-4 text-lg">{motd}</p>
    </div>
  );
}

import { CloudBackground } from "@/components/ui/CloudBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col flex-1 min-h-full bg-primary/30">
      <CloudBackground />
      {/* 
        The main content must be relative with a higher z-index 
        to ensure it sits above the fixed background clouds.
      */}
      <div className="relative z-10 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}

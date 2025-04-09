import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export default function MermaidDiagram({
  code,
  className = "",
}: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize mermaid once when component mounts
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "sans-serif",
        logLevel: 5, // Increase logging to debug issues
        errorLabelColor: "#ff5722",
        deterministicIds: true,
        flowchart: {
          htmlLabels: true,
          curve: "linear",
          useMaxWidth: false,
        },
      });
      console.log("Mermaid initialized successfully");
    } catch (error) {
      console.error("Error initializing Mermaid:", error);
    }
  }, []);

  // Render diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) return;

      setIsLoading(true);
      setError(null);

      try {
        // Clean the code by removing markdown code blocks if present
        let cleanCode = code
          .replace(/```mermaid\n/g, "")
          .replace(/```/g, "")
          .trim();

        console.log("Original code:", cleanCode);

        // Fix common syntax errors
        cleanCode = cleanCode
          // Remove semicolons after graph declarations
          .replace(/graph\s+[A-Z]{2};/g, (match) => match.replace(";", ""))
          .replace(/flowchart\s+[A-Z]{2};/g, (match) => match.replace(";", ""))
          // Ensure proper spacing in node connections
          .replace(/([A-Za-z0-9_-]+)-->([A-Za-z0-9_-]+)/g, "$1 --> $2")
          .replace(
            /([A-Za-z0-9_-]+)--\|([^|]+)\|([A-Za-z0-9_-]+)/g,
            "$1 --|$2|--> $3",
          )
          // Fix missing brackets in node definitions
          .replace(/([A-Za-z0-9_-]+)\["([^"]+)"\]/g, '$1["$2"]')
          // Ensure proper line breaks
          .replace(/\\n/g, "\n")
          // Fix ampersand connections
          .replace(/([A-Za-z0-9_-]+)\s*&\s*([A-Za-z0-9_-]+)/g, "$1 & $2");

        // Ensure the code starts with a valid diagram type
        if (
          !cleanCode.startsWith("graph ") &&
          !cleanCode.startsWith("flowchart ") &&
          !cleanCode.startsWith("sequenceDiagram") &&
          !cleanCode.startsWith("classDiagram") &&
          !cleanCode.startsWith("pie ")
        ) {
          // Default to a graph TD if no valid diagram type is detected
          cleanCode = "graph TD\n" + cleanCode;
        }

        // Convert flowchart to graph if needed
        if (cleanCode.startsWith("flowchart ")) {
          cleanCode = cleanCode.replace("flowchart ", "graph ");
        }

        console.log("Cleaned code:", cleanCode);

        // Generate a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

        // Create a container element
        const container = document.createElement("div");
        container.id = id;
        container.style.display = "none";
        document.body.appendChild(container);

        try {
          // Try with basic diagram first
          const basicDiagram = `graph TD\n    A[Start] --> B[End]`;
          await mermaid.render(`test-${id}`, basicDiagram);
          document.body.removeChild(
            document.getElementById(`test-${id}`) as Node,
          );

          // Now try the actual diagram
          const { svg } = await mermaid.render(id, cleanCode);
          setSvg(svg);
        } catch (renderErr) {
          console.error("Render error:", renderErr);

          // Try with a simpler version
          try {
            // Create a very basic working diagram
            const simpleCode = `graph TD\n    A[${cleanCode.includes("Water") ? "Water" : "Topic"}] --> B[Process]\n    B --> C[Result]`;

            console.log("Trying simple code:", simpleCode);
            const { svg } = await mermaid.render(id, simpleCode);
            setSvg(svg);

            setError(
              "Could not render the requested diagram. Showing a simplified version instead.",
            );
          } catch (simpleErr) {
            console.error("Simple diagram error:", simpleErr);
            throw renderErr;
          }
        } finally {
          // Clean up the container
          if (document.getElementById(id)) {
            document.body.removeChild(document.getElementById(id) as Node);
          }
        }
      } catch (err) {
        console.error("Error rendering Mermaid diagram:", err);

        // Try to extract more specific error message
        let errorMessage =
          "Failed to render diagram. The diagram code might be invalid.";
        if (err instanceof Error) {
          console.error("Error message:", err.message);
          if (err.message.includes("Syntax error")) {
            errorMessage = `Syntax error in diagram code. Please check for proper syntax.`;
          } else if (err.message.includes("Undefined")) {
            errorMessage = `Error: Diagram references undefined elements.`;
          }
        }

        setError(errorMessage);

        // Create a simple error diagram
        try {
          const errorDiagramCode = `graph TD\n    A[Error] --> B[Could Not Render]\n    B --> C[Please Try Again]`;

          const id = `mermaid-error-${Math.random().toString(36).substring(2, 11)}`;
          const container = document.createElement("div");
          container.id = id;
          container.style.display = "none";
          document.body.appendChild(container);

          const { svg } = await mermaid.render(id, errorDiagramCode);
          setSvg(svg);
          document.body.removeChild(container);
        } catch (fallbackErr) {
          // If even the error diagram fails, just show the error message
          console.error("Failed to render error diagram:", fallbackErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [code]);

  const downloadSvg = () => {
    if (!svg) return;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagram-${new Date().getTime()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md">
          <Loader2 className="h-8 w-8 text-[#0197cf] animate-spin" />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            Generating diagram...
          </span>
        </div>
      ) : error ? (
        <div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-md text-sm mb-4">
            {error}
          </div>
          {svg && (
            <div
              ref={containerRef}
              className="overflow-auto bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={containerRef}
            className="overflow-auto bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 bg-white dark:bg-gray-800 opacity-80 hover:opacity-100"
            onClick={downloadSvg}
          >
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      )}
    </div>
  );
}

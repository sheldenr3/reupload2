import { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  type: string;
}

interface SyllabusTreeProps {
  data: TreeNode[];
  onSelectTopic: (topic: TreeNode) => void;
  userGrade?: string;
}

export default function SyllabusTree({
  data,
  onSelectTopic,
  userGrade,
}: SyllabusTreeProps) {
  return (
    <div className="p-4 border rounded-md bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-[#0197cf] dark:text-[#01d2ff]">
        South African Curriculum
      </h2>
      <div className="space-y-1">
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelectTopic={onSelectTopic}
            level={0}
            userGrade={userGrade}
          />
        ))}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: TreeNode;
  onSelectTopic: (topic: TreeNode) => void;
  level: number;
  userGrade?: string;
}

function TreeNode({ node, onSelectTopic, level, userGrade }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelectTopic(node);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-2 px-3 rounded-md hover:bg-[#e6f7fc] dark:hover:bg-[#01729b]/30 cursor-pointer transition-colors",
          level > 0 && "ml-4",
          node.type === "file" &&
            "hover:bg-[#e6f7fc] dark:hover:bg-[#01729b]/30",
        )}
        onClick={handleSelect}
      >
        {node.type === "folder" && node.children && node.children.length > 0 ? (
          <span className="mr-1" onClick={handleToggle}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[#0197cf]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[#0197cf]" />
            )}
          </span>
        ) : (
          <span className="w-5" />
        )}
        {node.type === "folder" ? (
          <Folder className="h-4 w-4 mr-2 text-[#0197cf]" />
        ) : (
          <File className="h-4 w-4 mr-2 text-[#ff6600]" />
        )}
        <span className={node.type === "file" ? "font-medium" : ""}>
          {node.name}
        </span>
      </div>
      {isExpanded && node.children && (
        <div className="ml-2">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              onSelectTopic={onSelectTopic}
              level={level + 1}
              userGrade={userGrade}
            />
          ))}
        </div>
      )}
    </div>
  );
}

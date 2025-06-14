import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface EditTaskButtonProps {
  taskId: string;
}

export function EditTaskButton({ taskId }: EditTaskButtonProps) {
  return (
    <Link href={`/update/${taskId}`}>
      <Button size="icon" variant="outline" className="hover:text-primary">
        <Pencil size={16} />
      </Button>
    </Link>
  );
}

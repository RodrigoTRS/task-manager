import { Eye } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ViewDialogProps {
  task: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
  };
}

export function ViewDialog({
  task: { title, description, createdAt },
}: ViewDialogProps) {
  const localeStringDate = new Date(createdAt).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="hover:text-primary">
          <Eye size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4">
            <DialogTitle>{title}</DialogTitle>
            <span className="text-xs text-muted-foreground">
              {localeStringDate}
            </span>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteDialog } from "./delete-dialog";
import { EditTaskButton } from "./edit-task-button";
import { ViewDialog } from "./view-dialog";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const { id, title, description, createdAt } = task;

  const localeStringDate = new Date(createdAt).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const formattedDescription =
    description.length > 100 ? description.slice(0, 97) + "..." : description;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-xs">
          {localeStringDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[40px]">
        <p>{formattedDescription}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-start gap-2 mt-auto">
        <ViewDialog task={task} />
        <EditTaskButton taskId={id} />
        <DeleteDialog taskId={id} />
      </CardFooter>
    </Card>
  );
}

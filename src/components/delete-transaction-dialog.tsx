import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { deleteTransaction } from "@/actions/transactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteTransactionDialog = ({
  open,
  onOpenChange,
  _id,
  username,
}: {
  open: boolean;
  onOpenChange: () => void;
  _id: string;
  username: string;
}) => {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);

    const res = await deleteTransaction({ _id, username });

    if (res.success) onOpenChange();

    toast(res.message);

    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(530px,90vh)] max-w-[min(500px,90vw)] gap-4 space-y-0 overflow-auto rounded-md p-0">
        <DialogHeader className="gap-0 space-y-4 p-0">
          <div className="flex items-center gap-2 px-6 pt-6 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Remove This Transaction</DialogTitle>
          </div>
          <DialogDescription className="h-max px-6 text-left">
            Are you sure you want to delete this transaction? This action cannot
            be undone and will affect your:
          </DialogDescription>
          <div className="space-y-4 px-6 text-muted-foreground">
            <ul className="list-disc space-y-1 pl-4 text-left">
              <li>Total balance calculations</li>
              <li>Monthly expense reports</li>
              <li>Budget tracking statistics</li>
            </ul>
            <div className="space-y-4 rounded-md bg-muted/50 p-3 text-sm">
              <span className="block w-full text-left font-medium">
                Important Notes:
              </span>
              <ul className="list-disc space-y-1.5 pl-4 text-left">
                <li>
                  If this is a recurring transaction, and you want to stop it,
                  use the Edit Transaction option instead to modify or stop
                  future payments
                </li>
                <li>
                  You can always add a new transaction for any past date if
                  needed
                </li>
                <li>
                  All reports and calculations will automatically update to
                  reflect any changes
                </li>
              </ul>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sticky bottom-0 left-0 h-max w-full gap-4 border-t border-border bg-background px-6 py-4 sm:gap-0">
          <Button onClick={onOpenChange} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormErrorAlertProps {
  title?: string;
  messages: string[];
}

export function FormErrorAlert({
  title = 'Please review the following',
  messages,
}: FormErrorAlertProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {messages.length === 1 ? (
          <p>{messages[0]}</p>
        ) : (
          <ul className="list-disc pl-4">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}

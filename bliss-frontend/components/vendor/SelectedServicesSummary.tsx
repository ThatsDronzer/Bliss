import { Service } from '@/lib/types/vendor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelectedServicesSummaryProps {
  selectedServices: Service[];
  totalPrice: number;
  onProceedToBook: () => void;
}

export function SelectedServicesSummary({
  selectedServices,
  totalPrice,
  onProceedToBook,
}: SelectedServicesSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Selected Services</h3>
        {selectedServices.length === 0 ? (
          <p className="text-gray-500">No services selected</p>
        ) : (
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <span className="font-medium">₹{service.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 border-t">
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">₹{totalPrice.toLocaleString()}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={selectedServices.length === 0}
            onClick={onProceedToBook}
          >
            {selectedServices.length > 0
              ? `Proceed to Book - ₹${totalPrice.toLocaleString()}`
              : 'Select Services to Book'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 
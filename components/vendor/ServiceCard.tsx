import { Service } from '@/lib/types/vendor';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (service: Service) => void;
}

export function ServiceCard({ service, isSelected, onToggle }: ServiceCardProps) {
  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggle(service)}
              />
              <h3 className="text-lg font-semibold">{service.name}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">₹{service.price.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddOn {
  name: string;
  price: number;
  description: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  features: string[];
  add_ons: AddOn[];
}

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (
    serviceId: string,
    totalAmount: number,
    selectedAddOns: AddOn[],
  ) => void;
}

export function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onPurchase,
}: ServiceDetailModalProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  if (!service) return null;

  const isContactOnly = service.base_price === 0;
  const isConsulting = service.category.toLowerCase() === "consulting";
  const isRetainer = service.category.toLowerCase() === "retainer";

  const toggleAddOn = (index: number) => {
    const newSelected = new Set(selectedAddOns);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedAddOns(newSelected);
  };

  const calculateTotal = () => {
    let total = service.base_price;
    selectedAddOns.forEach((index) => {
      total += service.add_ons[index].price;
    });
    return total;
  };

  const handleContact = () => {
    onClose();
    navigate("/contact");
  };

  const handlePurchase = () => {
    const addOns = Array.from(selectedAddOns).map(
      (index) => service.add_ons[index],
    );
    onPurchase(service.id, calculateTotal(), addOns);
    setSelectedAddOns(new Set());
    onClose();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      website: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      software: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      learning: "bg-green-500/10 text-green-500 border-green-500/20",
      consulting: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      optimization: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    };
    return colors[category.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={getCategoryColor(service.category)}
            >
              {service.category}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{service.name}</DialogTitle>
          <DialogDescription className="text-base">
            {service.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-semibold mb-3 text-lg">What's Included</h3>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {service.add_ons && service.add_ons.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3 text-lg">Add-ons (Optional)</h3>
              <div className="space-y-4">
                {service.add_ons.map((addon, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => toggleAddOn(idx)}
                  >
                    <Checkbox
                      checked={selectedAddOns.has(idx)}
                      onCheckedChange={() => toggleAddOn(idx)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-primary font-semibold">
                          +${addon.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isContactOnly && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {isConsulting
                    ? `$${calculateTotal().toLocaleString()}/hr`
                    : isRetainer
                      ? `$${calculateTotal().toLocaleString()}/mo`
                      : `$${calculateTotal().toLocaleString()}`}
                </span>
              </div>
            </div>
          )}

          {isContactOnly && (
            <div className="border-t pt-6">
              <p className="text-muted-foreground text-center">
                Contact us for a custom quote tailored to your specific needs.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {isContactOnly ? (
            <Button onClick={handleContact}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          ) : (
            <Button onClick={handlePurchase}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isRetainer ? "Subscribe Now" : "Purchase Now"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
